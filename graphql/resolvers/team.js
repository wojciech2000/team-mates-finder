const User = require("../../models/User");
const Team = require("../../models/Team");
const {UserInputError} = require("apollo-server");

const checkAuth = require("../../utils/checkAuth");

const checkIfPositionsAreUnique = positions => {
  const positionsName = positions.map(position => position.position);
  const uniquePositionsName = Array.from(new Set(positionsName));

  if (uniquePositionsName.length < positionsName.length) {
    throw new UserInputError("Team error", {
      errors: {championEmpty: "Positions must be unique"},
    });
  } else {
    return true;
  }
};

const teamResolver = {
  Query: {
    getTeams: async () => {
      return await Team.find();
    },
    getTeam: async (_, {id}) => {
      return await Team.findById({_id: id});
    },
  },
  Mutation: {
    createTeam: async (_, {name, maxMembersAmount, positions}, context) => {
      const {id} = checkAuth(context);
      //team validation
      if (name.trim() === "" || maxMembersAmount == 0 || !positions[0]) {
        throw new UserInputError("Team error", {
          errors: {
            teamEmpty: "Fields can't be empty",
          },
        });
      } else if (maxMembersAmount <= 1) {
        throw new UserInputError("Team error", {
          errors: {
            teamMembersAmount: "Members amount must be at least 2",
          },
        });
      } else if (maxMembersAmount > 5) {
        throw new UserInputError("Team error", {
          errors: {
            teamTaken: "Max amount of members is 5",
          },
        });
      } else if (positions.length > maxMembersAmount) {
        throw new UserInputError("Team error", {
          errors: {
            teamTaken: "Members amount is lesser than provided positions",
          },
        });
      }

      checkIfPositionsAreUnique(positions);

      const user = await User.findById({_id: id});
      const findTeam = await Team.findOne({name});

      if (findTeam && findTeam.founder != user.nick) {
        throw new UserInputError("Team error", {
          errors: {
            teamTaken: "This team name is already taken",
          },
        });
      }

      //save team
      const membersAmount = positions.filter(position => position.nick && true).length;

      if (user.team) {
        //update team
        const teamExists = await Team.findById({_id: user.team});
        if (teamExists) {
          teamExists.name = name;
          teamExists.founder = user.nick;
          teamExists.membersAmount = membersAmount;
          teamExists.maxMembersAmount = maxMembersAmount;
          teamExists.positions = positions;

          teamExists.save();

          return teamExists;
        }
      } else {
        const team = new Team({
          name,
          founder: user.nick,
          membersAmount,
          maxMembersAmount,
          positions,
        });
        //set founder id
        team.positions[0].id = id;

        user.team = team._id;
        team.save();
        user.save();

        return team;
      }
    },
    updateName: async (_, {name}, context) => {
      const {id} = checkAuth(context);

      const user = await User.findById({_id: id});
      const team = await Team.findById({_id: user.team});
      const checkIfTeamExists = await Team.findOne({name});

      if (checkIfTeamExists && checkIfTeamExists.id != user.team) {
        throw new UserInputError("Team error", {
          errors: {
            teamEmpty: "This team name is already taken",
          },
        });
      }

      team.name = name;
      team.save();

      return team;
    },
    updatePositions: async (_, {positions}, context) => {
      const {id} = checkAuth(context);

      checkIfPositionsAreUnique(positions);

      const user = await User.findById({_id: id});
      const team = await Team.findOne({_id: user.team});

      //if user was kicked send message to them
      team.positions.forEach(async memberInDB => {
        const member = positions.find(updatedMember => memberInDB.nick === updatedMember.nick);

        if (!member) {
          const user = await User.findOne({nick: memberInDB.nick});

          if (user) {
            user.team = null;
            user.messages.unshift({
              read: false,
              message: `You were kicked out of the team "${team.name}"`,
              messageType: "message",
            });

            user.save();
          }
        }
      });

      //team modification

      let membersAmount = 0;
      positions.forEach(position => position.nick && membersAmount++);

      team.positions = positions;
      team.maxMembersAmount = positions.length;
      team.membersAmount = membersAmount;

      team.save();

      return team;
    },
    inviteToTeam: async (_, {id, position}, context) => {
      const {id: userId} = checkAuth(context);

      const user = await User.findById({_id: userId});
      const invitedUser = await User.findById({_id: id});
      const team = await Team.findById({_id: user.team});

      if (team.founder !== user.nick) {
        throw new UserInputError("Team error", {
          errors: {
            teamEmpty: "Only founder of the team can invite players",
          },
        });
      }

      if (invitedUser.team) {
        throw new UserInputError("Team error", {
          errors: {
            teamEmpty: "This user is already in the team",
          },
        });
      }

      //check if this position exists, is taken, someon is already invited
      const positionInTeam = team.positions.find(member => member.position === position);

      if (!positionInTeam) {
        throw new UserInputError("Team error", {
          errors: {
            teamEmpty: "Position wasn't found",
          },
        });
      }

      if (positionInTeam.nick) {
        throw new UserInputError("Team error", {
          errors: {
            teamEmpty: "This position is already taken",
          },
        });
      }

      if (positionInTeam.invited) {
        throw new UserInputError("Team error", {
          errors: {
            teamEmpty: "You have already invited someone on this position",
          },
        });
      }

      //set invited user on this position in the team
      positionInTeam.invited = invitedUser.nick;

      //send message to invited user
      invitedUser.messages.unshift({
        read: false,
        message: `You were invited to the team "${team.name}" on position ${position}`,
        messageType: "invite",
        position,
        addresseeId: user.id,
      });

      invitedUser.save();
      team.save();

      return team;
    },
    acceptInvitation: async (_, {messageId, addresseeId, position}, context) => {
      const {id} = checkAuth(context);

      const user = await User.findById({_id: id});
      const addressee = await User.findById({_id: addresseeId}).populate("team");
      const team = await Team.findById({_id: addressee.team._id});

      //remove invitation message from user messages DB
      const messagesWithRemovedInvitation = user.messages.filter(
        message => message._id != messageId && message,
      );

      user.messages = messagesWithRemovedInvitation;

      //if user already has a team, it happen when user got 2 or more invitations at the same time and accept one already
      if (user.team) {
        //remove status invite from team
        const invitedPosition = team.positions.find(posit => posit.position === position);
        invitedPosition.invited = null;

        //send message to founder who sent invitation
        const teamFounder = await User.findOne({nick: team.founder});

        teamFounder.messages.unshift({
          read: false,
          message: `${user.nick} rejected your invitation to the team`,
          messageType: "message",
        });

        team.save();
        teamFounder.save();
        user.save();

        throw new UserInputError("Team error", {
          errors: {teamError: "You already have a team"},
        });
      }

      //user doesn't have a team so can be added

      //user modification
      user.team = addressee.team;

      //addressee modification
      addressee.messages.unshift({
        read: false,
        message: `${user.nick} accepted your invitation to the team`,
        messageType: "message",
      });

      //team modification

      let invitedMember = team.positions.find(member => member.position == position);
      invitedMember.id = user.id;
      invitedMember.nick = user.nick;
      invitedMember.invited = null;

      team.membersAmount++;

      //save changes

      user.save();
      addressee.save();
      team.save();

      return user;
    },
    rejectInvitation: async (_, {messageId, addresseeId}, context) => {
      const {id} = checkAuth(context);

      const user = await User.findById({_id: id});
      const addressee = await User.findById({_id: addresseeId}).populate("team");
      const team = await Team.findById({_id: addressee.team._id});

      //user modification

      const messagesWithRemovedInvitation = user.messages.filter(
        message => message._id != messageId && message,
      );

      user.messages = messagesWithRemovedInvitation;

      //addressee modification

      addressee.messages.unshift({
        read: false,
        message: `${user.nick} rejected your invitation to the team`,
        messageType: "message",
      });

      //team modification

      let invitedPosition = team.positions.find(member => member.invited == user.nick);
      invitedPosition.nick = null;
      invitedPosition.invited = null;

      user.save();
      addressee.save();
      team.save();

      return user;
    },
    applyToTeam: async (_, {id, founder, position}, context) => {
      const {id: userId} = checkAuth(context);

      const user = await User.findById({_id: userId});
      const team = await Team.findById({_id: id});
      const founderUser = await User.findOne({nick: founder});

      //user validation

      if (user.team) {
        throw new UserInputError("Team error", {
          errors: {
            championEmpty: "You are already in the team",
          },
        });
      }

      //set team applications if this is first time

      if (
        user.teamApplications.find(
          ({team: teamApplication, position: positionApplication}) =>
            teamApplication === team.name && positionApplication === position && true,
        )
      ) {
        throw new UserInputError("Team error", {
          errors: {
            championEmpty: "You have already applied to this team on this position",
          },
        });
      }

      user.teamApplications.unshift({
        team: team.name,
        position,
      });

      //founder modification

      founderUser.messages.unshift({
        read: false,
        message: `${user.nick} wants to join to your team on position ${position}`,
        messageType: "invite",
        position,
        addresseeId: userId,
      });

      user.save();
      founderUser.save();

      return user;
    },
    acceptApplication: async (_, {messageId, addresseeId, position}, context) => {
      const {id} = checkAuth(context);

      const user = await User.findById({_id: id}).populate("team");
      const addressee = await User.findById({_id: addresseeId});
      const team = await Team.findById({_id: user.team._id});

      //user modification

      const messagesWithRemovedInvitation = user.messages.filter(
        message => message._id != messageId && message,
      );
      user.messages = messagesWithRemovedInvitation;

      user.save();

      //validation

      if (addressee.team) {
        throw new UserInputError("Team error", {
          errors: {teamError: "This user already has a team"},
        });
      }

      //addresse modification

      addressee.messages.unshift({
        read: false,
        message: `Your application to the team "${team.name}" on position ${position} was accepted`,
        messageType: "message",
      });

      addressee.teamApplications = [];
      addressee.team = team._id;

      //team modification

      team.membersAmount++;

      const appliedPosition = team.positions.find(
        ({position: memberPosition}) => memberPosition === position,
      );

      appliedPosition.id = addressee.id;
      appliedPosition.nick = addressee.nick;
      appliedPosition.invited = null;

      addressee.save();
      team.save();

      return user;
    },
    rejectApplication: async (_, {messageId, addresseeId, position}, context) => {
      const {id} = checkAuth(context);

      const user = await User.findById({_id: id}).populate("team");
      const addressee = await User.findById({_id: addresseeId});

      const team = await Team.findById({_id: user.team._id});

      //user modification
      const messagesWithRemovedInvitation = user.messages.filter(
        message => message._id != messageId && message,
      );
      user.messages = messagesWithRemovedInvitation;

      //addressee modification
      addressee.messages.unshift({
        read: false,
        message: `Your application to the team "${team.name}" on position ${position} was rejected`,
        messageType: "message",
      });

      const teamApplicationsWithoutApplyedTeam = addressee.teamApplications.filter(
        teamApplication =>
          teamApplication.team !== team.name &&
          teamApplication.position !== position &&
          teamApplication,
      );

      addressee.teamApplications = teamApplicationsWithoutApplyedTeam;

      user.save();
      addressee.save();

      return user;
    },
    deleteTeam: async (_, {id}, context) => {
      const {id: userId} = checkAuth(context);

      const user = await User.findById({_id: userId});
      let team = await Team.findById({_id: id});

      //user modification
      user.team = null;

      //members modification
      team.positions.forEach(async member => {
        if (member.nick !== user.nick) {
          const user = await User.findOne({nick: member.nick});

          user.messages.unshift({
            read: false,
            message: `Your team "${team.name}" was deleted`,
            messageType: "message",
          });

          user.team = null;
          user.save();
        }
      });

      user.save();
      team.deleteOne();

      return user;
    },
    leaveTeam: async (_, {id}, context) => {
      const {id: userId} = checkAuth(context);

      const user = await User.findById({_id: userId}).populate("team");
      const team = await Team.findById({_id: user.team._id});
      const founder = await User.findOne({nick: team.founder});

      //user modification
      user.team = null;

      //team modification
      const leavingPosition = team.positions.find(({nick}) => nick === user.nick);
      leavingPosition.nick = null;
      leavingPosition.id = null;

      team.membersAmount--;

      //founder modification
      founder.messages.unshift({
        read: false,
        message: `${user.nick} left your team`,
        messageType: "message",
      });

      user.save();
      team.save();
      founder.save();

      return user;
    },
  },
};

module.exports = teamResolver;

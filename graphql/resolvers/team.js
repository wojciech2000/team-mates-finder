const dotenv = require("dotenv").config();
const User = require("../../models/User");
const Team = require("../../models/Team");
const {UserInputError} = require("apollo-server");

const checkAuth = require("../../utils/checkAuth");
const {LoneSchemaDefinitionRule} = require("graphql");

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
      const membersAmount = positions.filter(position => position.nick && true)
        .length;

      if (user.team) {
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

      team.positions = positions;
      team.maxMembersAmount = positions.length;
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
      const positionInTeam = team.positions.find(
        member => member.position === position,
      );

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
        recipientId: user.id,
      });

      invitedUser.save();
      team.save();

      return team;
    },
    acceptInvitation: async (
      _,
      {messageId, recipientId, position},
      context,
    ) => {
      const {id} = checkAuth(context);

      const user = await User.findById({_id: id});
      const addressee = await User.findById({_id: recipientId}).populate(
        "team",
      );
      const team = await Team.findById({_id: addressee.team._id});

      //user modification

      const messagesWithRemovedInvitation = user.messages.filter(
        message => message._id != messageId && message,
      );

      user.messages = messagesWithRemovedInvitation;
      user.team = addressee.team;

      //addressee modification

      addressee.messages.unshift({
        read: false,
        message: `${user.nick} accepted your invitation to the team`,
        messageType: "message",
      });

      //team modification

      let filt = team.positions.find(member => member.position == position);
      filt.nick = user.nick;
      filt.invited = null;

      team.membersAmount++;

      //save changes

      user.save();
      addressee.save();
      team.save();

      return user;
    },
    rejectInvitation: async (_, {messageId, recipientId}, context) => {
      const {id} = checkAuth(context);

      const user = await User.findById({_id: id});
      const addressee = await User.findById({_id: recipientId}).populate(
        "team",
      );
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

      let filt = team.positions.find(member => member.invited == user.nick);
      filt.nick = null;
      filt.invited = null;

      user.save();
      addressee.save();
      team.save();

      return user;
    },
  },
};

module.exports = teamResolver;

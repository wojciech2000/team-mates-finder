const dotenv = require("dotenv").config();
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const {UserInputError} = require("apollo-server");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validators");
const checkAuth = require("../../utils/checkAuth");

const setServer = server => {
  const dataServer = {};
  dataServer.serverName = server;

  switch (server) {
    case "BR":
      dataServer.serverCode = "br1";
      break;
    case "EUNE":
      dataServer.serverCode = "eun1";
      break;
    case "EUW":
      dataServer.serverCode = "euw1";
      break;
    case "LAN":
      dataServer.serverCode = "la1";
      break;
    case "LAS":
      dataServer.serverCode = "la2";
      break;
    case "NA":
      dataServer.serverCode = "na1";
      break;
    case "OCE":
      dataServer.serverCode = "oc1";
      break;
    case "RU":
      dataServer.serverCode = "ru";
      break;
    case "TR":
      dataServer.serverCode = "tr1";
      break;
    case "JP":
      dataServer.serverCode = "jp1";
      break;
    case "KR":
      dataServer.serverCode = "kr";
      break;

    default:
      break;
  }

  return dataServer;
};

const userResolver = {
  Query: {
    login: async (_, {login, password}) => {
      //Login validation
      const {errors, valid} = validateLoginInput(login, password);

      if (!valid) {
        throw new UserInputError("Login validation error", {errors});
      }

      //Find user
      const user = await User.findOne({login});

      if (!user) {
        //Check if login is correct
        errors.general = "User not found";
        throw new UserInputError("User not found", {errors});
      } else {
        //Check if password is correct
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          errors.general = "Wrong credentials";
          throw new UserInputError("Wrong credentials", {errors});
        }

        //Return token
        const token = jwt.sign(
          {
            id: user.id,
            login: user.login,
            email: user.email,
            server: user.server,
            nick: user.nick,
            position: user.position,
          },
          process.env.SECRET_JWT,
          {expiresIn: "1h"},
        );

        return {token};
      }
    },
  },
  Mutation: {
    register: async (
      _,
      {registerInput: {login, email, password, confirmPassword, server}},
    ) => {
      //Register validation
      const {errors, valid} = validateRegisterInput(
        login,
        email,
        password,
        confirmPassword,
        server,
      );

      if (!valid) {
        throw new UserInputError("Register validation error", {errors});
      }

      //Check if user is unique
      const userLogin = await User.findOne({login});
      if (userLogin) {
        throw new UserInputError("Username is taken", {
          errors: {username: "This username is taken"},
        });
      }

      //check if emial is unique
      const userEmail = await User.findOne({email});
      if (userEmail) {
        throw new UserInputError("Email is taken", {
          errors: {username: "This email is taken"},
        });
      }

      //Register user
      const dataServer = setServer(server);
      password = await bcrypt.hash(password, 10);
      const newUser = new User({login, email, password, server: dataServer});
      await newUser.save();

      return {login, email, password, server: dataServer};
    },
    updateNick: async (_, {nick}, context) => {
      const {id, login, server} = checkAuth(context);

      //Nick validation
      if (nick.trim() === "") {
        throw new UserInputError("Nick error", {
          errors: {nickEmpty: "Nick cannot be empty"},
        });
      }

      try {
        await axios.get(
          `https://${server.serverCode}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${nick}?api_key=${process.env.SECRET_RIOT_KEY}`,
        );
      } catch (error) {
        throw new UserInputError("Nick error", {
          errors: {nickNotFound: "Nick wasn't found in database"},
        });
      }

      const findUser = await User.findOne({nick});

      if (findUser && findUser.login === login) {
        throw new UserInputError("Nick error", {
          errors: {nickTheSame: "Nick can't be the same as the old one"},
        });
      } else if (findUser && findUser.server.serverName === server.serverName) {
        throw new UserInputError("Nick error", {
          errors: {nickTaken: "Nick is already taken"},
        });
      }

      //Update new nick
      const user = await User.findById({_id: id});
      user.nick = nick;
      user.save();

      return user;
    },
    updateServer: async (_, {server}, context) => {
      const {id} = checkAuth(context);

      //Server validation
      if (server.trim() === "") {
        throw new UserInputError("Server error", {
          errors: {nickTaken: "Server cannot be empty"},
        });
      }

      //Update new server
      const user = await User.findById({_id: id});

      const dataServer = setServer(server);
      user.server.serverName = dataServer.serverName;
      user.server.serverCode = dataServer.serverCode;

      user.save();

      return user;
    },
    updatePosition: async (_, {primary, secondary}, context) => {
      const {id} = checkAuth(context);

      if (primary === secondary) {
        throw new UserInputError("Position error", {
          errors: {positionsTheSame: "Positions can't be the same"},
        });
      }

      const user = await User.findById({_id: id});

      user.position.primary = primary;
      user.position.secondary = secondary;

      user.save();

      return user;
    },
    updateMainChampions: async (_, {champions}, context) => {
      const {id} = checkAuth(context);
      const user = await User.findById({_id: id});

      //Champions validations
      if (champions.length > 2 && !user.position.secondary) {
        throw new UserInputError("Champion's name error", {
          errors: {
            championEmpty:
              "You can type max 2 champions if you dont have secondary position",
          },
        });
      } else if (champions.length > 4 && user.position.secondary) {
        throw new UserInputError("Champion's name error", {
          errors: {championEmpty: "You can type max 4"},
        });
      }

      champions.find(champion => {
        if (champion.trim() === "") {
          throw new UserInputError("Champion's name error", {
            errors: {championEmpty: "Champion's name can't be empty"},
          });
        }
      });

      //Check if champions exist in database
      const championsAPI = await axios.get(
        `http://ddragon.leagueoflegends.com/cdn/10.24.1/data/en_US/champion.json?api_key=${process.env.SECRET_RIOT_KEY}`,
      );
      const championsNames = await Object.keys(championsAPI.data.data);
      let matchChampions = [];

      for (let i = 0; i < championsNames.length; i++) {
        for (let j = 0; j < champions.length; j++) {
          if (
            championsNames[i].toLocaleLowerCase() ===
            champions[j].toLocaleLowerCase()
          ) {
            matchChampions.push(championsNames[i]);
          }
        }
      }

      const unMatchChampions = champions.filter(
        champ =>
          !matchChampions.includes(
            champ.charAt(0).toUpperCase() + champ.slice(1).toLowerCase(),
          ) && champ,
      );

      if (unMatchChampions.length > 0) {
        throw new UserInputError("Champion's name error", {
          errors: {
            championEmpty: `Champion's name wan't found in database: ${unMatchChampions}`,
          },
        });
      }

      //Save champions
      user.mainChampions = matchChampions;
      user.save();

      return user;
    },
    updateTeam: async (_, { name, maxMembersAmount, positions }, context) => {
      const { id } = checkAuth(context);
      
      //team validation
      if(name.trim() === "" || maxMembersAmount == 0 || (!positions[0]))
      {
        throw new UserInputError("Team error", {
          errors: {
            teamEmpty:
              "Fields can't be empty",
          },
        });
      } else if (maxMembersAmount <= 1)
      {
        throw new UserInputError("Team error", {
          errors: {
            teamMembersAmount:
              "Members amount must be at least 2",
          },
        });  
      } else if (maxMembersAmount > 5)
      {
        throw new UserInputError("Team error", {
          errors: {
            teamTaken:
              "Max amount of members is 5",
          },
        });
      } else if (positions.length > maxMembersAmount) {
        throw new UserInputError("Team error", {
          errors: {
            teamTaken:
              "Members amount is lesser than provided positions",
          },
        });
      }

      const user = await User.findById({ _id: id });
      const findTeam = await User.findOne({"team.name": name})

      if (findTeam && findTeam.nick != user.nick)
      {
        throw new UserInputError("Team error", {
          errors: {
            teamTaken:
              "This team name is already taken",
          },
        });
        }

      //save team
      const membersAmount = positions.filter(position => position.nick && true).length
      
      user.team = { name, founder: user.nick,membersAmount, maxMembersAmount, positions }
      user.save()

      return user
    }
  },
};

module.exports = userResolver;
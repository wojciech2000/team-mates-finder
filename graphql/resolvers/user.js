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

  //server hotkey in riot api
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
    getUsers: async () => {
      return await User.find().populate("team");
    },
    getUser: async (_, {id}) => {
      return await User.findById({_id: id}).populate("team");
    },
  },
  Mutation: {
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

        return {token, login: user.login, id: user.id, nick: user.nick};
      }
    },
    register: async (
      _,
      {
        registerInput: {
          login,
          email,
          password,
          confirmPassword,
          server,
          nick,
          position,
        },
      },
    ) => {
      //Register validation
      const {errors, valid} = validateRegisterInput(
        login,
        email,
        password,
        confirmPassword,
      );

      if (!valid) {
        throw new UserInputError("Register validation error", {errors});
      }

      //Check if user is unique
      const userLogin = await User.findOne({login});
      if (userLogin) {
        throw new UserInputError("Username error", {
          errors: {username: "This username is taken"},
        });
      }

      //check if emial is unique
      const userEmail = await User.findOne({email});
      if (userEmail) {
        throw new UserInputError("Email error", {
          errors: {username: "This email is taken"},
        });
      }

      //check if nick is unique
      const dataServer = setServer(server);
      let dbNick;

      try {
        dbNick = await axios.get(
          `https://${dataServer.serverCode}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${nick}?api_key=${process.env.SECRET_RIOT_KEY}`,
        );
      } catch (error) {
        throw new UserInputError("Nick error", {
          errors: {nickNotFound: "Nick wasn't found in database"},
        });
      }

      const userNick = await User.findOne({
        nick: dbNick.data.name,
      });

      if (userNick && userNick.server.serverName === server) {
        throw new UserInputError("Nick error", {
          errors: {username: "This nick is taken"},
        });
      }

      //check if positions aren't the same
      if (position.primary === position.secondary) {
        throw new UserInputError("Position error", {
          errors: {username: "Positions can't be the same"},
        });
      }

      //Register user
      password = await bcrypt.hash(password, 10);

      const newUser = await new User({
        login,
        email,
        password,
        server: dataServer,
        nick: dbNick.data.name,
        position,
      });

      await newUser.save();

      return newUser;
    },
    updateNick: async (_, {nick}, context) => {
      const {id} = checkAuth(context);
      let dbNick;

      const user = await User.findById({_id: id});

      //Nick validation
      if (nick.trim() === "") {
        throw new UserInputError("Nick error", {
          errors: {nickEmpty: "Nick cannot be empty"},
        });
      }

      try {
        dbNick = await axios.get(
          `https://${user.server.serverCode}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${nick}?api_key=${process.env.SECRET_RIOT_KEY}`,
        );
      } catch (error) {
        throw new UserInputError("Nick error", {
          errors: {nickNotFound: "Nick wasn't found in database"},
        });
      }

      const findUser = await User.findOne({nick: dbNick.data.name});

      if (
        findUser &&
        findUser.server.serverName === user.server.serverName &&
        findUser.id != user.id
      ) {
        throw new UserInputError("Nick error", {
          errors: {nickTaken: "Nick is already taken"},
        });
      }

      //Update new nick
      user.nick = dbNick.data.name;
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

      const user = await User.findById({_id: id});

      //check if user's nick is in this server
      const dataServer = setServer(server);

      try {
        await axios.get(
          `https://${dataServer.serverCode}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${user.nick}?api_key=${process.env.SECRET_RIOT_KEY}`,
        );
      } catch (error) {
        throw new UserInputError("Nick error", {
          errors: {
            nickNotFound: `Nick wasn't found in server: ${dataServer.serverName}`,
          },
        });
      }

      //Update new server
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

      const uniqueChampions = Array.from(new Set(champions));

      //Champions validations
      if (champions.length > 4 && user.position.secondary) {
        throw new UserInputError("Champion's name error", {
          errors: {championEmpty: "You can type max 4"},
        });
      }

      console.log(uniqueChampions, champions);

      if (uniqueChampions.length < champions.length) {
        throw new UserInputError("Champion's name error", {
          errors: {championEmpty: "Champions name must be unique"},
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
            championEmpty: `Champion's name didn't found in database: ${unMatchChampions}`,
          },
        });
      }

      //Save champions
      user.mainChampions = matchChampions;
      user.save();

      return user;
    },
  },
};

module.exports = userResolver;

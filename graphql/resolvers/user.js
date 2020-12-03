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

      return {primary, secondary};
    },
  },
};

module.exports = userResolver;

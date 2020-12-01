const dotenv = require("dotenv").config();
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const {UserInputError} = require("apollo-server");
const jwt = require("jsonwebtoken");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validators");

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
      {registerInput: {login, email, password, confirmPassword}},
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
      const user = await User.findOne({login});
      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {username: "This username is taken"},
        });
      }

      //Register user
      password = await bcrypt.hash(password, 10);
      const newUser = new User({login, email, password});
      await newUser.save();

      return {login, email, password};
    },
  },
};

module.exports = userResolver;

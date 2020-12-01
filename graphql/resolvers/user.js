const User = require("../../models/User");
const bcrypt = require("bcrypt");
const {UserInputError} = require("apollo-server");

const {validateRegisterInput} = require("../../utils/validators");

const userResolver = {
  Query: {
    getUsers: () => {
      const users = User.find();
      return users;
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

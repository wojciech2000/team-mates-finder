const dotenv = require("dotenv").config();
const {AuthenticationError} = require("apollo-server");
const jwt = require("jsonwebtoken");

const checkAuth = context => {
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    try {
      const user = jwt.verify(authHeader, process.env.SECRET_JWT);
      return user;
    } catch (error) {
      throw new AuthenticationError("Invalid/Expired token");
    }
  }
  throw new AuthenticationError("Authentication header must be provided");
};

module.exports = checkAuth;

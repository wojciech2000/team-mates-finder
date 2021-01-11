const dotenv = require("dotenv").config();
const {ApolloServer} = require("apollo-server");
const mongoose = require("mongoose");
const path = require("path");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/index");

const PORT = process.env.PORT || 5000;
const DB = process.env.MONGO_DB || process.env.MONGO_URL;

mongoose.connect(DB, {useNewUrlParser: true, useUnifiedTopology: true}, () =>
  console.log("connected with db"),
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => ({req}),
});

server.listen(PORT, () => console.log("server is running"));

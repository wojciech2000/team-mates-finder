const dotenv = require("dotenv").config();
const {ApolloServer} = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/index");

mongoose.connect(
  process.env.MONGO_URL,
  {useNewUrlParser: true, useUnifiedTopology: true},
  () => console.log("connected with db"),
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => ({req}),
});

server.listen(5000, () => console.log("server is running"));

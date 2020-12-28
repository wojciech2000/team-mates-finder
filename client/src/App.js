import React from "react";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import {setContext} from "apollo-link-context";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import Header from "./components/Header/Header";
import Players from "./components/Players/Players";
import Player from "./components/Player/Player";
import Teams from "./components/Teams/Teams";
import Team from "./components/Team/Team";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import UserProfile from "./components/UserProfile/UserProfile";
import UserHome from "./components/UserHome/UserHome";
import CreateTeam from "./components/CreateTeam/CreateTeam";
import EditTeam from "./components/EditTeam/EditTeam";

import AuthRoute from "./context/AuthRoute";
import {AuthProvider} from "./context/auth";

const httpLink = new createHttpLink({
  uri: "http://localhost:5000",
});

const authLink = setContext(() => {
  const token = localStorage.getItem("jwtToken");
  return {
    headers: {
      authorization: token ? token : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <div className="App">
          <Router>
            <Header />
            <Switch>
              <Route path="/players" component={Players} />
              <Route path="/player/:id" component={Player} />
              <Route path="/teams" component={Teams} />
              <Route path="/team/:id" component={Team} />
              <AuthRoute path="/login" component={Login} />
              <AuthRoute path="/register" component={Register} />
              <Route path="/user/:id" component={UserProfile} />
              <Route path="/home" component={UserHome} />
              <Route path="/create-team" component={CreateTeam} />
              <Route path="/edit-team/:id" component={EditTeam} />
            </Switch>
          </Router>
        </div>
      </AuthProvider>
    </ApolloProvider>
  );
}

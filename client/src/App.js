import React from "react";
import {ApolloClient, ApolloProvider, InMemoryCache, createHttpLink} from "@apollo/client";
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
import {AuthProvider} from "./context/authContext";
import {InfoProvider} from "./context/infoContext";
import InfoModel from "./components/InfoModel/InfoModel";

const httpLink = new createHttpLink({
  uri: "http://localhost:5000/",
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
  cache: new InMemoryCache({addTypename: false}),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <InfoProvider>
          <div className="App">
            <Router>
              <Header />
              <InfoModel />
              <Switch>
                <Route path="/players" component={Players} />
                <Route path="/player/:nick" component={Player} />
                <Route path="/teams" component={Teams} />
                <Route path="/team/:name" component={Team} />
                <AuthRoute path="/login" component={Login} />
                <AuthRoute path="/register" component={Register} />
                <Route path="/user/:nick" component={UserProfile} />
                <Route path="/home" component={UserHome} />
                <Route path="/create-team" component={CreateTeam} />
                <Route path="/edit-team/:name" component={EditTeam} />
              </Switch>
            </Router>
          </div>
        </InfoProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

import React from "react";
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import Header from "./components/Header/Header";
import Players from "./components/Players/Players";
import Player from "./components/Player/Player";
import Teams from "./components/Teams/Teams";
import Team from "./components/Team/Team";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";

const client = new ApolloClient({
  uri: "http://localhost:5000",
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Router>
          <Header />
          <Switch>
            <Route path="/players" component={Players} />
            <Route path="/player/:id" component={Player} />
            <Route path="/teams" component={Teams} />
            <Route path="/team/:id" component={Team} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
          </Switch>
        </Router>
      </div>
    </ApolloProvider>
  );
}

import React from "react";
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import Header from "./components/Header/Header";
import Players from "./components/Players/Players";
import Teams from "./components/Teams/Teams";

const client = new ApolloClient({
  uri: "http://localhost:5000/",
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Header />
        <Router>
          <Switch>
            <Route path="/players" exact component={Players} />
            <Route path="/teams" exact component={Teams} />
          </Switch>
        </Router>
      </div>
    </ApolloProvider>
  );
}

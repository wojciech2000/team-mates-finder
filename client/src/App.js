import React from "react";
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";

import Header from "./components/Header/Header";
import Players from "./components/Players/Players";

const client = new ApolloClient({
  uri: "http://localhost:5000/",
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Header />
        <Players />
      </div>
    </ApolloProvider>
  );
}

import React, {useContext} from "react";
import {Route, Redirect} from "react-router-dom";

import {AuthContext} from "./authContext";

export default function Authroute({component: Component, ...rest}) {
  const {user} = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={props => (user ? <Redirect to="/players" /> : <Component {...props} />)}
    />
  );
}

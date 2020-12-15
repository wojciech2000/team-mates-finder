import React, {useReducer, createContext} from "react";
import jwtDecode from "jwt-decode";

const initialState = {
  user: null,
};

if (localStorage.getItem("jwtToken")) {
  const decodedToken = jwtDecode(localStorage.getItem("jwtToken"));
  if (decodedToken) {
    initialState.user = decodedToken.login;
  }
}

const AuthContext = createContext({
  user: null,
  login: data => {},
  logout: () => {},
});

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };

    default:
      return state;
  }
};

const AuthProvider = props => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = data => {
    dispatch({type: "LOGIN", payload: data});
  };

  const logout = () => {
    localStorage.clear("jwtToken");
    dispatch({type: "LOGOUT"});
  };

  return (
    <AuthContext.Provider
      value={{user: state.user, login, logout}}
      {...props}
    />
  );
};

export {AuthContext, AuthProvider};

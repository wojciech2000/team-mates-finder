import React, {useReducer, createContext} from "react";
import jwtDecode from "jwt-decode";

const initialState = {
  user: null,
  id: null,
};

if (localStorage.getItem("jwtToken")) {
  const decodedToken = jwtDecode(localStorage.getItem("jwtToken"));
  if (decodedToken) {
    initialState.user = decodedToken.login;
    initialState.id = decodedToken.id;
  }
}

const AuthContext = createContext({
  user: null,
  id: null,
  login: data => {},
  logout: () => {},
});

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload.login,
        id: action.payload.id,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        id: null,
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
      value={{user: state.user, id: state.id, login, logout}}
      {...props}
    />
  );
};

export {AuthContext, AuthProvider};

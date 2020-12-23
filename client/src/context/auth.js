import React, {useReducer, createContext} from "react";
import jwtDecode from "jwt-decode";

const initialState = {
  user: null,
  nick: null,
  id: null,
};

if (localStorage.getItem("jwtToken")) {
  const decodedToken = jwtDecode(localStorage.getItem("jwtToken"));
  if (decodedToken) {
    initialState.user = decodedToken.login;
    initialState.id = decodedToken.id;
    initialState.nick = localStorage.getItem("nick")
      ? localStorage.getItem("nick")
      : decodedToken.nick;
  }
}

const AuthContext = createContext({
  user: null,
  id: null,
  login: data => {},
  logout: () => {},
  updateNick: newNick => {},
});

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload.login,
        id: action.payload.id,
        nick: action.payload.nick,
      };
    case "UPDATE_NICK":
      return {
        ...state,
        nick: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        nick: null,
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

  const updateNick = newNick => {
    localStorage.setItem("nick", newNick);
    dispatch({type: "UPDATE_NICK", payload: newNick});
  };

  const logout = () => {
    localStorage.clear("jwtToken");
    dispatch({type: "LOGOUT"});
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        id: state.id,
        nick: state.nick,
        login,
        updateNick,
        logout,
      }}
      {...props}
    />
  );
};

export {AuthContext, AuthProvider};

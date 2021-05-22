import React, { useReducer } from "react";
import jwtDecode from "jwt-decode";

import authReducer from "../reducer/authReducer";
import AuthContext from "./AuthContext";
let initialState = { user: null };
if (localStorage.getItem("jwtToken")) {
  const decodedToken = jwtDecode(localStorage.getItem("jwtToken"));
  console.log(decodedToken, "decoded token from auth provider");
  //decodedToken is in seconds while Date.now() is in milliseconds
  if (decodedToken.exp * 1000 < Date.now()) {
    //it has expired
    localStorage.removeItem("jwtToken");
  } else {
    initialState.user = decodedToken;
  }
}

const AuthProvider = (props) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  console.log(state, "state from auth");
  const login = (userData) => {
    localStorage.setItem("jwtToken", userData.token);
    dispatch({
      type: "LOGIN",
      payload: userData,
    });
  };
  const logout = () => {
    localStorage.removeItem("jwtToken");
    dispatch({
      type: "LOGOUT",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        login,
        logout,
      }}
      {...props}
    />
  );
};

export default AuthProvider;

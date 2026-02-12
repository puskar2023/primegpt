import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import axios from "axios";
const UnauthWrapper = (props) => {
  const [isAuth, setIsAuth] = useState(null);
  axios
    .get("https://primegpt-ls30.onrender.com/api/auth/user", { withCredentials: true })
    .then((response) => {
      setIsAuth(response.data.user ? true : false);
    })
    .catch((error) => {
      setIsAuth(false);
      console.error("Error fetching user data:", error);
    });

  if (isAuth === null) {
    return <div>Loading...</div>;
  }

  // Not logged in
  if (isAuth) {
    return <Navigate to="/" />;
  }

  // Logged in
  return props.children;
};

export default UnauthWrapper;

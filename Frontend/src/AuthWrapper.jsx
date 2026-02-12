import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import axios from "axios";
const AuthWrapper = (props) => {
  const [isAuth, setIsAuth] = useState(null);
  axios
    .get("http://localhost:3000/api/auth/user", { withCredentials: true })
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
  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  // Logged in
  return props.children;
};

export default AuthWrapper;

//   const user = useSelector((state) => state.users.user);
//   if(user === null){
//     return <div>Loading...</div>;
//   }
//   if(!user){
//     return <Navigate to='/login' />
//   }
//   return user? props.children : <Navigate to='/login' />

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadUser } from "../store/userSlice";
import { loadChats } from "../store/chatSlice";
import axios from "axios";
import "../styles/auth.css";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: wire up register

    console.log({ firstName, lastName, email, password });

    await axios
      .post(
        "https://primegpt-ls30.onrender.com/api/auth/register",
        {
          email: email,
          fullName: {
            firstName: firstName,
            lastName: lastName,
          },
          password: password,
        },
        {
          withCredentials: true,
        },
      )
      .then((res) => {
        axios
          .get("https://primegpt-ls30.onrender.com/api/chat/", { withCredentials: true })
          .then((response) => {
            dispatch(loadChats(response.data.chats.reverse()));
          })
          .catch((error) => {
            console.error("Error fetching chats:", error);
          });

        axios
          .get("https://primegpt-ls30.onrender.com/api/auth/user", { withCredentials: true })
          .then((response) => {
            dispatch(loadUser(response.data.user));
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create account</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="auth-label">
              <span>First name</span>
              <input
                className="auth-input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                required
              />
            </label>

            <label className="auth-label">
              <span>Last name</span>
              <input
                className="auth-input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                required
              />
            </label>
          </div>

          <label className="auth-label">
            <span>Email</span>
            <input
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="auth-label">
            <span>Password</span>
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              required
            />
          </label>

          <button className="auth-btn" type="submit">
            Create account
          </button>
        </form>

        <p className="auth-note">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;

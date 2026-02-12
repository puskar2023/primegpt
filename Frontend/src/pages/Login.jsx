import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loadUser } from "../store/userSlice";
import { loadChats } from "../store/chatSlice";
import "../styles/auth.css";
import "../styles/loader.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // wire up login with loading indicator
    console.log({ email, password });
    setLoading(true);
    await axios
      .post(
        "http://localhost:3000/api/auth/login",
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
            axios.get("http://localhost:3000/api/chat/", { withCredentials: true }).then((response) => {
        dispatch(loadChats(response.data.chats.reverse()));
      }).catch((error) => {
        console.error("Error fetching chats:", error);
      });

      axios.get("http://localhost:3000/api/auth/user", { withCredentials: true }).then((response) => {
        dispatch(loadUser(response.data.user));
      }).catch((error) => {
        console.error("Error fetching user data:", error);
      });
      navigate("/");
      })
      .catch((err) => {
        console.error(err);
        alert(err.response?.data?.message || "Login failed");
      })
      .finally(() => {
        console.log("Login request completed");
        setLoading(false);
      });
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Sign in</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
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
              placeholder="Your strong password"
              required
            />
          </label>

          <button className="auth-btn" type="submit" disabled={loading} aria-busy={loading}>
            {loading && <span className="loader" aria-hidden="true"></span>}
            Sign in
          </button>
        </form>

        <p className="auth-note">
          Don't have an account? <Link to="/register">Create account</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;

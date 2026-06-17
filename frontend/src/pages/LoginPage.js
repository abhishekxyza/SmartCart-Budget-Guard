import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { login } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";
import "./Auth.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const data = await login({ username, password });
      loginContext(data.access);
      navigate("/dashboard");
    } catch (e) {
      console.error("Login error:", e);
      const message =
        e?.response?.data || e?.message || "Login failed. Check your credentials.";
      setError(
        typeof message === "string" ? message : JSON.stringify(message)
      );
    }
  };

  return (
    <div className="auth-container login-bg">
      <div className="auth-card">
        <div className="login-header">
          <h1>Login Form</h1>
        </div>

        <div className="auth-form-body">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="input-wrapper">
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Email Address"
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-wrapper">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                />
              </div>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="auth-options">
              <label className="remember-me">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <Link to="#" className="forgot-pw">Forgot password?</Link>
            </div>

            <button type="submit" className="submit-btn btn-gradient">
              Login
            </button>
          </form>

          <div className="auth-footer">
            <span>Not a member?</span>{" "}
            <Link to="/register">Signup now</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

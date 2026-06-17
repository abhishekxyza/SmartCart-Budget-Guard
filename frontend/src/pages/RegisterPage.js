import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { register, login } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";
import "./Auth.css";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!acceptTerms) {
      setError("Please accept the terms and conditions");
      return;
    }

    try {
      await register({ username, email, password });
      setSuccess(true);
      
      // Auto-login after a short delay to show the success message
      setTimeout(async () => {
        try {
          const loginResponse = await login({ username, password });
          loginContext(loginResponse.access);
          navigate("/dashboard");
        } catch (loginErr) {
          navigate("/login");
        }
      }, 2000);
    } catch (e) {
      console.error("Registration error:", e);
      const message = e?.response?.data || e?.message || "Registration failed. Please try again.";
      setError(typeof message === "string" ? message : JSON.stringify(message));
    }
  };

  return (
    <div className="auth-container register-bg">
      <div className="auth-card">
        <div className="register-header">
          <h1>Registration</h1>
        </div>
        
        <div className="auth-form-body">
          {success ? (
            <div className="success-message" style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🎉</div>
              <h3 style={{ color: "#81c784", marginBottom: "12px" }}>Account Created!</h3>
              <p style={{ color: "#666" }}>Welcome, {username}! Redirecting...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <div className="input-wrapper">
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
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
                    placeholder="Create password"
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="auth-options">
                <label className="terms-check">
                  <input 
                    type="checkbox" 
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                  />
                  <span>I accept all terms & conditions</span>
                </label>
              </div>

              <button type="submit" className="submit-btn btn-blue">
                Register Now
              </button>
            </form>
          )}

          <div className="auth-footer">
            <span>Already have an account?</span>{" "}
            <Link to="/login">Login now</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  // Fallback for username if user object doesn't have it yet
  const username = user?.username || user?.user_id || "User";

  return (
    <nav
      style={{
        display: "flex",
        gap: 12,
        padding: "12px 24px",
        background: "rgba(30, 20, 40, 0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        marginBottom: 24,
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}
    >
      <div style={{ marginRight: "auto", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "1.5rem" }}>🛒</span>
        <Link to="/dashboard" style={{ 
          color: "white", 
          textDecoration: "none", 
          fontWeight: "700", 
          fontSize: "1.2rem",
          letterSpacing: "0.5px"
        }}>SmartCart <span style={{ color: "#E68A3A" }}>Guard</span></Link>
      </div>
      
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <Link to="/dashboard" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "0.95rem", fontWeight: "500" }}>Dashboard</Link>
        <Link to="/shop" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "0.95rem", fontWeight: "500" }}>Shop</Link>
        <Link to="/settings" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "0.95rem", fontWeight: "500" }}>Settings</Link>
        
        <button
          onClick={handleLogout}
          style={{ 
            cursor: "pointer",
            background: "rgba(255, 255, 255, 0.1)",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "0.9rem",
            transition: "all 0.3s ease"
          }}
          onMouseOver={(e) => e.target.style.background = "rgba(255, 255, 255, 0.2)"}
          onMouseOut={(e) => e.target.style.background = "rgba(255, 255, 255, 0.1)"}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

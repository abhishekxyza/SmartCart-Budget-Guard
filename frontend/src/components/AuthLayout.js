import React from "react";
import "../pages/Auth.css";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-container">
      {/* Dynamic Floating Elements (Budget/Commerce themed symbols) */}
      <div className="floating-element el-1">💰</div>
      <div className="floating-element el-2">🛒</div>
      <div className="floating-element el-3">📉</div>
      <div className="floating-element el-4">🏦</div>
      <div className="floating-element el-5">💳</div>
      <div className="floating-element el-6">📊</div>

      {/* Stylized Landscape */}
      <div className="landscape" />
      <div className="landscape-front" />

      {/* Main Content Card */}
      <div className="auth-card">
        {children}
      </div>
    </div>
  );
}

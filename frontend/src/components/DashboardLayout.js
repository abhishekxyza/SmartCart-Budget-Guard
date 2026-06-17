import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../pages/Dashboard.css";

// SVG Icons
const IconDashboard = () => <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>;
const IconShop = () => <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>;
const IconSearch = () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>;
const IconLogout = () => <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>;

export default function DashboardLayout({ children }) {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="dashboard-root">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="10" height="10" rx="2" fill="#5f259f" />
            <rect x="12" width="10" height="10" rx="2" fill="#d8c4f0" />
            <rect y="12" width="10" height="10" rx="2" fill="#d8c4f0" />
            <rect x="12" y="12" width="10" height="10" rx="2" fill="#5f259f" />
          </svg>
          <div>
            SmartGuard
            <span>Budget</span>
          </div>
        </div>

        <div className="sidebar-menu">
          <Link to="/dashboard" className={`menu-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
            <IconDashboard /> Dashboard
          </Link>
          <Link to="/shop" className={`menu-item ${location.pathname === '/shop' ? 'active' : ''}`}>
            <IconShop /> Shop
          </Link>
          <Link to="/budget-tracker" className={`menu-item ${location.pathname === '/budget-tracker' ? 'active' : ''}`}>
            <span style={{ fontSize: '18px' }}>💰</span> Budget Tracker
          </Link>
          <Link to="/smart-suggestions" className={`menu-item ${location.pathname === '/smart-suggestions' ? 'active' : ''}`}>
            <span style={{ fontSize: '18px' }}>💡</span> Smart Suggestions
          </Link>
          <Link to="/transactions" className={`menu-item ${location.pathname === '/transactions' ? 'active' : ''}`}>
            <span style={{ fontSize: '18px' }}>📝</span> Transactions
          </Link>
          <Link to="/bills" className={`menu-item ${location.pathname === '/bills' ? 'active' : ''}`}>
            <span style={{ fontSize: '18px' }}>📑</span> Bills & Payments
          </Link>
          <Link to="/reports" className={`menu-item ${location.pathname === '/reports' ? 'active' : ''}`}>
            <span style={{ fontSize: '18px' }}>📊</span> Reports
          </Link>
        </div>

        <div className="sidebar-footer">
          <Link to="/settings" className={`menu-item ${location.pathname === '/settings' ? 'active' : ''}`}>
            <span style={{ fontSize: '18px' }}>⚙️</span> Settings
          </Link>
          <button 
            onClick={logout}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              padding: 0
            }}
            className="menu-item"
          >
            <IconLogout /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-main">
        <div className="dashboard-header">
          <div className="header-search">
            <IconSearch />
            <input type="text" placeholder="Search or type command..." />
          </div>
          <div className="header-actions">
            {/* Profile removed from dashboard as requested */}
          </div>
        </div>

        {/* Dynamic Page Content */}
        <div className="dashboard-content">
          {children}
        </div>
      </div>
    </div>
  );
}

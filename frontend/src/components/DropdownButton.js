import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./DropdownButton.css";

export default function DropdownButton({ label = "Quick Actions", options = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button 
        className={`dropdown-main-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
        <svg 
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`} 
          width="16" height="16" viewBox="0 0 24 24" fill="none" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      <div className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
        {options.map((option, index) => (
          <div 
            key={index}
            className="dropdown-item"
            onClick={() => handleOptionClick(option.path)}
          >
            {option.icon && <span className="dropdown-icon">{option.icon}</span>}
            <span className="dropdown-label">{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

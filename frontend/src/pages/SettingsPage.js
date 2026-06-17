import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

export default function SettingsPage() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState({
    username: "",
    email: ""
  });
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [currency, setCurrency] = useState("USD");
  const [theme, setTheme] = useState("Light");
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("users/profile/");
        setProfile({
          username: response.data.username,
          email: response.data.email
        });
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.patch("users/profile/", profile);
      setMessage({ text: "Profile updated successfully!", type: "success" });
      setIsEditingAccount(false);
    } catch (err) {
      setMessage({ text: "Failed to update profile.", type: "error" });
    }
  };

  const sections = [
    { 
      title: "Account Settings", 
      icon: "👤", 
      isEditable: true,
      onEdit: () => setIsEditingAccount(!isEditingAccount),
      isEditing: isEditingAccount,
      fields: [
        { 
          label: "Username", 
          value: profile.username, 
          name: "username",
          editable: true 
        },
        { 
          label: "Email", 
          value: profile.email, 
          name: "email",
          editable: true 
        }
      ]
    },
    { title: "Preferences", icon: "⚙️", fields: [
      { label: "Currency", value: currency, type: "select", options: ["USD", "EUR", "GBP", "INR"], setter: setCurrency },
      { label: "Theme", value: theme, type: "select", options: ["Light", "Dark", "System"], setter: setTheme },
      { label: "Email Notifications", value: notifications, type: "toggle", setter: setNotifications }
    ]},
    { title: "Security", icon: "🔒", fields: [
      { label: "Password", value: "••••••••", type: "button", actionLabel: "Change Password" },
      { label: "Two-Factor Auth", value: "Disabled", type: "button", actionLabel: "Enable" }
    ]}
  ];

  return (
    <div style={{ padding: 32, maxWidth: 800, margin: "0 auto", width: "100%" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: "2rem", color: "#111" }}>Settings</h1>
        <p style={{ color: "#666", marginTop: 4 }}>Manage your account and app preferences.</p>
      </div>

      {message.text && (
        <div style={{ 
          padding: "12px 16px", 
          borderRadius: 8, 
          marginBottom: 24,
          background: message.type === "success" ? "#e6fffa" : "#fff5f5",
          color: message.type === "success" ? "#2c7a7b" : "#c53030",
          border: `1px solid ${message.type === "success" ? "#b2f5ea" : "#feb2b2"}`
        }}>
          {message.text}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {sections.map((section, idx) => (
          <div key={idx} style={{ background: "white", borderRadius: 16, border: "1px solid #eaeaea", overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", background: "#f9fafb", borderBottom: "1px solid #eaeaea", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "1.2rem" }}>{section.icon}</span>
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>{section.title}</h3>
              </div>
              {section.isEditable && (
                <button 
                  onClick={section.onEdit}
                  style={{ 
                    padding: "6px 12px", 
                    background: "none", 
                    border: "1px solid #ddd", 
                    borderRadius: 6, 
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    color: section.isEditing ? "#c53030" : "#5f259f",
                    fontWeight: 600
                  }}
                >
                  {section.isEditing ? "Cancel" : "Edit Profile"}
                </button>
              )}
            </div>
            <div style={{ padding: "8px 24px" }}>
              {section.isEditing ? (
                <form onSubmit={handleProfileUpdate} style={{ padding: "16px 0" }}>
                  {section.fields.map((field, fIdx) => (
                    <div key={fIdx} style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", marginBottom: 8, fontSize: "0.9rem", fontWeight: 500 }}>{field.label}</label>
                      <input 
                        type="text"
                        value={profile[field.name]}
                        onChange={(e) => setProfile({...profile, [field.name]: e.target.value})}
                        style={{ 
                          width: "100%", 
                          padding: "10px 12px", 
                          borderRadius: 8, 
                          border: "1px solid #ddd",
                          fontSize: "1rem"
                        }}
                      />
                    </div>
                  ))}
                  <button 
                    type="submit"
                    style={{ 
                      width: "100%", 
                      padding: "12px", 
                      background: "#5f259f", 
                      color: "white", 
                      border: "none", 
                      borderRadius: 8, 
                      fontWeight: 600,
                      cursor: "pointer",
                      marginTop: 8
                    }}
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                section.fields.map((field, fIdx) => (
                  <div key={fIdx} style={{ 
                    padding: "16px 0", 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    borderBottom: fIdx === section.fields.length - 1 ? "none" : "1px solid #f3f4f6"
                  }}>
                    <div style={{ fontWeight: 500, fontSize: "0.95rem" }}>{field.label}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {field.type === "select" ? (
                        <select 
                          value={field.value} 
                          onChange={(e) => field.setter(e.target.value)}
                          style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ddd", outline: "none" }}
                        >
                          {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : field.type === "toggle" ? (
                        <div 
                          onClick={() => field.setter(!field.value)}
                          style={{ 
                            width: 44, 
                            height: 24, 
                            background: field.value ? "#5f259f" : "#ccc", 
                            borderRadius: 12, 
                            position: "relative",
                            cursor: "pointer",
                            transition: "background 0.2s"
                          }}
                        >
                          <div style={{ 
                            width: 18, 
                            height: 18, 
                            background: "white", 
                            borderRadius: "50%", 
                            position: "absolute", 
                            top: 3, 
                            left: field.value ? 23 : 3,
                            transition: "left 0.2s"
                          }} />
                        </div>
                      ) : field.type === "button" ? (
                        <button style={{ 
                          padding: "6px 16px", 
                          background: "white", 
                          border: "1px solid #ddd", 
                          borderRadius: 6, 
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          fontWeight: 500
                        }}>{field.actionLabel}</button>
                      ) : (
                        <span style={{ color: "#666", fontSize: "0.95rem" }}>{field.value}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

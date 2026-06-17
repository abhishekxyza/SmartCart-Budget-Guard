import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

export default function SmartSuggestionsPage() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const [budgetStatus, setBudgetStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get("budget/status/");
        setBudgetStatus(response.data);
      } catch (err) {
        console.error("Failed to load budget data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const budget = budgetStatus?.monthly_limit || 0;
  const spent = budgetStatus?.total_spent || 0;
  const remaining = budgetStatus?.remaining || 0;
  const statusType = budgetStatus?.status || "OK";

  // Determine suggestions based on status
  let alertHeader = "Everything looks good!";
  let alertColor = "#28a745";
  let alertBg = "#e8f5e9";
  let mainAdvice = "You are spending within your limits. Great job managing your finances this month!";
  let suggestions = [
    "Consider moving your unused balance to a savings account at the end of the month.",
    "Look out for cashback offers in the shop to maximize your savings.",
    "Review your recent transactions to see where you can cut even more costs."
  ];

  if (statusType === "EXCEEDED") {
    alertHeader = "🚨 Budget Exceeded Warning";
    alertColor = "#dc3545";
    alertBg = "#fdecea";
    mainAdvice = `You have exceeded your monthly budget of $${budget} by $${Math.abs(remaining).toFixed(2)}.`;
    suggestions = [
      "Stop any non-essential shopping immediately for the rest of the month.",
      "Review your recurring subscriptions and cancel any you don't use.",
      "Consider increasing your budget next month if your essential costs have risen permanently.",
      "Opt for cheaper alternatives or bulk-buy discounts for groceries."
    ];
  } else if (statusType === "WARNING") {
    alertHeader = "⚠️ Nearing Budget Limit";
    alertColor = "#ff8c42";
    alertBg = "#fff3e0";
    mainAdvice = `You have spent $${spent} and only have $${remaining.toFixed(2)} left. Be careful with your next purchases.`;
    suggestions = [
      "Wait 48 hours before making any new non-essential purchases.",
      "Plan your meals ahead to avoid expensive last-minute grocery shops or takeout.",
      "Check the 'Everyday Savings' section in the shop for discounted essential items.",
      "Avoid browsing shopping apps to reduce impulse buying temptations."
    ];
  }

  return (
    <div style={{ padding: 32, maxWidth: 900, margin: "0 auto", width: "100%" }}>
      <div style={{ marginBottom: 32 }}>
         <h1 style={{ margin: 0, fontSize: "2rem", color: "#111" }}>Smart Suggestions</h1>
         <p style={{ color: "#666", marginTop: 8, fontSize: "1.05rem" }}>
           Personalized financial advice based on your real-time spending habits.
         </p>
      </div>

      {loading ? (
         <p>Analyzing your budget...</p>
      ) : (
         <>
           {/* Main Alert Banner */}
           <div style={{ 
             padding: "24px 30px", 
             background: alertBg, 
             border: `1px solid ${alertColor}40`,
             borderRadius: 16, 
             marginBottom: 32,
             boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
           }}>
             <h2 style={{ margin: "0 0 12px 0", color: alertColor, display: "flex", alignItems: "center", gap: 10 }}>
                {alertHeader}
             </h2>
             <p style={{ margin: 0, fontSize: "1.1rem", color: "#333", lineHeight: 1.5 }}>
               {mainAdvice}
             </p>
             
             <div style={{ display: "flex", gap: 24, marginTop: 24, paddingTop: 20, borderTop: `1px solid ${alertColor}30` }}>
                <div>
                   <div style={{ fontSize: "0.85rem", color: "#666", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Monthly Budget</div>
                   <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111" }}>${parseFloat(budget).toFixed(2)}</div>
                </div>
                <div>
                   <div style={{ fontSize: "0.85rem", color: "#666", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Total Spent</div>
                   <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111" }}>${parseFloat(spent).toFixed(2)}</div>
                </div>
                <div>
                   <div style={{ fontSize: "0.85rem", color: "#666", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Remaining</div>
                   <div style={{ fontSize: "1.5rem", fontWeight: 700, color: alertColor }}>${parseFloat(remaining).toFixed(2)}</div>
                </div>
             </div>
           </div>

           {/* Actionable Advice List */}
           <h3 style={{ fontSize: "1.3rem", marginBottom: 20, color: "#222" }}>Recommended Actions</h3>
           <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
             {suggestions.map((sug, i) => (
               <div key={i} style={{ 
                 background: "white", 
                 padding: "20px 24px", 
                 borderRadius: 12, 
                 border: "1px solid #eaeaea",
                 display: "flex",
                 alignItems: "flex-start",
                 gap: 16,
                 boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
               }}>
                 <div style={{ 
                   width: 32, height: 32, 
                   borderRadius: "50%", 
                   background: "#f4f5f7", 
                   display: "flex", alignItems: "center", justifyContent: "center",
                   fontWeight: 600, color: "#5f259f", flexShrink: 0
                 }}>
                   {i + 1}
                 </div>
                 <p style={{ margin: 0, fontSize: "1.05rem", color: "#444", lineHeight: 1.5, paddingTop: 4 }}>
                   {sug}
                 </p>
               </div>
             ))}
           </div>
         </>
      )}
    </div>
  );
}

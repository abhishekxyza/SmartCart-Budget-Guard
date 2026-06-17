import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

export default function BudgetTrackerPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [budgetStatus, setBudgetStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newLimit, setNewLimit] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await api.get("budget/status/");
      setBudgetStatus(response.data);
      if (response.data?.monthly_limit) {
        setNewLimit(response.data.monthly_limit);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // No budget set yet
        setBudgetStatus({ monthly_limit: 0, total_spent: 0, remaining: 0, status: "SAFE" });
      } else {
        console.error("Failed to load budget data", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBudget = async (e) => {
    e.preventDefault();
    if (!newLimit || isNaN(newLimit) || Number(newLimit) <= 0) {
      setUpdateMsg({ text: "Please enter a valid amount greater than 0.", type: "error" });
      return;
    }

    setIsUpdating(true);
    setUpdateMsg({ text: "", type: "" });

    try {
      const response = await api.post("budget/set/", {
        monthly_limit: parseFloat(newLimit)
      });
      setBudgetStatus(response.data);
      setUpdateMsg({ text: "", type: "" });
      window.alert("Monthly budget updated successfully");
    } catch (err) {
      console.error("Failed to update budget", err);
      let errMsg = "Try again.";
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') {
          errMsg = err.response.data;
        } else if (err.response.data.detail) {
          errMsg = err.response.data.detail;
        } else {
          try {
            errMsg = JSON.stringify(err.response.data);
          } catch(e) {
            errMsg = err.message;
          }
        }
      } else if (err.message) {
        errMsg = err.message;
      }
      setUpdateMsg({ text: `Failed to update budget: ${errMsg}`, type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  const budget = budgetStatus?.monthly_limit ? parseFloat(budgetStatus.monthly_limit) : 0;
  const spent = budgetStatus?.total_spent ? parseFloat(budgetStatus.total_spent) : 0;
  const remaining = budgetStatus?.remaining ? parseFloat(budgetStatus.remaining) : 0;
  
  // Calculate percentage for progress bar
  let percentage = budget > 0 ? (spent / budget) * 100 : 0;
  if (percentage > 100) percentage = 100;
  
  // Determine progress bar color
  let progressColor = "#28a745"; // Green
  if (percentage >= 100) progressColor = "#dc3545"; // Red
  else if (percentage >= 80) progressColor = "#ff8c42"; // Orange

  return (
    <div style={{ padding: 32, maxWidth: 900, margin: "0 auto", width: "100%" }}>
      <div style={{ marginBottom: 32 }}>
         <h1 style={{ margin: 0, fontSize: "2rem", color: "#111" }}>Manage Your Budget</h1>
         <p style={{ color: "#666", marginTop: 8, fontSize: "1.05rem" }}>
           Set your monthly spending limit to protect your wallet from overspending.
         </p>
      </div>

      {loading ? (
         <p>Loading budget data...</p>
      ) : (
         <>
           {percentage >= 80 && (
             <div style={{
               background: percentage >= 100 ? "#fdecea" : "#fff3e0",
               color: percentage >= 100 ? "#dc3545" : "#fd7e14",
               padding: "16px 20px",
               borderRadius: 12,
               marginBottom: 24,
               fontWeight: 600,
               display: "flex",
               alignItems: "center",
               gap: 12,
               border: `1px solid ${percentage >= 100 ? "#dc3545" : "#fd7e14"}`
             }}>
               {percentage >= 100 
                 ? "🚨 You have completely exceeded your monthly spending limit!" 
                 : "⚠️ Warning: You have reached 80% or more of your monthly spending limit."}
             </div>
           )}

           {/* Progress & Overview Card */}
           <div style={{ 
             background: "white", 
             borderRadius: 16, 
             padding: 32, 
             boxShadow: "0 4px 12px rgba(0,0,0,0.03)", 
             border: "1px solid #eaeaea",
             marginBottom: 32
           }}>
             <h2 style={{ marginTop: 0, marginBottom: 24, color: "#111" }}>Current cycle overview</h2>
             
             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontWeight: 600, color: "#444" }}>Spent: ${spent.toFixed(2)}</span>
                <span style={{ fontWeight: 600, color: "#888" }}>Limit: ${budget.toFixed(2)}</span>
             </div>
             
             {/* Progress Bar Container */}
             <div style={{ width: "100%", height: 16, background: "#f0f0f0", borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
                <div style={{ 
                   height: "100%", 
                   width: `${percentage}%`, 
                   background: progressColor,
                   transition: "width 0.5s ease-in-out, background 0.3s ease",
                   borderRadius: 8
                }}></div>
             </div>
             
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.95rem" }}>
                <div style={{ color: remaining < 0 ? "#dc3545" : "#28a745", fontWeight: 600 }}>
                   {remaining < 0 ? `Exceeded by $${Math.abs(remaining).toFixed(2)}` : `${percentage.toFixed(0)}% used this month`}
                </div>
                <div style={{ color: "#555", display: "flex", gap: 16, alignItems: "center" }}>
                   <span><strong>${Math.max(remaining, 0).toFixed(2)}</strong> remaining</span>
                   
                   {percentage < 100 && budget > 0 && (
                     <button 
                       onClick={() => navigate("/shop")}
                       style={{
                         background: "#5f259f",
                         color: "white",
                         border: "none",
                         padding: "8px 16px",
                         borderRadius: 8,
                         fontWeight: 600,
                         cursor: "pointer",
                         transition: "background 0.2s"
                       }}
                     >
                       Continue Shopping
                     </button>
                   )}
                </div>
             </div>
           </div>

           {/* Update Form Card */}
           <div style={{ 
             background: "white", 
             borderRadius: 16, 
             padding: 32, 
             boxShadow: "0 4px 12px rgba(0,0,0,0.03)", 
             border: "1px solid #eaeaea"
           }}>
             <h2 style={{ marginTop: 0, marginBottom: 20, color: "#111" }}>Update Monthly Limit</h2>
             <form onSubmit={handleUpdateBudget} style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 400 }}>
                <div>
                   <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#333", fontSize: "0.95rem" }}>
                     New Budget Amount ($)
                   </label>
                   <input 
                     type="number" 
                     step="0.01" 
                     min="0"
                     value={newLimit}
                     onChange={(e) => setNewLimit(e.target.value)}
                     placeholder="e.g. 500.00"
                     style={{
                       width: "100%",
                       padding: "12px 16px",
                       fontSize: "1.05rem",
                       border: "1px solid #ddd",
                       borderRadius: 8,
                       outline: "none",
                       transition: "border 0.2s"
                     }}
                   />
                </div>
                <button 
                  type="submit" 
                  disabled={isUpdating}
                  style={{
                    padding: "14px 24px",
                    background: isUpdating ? "#a98ec9" : "#5f259f",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    fontSize: "1.05rem",
                    fontWeight: 600,
                    cursor: isUpdating ? "not-allowed" : "pointer",
                    transition: "background 0.2s"
                  }}
                >
                  {isUpdating ? "Saving..." : "Save Budget"}
                </button>
                {updateMsg.text && (
                   <div style={{ 
                     padding: "10px 14px", 
                     borderRadius: 6, 
                     background: updateMsg.type === "error" ? "#fdecea" : "#e8f5e9",
                     color: updateMsg.type === "error" ? "#dc3545" : "#28a745",
                     fontSize: "0.95rem",
                     fontWeight: 500
                   }}>
                     {updateMsg.text}
                   </div>
                )}
             </form>
           </div>
         </>
      )}
    </div>
  );
}

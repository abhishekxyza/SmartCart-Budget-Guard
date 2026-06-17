import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function ReportsPage() {
  const [orders, setOrders] = useState([]);
  const [budgetStatus, setBudgetStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, budgetRes] = await Promise.all([
          api.get("orders/list/"),
          api.get("budget/status/")
        ]);
        setOrders(ordersRes.data);
        setBudgetStatus(budgetRes.data);
      } catch (err) {
        console.error("Failed to load report data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: 40 }}>Generating reports...</div>;

  const totalSpent = budgetStatus?.total_spent || 0;
  const budgetLimit = budgetStatus?.monthly_limit || 0;
  const remaining = budgetStatus?.remaining || 0;

  // Simple category breakdown
  const categorySpending = orders.reduce((acc, order) => {
    (order.items || []).forEach(item => {
      const cat = item.category || "General";
      acc[cat] = (acc[cat] || 0) + (parseFloat(item.price) * item.quantity);
    });
    return acc;
  }, {});

  return (
    <div style={{ padding: 32, maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: "2rem", color: "#111" }}>Spending Reports</h1>
        <p style={{ color: "#666", marginTop: 4 }}>Visualizing your spending habits and budget performance.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 32, marginBottom: 32 }}>
        {/* Budget Overview Card */}
        <div style={{ padding: 24, background: "white", borderRadius: 20, border: "1px solid #eaeaea", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
          <h3 style={{ marginTop: 0, fontSize: "1.1rem" }}>Monthly Budget</h3>
          <div style={{ fontSize: "2rem", fontWeight: 700, margin: "16px 0", color: "#5f259f" }}>${totalSpent.toFixed(2)}</div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>of ${budgetLimit.toFixed(2)} limit</div>
          
          <div style={{ height: 12, background: "#f0f0f0", borderRadius: 6, margin: "24px 0", overflow: "hidden" }}>
            <div style={{ 
              height: "100%", 
              width: `${Math.min((totalSpent / budgetLimit) * 100, 100)}%`, 
              background: totalSpent > budgetLimit ? "#dc3545" : "#5f259f",
              borderRadius: 6 
            }} />
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
            <span>{((totalSpent / budgetLimit) * 100).toFixed(1)}% Used</span>
            <span style={{ color: remaining < 0 ? "#dc3545" : "#28a745" }}>
              ${remaining < 0 ? "Exceeded" : remaining.toFixed(2) + " Left"}
            </span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div style={{ padding: 24, background: "white", borderRadius: 20, border: "1px solid #eaeaea", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
          <h3 style={{ marginTop: 0, fontSize: "1.1rem" }}>Spending by Category</h3>
          <div style={{ marginTop: 20 }}>
            {Object.entries(categorySpending).length === 0 ? (
              <p style={{ color: "#888", textAlign: "center", padding: "40px 0" }}>No data to display</p>
            ) : (
              Object.entries(categorySpending)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, amount]) => (
                  <div key={cat} style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.95rem" }}>
                      <span style={{ fontWeight: 500 }}>{cat}</span>
                      <span style={{ fontWeight: 600 }}>${amount.toFixed(2)}</span>
                    </div>
                    <div style={{ height: 8, background: "#f0f0f0", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ 
                        height: "100%", 
                        width: `${(amount / totalSpent) * 100}%`, 
                        background: "#d8c4f0",
                        borderRadius: 4 
                      }} />
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Monthly Trend Mockup */}
      <div style={{ padding: 24, background: "white", borderRadius: 20, border: "1px solid #eaeaea", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
        <h3 style={{ marginTop: 0, fontSize: "1.1rem", marginBottom: 24 }}>Spending Trend</h3>
        <div style={{ height: 200, display: "flex", alignItems: "flex-end", gap: 16, padding: "0 20px" }}>
          {[35, 45, 30, 60, 40, 55, totalSpent / budgetLimit * 100].map((h, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ 
                width: "100%", 
                height: `${Math.min(h, 100)}%`, 
                background: i === 6 ? "#5f259f" : "#f4f5f7", 
                borderRadius: "8px 8px 0 0",
                transition: "height 0.3s ease"
              }} />
              <span style={{ fontSize: "0.75rem", color: "#888" }}>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

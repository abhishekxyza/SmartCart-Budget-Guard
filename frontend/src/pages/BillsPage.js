import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function BillsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("orders/list/");
        setOrders(response.data);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const unpaidBills = orders.filter(o => !o.paid);
  const paidBills = orders.filter(o => o.paid);

  if (loading) return <div style={{ padding: 40 }}>Loading bills...</div>;

  return (
    <div style={{ padding: 32, maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: "2rem", color: "#111" }}>Bills & Payments</h1>
        <p style={{ color: "#666", marginTop: 4 }}>Manage your upcoming and past payments.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {/* Pending Bills */}
        <div>
          <h2 style={{ fontSize: "1.25rem", marginBottom: 16 }}>Pending Bills</h2>
          {unpaidBills.length === 0 ? (
            <div style={{ padding: 24, background: "#f8f9fa", borderRadius: 12, textAlign: "center", color: "#666" }}>
              No pending bills. You're all caught up!
            </div>
          ) : (
            unpaidBills.map(bill => (
              <div key={bill.id} style={{ 
                padding: 20, 
                background: "white", 
                border: "1px solid #ff8c4240", 
                borderRadius: 12, 
                marginBottom: 16,
                boxShadow: "0 2px 8px rgba(255,140,66,0.05)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>Order #{bill.id}</div>
                    <div style={{ fontSize: "0.85rem", color: "#666" }}>{new Date(bill.created_at).toLocaleDateString()}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#dc3545" }}>${parseFloat(bill.total_amount).toFixed(2)}</div>
                    <button style={{ 
                      marginTop: 8, 
                      padding: "6px 12px", 
                      background: "#5f259f", 
                      color: "white", 
                      border: "none", 
                      borderRadius: 6,
                      fontSize: "0.85rem",
                      cursor: "pointer"
                    }}>Pay Now</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Payment History */}
        <div>
          <h2 style={{ fontSize: "1.25rem", marginBottom: 16 }}>Payment History</h2>
          {paidBills.length === 0 ? (
            <div style={{ padding: 24, background: "#f8f9fa", borderRadius: 12, textAlign: "center", color: "#666" }}>
              No payment history yet.
            </div>
          ) : (
            paidBills.map(bill => (
              <div key={bill.id} style={{ 
                padding: 20, 
                background: "white", 
                border: "1px solid #eaeaea", 
                borderRadius: 12, 
                marginBottom: 16 
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>Order #{bill.id}</div>
                    <div style={{ fontSize: "0.85rem", color: "#666" }}>Paid on {new Date(bill.created_at).toLocaleDateString()}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#28a745" }}>${parseFloat(bill.total_amount).toFixed(2)}</div>
                    <div style={{ fontSize: "0.75rem", color: "#888", marginTop: 4 }}>Completed</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

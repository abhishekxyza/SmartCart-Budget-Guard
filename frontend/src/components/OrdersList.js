import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function OrdersList() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("orders/list/");
        setOrders(response.data);
      } catch (err) {
        setError(err?.response?.data?.detail || "Unable to load orders.");
      }
    };

    fetchOrders();
  }, []);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!orders) {
    return <p>Loading orders…</p>;
  }

  if (!orders.length) {
    return <p>No orders yet.</p>;
  }

  return (
    <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 6 }}>
      <h3>Your Orders</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>
              Date
            </th>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                {new Date(order.created_at).toLocaleString()}
              </td>
              <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                ₹{order.total_amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

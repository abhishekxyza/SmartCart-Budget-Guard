import React, { useState } from "react";
import api from "../services/api";

export default function OrderForm({ onCreated }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await api.post("orders/create/", { total_amount: parseFloat(amount) });
      setSuccess("Order created successfully.");
      setAmount("");
      onCreated?.();
    } catch (err) {
      setError(err?.response?.data?.detail || "Unable to create order.");
    }
  };

  return (
    <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 6 }}>
      <h3>Create Order</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>
            Total Amount (USD)
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
        </div>

        {error && (
          <div style={{ color: "red", marginBottom: 12 }}>{error}</div>
        )}

        {success && (
          <div style={{ color: "green", marginBottom: 12 }}>{success}</div>
        )}

        <button type="submit" style={{ padding: "10px 16px" }}>
          Create Order
        </button>
      </form>
    </div>
  );
}

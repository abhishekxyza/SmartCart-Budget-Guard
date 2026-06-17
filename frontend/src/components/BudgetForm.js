import React, { useState } from "react";
import api from "../services/api";

export default function BudgetForm({ onSaved }) {
  const [limit, setLimit] = useState("");
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSaved(false);

    try {
      await api.post("budget/set/", { monthly_limit: parseFloat(limit) });
      setSaved(true);
      setLimit("");
      onSaved?.();
    } catch (err) {
      setError(err?.response?.data?.detail || "Unable to set budget.");
    }
  };

  return (
    <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 6 }}>
      <h3>Set Monthly Budget</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>
            Monthly Limit (INR)
            <input
              value={limit}
              type="number"
              step="0.01"
              min="0"
              onChange={(e) => setLimit(e.target.value)}
              required
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
        </div>
        
        {error && (
          <div style={{ color: "red", marginBottom: 12 }}>{error}</div>
        )}

        {saved && (
          <div style={{ color: "green", marginBottom: 12 }}>
            Budget updated successfully.
          </div>
        )}

        <button type="submit" style={{ padding: "10px 16px" }}>
          Save Budget
        </button>
      </form>
    </div>
  );
}

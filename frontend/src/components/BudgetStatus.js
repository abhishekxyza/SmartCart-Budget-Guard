import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function BudgetStatus() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get("budget/status/");
        setStatus(response.data);
      } catch (err) {
        setError(err?.response?.data?.detail || "Unable to load budget status.");
      }
    };

    fetchStatus();
  }, []);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!status) {
    return <p>Loading budget status…</p>;
  }

  return (
    <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 6 }}>
      <h3>Budget Status</h3>
      <p>
        <strong>Monthly limit:</strong> ₹{status.monthly_limit}
      </p>
      <p>
        <strong>Total spent:</strong> ₹{status.total_spent}
      </p>
      <p>
        <strong>Remaining:</strong> ₹{status.remaining}
      </p>
      <p>
        <strong>Status:</strong>{" "}
        <span
          style={{
            color:
              status.status === "EXCEEDED"
                ? "red"
                : status.status === "WARNING"
                ? "orange"
                : "green",
          }}
        >
          {status.status}
        </span>
      </p>
    </div>
  );
}

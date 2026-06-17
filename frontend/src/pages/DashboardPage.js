import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import BudgetForm from "../components/BudgetForm";
import BudgetStatus from "../components/BudgetStatus";
import OrderForm from "../components/OrderForm";
import OrdersList from "../components/OrdersList";

export default function DashboardPage() {
  const { token } = useAuth();
  const [refresh, setRefresh] = useState(0);

  const refreshData = useCallback(() => {
    setRefresh((value) => value + 1);
  }, []);

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">Dashboard Overview</h1>
            <p className="page-subtitle">Track your budget and managing orders</p>
          </div>
          <Link
            to="/orders-history"
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}
          >
            📦 Orders History
          </Link>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="grid-section">
          <BudgetForm token={token} onSaved={refreshData} />
        </div>
        <div className="grid-section">
          <BudgetStatus token={token} key={refresh} />
        </div>
      </div>

      <div className="dashboard-grid mt-24">
        <div className="grid-section">
          <OrderForm token={token} onCreated={refreshData} />
        </div>
        <div className="grid-section">
          <OrdersList token={token} key={refresh} />
        </div>
      </div>
    </div>
  );
}

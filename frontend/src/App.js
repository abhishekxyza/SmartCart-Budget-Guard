import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardLayout from "./components/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import ShopPage from "./pages/ShopPage";
import PaymentPage from "./pages/PaymentPage";
import BudgetTrackerPage from "./pages/BudgetTrackerPage";
import SmartSuggestionsPage from "./pages/SmartSuggestionsPage";
import TransactionsPage from "./pages/TransactionsPage";
import BillsPage from "./pages/BillsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import OrdersHistoryPage from "./pages/OrdersHistoryPage";

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <DashboardLayout>{children}</DashboardLayout>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/shop"
            element={
              <PrivateRoute>
                <ShopPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/budget-tracker"
            element={
              <PrivateRoute>
                <BudgetTrackerPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/smart-suggestions"
            element={
              <PrivateRoute>
                <SmartSuggestionsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <PrivateRoute>
                <TransactionsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/bills"
            element={
              <PrivateRoute>
                <BillsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <ReportsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <PrivateRoute>
                <PaymentPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders-history"
            element={
              <PrivateRoute>
                <OrdersHistoryPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

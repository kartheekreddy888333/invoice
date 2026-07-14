import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Reports from './pages/Reports';
import HSNCodes from './pages/HSNCodes';
import CompanySettings from './pages/CompanySettings';
import StockMovement from './pages/StockMovement';
import Accounting from './pages/Accounting';
import Login from './pages/Login';

function RequireAuth({ children }) {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicOnly({ children }) {
  const { isAuthenticated } = useApp();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnly>
                <Login />
              </PublicOnly>
            }
          />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/invoices"
            element={
              <RequireAuth>
                <Invoices />
              </RequireAuth>
            }
          />
          <Route
            path="/customers"
            element={
              <RequireAuth>
                <Customers />
              </RequireAuth>
            }
          />
          <Route
            path="/products"
            element={
              <RequireAuth>
                <Products />
              </RequireAuth>
            }
          />
          <Route
            path="/reports"
            element={
              <RequireAuth>
                <Reports />
              </RequireAuth>
            }
          />
          <Route
            path="/accounting"
            element={
              <RequireAuth>
                <Accounting />
              </RequireAuth>
            }
          />
          <Route
            path="/stock-movement"
            element={
              <RequireAuth>
                <StockMovement />
              </RequireAuth>
            }
          />
          <Route
            path="/hsn-codes"
            element={
              <RequireAuth>
                <HSNCodes />
              </RequireAuth>
            }
          />
          <Route
            path="/company"
            element={
              <RequireAuth>
                <CompanySettings />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;

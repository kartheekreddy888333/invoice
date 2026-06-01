import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Reports from './pages/Reports';
import HSNCodes from './pages/HSNCodes';
import CompanySettings from './pages/CompanySettings';
import StockMovement from './pages/StockMovement';
import Accounting from './pages/Accounting';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/accounting" element={<Accounting />} />
          <Route path="/stock-movement" element={<StockMovement />} />
          <Route path="/hsn-codes" element={<HSNCodes />} />
          <Route path="/company" element={<CompanySettings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;

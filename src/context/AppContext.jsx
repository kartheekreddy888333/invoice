import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [company, setCompany] = useState(() => {
    const saved = localStorage.getItem('company');
    return saved ? JSON.parse(saved) : null;
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('customers');
    return saved ? JSON.parse(saved) : [];
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [
      {
        id: 'prod-001',
        productName: 'Banganapalli Mango',
        skuCode: 'SKU-MANGO-BANNA-001',
        barcode: '5901234123457',
        hsnCode: '08045020',
        category: 'K2C Mango Products',
        unit: 'kg',
        purchasePrice: 35,
        sellingPrice: 60,
        gstRate: 5,
        openingStock: 500,
        currentStock: 500,
        minimumStock: 50,
        productImage: null,
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod-002',
        productName: 'Himayat Mango',
        skuCode: 'SKU-MANGO-HIMA-001',
        barcode: '5901234123458',
        hsnCode: '08045020',
        category: 'K2C Mango Products',
        unit: 'kg',
        purchasePrice: 40,
        sellingPrice: 75,
        gstRate: 5,
        openingStock: 400,
        currentStock: 400,
        minimumStock: 50,
        productImage: null,
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod-003',
        productName: 'Alphonso Mango',
        skuCode: 'SKU-MANGO-ALPH-001',
        barcode: '5901234123459',
        hsnCode: '08045020',
        category: 'K2C Mango Products',
        unit: 'kg',
        purchasePrice: 50,
        sellingPrice: 90,
        gstRate: 5,
        openingStock: 300,
        currentStock: 300,
        minimumStock: 50,
        productImage: null,
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod-004',
        productName: 'Kesar Mango',
        skuCode: 'SKU-MANGO-KESA-001',
        barcode: '5901234123460',
        hsnCode: '08045020',
        category: 'K2C Mango Products',
        unit: 'kg',
        purchasePrice: 45,
        sellingPrice: 80,
        gstRate: 5,
        openingStock: 350,
        currentStock: 350,
        minimumStock: 50,
        productImage: null,
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod-005',
        productName: 'Dasheri Mango',
        skuCode: 'SKU-MANGO-DASH-001',
        barcode: '5901234123461',
        hsnCode: '08045020',
        category: 'K2C Mango Products',
        unit: 'kg',
        purchasePrice: 38,
        sellingPrice: 70,
        gstRate: 5,
        openingStock: 450,
        currentStock: 450,
        minimumStock: 50,
        productImage: null,
        createdAt: new Date().toISOString()
      }
    ];
  });

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('invoices');
    return saved ? JSON.parse(saved) : [];
  });

  const [stockMovements, setStockMovements] = useState(() => {
    const saved = localStorage.getItem('stockMovements');
    return saved ? JSON.parse(saved) : [];
  });

  const [hsnCodes, setHsnCodes] = useState(() => {
    const saved = localStorage.getItem('hsnCodes');
    return saved ? JSON.parse(saved) : [
      { code: '08045020', category: 'Mango', gstRate: 5 },
    ];
  });

  const [notifications, setNotifications] = useState([]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('company', JSON.stringify(company));
  }, [company]);

  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('stockMovements', JSON.stringify(stockMovements));
  }, [stockMovements]);

  useEffect(() => {
    localStorage.setItem('hsnCodes', JSON.stringify(hsnCodes));
  }, [hsnCodes]);

  const addNotification = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    if (duration) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // ====== INVENTORY MANAGEMENT FUNCTIONS ======

  const deductStock = (invoiceItems) => {
    const updatedProducts = products.map(product => {
      const itemInInvoice = invoiceItems.find(item => item.productId === product.id);
      if (itemInInvoice) {
        const newStock = product.currentStock - itemInInvoice.quantity;
        // Track stock movement
        recordStockMovement({
          productId: product.id,
          productName: product.productName,
          type: 'deduction',
          quantity: itemInInvoice.quantity,
          reason: 'Invoice Sale',
          balanceBefore: product.currentStock,
          balanceAfter: newStock,
          timestamp: new Date().toISOString()
        });
        return { ...product, currentStock: Math.max(0, newStock) };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  const recordStockMovement = (movement) => {
    setStockMovements(prev => [...prev, { id: Date.now(), ...movement }]);
  };

  const getLowStockAlerts = () => {
    return products.filter(p => p.currentStock <= p.minimumStock && p.currentStock > 0);
  };

  const getOutOfStockProducts = () => {
    return products.filter(p => p.currentStock === 0);
  };

  // ====== ACCOUNTING FUNCTIONS ======

  const calculateProductProfit = (product, quantity) => {
    const cost = product.purchasePrice * quantity;
    const revenue = product.sellingPrice * quantity;
    return revenue - cost;
  };

  const calculateInvoiceProfit = (invoiceItems) => {
    return invoiceItems.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        return total + calculateProductProfit(product, item.quantity);
      }
      return total;
    }, 0);
  };

  const getTotalRevenue = () => {
    return invoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
  };

  const getTotalProfit = () => {
    return invoices.reduce((sum, inv) => {
      const profit = calculateInvoiceProfit(inv.items || []);
      return sum + profit;
    }, 0);
  };

  const getTotalOutstanding = () => {
    return invoices
      .filter(inv => inv.paymentStatus === 'unpaid' || inv.paymentStatus === 'partially_paid')
      .reduce((sum, inv) => sum + (inv.outstandingAmount || inv.grandTotal || 0), 0);
  };

  const getOutstandingByCustomer = (customerId) => {
    return invoices
      .filter(inv => inv.customerId === customerId && (inv.paymentStatus === 'unpaid' || inv.paymentStatus === 'partially_paid'))
      .reduce((sum, inv) => sum + (inv.outstandingAmount || inv.grandTotal || 0), 0);
  };

  const updatePaymentStatus = (invoiceId, status, paidAmount = 0) => {
    const updatedInvoices = invoices.map(inv => {
      if (inv.id === invoiceId) {
        const grandTotal = inv.grandTotal || 0;
        const outstandingAmount = status === 'paid' ? 0 : grandTotal - paidAmount;
        return {
          ...inv,
          paymentStatus: status,
          paidAmount,
          outstandingAmount,
          lastPaymentDate: new Date().toISOString()
        };
      }
      return inv;
    });
    setInvoices(updatedInvoices);
  };

  // ====== INVOICE HELPER FUNCTIONS ======

  const getInvoicesByCustomer = (customerId) => {
    return invoices.filter(inv => inv.customerId === customerId);
  };

  const getCustomerTotalPurchases = (customerId) => {
    return getInvoicesByCustomer(customerId).reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
  };

  const value = {
    darkMode,
    setDarkMode,
    company,
    setCompany,
    customers,
    setCustomers,
    products,
    setProducts,
    invoices,
    setInvoices,
    hsnCodes,
    setHsnCodes,
    stockMovements,
    setStockMovements,
    notifications,
    addNotification,
    removeNotification,
    // Inventory functions
    deductStock,
    recordStockMovement,
    getLowStockAlerts,
    getOutOfStockProducts,
    // Accounting functions
    calculateProductProfit,
    calculateInvoiceProfit,
    getTotalRevenue,
    getTotalProfit,
    getTotalOutstanding,
    getOutstandingByCustomer,
    updatePaymentStatus,
    // Invoice helpers
    getInvoicesByCustomer,
    getCustomerTotalPurchases,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

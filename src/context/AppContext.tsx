import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type CompanyId = 'k2c' | 'mangupro';

type CompanyProfile = {
  companyName: string;
  gstin: string;
  panNumber: string;
  address: string;
  state: string;
  stateCode: string;
  email: string;
  mobile: string;
  logo: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  website: string;
};

type CompanyOption = {
  id: CompanyId;
  label: string;
  shortLabel: string;
};

type Customer = Record<string, unknown>;
type Product = Record<string, unknown>;
type Invoice = Record<string, unknown>;
type StockMovement = Record<string, unknown>;
type HsnCode = { code: string; category: string; gstRate: number };

type Notification = {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
};

type AppContextValue = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  activeCompanyId: CompanyId | null;
  isAuthenticated: boolean;
  companyOptions: CompanyOption[];
  company: CompanyProfile;
  setCompany: React.Dispatch<React.SetStateAction<CompanyProfile>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  hsnCodes: HsnCode[];
  setHsnCodes: React.Dispatch<React.SetStateAction<HsnCode[]>>;
  stockMovements: StockMovement[];
  setStockMovements: React.Dispatch<React.SetStateAction<StockMovement[]>>;
  notifications: Notification[];
  addNotification: (message: string, type?: Notification['type'], duration?: number) => void;
  removeNotification: (id: number) => void;
  deductStock: (invoiceItems: Array<{ productId: string; quantity: number }>) => void;
  recordStockMovement: (movement: Record<string, unknown>) => void;
  getLowStockAlerts: () => Product[];
  getOutOfStockProducts: () => Product[];
  calculateProductProfit: (product: Product, quantity: number) => number;
  calculateInvoiceProfit: (invoiceItems: Array<{ productId: string; quantity: number }>) => number;
  getTotalRevenue: () => number;
  getTotalProfit: () => number;
  getTotalOutstanding: () => number;
  getOutstandingByCustomer: (customerId: string) => number;
  updatePaymentStatus: (invoiceId: string, status: string, paidAmount?: number) => void;
  getInvoicesByCustomer: (customerId: string) => Invoice[];
  getCustomerTotalPurchases: (customerId: string) => number;
  login: (companyId: CompanyId) => void;
  logout: () => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

const DEFAULT_COMPANY_ID: CompanyId = 'k2c';

export const COMPANY_OPTIONS: CompanyOption[] = [
  { id: 'k2c', label: 'K2C Agro Tech India Private Limited', shortLabel: 'K2C Agro Tech' },
  { id: 'mangupro', label: 'Mangupro Private Limited', shortLabel: 'Mangupro' },
];

const COMPANY_PROFILES: Record<CompanyId, CompanyProfile> = {
  k2c: {
    companyName: 'K2C AGRO TECH INDIA PRIVATE LIMITED',
    gstin: '29AAFCU5055K1Z0',
    panNumber: 'AAFCU5055K',
    address: 'Plot No. 123, Agro Tech Park, Pune, Maharashtra - 411057',
    state: 'Maharashtra',
    stateCode: '14',
    email: 'contact@k2cagro.com',
    mobile: '+91-9876543210',
    logo: '',
    bankName: 'State Bank of India',
    accountNumber: '12345678901234',
    ifscCode: 'SBIN0001234',
    upiId: 'k2cagro@sbi',
    website: 'www.k2cagro.com',
  },
  mangupro: {
    companyName: 'MANGUPRO PRIVATE LIMITED',
    gstin: 'TO-BE-UPDATED',
    panNumber: 'TO-BE-UPDATED',
    address: 'To be updated',
    state: 'Maharashtra',
    stateCode: '14',
    email: 'info@mangupro.com',
    mobile: '+91-9000000000',
    logo: '',
    bankName: 'Bank Name',
    accountNumber: 'Account Number',
    ifscCode: 'IFSC Code',
    upiId: 'upi@mangupro',
    website: 'www.mangupro.com',
  },
};

const COMPANY_STORAGE_KEYS = {
  company: 'company',
  customers: 'customers',
  products: 'products',
  invoices: 'invoices',
  stockMovements: 'stockMovements',
  hsnCodes: 'hsnCodes',
} as const;

const getCompanyProfile = (companyId: CompanyId): CompanyProfile => COMPANY_PROFILES[companyId] || COMPANY_PROFILES[DEFAULT_COMPANY_ID];

const getStorageKey = (companyId: CompanyId, key: string): string => `${companyId}:${key}`;

const readJson = <T,>(key: string, fallback: T): T => {
  const saved = localStorage.getItem(key);
  if (!saved) return fallback;

  try {
    return JSON.parse(saved) as T;
  } catch {
    return fallback;
  }
};

const readCompanyJson = <T,>(companyId: CompanyId, key: string, fallback: T): T => {
  const namespacedValue = localStorage.getItem(getStorageKey(companyId, key));
  if (namespacedValue) {
    try {
      return JSON.parse(namespacedValue) as T;
    } catch {
      return fallback;
    }
  }

  if (companyId === DEFAULT_COMPANY_ID) {
    return readJson(key, fallback);
  }

  return fallback;
};

const writeCompanyJson = <T,>(companyId: CompanyId, key: string, value: T): void => {
  localStorage.setItem(getStorageKey(companyId, key), JSON.stringify(value));

  if (companyId === DEFAULT_COMPANY_ID) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const getDefaultProducts = (): Product[] => ([
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
]);

const getDefaultState = (companyId: CompanyId) => {
  const profile = getCompanyProfile(companyId);

  return {
    company: profile,
    customers: [] as Customer[],
    products: getDefaultProducts(),
    invoices: [] as Invoice[],
    stockMovements: [] as StockMovement[],
    hsnCodes: [
      { code: '08045020', category: 'Mango', gstRate: 5 },
    ] as HsnCode[],
  };
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

type AppProviderProps = { children: ReactNode };

export const AppProvider = ({ children }: AppProviderProps) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [activeCompanyId, setActiveCompanyId] = useState<CompanyId | null>(() => {
    const saved = localStorage.getItem('activeCompanyId');
    return saved === 'k2c' || saved === 'mangupro' ? saved : null;
  });

  const activeTenantId: CompanyId = activeCompanyId || DEFAULT_COMPANY_ID;

  const [company, setCompany] = useState<CompanyProfile>(() => {
    const defaults = getDefaultState(activeTenantId);
    return readCompanyJson(activeTenantId, COMPANY_STORAGE_KEYS.company, defaults.company);
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const defaults = getDefaultState(activeTenantId);
    return readCompanyJson(activeTenantId, COMPANY_STORAGE_KEYS.customers, defaults.customers);
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const defaults = getDefaultState(activeTenantId);
    return readCompanyJson(activeTenantId, COMPANY_STORAGE_KEYS.products, defaults.products);
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const defaults = getDefaultState(activeTenantId);
    return readCompanyJson(activeTenantId, COMPANY_STORAGE_KEYS.invoices, defaults.invoices);
  });

  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    const defaults = getDefaultState(activeTenantId);
    return readCompanyJson(activeTenantId, COMPANY_STORAGE_KEYS.stockMovements, defaults.stockMovements);
  });

  const [hsnCodes, setHsnCodes] = useState<HsnCode[]>(() => {
    const defaults = getDefaultState(activeTenantId);
    return readCompanyJson(activeTenantId, COMPANY_STORAGE_KEYS.hsnCodes, defaults.hsnCodes);
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (!activeCompanyId) return;
    writeCompanyJson(activeCompanyId, COMPANY_STORAGE_KEYS.company, company);
  }, [activeCompanyId, company]);

  useEffect(() => {
    if (!activeCompanyId) return;
    writeCompanyJson(activeCompanyId, COMPANY_STORAGE_KEYS.customers, customers);
  }, [activeCompanyId, customers]);

  useEffect(() => {
    if (!activeCompanyId) return;
    writeCompanyJson(activeCompanyId, COMPANY_STORAGE_KEYS.products, products);
  }, [activeCompanyId, products]);

  useEffect(() => {
    if (!activeCompanyId) return;
    writeCompanyJson(activeCompanyId, COMPANY_STORAGE_KEYS.invoices, invoices);
  }, [activeCompanyId, invoices]);

  useEffect(() => {
    if (!activeCompanyId) return;
    writeCompanyJson(activeCompanyId, COMPANY_STORAGE_KEYS.stockMovements, stockMovements);
  }, [activeCompanyId, stockMovements]);

  useEffect(() => {
    if (!activeCompanyId) return;
    writeCompanyJson(activeCompanyId, COMPANY_STORAGE_KEYS.hsnCodes, hsnCodes);
  }, [activeCompanyId, hsnCodes]);

  const loadCompanyData = (companyId: CompanyId) => {
    const defaults = getDefaultState(companyId);

    setCompany(readCompanyJson(companyId, COMPANY_STORAGE_KEYS.company, defaults.company));
    setCustomers(readCompanyJson(companyId, COMPANY_STORAGE_KEYS.customers, defaults.customers));
    setProducts(readCompanyJson(companyId, COMPANY_STORAGE_KEYS.products, defaults.products));
    setInvoices(readCompanyJson(companyId, COMPANY_STORAGE_KEYS.invoices, defaults.invoices));
    setStockMovements(readCompanyJson(companyId, COMPANY_STORAGE_KEYS.stockMovements, defaults.stockMovements));
    setHsnCodes(readCompanyJson(companyId, COMPANY_STORAGE_KEYS.hsnCodes, defaults.hsnCodes));
  };

  const login = (companyId: CompanyId) => {
    const selectedCompanyId: CompanyId = COMPANY_PROFILES[companyId] ? companyId : DEFAULT_COMPANY_ID;
    localStorage.setItem('activeCompanyId', selectedCompanyId);
    setActiveCompanyId(selectedCompanyId);
    loadCompanyData(selectedCompanyId);
  };

  const logout = () => {
    localStorage.removeItem('activeCompanyId');
    setActiveCompanyId(null);
  };

  const addNotification = (message: string, type: Notification['type'] = 'info', duration = 3000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    if (duration) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
      }, duration);
    }
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const deductStock = (invoiceItems: Array<{ productId: string; quantity: number }>) => {
    const updatedProducts = products.map(product => {
      const itemInInvoice = invoiceItems.find(item => item.productId === (product as { id?: string }).id);
      if (itemInInvoice) {
        const currentStock = Number((product as { currentStock?: number }).currentStock || 0);
        const newStock = currentStock - itemInInvoice.quantity;
        recordStockMovement({
          productId: (product as { id?: string }).id,
          productName: (product as { productName?: string }).productName,
          type: 'deduction',
          quantity: itemInInvoice.quantity,
          reason: 'Invoice Sale',
          balanceBefore: currentStock,
          balanceAfter: newStock,
          timestamp: new Date().toISOString()
        });
        return { ...product, currentStock: Math.max(0, newStock) };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  const recordStockMovement = (movement: Record<string, unknown>) => {
    setStockMovements(prev => [...prev, { id: Date.now(), ...movement }]);
  };

  const getLowStockAlerts = () => {
    return products.filter(product => {
      const currentStock = Number((product as { currentStock?: number }).currentStock || 0);
      const minimumStock = Number((product as { minimumStock?: number }).minimumStock || 0);
      return currentStock <= minimumStock && currentStock > 0;
    });
  };

  const getOutOfStockProducts = () => {
    return products.filter(product => Number((product as { currentStock?: number }).currentStock || 0) === 0);
  };

  const calculateProductProfit = (product: Product, quantity: number) => {
    const purchasePrice = Number((product as { purchasePrice?: number }).purchasePrice || 0);
    const sellingPrice = Number((product as { sellingPrice?: number }).sellingPrice || 0);
    const cost = purchasePrice * quantity;
    const revenue = sellingPrice * quantity;
    return revenue - cost;
  };

  const calculateInvoiceProfit = (invoiceItems: Array<{ productId: string; quantity: number }>) => {
    return invoiceItems.reduce((total, item) => {
      const product = products.find(candidate => (candidate as { id?: string }).id === item.productId);
      if (product) {
        return total + calculateProductProfit(product, item.quantity);
      }
      return total;
    }, 0);
  };

  const getTotalRevenue = () => {
    return invoices.reduce((sum, invoice) => sum + Number((invoice as { grandTotal?: number }).grandTotal || 0), 0);
  };

  const getTotalProfit = () => {
    return invoices.reduce((sum, invoice) => {
      const profit = calculateInvoiceProfit((invoice as { items?: Array<{ productId: string; quantity: number }> }).items || []);
      return sum + profit;
    }, 0);
  };

  const getTotalOutstanding = () => {
    return invoices
      .filter(invoice => {
        const paymentStatus = (invoice as { paymentStatus?: string }).paymentStatus;
        return paymentStatus === 'unpaid' || paymentStatus === 'partially_paid';
      })
      .reduce((sum, invoice) => sum + Number((invoice as { outstandingAmount?: number; grandTotal?: number }).outstandingAmount || (invoice as { grandTotal?: number }).grandTotal || 0), 0);
  };

  const getOutstandingByCustomer = (customerId: string) => {
    return invoices
      .filter(invoice => {
        const paymentStatus = (invoice as { paymentStatus?: string }).paymentStatus;
        return (invoice as { customerId?: string }).customerId === customerId && (paymentStatus === 'unpaid' || paymentStatus === 'partially_paid');
      })
      .reduce((sum, invoice) => sum + Number((invoice as { outstandingAmount?: number; grandTotal?: number }).outstandingAmount || (invoice as { grandTotal?: number }).grandTotal || 0), 0);
  };

  const updatePaymentStatus = (invoiceId: string, status: string, paidAmount = 0) => {
    const updatedInvoices = invoices.map(invoice => {
      if ((invoice as { id?: string }).id === invoiceId) {
        const grandTotal = Number((invoice as { grandTotal?: number }).grandTotal || 0);
        const outstandingAmount = status === 'paid' ? 0 : grandTotal - paidAmount;
        return {
          ...invoice,
          paymentStatus: status,
          paidAmount,
          outstandingAmount,
          lastPaymentDate: new Date().toISOString()
        };
      }
      return invoice;
    });
    setInvoices(updatedInvoices);
  };

  const getInvoicesByCustomer = (customerId: string) => {
    return invoices.filter(invoice => (invoice as { customerId?: string }).customerId === customerId);
  };

  const getCustomerTotalPurchases = (customerId: string) => {
    return getInvoicesByCustomer(customerId).reduce((sum, invoice) => sum + Number((invoice as { grandTotal?: number }).grandTotal || 0), 0);
  };

  const value: AppContextValue = {
    darkMode,
    setDarkMode,
    activeCompanyId,
    isAuthenticated: Boolean(activeCompanyId),
    companyOptions: COMPANY_OPTIONS,
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
    deductStock,
    recordStockMovement,
    getLowStockAlerts,
    getOutOfStockProducts,
    calculateProductProfit,
    calculateInvoiceProfit,
    getTotalRevenue,
    getTotalProfit,
    getTotalOutstanding,
    getOutstandingByCustomer,
    updatePaymentStatus,
    getInvoicesByCustomer,
    getCustomerTotalPurchases,
    login,
    logout,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
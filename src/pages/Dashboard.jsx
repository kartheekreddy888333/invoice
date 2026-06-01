import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, FileText, Users, Package, DollarSign, TrendingDown, AlertCircle } from 'lucide-react';
import Card from '../components/Card';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';

export default function Dashboard() {
  const { invoices, customers, products, company, getLowStockAlerts, getTotalOutstanding } = useApp();

  const stats = useMemo(() => {
    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter(inv => inv.paymentStatus === 'paid').length;
    const pendingInvoices = invoices.filter(inv => inv.paymentStatus === 'unpaid' || inv.paymentStatus === 'partially_paid').length;

    const totalSales = invoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
    const gstCollected = invoices.reduce((sum, inv) => {
      const gst = (inv.totalCGST || 0) + (inv.totalSGST || 0) + (inv.totalIGST || 0);
      return sum + gst;
    }, 0);

    return {
      totalSales,
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      gstCollected,
      totalCustomers: customers.length,
      totalProducts: products.length,
      lowStockAlerts: getLowStockAlerts().length,
      outstanding: getTotalOutstanding(),
    };
  }, [invoices, customers, products, getLowStockAlerts, getTotalOutstanding]);

  const monthlyData = useMemo(() => {
    const data = {};
    invoices.forEach(inv => {
      if (inv.invoiceDate) {
        const month = new Date(inv.invoiceDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
        if (!data[month]) {
          data[month] = { name: month, sales: 0, gst: 0, invoices: 0 };
        }
        data[month].sales += inv.grandTotal || 0;
        data[month].gst += (inv.totalCGST || 0) + (inv.totalSGST || 0) + (inv.totalIGST || 0);
        data[month].invoices += 1;
      }
    });
    return Object.values(data).slice(-12);
  }, [invoices]);

  const gstTypeData = useMemo(() => {
    const data = {};
    invoices.forEach(inv => {
      const type = inv.gstType || 'cgst+sgst';
      if (!data[type]) {
        data[type] = 0;
      }
      data[type] += inv.grandTotal || 0;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [invoices]);

  const recentInvoices = invoices.slice(-5).reverse();

  const COLORS = ['#0ea5e9', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6 md:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          {company && (
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">{company.companyName}</p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <Card className="bg-gradient-to-br from-blue-50 dark:from-blue-900/20 to-blue-50/50 dark:to-blue-900/10 p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Sales</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-0.5 sm:mt-1 truncate">{formatCurrency(stats.totalSales)}</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0">
                <DollarSign className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 dark:from-purple-900/20 to-purple-50/50 dark:to-purple-900/10 p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Invoices</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-0.5 sm:mt-1">{stats.totalInvoices}</p>
              </div>
              <div className="p-2 sm:p-3 bg-purple-100 dark:bg-purple-900 rounded-lg flex-shrink-0">
                <FileText className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 dark:from-green-900/20 to-green-50/50 dark:to-green-900/10 p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">GST Collected</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-0.5 sm:mt-1 truncate">{formatCurrency(stats.gstCollected)}</p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-900 rounded-lg flex-shrink-0">
                <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 dark:from-red-900/20 to-red-50/50 dark:to-red-900/10 p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-0.5 sm:mt-1">{stats.pendingInvoices}</p>
              </div>
              <div className="p-2 sm:p-3 bg-red-100 dark:bg-red-900 rounded-lg flex-shrink-0">
                <TrendingDown className="text-red-600 dark:text-red-400" size={20} />
              </div>
            </div>
          </Card>
        </div>

        {/* Alerts Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
          {/* Low Stock Alerts */}
          <Card className="border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10 p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex-shrink-0">
                <AlertCircle className="text-yellow-600 dark:text-yellow-400" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1">Stock Alerts</h3>
                {stats.lowStockAlerts > 0 ? (
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-bold text-yellow-600 dark:text-yellow-400">{stats.lowStockAlerts}</span> products running low on stock
                  </p>
                ) : (
                  <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">✓ All products have sufficient stock</p>
                )}
              </div>
            </div>
          </Card>

          {/* Outstanding Payments */}
          <Card className="border-l-4 border-red-500 bg-red-50 dark:bg-red-900/10 p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg flex-shrink-0">
                <DollarSign className="text-red-600 dark:text-red-400" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1">Pending Payments</h3>
                <p className="text-base sm:text-lg font-bold text-red-600 dark:text-red-400">{formatCurrency(stats.outstanding)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <Card title="Monthly Revenue" className="lg:col-span-2 p-3 sm:p-4">
            {monthlyData.length > 0 ? (
              <div className="w-full h-64 sm:h-80 md:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ left: -20, right: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="sales" fill="#0ea5e9" name="Sales" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="gst" fill="#f59e0b" name="GST" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 sm:h-80 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">No data available</div>
            )}
          </Card>

          <Card title="GST Type Distribution" className="p-3 sm:p-4">
            {gstTypeData.length > 0 ? (
              <div className="w-full h-64 sm:h-80 md:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gstTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}`}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {gstTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 sm:h-80 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">No data available</div>
            )}
          </Card>
        </div>

        {/* Recent Invoices */}
        <Card title="Recent Invoices" className="p-3 sm:p-4">
          {recentInvoices.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">{invoice.invoiceNumber}</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{invoice.customerName}</p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2">
                    <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">{formatCurrency(invoice.grandTotal)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                      invoice.paymentStatus === 'paid'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : invoice.paymentStatus === 'partially_paid'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {invoice.paymentStatus === 'partially_paid' ? 'Partial' : invoice.paymentStatus?.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">No invoices yet</p>
          )}
        </Card>
      </div>
    </Layout>
  );
}

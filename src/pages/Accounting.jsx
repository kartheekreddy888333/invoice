import React, { useMemo } from 'react';
import { TrendingUp, DollarSign, Users, AlertCircle } from 'lucide-react';
import Card from '../components/Card';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function Accounting() {
  const {
    invoices,
    products,
    customers,
    getTotalRevenue,
    getTotalProfit,
    getTotalOutstanding,
    calculateInvoiceProfit,
  } = useApp();

  const accountingStats = useMemo(() => {
    const totalRevenue = getTotalRevenue();
    const totalProfit = getTotalProfit();
    const totalCost = totalRevenue - totalProfit;
    const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(2) : 0;
    const outstanding = getTotalOutstanding();

    return {
      totalRevenue,
      totalProfit,
      totalCost,
      profitMargin,
      outstanding,
      avgInvoiceValue: invoices.length > 0 ? totalRevenue / invoices.length : 0,
    };
  }, [invoices, getTotalRevenue, getTotalProfit, getTotalOutstanding]);

  const invoiceByStatus = useMemo(() => {
    const status = { paid: 0, unpaid: 0, partial: 0 };
    invoices.forEach(inv => {
      if (inv.paymentStatus === 'paid') status.paid++;
      else if (inv.paymentStatus === 'unpaid') status.unpaid++;
      else if (inv.paymentStatus === 'partially_paid') status.partial++;
    });
    return [
      { name: 'Paid', value: status.paid, fill: '#10b981' },
      { name: 'Unpaid', value: status.unpaid, fill: '#ef4444' },
      { name: 'Partial', value: status.partial, fill: '#f59e0b' },
    ].filter(d => d.value > 0);
  }, [invoices]);

  const monthlyData = useMemo(() => {
    const months = {};
    invoices.forEach(inv => {
      const date = new Date(inv.createdAt || inv.invoiceDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!months[monthKey]) {
        months[monthKey] = { month: monthKey, revenue: 0, profit: 0, count: 0 };
      }
      months[monthKey].revenue += inv.grandTotal || 0;
      months[monthKey].profit += calculateInvoiceProfit(inv.items || []);
      months[monthKey].count++;
    });

    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
  }, [invoices, calculateInvoiceProfit]);

  const topCustomers = useMemo(() => {
    const customerSales = {};
    invoices.forEach(inv => {
      if (!customerSales[inv.customerId]) {
        const customer = customers.find(c => c.id === inv.customerId);
        customerSales[inv.customerId] = {
          customerId: inv.customerId,
          customerName: customer?.customerName || 'Unknown',
          totalSales: 0,
          invoiceCount: 0,
          profit: 0,
        };
      }
      customerSales[inv.customerId].totalSales += inv.grandTotal || 0;
      customerSales[inv.customerId].invoiceCount++;
      customerSales[inv.customerId].profit += calculateInvoiceProfit(inv.items || []);
    });

    return Object.values(customerSales)
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 10);
  }, [invoices, customers, calculateInvoiceProfit]);

  const outstandingInvoices = useMemo(() => {
    return invoices
      .filter(inv => inv.paymentStatus === 'unpaid' || inv.paymentStatus === 'partially_paid')
      .sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate))
      .slice(0, 10);
  }, [invoices]);

  const productProfitability = useMemo(() => {
    const profitByProduct = {};

    invoices.forEach(inv => {
      (inv.items || []).forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          if (!profitByProduct[item.productId]) {
            profitByProduct[item.productId] = {
              productId: item.productId,
              productName: product.productName,
              quantity: 0,
              revenue: 0,
              cost: 0,
              profit: 0,
            };
          }
          const itemProfit = (product.sellingPrice - product.purchasePrice) * item.quantity;
          profitByProduct[item.productId].quantity += item.quantity;
          profitByProduct[item.productId].revenue += item.rate * item.quantity;
          profitByProduct[item.productId].cost += product.purchasePrice * item.quantity;
          profitByProduct[item.productId].profit += itemProfit;
        }
      });
    });

    return Object.values(profitByProduct)
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 10);
  }, [invoices, products]);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Accounting & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Financial overview and profitability analysis</p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{formatCurrency(accountingStats.totalRevenue)}</p>
              </div>
              <DollarSign size={28} className="text-blue-600 dark:text-blue-400" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Profit</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">{formatCurrency(accountingStats.totalProfit)}</p>
              </div>
              <TrendingUp size={28} className="text-green-600 dark:text-green-400" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Profit Margin</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{accountingStats.profitMargin}%</p>
              </div>
              <BarChart size={28} className="text-orange-600 dark:text-orange-400" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Outstanding</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">{formatCurrency(accountingStats.outstanding)}</p>
              </div>
              <AlertCircle size={28} className="text-red-600 dark:text-red-400" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Avg Invoice</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{formatCurrency(accountingStats.avgInvoiceValue)}</p>
              </div>
              <Users size={28} className="text-purple-600 dark:text-purple-400" />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Invoice Status Pie Chart */}
          {invoiceByStatus.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Invoice Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={invoiceByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {invoiceByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Monthly Revenue vs Profit */}
          {monthlyData.length > 0 && (
            <Card className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Revenue vs Profit</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Revenue" strokeWidth={2} />
                  <Line type="monotone" dataKey="profit" stroke="#10b981" name="Profit" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          )}
        </div>

        {/* Top Customers */}
        {topCustomers.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top 10 Customers</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left px-4 py-3 font-semibold text-gray-900 dark:text-white">Customer</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-900 dark:text-white">Invoices</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-900 dark:text-white">Total Sales</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-900 dark:text-white">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomers.map((customer, idx) => (
                    <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{customer.customerName}</td>
                      <td className="text-right px-4 py-3 text-gray-600 dark:text-gray-400">{customer.invoiceCount}</td>
                      <td className="text-right px-4 py-3 font-semibold text-gray-900 dark:text-white">{formatCurrency(customer.totalSales)}</td>
                      <td className="text-right px-4 py-3 font-semibold text-green-600 dark:text-green-400">{formatCurrency(customer.profit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Outstanding Invoices */}
        {outstandingInvoices.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-red-600" />
              Outstanding Payments ({outstandingInvoices.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left px-4 py-3 font-semibold text-gray-900 dark:text-white">Invoice #</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-900 dark:text-white">Customer</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-900 dark:text-white">Date</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-900 dark:text-white">Amount</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-900 dark:text-white">Outstanding</th>
                  </tr>
                </thead>
                <tbody>
                  {outstandingInvoices.map((inv, idx) => {
                    const customer = customers.find(c => c.id === inv.customerId);
                    return (
                      <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{inv.invoiceNumber}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{customer?.customerName || 'Unknown'}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{new Date(inv.invoiceDate).toLocaleDateString('en-IN')}</td>
                        <td className="text-right px-4 py-3 font-semibold text-gray-900 dark:text-white">{formatCurrency(inv.grandTotal)}</td>
                        <td className="text-right px-4 py-3 font-semibold text-red-600 dark:text-red-400">{formatCurrency(inv.outstandingAmount || inv.grandTotal)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Product Profitability */}
        {productProfitability.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top 10 Profitable Products</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left px-4 py-3 font-semibold text-gray-900 dark:text-white">Product</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-900 dark:text-white">Qty Sold</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-900 dark:text-white">Revenue</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-900 dark:text-white">Cost</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-900 dark:text-white">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {productProfitability.map((product, idx) => (
                    <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{product.productName}</td>
                      <td className="text-right px-4 py-3 text-gray-600 dark:text-gray-400">{product.quantity}</td>
                      <td className="text-right px-4 py-3 font-semibold text-gray-900 dark:text-white">{formatCurrency(product.revenue)}</td>
                      <td className="text-right px-4 py-3 font-semibold text-gray-900 dark:text-white">{formatCurrency(product.cost)}</td>
                      <td className="text-right px-4 py-3 font-semibold text-green-600 dark:text-green-400">{formatCurrency(product.profit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}

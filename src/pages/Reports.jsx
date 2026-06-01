import React, { useMemo, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Card from '../components/Card';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';
import { Select } from '../components/FormInputs';

export default function Reports() {
  const { invoices } = useApp();
  const [reportType, setReportType] = useState('monthly');

  const monthlyData = useMemo(() => {
    const data = {};
    invoices.forEach(inv => {
      if (inv.invoiceDate) {
        const month = new Date(inv.invoiceDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
        if (!data[month]) {
          data[month] = { name: month, sales: 0, gst: 0, count: 0 };
        }
        data[month].sales += inv.grandTotal || 0;
        data[month].gst += (inv.totalCGST || 0) + (inv.totalSGST || 0) + (inv.totalIGST || 0);
        data[month].count += 1;
      }
    });
    return Object.values(data).slice(-12);
  }, [invoices]);

  const gstTypeData = useMemo(() => {
    const data = {};
    invoices.forEach(inv => {
      const type = inv.gstType || 'cgst+sgst';
      if (!data[type]) {
        data[type] = { name: type.toUpperCase(), value: 0, count: 0 };
      }
      data[type].value += inv.grandTotal || 0;
      data[type].count += 1;
    });
    return Object.values(data);
  }, [invoices]);

  const customerSalesData = useMemo(() => {
    const data = {};
    invoices.forEach(inv => {
      if (!data[inv.customerName]) {
        data[inv.customerName] = 0;
      }
      data[inv.customerName] += inv.grandTotal || 0;
    });
    return Object.entries(data)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [invoices]);

  const summary = useMemo(() => {
    return {
      totalInvoices: invoices.length,
      totalSales: invoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0),
      totalGst: invoices.reduce((sum, inv) => sum + (inv.totalCGST || 0) + (inv.totalSGST || 0) + (inv.totalIGST || 0), 0),
      averageInvoice: invoices.length > 0 ? invoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0) / invoices.length : 0,
      paidInvoices: invoices.filter(inv => inv.status === 'paid').length,
      pendingInvoices: invoices.filter(inv => inv.status === 'pending').length,
    };
  }, [invoices]);

  const COLORS = ['#0ea5e9', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">View sales and GST reports</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <p className="text-xs text-gray-600 dark:text-gray-400">Total Invoices</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.totalInvoices}</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-600 dark:text-gray-400">Total Sales</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(summary.totalSales)}</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-600 dark:text-gray-400">Total GST</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(summary.totalGst)}</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-600 dark:text-gray-400">Average Invoice</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(summary.averageInvoice)}</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-600 dark:text-gray-400">Paid</p>
            <p className="text-2xl font-bold text-green-600">{summary.paidInvoices}</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{summary.pendingInvoices}</p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Monthly Sales Trend">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#0ea5e9" strokeWidth={2} name="Sales" />
                  <Line type="monotone" dataKey="gst" stroke="#10b981" strokeWidth={2} name="GST" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">No data</div>
            )}
          </Card>

          <Card title="Top Customers">
            {customerSalesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={customerSalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} formatter={(v) => formatCurrency(v)} />
                  <Bar dataKey="value" fill="#0ea5e9" name="Sales" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">No data</div>
            )}
          </Card>

          <Card title="GST Type Distribution" className="lg:col-span-2">
            {gstTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={gstTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {gstTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">No data</div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}

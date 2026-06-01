import React, { useState, useMemo } from 'react';
import { TrendingDown, TrendingUp, Download } from 'lucide-react';
import Card from '../components/Card';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';

export default function StockMovement() {
  const { stockMovements, products } = useApp();
  const [filterType, setFilterType] = useState('all');

  const filteredMovements = useMemo(() => {
    if (filterType === 'all') return stockMovements;
    return stockMovements.filter(m => m.type === filterType);
  }, [stockMovements, filterType]);

  const columns = [
    { key: 'timestamp', label: 'Date & Time', sortable: true, render: (v) => new Date(v).toLocaleString('en-IN') },
    { key: 'productName', label: 'Product', sortable: true },
    { 
      key: 'type', 
      label: 'Type', 
      sortable: true,
      render: (v) => (
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${v === 'addition' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
          {v === 'addition' ? '↑ Addition' : '↓ Deduction'}
        </div>
      )
    },
    { key: 'quantity', label: 'Quantity', sortable: true, render: (v, row) => `${v} ${row.unit || ''}` },
    { key: 'reason', label: 'Reason', sortable: true },
    { 
      key: 'balanceBefore', 
      label: 'Stock Before',
      render: (v, row) => `${v} ${row.unit || ''}`
    },
    { 
      key: 'balanceAfter', 
      label: 'Stock After',
      render: (v, row) => `${v} ${row.unit || ''}`
    },
  ];

  const stats = [
    {
      label: 'Total Stock Deductions',
      value: stockMovements.filter(m => m.type === 'deduction').length,
      icon: TrendingDown,
      color: 'red'
    },
    {
      label: 'Total Stock Additions',
      value: stockMovements.filter(m => m.type === 'addition').length,
      icon: TrendingUp,
      color: 'green'
    },
    {
      label: 'Total Movements',
      value: stockMovements.length,
      icon: TrendingDown,
      color: 'blue'
    },
  ];

  const productSummary = useMemo(() => {
    const summary = {};
    stockMovements.forEach(movement => {
      if (!summary[movement.productId]) {
        const product = products.find(p => p.id === movement.productId);
        summary[movement.productId] = {
          productName: movement.productName,
          totalDeductions: 0,
          totalAdditions: 0,
          unit: product?.unit || '',
          currentStock: product?.currentStock || 0,
        };
      }
      if (movement.type === 'deduction') {
        summary[movement.productId].totalDeductions += movement.quantity;
      } else {
        summary[movement.productId].totalAdditions += movement.quantity;
      }
    });
    return Object.values(summary);
  }, [stockMovements, products]);

  const exportToCSV = () => {
    let csv = 'Date,Product,Type,Quantity,Reason,Stock Before,Stock After\n';
    filteredMovements.forEach(m => {
      csv += `"${new Date(m.timestamp).toLocaleString('en-IN')}","${m.productName}","${m.type}","${m.quantity}","${m.reason}","${m.balanceBefore}","${m.balanceAfter}"\n`;
    });
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `stock-movement-${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stock Movement Report</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Track all inventory changes</p>
          </div>
          <Button onClick={exportToCSV} variant="primary">
            <Download size={20} />
            Export CSV
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <Card key={idx}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                </div>
                <stat.icon size={32} className={`text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterType === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}
          >
            All ({stockMovements.length})
          </button>
          <button
            onClick={() => setFilterType('deduction')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterType === 'deduction' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}
          >
            Deductions ({stockMovements.filter(m => m.type === 'deduction').length})
          </button>
          <button
            onClick={() => setFilterType('addition')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterType === 'addition' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}
          >
            Additions ({stockMovements.filter(m => m.type === 'addition').length})
          </button>
        </div>

        {/* Movements Table */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Stock Movements</h3>
          {filteredMovements.length > 0 ? (
            <DataTable
              columns={columns}
              data={filteredMovements}
              searchable
              pagination
            />
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">No stock movements recorded</p>
          )}
        </Card>

        {/* Product Summary */}
        {productSummary.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product-wise Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left px-4 py-3 font-semibold text-gray-900 dark:text-white">Product</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-900 dark:text-white">Total Deductions</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-900 dark:text-white">Total Additions</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-900 dark:text-white">Net Change</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-900 dark:text-white">Current Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {productSummary.map((product, idx) => {
                    const netChange = product.totalAdditions - product.totalDeductions;
                    return (
                      <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{product.productName}</td>
                        <td className="text-right px-4 py-3 text-red-600 dark:text-red-400">{product.totalDeductions} {product.unit}</td>
                        <td className="text-right px-4 py-3 text-green-600 dark:text-green-400">{product.totalAdditions} {product.unit}</td>
                        <td className={`text-right px-4 py-3 font-semibold ${netChange < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                          {netChange > 0 ? '+' : ''}{netChange} {product.unit}
                        </td>
                        <td className="text-right px-4 py-3 text-gray-900 dark:text-white font-semibold">{product.currentStock} {product.unit}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}

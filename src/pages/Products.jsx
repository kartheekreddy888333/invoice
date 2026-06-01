import React, { useState, useMemo } from 'react';
import { Plus, AlertCircle, TrendingDown } from 'lucide-react';
import Card from '../components/Card';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { Input, Select } from '../components/FormInputs';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';

const UNITS = [
  { value: 'nos', label: 'Nos' },
  { value: 'kg', label: 'Kg' },
  { value: 'g', label: 'Gram' },
  { value: 'ltr', label: 'Liter' },
  { value: 'box', label: 'Box' },
  { value: 'pkt', label: 'Packet' },
  { value: 'pc', label: 'Piece' },
  { value: 'm', label: 'Meter' },
];

const GST_RATES = [
  { value: '0', label: '0%' },
  { value: '5', label: '5%' },
  { value: '12', label: '12%' },
  { value: '18', label: '18%' },
  { value: '28', label: '28%' },
];

const CATEGORIES = [
  { value: 'Fruits', label: 'Fruits' },
  { value: 'Vegetables', label: 'Vegetables' },
  { value: 'Grains', label: 'Grains' },
  { value: 'Dairy', label: 'Dairy' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Clothing', label: 'Clothing' },
  { value: 'Other', label: 'Other' },
];

export default function Products() {
  const { products, setProducts, getLowStockAlerts, getOutOfStockProducts, addNotification, hsnCodes } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filterStock, setFilterStock] = useState('all');
  const [formData, setFormData] = useState({
    productName: '',
    skuCode: '',
    barcode: '',
    hsnCode: '',
    category: '',
    unit: '',
    purchasePrice: '',
    sellingPrice: '',
    gstRate: '18',
    openingStock: '',
    currentStock: '',
    minimumStock: '',
    productImage: null,
  });

  const lowStockProducts = useMemo(() => getLowStockAlerts(), [products, getLowStockAlerts]);
  const outOfStockProducts = useMemo(() => getOutOfStockProducts(), [products, getOutOfStockProducts]);

  const filteredProducts = useMemo(() => {
    if (filterStock === 'low') return lowStockProducts;
    if (filterStock === 'outofstock') return outOfStockProducts;
    return products;
  }, [products, filterStock, lowStockProducts, outOfStockProducts]);

  const columns = [
    { key: 'productName', label: 'Product Name', sortable: true },
    { key: 'skuCode', label: 'SKU Code', sortable: true },
    { 
      key: 'currentStock', 
      label: 'Stock', 
      sortable: true,
      render: (value, row) => {
        const isLow = value <= row.minimumStock && value > 0;
        const isOut = value === 0;
        return (
          <div className={`font-semibold ${isOut ? 'text-red-600 dark:text-red-400' : isLow ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
            {value} {row.unit}
            {isLow && <div className="text-xs text-orange-600 dark:text-orange-400">Low Stock</div>}
            {isOut && <div className="text-xs text-red-600 dark:text-red-400">Out of Stock</div>}
          </div>
        );
      }
    },
    { key: 'unit', label: 'Unit', sortable: true },
    { key: 'sellingPrice', label: 'Sell Price', render: (v) => formatCurrency(v) },
    { key: 'gstRate', label: 'GST %', render: (v) => `${v}%` },
    { 
      key: 'minimumStock', 
      label: 'Min Stock', 
      render: (value, row) => `${value} ${row.unit}`
    },
  ];

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        productName: '',
        skuCode: '',
        barcode: '',
        hsnCode: '',
        category: '',
        unit: '',
        purchasePrice: '',
        sellingPrice: '',
        gstRate: '18',
        openingStock: '',
        currentStock: '',
        minimumStock: '',
        productImage: null,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'purchasePrice' || name === 'sellingPrice' || name === 'gstRate' || name === 'openingStock' || name === 'currentStock' || name === 'minimumStock' 
        ? parseFloat(value) || '' 
        : value
    }));
  };

  const handleSaveProduct = () => {
    if (!formData.productName || !formData.skuCode || !formData.unit || !formData.sellingPrice || formData.minimumStock === '') {
      addNotification('Please fill all required fields', 'error');
      return;
    }

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...formData, id: p.id } : p));
      addNotification('Product updated successfully!', 'success');
    } else {
      const newProduct = {
        ...formData,
        id: `prod-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      setProducts([...products, newProduct]);
      addNotification('Product added successfully!', 'success');
    }
    handleCloseModal();
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
      addNotification('Product deleted successfully!', 'success');
    }
  };

  const totalValue = useMemo(() => {
    return products.reduce((sum, p) => sum + (p.currentStock * p.sellingPrice), 0);
  }, [products]);

  const stats = [
    { label: 'Total Products', value: products.length, color: 'blue' },
    { label: 'Total Stock Value', value: formatCurrency(totalValue), color: 'green' },
    { label: 'Low Stock Alerts', value: lowStockProducts.length, color: 'orange', icon: AlertCircle },
    { label: 'Out of Stock', value: outOfStockProducts.length, color: 'red', icon: TrendingDown },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{products.length} total products • {formatCurrency(totalValue)} total value</p>
          </div>
          <Button onClick={() => handleOpenModal()} variant="primary">
            <Plus size={20} />
            Add Product
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <Card key={idx}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                </div>
                {stat.icon && <stat.icon size={24} className={`text-${stat.color}-600 dark:text-${stat.color}-400`} />}
              </div>
            </Card>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setFilterStock('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStock === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}
          >
            All ({products.length})
          </button>
          <button
            onClick={() => setFilterStock('low')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStock === 'low' ? 'bg-orange-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}
          >
            Low Stock ({lowStockProducts.length})
          </button>
          <button
            onClick={() => setFilterStock('outofstock')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStock === 'outofstock' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}
          >
            Out of Stock ({outOfStockProducts.length})
          </button>
        </div>

        <Card>
          <DataTable
            columns={columns}
            data={filteredProducts}
            onEdit={handleOpenModal}
            onDelete={handleDeleteProduct}
            searchable
            pagination
          />
        </Card>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Name *</label>
              <Input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SKU Code *</label>
              <Input
                type="text"
                name="skuCode"
                value={formData.skuCode}
                onChange={handleInputChange}
                placeholder="e.g., SKU-PROD-001"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Barcode</label>
              <Input
                type="text"
                name="barcode"
                value={formData.barcode}
                onChange={handleInputChange}
                placeholder="Enter barcode"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">HSN/SAC Code</label>
              <Input
                type="text"
                name="hsnCode"
                value={formData.hsnCode}
                onChange={handleInputChange}
                placeholder="Enter HSN code"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                options={CATEGORIES}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit *</label>
              <Select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                options={UNITS}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Purchase Price *</label>
              <Input
                type="number"
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleInputChange}
                placeholder="Cost price"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selling Price *</label>
              <Input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleInputChange}
                placeholder="Sale price"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GST Rate</label>
              <Select
                name="gstRate"
                value={formData.gstRate}
                onChange={handleInputChange}
                options={GST_RATES}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Opening Stock</label>
              <Input
                type="number"
                name="openingStock"
                value={formData.openingStock}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Stock</label>
              <Input
                type="number"
                name="currentStock"
                value={formData.currentStock}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Minimum Stock Alert *</label>
            <Input
              type="number"
              name="minimumStock"
              value={formData.minimumStock}
              onChange={handleInputChange}
              placeholder="Alert when stock falls below this"
              min="0"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={handleSaveProduct} variant="primary" className="flex-1">
            {editingProduct ? 'Update Product' : 'Add Product'}
          </Button>
          <Button onClick={handleCloseModal} variant="outline" className="flex-1">
            Cancel
          </Button>
        </div>
      </Modal>
    </Layout>
  );
}

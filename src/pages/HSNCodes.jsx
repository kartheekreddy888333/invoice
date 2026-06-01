import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Card from '../components/Card';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { Input, Select } from '../components/FormInputs';
import { useApp } from '../context/AppContext';

const GST_RATES = [
  { value: '0', label: '0%' },
  { value: '5', label: '5%' },
  { value: '12', label: '12%' },
  { value: '18', label: '18%' },
  { value: '28', label: '28%' },
];

export default function HSNCodes() {
  const { hsnCodes, setHsnCodes, addNotification } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHsn, setEditingHsn] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    category: '',
    gstRate: '',
  });

  const columns = [
    { key: 'code', label: 'HSN Code' },
    { key: 'category', label: 'Category' },
    { key: 'gstRate', label: 'GST Rate', render: (v) => `${v}%` },
  ];

  const handleOpen = (hsn = null) => {
    if (hsn) {
      setFormData(hsn);
      setEditingHsn(hsn);
    } else {
      setFormData({ code: '', category: '', gstRate: '' });
      setEditingHsn(null);
    }
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingHsn(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingHsn) {
      const updated = hsnCodes.map(h => h.code === editingHsn.code ? formData : h);
      setHsnCodes(updated);
      addNotification('HSN code updated!', 'success');
    } else {
      setHsnCodes([...hsnCodes, { ...formData, gstRate: parseInt(formData.gstRate) }]);
      addNotification('HSN code added!', 'success');
    }

    handleClose();
  };

  const handleDelete = (hsn) => {
    if (confirm('Delete this HSN code?')) {
      setHsnCodes(hsnCodes.filter(h => h.code !== hsn.code));
      addNotification('HSN code deleted!', 'success');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">HSN Codes</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{hsnCodes.length} HSN codes</p>
          </div>
          <Button onClick={() => handleOpen()} icon={Plus}>
            Add HSN Code
          </Button>
        </div>

        <Card>
          <DataTable
            columns={columns}
            data={hsnCodes}
            onEdit={handleOpen}
            onDelete={handleDelete}
            searchable
            pagination
          />
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={editingHsn ? 'Edit HSN Code' : 'Add HSN Code'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="HSN Code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="8 digit code"
            required
            disabled={editingHsn}
          />
          <Input
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Product category"
            required
          />
          <Select
            label="GST Rate"
            name="gstRate"
            value={formData.gstRate}
            onChange={handleChange}
            options={GST_RATES}
            required
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" fullWidth>
              {editingHsn ? 'Update' : 'Add'} HSN Code
            </Button>
            <Button type="button" variant="secondary" onClick={handleClose} fullWidth>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}

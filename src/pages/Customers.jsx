import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Card from '../components/Card';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { Input, Select } from '../components/FormInputs';
import { useApp } from '../context/AppContext';

const STATES = [
  { value: '01', label: 'Andhra Pradesh' },
  { value: '02', label: 'Arunachal Pradesh' },
  { value: '03', label: 'Assam' },
  { value: '04', label: 'Bihar' },
  { value: '05', label: 'Chhattisgarh' },
  { value: '06', label: 'Goa' },
  { value: '07', label: 'Gujarat' },
  { value: '08', label: 'Haryana' },
  { value: '09', label: 'Himachal Pradesh' },
  { value: '10', label: 'Jharkhand' },
  { value: '11', label: 'Karnataka' },
  { value: '12', label: 'Kerala' },
  { value: '13', label: 'Madhya Pradesh' },
  { value: '14', label: 'Maharashtra' },
  { value: '15', label: 'Manipur' },
  { value: '16', label: 'Meghalaya' },
  { value: '17', label: 'Mizoram' },
  { value: '18', label: 'Nagaland' },
  { value: '19', label: 'Odisha' },
  { value: '20', label: 'Punjab' },
  { value: '21', label: 'Rajasthan' },
  { value: '22', label: 'Sikkim' },
  { value: '23', label: 'Tamil Nadu' },
  { value: '24', label: 'Telangana' },
  { value: '25', label: 'Tripura' },
  { value: '26', label: 'Uttar Pradesh' },
  { value: '27', label: 'Uttarakhand' },
  { value: '28', label: 'West Bengal' },
  { value: '29', label: 'Puducherry' },
  { value: '30', label: 'Lakshadweep' },
  { value: '31', label: 'Daman and Diu' },
  { value: '32', label: 'Dadra and Nagar Haveli' },
  { value: '33', label: 'Chandigarh' },
  { value: '34', label: 'Delhi' },
  { value: '35', label: 'Jammu and Kashmir' },
  { value: '36', label: 'Ladakh' },
];

export default function Customers() {
  const { customers, setCustomers, addNotification } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    mobileNumber: '',
    email: '',
    gstin: '',
    address: '',
    state: '',
    stateCode: '',
  });

  const columns = [
    { key: 'customerName', label: 'Customer Name' },
    { key: 'mobileNumber', label: 'Mobile' },
    { key: 'email', label: 'Email' },
    { key: 'state', label: 'State' },
    { key: 'gstin', label: 'GSTIN' },
  ];

  const handleOpen = (customer = null) => {
    if (customer) {
      setFormData(customer);
      setEditingCustomer(customer);
    } else {
      setFormData({
        customerName: '',
        mobileNumber: '',
        email: '',
        gstin: '',
        address: '',
        state: '',
        stateCode: '',
      });
      setEditingCustomer(null);
    }
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    const state = STATES.find(s => s.value === stateCode);
    setFormData(prev => ({
      ...prev,
      stateCode,
      state: state?.label || '',
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingCustomer) {
      const updated = customers.map(c => c.id === editingCustomer.id ? { ...formData, id: editingCustomer.id } : c);
      setCustomers(updated);
      addNotification('Customer updated successfully!', 'success');
    } else {
      const newCustomer = {
        ...formData,
        id: Date.now(),
      };
      setCustomers([...customers, newCustomer]);
      addNotification('Customer added successfully!', 'success');
    }

    handleClose();
  };

  const handleDelete = (customer) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(c => c.id !== customer.id));
      addNotification('Customer deleted successfully!', 'success');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customers</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{customers.length} total customers</p>
          </div>
          <Button
            onClick={() => handleOpen()}
            icon={Plus}
          >
            Add Customer
          </Button>
        </div>

        <Card>
          <DataTable
            columns={columns}
            data={customers}
            onEdit={handleOpen}
            onDelete={handleDelete}
            searchable
            pagination
          />
        </Card>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={editingCustomer ? 'Edit Customer' : 'Add Customer'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Customer Name"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Enter customer name"
            required
          />
          <Input
            label="Mobile Number"
            name="mobileNumber"
            type="tel"
            value={formData.mobileNumber}
            onChange={handleChange}
            placeholder="Enter mobile number"
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
          <Input
            label="GSTIN"
            name="gstin"
            value={formData.gstin}
            onChange={handleChange}
            placeholder="Enter GSTIN (optional)"
          />
          <Select
            label="State"
            name="state"
            value={formData.stateCode}
            onChange={handleStateChange}
            options={STATES}
          />
          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" fullWidth>
              {editingCustomer ? 'Update' : 'Add'} Customer
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

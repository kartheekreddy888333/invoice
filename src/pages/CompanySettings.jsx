import React, { useState } from 'react';
import { Upload, Save } from 'lucide-react';
import Card from '../components/Card';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { Input, Textarea, Select } from '../components/FormInputs';
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

export default function CompanySettings() {
  const { company, setCompany, addNotification } = useApp();
  const [formData, setFormData] = useState(company || {
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
    website: 'www.k2cagro.com'
  });

  const [loading, setLoading] = useState(false);

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

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          logo: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setCompany(formData);
      setLoading(false);
      addNotification('Company settings saved successfully!', 'success');
    }, 500);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Company Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your company information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Section */}
          <Card title="Company Logo">
            <div className="flex gap-6">
              {formData.logo && (
                <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <label className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer transition-colors">
                  <Upload size={18} />
                  Upload Logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Recommended: 200x200px</p>
              </div>
            </div>
          </Card>

          {/* Company Information */}
          <Card title="Company Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
                required
              />
              <Input
                label="GSTIN"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
                placeholder="Enter GSTIN"
                required
              />
              <Input
                label="PAN Number"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                placeholder="Enter PAN"
              />
              <Select
                label="State"
                name="state"
                value={formData.stateCode}
                onChange={handleStateChange}
                options={STATES}
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
                label="Mobile"
                name="mobile"
                type="tel"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter mobile number"
              />
              <Input
                label="Website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="Enter website URL"
              />
            </div>
            <div className="mt-4">
              <Textarea
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter full address"
              />
            </div>
          </Card>

          {/* Bank Details */}
          <Card title="Bank Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Bank Name"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="Enter bank name"
              />
              <Input
                label="Account Number"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Enter account number"
              />
              <Input
                label="IFSC Code"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                placeholder="Enter IFSC code"
              />
              <Input
                label="UPI ID"
                name="upiId"
                value={formData.upiId}
                onChange={handleChange}
                placeholder="Enter UPI ID"
              />
            </div>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="submit"
              loading={loading}
              icon={Save}
              fullWidth
            >
              Save Settings
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

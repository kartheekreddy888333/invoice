// @ts-nocheck
import React, { useEffect, useState } from 'react';
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

const getDefaultCompanyData = () => ({
  companyName: 'K2C AGRO TECH INDIA PRIVATE LIMITED',
  gstin: '37AAMCK2090D1ZJ',
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
});

export default function CompanySettings() {
  const { company, setCompany, addNotification, companyOptions, activeCompanyId } = useApp();
  const [formData, setFormData] = useState(company || getDefaultCompanyData());
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setFormData(company || getDefaultCompanyData());
    setIsEditing(false);
  }, [company, activeCompanyId]);

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

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFormData(company || getDefaultCompanyData());
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEditing) return;

    setCompany(formData);
    setIsEditing(false);
    addNotification('Company settings saved successfully!', 'success');
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Company Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your company information</p>
          <p className="text-sm text-primary-600 dark:text-primary-400 mt-1 font-medium">
            Active profile: {companyOptions.find(option => option.id === activeCompanyId)?.label || company?.companyName}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {!isEditing ? (
              <Button type="button" variant="outline" onClick={handleStartEdit}>
                Edit Settings
              </Button>
            ) : (
              <>
                <span className="text-sm text-gray-500 dark:text-gray-400">Editing enabled. Save to keep these changes permanently.</span>
                <Button type="button" variant="secondary" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </>
            )}
          </div>
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
                <label className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isEditing ? 'bg-primary-600 text-white hover:bg-primary-700 cursor-pointer' : 'bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-300 cursor-not-allowed'}`}>
                  <Upload size={18} />
                  Upload Logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={!isEditing}
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
                disabled={!isEditing}
              />
              <Input
                label="GSTIN"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
                placeholder="Enter GSTIN"
                required
                disabled={!isEditing}
              />
              <Input
                label="PAN Number"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                placeholder="Enter PAN"
                disabled={!isEditing}
              />
              <Select
                label="State"
                name="state"
                value={formData.stateCode}
                onChange={handleStateChange}
                options={STATES}
                required
                disabled={!isEditing}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                disabled={!isEditing}
              />
              <Input
                label="Mobile"
                name="mobile"
                type="tel"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter mobile number"
                disabled={!isEditing}
              />
              <Input
                label="Website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="Enter website URL"
                disabled={!isEditing}
              />
            </div>
            <div className="mt-4">
              <Textarea
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter full address"
                disabled={!isEditing}
              />
            </div>
          </Card>

          {/* Submit */}
          {isEditing && (
            <div className="flex gap-4">
              <Button
                type="submit"
                icon={Save}
                fullWidth
              >
                Save Settings
              </Button>
            </div>
          )}
        </form>
      </div>
    </Layout>
  );
}

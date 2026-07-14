// @ts-nocheck
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Package, BarChart3, Settings, LogOut, Menu, X, TrendingUp, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Sidebar({ isCollapsed, onToggleCollapse }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode, setDarkMode, company, logout } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/invoices', label: 'Invoices', icon: FileText },
    { path: '/customers', label: 'Customers', icon: Users },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/stock-movement', label: 'Stock Movement', icon: Activity },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
    { path: '/accounting', label: 'Accounting', icon: TrendingUp },
    { path: '/hsn-codes', label: 'HSN Codes', icon: Package },
    { path: '/company', label: 'Settings', icon: Settings },
  ];

  const isActive = (/** @type {string} */ path) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-600 dark:bg-blue-700 text-white shadow-lg hover:bg-blue-700"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Collapse Button */}
      <button
        className="hidden md:block absolute top-6 right-2 lg:right-6 z-50 p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
        onClick={onToggleCollapse}
        aria-label="Toggle sidebar"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-all duration-300 z-40 overflow-y-auto
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:translate-x-0
          ${isCollapsed ? 'md:w-20' : 'md:w-64'} w-64`}
      >
        {/* Logo Section */}
        <div className={`p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800 transition-all duration-300 ${isCollapsed ? 'md:p-3' : ''}`}>
          <div className={`flex items-center gap-3 ${isCollapsed ? 'md:justify-center' : ''}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">₹</span>
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-bold text-lg text-gray-900 dark:text-white">GST Invoice</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Generator</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 truncate max-w-[13rem]">{company?.companyName}</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-2 sm:p-4 space-y-1 sm:space-y-2">
          {menuItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all ${
                isActive(path)
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              } ${isCollapsed ? 'md:justify-center md:px-2' : ''}`}
              title={isCollapsed ? label : ''}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!isCollapsed && <span className="font-medium text-sm sm:text-base">{label}</span>}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 border-t border-gray-200 dark:border-gray-800 space-y-2 sm:space-y-3 bg-white dark:bg-gray-900">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-full px-3 sm:px-4 py-2 sm:py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs sm:text-sm font-medium ${isCollapsed ? 'md:px-2' : ''}`}
            title={isCollapsed ? (darkMode ? 'Light Mode' : 'Dark Mode') : ''}
          >
            {isCollapsed ? (darkMode ? '☀️' : '🌙') : (darkMode ? '☀️ Light Mode' : '🌙 Dark Mode')}
          </button>
          <button
            onClick={() => {
              logout();
              setIsMobileMenuOpen(false);
              navigate('/login', { replace: true });
            }}
            className={`w-full px-3 sm:px-4 py-2 sm:py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-xs sm:text-sm font-medium flex items-center gap-2 ${isCollapsed ? 'md:px-2 md:justify-center' : 'justify-center'}`}
            title={isCollapsed ? 'Logout' : ''}
          >
            <LogOut size={16} />
            {!isCollapsed && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

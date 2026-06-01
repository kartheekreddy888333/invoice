import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

export default function Header() {
  const { notifications, removeNotification } = useApp();

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 md:left-64 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 z-30">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Welcome to GST Invoice Generator</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>
      </header>

      {/* Notifications */}
      <div className="fixed top-20 right-6 z-50 space-y-3 pointer-events-none">
        {notifications.map(notification => {
          const Icon = {
            success: CheckCircle,
            error: XCircle,
            warning: AlertCircle,
            info: Info,
          }[notification.type] || Info;

          const colors = {
            success: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
            error: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
            warning: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
            info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
          }[notification.type] || 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';

          return (
            <div
              key={notification.id}
              className={`${colors} border rounded-lg p-4 flex items-center gap-3 shadow-lg pointer-events-auto animate-slideIn`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{notification.message}</span>
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-auto text-lg opacity-50 hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

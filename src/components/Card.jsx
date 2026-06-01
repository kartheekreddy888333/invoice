import React from 'react';

export default function Card({ children, className = '', title, subtitle, icon: Icon }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {(title || Icon) && (
        <div className="mb-4 flex items-center gap-3">
          {Icon && (
            <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <Icon className="text-primary-600 dark:text-primary-400" size={24} />
            </div>
          )}
          <div>
            {title && <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>}
            {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

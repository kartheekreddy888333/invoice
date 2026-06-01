import React from 'react';

export default function Card({ children, className = '', title, subtitle, icon: Icon }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-6 ${className}`}>
      {(title || Icon) && (
        <div className="mb-2 sm:mb-3 md:mb-4 flex items-center gap-2 sm:gap-3">
          {Icon && (
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0">
              <Icon className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            {title && <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">{title}</h3>}
            {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

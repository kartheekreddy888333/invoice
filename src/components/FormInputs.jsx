import React from 'react';

export function Input({
  label,
  error,
  required,
  icon: Icon,
  ...props
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
        )}
        <input
          {...props}
          className={`w-full px-4 py-2 ${Icon ? 'pl-10' : ''} rounded-lg border transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
            error
              ? 'border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500'
          }`}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export function Textarea({
  label,
  error,
  required,
  rows = 4,
  ...props
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <textarea
        {...props}
        rows={rows}
        className={`w-full px-4 py-2 rounded-lg border transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none ${
          error
            ? 'border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500'
            : 'border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500'
        }`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export function Select({
  label,
  error,
  required,
  options = [],
  placeholder = 'Select...',
  ...props
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <select
        {...props}
        className={`w-full px-4 py-2 rounded-lg border transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none ${
          error
            ? 'border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500'
            : 'border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export function Checkbox({
  label,
  error,
  ...props
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          {...props}
          type="checkbox"
          className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      </label>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

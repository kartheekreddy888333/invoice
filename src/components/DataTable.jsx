import React, { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, Edit, Trash2 } from 'lucide-react';

export default function DataTable({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  searchable = true,
  pagination = true,
  itemsPerPage = 10 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const filteredData = useMemo(() => {
    let result = data;

    // Search
    if (searchable && searchTerm) {
      result = result.filter(item =>
        columns.some(col =>
          String(item[col.key] || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (typeof aVal === 'string') {
          return sortConfig.direction === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        return sortConfig.direction === 'asc'
          ? aVal - bVal
          : bVal - aVal;
      });
    }

    return result;
  }, [data, searchTerm, sortConfig, columns, searchable]);

  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData;

    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    return filteredData.slice(startIdx, endIdx);
  }, [filteredData, currentPage, pagination, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Search Bar */}
      {searchable && (
        <div className="p-2 sm:p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent outline-none w-full text-sm text-gray-900 dark:text-white placeholder-gray-500"
            />
          </div>
        </div>
      )}

      {/* Table - Desktop View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`px-3 sm:px-4 md:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 ${
                    col.sortable !== false ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600' : ''
                  }`}
                >
                  <div className="flex items-center gap-1 sm:gap-2">
                    {col.label}
                    {col.sortable !== false && (
                      <>
                        {sortConfig.key === col.key && (
                          sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )}
                      </>
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && <th className="px-3 sm:px-4 md:px-6 py-3 text-right text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-3 sm:px-4 md:px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  No data found
                </td>
              </tr>
            ) : (
              paginatedData.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  {columns.map(col => (
                    <td key={col.key} className="px-3 sm:px-4 md:px-6 py-3 text-xs sm:text-sm text-gray-900 dark:text-gray-100">
                      <span className="line-clamp-1">
                        {col.render ? col.render(item[col.key], item) : item[col.key]}
                      </span>
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-3 sm:px-4 md:px-6 py-3 text-right">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="p-1.5 sm:p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            className="p-1.5 sm:p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden divide-y divide-gray-200 dark:divide-gray-700">
        {paginatedData.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            No data found
          </div>
        ) : (
          paginatedData.map((item, idx) => (
            <div
              key={idx}
              className="p-3 sm:p-4 space-y-2"
            >
              {columns.slice(0, 3).map(col => (
                <div key={col.key} className="flex justify-between items-start gap-2">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{col.label}:</span>
                  <span className="text-xs text-gray-900 dark:text-gray-100 text-right flex-1">
                    {col.render ? col.render(item[col.key], item) : item[col.key]}
                  </span>
                </div>
              ))}
              {(onEdit || onDelete) && (
                <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className="flex-1 px-2 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors flex items-center justify-center gap-1"
                    >
                      <Edit size={14} /> Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item)}
                      className="flex-1 px-2 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors flex items-center justify-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length}
          </p>
          <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Prev
            </button>
            {totalPages <= 5 ? (
              [...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs transition-colors ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))
            ) : (
              <>
                {currentPage > 2 && (
                  <>
                    <button
                      onClick={() => setCurrentPage(1)}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      1
                    </button>
                    <span className="px-2 text-gray-500">...</span>
                  </>
                )}
                {[Math.max(1, currentPage - 1), currentPage, Math.min(totalPages, currentPage + 1)].filter((v, i, a) => a.indexOf(v) === i).map(i => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs transition-colors ${
                      currentPage === i
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {i}
                  </button>
                ))}
                {currentPage < totalPages - 1 && (
                  <>
                    <span className="px-2 text-gray-500">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </>
            )}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

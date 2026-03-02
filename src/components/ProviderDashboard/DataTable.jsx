import React, { useState } from 'react';

const DataTable = ({ 
  title, 
  addButtonLabel, 
  onAddClick, 
  columns = [], 
  data = [], 
  loading = false, 
  error = null,
  searchPlaceholder = "Search..."
}) => {
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = data.filter(item => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="p-6 bg-[#f8f9fa] min-h-screen">
      {/* Header Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#04364A]">{title}</h1>
        {addButtonLabel && (
          <button
            onClick={onAddClick}
            className="bg-[#04364A] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#04364A]/90 transition-colors"
          >
            <i className="fa-solid fa-plus"></i>
            {addButtonLabel}
          </button>
        )}
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Show</span>
          <select 
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-[#04364A] outline-none"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>Entries</span>
        </div>

        <div className="flex items-center w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-l px-3 py-1.5 focus:ring-0 focus:border-gray-300 outline-none text-sm"
            />
          </div>
          <button className="bg-[#04364A] text-white px-4 py-2 rounded-r hover:bg-[#04364A]/90 transition-colors">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#04364A] text-white">
                <tr>
                  {columns.map((col, idx) => (
                    <th 
                      key={idx} 
                      className={`px-6 py-4 font-semibold uppercase tracking-wider text-center ${col.className || ''}`}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.length > 0 ? (
                  filteredData.slice(0, entriesPerPage).map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-gray-50 transition-colors text-center">
                      {columns.map((col, colIdx) => (
                        <td key={colIdx} className="px-6 py-4">
                          {col.render ? col.render(row) : row[col.accessor]}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-10 text-center text-gray-500">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
        <div>
          Showing 1 to {Math.min(entriesPerPage, filteredData.length)} of {filteredData.length} entries
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 text-gray-400 hover:text-[#04364A] transition-colors disabled:opacity-50">
            <i className="fa-solid fa-chevron-left text-xs"></i>
          </button>
          <button className="w-8 h-8 rounded bg-[#04364A] text-white">1</button>
          <button className="w-8 h-8 rounded border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500">2</button>
          <button className="w-8 h-8 rounded border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500">3</button>
          <button className="p-2 text-gray-400 hover:text-[#04364A] transition-colors">
            <i className="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;

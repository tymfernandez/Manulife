import React from 'react';

const Pagination = ({ 
  currentPage, 
  setCurrentPage, 
  totalPages, 
  filteredCount 
}) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Rows per page</span>
        <select className="border border-gray-200 rounded px-2 py-1 text-sm">
          <option>10</option>
          <option>25</option>
          <option>50</option>
        </select>
        <span className="text-sm text-gray-600">of {filteredCount} rows</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          ‹
        </button>
        
        {[...Array(Math.min(5, totalPages))].map((_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`px-3 py-1 border rounded text-sm ${
                currentPage === pageNum
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        
        {totalPages > 5 && (
          <>
            <span className="px-2 text-gray-400">...</span>
            <button
              onClick={() => setCurrentPage(totalPages)}
              className="px-3 py-1 border border-gray-200 rounded text-sm hover:bg-gray-50"
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default Pagination;
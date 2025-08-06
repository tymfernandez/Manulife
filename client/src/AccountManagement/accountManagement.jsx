import React, { useState, useEffect } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import AccountFilters from '../components/accountFilters';
import AccountTable from '../components/accountTable';
import Pagination from '../components/pagination';

const AccountManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { accounts, loading, error, searchAccounts, deleteAccount } = useAccounts();

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      searchAccounts(searchTerm, roleFilter, statusFilter);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, roleFilter, statusFilter]);

  const totalPages = Math.ceil(accounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAccounts = accounts.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading accounts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Account Management</h1>
        <p className="text-gray-600">Manage, create, update, delete accounts .</p>
      </div>

      <AccountFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <AccountTable accounts={paginatedAccounts} onDelete={deleteAccount} />
      
      <Pagination 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        filteredCount={accounts.length}
      />
    </div>
  );
};

export default AccountManagement;
import React, { useState } from 'react';
import { accountsData } from '../data/accountsData';
import AccountFilters from '../components/AccountFilters';
import AccountTable from './components/AccountTable';
import Pagination from '../components/Pagination';

const AccountManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredAccounts = accountsData.filter(account => {
    return (
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (roleFilter === '' || account.role === roleFilter) &&
      (statusFilter === '' || account.status === statusFilter)
    );
  });

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAccounts = filteredAccounts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6">
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

      <AccountTable accounts={paginatedAccounts} />
      
      <Pagination 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        filteredCount={filteredAccounts.length}
      />
    </div>
  );
};

export default AccountManagement;
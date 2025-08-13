import React, { useState, useEffect } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import AccountFilters from '../components/AccountFilters';
import AccountTable from '../components/AccountTable';
import Pagination from '../components/Pagination';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const AccountManagement = () => {
  const [activeItem, setActiveItem] = useState('accounts');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { accounts, loading, error, fetchAccounts, deleteAccount } = useAccounts();

  // Filter accounts locally
  const filteredAccounts = (accounts || []).filter(account => {
    const matchesSearch = account.name ? account.name.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const matchesRole = roleFilter === '' || account.role === roleFilter;
    const matchesStatus = statusFilter === '' || account.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter && account.joined_date) {
      const joinedDate = new Date(account.joined_date);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = joinedDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = joinedDate >= weekAgo;
          break;
        case 'month':
          matchesDate = joinedDate.getMonth() === now.getMonth() && joinedDate.getFullYear() === now.getFullYear();
          break;
        case 'quarter':
          const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          matchesDate = joinedDate >= threeMonthsAgo;
          break;
        case 'year':
          matchesDate = joinedDate.getFullYear() === now.getFullYear();
          break;
      }
    }
    
    return matchesSearch && matchesRole && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAccounts = filteredAccounts.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        <div className="flex-1 flex flex-col">
          <Header activeItem={activeItem} setActiveItem={setActiveItem} />
          <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading accounts...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        <div className="flex-1 flex flex-col">
          <Header activeItem={activeItem} setActiveItem={setActiveItem} />
          <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Retry
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className="flex-1 flex flex-col">
        <Header activeItem={activeItem} setActiveItem={setActiveItem} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Account Management</h1>
                <p className="text-gray-600">Manage, create, update, delete accounts.</p>
              </div>

            </div>
          </div>

          <AccountFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
          />

          <AccountTable 
            accounts={paginatedAccounts} 
            onDelete={deleteAccount}
            onUpdateRole={async (id, role) => {
              try {
                await fetch(`http://localhost:3000/api/accounts/${id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ role })
                });
                fetchAccounts(); // Refresh the accounts list
              } catch (error) {
                console.error('Error updating role:', error);
              }
            }}
          />
          
          <Pagination 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            filteredCount={filteredAccounts.length}
          />
        </main>
      </div>
    </div>
  );
};

export default AccountManagement;
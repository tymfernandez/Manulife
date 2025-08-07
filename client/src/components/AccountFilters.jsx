import React from 'react';
import { Search, ChevronDown, Calendar } from 'lucide-react';

const AccountFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  roleFilter, 
  setRoleFilter, 
  statusFilter, 
  setStatusFilter,
  dateFilter,
  setDateFilter
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="relative flex-1 min-w-64">
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>
      
      <div className="relative">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="">Role</option>
          <option value="Financial Adviser">Financial Adviser</option>
          <option value="Region Head">Region Head</option>
          <option value="Unit Head">Unit Head</option>
          <option value="Unit Head Associate">Unit Head Associate</option>
        </select>
        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
      </div>
      
      <div className="relative">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="">Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
      </div>
      
      <div className="relative">
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">Last 3 Months</option>
          <option value="year">This Year</option>
        </select>
        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};

export default AccountFilters;
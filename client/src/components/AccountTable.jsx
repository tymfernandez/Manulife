import React, { useState } from 'react';
import { Trash2, Edit3, Check, X } from 'lucide-react';
import Avatar from './Avatar';
import { getStatusColor, formatDate, formatRelativeTime } from '../utils/helpers';

const AccountTable = ({ accounts, onDelete, onUpdateRole }) => {
  const [editingRole, setEditingRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  
  const roles = ['Financial Adviser', 'Unit Head', 'Branch Leader', 'Region Head', 'Admin'];
  
  const handleRoleEdit = (accountId, currentRole) => {
    setEditingRole(accountId);
    setSelectedRole(currentRole);
  };
  
  const handleRoleSave = async (accountId) => {
    await onUpdateRole(accountId, selectedRole);
    setEditingRole(null);
  };
  
  const handleRoleCancel = () => {
    setEditingRole(null);
    setSelectedRole('');
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Name</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Role</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Email</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Last Online</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Joined Date</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
              <th className="w-12 py-3 px-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {accounts.map((account) => (
              <tr key={account.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <Avatar name={account.name} className="w-8 h-8" />
                    <span className="font-medium text-gray-900">{account.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  {editingRole === account.id ? (
                    <div className="flex items-center space-x-2">
                      <select 
                        value={selectedRole} 
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        {roles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                      <button onClick={() => handleRoleSave(account.id)} className="text-green-600 hover:text-green-800">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={handleRoleCancel} className="text-red-600 hover:text-red-800">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">{account.role}</span>
                      <button onClick={() => handleRoleEdit(account.id, account.role)} className="text-gray-400 hover:text-blue-600">
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </td>
                <td className="py-4 px-6 text-gray-600">{account.email}</td>
                <td className="py-4 px-6 text-gray-600">{formatRelativeTime(account.last_online)}</td>
                <td className="py-4 px-6 text-gray-600">{formatDate(account.joined_date)}</td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(account.status)}`}>
                    {account.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <button 
                    onClick={() => onDelete(account.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountTable;
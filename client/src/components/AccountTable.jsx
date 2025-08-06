import React from 'react';
import { Trash2 } from 'lucide-react';
import Avatar from './avatar';
import { getStatusColor } from '../utils/helpers';

const AccountTable = ({ accounts, onDelete }) => {
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
                <td className="py-4 px-6 text-gray-600">{account.role}</td>
                <td className="py-4 px-6 text-gray-600">{account.email}</td>
                <td className="py-4 px-6 text-gray-600">{account.lastOnline}</td>
                <td className="py-4 px-6 text-gray-600">{account.joinedDate}</td>
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
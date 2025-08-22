import { useState, useEffect } from 'react';
import { accountService } from '../services/accountService';
import { useActivityLogger } from './useActivityLogger';

export const useAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logCreate, logEdit, logDelete } = useActivityLogger();

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const data = await accountService.getAccounts();
      setAccounts(data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch accounts:', err);
      setError(err.message || 'Failed to connect to server');
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async (accountData) => {
    try {
      const newAccount = await accountService.createAccount(accountData);
      setAccounts(prev => [newAccount, ...prev]);
      // Log account creation
      logCreate('Account', accountData.name || accountData.email || 'New Account');
      return newAccount;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateAccount = async (id, accountData) => {
    try {
      const existingAccount = accounts.find(acc => acc.id === id);
      const updatedAccount = await accountService.updateAccount(id, accountData);
      setAccounts(prev => prev.map(acc => acc.id === id ? updatedAccount : acc));
      // Log account update
      logEdit('Account', existingAccount?.name || existingAccount?.email || `ID: ${id}`);
      return updatedAccount;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteAccount = async (id) => {
    try {
      const accountToDelete = accounts.find(acc => acc.id === id);
      const accountName = accountToDelete?.name || accountToDelete?.email || `ID: ${id}`;
      
      // Show confirmation dialog
      const confirmed = window.confirm(
        `Are you sure you want to delete the account for "${accountName}"?\n\nThis action cannot be undone and will permanently remove the account and all associated data.`
      );
      
      if (!confirmed) {
        return; // User cancelled, don't proceed with deletion
      }
      
      await accountService.deleteAccount(id);
      setAccounts(prev => prev.filter(acc => acc.id !== id));
      // Log account deletion
      logDelete('Account', accountName);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const searchAccounts = async (searchTerm, roleFilter, statusFilter) => {
    try {
      setLoading(true);
      const data = await accountService.searchAccounts(searchTerm, roleFilter, statusFilter);
      setAccounts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    searchAccounts
  };
};
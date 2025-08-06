import { useState, useEffect } from 'react';
import { accountService } from '../services/accountService';

export const useAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const data = await accountService.getAccounts();
      setAccounts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async (accountData) => {
    try {
      const newAccount = await accountService.createAccount(accountData);
      setAccounts(prev => [newAccount, ...prev]);
      return newAccount;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateAccount = async (id, accountData) => {
    try {
      const updatedAccount = await accountService.updateAccount(id, accountData);
      setAccounts(prev => prev.map(acc => acc.id === id ? updatedAccount : acc));
      return updatedAccount;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteAccount = async (id) => {
    try {
      await accountService.deleteAccount(id);
      setAccounts(prev => prev.filter(acc => acc.id !== id));
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
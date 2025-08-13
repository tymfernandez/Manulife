import { logCreate, logEdit, logDelete, logView } from '../utils/activityLogger';

const API_BASE = 'http://localhost:3000/api';

export const accountService = {
  // Get all accounts
  async getAccounts() {
    try {
      const response = await fetch(`${API_BASE}/accounts`);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const result = await response.json();
      
      if (!result.success) throw new Error(result.message);
      // Log view activity
      logView('accounts');
      return result.data || [];
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please ensure the server is running.');
      }
      throw error;
    }
  },

  // Create new account
  async createAccount(accountData) {
    const response = await fetch(`${API_BASE}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(accountData)
    });
    const result = await response.json();
    
    if (!result.success) throw new Error(result.message);
    // Log create activity
    logCreate('account');
    return result.data;
  },

  // Update account role
  async updateAccount(id, role) {
    const response = await fetch(`${API_BASE}/accounts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    const result = await response.json();
    
    if (!result.success) throw new Error(result.message);
    // Log edit activity
    logEdit('account', id);
    return result.data;
  },

  // Delete account
  async deleteAccount(id) {
    const response = await fetch(`${API_BASE}/accounts/${id}`, {
      method: 'DELETE'
    });
    const result = await response.json();
    
    if (!result.success) throw new Error(result.message);
    // Log delete activity
    logDelete('account', id);
    return true;
  },

  // Update account role
  async updateRole(id, role) {
    return this.updateAccount(id, role);
  },

  // Search accounts (handled by frontend filtering for now)
  async searchAccounts(searchTerm, roleFilter, statusFilter) {
    return this.getAccounts();
  }
};
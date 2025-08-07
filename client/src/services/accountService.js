const API_BASE = 'http://localhost:3001/api';

export const accountService = {
  // Get all accounts
  async getAccounts() {
    const response = await fetch(`${API_BASE}/accounts`);
    const result = await response.json();
    
    if (!result.success) throw new Error(result.message);
    return result.data;
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
    return result.data;
  },

  // Update account
  async updateAccount(id, accountData) {
    const response = await fetch(`${API_BASE}/accounts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(accountData)
    });
    const result = await response.json();
    
    if (!result.success) throw new Error(result.message);
    return result.data;
  },

  // Delete account
  async deleteAccount(id) {
    const response = await fetch(`${API_BASE}/accounts/${id}`, {
      method: 'DELETE'
    });
    const result = await response.json();
    
    if (!result.success) throw new Error(result.message);
    return true;
  },

  // Search accounts (handled by frontend filtering for now)
  async searchAccounts(searchTerm, roleFilter, statusFilter) {
    return this.getAccounts();
  }
};
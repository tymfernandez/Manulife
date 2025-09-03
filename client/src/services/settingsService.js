const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const TEST_USER_ID = '00000000-0000-0000-0000-000000000000';

export const settingsService = {
  // Get user settings
  async getUserSettings() {
    try {
      const response = await fetch(`${API_BASE}/settings`, {
        headers: {
          'user-id': TEST_USER_ID
        }
      });
      const result = await response.json();
      
      if (!result.success) throw new Error(result.message);
      return result.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user settings
  async updateSettings(settings) {
    try {
      const response = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'user-id': TEST_USER_ID
        },
        body: JSON.stringify(settings)
      });
      const result = await response.json();
      
      if (!result.success) throw new Error(result.message);
      return result.data;
    } catch (error) {
      throw error;
    }
  },

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await fetch(`${API_BASE}/settings/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'user-id': TEST_USER_ID
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const result = await response.json();
      
      if (!result.success) throw new Error(result.message);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Export user data
  async exportData(format = 'json') {
    try {
      const response = await fetch(`${API_BASE}/settings/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': TEST_USER_ID
        },
        body: JSON.stringify({ format })
      });
      const result = await response.json();
      
      if (!result.success) throw new Error(result.message);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Submit support ticket
  async submitTicket(ticketData) {
    try {
      const response = await fetch(`${API_BASE}/settings/support`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': TEST_USER_ID
        },
        body: JSON.stringify(ticketData)
      });
      const result = await response.json();
      
      if (!result.success) throw new Error(result.message);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Get user tickets
  async getUserTickets() {
    try {
      const response = await fetch(`${API_BASE}/settings/tickets`, {
        headers: {
          'user-id': TEST_USER_ID
        }
      });
      const result = await response.json();
      
      if (!result.success) throw new Error(result.message);
      return result.data;
    } catch (error) {
      throw error;
    }
  }
};
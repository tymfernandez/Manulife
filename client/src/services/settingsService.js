const API_BASE_URL = 'http://localhost:3000/api';

export const settingsService = {
  async submitTicket(ticketData) {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/support`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error submitting support ticket:', error);
      throw error;
    }
  },

  async exportData(format) {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ format }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }
};
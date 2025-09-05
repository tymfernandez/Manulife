const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const activityLogService = {
  // Get activity logs with pagination and filters
  async getActivityLogs(params = {}) {
    try {
      const storedSession = localStorage.getItem('supabase.auth.token');
      if (!storedSession) {
        throw new Error('No session available');
      }
      
      const sessionData = JSON.parse(storedSession);
      if (!sessionData.access_token) {
        throw new Error('No access token available');
      }
      
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(`${API_BASE}/activity-logs?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${sessionData.access_token}`
        }
      });
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      
      return result;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please ensure the server is running.');
      }
      throw error;
    }
  },

  // Create new activity log
  async createActivityLog(logData) {
    try {
      const storedSession = localStorage.getItem('supabase.auth.token');
      if (!storedSession) {
        throw new Error('No session available');
      }
      
      const sessionData = JSON.parse(storedSession);
      if (!sessionData.access_token) {
        throw new Error('No access token available');
      }
      
      const response = await fetch(`${API_BASE}/activity-logs`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionData.access_token}`
        },
        body: JSON.stringify(logData)
      });
      
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      
      return result.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete activity log
  async deleteActivityLog(id) {
    try {
      const storedSession = localStorage.getItem('supabase.auth.token');
      if (!storedSession) {
        throw new Error('No session available');
      }
      
      const sessionData = JSON.parse(storedSession);
      if (!sessionData.access_token) {
        throw new Error('No access token available');
      }
      
      const response = await fetch(`${API_BASE}/activity-logs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionData.access_token}`
        }
      });
      
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Export activity logs as CSV
  async exportActivityLogs(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          queryParams.append(key, value);
        }
      });

      const storedSession = localStorage.getItem('supabase.auth.token');
      if (!storedSession) {
        throw new Error('No session available');
      }
      
      const sessionData = JSON.parse(storedSession);
      if (!sessionData.access_token) {
        throw new Error('No access token available');
      }
      
      const response = await fetch(`${API_BASE}/activity-logs/export?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${sessionData.access_token}`
        }
      });
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `activity_logs_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return true;
    } catch (error) {
      throw error;
    }
  }
};
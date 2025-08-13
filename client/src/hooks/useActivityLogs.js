import { useState, useEffect } from 'react';
import { activityLogService } from '../services/activityLogService';

export const useActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const fetchLogs = async (params = {}) => {
    try {
      setLoading(true);
      const result = await activityLogService.getActivityLogs(params);
      setLogs(result.data || []);
      setPagination(result.pagination || {});
      setError(null);
    } catch (err) {
      console.error('Failed to fetch activity logs:', err);
      setError(err.message || 'Failed to connect to server');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const createLog = async (logData) => {
    try {
      const newLog = await activityLogService.createActivityLog(logData);
      setLogs(prev => [newLog, ...prev]);
      return newLog;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteLog = async (id) => {
    try {
      await activityLogService.deleteActivityLog(id);
      setLogs(prev => prev.filter(log => log.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const exportLogs = async (params = {}) => {
    try {
      await activityLogService.exportActivityLogs(params);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return {
    logs,
    loading,
    error,
    pagination,
    fetchLogs,
    createLog,
    deleteLog,
    exportLogs
  };
};
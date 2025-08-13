import React, { useState, useEffect } from 'react';
import { Download, Plus } from 'lucide-react';
import { useActivityLogs } from '../hooks/useActivityLogs';
import ActivityLogFilters from '../components/ActivityLogFilters';
import ActivityLogTable from '../components/ActivityLogTable';
import AddActivityLogModal from '../components/AddActivityLogModal';
import Pagination from '../components/Pagination';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const ActivityLogs = () => {
  const [activeItem, setActiveItem] = useState('activity-logs');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [activityTypeFilter, setActivityTypeFilter] = useState('');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  const { logs, loading, error, pagination, fetchLogs, createLog, deleteLog, exportLogs } = useActivityLogs();

  // Fetch logs when filters change
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm,
      role: roleFilter,
      activityType: activityTypeFilter,
      dateFrom: dateFromFilter,
      dateTo: dateToFilter
    };

    fetchLogs(params);
  }, [currentPage, searchTerm, roleFilter, activityTypeFilter, dateFromFilter, dateToFilter]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, roleFilter, activityTypeFilter, dateFromFilter, dateToFilter]);

  const handleExport = async () => {
    try {
      const params = {
        search: searchTerm,
        role: roleFilter,
        activityType: activityTypeFilter,
        dateFrom: dateFromFilter,
        dateTo: dateToFilter
      };
      await exportLogs(params);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleAddLog = async (logData) => {
    try {
      await createLog(logData);
      // Refresh the current page
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        role: roleFilter,
        activityType: activityTypeFilter,
        dateFrom: dateFromFilter,
        dateTo: dateToFilter
      };
      fetchLogs(params);
    } catch (error) {
      console.error('Failed to add log:', error);
    }
  };

  const handleDeleteLog = async (id) => {
    if (window.confirm('Are you sure you want to delete this activity log?')) {
      try {
        await deleteLog(id);
        // Refresh the current page
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          role: roleFilter,
          activityType: activityTypeFilter,
          dateFrom: dateFromFilter,
          dateTo: dateToFilter
        };
        fetchLogs(params);
      } catch (error) {
        console.error('Failed to delete log:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        <div className="flex-1 flex flex-col">
          <Header activeItem={activeItem} setActiveItem={setActiveItem} />
          <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading activity logs...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        <div className="flex-1 flex flex-col">
          <Header activeItem={activeItem} setActiveItem={setActiveItem} />
          <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Retry
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className="flex-1 flex flex-col">
        <Header activeItem={activeItem} setActiveItem={setActiveItem} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Activity Logs</h1>
                <p className="text-gray-600">Track and monitor user activities across the platform.</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleExport}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Log
                </button>
              </div>
            </div>
          </div>

          <ActivityLogFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            activityTypeFilter={activityTypeFilter}
            setActivityTypeFilter={setActivityTypeFilter}
            dateFromFilter={dateFromFilter}
            setDateFromFilter={setDateFromFilter}
            dateToFilter={dateToFilter}
            setDateToFilter={setDateToFilter}
          />

          <ActivityLogTable 
            logs={logs} 
            onDelete={handleDeleteLog}
          />
          
          <Pagination 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={pagination.totalPages || 1}
            filteredCount={pagination.total || 0}
          />

          <AddActivityLogModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddLog}
          />
        </main>
      </div>
    </div>
  );
};

export default ActivityLogs;
import { useState } from 'react';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import JobPosts from './pages/JobPosts';
import Logs from './pages/Logs';
import Alerts from './pages/Alerts';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <Users />;
      case 'jobs':
        return <JobPosts />;
      case 'logs':
        return <Logs />;
      case 'alerts':
        return <Alerts />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
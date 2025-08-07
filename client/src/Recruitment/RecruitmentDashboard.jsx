import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

const RecruitmentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'recruits':
        return (
          <div className="p-6 bg-[#f8fffe] min-h-full">
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h2 className="text-2xl font-bold text-gray-800">Recruits Management</h2>
              <p className="text-gray-600 mt-2">Recruit management features coming soon...</p>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="p-6 bg-[#f8fffe] min-h-full">
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
              <p className="text-gray-600 mt-2">User management features coming soon...</p>
            </div>
          </div>
        );
      case 'logs':
        return (
          <div className="p-6 bg-[#f8fffe] min-h-full">
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h2 className="text-2xl font-bold text-gray-800">Activity Logs</h2>
              <p className="text-gray-600 mt-2">Activity logs coming soon...</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fffe]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default RecruitmentDashboard;
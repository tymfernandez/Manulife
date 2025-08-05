import { FiAlertTriangle, FiAlertCircle, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { useState } from 'react';

const Alerts = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const alerts = [
    { id: 1, type: 'warning', title: 'Multiple Failed Login Attempts', message: 'User mike@manulife.com has 5 failed login attempts in the last hour', time: '10 min ago' },
    { id: 2, type: 'error', title: 'Email Service Degraded', message: 'Email notifications are experiencing delays', time: '25 min ago' },
    { id: 3, type: 'warning', title: 'High Database Load', message: 'Database response time is above normal threshold', time: '1 hour ago' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">System Alerts</h2>

      {/* Maintenance Mode Toggle */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Maintenance Mode</h3>
            <p className="text-sm text-gray-600">Enable to prevent new user registrations and limit system access</p>
          </div>
          <button 
            onClick={() => setMaintenanceMode(!maintenanceMode)}
            className={`${maintenanceMode ? 'text-red-600' : 'text-gray-400'}`}
          >
            {maintenanceMode ? <FiToggleRight className="w-8 h-8" /> : <FiToggleLeft className="w-8 h-8" />}
          </button>
        </div>
        {maintenanceMode && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">⚠️ Maintenance mode is currently active</p>
          </div>
        )}
      </div>

      {/* Active Alerts */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Active Alerts</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-4">
              <div className="flex items-start space-x-3">
                <div className={`mt-1 ${alert.type === 'error' ? 'text-red-500' : 'text-yellow-500'}`}>
                  {alert.type === 'error' ? 
                    <FiAlertCircle className="w-5 h-5" /> : 
                    <FiAlertTriangle className="w-5 h-5" />
                  }
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900">{alert.title}</h4>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                  <div className="flex space-x-2">
                    <button className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Investigate
                    </button>
                    <button className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Health */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">System Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl font-bold text-green-600">98%</span>
            </div>
            <p className="text-sm text-gray-600">Uptime</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl font-bold text-blue-600">45ms</span>
            </div>
            <p className="text-sm text-gray-600">Response Time</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl font-bold text-purple-600">156</span>
            </div>
            <p className="text-sm text-gray-600">Active Users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
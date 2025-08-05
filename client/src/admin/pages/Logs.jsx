import { FiFilter } from 'react-icons/fi';

const Logs = () => {
  const logs = [
    { id: 1, action: 'User Added', user: 'Admin', details: 'New recruiter John Doe added to system', timestamp: '2024-01-15 14:30:22', type: 'user' },
    { id: 2, action: 'Job Post Activated', user: 'Sarah Johnson', details: 'Senior FA position activated', timestamp: '2024-01-15 13:45:10', type: 'job' },
    { id: 3, action: 'Password Reset', user: 'System', details: 'Password reset for mike@manulife.com', timestamp: '2024-01-15 12:20:05', type: 'security' },
    { id: 4, action: 'Job Post Deactivated', user: 'John Smith', details: 'Branch Head position deactivated', timestamp: '2024-01-15 11:15:33', type: 'job' },
    { id: 5, action: 'User Login', user: 'Lisa Wong', details: 'Successful login from 192.168.1.100', timestamp: '2024-01-15 09:30:15', type: 'security' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Activity Logs</h2>
        <div className="flex space-x-2">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>All Users</option>
            <option>Admin</option>
            <option>Sarah Johnson</option>
            <option>John Smith</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>All Actions</option>
            <option>User Management</option>
            <option>Job Posts</option>
            <option>Security</option>
          </select>
          <button className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex items-center space-x-1">
            <FiFilter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="divide-y divide-gray-200">
          {logs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${
                      log.type === 'user' ? 'bg-blue-500' :
                      log.type === 'job' ? 'bg-green-500' :
                      'bg-yellow-500'
                    }`}></span>
                    <span className="font-medium text-gray-900">{log.action}</span>
                    <span className="text-sm text-gray-500">by {log.user}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{log.details}</p>
                  <p className="text-xs text-gray-400">{log.timestamp}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  log.type === 'user' ? 'bg-blue-100 text-blue-800' :
                  log.type === 'job' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {log.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Logs;
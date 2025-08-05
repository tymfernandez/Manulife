import { FiUsers, FiBriefcase, FiAlertTriangle, FiTrendingUp } from 'react-icons/fi';

const Dashboard = () => {
  const kpis = [
    { title: 'Total Recruiters', value: '24', icon: FiUsers, color: 'bg-blue-500' },
    { title: 'Active Job Posts', value: '12', icon: FiBriefcase, color: 'bg-green-500' },
    { title: 'System Warnings', value: '3', icon: FiAlertTriangle, color: 'bg-yellow-500' },
    { title: 'Applications Today', value: '47', icon: FiTrendingUp, color: 'bg-purple-500' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{kpi.title}</p>
                  <p className="text-3xl font-bold text-gray-800">{kpi.value}</p>
                </div>
                <div className={`w-12 h-12 ${kpi.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-gray-600">New recruiter John Doe added</span>
              <span className="ml-auto text-gray-400">2 min ago</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-gray-600">Job post "Senior FA" activated</span>
              <span className="ml-auto text-gray-400">15 min ago</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <span className="text-gray-600">System maintenance scheduled</span>
              <span className="ml-auto text-gray-400">1 hour ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">API Services</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Email Service</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Warning</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
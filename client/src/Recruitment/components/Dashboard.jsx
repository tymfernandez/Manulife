import { FiUsers, FiUserPlus, FiBriefcase, FiTrendingUp } from 'react-icons/fi';
import MetricsCard from './MetricsCard';
import RecruitmentChart from './RecruitmentChart';

const Dashboard = () => {
  const metrics = [
    { title: 'Total Recruits', value: '324', icon: FiUsers, trend: 12 },
    { title: 'New Recruits This Month', value: '45', icon: FiUserPlus, trend: 8 },
    { title: 'Total Financial Advisors', value: '189', icon: FiBriefcase },
    { title: 'Total Unit Heads', value: '28', icon: FiTrendingUp },
  ];

  const demographics = [
    { role: 'Financial Advisors', percentage: 68, count: 189 },
    { role: 'Unit Heads', percentage: 20, count: 28 },
    { role: 'Branch Heads', percentage: 12, count: 17 },
  ];

  return (
    <div className="p-6 bg-[#f8fffe] min-h-full">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <MetricsCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            trend={metric.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recruitment Chart */}
        <div className="lg:col-span-2">
          <RecruitmentChart />
        </div>

        {/* Demographics Panel */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Demographics Breakdown</h3>
          <div className="space-y-4">
            {demographics.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">{item.role}</span>
                  <span className="text-sm font-medium text-gray-800">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{item.count} people</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
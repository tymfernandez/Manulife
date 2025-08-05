import { useState } from 'react';
import { useRecruitmentData } from './hooks/useRecruitmentData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { regionHeads, branchHeads, unitHeads, unitHeadAssociates, financialAdvisors, loading, error } = useRecruitmentData();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-green-600 rounded animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-slate-700 text-white h-screen shadow-lg transition-all duration-300 relative`}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 bg-slate-700 border border-slate-600 rounded-full p-1 hover:bg-slate-600 transition-colors z-10"
        >
          <span className="text-white text-sm">{isCollapsed ? '→' : '←'}</span>
        </button>
        
        <div className="p-6 border-b border-slate-600">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            {!isCollapsed && <span className="font-semibold text-lg">Manulife</span>}
          </div>
        </div>
        <nav className="pt-4">
          <div className="flex items-center px-6 py-3 bg-green-600 border-r-4 border-green-400">
            <span className="text-white text-lg flex-shrink-0">🏠</span>
            {!isCollapsed && <span className="ml-3 font-medium">Dashboard</span>}
          </div>
          <div className="flex items-center px-6 py-3 hover:bg-slate-600 cursor-pointer">
            <span className="text-white text-lg flex-shrink-0">👥</span>
            {!isCollapsed && <span className="ml-3 font-medium">Recruits</span>}
          </div>
          <div className="flex items-center px-6 py-3 hover:bg-slate-600 cursor-pointer">
            <span className="text-white text-lg flex-shrink-0">👤</span>
            {!isCollapsed && <span className="ml-3 font-medium">Users</span>}
          </div>
          <div className="flex items-center px-6 py-3 hover:bg-slate-600 cursor-pointer">
            <span className="text-white text-lg flex-shrink-0">📄</span>
            {!isCollapsed && <span className="ml-3 font-medium">Logs</span>}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Recruitment Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">🔔</span>
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6 bg-[#f8fffe]">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Region Head</p>
                  <p className="text-3xl font-bold text-gray-800">{regionHeads}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🎆</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Branch Head</p>
                  <p className="text-3xl font-bold text-gray-800">{branchHeads}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🏢</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Unit Head</p>
                  <p className="text-3xl font-bold text-gray-800">{unitHeads}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Unit Head Associate</p>
                  <p className="text-3xl font-bold text-gray-800">{unitHeadAssociates}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🤝</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Financial Advisor</p>
                  <p className="text-3xl font-bold text-gray-800">{financialAdvisors}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💼</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Recruitment Trend */}
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Recruitment Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={[
                  { month: 'Jan', recruits: 12 },
                  { month: 'Feb', recruits: 19 },
                  { month: 'Mar', recruits: 15 },
                  { month: 'Apr', recruits: 25 },
                  { month: 'May', recruits: 22 },
                  { month: 'Jun', recruits: 30 },
                  { month: 'Jul', recruits: 28 },
                  { month: 'Aug', recruits: 35 },
                  { month: 'Sep', recruits: 32 },
                  { month: 'Oct', recruits: 40 },
                  { month: 'Nov', recruits: 38 },
                  { month: 'Dec', recruits: 45 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#f8fffe', 
                      border: '1px solid #16a34a',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="recruits" 
                    stroke="#16a34a" 
                    strokeWidth={3}
                    dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Daily Recruitment (Last 7 Days) */}
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Recruits (Last 7 Days)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[
                  { day: 'Mon', recruits: 3 },
                  { day: 'Tue', recruits: 5 },
                  { day: 'Wed', recruits: 2 },
                  { day: 'Thu', recruits: 8 },
                  { day: 'Fri', recruits: 6 },
                  { day: 'Sat', recruits: 4 },
                  { day: 'Sun', recruits: 7 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#f8fffe', 
                      border: '1px solid #16a34a',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="recruits" fill="#16a34a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Yearly Summary */}
          <div className="mt-6 bg-white rounded-lg shadow-sm p-6 border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Yearly Recruitment Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-green-600">324</span>
                </div>
                <p className="text-sm text-gray-600">Total This Year</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-blue-600">27</span>
                </div>
                <p className="text-sm text-gray-600">Average Per Month</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-purple-600">+18%</span>
                </div>
                <p className="text-sm text-gray-600">Growth vs Last Year</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App
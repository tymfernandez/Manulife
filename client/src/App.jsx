import { useState } from 'react';
import { useRecruitmentData } from './hooks/useRecruitmentData';

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

          {/* Chart Placeholder */}
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recruitment Over Time</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Chart will be displayed here</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App
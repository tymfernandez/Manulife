import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { TrendingUp, TrendingDown } from 'lucide-react'

const Dashboard = () => {
  const [recruitsCounts, setRecruitsCounts] = useState({
    regionHead: 0,
    branchHead: 0,
    unitHead: 0,
    unitHeadAssociate: 0,
    financialAdvisor: 0,
  })

  const [totalApplications, setTotalApplications] = useState(425)
  const [newRecruits, setNewRecruits] = useState(23)
  const [selectedPeriod, setSelectedPeriod] = useState('12 Months')

  // Function to convert role string to camelCase
  const camelCase = (str) =>
    str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())

  // UseEffect hook to fetch recruits counts based on role
  useEffect(() => {
    const fetchRecruitsData = async () => {
      const roles = [
        'Region Head',
        'Branch Head',
        'Unit Head',
        'Unit Head Associate',
        'Financial Advisor',
      ]

      const newCounts = {}

      for (const role of roles) {
        const { count, error } = await supabase
          .from('Recruits')
          .select('*', { count: 'exact', head: true })
          .eq('role', role)

        if (error) console.error('Error fetching recruits:', error)
        newCounts[camelCase(role)] = count || 0
      }

      setRecruitsCounts(newCounts)
    }

    fetchRecruitsData()
  }, [])

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-800">DASHBOARD</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Export
        </button>
      </div>

      {/* Top Metrics - Smaller boxes */}
      <div className="grid grid-cols-2 gap-4 mb-8 max-w-md">
        <SmallMetricCard 
          title="New Recruits" 
          value={newRecruits} 
          percentage={17} 
          isPositive={true}
        />
        <SmallMetricCard 
          title="Total Recruits" 
          value={totalApplications} 
          percentage={9} 
          isPositive={false}
        />
      </div>

      {/* Recruitment Report Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">RECRUITMENT REPORT</h2>
          <div className="flex space-x-2">
            {['3 Months', '6 Months', '12 Months'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 text-sm rounded ${
                  selectedPeriod === period
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        
        {/* Chart placeholder */}
        <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
          <span className="text-gray-500">Chart will be implemented here</span>
        </div>
      </div>

      {/* Role-based Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RoleCard 
          title="Branch Head" 
          value={recruitsCounts.branchHead || 6} 
          percentage={1} 
          isPositive={true}
        />
        <RoleCard 
          title="Unit Head" 
          value={recruitsCounts.unitHead || 15} 
          percentage={1} 
          isPositive={true}
        />
        <RoleCard 
          title="Unit Head Associate" 
          value={recruitsCounts.unitHeadAssociate || 15} 
          percentage={2} 
          isPositive={true}
        />
        <RoleCard 
          title="Financial Advisors" 
          value={recruitsCounts.financialAdvisor || 32} 
          percentage={4} 
          isPositive={true}
        />
      </div>
    </div>
  )
}

const SmallMetricCard = ({ title, value, percentage, isPositive }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
    <h3 className="text-xs font-medium text-gray-600 mb-1">{title}</h3>
    <div className="flex items-end justify-between">
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      <div className={`flex items-center text-xs font-medium ${
        isPositive ? 'text-green-600' : 'text-red-600'
      }`}>
        {isPositive ? (
          <TrendingUp className="w-3 h-3 mr-1" />
        ) : (
          <TrendingDown className="w-3 h-3 mr-1" />
        )}
        {percentage}%
      </div>
    </div>
  </div>
)

const RoleCard = ({ title, value, percentage, isPositive }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
    <h3 className="text-sm font-medium text-gray-600 mb-4">{title}</h3>
    <div className="flex items-end justify-between">
      <span className="text-3xl font-bold text-gray-900">{value}</span>
      <div className={`flex items-center text-sm font-medium ${
        isPositive ? 'text-green-600' : 'text-red-600'
      }`}>
        {isPositive ? (
          <TrendingUp className="w-4 h-4 mr-1" />
        ) : (
          <TrendingDown className="w-4 h-4 mr-1" />
        )}
        {percentage}%
      </div>
    </div>
  </div>
)

export default Dashboard
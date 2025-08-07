import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const Dashboard = () => {
  const [recruitsCounts, setRecruitsCounts] = useState({
    regionHead: 0,
    branchHead: 0,
    unitHead: 0,
    unitHeadAssociate: 0,
    financialAdvisor: 0,
  })

  const [totalApplications, setTotalApplications] = useState(0)
  const [newRecruits, setNewRecruits] = useState(0)
  const [selectedPeriod, setSelectedPeriod] = useState('12 Months')
  const [chartData, setChartData] = useState([])

  // Function to convert role string to camelCase
  const camelCase = (str) =>
    str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())

  // UseEffect hook to fetch data from Applications table
  useEffect(() => {
    const fetchApplicationsData = async () => {
      try {
        // Fetch total applications count
        const { count: totalCount, error: totalError } = await supabase
          .from('Applications')
          .select('*', { count: 'exact', head: true })

        if (totalError) {
          console.error('Error fetching total applications:', totalError)
        } else {
          setTotalApplications(totalCount || 0)
        }

        // Fetch new applications (last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        
        const { count: newCount, error: newError } = await supabase
          .from('Applications')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', thirtyDaysAgo.toISOString())

        if (newError) {
          console.error('Error fetching new applications:', newError)
        } else {
          setNewRecruits(newCount || 0)
        }

        // Fetch role-based counts
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
            .from('Applications')
            .select('*', { count: 'exact', head: true })
            .eq('position_applied_for', role)

          if (error) {
            console.error(`Error fetching ${role} applications:`, error)
          }
          newCounts[camelCase(role)] = count || 0
        }

        setRecruitsCounts(newCounts)

        // Generate chart data from Applications table
        const generateChartData = async () => {
          const monthsBack = selectedPeriod === '3 Months' ? 3 : selectedPeriod === '6 Months' ? 6 : 12
          const startDate = new Date()
          startDate.setMonth(startDate.getMonth() - monthsBack)
          
          const { data: applications, error } = await supabase
            .from('Applications')
            .select('created_at')
            .gte('created_at', startDate.toISOString())
          
          if (error) {
            console.error('Error fetching chart data:', error)
            return
          }
          
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          const chartData = []
          
          for (let i = monthsBack - 1; i >= 0; i--) {
            const date = new Date()
            date.setMonth(date.getMonth() - i)
            const monthName = monthNames[date.getMonth()]
            
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
            
            const recruits = applications.filter(app => {
              const appDate = new Date(app.created_at)
              return appDate >= monthStart && appDate <= monthEnd
            }).length
            
            chartData.push({ month: monthName, recruits })
          }
          
          setChartData(chartData)
        }

        await generateChartData()
      } catch (error) {
        console.error('Error fetching applications data:', error)
      }
    }

    fetchApplicationsData()
  }, [selectedPeriod])

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
        
        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280" 
                fontSize={12}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="recruits" 
                stroke="#f59e0b" 
                strokeWidth={3}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#f59e0b' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Role-based Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RoleCard 
          title="Branch Head" 
          value={recruitsCounts.branchHead} 
          percentage={1} 
          isPositive={true}
        />
        <RoleCard 
          title="Unit Head" 
          value={recruitsCounts.unitHead} 
          percentage={1} 
          isPositive={true}
        />
        <RoleCard 
          title="Unit Head Associate" 
          value={recruitsCounts.unitHeadAssociate} 
          percentage={2} 
          isPositive={true}
        />
        <RoleCard 
          title="Financial Advisors" 
          value={recruitsCounts.financialAdvisor} 
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
import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const Dashboard = () => {
  const [recruitsCounts, setRecruitsCounts] = useState({
    regionHead: 0,
    branchHead: 0,
    unitHead: 0,
    unitHeadAssociate: 0,
    financialAdvisor: 0,
  })

  const [totalApplications, setTotalApplications] = useState(0)

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
          .from('Recruits') // Changed from 'recruits' to 'Recruits' based on your Supabase table name in the image
          .select('*', { count: 'exact', head: true })
          .eq('role', role)

        if (error) console.error('Error fetching recruits:', error)
        newCounts[camelCase(role)] = count || 0
      }

      setRecruitsCounts(newCounts)
    }

    fetchRecruitsData()
  }, [])

  // New useEffect hook to fetch the total count of applications
  useEffect(() => {
    const fetchApplicationsCount = async () => {
      const { count, error } = await supabase
        .from('Applications') // Use the correct table name
        .select('*', { count: 'exact', head: true })

      if (error) {
        console.error('Error fetching applications:', error)
      } else {
        setTotalApplications(count || 0)
      }
    }

    fetchApplicationsCount()
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Recruitment Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {/* Recruits Cards */}
        <Card title="Region Head" value={recruitsCounts.regionHead} />
        <Card title="Branch Head" value={recruitsCounts.branchHead} />
        <Card title="Unit Head" value={recruitsCounts.unitHead} />
        <Card title="Unit Head Associate" value={recruitsCounts.unitHeadAssociate} />
        <Card title="Financial Advisor" value={recruitsCounts.financialAdvisor} />
        
        {/* New Card for Applications */}
        <Card title="Total Applications" value={totalApplications} />
      </div>
    </div>
  )
}

const Card = ({ title, value }) => (
  <div className="border rounded-lg p-4 bg-white shadow">
    <h2 className="text-sm text-gray-500">{title}</h2>
    <p className="text-2xl font-semibold">{value}</p>
  </div>
)

export default Dashboard
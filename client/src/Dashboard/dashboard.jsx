import React from "react";

import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const Dashboard = () => {
  const [counts, setCounts] = useState({
    regionHead: 0,
    branchHead: 0,
    unitHead: 0,
    unitHeadAssociate: 0,
    financialAdvisor: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
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
          .from('recruits')
          .select('*', { count: 'exact', head: true })
          .eq('role', role)

        if (error) console.error(error)
        newCounts[camelCase(role)] = count || 0
      }

      setCounts(newCounts)
    }

    fetchData()
  }, [])

  const camelCase = (str) =>
    str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Recruitment Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card title="Region Head" value={counts.regionHead} />
        <Card title="Branch Head" value={counts.branchHead} />
        <Card title="Unit Head" value={counts.unitHead} />
        <Card title="Unit Head Associate" value={counts.unitHeadAssociate} />
        <Card title="Financial Advisor" value={counts.financialAdvisor} />
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

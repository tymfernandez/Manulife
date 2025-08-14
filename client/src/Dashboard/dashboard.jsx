import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { TrendingUp, TrendingDown } from "lucide-react";
import { logExport } from "../utils/activityLogger";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-10">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};
import Header from "../components/Header";
import SideBar from "../components/Sidebar";

const Dashboard = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [recruitsCounts, setRecruitsCounts] = useState({
    regionHead: 0,
    branchHead: 0,
    unitHead: 0,
    unitHeadAssociate: 0,
    financialAdvisor: 0,
  });

  const [totalApplications, setTotalApplications] = useState(0);
  const [newRecruits, setNewRecruits] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState("12 Months");
  const [chartData, setChartData] = useState([]);
  const [previousPeriodData, setPreviousPeriodData] = useState({
    totalApplications: 0,
    newRecruits: 0,
    rolesCounts: {
      regionHead: 0,
      branchHead: 0,
      unitHead: 0,
      unitHeadAssociate: 0,
      financialAdvisor: 0,
    }
  });

  // Function to convert role string to camelCase
  const camelCase = (str) =>
    str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());

  // UseEffect hook to fetch data from Applications table
  useEffect(() => {

    
    const fetchApplicationsData = async () => {
      try {
        // Fetch total applications count
        const { count: totalCount, error: totalError } = await supabase
          .from("Applications")
          .select("*", { count: "exact", head: true });

        if (totalError) {
          console.error("Error fetching total applications:", totalError);
        } else {
          setTotalApplications(totalCount || 0);
        }

        // Fetch new applications (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        const { count: newCount, error: newError } = await supabase
          .from("Applications")
          .select("*", { count: "exact", head: true })
          .gte("created_at", thirtyDaysAgo.toISOString());

        // Fetch previous 30 days for comparison
        const { count: previousNewCount, error: prevNewError } = await supabase
          .from("Applications")
          .select("*", { count: "exact", head: true })
          .gte("created_at", sixtyDaysAgo.toISOString())
          .lt("created_at", thirtyDaysAgo.toISOString());

        if (newError) {
          console.error("Error fetching new applications:", newError);
        } else {
          setNewRecruits(newCount || 0);
        }

        // Fetch total applications from previous period for comparison
        const { count: previousTotalCount, error: prevTotalError } = await supabase
          .from("Applications")
          .select("*", { count: "exact", head: true })
          .lt("created_at", thirtyDaysAgo.toISOString());

        // Fetch role-based counts
        const roles = [
          "Region Head",
          "Branch Head",
          "Unit Head",
          "Unit Head Associate",
          "Financial Advisor",
        ];

        const newCounts = {};
        for (const role of roles) {
          const { count, error } = await supabase
            .from("Applications")
            .select("*", { count: "exact", head: true })
            .eq("position_applied_for", role);

          if (error) {
            console.error(`Error fetching ${role} applications:`, error);
          }
          newCounts[camelCase(role)] = count || 0;
        }

        setRecruitsCounts(newCounts);

        // Fetch previous period role counts for comparison
        const previousRoleCounts = {};
        for (const role of roles) {
          const { count, error } = await supabase
            .from("Applications")
            .select("*", { count: "exact", head: true })
            .eq("position_applied_for", role)
            .lt("created_at", thirtyDaysAgo.toISOString());

          if (!error) {
            previousRoleCounts[camelCase(role)] = count || 0;
          }
        }

        // Set previous period data for percentage calculations
        setPreviousPeriodData({
          totalApplications: previousTotalCount || 0,
          newRecruits: previousNewCount || 0,
          rolesCounts: previousRoleCounts
        });

        // Generate chart data from Applications table
        const generateChartData = async () => {
          const monthsBack =
            selectedPeriod === "3 Months"
              ? 3
              : selectedPeriod === "6 Months"
              ? 6
              : 12;
          const startDate = new Date();
          startDate.setMonth(startDate.getMonth() - monthsBack);

          const { data: applications, error } = await supabase
            .from("Applications")
            .select("created_at")
            .gte("created_at", startDate.toISOString());

          if (error) {
            console.error("Error fetching chart data:", error);
            return;
          }

          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          const chartData = [];

          for (let i = monthsBack - 1; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthName = monthNames[date.getMonth()];

            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthEnd = new Date(
              date.getFullYear(),
              date.getMonth() + 1,
              0
            );

            const recruits = applications.filter((app) => {
              const appDate = new Date(app.created_at);
              return appDate >= monthStart && appDate <= monthEnd;
            }).length;

            chartData.push({ month: monthName, recruits });
          }

          setChartData(chartData);
        };

        await generateChartData();
      } catch (error) {
        console.error("Error fetching applications data:", error);
      }
    };

    fetchApplicationsData();
  }, [selectedPeriod]);

  // Calculate percentage changes
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const newRecruitsPercentage = calculatePercentageChange(newRecruits, previousPeriodData.newRecruits);
  const totalRecruitsPercentage = calculatePercentageChange(totalApplications, previousPeriodData.totalApplications);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SideBar activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className="flex-1 flex flex-col">
        <Header activeItem={activeItem} setActiveItem={setActiveItem} />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Dashboard Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-green-800">DASHBOARD</h1>
            <button 
              onClick={() => logExport('dashboard-data')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Export
            </button>
          </div>

          {/* Top Metrics - Smaller boxes */}
          <div className="grid grid-cols-2 gap-4 mb-8 max-w-md">
            <SmallMetricCard
              title="New Recruits"
              value={newRecruits}
              percentage={Math.abs(newRecruitsPercentage)}
              isPositive={newRecruitsPercentage >= 0}
            />
            <SmallMetricCard
              title="Total Recruits"
              value={totalApplications}
              percentage={Math.abs(totalRecruitsPercentage)}
              isPositive={totalRecruitsPercentage >= 0}
            />
          </div>

          {/* Recruitment Report Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                RECRUITMENT REPORT
              </h2>
              <div className="flex space-x-2">
                {["3 Months", "6 Months", "12 Months"].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-4 py-2 text-sm rounded ${
                      selectedPeriod === period
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                  <ChartTooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="recruits"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "#f59e0b" }}
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
              percentage={Math.abs(calculatePercentageChange(recruitsCounts.branchHead, previousPeriodData.rolesCounts.branchHead))}
              isPositive={calculatePercentageChange(recruitsCounts.branchHead, previousPeriodData.rolesCounts.branchHead) >= 0}
            />
            <RoleCard
              title="Unit Head"
              value={recruitsCounts.unitHead}
              percentage={Math.abs(calculatePercentageChange(recruitsCounts.unitHead, previousPeriodData.rolesCounts.unitHead))}
              isPositive={calculatePercentageChange(recruitsCounts.unitHead, previousPeriodData.rolesCounts.unitHead) >= 0}
            />
            <RoleCard
              title="Unit Head Associate"
              value={recruitsCounts.unitHeadAssociate}
              percentage={Math.abs(calculatePercentageChange(recruitsCounts.unitHeadAssociate, previousPeriodData.rolesCounts.unitHeadAssociate))}
              isPositive={calculatePercentageChange(recruitsCounts.unitHeadAssociate, previousPeriodData.rolesCounts.unitHeadAssociate) >= 0}
            />
            <RoleCard
              title="Financial Advisors"
              value={recruitsCounts.financialAdvisor}
              percentage={Math.abs(calculatePercentageChange(recruitsCounts.financialAdvisor, previousPeriodData.rolesCounts.financialAdvisor))}
              isPositive={calculatePercentageChange(recruitsCounts.financialAdvisor, previousPeriodData.rolesCounts.financialAdvisor) >= 0}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

const SmallMetricCard = ({ title, value, percentage, isPositive }) => {
  const getTooltipContent = () => {
    if (title === "New Recruits") {
      return "Compares last 30 days vs previous 30 days";
    }
    return "Compares current total vs total from 30 days ago";
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <h3 className="text-xs font-medium text-gray-600 mb-1">{title}</h3>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <CustomTooltip content={getTooltipContent()}>
          <div
            className={`flex items-center text-xs font-medium ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {percentage}%
          </div>
        </CustomTooltip>
      </div>
    </div>
  );
};

const RoleCard = ({ title, value, percentage, isPositive }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
    <h3 className="text-sm font-medium text-gray-600 mb-4">{title}</h3>
    <div className="flex items-end justify-between">
      <span className="text-3xl font-bold text-gray-900">{value}</span>
      <CustomTooltip content="Compares current role counts vs previous period counts">
        <div
          className={`flex items-center text-sm font-medium ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 mr-1" />
          )}
          {percentage}%
        </div>
      </CustomTooltip>
    </div>
  </div>
);

export default Dashboard;

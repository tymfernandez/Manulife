import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RecruitmentChart = () => {
  const data = [
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
    { month: 'Dec', recruits: 45 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recruitment Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
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
  );
};

export default RecruitmentChart;
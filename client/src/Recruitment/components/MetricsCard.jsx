const MetricsCard = ({ title, value, icon: Icon, trend }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-1">+{trend}% this month</p>
          )}
        </div>
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-green-600" />
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;
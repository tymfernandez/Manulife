import { FiToggleLeft, FiToggleRight, FiEye } from 'react-icons/fi';

const JobPosts = () => {
  const jobPosts = [
    { id: 1, title: 'Senior Financial Advisor', department: 'Sales', createdBy: 'Sarah Johnson', date: '2024-01-15', active: true },
    { id: 2, title: 'Unit Manager', department: 'Management', createdBy: 'John Smith', date: '2024-01-12', active: true },
    { id: 3, title: 'Branch Head', department: 'Leadership', createdBy: 'Mike Chen', date: '2024-01-10', active: false },
    { id: 4, title: 'Financial Advisor', department: 'Sales', createdBy: 'Lisa Wong', date: '2024-01-08', active: true },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Job Post Oversight</h2>
        <div className="flex space-x-2">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>All Departments</option>
            <option>Sales</option>
            <option>Management</option>
            <option>Leadership</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {jobPosts.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{job.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{job.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{job.createdBy}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{job.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    job.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {job.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button className={`${job.active ? 'text-green-600' : 'text-gray-400'}`}>
                      {job.active ? <FiToggleRight className="w-5 h-5" /> : <FiToggleLeft className="w-5 h-5" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobPosts;
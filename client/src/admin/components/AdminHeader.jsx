import { FiSettings, FiBell, FiUser } from 'react-icons/fi';

const AdminHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
          <span className="text-white font-bold text-sm">M</span>
        </div>
        <h1 className="text-xl font-semibold text-gray-800">Manulife Admin Dashboard</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <FiBell className="w-5 h-5 text-gray-600 cursor-pointer" />
        <FiSettings className="w-5 h-5 text-gray-600 cursor-pointer" />
        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
          <FiUser className="w-4 h-4 text-white" />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
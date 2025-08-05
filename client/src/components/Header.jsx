import { Search, Bell, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
          <span className="text-white font-bold text-sm">M</span>
        </div>
        <span className="text-xl font-semibold text-gray-800">Manulife</span>
      </div>

      {/* Search and User Section */}
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
          />
        </div>

        {/* Notification */}
        <div className="relative">
          <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">N</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
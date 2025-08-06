import { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  UserCheck, 
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard' },
    { icon: Users, label: 'Recruits' },
    { icon: UserCheck, label: 'Users' },
    { icon: FileText, label: 'Logs' },
  ];

  return (
    <div className={`bg-green-900 text-white h-screen transition-all duration-300 relative ${
      isCollapsed ? 'w-16' : 'w-60'
    }`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-24 bg-green-900 border border-green-700 rounded-full p-1 hover:bg-green-800 transition-colors z-20"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Menu Items */}
      <nav className="pt-20">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeItem === item.label;
          return (
            <div
              key={index}
              onClick={() => setActiveItem(item.label)}
              className={`flex items-center px-6 py-4 cursor-pointer transition-all duration-200 ${
                isActive 
                  ? 'bg-orange-500 text-white' 
                  : 'hover:bg-green-700 text-gray-200'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="ml-4 font-medium">{item.label}</span>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
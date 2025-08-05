import { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  UserCheck, 
  TrendingUp, 
  User, 
  Settings, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', active: false },
    { icon: Users, label: 'Recruits', active: true },
    { icon: UserCheck, label: 'Accounts', active: false },
    { icon: TrendingUp, label: 'Sales', active: false },
    { icon: User, label: 'Profile', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <div className={`bg-slate-700 text-white h-screen transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-56'
    } relative`}>
      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-slate-700 border border-slate-600 rounded-full p-1 hover:bg-slate-600 transition-colors"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Menu Items */}
      <nav className="pt-8">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${
                item.active 
                  ? 'bg-green-600 border-r-2 border-green-400' 
                  : 'hover:bg-slate-600'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  UserCheck, 
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity
} from 'lucide-react';

const Sidebar = ({ activeItem, setActiveItem }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  
  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
    { id: 'recruits', icon: UserCheck, label: 'Recruits', path: '/recruitment' },
    { id: 'accounts', icon: Users, label: 'Accounts', path: '/account-management' },
    { id: 'activity-logs', icon: Activity, label: 'Activity Logs', path: '/activity-logs' },
    { id: 'profile', icon: UserCheck, label: 'Profile', path: '/profile' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-emerald-800 text-white h-screen flex-shrink-0 transition-all duration-300`}>
      <div className="p-6">
        {/* Logo Section - only show when expanded */}
        {!isCollapsed && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-white">Royal Eagles</span>
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded hover:bg-emerald-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {/* Collapse button when sidebar is collapsed */}
        {isCollapsed && (
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded hover:bg-emerald-700 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveItem(item.id);
                  navigate(item.path);
                }}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-2.5 rounded-lg text-left transition-colors ${
                  isActive 
                    ? 'bg-orange-500 text-white' 
                    : 'text-emerald-100 hover:bg-emerald-700'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
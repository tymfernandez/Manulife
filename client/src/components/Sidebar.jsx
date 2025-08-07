<<<<<<< HEAD
import { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  UserCheck, 
  FileText,
=======
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  BarChart3, 
  Settings,
>>>>>>> main
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

<<<<<<< HEAD
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
=======
const Sidebar = ({ activeItem, setActiveItem }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  
  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
    { id: 'recruits', icon: UserCheck, label: 'Recruits', path: '/recruitment' },
    { id: 'accounts', icon: Users, label: 'Accounts', path: '/test-accounts' },
    { id: 'profile', icon: UserCheck, label: 'Profile', path: '/profile' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-emerald-800 text-white min-h-screen transition-all duration-300`}>
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
>>>>>>> main
  );
};

export default Sidebar;
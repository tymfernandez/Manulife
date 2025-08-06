import React from 'react';
import { 
  Users, 
  UserCheck, 
  DollarSign, 
  BarChart3, 
  Settings
} from 'lucide-react';

const Sidebar = ({ activeItem, setActiveItem }) => {
  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'recruits', icon: UserCheck, label: 'Recruits' },
    { id: 'accounts', icon: Users, label: 'Accounts' },
    { id: 'sales', icon: DollarSign, label: 'Sales' },
    { id: 'profile', icon: UserCheck, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-emerald-800 text-white min-h-screen">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-left transition-colors ${
                  isActive 
                    ? 'bg-orange-500 text-white' 
                    : 'text-emerald-100 hover:bg-emerald-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
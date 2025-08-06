import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Menu, X, User, Settings, LogOut } from 'lucide-react';
import Avatar from './avatar';
import EagleLogo from './eagleLogo';

const Header = ({ onMenuClick, activeItem, setActiveItem }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const notifications = [
    { id: 1, title: 'New Account Created', message: 'John Doe has been added to the system', time: '2 min ago', unread: true },
    { id: 2, title: 'Application Submitted', message: 'New application from Jane Smith', time: '1 hour ago', unread: true },
    { id: 3, title: 'System Update', message: 'Maintenance scheduled for tonight', time: '3 hours ago', unread: false }
  ];
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'accounts', label: 'Account Management' },
    { id: 'applications', label: 'Applications' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' }
  ];
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <div className="flex items-center space-x-3">
            <EagleLogo className="w-10 h-10" />
            <div>
              <div className="text-xl font-bold text-gray-900">Royal Eagles</div>
              <div className="text-sm text-emerald-600 font-medium">Region</div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search accounts, applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className={`pl-10 pr-4 py-2 border rounded-lg transition-all duration-200 ${
                isSearchFocused 
                  ? 'w-80 border-emerald-500 ring-2 ring-emerald-500 ring-opacity-20' 
                  : 'w-64 border-gray-200'
              } focus:outline-none`}
            />
            
            {/* Search Suggestions */}
            {isSearchFocused && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-2">
                  <div className="px-3 py-2 text-sm text-gray-500 border-b">Quick Results</div>
                  <div className="py-1">
                    <div className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm">
                      <div className="font-medium">John Doe</div>
                      <div className="text-gray-500">Financial Adviser</div>
                    </div>
                    <div className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm">
                      <div className="font-medium">Application #1234</div>
                      <div className="text-gray-500">Pending Review</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-6 h-6 text-gray-600" />
              <div className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>
            
            {/* Notifications Dropdown */}
            {isNotificationOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <button className="text-sm text-emerald-600 hover:text-emerald-700">Mark all read</button>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      notification.unread ? 'bg-blue-50' : ''
                    }`}>
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.unread ? 'bg-blue-500' : 'bg-gray-300'
                        }`}></div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{notification.title}</div>
                          <div className="text-sm text-gray-600 mt-1">{notification.message}</div>
                          <div className="text-xs text-gray-400 mt-2">{notification.time}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200">
                  <button className="w-full text-center text-sm text-emerald-600 hover:text-emerald-700">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Avatar name="User Name" className="w-8 h-8" />
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            </button>
            
            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <Avatar name="User Name" className="w-12 h-12" />
                    <div>
                      <div className="font-semibold text-gray-900">John Doe</div>
                      <div className="text-sm text-gray-600">john.doe@royaleagles.com</div>
                      <div className="text-xs text-emerald-600 mt-1">● Online</div>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">View Profile</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors">
                    <Settings className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Settings</span>
                  </button>
                </div>
                <div className="border-t border-gray-200 py-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors text-red-600">
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-2 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveItem && setActiveItem(item.id);
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeItem === item.id
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
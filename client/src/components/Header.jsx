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
              placeholder="Search"
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
          
          <div className="flex items-center space-x-2 cursor-pointer">
            <Avatar name="User Name" className="w-8 h-8" />
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
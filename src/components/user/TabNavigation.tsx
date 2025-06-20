
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, BookOpen, User, Bell } from 'lucide-react';

const TabNavigation = () => {
  const location = useLocation();
  
  const tabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'book', label: 'Book Slot', icon: Calendar, path: '/book' },
    { id: 'bookings', label: 'My Bookings', icon: BookOpen, path: '/my-bookings' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-purple-200 z-50">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          
          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-500 hover:text-purple-500'
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 ${isActive ? 'text-purple-600' : 'text-gray-500'}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-purple-600' : 'text-gray-500'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;

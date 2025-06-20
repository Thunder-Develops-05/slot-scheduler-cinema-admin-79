
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Target, Clock, ListTodo, BarChart3, Calendar, UserPlus, Building } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Target, label: 'Cricket Centers', href: '/admin/centers' },
  { icon: ListTodo, label: 'Bookings', href: '/admin/bookings' },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
  { icon: ListTodo, label: 'Overview', href: '/admin/overview' },
  { icon: Calendar, label: 'Holiday Management', href: '/admin/holidays' },
  { icon: Building, label: 'Theaters', href: '/admin/theaters' }
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="h-screen bg-gradient-to-b from-purple-800 to-purple-900 text-white w-64 fixed left-0 top-0 z-40">
      <div className="h-full p-4 flex flex-col">
        <div className="p-4 mb-6 flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-purple-500 mr-3 flex items-center justify-center shadow-lg">
            <Target className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold">Box Cricket Admin</h1>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <li key={index}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                      isActive 
                        ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium shadow-lg transform scale-105" 
                        : "hover:bg-purple-700/50 text-purple-100 hover:text-white hover:transform hover:translate-x-2"
                    )}
                  >
                    <Icon size={22} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="mt-auto p-4 text-sm text-purple-200 border-t border-purple-700">
          <p>© 2025 Box Cricket Admin</p>
          <p className="text-xs text-purple-300 mt-1">Sports Management System</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

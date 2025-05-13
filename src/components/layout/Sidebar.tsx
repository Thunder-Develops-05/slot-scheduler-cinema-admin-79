
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Film, Clock, ListTodo } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Film, label: 'Theaters', href: '/theaters' },
  { icon: Clock, label: 'Time Slots', href: '/time-slots' },
  { icon: ListTodo, label: 'Overview', href: '/overview' }
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="h-screen w-64 bg-theater-primary text-white p-4 flex flex-col">
      <div className="p-4 mb-6">
        <h1 className="text-xl font-bold">Cinema Admin</h1>
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
                    "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
                    isActive 
                      ? "bg-white/10 text-white" 
                      : "hover:bg-white/5 text-gray-300"
                  )}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="mt-auto p-4 text-sm text-gray-400">
        <p>© 2025 Cinema Admin</p>
      </div>
    </div>
  );
};

export default Sidebar;

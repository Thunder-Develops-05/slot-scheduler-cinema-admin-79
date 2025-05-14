
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Film, Clock, ListTodo, Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Film, label: 'Theaters', href: '/theaters' },
  { icon: Clock, label: 'Time Slots', href: '/time-slots' },
  { icon: ListTodo, label: 'Overview', href: '/overview' }
];

const Sidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // For mobile, we'll show the sidebar only when isOpen is true
  // For desktop, we'll always show the sidebar
  const showSidebar = !isMobile || (isMobile && isOpen);

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-3 left-3 z-50 md:hidden"
          onClick={toggleSidebar}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "h-screen bg-sidebar-background text-sidebar-foreground",
          isMobile ? "fixed z-40 transition-all transform duration-300 ease-in-out" : "w-64",
          showSidebar ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-full w-64 p-4 flex flex-col">
          <div className="p-4 mb-6 flex items-center">
            <div className="h-8 w-8 rounded-md bg-primary mr-3 flex items-center justify-center">
              <Film className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Cinema Admin</h1>
          </div>
          
          <nav className="flex-1">
            <ul className="space-y-1">
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
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                          : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70"
                      )}
                      onClick={() => isMobile && setIsOpen(false)}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          <div className="mt-auto p-4 text-sm text-sidebar-foreground/70 border-t border-sidebar-border">
            <p>© 2025 Cinema Admin</p>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;

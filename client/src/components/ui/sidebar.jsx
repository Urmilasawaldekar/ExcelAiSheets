import React, { createContext, useContext, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Upload,
  BarChart3,
  History,
  Brain,
  Settings,
} from 'lucide-react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [state, setState] = useState('expanded'); // 'expanded' or 'collapsed'

  const toggleSidebar = () => {
    setState(state === 'expanded' ? 'collapsed' : 'expanded');
  };

  return (
    <SidebarContext.Provider value={{ state, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}

export function SidebarTrigger({ className }) {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      onClick={toggleSidebar}
      className={className}
      aria-label="Toggle sidebar"
    >
      &#9776;
    </button>
  );
}

const menuItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Upload', url: '/upload', icon: Upload },
  { title: 'Analysis', url: '/analysis', icon: BarChart3 },
  { title: 'History', url: '/history', icon: History },
  { title: 'AI Insights', url: '/ai-insights', icon: Brain },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const isActive = (path) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  const getNavClassName = (path) => {
    const base =
      'flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden';
    if (isActive(path)) {
      return `${base} bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-[1.02]`;
    }
    return `${base} text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 hover:transform hover:scale-[1.02]`;
  };

  return (
    <nav
      className={`${
        collapsed ? 'w-16' : 'w-64'
      } transition-all duration-300 border-r border-gray-200 bg-white shadow-xl flex flex-col`}
    >
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
        )}
        <SidebarTrigger className="p-1.5 rounded-md hover:bg-gray-100 transition-colors" />
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.title}>
              <NavLink to={item.url} className={getNavClassName(item.url)}>
                <item.icon
                  className={`${
                    collapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'
                  } flex-shrink-0 transition-transform group-hover:scale-110`}
                />
                {!collapsed && (
                  <span className="font-medium truncate">{item.title}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

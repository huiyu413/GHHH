
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { AppRole } from '../types';
import { User, LogOut, ChevronRight, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeId: string;
  onNavigate: (id: string) => void;
  currentRole: AppRole;
  onRoleChange: (role: AppRole) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeId, onNavigate, currentRole, onRoleChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const filteredNav = NAV_ITEMS.filter(item => item.roles.includes(currentRole));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Landmark size={24} />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl text-slate-800 tracking-tight">MicroFin</span>}
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-4">
          {filteredNav.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeId === item.id 
                  ? 'bg-blue-50 text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <span className={activeId === item.id ? 'text-blue-600' : 'text-slate-400'}>
                {item.icon}
              </span>
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-xl">
            <div className="bg-slate-300 p-1.5 rounded-full">
              <User size={18} className="text-slate-600" />
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">当前身份</p>
                <select 
                  className="text-xs bg-transparent border-none p-0 text-slate-500 focus:ring-0 cursor-pointer"
                  value={currentRole}
                  onChange={(e) => onRoleChange(e.target.value as AppRole)}
                >
                  {Object.values(AppRole).map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2 className="font-semibold text-lg text-slate-800">
              {NAV_ITEMS.find(n => n.id === activeId)?.label || '概览'}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs text-slate-400">系统时间</span>
              <span className="text-sm font-medium text-slate-600">{new Date().toLocaleDateString('zh-CN')}</span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <LogOut size={16} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-600">退出</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;

// Local placeholder for Landmark icon as lucide import might fail inside this block if not careful
import { Landmark as LandmarkIcon } from 'lucide-react';
const Landmark = LandmarkIcon;

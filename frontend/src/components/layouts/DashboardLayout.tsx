import React, { useState } from 'react';
import { 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  LayoutDashboard,
  FolderOpen,
  Database,
  FileBarChart,
  Bot
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#131620] text-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-[#131620] sticky top-0 z-40">
        <div className="flex items-center space-x-2 text-blue-500">
          <Bot className="w-6 h-6" />
          <span className="font-bold text-lg text-white tracking-wider">Ai</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 -mr-2">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-24 bg-[#1a1d27] border-r border-slate-800/50 flex flex-col items-center py-6 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 shadow-2xl shadow-black",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-center text-blue-500 mb-8">
          <Bot className="w-8 h-8" />
          <span className="font-bold text-xl ml-1 text-white">Ai</span>
        </div>

        <nav className="flex-1 w-full space-y-4 flex flex-col items-center">
          <NavItem icon={<LayoutDashboard className="w-6 h-6" />} label="Dashboard" active />
          <NavItem icon={<FolderOpen className="w-6 h-6" />} label="Projects" />
          <NavItem icon={<Database className="w-6 h-6" />} label="Data Sources" />
          <NavItem icon={<FileBarChart className="w-6 h-6" />} label="Reports" />
          <NavItem icon={<Settings className="w-6 h-6" />} label="Settings" />
        </nav>

        <div className="mt-auto flex flex-col items-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-slate-600 overflow-hidden shadow-lg shadow-black/50">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="text-center">
             <div className="text-[10px] font-bold text-white tracking-wide">Alex Carter</div>
             <div className="text-[9px] text-slate-500">Level 4 Analyst</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col bg-[#131620]">
        <div className="flex-1 overflow-hidden p-2 md:p-6">
          <div className="max-w-[1600px] h-full mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

function NavItem({ icon, label, active }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <a 
      href="#" 
      className={cn(
        "flex flex-col items-center justify-center space-y-1 w-[80%] py-3 rounded-2xl transition-all duration-200 group",
        active 
          ? "bg-slate-800/80 text-blue-400 shadow-inner border border-slate-700/50" 
          : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/40"
      )}
    >
      <div className={cn(
        "transition-transform duration-200", 
        active ? "scale-105" : "group-hover:scale-110"
      )}>
        {icon}
      </div>
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </a>
  );
}

import React, { useState } from 'react';
import { 
  BarChart3, 
  Settings, 
  MessageSquare, 
  Menu, 
  X,
  Globe,
  Moon,
  Sun
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('light');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col md:flex-row transition-colors duration-300">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center space-x-2 text-indigo-400">
          <BarChart3 className="w-6 h-6" />
          <span className="font-bold text-lg">AI Analyst</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 -mr-2">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center space-x-3 text-indigo-400 hidden md:flex">
          <BarChart3 className="w-8 h-8" />
          <span className="font-bold text-xl tracking-tight">AI Analyst</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <NavItem icon={<MessageSquare className="w-5 h-5" />} label="New Analysis" active />
          {/* Future items can go here */}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button 
            onClick={toggleTheme}
            className="flex w-full items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="flex w-full items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
          <a 
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Globe className="w-5 h-5" />
            <span className="font-medium">GitHub</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Sticky Top Bar for Desktop */}
        <header className="hidden md:flex h-16 items-center justify-between px-8 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <span>Workspace</span>
            <span>/</span>
            <span className="text-slate-200">New Analysis</span>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
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

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-xl font-semibold">Settings</h2>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Appearance</h3>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Theme</span>
                  <button 
                    onClick={toggleTheme}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    <span>{isDarkMode ? 'Light' : 'Dark'}</span>
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">System</h3>
                <div className="flex items-center justify-between">
                  <span className="font-medium">App Version</span>
                  <span className="text-slate-400">v1.0.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Backend Status</span>
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Connected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, active }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <a 
      href="#" 
      className={cn(
        "flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
        active 
          ? "bg-indigo-500/10 text-indigo-400 font-medium" 
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
      )}
    >
      <div className={cn(
        "transition-transform duration-200", 
        active ? "scale-110" : "group-hover:scale-110"
      )}>
        {icon}
      </div>
      <span>{label}</span>
    </a>
  );
}

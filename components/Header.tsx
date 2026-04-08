import React, { useState, useEffect } from 'react';
import { Bell, Search, Globe, Power, Sun, Moon, Droplets, Box, Trees, Sunset, Zap, Layout, ShieldCheck, Activity, Database, AlertCircle } from 'lucide-react';
import { User, ThemeType } from '../types';
import Logo from './Logo';

interface HeaderProps {
  user: User;
  currentTheme: ThemeType;
  onThemeToggle: (theme: ThemeType) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, currentTheme, onThemeToggle, onLogout }) => {
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  useEffect(() => {
    const checkDb = async () => {
      try {
        const response = await fetch('/api/db/status');
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'connected') {
            setDbStatus('connected');
          } else {
            setDbStatus('disconnected');
          }
        } else {
          setDbStatus('disconnected');
        }
      } catch (error) {
        setDbStatus('disconnected');
      }
    };

    checkDb();
    const interval = setInterval(checkDb, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const themes: { id: ThemeType; icon: React.ReactNode; label: string }[] = [
    { id: 'light', icon: <Sun size={14} />, label: 'Light' },
    { id: 'minimal', icon: <Layout size={14} />, label: 'Arctic' },
    { id: 'midnight', icon: <Moon size={14} />, label: 'Midnight' },
    { id: 'ocean', icon: <Droplets size={14} />, label: 'Ocean' },
    { id: 'forest', icon: <Trees size={14} />, label: 'Forest' },
    { id: 'sunset', icon: <Sunset size={14} />, label: 'Sunset' },
    { id: 'cyber', icon: <Zap size={14} />, label: 'Cyber' },
    { id: 'obsidian', icon: <Box size={14} />, label: 'Obsidian' },
  ];

  return (
    <header className="h-16 bg-[var(--bg-sidebar)] border-b border-[var(--border-glow)] flex items-center justify-between px-8 z-40 transition-colors duration-500">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3 group cursor-pointer">
           <Logo className="w-6 h-6" />
           <span className="text-[12px] font-black tracking-tighter text-white uppercase hidden xl:block opacity-60 group-hover:opacity-100 transition-opacity">CUBERBOX</span>
        </div>

        <div className="h-4 w-[1px] bg-white/10 mx-2 hidden xl:block"></div>

        <div className="flex items-center bg-[var(--bg-glass)] rounded-xl px-4 py-2 border border-[var(--border-glow)] w-32 md:w-72 group focus-within:border-blue-500/30 transition-all">
          <Search size={14} className="text-slate-600 group-focus-within:text-blue-500" />
          <input 
            type="text" 
            placeholder="Search Cluster..." 
            className="bg-transparent border-none outline-none ml-3 text-[10px] w-full text-white placeholder-slate-700 font-bold uppercase tracking-widest"
          />
        </div>

        <div className="hidden xl:flex items-center space-x-3 px-4 py-2 bg-white/5 border border-white/5 rounded-xl">
           <div className="relative">
              <ShieldCheck size={16} className="text-blue-500" />
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(37,99,235,0.8)]"></div>
           </div>
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">FreeSwitch 1.10 (CUBERBOX)</span>
        </div>

        <div className={`hidden xl:flex items-center space-x-3 px-4 py-2 border rounded-xl transition-all duration-500 ${
          dbStatus === 'connected' 
            ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500' 
            : dbStatus === 'disconnected'
            ? 'bg-amber-500/5 border-amber-500/10 text-amber-500'
            : 'bg-white/5 border-white/5 text-slate-600'
        }`}>
           <div className="relative">
              {dbStatus === 'connected' ? (
                <Database size={14} className="text-emerald-500" />
              ) : dbStatus === 'disconnected' ? (
                <AlertCircle size={14} className="text-amber-500" />
              ) : (
                <Database size={14} className="text-slate-600 animate-pulse" />
              )}
           </div>
           <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
             {dbStatus === 'connected' ? 'PostgreSQL 16' : dbStatus === 'disconnected' ? 'Simulation Mode' : 'Checking...'}
           </span>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="hidden lg:flex bg-[var(--bg-glass)] p-1 rounded-xl border border-[var(--border-glow)]">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => onThemeToggle(t.id)}
              title={t.label}
              className={`p-2 rounded-lg transition-all duration-300 ${
                currentTheme === t.id 
                  ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)] scale-105' 
                  : 'text-slate-600 hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              {t.icon}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 text-slate-600 hover:text-white cursor-pointer transition-colors px-3 py-1.5 rounded-xl hover:bg-white/5">
          <Globe size={16} />
          <span className="text-[9px] font-black uppercase tracking-widest">EN</span>
        </div>

        <div className="relative group cursor-pointer p-2 hover:bg-white/5 rounded-xl transition-all">
          <Bell size={18} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
          <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
        </div>
        
        <button 
          onClick={onLogout}
          className="flex items-center space-x-3 text-rose-500 hover:bg-rose-500/10 px-4 py-2 rounded-xl transition-all duration-300 border border-transparent hover:border-rose-500/20 active:scale-95 group"
        >
          <Power size={16} className="group-hover:rotate-12 transition-transform" />
          <span className="text-[9px] font-black uppercase tracking-widest">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
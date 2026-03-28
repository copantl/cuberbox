
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, PhoneCall, Settings, BarChart3, Users, Bot, 
  Activity, Database, UserCog, ShieldAlert, GitMerge, Radio,
  Mail, ChevronRight, ListChecks, Volume2, Shield, Menu,
  LayoutGrid, ShieldCheck, Share2, Terminal, Cpu, Network,
  Smartphone, Layers, ListFilter, Sliders, Server, FileText,
  Lock, Globe, Headphones, Target, Zap, BookOpen, MonitorCheck,
  Shapes, Workflow, HardDrive, UserPlus, Users2, ShieldCheck as AuditIcon,
  Wand2, MessageSquare, Cloud
} from 'lucide-react';
import { UserRole } from '../types';
import Logo from './Logo';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
  role: UserRole;
  userLevel: number;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle, role, userLevel }) => {
  const menuItems = [
    // COMMAND CENTER
    { name: 'Dashboard', icon: LayoutDashboard, path: '/', roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.MONITOR_GTR], minLevel: 4, cat: 'COMMAND CENTER' },
    { name: 'Terminal Agente', icon: Smartphone, path: '/agent', roles: [UserRole.AGENT, UserRole.ADMIN, UserRole.MANAGER], minLevel: 1, cat: 'COMMAND CENTER' },
    { name: 'Monitor GTR', icon: MonitorCheck, path: '/realtime', roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.MONITOR_GTR], minLevel: 4, cat: 'COMMAND CENTER' },
    { name: 'GTR Avanzado', icon: Activity, path: '/gtr', roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.MONITOR_GTR], minLevel: 4, cat: 'COMMAND CENTER' },
    { name: 'Monitor Burbujas', icon: Radio, path: '/live-monitor', roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.MONITOR_GTR], minLevel: 4, cat: 'COMMAND CENTER' },
    { name: 'Omnicanal Hub', icon: Share2, path: '/whatsapp', roles: [UserRole.AGENT, UserRole.ADMIN, UserRole.MANAGER, UserRole.SOCIAL_MEDIA_MANAGER], minLevel: 1, cat: 'COMMAND CENTER' },
    { name: 'Blueprints', icon: Workflow, path: '/blueprint', roles: [UserRole.ADMIN, UserRole.MANAGER], minLevel: 6, cat: 'COMMAND CENTER' },

    // DIALER ENGINE
    { name: 'Campañas Pro', icon: Target, path: '/campaigns', roles: [UserRole.ADMIN, UserRole.MANAGER], minLevel: 7, cat: 'DIALER ENGINE' },
    { name: 'Broadcast AI', icon: Radio, path: '/broadcast-ai', roles: [UserRole.ADMIN, UserRole.MANAGER], minLevel: 8, cat: 'DIALER ENGINE' },
    { name: 'Data Warehouse', icon: Database, path: '/lists', roles: [UserRole.ADMIN, UserRole.MANAGER], minLevel: 7, cat: 'DIALER ENGINE' },
    { name: 'DNC Shield', icon: ShieldAlert, path: '/dnc', roles: [UserRole.ADMIN, UserRole.MANAGER], minLevel: 7, cat: 'DIALER ENGINE' },

    // NEURAL LAB
    { name: 'AI Studio', icon: Bot, path: '/ai-studio', roles: [UserRole.ADMIN, UserRole.MANAGER], minLevel: 7, cat: 'NEURAL LAB' },
    { name: 'Diseño IVR', icon: GitMerge, path: '/ivr', roles: [UserRole.ADMIN], minLevel: 7, cat: 'NEURAL LAB' },
    { name: 'Sonic Vault', icon: Volume2, path: '/audio-library', roles: [UserRole.ADMIN, UserRole.MANAGER], minLevel: 4, cat: 'NEURAL LAB' },

    // DATA & BI
    { name: 'Analytics Hub', icon: BarChart3, path: '/analytics-hub', roles: [UserRole.ADMIN, UserRole.MANAGER], minLevel: 6, cat: 'DATA & BI' },
    { name: 'Reportes BI', icon: FileText, path: '/reports', roles: [UserRole.ADMIN, UserRole.MANAGER], minLevel: 4, cat: 'DATA & BI' },
    { name: 'Calidad & QA', icon: ShieldCheck, path: '/qa', roles: [UserRole.ADMIN, UserRole.MANAGER], minLevel: 5, cat: 'DATA & BI' },
    { name: 'Grabaciones', icon: Headphones, path: '/recordings', roles: [UserRole.ADMIN, UserRole.MANAGER], minLevel: 4, cat: 'DATA & BI' },
    { name: 'Cloud Mesh', icon: Cloud, path: '/integrations', roles: [UserRole.ADMIN], minLevel: 8, cat: 'DATA & BI' },
    { name: 'CRM Connect', icon: Globe, path: '/crm', roles: [UserRole.ADMIN], minLevel: 8, cat: 'DATA & BI' },
    { name: 'Form Designer', icon: Layers, path: '/crm-designer', roles: [UserRole.ADMIN], minLevel: 8, cat: 'DATA & BI' },
    { name: 'External ERP', icon: Network, path: '/crm-hub', roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.SOCIAL_MEDIA_MANAGER], minLevel: 6, cat: 'DATA & BI' },

    // INFRASTRUCTURE
    { name: 'Clúster Monitor', icon: Server, path: '/cluster', roles: [UserRole.ADMIN], minLevel: 9, cat: 'INFRASTRUCTURE' },
    { name: 'Provisioning', icon: Zap, path: '/cluster-provisioning', roles: [UserRole.ADMIN], minLevel: 9, cat: 'INFRASTRUCTURE' },
    { name: 'HA Config', icon: Shield, path: '/ha-config', roles: [UserRole.ADMIN], minLevel: 9, cat: 'INFRASTRUCTURE' },
    { name: 'SIP Telephony', icon: PhoneCall, path: '/telephony', roles: [UserRole.ADMIN], minLevel: 9, cat: 'INFRASTRUCTURE' },
    { name: 'Consola ESL', icon: Terminal, path: '/telephony-console', roles: [UserRole.ADMIN], minLevel: 9, cat: 'INFRASTRUCTURE' },
    { name: 'Media Storage', icon: HardDrive, path: '/storage', roles: [UserRole.ADMIN], minLevel: 9, cat: 'INFRASTRUCTURE' },

    // GOVERNANCE
    { name: 'Usuarios', icon: Users, path: '/users', roles: [UserRole.ADMIN], minLevel: 9, cat: 'GOVERNANCE' },
    { name: 'Grupos Red', icon: Users2, path: '/user-groups', roles: [UserRole.ADMIN], minLevel: 9, cat: 'GOVERNANCE' },
    { name: 'Forense Audit', icon: AuditIcon, path: '/audit', roles: [UserRole.ADMIN], minLevel: 9, cat: 'GOVERNANCE' },
    { name: 'Pause Codes', icon: Sliders, path: '/pause-codes', roles: [UserRole.ADMIN, UserRole.MANAGER], minLevel: 8, cat: 'GOVERNANCE' },
    { name: 'Call Codes', icon: ListChecks, path: '/call-codes', roles: [UserRole.ADMIN, UserRole.MANAGER], minLevel: 8, cat: 'GOVERNANCE' },

    // SYSTEM
    { name: 'Ajustes Core', icon: Settings, path: '/settings', roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.AGENT, UserRole.MONITOR_GTR, UserRole.SOCIAL_MEDIA_MANAGER], minLevel: 1, cat: 'SYSTEM' },
    { name: 'Wizard Setup', icon: Wand2, path: '/setup-wizard', roles: [UserRole.ADMIN], minLevel: 9, cat: 'SYSTEM' },
    { name: 'Requerimientos', icon: FileText, path: '/requirements', roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.AGENT, UserRole.MONITOR_GTR, UserRole.SOCIAL_MEDIA_MANAGER], minLevel: 1, cat: 'SYSTEM' },
    { name: 'Manual Pro', icon: BookOpen, path: '/manual', roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.AGENT, UserRole.MONITOR_GTR, UserRole.SOCIAL_MEDIA_MANAGER], minLevel: 1, cat: 'SYSTEM' },
    { name: 'Nexus Deploy', icon: Terminal, path: '/instructions', roles: [UserRole.ADMIN], minLevel: 9, cat: 'SYSTEM' },
  ];

  const categories = Array.from(new Set(menuItems.map(item => item.cat)));

  const visibleItems = menuItems.filter(item => 
    item.roles.includes(role) && userLevel >= item.minLevel
  );

  return (
    <aside className={`fixed top-0 left-0 h-full bg-[var(--bg-sidebar)] border-r border-[var(--border-glow)] transition-all duration-500 z-50 flex flex-col ${isOpen ? 'w-64' : 'w-20'}`}>
       {/* Sidebar Header */}
       <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
          {isOpen && (
            <div className="flex items-center space-x-3 animate-in fade-in duration-500">
               <Logo className="w-8 h-8" />
               <div className="flex flex-col">
                 <span className="font-black text-white tracking-tighter uppercase text-sm leading-none">Cuberbox</span>
                 <span className="text-[8px] font-bold text-blue-500 uppercase tracking-[0.2em] mt-1">Nexus Core</span>
               </div>
            </div>
          )}
          <button 
            onClick={toggle} 
            className={`p-2 hover:bg-[var(--bg-glass)] rounded text-slate-500 transition-all active:scale-90 ${!isOpen ? 'mx-auto' : ''}`}
          >
             <Menu size={18} />
          </button>
       </div>

       {/* System Status */}
       {isOpen && (
         <div className="px-6 py-4 border-b border-[var(--border-glow)]">
            <div className="flex items-center justify-between bg-[var(--bg-glass)] p-2 rounded border border-[var(--border-glow)]">
               <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">System Online</span>
               </div>
               <span className="text-[9px] font-mono text-blue-500">v4.7.9</span>
            </div>
         </div>
       )}

       {/* Navigation Content */}
       <div className="flex-1 overflow-y-auto py-6 scrollbar-hide space-y-6">
          {categories.map((cat) => {
            const catItems = visibleItems.filter(i => i.cat === cat);
            if (catItems.length === 0) return null;

            return (
              <div key={cat} className="space-y-1">
                {isOpen && (
                  <div className="px-6 mb-2 flex items-center space-x-2">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] whitespace-nowrap">{cat}</span>
                    <div className="h-[1px] w-full border-t border-dashed border-white/10" />
                  </div>
                )}
                <div className="px-3 space-y-0.5">
                  {catItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) => `
                        flex items-center space-x-3 w-full p-2.5 rounded transition-all duration-200 group relative
                        ${isActive 
                          ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-[inset_0_0_10px_rgba(37,99,235,0.1)]' 
                          : 'text-slate-500 hover:bg-[var(--bg-glass)] hover:text-slate-200 border border-transparent'
                        }
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon size={isOpen ? 18 : 22} className={`shrink-0 transition-transform duration-300 ${!isOpen ? 'mx-auto' : ''}`} />
                          {isOpen && (
                            <span className="text-[10px] font-bold uppercase tracking-widest truncate">{item.name}</span>
                          )}
                          
                          {/* Active Indicator */}
                          {isOpen && (
                            <div className={`absolute right-3 w-1 h-1 rounded-full bg-blue-500 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                          )}

                          {/* Tooltip for collapsed state */}
                          {!isOpen && (
                            <div className="absolute left-full ml-4 px-3 py-2 bg-[#0a0a0a] border border-white/10 text-white text-[9px] font-bold uppercase tracking-widest rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-2xl">
                              {item.name}
                            </div>
                          )}
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
       </div>

       {/* Sidebar Footer */}
       <div className="p-4 border-t border-white/5 shrink-0">
          <div className={`flex items-center ${isOpen ? 'space-x-3' : 'justify-center'} bg-white/5 p-3 rounded border border-white/5`}>
             <div className="w-7 h-7 rounded bg-slate-900 flex items-center justify-center text-blue-400 font-bold text-[10px] border border-white/10">
                {userLevel}
             </div>
             {isOpen && (
               <div className="min-w-0 animate-in fade-in duration-500">
                  <p className="text-[9px] font-black text-white uppercase tracking-tighter truncate">Authority Node</p>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Level {userLevel}</p>
               </div>
             )}
          </div>
       </div>
    </aside>
  );
};

export default Sidebar;

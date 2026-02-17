
import React, { useState, useEffect } from 'react';
import { 
  Activity, Users, PhoneCall, Clock, AlertTriangle, TrendingUp, ChevronRight,
  Zap, PhoneForwarded, LayoutGrid, Monitor, Headphones, Radio, Mic, ShieldAlert,
  Server as ServerIcon, Globe, RefreshCw, ShieldCheck, User, Search, Play,
  Pause, MoreVertical, MessageSquare, Volume2, Ear, Mic2, Users2, X, AlertCircle,
  PhoneIncoming, PhoneOutgoing, Layers, Settings, Info, Wifi, Database, 
  Cpu, HardDrive, BarChart3, Terminal, Timer, Hourglass,
  Smile, Signal, Maximize2, Trophy, Target, Award, Shapes, Filter,
  VolumeX, Lock, PhoneOff, Plus, UserCheck, CheckCircle2, History,
  Power, Trash2,
  // Added missing import
  Smartphone
} from 'lucide-react';
import Wallboard from './Wallboard';
import Logo from './Logo';
import { useToast } from '../ToastContext';

interface AgentStatus {
  id: string;
  name: string;
  status: 'READY' | 'INCALL' | 'PAUSED' | 'WRAPUP';
  duration: number;
  campaign: string;
  callsToday: number;
  lastCallTime?: string;
  monitorActive?: 'LISTEN' | 'WHISPER' | 'BARGE' | null;
}

const RealTimeMonitor: React.FC = () => {
  const { toast } = useToast();
  const [agents, setAgents] = useState<AgentStatus[]>([
    { id: '1', name: 'Maria G.', status: 'INCALL', duration: 125, campaign: 'Real Estate Florida', callsToday: 42, lastCallTime: '14:05', monitorActive: null },
    { id: '2', name: 'Juan P.', status: 'READY', duration: 15, campaign: 'Real Estate Florida', callsToday: 38, lastCallTime: '14:02', monitorActive: null },
    { id: '3', name: 'Carla M.', status: 'PAUSED', duration: 600, campaign: 'Soporte VIP', callsToday: 25, lastCallTime: '13:50', monitorActive: null },
    { id: '4', name: 'Pedro S.', status: 'INCALL', duration: 340, campaign: 'Real Estate Florida', callsToday: 55, lastCallTime: '14:04', monitorActive: null },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setAgents(prev => prev.map(a => ({ ...a, duration: a.duration + 1 })));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMonitor = (agentId: string, mode: 'LISTEN' | 'WHISPER' | 'BARGE') => {
    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        const isTurningOff = a.monitorActive === mode;
        if (!isTurningOff) {
          toast(`Iniciando modo ${mode} en Extensión de ${a.name}`, 'info', 'Intervención de Supervisor');
        }
        return { ...a, monitorActive: isTurningOff ? null : mode };
      }
      return { ...a, monitorActive: null };
    }));
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m}:${rs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 h-full flex flex-col animate-in fade-in duration-700 pb-10">
      <div className="flex items-center justify-between shrink-0">
         <div className="flex items-center space-x-5">
            <Logo className="w-10 h-10" />
            <div>
               <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Overdrive Monitor Hub</h2>
               <p className="text-slate-500 text-sm font-medium">Control táctico de planta y auditoría de canales v4.8.</p>
            </div>
         </div>
         <div className="flex items-center space-x-6 bg-slate-900 border border-slate-800 px-6 py-2.5 rounded-full shadow-inner">
            <div className="flex items-center space-x-2">
               <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-[10px] font-black text-slate-300 uppercase">Pool: 42 Agentes</span>
            </div>
            <div className="h-4 w-px bg-slate-800"></div>
            <div className="flex items-center space-x-2">
               <span className="text-[10px] font-black text-blue-400 uppercase">Core: 100% Sync</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 shrink-0">
         {agents.map(agent => (
           <div key={agent.id} className={`glass p-8 rounded-[48px] border-2 transition-all relative overflow-hidden group ${agent.monitorActive ? 'border-blue-500 shadow-blue-500/10' : agent.duration > 300 && agent.status !== 'INCALL' ? 'border-rose-500/40 bg-rose-500/5' : 'border-slate-800'}`}>
              <div className="flex justify-between items-start mb-6">
                 <div className={`p-4 rounded-2xl ${agent.status === 'INCALL' ? 'bg-blue-600' : agent.status === 'READY' ? 'bg-emerald-500' : 'bg-slate-800'} text-white shadow-xl`}>
                    {agent.status === 'INCALL' ? <Smartphone size={24} /> : <User size={24} />}
                 </div>
                 <div className="text-right">
                    <p className={`text-xl font-mono font-black ${agent.duration > 300 ? 'text-rose-500' : 'text-white'}`}>{formatTime(agent.duration)}</p>
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1">Time in Status</p>
                 </div>
              </div>

              <h4 className="text-xl font-black text-white uppercase tracking-tight mb-1">{agent.name}</h4>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-6 truncate">{agent.campaign}</p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                 <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <p className="text-[7px] font-black text-slate-600 uppercase mb-1">Calls</p>
                    <p className="text-sm font-black text-white">{agent.callsToday}</p>
                 </div>
                 <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-right">
                    <p className="text-[7px] font-black text-slate-600 uppercase mb-1">Last Contact</p>
                    <p className="text-sm font-black text-blue-400 font-mono">{agent.lastCallTime}</p>
                 </div>
              </div>

              {/* CONTROLES DE SUPERVISOR */}
              <div className="pt-6 border-t border-slate-800/50 flex items-center justify-between">
                 <div className="flex space-x-1.5">
                    <button 
                      onClick={() => handleMonitor(agent.id, 'LISTEN')}
                      className={`p-3 rounded-xl border transition-all ${agent.monitorActive === 'LISTEN' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-600 hover:text-white'}`}
                      title="Listen (Escucha Silenciosa)"
                    >
                       <Ear size={16} />
                    </button>
                    <button 
                      onClick={() => handleMonitor(agent.id, 'WHISPER')}
                      className={`p-3 rounded-xl border transition-all ${agent.monitorActive === 'WHISPER' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-600 hover:text-white'}`}
                      title="Whisper (Susurrar al Agente)"
                    >
                       <Mic2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleMonitor(agent.id, 'BARGE')}
                      className={`p-3 rounded-xl border transition-all ${agent.monitorActive === 'BARGE' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-slate-600 hover:text-white'}`}
                      title="Barge (Entrar en Conferencia)"
                    >
                       <Users2 size={16} />
                    </button>
                 </div>
                 <button className="p-3 text-slate-500 hover:text-rose-500 transition-colors"><Power size={18} /></button>
              </div>

              {agent.monitorActive && (
                 <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_10px_#3b82f6] animate-pulse"></div>
              )}
           </div>
         ))}
      </div>

      <div className="flex-1 glass rounded-[64px] border border-slate-700/50 p-12 flex flex-col items-center justify-center text-center opacity-30">
          <Activity size={80} className="text-blue-500 mb-8 animate-pulse" />
          <h3 className="text-2xl font-black text-white uppercase tracking-[0.4em]">Panel de Inteligencia GTR</h3>
          <p className="text-sm text-slate-500 mt-4 max-w-sm font-bold uppercase tracking-widest">Sincronización total con la base de datos PostgreSQL 16 y el servidor Asterisk/FreeSwitch.</p>
      </div>
    </div>
  );
};

export default RealTimeMonitor;


import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, Users, PhoneIncoming, Zap, AlertTriangle, Timer, 
  Search, Filter, Headphones, Power, RefreshCw, ChevronRight,
  ShieldAlert, Radio, Clock, ShieldCheck, Play, Pause, X,
  MonitorCheck, MoreHorizontal, ArrowUpRight, BarChart3,
  Bell, BellRing, LogOut, ArrowRightCircle, Smartphone, AlertCircle
} from 'lucide-react';
import { useToast } from '../ToastContext';
import { GTRAgentMetric, GTRQueueMetric } from '../types';
import ConfirmDialog from './ConfirmDialog';

const MOCK_QUEUES: GTRQueueMetric[] = [
  { queueName: 'Ventas Florida', callsWaiting: 4, longestWait: 45, agentsLogged: 12, agentsReady: 2, slaPercent: 92 },
  { queueName: 'Soporte Técnico', callsWaiting: 0, longestWait: 0, agentsLogged: 8, agentsReady: 5, slaPercent: 98 },
  { queueName: 'Cobranzas Late', callsWaiting: 12, longestWait: 180, agentsLogged: 5, agentsReady: 0, slaPercent: 64 },
];

const INITIAL_AGENTS: GTRAgentMetric[] = [
  { agentId: '1', agentName: 'Maria Gonzalez', status: 'INCALL', statusDuration: 120, campaignName: 'Real Estate Florida', callsToday: 42, salesToday: 5, occupancyRate: 88, currentCallDuration: 120, warningLevel: 'NONE' },
  { agentId: '2', agentName: 'Juan Perez', status: 'WRAPUP', statusDuration: 45, campaignName: 'Real Estate Florida', callsToday: 38, salesToday: 3, occupancyRate: 72, warningLevel: 'CRITICAL' },
  { agentId: '3', agentName: 'Carla Mendez', status: 'PAUSED', statusDuration: 900, campaignName: 'Soporte Técnico', callsToday: 25, salesToday: 0, occupancyRate: 91, warningLevel: 'CRITICAL' },
  { agentId: '4', agentName: 'Pedro Sanchez', status: 'READY', statusDuration: 15, campaignName: 'Real Estate Florida', callsToday: 55, salesToday: 8, occupancyRate: 94, warningLevel: 'NONE' },
  { agentId: '5', agentName: 'Sofia Ruiz', status: 'INCALL', statusDuration: 350, campaignName: 'Cobranzas Late', callsToday: 30, salesToday: 2, occupancyRate: 85, currentCallDuration: 350, warningLevel: 'LOW' },
];

const GTRDashboard: React.FC = () => {
  const { toast } = useToast();
  const [agents, setAgents] = useState<GTRAgentMetric[]>(INITIAL_AGENTS);
  const [queues, setQueues] = useState<GTRQueueMetric[]>(MOCK_QUEUES);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [activeAlerts, setActiveAlerts] = useState<string[]>([]);
  const [confirmAction, setConfirmAction] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setAgents(prev => prev.map(a => {
        const newDuration = a.statusDuration + 1;
        let warning: GTRAgentMetric['warningLevel'] = 'NONE';
        
        if (a.status === 'WRAPUP' && newDuration > 30) warning = 'CRITICAL';
        else if (a.status === 'PAUSED' && newDuration > 600) warning = 'CRITICAL';
        else if (newDuration > 300) warning = 'LOW';

        return {
          ...a,
          statusDuration: newDuration,
          currentCallDuration: a.status === 'INCALL' ? (a.currentCallDuration || 0) + 1 : undefined,
          warningLevel: warning
        };
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m}:${rs.toString().padStart(2, '0')}`;
  };

  const filteredAgents = useMemo(() => 
    agents.filter(a => 
      (filterStatus === 'ALL' || a.status === filterStatus) &&
      (a.agentName.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  , [agents, searchTerm, filterStatus]);

  const handleForceReady = (id: string) => {
    toast('Señal remota: Forzando estado READY.', 'info', 'GTR Action');
    setAgents(agents.map(a => a.agentId === id ? { ...a, status: 'READY', statusDuration: 0, warningLevel: 'NONE' } : a));
  };

  const handlePoke = (name: string) => {
     toast(`Enviando alerta visual a ${name}...`, 'success', 'Supervisor Poke');
  };

  const handleForceLogout = (id: string) => {
    setConfirmAction({
      isOpen: true,
      title: 'Forzar Logout',
      message: '¿Deseas desconectar forzosamente al agente? El socket se cerrará inmediatamente.',
      onConfirm: () => {
        setAgents(agents.filter(a => a.agentId !== id));
        toast('Agente desconectado por el supervisor.', 'warning');
      }
    });
  };

  return (
    <div className="space-y-4 md:space-y-8 animate-in fade-in duration-700 pb-20 px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
        <div>
          <h2 className="text-xl md:text-3xl font-black text-white tracking-tighter uppercase flex items-center">
            <MonitorCheck className="mr-3 md:mr-4 text-blue-500 shrink-0" size={28} />
            <span className="truncate">Supervisión Táctica GTR</span>
          </h2>
          <p className="text-slate-400 text-[10px] md:text-sm font-medium">Control de tiempos y auditoría de planta en vivo v4.7.9.</p>
        </div>
        <div className="flex items-center">
           <div className="bg-slate-900 border border-slate-800 px-4 md:px-6 py-1.5 md:py-2.5 rounded-full flex items-center space-x-2 md:space-x-3 w-fit">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[8px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest">Postgres Link: Active</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {queues.map((q, i) => (
          <div key={i} className={`glass p-5 md:p-8 rounded-3xl md:rounded-[48px] border-2 shadow-2xl relative overflow-hidden transition-all ${q.callsWaiting > 5 ? 'border-rose-500/30' : 'border-slate-800'}`}>
             <div className="flex justify-between items-center mb-4 md:mb-6">
                <h3 className="font-black text-white uppercase tracking-tight text-sm md:text-lg">{q.queueName}</h3>
                <div className={`p-1.5 md:p-2 rounded-xl ${q.callsWaiting > 0 ? 'bg-rose-500 text-white animate-bounce' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}>
                   <PhoneIncoming className="w-4 h-4 md:w-5 md:h-5" />
                </div>
             </div>
             <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-0.5 md:space-y-1">
                   <p className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest">Waiting</p>
                   <p className={`text-2xl md:text-4xl font-black ${q.callsWaiting > 5 ? 'text-rose-500' : 'text-white'}`}>{q.callsWaiting}</p>
                </div>
                <div className="space-y-0.5 md:space-y-1">
                   <p className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest">SLA Goal</p>
                   <p className={`text-2xl md:text-4xl font-black ${q.slaPercent < 80 ? 'text-amber-400' : 'text-emerald-400'}`}>{q.slaPercent}%</p>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-8">
        <div className="col-span-12 lg:col-span-9 flex flex-col">
          <div className="glass rounded-3xl md:rounded-[56px] border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col">
             <div className="p-6 md:p-10 border-b border-slate-800 bg-slate-900/60 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8">
                <div className="flex items-center space-x-4 md:space-x-5 self-start lg:self-auto">
                   <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 shadow-inner shrink-0">
                      <Users className="w-5 h-5 md:w-6 md:h-6" />
                   </div>
                   <div>
                      <h3 className="text-base md:text-xl font-black text-white uppercase tracking-tight">Agent Overdrive Matrix</h3>
                      <p className="text-[8px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5 md:mt-1">Control Disciplinario en Tiempo Real</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 w-full lg:w-auto">
                   <div className="relative flex-1 lg:w-80">
                      <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4 md:w-[18px] md:h-[18px]" />
                      <input 
                        type="text" 
                        placeholder="Buscar operador..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl md:rounded-[24px] pl-12 md:pl-14 pr-4 md:pr-6 py-3 md:py-4 text-[10px] md:text-xs text-white font-bold outline-none focus:border-blue-500 shadow-inner"
                      />
                   </div>
                </div>
             </div>

             <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full text-left min-w-[700px] lg:min-w-0">
                   <thead className="bg-slate-950/40 text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.4em]">
                      <tr>
                         <th className="px-6 md:px-10 py-4 md:py-6">Agente</th>
                         <th className="px-6 md:px-10 py-4 md:py-6 text-center">Estado</th>
                         <th className="px-6 md:px-10 py-4 md:py-6 text-center">Duración</th>
                         <th className="px-6 md:px-10 py-4 md:py-6 text-center">Ocupación</th>
                         <th className="px-6 md:px-10 py-4 md:py-6 text-right">Mandos</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-800/50">
                      {filteredAgents.map(agent => (
                        <tr key={agent.agentId} className={`hover:bg-blue-600/5 transition-all group ${agent.warningLevel === 'CRITICAL' ? 'bg-rose-600/10' : ''}`}>
                           <td className="px-6 md:px-10 py-5 md:py-8">
                              <div className="flex items-center space-x-4 md:space-x-6">
                                 <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-800 flex items-center justify-center text-[9px] md:text-[11px] font-black text-blue-400 border border-slate-700 shadow-lg shrink-0 ${agent.warningLevel === 'CRITICAL' ? 'border-rose-500 shadow-rose-500/20' : ''}`}>
                                    {agent.agentName.split(' ').map(n=>n[0]).join('')}
                                 </div>
                                 <div className="min-w-0">
                                    <span className="font-black text-xs md:text-sm text-slate-200 uppercase tracking-tight block truncate">{agent.agentName}</span>
                                    <p className="text-[8px] md:text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-0.5 md:mt-1 truncate">{agent.campaignName}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 md:px-10 py-5 md:py-8 text-center">
                              <span className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border transition-all ${
                                agent.status === 'READY' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                agent.status === 'INCALL' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' :
                                agent.status === 'PAUSED' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              }`}>
                                {agent.status}
                              </span>
                           </td>
                           <td className="px-6 md:px-10 py-5 md:py-8 text-center">
                              <div className={`text-sm md:text-lg font-mono font-black tabular-nums ${agent.warningLevel === 'CRITICAL' ? 'text-rose-500 animate-pulse' : 'text-slate-300'}`}>
                                 {formatTime(agent.statusDuration)}
                              </div>
                           </td>
                           <td className="px-6 md:px-10 py-5 md:py-8 text-center">
                              <div className="flex flex-col items-center space-y-1 md:space-y-2">
                                 <p className="text-xs md:text-sm font-black text-white">{agent.occupancyRate}%</p>
                                 <div className="w-12 md:w-16 h-1 bg-slate-900 rounded-full overflow-hidden">
                                    <div className={`h-full ${agent.occupancyRate > 85 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${agent.occupancyRate}%` }}></div>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 md:px-10 py-5 md:py-8 text-right">
                              <div className="flex items-center justify-end space-x-1 md:space-x-2">
                                 <button onClick={() => handlePoke(agent.agentName)} className="p-2 md:p-3 bg-slate-900 border border-slate-800 hover:bg-blue-600 text-slate-500 hover:text-white rounded-lg md:rounded-xl transition-all shadow-xl" title="Enviar Poke Alerta"><Bell className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                                 <button onClick={() => handleForceReady(agent.agentId)} className="p-2 md:p-3 bg-slate-900 border border-slate-800 hover:bg-emerald-600 text-slate-500 hover:text-white rounded-lg md:rounded-xl transition-all shadow-xl" title="Forzar Ready"><Play className="w-3.5 h-3.5 md:w-4 md:h-4" fill="currentColor" /></button>
                                 <button onClick={() => handleForceLogout(agent.agentId)} className="p-2 md:p-3 bg-slate-900 border border-slate-800 hover:bg-rose-600 text-slate-500 hover:text-white rounded-lg md:rounded-xl transition-all shadow-xl" title="Forzar Logout"><LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                              </div>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-3 space-y-6 md:space-y-8">
           <div className="glass p-6 md:p-8 rounded-3xl md:rounded-[56px] border border-rose-500/20 bg-rose-500/5 shadow-2xl space-y-6 md:space-y-8">
              <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight flex items-center">
                 <AlertCircle className="mr-2 md:mr-3 text-rose-500 w-5 h-5 md:w-6 md:h-6" /> Threshold Alerts
              </h3>
              <div className="space-y-3 md:space-y-4 max-h-[400px] md:max-h-[600px] overflow-y-auto scrollbar-hide pr-1 md:pr-2">
                 {agents.filter(a => a.warningLevel === 'CRITICAL').map(a => (
                    <div key={a.agentId} className="p-4 md:p-5 bg-slate-950/80 border border-rose-500/30 rounded-2xl md:rounded-3xl space-y-2 md:space-y-3 animate-pulse">
                       <div className="flex justify-between items-center">
                          <span className="text-[8px] md:text-[10px] font-black text-rose-400 uppercase tracking-widest">{a.status} EXCESIVO</span>
                          <span className="text-[8px] md:text-[10px] font-mono text-rose-300">{formatTime(a.statusDuration)}</span>
                       </div>
                       <p className="text-[10px] md:text-xs font-black text-white uppercase tracking-tight">{a.agentName}</p>
                       <button onClick={() => handleForceReady(a.agentId)} className="w-full py-1.5 md:py-2 bg-rose-600 text-white rounded-lg md:rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest active:scale-95">Normalizar Estado</button>
                    </div>
                 ))}
                 {agents.filter(a => a.warningLevel === 'CRITICAL').length === 0 && (
                    <div className="py-12 md:py-20 text-center opacity-20">
                       <ShieldCheck className="mx-auto text-emerald-500 mb-3 md:mb-4 w-12 h-12 md:w-16 md:h-16" />
                       <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white">No hay desvíos críticos</p>
                    </div>
                 )}
              </div>
           </div>

           <div className="p-6 md:p-8 glass rounded-3xl md:rounded-[48px] border border-blue-500/20 bg-blue-600/5 space-y-4 md:space-y-6">
              <h4 className="font-black text-base md:text-lg text-white uppercase tracking-tighter flex items-center">
                 <Zap className="mr-2 md:mr-3 text-blue-400 w-4.5 h-4.5 md:w-5 md:h-5" /> Overdrive Stats
              </h4>
              <div className="space-y-3 md:space-y-4">
                 <div className="p-3 md:p-4 bg-slate-950 rounded-xl md:rounded-2xl border border-slate-800">
                    <p className="text-[7px] md:text-[8px] font-black text-slate-600 uppercase tracking-widest">Avg planta ready</p>
                    <p className="text-lg md:text-xl font-black text-emerald-400">14.2s</p>
                 </div>
                 <div className="p-3 md:p-4 bg-slate-950 rounded-xl md:rounded-2xl border border-slate-800">
                    <p className="text-[7px] md:text-[8px] font-black text-slate-600 uppercase tracking-widest">Time Leaks (Global)</p>
                    <p className="text-lg md:text-xl font-black text-rose-500">42m 12s</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
      <ConfirmDialog 
        isOpen={confirmAction.isOpen}
        title={confirmAction.title}
        message={confirmAction.message}
        onConfirm={confirmAction.onConfirm}
        onCancel={() => setConfirmAction(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default GTRDashboard;

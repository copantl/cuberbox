
import React, { useState, useEffect } from 'react';
import { 
  Cpu, Server, Activity, Zap, RefreshCw, ShieldCheck, 
  Database, HardDrive, Network, Phone, ShieldAlert, 
  AlertTriangle, Layers, Timer, Terminal, Gauge, 
  Settings, Signal, Radio, ArrowRightLeft,
  // Added missing import
  Globe
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '../ToastContext';
import { ClusterNode } from '../types';

const ClusterMonitor: React.FC = () => {
  const { toast } = useToast();
  const [loadData, setLoadData] = useState(Array.from({ length: 20 }, (_, i) => ({ time: i, load: Math.floor(Math.random() * 30) + 15 })));
  
  // Mock data actualizado a FreeSwitch 1.10 Nexus Core
  const [nodes, setNodes] = useState<ClusterNode[]>([
    { id: 'fs-01', name: 'FreeSwitch Master Core', ip: '10.0.0.10', role: 'MASTER', status: 'ONLINE', cpu: 14, mem: 6.2, channels: 245, threads: 520, dbLatency: 2 },
    { id: 'fs-02', name: 'FreeSwitch Media Node 01', ip: '10.0.0.11', role: 'MEDIA', status: 'ONLINE', cpu: 18, mem: 4.8, channels: 412, threads: 380, dbLatency: 5 },
    { id: 'fs-03', name: 'FreeSwitch Media Node 02', ip: '10.0.0.12', role: 'MEDIA', status: 'ONLINE', cpu: 11, mem: 4.1, channels: 310, threads: 310, dbLatency: 3 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadData(prev => {
        const nextVal = Math.floor(Math.random() * 40) + 20;
        const newData = [...prev.slice(1), { time: prev[prev.length - 1].time + 1, load: nextVal }];
        return newData;
      });

      setNodes(prev => prev.map(node => ({
        ...node,
        cpu: Math.max(5, Math.min(95, node.cpu + (Math.random() > 0.5 ? 3 : -3))),
        channels: Math.max(50, node.channels + (Math.random() > 0.5 ? 12 : -10)), // Simula sesiones activas
        dbLatency: Math.max(1, node.dbLatency + (Math.random() > 0.8 ? 1 : -1)) // Simula latencia ESL
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleAction = (nodeName: string, action: string) => {
    toast(`Ejecutando ${action} en ${nodeName}...`, 'info', 'FreeSwitch Remote Control');
    setTimeout(() => {
      toast(`Comando ${action} completado con éxito en el clúster.`, 'success');
    }, 1500);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase flex items-center">
            <Zap className="mr-4 text-blue-500" size={36} />
            Clúster FreeSwitch v4.7.9
          </h2>
          <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest opacity-60">Gobernanza del Media Plane • Nexus Core Edition</p>
        </div>
        <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 p-2 rounded-2xl">
           <div className="px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-xl">
              <p className="text-[8px] font-black text-blue-400 uppercase">Global CPS</p>
              <p className="text-lg font-black text-white leading-none">42.5</p>
           </div>
           <div className="px-4 py-2 bg-emerald-600/10 border border-emerald-500/20 rounded-xl">
              <p className="text-[8px] font-black text-emerald-400 uppercase">Total Sessions</p>
              <p className="text-lg font-black text-white leading-none">967</p>
           </div>
        </div>
      </div>

      {/* Grid de Nodos FreeSwitch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {nodes.map(node => (
          <div key={node.id} className="glass p-10 rounded-[64px] border border-slate-700/50 shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-10 opacity-5 text-blue-400 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                <Server size={200} />
             </div>
             
             <div className="flex justify-between items-start mb-10 relative z-10">
                <div className={`p-4 rounded-2xl ${node.role === 'MASTER' ? 'bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-slate-800'} text-white shadow-xl transition-all group-hover:rotate-3`}>
                   {node.role === 'MASTER' ? <Globe size={28} /> : <Radio size={28} />}
                </div>
                <div className="flex flex-col items-end space-y-2">
                   <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${node.status === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                      {node.status}
                   </div>
                   <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">{node.ip}</span>
                </div>
             </div>

             <div className="space-y-1 mb-10 relative z-10">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">{node.name}</h3>
                <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">Protocolo: ESL / Sofia v1.10</p>
             </div>

             <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                <div className="p-5 bg-slate-950/60 rounded-[32px] border border-slate-800 space-y-2 shadow-inner">
                   <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Active Sessions</p>
                   <div className="flex items-center space-x-3">
                      <Layers size={16} className="text-blue-500" />
                      <span className="text-2xl font-black text-white font-mono">{node.channels}</span>
                   </div>
                </div>
                <div className="p-5 bg-slate-950/60 rounded-[32px] border border-slate-800 space-y-2 shadow-inner">
                   <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">ESL Ping</p>
                   <div className="flex items-center space-x-3">
                      <Timer size={16} className="text-emerald-500" />
                      <span className="text-2xl font-black text-white font-mono">{node.dbLatency}ms</span>
                   </div>
                </div>
             </div>

             <div className="space-y-6 relative z-10">
                <div className="space-y-3">
                   <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      <span>Thread Core Load</span>
                      <span className={node.cpu > 80 ? 'text-rose-500' : 'text-white'}>{node.cpu}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden shadow-inner">
                      <div className={`h-full transition-all duration-1000 ${node.cpu > 80 ? 'bg-rose-500 shadow-[0_0_12px_#f43f5e]' : 'bg-blue-500 shadow-[0_0_8px_#3b82f6]'}`} style={{ width: `${node.cpu}%` }}></div>
                   </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl group/perf">
                   <div className="flex items-center space-x-3">
                      <Signal size={14} className="text-slate-600 group-hover/perf:text-blue-400 transition-colors" />
                      <span className="text-[9px] font-black text-slate-500 uppercase">Sofia Status:</span>
                   </div>
                   <span className="text-[9px] font-black text-emerald-400 uppercase">Running</span>
                </div>
             </div>

             <div className="mt-10 pt-8 border-t border-slate-800 flex items-center justify-between relative z-10">
                <button onClick={() => handleAction(node.name, 'RELOADXML')} className="text-[9px] font-black text-blue-500 hover:text-white uppercase tracking-widest transition-colors flex items-center group/btn">
                   <RefreshCw size={12} className="mr-1.5 group-hover/btn:rotate-180 transition-transform duration-700" />
                   Reload XML
                </button>
                <div className="flex space-x-2">
                   <button onClick={() => handleAction(node.name, 'FS_CLI')} className="p-3 bg-slate-900 border border-slate-800 hover:bg-blue-600 text-slate-500 hover:text-white rounded-xl transition-all shadow-lg" title="Open Console"><Terminal size={16} /></button>
                   <button onClick={() => handleAction(node.name, 'RECOVER')} className="p-3 bg-slate-900 border border-slate-800 hover:bg-emerald-600 text-slate-500 hover:text-white rounded-xl transition-all shadow-lg" title="Recover Profiles"><ShieldCheck size={16} /></button>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Analytics Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass p-12 rounded-[64px] border border-slate-700/50 shadow-2xl relative overflow-hidden bg-[#020617]/50">
           <div className="flex items-center justify-between mb-12">
              <div>
                 <h3 className="text-2xl font-black text-white uppercase tracking-tight">Clúster Load Matrix</h3>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-1">Monitoreo de throughput global (Sessions/Sec)</p>
              </div>
              <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800 text-blue-400 shadow-inner group">
                 <Activity size={24} className="group-hover:scale-110 transition-transform" />
              </div>
           </div>
           <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={loadData}>
                    <defs>
                       <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" hide />
                    <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '24px' }} />
                    <Area type="monotone" dataKey="load" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorLoad)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="glass p-10 rounded-[64px] border border-blue-500/20 bg-blue-600/5 shadow-2xl space-y-8 relative overflow-hidden">
              <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center">
                 <Settings className="mr-3 text-blue-400" />
                 Core Balance Settings
              </h3>
              <div className="space-y-6">
                 <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-[32px] space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Load Balancer Mode</span>
                       <span className="text-[10px] font-black text-blue-400 uppercase bg-blue-600/10 px-3 py-1 rounded-full">Active-Passive</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-600" style={{ width: '100%' }}></div>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-[32px] text-center space-y-1">
                       <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Max Sessions</p>
                       <p className="text-xl font-black text-white tracking-tighter">5,000</p>
                    </div>
                    <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-[32px] text-center space-y-1">
                       <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Sessions Rate</p>
                       <p className="text-xl font-black text-emerald-400 tracking-tighter">100/s</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="p-10 glass rounded-[64px] border border-rose-500/20 bg-rose-500/5 shadow-inner">
              <div className="flex items-center space-x-6 mb-8">
                 <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 animate-pulse">
                    <ShieldAlert size={28} />
                 </div>
                 <h4 className="text-xl font-black text-white uppercase tracking-tight">Cluster Guard</h4>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed mb-10">
                 El sistema detectó una latencia inusual en el Nodo 02. ¿Deseas <span className="text-rose-400">Drenar Canales</span> y realizar un reinicio controlado del servicio?
              </p>
              <button className="w-full py-5 bg-slate-950 border-2 border-rose-500/20 rounded-3xl text-rose-500 hover:bg-rose-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.3em] active:scale-95 shadow-xl">
                 Lanzar Protocolo Drenaje
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ClusterMonitor;


import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';
import { 
  Users, Clock, Activity, Zap, TrendingUp, RefreshCw, Target, Timer, 
  AlertCircle, BarChart3, TrendingDown, PhoneCall, ShieldCheck, 
  Bot, Heart, Radio, Signal, Layers, PieChart as PieChartIcon,
  Smartphone, Database, Cpu, Search, History
} from 'lucide-react';
import { useToast } from '../ToastContext';
import Logo from './Logo';

// Mock Data para Telemetría de Volumen
const liveVolumeData = [
  { time: '08:00', calls: 120, agents: 40 },
  { time: '10:00', calls: 350, agents: 45 },
  { time: '12:00', calls: 420, agents: 48 },
  { time: '14:00', calls: 380, agents: 47 },
  { time: '16:00', calls: 510, agents: 50 },
  { time: '18:00', calls: 240, agents: 35 },
  { time: '20:00', calls: 110, agents: 20 },
];

// Mock Data para Disposiciones
const dispositionData = [
  { name: 'Ventas (Sale)', value: 185, color: '#10b981' },
  { name: 'Rellamadas (CBK)', value: 420, color: '#3b82f6' },
  { name: 'No Interesado', value: 890, color: '#f59e0b' },
  { name: 'Buzones / AMD', value: 1240, color: '#6366f1' },
  { name: 'DNC / Blocked', value: 45, color: '#f43f5e' },
];

// Mock Data para Mix de Agentes en Vivo
const agentMixData = [
  { name: 'En Llamada', value: 38, color: '#3b82f6' },
  { name: 'Listo (Ready)', value: 8, color: '#10b981' },
  { name: 'Pausa Técnico', value: 4, color: '#f59e0b' },
  { name: 'Wrap-up', value: 2, color: '#8b5cf6' },
];

const colorMap: Record<string, { bg: string, text: string, border: string }> = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
};

const StatCard = ({ title, value, icon: Icon, trend, color, subtitle }: any) => {
  const styles = colorMap[color] || colorMap.blue;
  return (
    <div className="glass-card p-10 rounded-[56px] flex flex-col justify-between shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
        <Icon size={120} />
      </div>
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className={`p-4 rounded-2xl ${styles.bg} ${styles.text} group-hover:scale-110 transition-transform border ${styles.border}`}>
          <Icon size={28} />
        </div>
        <div className={`flex items-center text-[10px] font-black tracking-widest ${trend.startsWith('+') || trend === 'OK' ? 'text-emerald-400' : 'text-rose-400'}`}>
          {trend.startsWith('+') ? <TrendingUp size={12} className="mr-1" /> : trend.startsWith('-') ? <TrendingDown size={12} className="mr-1" /> : <ShieldCheck size={12} className="mr-1" />}
          {trend}
        </div>
      </div>
      <div className="relative z-10">
        <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">{title}</h3>
        <div className="flex items-baseline space-x-3 mt-1">
          <p className="text-5xl font-black text-white tracking-tighter">{value}</p>
          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{subtitle}</span>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleRefresh = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast('Engine Core sincronizado con clúster v4.7.9.', 'success', 'Sincronización de Datos');
    }, 1500);
  };

  const handleLaunchAudit = async () => {
    setIsAuditing(true);
    toast('Iniciando auditoría forense de desvíos temporales...', 'info', 'Nexus Audit Engine');
    
    // Simulación de escaneo profundo de logs y CDRs
    await new Promise(r => setTimeout(r, 3500));
    
    setIsAuditing(false);
    toast('Auditoría completada. Se detectaron y recalibraron 14 desvíos de tiempo.', 'success', 'Audit Complete');
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="relative group">
            <Logo className="w-12 h-12 group-hover:rotate-12 transition-transform duration-700" />
            <div className="absolute -bottom-1 -right-1 bg-blue-600 w-4 h-4 rounded-full border-2 border-[#020617] animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase flex items-center">
              Nexus Intelligence Center
            </h2>
            <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest opacity-60">Control Maestro • Clúster 10.0.0.5 Operacional</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-slate-900 border border-slate-800 px-6 py-2.5 rounded-full flex items-center space-x-4">
             <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PostgreSQL 16 Link</span>
             </div>
             <div className="h-4 w-px bg-slate-800"></div>
             <div className="flex items-center space-x-2">
                <Signal size={14} className="text-blue-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sofia Core v1.10</span>
             </div>
          </div>
          <button 
            onClick={handleRefresh}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-blue-500/50 text-blue-400 rounded-3xl transition-all shadow-xl active:scale-95 group"
          >
            <RefreshCw size={24} className={isSyncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-1000'} />
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Productividad Global" value="94.2%" icon={Zap} trend="+2.4%" color="blue" subtitle="Target 90%" />
        <StatCard title="Predictive Drop Rate" value="1.8%" icon={AlertCircle} trend="OK" color="emerald" subtitle="Limit 3.0%" />
        <StatCard title="Ocupación de Planta" value="88.1%" icon={Users} trend="+1.5%" color="purple" subtitle="High Density" />
        <StatCard title="Talk Time Promedio" value="72.5%" icon={Target} trend="+5.1%" color="amber" subtitle="Efficiency Peak" />
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="p-8 glass rounded-[48px] border border-slate-800 flex items-center space-x-6 hover:border-blue-500/20 transition-all shadow-xl">
           <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-400"><Database size={24} /></div>
           <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Leads en Hopper</p>
              <p className="text-2xl font-black text-white font-mono">14,240</p>
           </div>
        </div>
        <div className="p-8 glass rounded-[48px] border border-slate-800 flex items-center space-x-6 hover:border-emerald-500/20 transition-all shadow-xl">
           <div className="p-3 bg-emerald-600/10 rounded-2xl text-emerald-400"><Bot size={24} /></div>
           <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">AI Audit Coverage</p>
              <p className="text-2xl font-black text-white font-mono">100%</p>
           </div>
        </div>
        <div className="p-8 glass rounded-[48px] border border-slate-800 flex items-center space-x-6 hover:border-rose-500/20 transition-all shadow-xl">
           <div className="p-3 bg-rose-600/10 rounded-2xl text-rose-400"><Cpu size={24} /></div>
           <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Cluster CPU Load</p>
              <p className="text-2xl font-black text-white font-mono">12%</p>
           </div>
        </div>
        <div className="p-8 glass rounded-[48px] border border-slate-800 flex items-center space-x-6 hover:border-indigo-500/20 transition-all shadow-xl">
           <div className="p-3 bg-indigo-600/10 rounded-2xl text-indigo-400"><Signal size={24} /></div>
           <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Call Pacing Ratio</p>
              <p className="text-2xl font-black text-white font-mono">4.5x</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Gráfico Principal: Live Volume Analytics */}
        <div className="col-span-12 lg:col-span-8 glass p-12 rounded-[64px] border border-slate-700/50 shadow-2xl relative overflow-hidden flex flex-col">
           <div className="flex items-center justify-between mb-12">
              <div className="flex items-center space-x-6">
                 <div className="p-4 bg-blue-600/10 rounded-2xl text-blue-400 border border-blue-500/20"><Activity size={28} /></div>
                 <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Live Throughput Telemetry</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-1">Llamadas concurrentes vs Agentes logueados (24h)</p>
                 </div>
              </div>
              <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
                 <button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">Global</button>
                 <button className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-300 text-[10px] font-black uppercase tracking-widest transition-all">Node A</button>
              </div>
           </div>

           <div className="flex-1 h-[450px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={liveVolumeData}>
                    <defs>
                       <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                       </linearGradient>
                       <linearGradient id="colorAgents" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px'}} />
                    <Area type="monotone" dataKey="calls" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorCalls)" />
                    <Area type="monotone" dataKey="agents" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorAgents)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Panel Derecho: Status Mix Dona Chart */}
        <div className="col-span-12 lg:col-span-4 glass p-10 rounded-[64px] border border-slate-700/50 shadow-2xl flex flex-col relative overflow-hidden">
           <div className="flex items-center space-x-5 mb-10">
              <div className="p-3 bg-indigo-600/10 rounded-2xl text-indigo-400 border border-indigo-500/20"><Users size={24} /></div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Agent Status Mix</h3>
           </div>
           
           <div className="flex-1 h-[300px] relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie data={agentMixData} innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value">
                       {agentMixData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '24px'}} />
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-4xl font-black text-white leading-none">52</span>
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Total Pool</span>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4 mt-8">
              {agentMixData.map((d, i) => (
                <div key={i} className="p-4 bg-slate-950/60 rounded-3xl border border-slate-800 space-y-1">
                   <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}}></div>
                      <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest truncate">{d.name}</span>
                   </div>
                   <p className="text-xl font-black text-white font-mono">{d.value}</p>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
         {/* Disposiciones BarChart */}
         <div className="col-span-12 lg:col-span-4 glass p-10 rounded-[64px] border border-slate-700/50 shadow-2xl flex flex-col">
            <div className="flex items-center space-x-5 mb-12">
               <div className="p-3 bg-emerald-600/10 rounded-2xl text-emerald-400 border border-emerald-500/20"><PieChartIcon size={24} /></div>
               <h3 className="text-xl font-black text-white uppercase tracking-tight">Call Results (Dispo)</h3>
            </div>
            <div className="flex-1 h-[350px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dispositionData} layout="vertical">
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" stroke="#475569" fontSize={9} width={100} axisLine={false} tickLine={false} tick={{fontWeight: 800, textTransform: 'uppercase'}} />
                     <Tooltip cursor={{fill: 'rgba(255,255,255,0.03)'}} contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px'}} />
                     <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={25}>
                        {dispositionData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Fuga de Tiempo (Existing module improved) */}
         <div className="col-span-12 lg:col-span-8 flex flex-col space-y-8">
            <div className="glass p-12 rounded-[64px] border border-rose-500/20 bg-rose-500/5 shadow-2xl flex-1 flex flex-col">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center space-x-6">
                    <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 animate-pulse border border-rose-500/20">
                       <AlertCircle size={28} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-white uppercase tracking-tight">Anomaly Detection (Time Leaks)</h3>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Desvíos críticos detectados por el motor v4.7.9</p>
                    </div>
                  </div>
                  <div className="px-5 py-2 bg-rose-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl shadow-rose-600/30">Action Required</div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { agent: 'Maria Gonzalez', reason: 'Exceso de Wrap-up Q4', leak: '14m 22s', status: 'CRITICAL' },
                    { agent: 'Juan Perez', reason: 'Pausa técnica no validada', leak: '08m 10s', status: 'WARN' },
                    { agent: 'Sergio Téllez (GTR)', reason: 'Monitor Session Silence', leak: '04m 55s', status: 'INFO' },
                    { agent: 'Carla Mendez', reason: 'Ready sin marcación (Wait)', leak: '12m 00s', status: 'CRITICAL' },
                  ].map((leak, i) => (
                    <div key={i} className="p-6 bg-slate-950/80 border border-slate-900 rounded-[32px] flex items-center justify-between group hover:border-rose-500/40 transition-all shadow-inner">
                       <div className="flex items-center space-x-5">
                          <div className={`w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] font-black ${leak.status === 'CRITICAL' ? 'text-rose-500 border-rose-500/20' : 'text-slate-500'} group-hover:scale-110 transition-transform`}>
                             {leak.agent.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <div>
                             <p className="text-sm font-black text-white uppercase tracking-tight">{leak.agent}</p>
                             <p className="text-[9px] text-slate-600 font-bold uppercase mt-1 italic">{leak.reason}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className={`text-lg font-black font-mono ${leak.status === 'CRITICAL' ? 'text-rose-500 animate-pulse' : 'text-amber-500'}`}>+{leak.leak}</p>
                          <div className={`text-[7px] font-black uppercase tracking-widest mt-1 ${leak.status === 'CRITICAL' ? 'text-rose-600' : 'text-slate-600'}`}>{leak.status}</div>
                       </div>
                    </div>
                  ))}
               </div>
               <button 
                onClick={handleLaunchAudit}
                disabled={isAuditing}
                className="mt-10 w-full py-5 bg-slate-900 border border-slate-800 text-slate-500 hover:text-white hover:bg-slate-800 rounded-[28px] text-[10px] font-black uppercase tracking-widest transition-all hover:border-blue-500/50 shadow-2xl flex items-center justify-center space-x-3 group active:scale-95 disabled:opacity-50"
               >
                  {isAuditing ? <RefreshCw className="animate-spin mr-2" size={16} /> : <History size={16} className="group-hover:rotate-12 transition-transform" />}
                  <span>{isAuditing ? 'Procesando Auditoría Capas de Tiempo...' : 'Lanzar Auditoría Temporal Completa'}</span>
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;

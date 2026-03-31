
import React, { useState, useEffect, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';
import { 
  Users, Clock, Activity, Zap, TrendingUp, RefreshCw, Target, Timer, 
  AlertCircle, BarChart3, TrendingDown, PhoneCall, ShieldCheck, 
  Bot, Heart, Radio, Signal, Layers, PieChart as PieChartIcon,
  Smartphone, Database, Cpu, Search, History, MessageSquare,
  Share2, Facebook, Instagram, Smartphone as TikTokIcon
} from 'lucide-react';
import { useToast } from '../ToastContext';
import { useAuth } from '../AuthContext';
import { UserRole } from '../types';
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
    <div className="bg-bg-card p-4 md:p-8 rounded-3xl flex flex-col justify-between border border-border-main relative overflow-hidden group hover:border-accent-primary/20 transition-all duration-500 shadow-2xl">
      <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700 pointer-events-none">
        <Icon size={100} />
      </div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className={`p-3 rounded-xl ${styles.bg} ${styles.text} group-hover:scale-110 transition-transform border ${styles.border}`}>
          <Icon size={20} />
        </div>
        <div className={`flex items-center text-[9px] font-mono font-bold tracking-widest ${trend.startsWith('+') || trend === 'OK' ? 'text-emerald-500' : 'text-rose-500'}`}>
          {trend.startsWith('+') ? <TrendingUp size={10} className="mr-1" /> : trend.startsWith('-') ? <TrendingDown size={10} className="mr-1" /> : <ShieldCheck size={10} className="mr-1" />}
          {trend}
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-1 h-1 rounded-full bg-text-secondary/20" />
          <h3 className="text-text-secondary text-[9px] font-black uppercase tracking-[0.25em]">{title}</h3>
        </div>
        <div className="flex items-baseline space-x-2">
          <p className="text-4xl font-mono font-bold text-text-primary tracking-tighter">{value}</p>
          <span className="text-[8px] text-text-secondary/60 font-bold uppercase tracking-widest">{subtitle}</span>
        </div>
      </div>

      {/* Decorative corner element */}
      <div className="absolute bottom-0 right-0 w-8 h-8 opacity-10">
        <div className="absolute bottom-2 right-2 w-4 h-[1px] bg-text-primary" />
        <div className="absolute bottom-2 right-2 w-[1px] h-4 bg-text-primary" />
      </div>
    </div>
  );
};

const LiveActivityFeed = () => {
  const [activities, setActivities] = useState([
    { id: 1, type: 'call', user: 'Agent 402', action: 'Inbound Call Connected', time: '12:40:01', status: 'active' },
    { id: 2, type: 'system', user: 'Sofia AI', action: 'Sentiment Analysis: Positive', time: '12:39:55', status: 'info' },
    { id: 3, type: 'alert', user: 'Cluster 05', action: 'Auto-scaling: New Node Provisioned', time: '12:39:42', status: 'warning' },
    { id: 4, type: 'message', user: 'Omni-Bot', action: 'WhatsApp Lead Captured', time: '12:39:30', status: 'success' },
    { id: 5, type: 'call', user: 'Agent 118', action: 'Outbound Sale Confirmed', time: '12:39:15', status: 'success' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now(),
        type: ['call', 'system', 'alert', 'message'][Math.floor(Math.random() * 4)],
        user: `Node-${Math.floor(Math.random() * 999)}`,
        action: ['Packet Routing Optimized', 'DB Query Latency: 4ms', 'Session Handover Complete', 'SIP Trunk Heartbeat'][Math.floor(Math.random() * 4)],
        time: new Date().toLocaleTimeString('en-GB'),
        status: ['active', 'info', 'success', 'warning'][Math.floor(Math.random() * 4)]
      };
      setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-bg-card border border-border-main rounded-3xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
          <h3 className="text-[10px] font-black text-text-primary uppercase tracking-widest">Live System Telemetry</h3>
        </div>
        <div className="text-[9px] font-mono text-text-secondary/50">REALTIME_STREAM_01</div>
      </div>
      <div className="space-y-3 flex-1 overflow-hidden">
        {activities.map((act) => (
          <div key={act.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-border-main hover:bg-white/[0.08] transition-colors group">
            <div className="flex items-center space-x-3">
              <div className={`w-1 h-8 rounded-full ${
                act.status === 'active' ? 'bg-accent-primary' : 
                act.status === 'success' ? 'bg-emerald-500' : 
                act.status === 'warning' ? 'bg-amber-500' : 'bg-text-secondary/30'
              }`} />
              <div>
                <p className="text-[10px] font-bold text-text-primary uppercase tracking-tight">{act.user}</p>
                <p className="text-[9px] text-text-secondary font-medium truncate max-w-[150px]">{act.action}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-mono text-text-secondary/70">{act.time}</p>
              <p className="text-[7px] font-black text-accent-primary/50 uppercase tracking-widest group-hover:text-accent-primary transition-colors">TRACE_OK</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border-main flex items-center justify-between">
        <span className="text-[8px] font-bold text-text-secondary uppercase tracking-widest">Buffer Status: 98%</span>
        <div className="flex space-x-1">
          {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-3 bg-accent-primary/20 rounded-full" />)}
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [dbStatus, setDbStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const [stats, setStats] = useState({ users: 0, campaigns: 0, messages: 0 });
  const [campaignStats, setCampaignStats] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [dbRes, usersRes, campaignsRes, messagesRes] = await Promise.all([
          fetch('/api/db/status'),
          fetch('/api/users'),
          fetch('/api/campaigns'),
          fetch('/api/omnichannel/messages')
        ]);

        if (dbRes.ok) {
          const dbData = await dbRes.json();
          setDbStatus(dbData.status === 'connected' ? 'connected' : 'disconnected');
        }

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setStats(prev => ({ ...prev, users: usersData.length }));
        }

        if (campaignsRes.ok) {
          const campaignsData = await campaignsRes.json();
          setStats(prev => ({ ...prev, campaigns: campaignsData.length }));
        }

        if (messagesRes.ok) {
          const messagesData = await messagesRes.json();
          setStats(prev => ({ ...prev, messages: messagesData.length }));
          
          // Process campaign stats
          const campaignMap: Record<string, number> = {};
          messagesData.forEach((m: any) => {
            if (m.campaign_id) {
              campaignMap[m.campaign_id] = (campaignMap[m.campaign_id] || 0) + 1;
            }
          });
          
          const processed = Object.entries(campaignMap).map(([name, value]) => ({
            name: name.replace('camp_', '').replace(/_/g, ' '),
            value,
            color: name.includes('florida') ? '#3b82f6' : name.includes('brickell') ? '#f43f5e' : '#10b981'
          }));
          setCampaignStats(processed);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const isSocialMediaManager = user?.role === UserRole.SOCIAL_MEDIA_MANAGER;

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
    <div className="space-y-8 pb-20 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="relative group">
            <div className="w-14 h-14 rounded-2xl bg-accent-primary flex items-center justify-center text-white shadow-[0_0_30px_rgba(37,99,235,0.3)] group-hover:rotate-6 transition-transform duration-500">
              <Zap size={28} fill="currentColor" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-4 border-bg-sidebar animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-text-primary tracking-tighter uppercase flex items-center">
              Nexus Intelligence Center
            </h2>
            <div className="flex items-center space-x-3 mt-1">
              <span className="text-text-secondary text-[9px] font-bold uppercase tracking-[0.2em]">Master Control</span>
              <div className="w-1 h-1 rounded-full bg-text-secondary/20" />
              <span className="text-accent-primary text-[9px] font-mono font-bold uppercase tracking-widest">Cluster Node: 10.0.0.5</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white/5 border border-border-main px-6 py-3 rounded-2xl flex items-center space-x-6">
             <div className="flex items-center space-x-3">
                <div className={`w-1.5 h-1.5 rounded-full ${dbStatus === 'connected' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`}></div>
                <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest">
                  {dbStatus === 'connected' ? 'PostgreSQL 16 Link' : 'Simulation Mode'}
                </span>
             </div>
             <div className="h-4 w-[1px] bg-border-main"></div>
             <div className="flex items-center space-x-3">
                <Signal size={14} className="text-accent-primary" />
                <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Sofia Core v1.10</span>
             </div>
          </div>
          <button 
            onClick={handleRefresh}
            className="p-4 bg-white/5 border border-border-main hover:bg-white/10 hover:border-accent-primary/30 text-accent-primary rounded-2xl transition-all active:scale-95 group"
          >
            <RefreshCw size={20} className={isSyncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-1000'} />
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isSocialMediaManager ? (
          <>
            <StatCard title="Total Messages" value={stats.messages} icon={MessageSquare} trend="+12.4%" color="blue" subtitle="Omnichannel Hub" />
            <StatCard title="Active Campaigns" value={stats.campaigns} icon={Target} trend="OK" color="emerald" subtitle="Database Sync" />
            <StatCard title="Engagement Rate" value="24.8%" icon={Zap} trend="+2.1%" color="purple" subtitle="Social Media" />
            <StatCard title="Response SLA" value="1.4m" icon={Timer} trend="-15s" color="amber" subtitle="Efficiency" />
          </>
        ) : (
          <>
            <StatCard title="Active Users" value={stats.users} icon={Users} trend="OK" color="blue" subtitle="Database Sync" />
            <StatCard title="Active Campaigns" value={stats.campaigns} icon={Target} trend="OK" color="emerald" subtitle="Database Sync" />
            <StatCard title="Floor Occupancy" value="88.1%" icon={Activity} trend="+1.5%" color="purple" subtitle="High Density" />
            <StatCard title="Avg Talk Time" value="72.5%" icon={TrendingUp} trend="+5.1%" color="amber" subtitle="Efficiency Peak" />
          </>
        )}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Chart: Live Volume Analytics */}
        <div className="col-span-12 lg:col-span-8 bg-bg-card p-10 rounded-3xl border border-border-main shadow-2xl relative overflow-hidden flex flex-col">
           <div className="flex items-center justify-between mb-10">
              <div className="flex items-center space-x-5">
                 <div className="p-3 bg-accent-primary/10 rounded-xl text-accent-primary border border-accent-primary/20"><Activity size={24} /></div>
                 <div>
                    <h3 className="text-xl font-black text-text-primary uppercase tracking-tight">
                      {isSocialMediaManager ? 'Omnichannel Traffic Flow' : 'Live Throughput Telemetry'}
                    </h3>
                    <p className="text-[9px] text-text-secondary font-bold uppercase tracking-[0.3em] mt-1">
                      {isSocialMediaManager ? 'Inbound vs Outbound (24h)' : 'Concurrent Calls vs Active Agents (24h)'}
                    </p>
                 </div>
              </div>
              <div className="flex bg-white/5 p-1 rounded-xl border border-border-main">
                 <button className="px-4 py-1.5 rounded-lg bg-accent-primary text-white text-[9px] font-black uppercase tracking-widest shadow-lg">Global</button>
                 <button className="px-4 py-1.5 rounded-lg text-text-secondary hover:text-text-primary text-[9px] font-black uppercase tracking-widest transition-all">Node A</button>
              </div>
           </div>

           <div className="flex-1 h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={liveVolumeData}>
                    <defs>
                       <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                       </linearGradient>
                       <linearGradient id="colorAgents" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-main)" vertical={false} />
                    <XAxis dataKey="time" stroke="var(--text-secondary)" fontSize={9} axisLine={false} tickLine={false} />
                    <YAxis stroke="var(--text-secondary)" fontSize={9} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-main)', borderRadius: '12px'}}
                      itemStyle={{fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)'}}
                    />
                    <Area type="monotone" dataKey="calls" name={isSocialMediaManager ? 'Inbound' : 'Calls'} stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorCalls)" />
                    <Area type="monotone" dataKey="agents" name={isSocialMediaManager ? 'Outbound' : 'Agents'} stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAgents)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Live Feed Panel */}
        <div className="col-span-12 lg:col-span-4">
          <LiveActivityFeed />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Status Mix Dona Chart */}
        <div className="col-span-12 lg:col-span-4 bg-bg-card p-10 rounded-3xl border border-border-main shadow-2xl flex flex-col relative overflow-hidden">
           <div className="flex items-center space-x-4 mb-10">
              <div className="p-3 bg-accent-primary/10 rounded-xl text-accent-primary border border-accent-primary/20">
                {isSocialMediaManager ? <Target size={20} /> : <Users size={20} />}
              </div>
              <h3 className="text-lg font-black text-text-primary uppercase tracking-tight">
                {isSocialMediaManager ? 'Campaign Distribution' : 'Agent Status Mix'}
              </h3>
           </div>
           
           <div className="flex-1 h-[280px] relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie data={isSocialMediaManager ? campaignStats : agentMixData} innerRadius={70} outerRadius={95} paddingAngle={10} dataKey="value">
                       {(isSocialMediaManager ? campaignStats : agentMixData).map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-main)', borderRadius: '12px'}} />
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-3xl font-mono font-bold text-text-primary leading-none">
                   {isSocialMediaManager ? campaignStats.reduce((acc, curr) => acc + curr.value, 0) : '52'}
                 </span>
                 <span className="text-[8px] font-black text-text-secondary uppercase tracking-widest mt-1">
                   {isSocialMediaManager ? 'Total Messages' : 'Total Pool'}
                 </span>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-3 mt-6">
              {(isSocialMediaManager ? campaignStats : agentMixData).map((d, i) => (
                <div key={i} className="p-3 bg-white/5 rounded-2xl border border-border-main space-y-1">
                   <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: d.color}}></div>
                      <span className="text-[8px] font-black text-text-secondary uppercase tracking-widest truncate">{d.name}</span>
                   </div>
                   <p className="text-lg font-mono font-bold text-text-primary">{d.value}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Disposiciones BarChart */}
        <div className="col-span-12 lg:col-span-4 bg-bg-card p-10 rounded-3xl border border-border-main shadow-2xl flex flex-col">
          <div className="flex items-center space-x-4 mb-10">
              <div className="p-3 bg-emerald-600/10 rounded-xl text-emerald-400 border border-emerald-500/20"><PieChartIcon size={20} /></div>
              <h3 className="text-lg font-black text-text-primary uppercase tracking-tight">Call Results (Dispo)</h3>
          </div>
          <div className="flex-1 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dispositionData} layout="vertical" margin={{ left: -20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" fontSize={8} width={100} axisLine={false} tickLine={false} tick={{fontWeight: 800, style: { textTransform: 'uppercase' }}} />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} contentStyle={{backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-main)', borderRadius: '12px'}} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
                      {dispositionData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Bar>
                </BarChart>
              </ResponsiveContainer>
          </div>
        </div>

        {/* Anomaly Detection */}
        <div className="col-span-12 lg:col-span-4 bg-bg-card p-10 rounded-3xl border border-rose-500/10 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500 border border-rose-500/20">
                <AlertCircle size={20} />
              </div>
              <h3 className="text-lg font-black text-text-primary uppercase tracking-tight">Time Leaks</h3>
            </div>
            <div className="px-3 py-1 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-full text-[7px] font-black uppercase tracking-widest">Critical</div>
          </div>
          <div className="space-y-3 flex-1">
            {[
              { agent: 'Maria G.', reason: 'Wrap-up Q4', leak: '14m', status: 'CRITICAL' },
              { agent: 'Juan P.', reason: 'Technical Pause', leak: '08m', status: 'WARN' },
              { agent: 'Sergio T.', reason: 'Silence Detect', leak: '04m', status: 'INFO' },
              { agent: 'Carla M.', reason: 'Ready Wait', leak: '12m', status: 'CRITICAL' },
            ].map((leak, i) => (
              <div key={i} className="p-3 bg-white/5 border border-border-main rounded-2xl flex items-center justify-between group hover:border-rose-500/20 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-bg-sidebar border border-border-main flex items-center justify-center text-[8px] font-black text-text-secondary">
                    {leak.agent.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-text-primary uppercase tracking-tight">{leak.agent}</p>
                    <p className="text-[8px] text-text-secondary font-bold uppercase tracking-widest">{leak.reason}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-mono font-bold ${leak.status === 'CRITICAL' ? 'text-rose-500' : 'text-amber-500'}`}>+{leak.leak}</p>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={handleLaunchAudit}
            disabled={isAuditing}
            className="mt-6 w-full py-4 bg-white/5 border border-border-main text-text-secondary hover:text-text-primary hover:bg-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center space-x-2 group disabled:opacity-50"
          >
            {isAuditing ? <RefreshCw className="animate-spin" size={12} /> : <History size={12} />}
            <span>{isAuditing ? 'Auditing...' : 'Full Temporal Audit'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

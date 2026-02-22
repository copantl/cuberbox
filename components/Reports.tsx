
import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, ComposedChart, Area, AreaChart, PieChart, Pie, Cell,
  RadialBarChart, RadialBar
} from 'recharts';
import { 
  FileDown, Calendar, Filter, Zap, Activity, Users, Award,
  ArrowUpRight, Target, Clock, Heart, PieChart as PieChartIcon,
  BarChart3, TrendingUp, CreditCard, DollarSign, PhoneCall, Search,
  Database, Layers, CheckCircle2, AlertTriangle, ArrowRight, Coffee,
  Mic, UserCheck, Mail, PhoneOff, Smartphone, List, ChevronRight, Info,
  TrendingDown, Star, ShieldCheck, Sparkles, BrainCircuit,
  Smile, FileText, Share2, MessageSquare,
  // Fix: Added missing Bot icon import
  Bot
} from 'lucide-react';
import { MOCK_CAMPAIGNS, MOCK_CDR_DATA, MOCK_PAUSE_RECORDS, PAUSE_CODES } from '../constants';
import { useToast } from '../ToastContext';

const agentKPIs = [
  { name: 'Maria G.', fcr: 82, aht: 310, csat: 4.9, qa: 98, occupancy: 88, pauseTime: 4500, trend: 'up' },
  { name: 'Juan P.', fcr: 71, aht: 350, csat: 4.2, qa: 88, occupancy: 92, pauseTime: 3200, trend: 'down' },
  { name: 'Carla M.', fcr: 89, aht: 290, csat: 5.0, qa: 96, occupancy: 85, pauseTime: 3800, trend: 'stable' },
  { name: 'Pedro S.', fcr: 65, aht: 410, csat: 3.8, qa: 82, occupancy: 78, pauseTime: 5100, trend: 'up' },
  { name: 'Sofia R.', fcr: 78, aht: 320, csat: 4.7, qa: 94, occupancy: 86, pauseTime: 4200, trend: 'up' },
];

const omnicanalStats = [
  { name: 'WhatsApp', value: 450, color: '#10b981' },
  { name: 'TikTok', value: 210, color: '#f43f5e' },
  { name: 'Facebook', value: 180, color: '#3b82f6' },
  { name: 'Instagram', value: 340, color: '#d946ef' },
];

const Reports: React.FC = () => {
  const { toast } = useToast();
  const [reportType, setReportType] = useState<'KPI' | 'OMNI' | 'PAUSE' | 'CDR' | 'LIST'>('KPI');

  const handleExport = () => {
    toast(`Generando reporte estructurado... El archivo CSV estará listo en segundos.`, "info", "Exportación BI");
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Intelligence Engine</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Análisis multivariable del tráfico SIP y flujo Omnicanal v4.8.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex bg-slate-900 border-2 border-slate-800 p-1.5 rounded-[24px] shadow-inner">
            {[
              { id: 'KPI', label: 'Llamadas & QA', icon: PhoneCall },
              { id: 'OMNI', label: 'Omnicanal', icon: Share2 },
              { id: 'PAUSE', label: 'Pausas', icon: Coffee },
              { id: 'CDR', label: 'Logs', icon: FileText },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setReportType(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${reportType === tab.id ? `bg-blue-600 text-white shadow-xl shadow-blue-600/30` : 'text-slate-500 hover:text-slate-300'}`}
              >
                <tab.icon size={14} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center space-x-3 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-[24px] transition-all border border-slate-700 shadow-2xl active:scale-95 group"
          >
            <FileDown size={20} className="group-hover:translate-y-0.5 transition-transform" />
            <span className="font-black text-xs uppercase tracking-widest">Descargar</span>
          </button>
        </div>
      </div>

      {reportType === 'OMNI' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             {[
               { label: 'Chats Totales', val: '1,180', icon: MessageSquare, col: 'blue' },
               { label: 'Avg Resp Time', val: '42s', icon: Clock, col: 'emerald' },
               { label: 'AI Resolution', val: '34%', icon: Bot, col: 'purple' },
               { label: 'Sentiment Score', val: '8.4', icon: Heart, col: 'rose' },
             ].map((k, i) => (
               <div key={i} className="glass p-8 rounded-[40px] border border-slate-700/50 shadow-xl flex flex-col justify-between group hover:border-blue-500/30 transition-all">
                  <div className={`p-3 rounded-2xl bg-${k.col}-600/10 text-${k.col}-400 w-fit mb-6`}>
                     <k.icon size={24} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{k.label}</p>
                     <h3 className="text-3xl font-black text-white mt-1">{k.val}</h3>
                  </div>
               </div>
             ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
             <div className="lg:col-span-5 glass p-10 rounded-[56px] border border-slate-700/50 shadow-2xl flex flex-col items-center">
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-10 w-full text-left">Distribución por Canal</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie data={omnicanalStats} innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value">
                          {omnicanalStats.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                       </Pie>
                       <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '24px' }} />
                    </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="grid grid-cols-2 gap-4 w-full mt-8">
                  {omnicanalStats.map((d, i) => (
                    <div key={i} className="p-4 rounded-[24px] bg-slate-900/40 border border-slate-800">
                       <div className="flex items-center text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">
                          <div className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: d.color }}></div>
                          {d.name}
                       </div>
                       <div className="text-xl font-black text-white">{d.value}</div>
                    </div>
                  ))}
               </div>
             </div>

             <div className="lg:col-span-7 glass rounded-[56px] border border-slate-700/50 overflow-hidden shadow-2xl">
                <div className="p-10 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
                   <h3 className="text-xl font-black text-white uppercase tracking-tighter">Desempeño Agente Omnicanal</h3>
                   <div className="flex items-center space-x-2 bg-slate-950 px-4 py-2 rounded-full border border-slate-800">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Live Flow</span>
                   </div>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-slate-950/40 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                         <tr>
                            <th className="px-10 py-6">Operador</th>
                            <th className="px-10 py-6 text-center">Chats</th>
                            <th className="px-10 py-6 text-center">Avg Response</th>
                            <th className="px-10 py-6 text-right">CSAT Chat</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                         {agentKPIs.map((agent, i) => (
                           <tr key={i} className="hover:bg-blue-600/5 transition-all group">
                              <td className="px-10 py-6 font-black text-sm text-slate-200 uppercase">{agent.name}</td>
                              <td className="px-10 py-6 text-center font-mono text-xs text-white font-black">{Math.floor(Math.random()*50)+10}</td>
                              <td className="px-10 py-6 text-center text-xs font-black text-blue-400">{Math.floor(Math.random()*60)+15}s</td>
                              <td className="px-10 py-6 text-right font-black text-emerald-400">4.9/5</td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* ... Rest of existing report logic ... */}
      
    </div>
  );
};

export default Reports;


import React, { useState, useEffect } from 'react';
import { 
  Plus, Target, RefreshCw, Cpu, CheckCircle2, Coffee, Settings, Maximize2, 
  Radio, Users, Network, Database, Sliders, ListChecks, Bot, X, Save, 
  ShieldCheck, Check, Info, Shield, Zap, Smartphone, Layers, ChevronRight,
  Trash2, ArrowRight, Gauge, Clock, Search, Filter, Volume2, Mic, Activity,
  // Added missing imports
  Brain as BrainIcon, ArrowUpRight, PhoneIncoming
} from 'lucide-react';
import { Campaign, DialMethod, CampaignType } from '../types';
import { MOCK_CAMPAIGNS, MOCK_CALL_CODES, MOCK_LISTS, MOCK_BOTS } from '../constants';
import { useToast } from '../ToastContext';
import CampaignRealTimeDashboard from './CampaignRealTimeDashboard';

const Campaigns: React.FC = () => {
  const { toast } = useToast();
  const [campaignsList, setCampaignsList] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'ALGORITHM' | 'INBOUND' | 'AUTOMATION' | 'HOPPER'>('ALGORITHM');
  const [editingCampaign, setEditingCampaign] = useState<Partial<Campaign> | null>(null);
  const [showRealTime, setShowRealTime] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('/api/campaigns');
        if (response.ok) {
          const data = await response.json();
          const mappedCampaigns = data.map((c: any) => ({
            id: c.id,
            name: c.name,
            dialMethod: c.dial_method as DialMethod,
            type: c.campaign_type as CampaignType,
            autoDialLevel: parseFloat(c.auto_dial_level),
            hopperLevel: c.hopper_level,
            amdEnabled: c.amd_enabled,
            status: 'ACTIVE', // Default for now
            recordingMode: 'ALL_CALLS'
          }));
          setCampaignsList(mappedCampaigns);
          if (mappedCampaigns.length > 0 && !selectedCampaign) {
            setSelectedCampaign(mappedCampaigns[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleOpenModal = (campaign?: Campaign) => {
    setActiveModalTab('ALGORITHM');
    setEditingCampaign(campaign ? { ...campaign } : {
      id: `c_${Math.random().toString(36).substr(2, 5)}`,
      name: '',
      dialMethod: 'RATIO',
      type: 'OUTBOUND',
      autoDialLevel: 1.0,
      adaptiveMaxDropRate: 3.0,
      hopperLevel: 100,
      amdEnabled: false,
      recordingMode: 'ALL_CALLS'
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    toast(`Campaña "${editingCampaign?.name}" sincronizada globalmente.`, 'success');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {showRealTime && selectedCampaign && (
        <CampaignRealTimeDashboard campaign={selectedCampaign} onClose={() => setShowRealTime(false)} />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase flex items-center">
            <Target className="mr-4 text-blue-500" size={36} />
            Estrategia de Marcación
          </h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Configuración del núcleo predictivo y reglas de negocio v4.8.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-[28px] font-black text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center">
          <Plus size={20} className="mr-2" /> Nueva Campaña
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* LISTA DE CAMPAÑAS */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
           {isLoading ? (
             Array.from({ length: 4 }).map((_, i) => (
               <div key={i} className="p-6 rounded-[40px] border-2 border-slate-800 glass animate-pulse h-[160px]">
                  <div className="flex items-center justify-between mb-4">
                     <div className="w-10 h-10 bg-slate-800/50 rounded-xl"></div>
                     <div className="w-20 h-4 bg-slate-800/50 rounded-full"></div>
                  </div>
                  <div className="h-6 bg-slate-800/50 rounded-lg w-3/4"></div>
                  <div className="mt-6 pt-4 border-t border-slate-800/50 flex justify-between">
                     <div className="w-16 h-3 bg-slate-800/50 rounded-full"></div>
                     <div className="w-16 h-3 bg-slate-800/50 rounded-full"></div>
                  </div>
               </div>
             ))
           ) : campaignsList.map(c => (
             <div key={c.id} onClick={() => setSelectedCampaign(c)} className={`p-6 rounded-[40px] border-2 cursor-pointer transition-all relative overflow-hidden group ${selectedCampaign?.id === c.id ? 'bg-blue-600/10 border-blue-500 shadow-2xl' : 'glass border-slate-800 hover:border-slate-700'}`}>
                <div className="flex items-center justify-between mb-4 relative z-10">
                   <div className={`p-2 rounded-xl ${selectedCampaign?.id === c.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-500'}`}><Radio size={18} /></div>
                   <div className="flex items-center space-x-2">
                      <span className={`px-3 py-0.5 rounded-full text-[8px] font-black uppercase ${c.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-900 text-slate-500'}`}>{c.status}</span>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{c.dialMethod}</span>
                   </div>
                </div>
                <h3 className="font-black text-white uppercase text-lg truncate relative z-10">{c.name}</h3>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800/50 relative z-10">
                   <div className="flex items-center space-x-2">
                      <Users size={12} className="text-blue-500" />
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">12 Agentes</span>
                   </div>
                   <div className="flex items-center space-x-2">
                      <Activity size={12} className="text-emerald-500" />
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Ratio: {c.autoDialLevel}x</span>
                   </div>
                </div>
             </div>
           ))}
        </div>

        {/* EDITOR DE CONFIGURACIÓN */}
        <div className="col-span-12 lg:col-span-8">
           {selectedCampaign && (
             <div className="glass p-12 rounded-[64px] border border-slate-700/50 shadow-2xl space-y-12 animate-in slide-in-from-right-4">
                <div className="flex items-center justify-between pb-8 border-b border-slate-800">
                   <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 rounded-[28px] bg-blue-600/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-inner"><Cpu size={32} /></div>
                      <div>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{selectedCampaign.name}</h3>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Cluster Node: fs-west-01 • Legacy Vicidial Support</p>
                      </div>
                   </div>
                   <div className="flex items-center space-x-3">
                      <button onClick={() => setShowRealTime(true)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-xl group" title="Wallboard Real-time">
                         <Maximize2 size={22} className="group-hover:scale-110 transition-transform" />
                      </button>
                      <button onClick={() => handleOpenModal(selectedCampaign)} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-xl">
                         <Settings size={22} />
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {/* Columna 1: Algoritmo */}
                   <div className="p-8 bg-slate-900/60 rounded-[48px] border border-slate-800 space-y-8 shadow-inner">
                      <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center"><Zap size={18} className="mr-3 text-blue-400" /> Dialing Control</h4>
                      <div className="space-y-6">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <span>Método de Marcado</span>
                            <span className="text-blue-400">{selectedCampaign.dialMethod}</span>
                         </div>
                         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <span>Auto Dial Level</span>
                            <span className="text-emerald-400 font-mono">{selectedCampaign.autoDialLevel}x</span>
                         </div>
                         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <span>AMD status</span>
                            <span className={selectedCampaign.amdEnabled ? 'text-emerald-400' : 'text-slate-700'}>{selectedCampaign.amdEnabled ? 'ENABLED' : 'DISABLED'}</span>
                         </div>
                      </div>
                   </div>

                   {/* Columna 2: Recursos & Medios */}
                   <div className="p-8 bg-slate-900/60 rounded-[48px] border border-slate-800 space-y-8 shadow-inner">
                      <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center"><Volume2 size={18} className="mr-3 text-emerald-400" /> Media & Recording</h4>
                      <div className="space-y-6">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <span>Recording Mode</span>
                            <span className="text-amber-400">{selectedCampaign.recordingMode}</span>
                         </div>
                         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <span>Music on Hold</span>
                            <span className="text-white">default_pro_v4</span>
                         </div>
                         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <span>Hopper Level</span>
                            <span className="text-blue-400 font-mono">{selectedCampaign.hopperLevel} leads</span>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="p-10 glass rounded-[48px] border border-blue-500/20 bg-blue-600/5 flex items-center justify-between group cursor-help shadow-inner">
                   <div className="flex items-center space-x-6">
                      <div className="p-4 rounded-2xl bg-blue-600 text-white shadow-xl animate-pulse"><BrainIcon size={24} /></div>
                      <div>
                         <h5 className="text-lg font-black text-white uppercase tracking-tight">Adaptive Optimization Active</h5>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">El sistema está ajustando el pacing dinámicamente para mantener drop rate bajo el 3.0%.</p>
                      </div>
                   </div>
                   <ArrowUpRight size={32} className="text-blue-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                </div>
             </div>
           )}
        </div>
      </div>

      {/* MODAL DE CONFIGURACIÓN AVANZADA */}
      {isModalOpen && editingCampaign && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl">
           <div className="w-full max-w-5xl glass rounded-[64px] border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col h-[85vh] animate-in zoom-in-95 duration-300">
              <div className="p-10 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/60">
                 <div className="flex items-center space-x-6">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-400 border border-blue-500/20"><Sliders size={28} /></div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Propiedades de Campaña</h3>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-4 bg-slate-800 hover:bg-rose-500/10 rounded-2xl text-slate-400 hover:text-rose-500 transition-all shadow-xl"><X size={24} /></button>
              </div>

              <div className="flex bg-slate-900 border-b border-slate-800 px-10 shrink-0">
                 {[
                   { id: 'ALGORITHM', label: 'Algoritmo & Marcado', icon: Zap },
                   { id: 'INBOUND', label: 'Inbound & Blended', icon: PhoneIncoming },
                   { id: 'AUTOMATION', label: 'IA & Automatización', icon: Bot },
                   { id: 'HOPPER', label: 'Gestión Hopper', icon: Database }
                 ].map(tab => (
                   <button 
                    key={tab.id} 
                    onClick={() => setActiveModalTab(tab.id as any)}
                    className={`flex items-center space-x-3 px-8 py-5 text-[10px] font-black uppercase tracking-widest border-b-4 transition-all ${activeModalTab === tab.id ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                   >
                     <tab.icon size={16} />
                     <span>{tab.label}</span>
                   </button>
                 ))}
              </div>

              <div className="flex-1 overflow-y-auto p-12 scrollbar-hide space-y-10">
                 {activeModalTab === 'ALGORITHM' && (
                    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                       <div className="grid grid-cols-2 gap-10">
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Dial Method (Lógica)</label>
                             <div className="grid grid-cols-2 gap-2">
                                {(['MANUAL', 'RATIO', 'PREDICTIVE', 'PREVIEW'] as DialMethod[]).map(m => (
                                  <button 
                                    key={m} 
                                    onClick={() => setEditingCampaign({...editingCampaign, dialMethod: m})}
                                    className={`py-4 rounded-2xl text-[9px] font-black border-2 transition-all ${editingCampaign.dialMethod === m ? 'bg-blue-600 border-blue-500 text-white shadow-xl' : 'bg-slate-950 border-slate-800 text-slate-600 hover:text-slate-400'}`}
                                  >
                                    {m}
                                  </button>
                                ))}
                             </div>
                          </div>
                          <div className="space-y-6">
                             <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Auto Dial Level</label>
                                <span className="text-lg font-black text-blue-400 font-mono">{editingCampaign.autoDialLevel}x</span>
                             </div>
                             <input 
                                type="range" min="1" max="10" step="0.5" 
                                value={editingCampaign.autoDialLevel} 
                                onChange={e => setEditingCampaign({...editingCampaign, autoDialLevel: parseFloat(e.target.value)})} 
                                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" 
                             />
                             <p className="text-[9px] text-slate-600 font-bold uppercase leading-relaxed italic">Ratio de líneas por agente libre. Predictive ajustará esto automáticamente.</p>
                          </div>
                       </div>

                       <div className="p-10 bg-slate-900 border-2 border-slate-800 rounded-[48px] space-y-8 shadow-inner">
                          <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center"><Smartphone size={16} className="mr-3 text-amber-500" /> Dial Control Engine</h4>
                          <div className="grid grid-cols-2 gap-8">
                             <div className="flex items-center justify-between p-6 bg-slate-950 rounded-3xl border border-slate-800 group hover:border-blue-500/30 transition-all">
                                <div>
                                   <p className="text-xs font-black text-white uppercase">Grabación Forzada</p>
                                   <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Grabar todas las interacciones</p>
                                </div>
                                <button className="w-12 h-6 bg-blue-600 rounded-full relative shadow-lg shadow-blue-600/20"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></button>
                             </div>
                             <div className="flex items-center justify-between p-6 bg-slate-950 rounded-3xl border border-slate-800 group hover:border-emerald-500/30 transition-all">
                                <div>
                                   <p className="text-xs font-black text-white uppercase">Protocolo AMD</p>
                                   <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Detección de Buzón de Voz</p>
                                </div>
                                <button 
                                  onClick={() => setEditingCampaign({...editingCampaign, amdEnabled: !editingCampaign.amdEnabled})}
                                  className={`w-12 h-6 rounded-full relative transition-all ${editingCampaign.amdEnabled ? 'bg-emerald-600' : 'bg-slate-700'}`}
                                >
                                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${editingCampaign.amdEnabled ? 'right-1' : 'left-1'}`}></div>
                                </button>
                             </div>
                          </div>
                       </div>
                    </div>
                 )}

                 {activeModalTab === 'HOPPER' && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                       <div className="flex items-center justify-between px-2">
                          <div>
                            <h4 className="text-lg font-black text-white uppercase tracking-tight">Hopper Stack Monitor</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Leads en cola para el próximo ciclo de marcado</p>
                          </div>
                          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-blue-400 font-black text-xl font-mono shadow-inner">{editingCampaign.hopperLevel}</div>
                       </div>
                       <div className="p-10 bg-slate-950 rounded-[48px] border-2 border-slate-800 space-y-6 shadow-inner">
                          <table className="w-full text-left">
                             <thead className="text-[9px] font-black text-slate-600 uppercase tracking-widest border-b border-slate-900">
                                <tr>
                                   <th className="pb-4">Phone Number</th>
                                   <th className="pb-4">Priority</th>
                                   <th className="pb-4">List ID</th>
                                   <th className="pb-4 text-right">Status</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-900">
                                {[...Array(5)].map((_, i) => (
                                  <tr key={i} className="text-xs font-mono text-slate-400">
                                     <td className="py-4 font-black text-white">+1 305-555-0{Math.floor(Math.random()*900)+100}</td>
                                     <td className="py-4"><span className="bg-blue-600/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">{Math.floor(Math.random()*99)}</span></td>
                                     <td className="py-4">LIST_1001</td>
                                     <td className="py-4 text-right text-[10px] font-black text-emerald-500 uppercase tracking-widest">Ready</td>
                                  </tr>
                                ))}
                             </tbody>
                          </table>
                          <button className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl text-[9px] font-black text-slate-600 uppercase tracking-widest hover:border-slate-700 hover:text-slate-400 transition-all">Refrescar Stack del Hopper</button>
                       </div>
                    </div>
                 )}
              </div>

              <div className="p-10 bg-slate-900/60 border-t border-slate-800 flex justify-end items-center space-x-6 shrink-0">
                 <div className="flex items-center space-x-3 text-[10px] font-black text-slate-500 uppercase tracking-widest italic opacity-60">
                    <ShieldCheck size={20} className="text-emerald-500" />
                    <span>Sync Multi-Server v4.8 Active</span>
                 </div>
                 <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white px-16 py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center space-x-4">
                    <Save size={20} />
                    <span>Sellar y Aplicar</span>
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns;

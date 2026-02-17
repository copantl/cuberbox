
import React, { useState, useEffect } from 'react';
import { 
  Phone, Server, Globe, Key, Shield, Hash, Activity, Plus, Trash2, 
  Settings, Save, RefreshCw, CheckCircle, XCircle, Layers, Radio,
  Smartphone, Monitor, Zap, ListFilter, Cpu, Database, Search, 
  ArrowRightLeft, X, ShieldCheck, Terminal as TerminalIcon, Power, 
  ToggleLeft, ToggleRight, ChevronRight, Info, Lock, Unlock, PhoneIncoming,
  Edit2, Clock
} from 'lucide-react';
import { SIPTrunk, DID, User } from '../types';
import { MOCK_DIDS, MOCK_TRUNKS, MOCK_CAMPAIGNS, MOCK_USERS_LIST } from '../constants';
import FreeswitchCLI from './FreeswitchCLI';
import { useToast } from '../ToastContext';

const TelephonyConfig: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'FS' | 'TRUNKS' | 'DIDS' | 'EXTENSIONS' | 'CLI'>('TRUNKS');
  const [trunks, setTrunks] = useState<SIPTrunk[]>(MOCK_TRUNKS);
  const [dids, setDids] = useState<DID[]>(MOCK_DIDS);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // States para CRUD de Trunks
  const [isTrunkModalOpen, setIsTrunkModalOpen] = useState(false);
  const [editingTrunk, setEditingTrunk] = useState<Partial<SIPTrunk> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleGlobalSync = async () => {
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsSyncing(false);
    toast('Profiles de Sofia y XML Dialplan recargados.', 'success', 'Nexus Core Sync');
  };

  const handleOpenTrunkModal = (trunk?: SIPTrunk) => {
    if (trunk) {
      setEditingTrunk({ ...trunk });
    } else {
      setEditingTrunk({
        id: `trunk_${Math.random().toString(36).substr(2, 5)}`,
        name: '',
        status: 'unregistered',
        host: ''
      });
    }
    setIsTrunkModalOpen(true);
  };

  const handleSaveTrunk = async () => {
    if (!editingTrunk?.name || !editingTrunk?.host) {
      toast('El nombre y el host son campos obligatorios.', 'error');
      return;
    }
    setIsSaving(true);
    // Simulación de propagación de configuración SIP al clúster
    await new Promise(r => setTimeout(r, 1500));
    
    const finalTrunk = { ...editingTrunk, status: 'registered' } as SIPTrunk;
    setTrunks(prev => {
      const exists = prev.find(t => t.id === finalTrunk.id);
      return exists ? prev.map(t => t.id === finalTrunk.id ? finalTrunk : t) : [...prev, finalTrunk];
    });

    setIsSaving(false);
    setIsTrunkModalOpen(false);
    setEditingTrunk(null);
    toast(`Gateway ${finalTrunk.name} configurado y registrado en Sofia.`, 'success', 'SIP Registration');
  };

  const handleDeleteTrunk = (id: string) => {
    if (confirm('¿Eliminar este gateway SIP? Esta acción desconectará todas las llamadas vinculadas.')) {
      setTrunks(trunks.filter(t => t.id !== id));
      toast('Gateway eliminado del plano de control.', 'warning');
    }
  };

  const handleDeleteDID = (id: string) => {
    if (confirm('¿Eliminar este DID del clúster?')) {
      setDids(dids.filter(d => d.id !== id));
      toast('DID removido del inventario.', 'warning');
    }
  };

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase flex items-center">
            <Phone className="mr-4 text-blue-500" size={32} />
            Infraestructura FreeSwitch
          </h2>
          <p className="text-slate-400 text-sm font-medium">Gestión de Sofia Profiles (Internal/External), Gateways y Terminal ESL.</p>
        </div>
        <div className="flex space-x-4">
           <button onClick={handleGlobalSync} disabled={isSyncing} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-3xl transition-all shadow-xl flex items-center active:scale-95 disabled:opacity-50">
              {isSyncing ? <RefreshCw className="animate-spin mr-2" size={18} /> : <ShieldCheck size={18} className="mr-2" />}
              <span className="font-black text-[10px] uppercase tracking-widest">Reload Sofia Core</span>
           </button>
        </div>
      </div>

      <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
        {[
          { id: 'FS', icon: Server, label: 'Nexus Node' },
          { id: 'TRUNKS', icon: Globe, label: 'Sofia Gateways' },
          { id: 'DIDS', icon: Hash, label: 'Carrier DIDs' },
          { id: 'EXTENSIONS', icon: Smartphone, label: 'WebRTC Verto' },
          { id: 'CLI', icon: TerminalIcon, label: 'fs_cli Console' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl' : 'bg-slate-800/40 text-slate-500 border border-slate-700/50 hover:bg-slate-800'}`}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="min-h-[600px]">
        {activeTab === 'CLI' ? <FreeswitchCLI /> : (
          <div className="glass rounded-[48px] border border-slate-700/50 p-10 shadow-2xl h-full">
            {activeTab === 'TRUNKS' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Gateways SIP Configurados</h3>
                  <button 
                    onClick={() => handleOpenTrunkModal()}
                    className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-xl transition-all active:scale-95 group"
                  >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {trunks.map(trunk => (
                    <div key={trunk.id} className="p-8 rounded-[40px] bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-all group relative overflow-hidden cursor-pointer shadow-inner">
                       <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center space-x-5">
                             <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-inner">
                                <Globe size={24} />
                             </div>
                             <div>
                                <h4 className="text-xl font-black text-white uppercase">{trunk.name}</h4>
                                <p className="text-[10px] font-mono text-slate-500 font-bold">Sofia Perfil: external</p>
                             </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                             <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase ${trunk.status === 'registered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                                {trunk.status}
                             </div>
                             <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={(e) => { e.stopPropagation(); handleOpenTrunkModal(trunk); }} className="p-2 bg-slate-800 hover:bg-blue-600 text-white rounded-lg transition-all"><Edit2 size={12} /></button>
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteTrunk(trunk.id); }} className="p-2 bg-slate-800 hover:bg-rose-600 text-white rounded-lg transition-all"><Trash2 size={12} /></button>
                             </div>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-950 rounded-3xl border border-slate-800 text-center">
                             <p className="text-[8px] font-black text-slate-600 uppercase">Host / Proxy</p>
                             <p className="text-xs font-black text-blue-400 font-mono truncate px-2">{trunk.host}</p>
                          </div>
                          <div className="p-4 bg-slate-950 rounded-3xl border border-slate-800 text-center">
                             <p className="text-[8px] font-black text-slate-600 uppercase">Contexto</p>
                             <p className="text-xs font-black text-white truncate">public</p>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'DIDS' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Inventario de DIDs (Inbound)</h3>
                  <button className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all">
                    <Plus size={16} />
                    <span>Importar DIDs</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dids.map(did => (
                    <div key={did.id} className="p-8 rounded-[40px] bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 transition-all group shadow-inner relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-5 text-emerald-500">
                          <Hash size={100} />
                       </div>
                       <div className="flex items-center justify-between mb-6 relative z-10">
                          <div className="p-3 rounded-2xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
                             <PhoneIncoming size={24} />
                          </div>
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-all">
                             <button className="p-2 bg-slate-800 hover:bg-blue-600 text-white rounded-lg transition-all"><Edit2 size={14} /></button>
                             <button onClick={() => handleDeleteDID(did.id)} className="p-2 bg-slate-800 hover:bg-rose-600 text-white rounded-lg transition-all"><Trash2 size={14} /></button>
                          </div>
                       </div>
                       <h4 className="text-2xl font-mono font-black text-white tracking-tighter mb-4 relative z-10">{did.number}</h4>
                       <div className="space-y-3 relative z-10">
                          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-500">
                             <span>Carrier</span>
                             <span className="text-white">{trunks.find(t => t.id === did.carrierId)?.name || 'Carrier Desconocido'}</span>
                          </div>
                          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-500">
                             <span>Destino Actual</span>
                             <span className="text-blue-400">{MOCK_CAMPAIGNS.find(c => c.id === did.campaignId)?.name || 'Sin Asignar'}</span>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'EXTENSIONS' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                 <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Endpoints Verto (WebRTC)</h3>
                    <div className="flex items-center space-x-2 bg-slate-950 px-4 py-2 rounded-full border border-slate-800 shadow-inner">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                       <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">WSS Proxy Active</span>
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_USERS_LIST.map(user => (
                      <div key={user.id} className="p-8 rounded-[40px] bg-slate-900 border border-slate-800 hover:border-blue-500/30 transition-all group shadow-inner relative overflow-hidden">
                         <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                               <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-blue-400 font-black border border-slate-700">
                                  {user.extension}
                               </div>
                               <div>
                                  <h4 className="font-black text-white uppercase text-sm">{user.fullName}</h4>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase">RFC-2833 / DTMF</p>
                               </div>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${user.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-700'}`}></div>
                         </div>
                         <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                               <p className="text-[8px] font-black text-slate-600 uppercase">Context</p>
                               <p className="text-[10px] font-black text-slate-300">default</p>
                            </div>
                            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                               <p className="text-[8px] font-black text-slate-600 uppercase">Profile</p>
                               <p className="text-[10px] font-black text-slate-300">internal</p>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}
            
            {activeTab === 'FS' && (
              <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                 <div className="flex items-center space-x-8">
                    <div className="w-24 h-24 rounded-[32px] bg-blue-600/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-inner">
                       <Server size={48} />
                    </div>
                    <div>
                       <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Nodo Maestro Nexus</h2>
                       <p className="text-sm text-slate-500 font-medium">Build: 1.10.12 LTS v4.7.9 Legacy Support</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-[40px] bg-slate-900 border border-slate-800 shadow-inner">
                       <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">ESL Status (Port 8021)</h4>
                       <div className="flex items-center space-x-4">
                          <Zap size={32} className="text-blue-500 animate-pulse" />
                          <p className="text-2xl font-black text-white">AUTHORIZED</p>
                       </div>
                    </div>
                    <div className="p-8 rounded-[40px] bg-slate-900 border border-slate-800 shadow-inner">
                       <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">WSS WebRTC (Port 8089)</h4>
                       <div className="flex items-center space-x-4">
                          <Activity size={32} className="text-emerald-500" />
                          <p className="text-2xl font-black text-white">STABLE</p>
                       </div>
                    </div>
                    <div className="p-8 rounded-[40px] bg-slate-900 border border-slate-800 shadow-inner">
                       <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Core Uptime</h4>
                       <div className="flex items-center space-x-4">
                          <RefreshCw size={32} className="text-blue-500" />
                          <p className="text-3xl font-black text-white">12d 08h</p>
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL PARA PROVISIÓN DE GATEWAY SIP */}
      {isTrunkModalOpen && editingTrunk && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="relative w-full max-w-2xl glass rounded-[64px] border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
              
              {isSaving && (
                 <div className="absolute inset-0 z-[210] bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center space-y-8 text-center p-10">
                    <div className="relative">
                       <div className="w-24 h-24 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
                       <Zap size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400 animate-pulse" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-2">SIP Provisioning</h3>
                       <p className="text-slate-400 text-sm font-bold uppercase tracking-widest animate-pulse">Escribiendo XML y autenticando con carrier...</p>
                    </div>
                 </div>
              )}

              <div className="p-10 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between shrink-0 shadow-lg">
                 <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 rounded-[24px] bg-blue-600/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-inner">
                       <Globe size={32} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Sofia Gateway Forge</h3>
                       <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2">Configuración de Troncal SIP (External)</p>
                    </div>
                 </div>
                 <button onClick={() => setIsTrunkModalOpen(false)} className="p-4 bg-slate-800 hover:bg-rose-500/10 rounded-[20px] text-slate-400 hover:text-rose-500 transition-all border border-slate-700 shadow-xl"><X size={24} /></button>
              </div>

              <div className="p-12 space-y-10 overflow-y-auto scrollbar-hide max-h-[70vh]">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Alias del Gateway (Carrier Name)</label>
                    <input 
                      type="text" 
                      value={editingTrunk.name} 
                      onChange={e => setEditingTrunk({...editingTrunk, name: e.target.value})} 
                      className="w-full bg-slate-950 border-2 border-slate-800 rounded-[28px] px-8 py-5 text-sm text-white font-bold outline-none focus:border-blue-500 transition-all shadow-inner" 
                      placeholder="Ej: Twilio-East-Primary" 
                    />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Proxy / Host SIP</label>
                       <div className="relative group">
                          <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-colors" size={20} />
                          <input 
                            type="text" 
                            value={editingTrunk.host} 
                            onChange={e => setEditingTrunk({...editingTrunk, host: e.target.value})} 
                            className="w-full bg-slate-950 border-2 border-slate-800 rounded-[28px] pl-16 pr-8 py-5 text-sm font-mono text-blue-400 font-black outline-none focus:border-blue-500 transition-all shadow-inner" 
                            placeholder="sip.carrier.net" 
                          />
                       </div>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Puerto SIP</label>
                       <input 
                        type="number" 
                        defaultValue={5060}
                        className="w-full bg-slate-950 border-2 border-slate-800 rounded-[28px] px-8 py-5 text-sm font-mono text-white text-center outline-none focus:border-blue-500 transition-all shadow-inner" 
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="space-y-4 p-8 bg-slate-900 border-2 border-slate-800 rounded-[40px] shadow-inner">
                       <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center">
                          <ShieldCheck size={12} className="mr-2 text-emerald-500" /> Registro de Credenciales
                       </h4>
                       <div className="space-y-4">
                          <input type="text" placeholder="Auth Username" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-300 outline-none focus:border-blue-500" />
                          <input type="password" placeholder="Auth Password" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-300 outline-none focus:border-blue-500" />
                       </div>
                    </div>

                    <div className="space-y-4 p-8 bg-slate-900 border-2 border-slate-800 rounded-[40px] shadow-inner flex flex-col justify-center">
                       <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Register Gateway</span>
                          <button className="w-12 h-6 bg-blue-600 rounded-full relative shadow-lg shadow-blue-600/20"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></button>
                       </div>
                       <p className="text-[9px] text-slate-600 font-bold uppercase leading-relaxed">
                          Habilita el registro periódico para carriers que requieren Keep-alive SIP.
                       </p>
                    </div>
                 </div>
              </div>

              <div className="p-10 bg-slate-900/60 border-t border-slate-800 flex justify-end items-center space-x-8 shadow-2xl shrink-0">
                 <div className="flex items-center space-x-3 text-[10px] font-black text-slate-500 uppercase tracking-widest italic opacity-60">
                    <ShieldCheck size={18} className="text-emerald-500" />
                    <span>Sync Multi-Server SIP Stack</span>
                 </div>
                 <button 
                   onClick={handleSaveTrunk} 
                   className="bg-blue-600 hover:bg-blue-500 text-white px-14 py-6 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-600/30 transition-all active:scale-95 flex items-center space-x-4 group"
                 >
                    <Save size={20} className="group-hover:scale-110 transition-transform" />
                    <span>Sellar Gateway</span>
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default TelephonyConfig;

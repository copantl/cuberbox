import React, { useState } from 'react';
import { 
  CloudSync, Globe, Zap, MessageSquare, Bot, Server, ShieldCheck, 
  Settings, Save, RefreshCw, X, Plus, Trash2, Key, Database,
  Terminal, ExternalLink, Code, Smartphone, Info, Share2, 
  Lock, Network, ArrowRight, ChevronRight, Gauge,
  CheckCircle2, AlertCircle, Phone
} from 'lucide-react';
import { useToast } from '../ToastContext';
import ConfirmDialog from './ConfirmDialog';

interface GatewayConfig {
  id: string;
  name: string;
  type: 'SIP' | 'SMS';
  provider: string;
  status: 'ACTIVE' | 'ERROR' | 'STANDBY';
  lastPing: string;
  host?: string;
}

const INITIAL_GATEWAYS: GatewayConfig[] = [
  { id: 'gw_1', name: 'Twilio USA East', type: 'SIP', provider: 'Twilio', status: 'ACTIVE', lastPing: '12ms', host: 'sip.twilio.com' },
  { id: 'gw_2', name: 'Voxbone Global', type: 'SIP', provider: 'Bandwidth', status: 'ACTIVE', lastPing: '45ms', host: 'vox-global.sip.com' },
  { id: 'gw_3', name: 'SMS Relay Primary', type: 'SMS', provider: 'Plivo', status: 'STANDBY', lastPing: '110ms', host: 'api.plivo.com/v1' },
];

const ExternalIntegrations: React.FC = () => {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<'CRM' | 'GATEWAYS' | 'AI' | 'FREESWITCH'>('CRM');
  const [isSyncing, setIsSyncing] = useState(false);
  
  // --- Estados de Gateways ---
  const [gateways, setGateways] = useState<GatewayConfig[]>(INITIAL_GATEWAYS);
  const [isGatewayModalOpen, setIsGatewayModalOpen] = useState(false);
  const [editingGateway, setEditingGateway] = useState<Partial<GatewayConfig> | null>(null);
  const [isSavingGateway, setIsSavingGateway] = useState(false);
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

  const categories = [
    { id: 'CRM', label: 'CRM & Salesforce', icon: Globe, color: 'text-purple-400' },
    { id: 'GATEWAYS', label: 'SIP & SMS Gateways', icon: Network, color: 'text-emerald-400' },
    { id: 'AI', label: 'Intelligence Core', icon: Bot, color: 'text-blue-400' },
    { id: 'FREESWITCH', label: 'FreeSwitch Low-Level', icon: Server, color: 'text-rose-400' },
  ];

  const handleGlobalSync = async () => {
    setIsSyncing(true);
    toast('Iniciando Handshake con todos los servicios externos...', 'info', 'Cloud Mesh');
    await new Promise(r => setTimeout(r, 2000));
    setIsSyncing(false);
    toast('Malla de integraciones sincronizada.', 'success');
  };

  const handleOpenGatewayModal = (gw?: GatewayConfig) => {
    if (gw) {
      setEditingGateway({ ...gw });
    } else {
      setEditingGateway({
        id: `gw_${Math.random().toString(36).substr(2, 5)}`,
        name: '',
        type: 'SIP',
        provider: 'Custom',
        status: 'STANDBY',
        lastPing: '--',
        host: ''
      });
    }
    setIsGatewayModalOpen(true);
  };

  const handleSaveGateway = async () => {
    if (!editingGateway?.name || !editingGateway?.host) {
      toast('Alias y Host/Endpoint son obligatorios.', 'error');
      return;
    }

    setIsSavingGateway(true);
    // Simulación de registro SIP/API
    await new Promise(r => setTimeout(r, 1800));

    const finalGw = { ...editingGateway, status: 'ACTIVE', lastPing: '22ms' } as GatewayConfig;
    
    setGateways(prev => {
      const exists = prev.find(g => g.id === finalGw.id);
      return exists ? prev.map(g => g.id === finalGw.id ? finalGw : g) : [finalGw, ...prev];
    });

    setIsSavingGateway(false);
    setIsGatewayModalOpen(false);
    setEditingGateway(null);
    toast(`Gateway ${finalGw.name} registrado y verificado.`, 'success', 'Media Provisioning');
  };

  const handleDeleteGateway = (id: string) => {
    setConfirmAction({
      isOpen: true,
      title: 'Eliminar Gateway',
      message: '¿Eliminar este gateway? Las rutas vinculadas dejarán de funcionar.',
      onConfirm: () => {
        setGateways(prev => prev.filter(g => g.id !== id));
        toast('Gateway removido del inventario.', 'warning');
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase flex items-center">
            <CloudSync className="mr-4 text-blue-500" size={36} />
            Hub de Integraciones
          </h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Gobernanza centralizada de puentes de datos y flujos externos.</p>
        </div>
        <button 
          onClick={handleGlobalSync}
          disabled={isSyncing}
          className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-[28px] font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center space-x-3"
        >
          {isSyncing ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} />}
          <span>Sincronizar Cloud Hub</span>
        </button>
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* Navigation Sidebar */}
        <div className="col-span-12 lg:col-span-3 space-y-3">
           {categories.map(cat => (
             <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`w-full flex items-center p-6 rounded-[32px] border-2 transition-all relative overflow-hidden group ${activeCategory === cat.id ? 'bg-blue-600/10 border-blue-500 shadow-xl' : 'glass border-slate-800 hover:bg-slate-800/40'}`}
             >
                <div className={`p-3 rounded-2xl mr-4 transition-all ${activeCategory === cat.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-900 ' + cat.color}`}>
                   <cat.icon size={22} />
                </div>
                <div className="text-left">
                  <span className={`text-[11px] font-black uppercase tracking-widest block ${activeCategory === cat.id ? 'text-white' : 'text-slate-400'}`}>{cat.label}</span>
                  <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">v4.7.9 Layer</span>
                </div>
                {activeCategory === cat.id && <div className="absolute right-6 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>}
             </button>
           ))}

           <div className="p-8 glass rounded-[40px] border border-blue-500/20 bg-blue-600/5 mt-10">
              <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 flex items-center">
                 <ShieldCheck size={14} className="mr-2" /> Compliance Node
              </h4>
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase">
                 Todas las conexiones se cifran mediante TLS 1.3 con rotación de claves RSA-4096.
              </p>
           </div>
        </div>

        {/* Content Area */}
        <div className="col-span-12 lg:col-span-9">
           <div className="glass h-full rounded-[64px] border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col min-h-[700px]">
              
              {activeCategory === 'CRM' && (
                <div className="p-12 space-y-12 animate-in slide-in-from-right-4">
                   <div className="flex items-center justify-between border-b border-slate-800 pb-8">
                      <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 rounded-[24px] bg-purple-600 flex items-center justify-center text-white shadow-2xl border-4 border-white/10">
                           <Globe size={32} />
                        </div>
                        <div>
                           <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Salesforce Bridge</h3>
                           <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Conexión Nativa via OAuth 2.0</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/20 font-black text-[10px] uppercase">
                         <CheckCircle2 size={14} className="mr-2" /> Live Connection
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Consumer Key (Client ID)</label>
                         <input type="text" value="3MVG99Ox_Xf3SGN123984_nexus_live_pk..." readOnly className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-xs text-blue-400 font-mono outline-none" />
                      </div>
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Instance URL</label>
                         <input type="text" value="https://nexus-core.my.salesforce.com" readOnly className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-xs text-slate-400 font-mono outline-none" />
                      </div>
                   </div>

                   <div className="p-10 bg-slate-900/60 rounded-[40px] border border-slate-800 space-y-6 shadow-inner">
                      <h4 className="text-sm font-black text-white uppercase tracking-tight flex items-center">
                        <Share2 size={18} className="mr-3 text-purple-400" />
                        Mapeo de Sincronización
                      </h4>
                      <div className="space-y-3">
                         {[
                           { sfdc: 'Lead.MobilePhone', cuber: 'lead_phone' },
                           { sfdc: 'Lead.Status', cuber: 'disposition' },
                           { sfdc: 'Task.CallDurationInSeconds', cuber: 'billsec' }
                         ].map((m, i) => (
                           <div key={i} className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800 group hover:border-purple-500/30 transition-all">
                              <span className="text-xs font-mono text-slate-500">{m.sfdc}</span>
                              <RefreshCw size={12} className="text-slate-700 group-hover:text-purple-500 transition-colors" />
                              <span className="text-xs font-mono text-white">{m.cuber}</span>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="pt-8 flex justify-end">
                      <button className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Re-autenticar Instancia</button>
                   </div>
                </div>
              )}

              {activeCategory === 'GATEWAYS' && (
                <div className="p-12 space-y-12 animate-in slide-in-from-right-4">
                   <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black text-white uppercase tracking-tight">Media Gateways Registry</h3>
                      <button 
                        onClick={() => handleOpenGatewayModal()}
                        className="bg-emerald-600 text-white p-3 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all group"
                      >
                        <Plus size={24} className="group-hover:rotate-90 transition-transform" />
                      </button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {gateways.map((gw, i) => (
                        <div key={gw.id} className="p-8 rounded-[40px] bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition-all group relative overflow-hidden">
                           <div className="flex items-center justify-between mb-8 relative z-10">
                              <div className="flex items-center space-x-4">
                                 <div className={`p-3 rounded-xl bg-slate-950 border border-slate-800 ${gw.type === 'SIP' ? 'text-blue-400' : 'text-rose-400'}`}>
                                    {gw.type === 'SIP' ? <Smartphone size={20} /> : <MessageSquare size={20} />}
                                 </div>
                                 <div>
                                    <h4 className="font-black text-white uppercase text-sm">{gw.name}</h4>
                                    <p className="text-[9px] text-slate-500 font-bold uppercase">{gw.provider}</p>
                                 </div>
                              </div>
                              <div className={`w-2.5 h-2.5 rounded-full ${gw.status === 'ACTIVE' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-amber-500'}`}></div>
                           </div>
                           <div className="space-y-4 mb-6 relative z-10">
                              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                                 <span>Endpoint</span>
                                 <span className="text-slate-300 font-mono text-[9px]">{gw.host}</span>
                              </div>
                              <div className="h-px bg-slate-800"></div>
                              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                                 <span>Latencia</span>
                                 <span className="text-emerald-400 font-mono">{gw.lastPing}</span>
                              </div>
                           </div>
                           <div className="flex justify-end items-center space-x-2 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleOpenGatewayModal(gw)} className="p-2 bg-slate-800 hover:bg-blue-600 text-slate-500 hover:text-white rounded-xl transition-all shadow-lg"><Settings size={14} /></button>
                              <button onClick={() => handleDeleteGateway(gw.id)} className="p-2 bg-slate-800 hover:bg-rose-600 text-slate-500 hover:text-white rounded-xl transition-all shadow-lg"><Trash2 size={14} /></button>
                           </div>
                        </div>
                      ))}
                   </div>

                   <div className="p-10 glass rounded-[48px] border border-slate-800 space-y-6">
                      <h4 className="text-xl font-black text-white uppercase tracking-tight flex items-center">
                        <Code size={24} className="mr-3 text-emerald-400" />
                        Custom SMS Relay Template
                      </h4>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Para gateways de SMS locales o personalizados via HTTP API.</p>
                      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 font-mono text-xs text-blue-400 break-all shadow-inner">
                         https://my-sms-gateway.local/api/send?user=nexus&pass=********&to=<span className="text-emerald-400">{"{{phone}}"}</span>&msg=<span className="text-emerald-400">{"{{message}}"}</span>
                      </div>
                   </div>
                </div>
              )}

              {activeCategory === 'AI' && (
                <div className="p-12 space-y-12 animate-in slide-in-from-right-4">
                   <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 rounded-[32px] bg-blue-600 flex items-center justify-center text-white shadow-2xl border-4 border-white/10">
                         <Bot size={44} />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Neural Engine Config</h3>
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Orquestación de Modelos Gemini & Inferencia</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="p-8 rounded-[40px] bg-slate-900 border border-slate-800 space-y-6 group hover:border-blue-500/30 transition-all">
                         <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Model</span>
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                         </div>
                         <p className="text-2xl font-black text-white uppercase tracking-tighter">Gemini 3 Pro</p>
                         <button className="w-full py-2 bg-slate-950 border border-slate-800 rounded-xl text-[9px] font-black text-blue-400 uppercase tracking-widest">Switch Model</button>
                      </div>
                      <div className="p-8 rounded-[40px] bg-slate-900 border border-slate-800 space-y-6 group hover:border-blue-500/30 transition-all">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">API Key Status</span>
                         <div className="flex items-center space-x-3 text-emerald-400">
                            <ShieldCheck size={20} />
                            <span className="text-xl font-black tracking-tighter">AUTHORIZED</span>
                         </div>
                         <p className="text-[9px] font-mono text-slate-700 truncate">sk_live_v4_p3_********************</p>
                      </div>
                      <div className="p-8 rounded-[40px] bg-slate-900 border border-slate-800 space-y-6 group hover:border-blue-500/30 transition-all">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Neural Latency</span>
                         <p className="text-3xl font-black text-white tracking-tighter">1.4s <span className="text-xs text-slate-600 font-bold uppercase">Avg</span></p>
                         <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden">
                            <div className={`h-full bg-blue-600`} style={{ width: '85%' }}></div>
                         </div>
                      </div>
                   </div>

                   <div className="p-10 glass rounded-[56px] border border-slate-800 space-y-10">
                      <h4 className="text-xl font-black text-white uppercase tracking-tight flex items-center">
                        <Gauge size={24} className="mr-3 text-blue-400" />
                        Inference Parameters (Global)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                         <div className="space-y-6">
                            <div className="flex justify-between items-center px-2">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Creativity (Temp)</label>
                               <span className="text-xs font-mono font-black text-blue-400">0.7</span>
                            </div>
                            <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                         </div>
                         <div className="space-y-6">
                            <div className="flex justify-between items-center px-2">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Max Response Tokens</label>
                               <span className="text-xs font-mono font-black text-blue-400">1024</span>
                            </div>
                            <input type="range" min="128" max="4096" step="128" defaultValue="1024" className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeCategory === 'FREESWITCH' && (
                <div className="p-12 space-y-12 animate-in slide-in-from-bottom-4">
                   <div className="flex items-center justify-between border-b border-slate-800 pb-8">
                      <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 rounded-[24px] bg-slate-950 flex items-center justify-center text-rose-500 shadow-inner border border-rose-500/20">
                           <Terminal size={32} />
                        </div>
                        <div>
                           <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Low-Level SIP Stack</h3>
                           <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Configuración Directa de Sofia Profiles</p>
                        </div>
                      </div>
                      <button className="bg-rose-600 hover:bg-rose-500 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center">
                         <RefreshCw size={14} className="mr-2" /> Hot Reload XML
                      </button>
                   </div>

                   <div className="space-y-6">
                      <div className="flex space-x-4 border-b border-slate-800 overflow-x-auto scrollbar-hide">
                         {['internal.xml', 'external.xml', 'vars.xml', 'gateways.xml'].map(file => (
                           <button key={file} className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${file === 'gateways.xml' ? 'border-rose-500 text-rose-400' : 'border-transparent text-slate-600'}`}>{file}</button>
                         ))}
                      </div>
                      
                      <div className="bg-[#010409] rounded-[40px] border border-slate-800 p-8 font-mono text-[11px] leading-relaxed relative group shadow-inner">
                         <div className="absolute top-6 right-8 text-slate-800 group-hover:text-rose-900/30 transition-colors">
                            <Code size={120} />
                         </div>
                         <pre className="text-blue-400 overflow-x-auto scrollbar-hide">
                            <code>{`
<configuration name="sofia.conf" description="sofia endpoint">
  <profiles>
    <profile name="external">
      <settings>
        <param name="debug" value="0"/>
        <param name="sip-port" value="5060"/>
        <param name="ext-rtp-ip" value="auto-nat"/>
        <param name="ext-sip-ip" value="auto-nat"/>
        <param name="inbound-proxy-media" value="true"/>
      </settings>
      <gateways>
        <gateway name="carrier_main">
          <param name="username" value="nexus_sip"/>
          <param name="password" value="********"/>
          <param name="proxy" value="sip.carrier.net"/>
          <param name="register" value="true"/>
        </gateway>
      </gateways>
    </profile>
  </profiles>
</configuration>
                            `}</code>
                         </pre>
                      </div>
                   </div>

                   <div className="p-10 rounded-[48px] bg-rose-600/5 border border-rose-500/20 flex items-start space-x-6">
                      <AlertCircle size={32} className="text-rose-500 shrink-0 mt-1" />
                      <div className="space-y-2">
                         <h4 className="text-lg font-black text-white uppercase tracking-tight">Advertencia de Seguridad</h4>
                         <p className="text-xs text-slate-400 font-medium leading-relaxed uppercase tracking-widest">
                            La edición directa del XML es un proceso de alto riesgo. Un error de sintaxis puede desconectar todos los SIP Trunks del clúster. Siempre realice un <span className="text-white">Validation Check</span> antes de aplicar.
                         </p>
                         <button className="mt-4 px-6 py-2 bg-slate-950 border border-slate-800 rounded-xl text-[9px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-900 hover:text-white transition-all">Validar Esquema XML</button>
                      </div>
                   </div>
                </div>
              )}

              {/* Footer de Sincronización */}
              <div className="mt-auto p-10 bg-slate-900/60 border-t border-slate-800 flex justify-between items-center shadow-2xl">
                 <div className="flex items-center space-x-4">
                    <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
                       <Database size={18} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-white uppercase tracking-widest">Config Persistence</p>
                       <p className="text-[9px] text-slate-500 font-bold uppercase italic">Syncing with Master DB: 10.0.0.5</p>
                    </div>
                 </div>
                 <div className="flex items-center space-x-3">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Integrity Hash Verified</span>
                    <button className="bg-slate-950 border border-slate-800 p-4 rounded-2xl hover:bg-blue-600 text-slate-500 hover:text-white transition-all shadow-xl"><Save size={20} /></button>
                 </div>
              </div>

           </div>
        </div>
      </div>

      {/* --- MODAL DE PROVISIÓN DE GATEWAY --- */}
      {isGatewayModalOpen && editingGateway && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="relative w-full max-w-2xl glass rounded-[64px] border border-slate-700/50 shadow-[0_0_100px_rgba(16,185,129,0.15)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
              
              {isSavingGateway && (
                 <div className="absolute inset-0 z-[260] bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center space-y-8 text-center p-10">
                    <div className="relative">
                       <div className="w-24 h-24 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
                       <Zap size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-400 animate-pulse" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-2">Carrier Registration</h3>
                       <p className="text-slate-400 text-sm font-bold uppercase tracking-widest animate-pulse">Autenticando con la terminal remota...</p>
                    </div>
                 </div>
              )}

              <div className="p-10 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between shadow-lg shrink-0">
                 <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 rounded-[24px] bg-emerald-600/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-inner">
                       <Network size={32} />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Media Gateway Setup</h3>
                       <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2">Configuración del Puente de Medios</p>
                    </div>
                 </div>
                 <button onClick={() => setIsGatewayModalOpen(false)} className="p-4 bg-slate-800 hover:bg-rose-500/10 rounded-[20px] text-slate-400 hover:text-rose-500 transition-all border border-slate-700 shadow-xl"><X size={24} /></button>
              </div>

              <div className="p-12 space-y-10 overflow-y-auto scrollbar-hide max-h-[70vh]">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Alias del Carrier (Friendly Name)</label>
                    <input 
                      type="text" 
                      value={editingGateway.name} 
                      onChange={e => setEditingGateway({...editingGateway, name: e.target.value})} 
                      className="w-full bg-slate-950 border-2 border-slate-800 rounded-[28px] px-8 py-5 text-sm text-white font-bold outline-none focus:border-emerald-500 transition-all shadow-inner" 
                      placeholder="Ej: VoIP-Carrier-Global-01" 
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Tipo de Servicio</label>
                       <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-[24px] shadow-inner">
                          <button 
                            onClick={() => setEditingGateway({...editingGateway, type: 'SIP'})}
                            className={`flex items-center justify-center space-x-2 py-3 rounded-[18px] text-[10px] font-black uppercase transition-all ${editingGateway.type === 'SIP' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
                          >
                             <Phone size={14} /> <span>SIP (Voice)</span>
                          </button>
                          <button 
                            // Added comment for line 475 fix
                            onClick={() => setEditingGateway({...editingGateway, type: 'SMS'} as any)}
                            className={`flex items-center justify-center space-x-2 py-3 rounded-[18px] text-[10px] font-black uppercase transition-all ${editingGateway.type === 'SMS' ? 'bg-rose-600 text-white' : 'text-slate-500'}`}
                          >
                             <MessageSquare size={14} /> <span>SMS (Text)</span>
                          </button>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Provider Key (OAuth/Auth)</label>
                       <div className="relative group">
                          <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                          <input type="password" value="************************" readOnly className="w-full bg-slate-950 border border-slate-800 rounded-[28px] pl-16 pr-6 py-5 text-xs text-blue-400 font-mono" />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Gateway Host / API Endpoint</label>
                    <div className="relative group">
                       <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
                       <input 
                         type="text" 
                         value={editingGateway.host} 
                         onChange={e => setEditingGateway({...editingGateway, host: e.target.value})} 
                         className="w-full bg-slate-950 border-2 border-slate-800 rounded-[28px] pl-16 pr-8 py-5 text-sm font-mono text-emerald-400 font-black outline-none focus:border-emerald-500 transition-all shadow-inner" 
                         placeholder="sip.carrier.net o api.sms-relay.com" 
                       />
                    </div>
                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest ml-4 flex items-center">
                       <Info size={12} className="mr-1.5 text-blue-500" /> RFC-3261 Compliance Required for SIP Handshake
                    </p>
                 </div>
              </div>

              <div className="p-10 bg-slate-900/60 border-t border-slate-800 flex justify-end items-center space-x-6 shadow-2xl">
                 <div className="flex items-center space-x-3 text-[10px] font-black text-slate-500 uppercase tracking-widest italic opacity-60">
                    <ShieldCheck size={18} className="text-emerald-500" />
                    <span>Bridge TLS 1.3 Sync</span>
                 </div>
                 <button 
                  onClick={handleSaveGateway}
                  disabled={isSavingGateway}
                  className="flex items-center space-x-4 bg-emerald-600 hover:bg-emerald-500 text-white px-14 py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/30 transition-all active:scale-95 disabled:opacity-50 group"
                 >
                    {isSavingGateway ? <RefreshCw className="animate-spin" size={22} /> : <Save size={22} className="group-hover:scale-110 transition-transform" />}
                    <span>Sellar & Registrar</span>
                 </button>
              </div>
           </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmAction.isOpen}
        title={confirmAction.title}
        message={confirmAction.message}
        onConfirm={() => {
          confirmAction.onConfirm();
          setConfirmAction(prev => ({ ...prev, isOpen: false }));
        }}
        onCancel={() => setConfirmAction(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default ExternalIntegrations;
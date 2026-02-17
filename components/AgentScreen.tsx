
import React, { useState, useEffect } from 'react';
import { 
  Phone, PhoneOff, Pause, Play, Headphones, Clock, User, 
  Sparkles, CheckCircle2, X, PhoneIncoming, MessageSquare,
  ClipboardList, FileText, Quote, Coffee, ShieldAlert,
  AlertCircle, RefreshCw, ChevronRight, Zap, Info, Mic, MicOff,
  Volume2, VolumeX, Smartphone, MapPin, Target, ListChecks,
  Activity, Brain as BrainIcon, Wifi, ShieldCheck, Power,
  Search, PhoneForwarded, Users2, Trophy, Save, Terminal,
  MessageCircle, Mail, Send, History, Star, ArrowRightLeft,
  Settings2, Signal, BarChart3, Flame, Timer
} from 'lucide-react';
import { PAUSE_CODES, MOCK_CAMPAIGNS, MOCK_USER, MOCK_CALL_CODES } from '../constants';
import { User as UserType } from '../types';
import { useToast } from '../ToastContext';
import Logo from './Logo';

const AudioWaveform = () => (
  <div className="flex items-center justify-center space-x-1.5 h-10 px-4">
    {[...Array(20)].map((_, i) => (
      <div 
        key={i} 
        className={`w-1 rounded-full animate-wave ${i % 2 === 0 ? 'bg-emerald-400' : 'bg-blue-400'}`} 
        style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.05}s` }}
      ></div>
    ))}
  </div>
);

const AgentScreen: React.FC<{ user?: UserType }> = ({ user = MOCK_USER }) => {
  const { toast } = useToast();
  const [isLaunched, setIsLaunched] = useState(false);
  const [activeTab, setActiveTab] = useState<'CRM' | 'SCRIPT' | 'CHAT' | 'HISTORY'>('CRM');
  const [status, setStatus] = useState<'READY' | 'PAUSED' | 'INCALL' | 'WRAPUP' | 'RINGING'>('READY');
  const [timer, setTimer] = useState(0);
  const [currentLead, setCurrentLead] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [dialMode, setDialMode] = useState<'AUTO' | 'MANUAL'>('AUTO');

  useEffect(() => {
    let t: any;
    if (isLaunched && status !== 'READY') {
      t = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(t);
  }, [status, isLaunched]);

  const handleDial = () => {
    setStatus('RINGING');
    setTimer(0);
    // Simulación de inyección de lead desde el Hopper
    setTimeout(() => {
      setCurrentLead({
        id: 'L-9482',
        name: 'Alexander Pierce',
        phone: '+1 305-555-0122',
        city: 'Miami, FL',
        address: 'Brickell Ave 1200',
        script: 'Hola **{{name}}**, te llamo de Cuberbox porque notamos tu interés en el proyecto inmobiliario de {{city}}...'
      });
      setStatus('INCALL');
      toast('Llamada Conectada: Alexander Pierce', 'success');
    }, 2000);
  };

  const renderScript = (text: string) => {
    if (!currentLead) return text;
    return text
      .replace('{{name}}', currentLead.name)
      .replace('{{city}}', currentLead.city);
  };

  if (!isLaunched) {
    return (
      <div className="h-full flex items-center justify-center p-6 animate-in fade-in duration-700">
         <div className="w-full max-w-4xl glass rounded-[64px] border-2 border-slate-800 p-20 flex flex-col items-center space-y-10">
            <Logo className="w-20 h-20" />
            <div className="text-center">
               <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Estación Agente Pro</h2>
               <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Nexus Blended Core v4.8</p>
            </div>
            <div className="grid grid-cols-2 gap-6 w-full max-w-md">
               <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Campaña Activa</p>
                  <p className="text-white font-black uppercase">Real Estate Florida</p>
               </div>
               <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Extensión SIP</p>
                  <p className="text-blue-400 font-mono font-black">{user.extension}</p>
               </div>
            </div>
            <button onClick={() => setIsLaunched(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-20 py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all">
               Entrar en Línea
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-1000">
      
      {/* 1. HUD DE CONTROL SUPERIOR */}
      <div className={`glass rounded-[48px] border-2 p-6 flex items-center justify-between shadow-2xl transition-all duration-700 ${status === 'INCALL' ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-slate-800'}`}>
         <div className="flex items-center space-x-8">
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-2xl ${status === 'INCALL' ? 'bg-emerald-500 animate-pulse' : status === 'PAUSED' ? 'bg-amber-500' : 'bg-blue-600'}`}>
               {status === 'INCALL' ? <Smartphone size={32} /> : <Headphones size={32} />}
            </div>
            <div>
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                  {status === 'INCALL' ? 'EN LLAMADA ACTIVA' : status === 'READY' ? 'ESPERANDO LEAD...' : status}
               </h3>
               <div className="flex items-center space-x-4 mt-2">
                  <span className="text-xl font-mono font-black text-blue-400">
                    {Math.floor(timer/60).toString().padStart(2,'0')}:{(timer%60).toString().padStart(2,'0')}
                  </span>
                  {status === 'INCALL' && <AudioWaveform />}
               </div>
            </div>
         </div>

         <div className="flex items-center space-x-4">
            {status === 'READY' ? (
               <button onClick={handleDial} className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-xl">Manual Dial</button>
            ) : (
               <button onClick={() => setStatus('READY')} className="bg-rose-600 hover:bg-rose-500 text-white px-10 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-xl">Colgar / Terminar</button>
            )}
            <button onClick={() => setStatus('PAUSED')} className="p-4 bg-slate-800 hover:bg-amber-600 text-slate-400 hover:text-white rounded-2xl transition-all"><Pause size={20} /></button>
            <button onClick={() => setIsLaunched(false)} className="p-4 bg-slate-900 hover:bg-rose-600 text-slate-500 hover:text-white rounded-2xl transition-all"><Power size={20} /></button>
         </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
         {/* 2. AREA DE GESTIÓN (CRM & SCRIPT) */}
         <div className="col-span-12 lg:col-span-8 flex flex-col space-y-6 min-h-0">
            <div className="glass flex-1 rounded-[56px] border border-slate-800 flex flex-col overflow-hidden shadow-2xl">
               <div className="bg-slate-900/60 p-4 flex space-x-2 border-b border-slate-800">
                  <button onClick={() => setActiveTab('CRM')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'CRM' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>Expediente</button>
                  <button onClick={() => setActiveTab('SCRIPT')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'SCRIPT' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>Guion de Venta</button>
               </div>

               <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
                  {activeTab === 'CRM' && currentLead && (
                    <div className="space-y-10 animate-in fade-in duration-500">
                       <div className="flex items-center space-x-8">
                          <div className="w-24 h-24 rounded-[40px] bg-slate-800 flex items-center justify-center text-4xl font-black text-blue-400 border-4 border-slate-700 shadow-inner">
                             {currentLead.name.charAt(0)}
                          </div>
                          <div>
                             <h4 className="text-4xl font-black text-white uppercase tracking-tighter">{currentLead.name}</h4>
                             <p className="text-xl font-mono text-slate-500 mt-1">{currentLead.phone}</p>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">Ubicación</label>
                             <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-3xl flex items-center">
                                <MapPin size={18} className="mr-4 text-blue-500" />
                                <span className="text-sm font-bold text-white uppercase">{currentLead.city}</span>
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">Dirección</label>
                             <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-3xl flex items-center">
                                <Info size={18} className="mr-4 text-emerald-500" />
                                <span className="text-sm font-bold text-white uppercase">{currentLead.address}</span>
                             </div>
                          </div>
                       </div>
                       <div className="p-8 bg-slate-900 border border-slate-800 rounded-[40px] space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center"><MessageSquare size={14} className="mr-2" /> Notas de Gestión</label>
                          <textarea className="w-full h-32 bg-transparent border-none outline-none text-slate-300 resize-none font-medium leading-relaxed" placeholder="Registra detalles importantes aquí..." />
                       </div>
                    </div>
                  )}

                  {activeTab === 'SCRIPT' && currentLead && (
                    <div className="animate-in slide-in-from-right-4 duration-500">
                       <div className="p-10 glass rounded-[48px] border border-blue-500/20 bg-blue-500/5 relative overflow-hidden group">
                          <Quote size={80} className="absolute -top-4 -right-4 text-blue-500/10 group-hover:scale-110 transition-transform" />
                          <div className="relative z-10 text-xl text-slate-200 leading-relaxed font-medium space-y-6">
                             {renderScript(currentLead.script).split('\n').map((para: string, i: number) => (
                               <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<b class="text-blue-400">$1</b>') }} />
                             ))}
                          </div>
                       </div>
                    </div>
                  )}
                  
                  {!currentLead && (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-6">
                       <RefreshCw size={80} className="animate-spin-slow" />
                       <p className="text-xl font-black uppercase tracking-[0.4em]">Sincronizando Hopper...</p>
                    </div>
                  )}
               </div>
            </div>
         </div>

         {/* 3. COLUMNA DE TIPIFICACIÓN Y ACCIONES */}
         <div className="col-span-12 lg:col-span-4 flex flex-col space-y-6 min-h-0">
            
            {/* MATRIX DE DISPOSICIONES */}
            <div className="glass p-8 rounded-[48px] border border-slate-800 flex flex-col space-y-6 shrink-0">
               <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center"><ListChecks size={16} className="mr-2 text-blue-500" /> Tipificar</h4>
                  <span className="text-[10px] font-black text-emerald-500 uppercase">Shift Lock: Off</span>
               </div>
               <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto scrollbar-hide pr-1">
                  {MOCK_CALL_CODES.map(code => (
                    <button 
                      key={code.id}
                      onClick={() => { setStatus('WRAPUP'); toast(`Tipificación guardada: ${code.name}`, 'success'); }}
                      className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-tighter text-white hover:border-blue-500/50 hover:bg-blue-600/5 transition-all active:scale-95 group text-center"
                    >
                       <div className={`w-2 h-2 rounded-full mx-auto mb-2 ${code.isSale ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-slate-700'}`}></div>
                       {code.name}
                    </button>
                  ))}
               </div>
            </div>

            {/* CONTROLES DE TELEFONÍA AVANZADA */}
            <div className="glass flex-1 rounded-[48px] border border-slate-800 p-8 flex flex-col space-y-8 bg-gradient-to-br from-[#0f172a] to-black relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 text-blue-400"><Signal size={120} /></div>
               
               <div className="grid grid-cols-2 gap-4 relative z-10">
                  <button onClick={() => setIsMuted(!isMuted)} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center justify-center space-y-2 ${isMuted ? 'bg-rose-600/20 border-rose-500 text-rose-500' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'}`}>
                     {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                     <span className="text-[8px] font-black uppercase">Silencio</span>
                  </button>
                  <button className="p-6 rounded-3xl border-2 bg-slate-900 border-slate-800 text-slate-500 hover:text-blue-400 hover:border-blue-500/40 transition-all flex flex-col items-center justify-center space-y-2">
                     <VolumeX size={24} />
                     <span className="text-[8px] font-black uppercase">Espera</span>
                  </button>
                  <button className="p-6 rounded-3xl border-2 bg-slate-900 border-slate-800 text-slate-500 hover:text-blue-400 hover:border-blue-500/40 transition-all flex flex-col items-center justify-center space-y-2">
                     <ArrowRightLeft size={24} />
                     <span className="text-[8px] font-black uppercase">Transferir</span>
                  </button>
                  <button className="p-6 rounded-3xl border-2 bg-slate-900 border-slate-800 text-slate-500 hover:text-blue-400 hover:border-blue-500/40 transition-all flex flex-col items-center justify-center space-y-2">
                     <Users2 size={24} />
                     <span className="text-[8px] font-black uppercase">Conferencia</span>
                  </button>
               </div>

               <div className="space-y-4 pt-4 relative z-10">
                  <button className="w-full py-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center space-x-3 text-blue-400 hover:text-blue-300 transition-all active:scale-95 group">
                     <Clock size={16} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Programar Callback</span>
                  </button>
               </div>

               <div className="mt-auto pt-6 border-t border-slate-800/50 flex items-center justify-between relative z-10">
                  <div className="flex items-center space-x-2">
                     <Wifi size={14} className="text-emerald-500" />
                     <span className="text-[8px] font-black text-slate-500 uppercase">Jitter: 0.02ms</span>
                  </div>
                  <div className="flex items-center space-x-2">
                     <ShieldCheck size={14} className="text-blue-500" />
                     <span className="text-[8px] font-black text-slate-500 uppercase">SRTP: Active</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AgentScreen;

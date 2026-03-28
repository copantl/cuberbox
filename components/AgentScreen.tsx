
import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, PhoneOff, Pause, Play, Headphones, Clock, User, 
  Sparkles, CheckCircle2, X, PhoneIncoming, MessageSquare,
  ClipboardList, FileText, Quote, Coffee, ShieldAlert,
  AlertCircle, RefreshCw, ChevronRight, Zap, Info, Mic, MicOff,
  Volume2, VolumeX, Smartphone, MapPin, Target, ListChecks,
  Activity, Brain as BrainIcon, Wifi, ShieldCheck, Power,
  Search, PhoneForwarded, Users2, Trophy, Save, Terminal,
  MessageCircle, Mail, Send, History, Star, ArrowRightLeft,
  Settings2, Signal, BarChart3, Flame, Timer, Calendar,
  CheckCircle as CheckIcon, Wand2, BrainCircuit, TrendingUp, TrendingDown,
  MessageCircleCode, Lightbulb, Globe,
  // Fix: Added missing Copy icon import
  Copy
} from 'lucide-react';
import { PAUSE_CODES, MOCK_CAMPAIGNS, MOCK_USER, MOCK_CALL_CODES, MOCK_TRUNKS } from '../constants';
import { User as UserType } from '../types';
import { useToast } from '../ToastContext';
import { GoogleGenAI } from "@google/genai";
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
  const [activeTab, setActiveTab] = useState<'CRM' | 'SCRIPT' | 'AI_ASSIST' | 'HISTORY'>('CRM');
  const [status, setStatus] = useState<'READY' | 'PAUSED' | 'INCALL' | 'WRAPUP' | 'RINGING'>('READY');
  const [timer, setTimer] = useState(0);
  const [currentLead, setCurrentLead] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [notes, setNotes] = useState("");
  
  // AI States
  const [aiSuggestion, setAiSuggestion] = useState<string>("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [sentiment, setSentiment] = useState<'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'>('NEUTRAL');

  // Real Dial States
  const [isDialerOpen, setIsDialerOpen] = useState(false);
  const [dialNumber, setDialNumber] = useState("");
  const [selectedGateway, setSelectedGateway] = useState("");
  const [isDialing, setIsDialing] = useState(false);

  // Callback States
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [callbackData, setCallbackData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    type: 'PERSONAL',
    notes: ''
  });

  useEffect(() => {
    let t: any;
    if (isLaunched && status !== 'READY') {
      t = setInterval(() => setTimer(prev => prev+1), 1000);
    }
    return () => clearInterval(t);
  }, [status, isLaunched]);

  const handleDial = () => {
    setStatus('RINGING');
    setTimer(0);
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
      setSentiment('NEUTRAL');
      setAiSuggestion("Saluda al cliente y confirma si tiene 2 minutos para hablar sobre el ROI del proyecto Diamond.");
      toast('Llamada Conectada: Alexander Pierce', 'success');
    }, 2000);
  };

  const performRealDial = async () => {
    if (!dialNumber) {
      toast('Ingrese un número de destino.', 'error');
      return;
    }
    
    setIsDialing(true);
    try {
      const response = await fetch('/api/telephony/originate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: dialNumber,
          extension: user.extension,
          gateway: selectedGateway || null
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        toast('Llamada originada. Su extensión debería sonar.', 'success', 'FreeSwitch ESL');
        setStatus('RINGING');
        setTimer(0);
        setIsDialerOpen(false);
        // Simular que contesta el agente y luego el destino
        setTimeout(() => {
          setStatus('INCALL');
          setCurrentLead({
            id: 'MANUAL',
            name: 'Llamada Manual',
            phone: dialNumber,
            city: 'Manual',
            address: 'Manual',
            script: 'Llamada manual en curso...'
          });
        }, 3000);
      } else {
        toast(data.error || 'Error al originar llamada.', 'error');
      }
    } catch (error) {
      toast('Error de red al conectar con el servidor.', 'error');
    } finally {
      setIsDialing(false);
    }
  };

  const handleAiConsult = async (context: string) => {
    if (!currentLead || isAiThinking) return;
    setIsAiThinking(true);
    setActiveTab('AI_ASSIST');

    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API Key not found in environment.");
      }
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Actúa como un coach de ventas experto para un agente de call center. 
      Lead: ${currentLead.name} de ${currentLead.city}. 
      Contexto de la llamada: ${context}. 
      Notas actuales: ${notes}.
      Genera una recomendación táctica corta (máximo 2 párrafos) para cerrar la venta o manejar la objeción.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const text = response.text;
      setAiSuggestion(text || "No se pudo generar una sugerencia.");
      // Simular cambio de sentimiento basado en el texto (lógica simplificada para demo)
      if (context.toLowerCase().includes('precio') || context.toLowerCase().includes('caro')) setSentiment('NEGATIVE');
      else if (context.toLowerCase().includes('gracias') || context.toLowerCase().includes('interesado')) setSentiment('POSITIVE');
      
      toast('Neural Copilot: Nueva sugerencia táctica.', 'info', 'AI Assistant');
    } catch (error: any) {
      console.error("AI Assistant Error:", error);
      toast(error.message || 'Error al consultar el cerebro IA.', 'error');
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleScheduleCallback = async () => {
    if (!callbackData.date || !callbackData.time) {
      toast('Debe especificar fecha y hora.', 'error');
      return;
    }
    setIsScheduling(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsScheduling(false);
    setIsCallbackModalOpen(false);
    toast(`Callback agendado para el ${callbackData.date} a las ${callbackData.time}.`, 'success', 'Hopper Injected');
    setStatus('WRAPUP');
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
               <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Nexus Blended Core v4.8 • AI Enhanced</p>
            </div>
            <div className="grid grid-cols-2 gap-6 w-full max-w-md">
               <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl text-center group hover:border-blue-500/30 transition-all">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Campaña Activa</p>
                  <p className="text-white font-black uppercase">Real Estate Florida</p>
               </div>
               <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl text-center group hover:border-emerald-500/30 transition-all">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Extensión SIP</p>
                  <p className="text-blue-400 font-mono font-black">{user.extension}</p>
               </div>
            </div>
            <button onClick={() => setIsLaunched(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-20 py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all group">
               <span className="flex items-center space-x-3">
                 <Zap size={20} className="group-hover:animate-pulse" />
                 <span>Entrar en Línea</span>
               </span>
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-1000">
      
      {/* 1. HUD DE CONTROL SUPERIOR */}
      <div className={`glass rounded-[48px] border-2 p-6 flex items-center justify-between shadow-2xl transition-all duration-700 ${status === 'INCALL' ? (sentiment === 'POSITIVE' ? 'border-emerald-500/40 bg-emerald-500/5' : sentiment === 'NEGATIVE' ? 'border-rose-500/40 bg-rose-500/5' : 'border-blue-500/40 bg-blue-500/5') : 'border-slate-800'}`}>
         <div className="flex items-center space-x-8">
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-2xl transition-all duration-500 ${status === 'INCALL' ? (sentiment === 'POSITIVE' ? 'bg-emerald-500' : sentiment === 'NEGATIVE' ? 'bg-rose-500' : 'bg-blue-600') : status === 'PAUSED' ? 'bg-amber-500' : 'bg-slate-800'}`}>
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
                  {status === 'INCALL' && (
                    <div className={`px-4 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest animate-in fade-in ${sentiment === 'POSITIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : sentiment === 'NEGATIVE' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
                      Sentimiento: {sentiment}
                    </div>
                  )}
               </div>
            </div>
         </div>

         <div className="flex items-center space-x-4">
            {status === 'READY' ? (
               <div className="flex items-center space-x-2">
                  <button onClick={() => setIsDialerOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center">
                    <Smartphone size={16} className="mr-2" /> Dial Real
                  </button>
                  <button onClick={handleDial} className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-xl">Simular Dial</button>
               </div>
            ) : (
               <button onClick={() => { setStatus('READY'); setCurrentLead(null); setTimer(0); setAiSuggestion(""); }} className="bg-rose-600 hover:bg-rose-500 text-white px-10 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-xl">Colgar / Terminar</button>
            )}
            <button onClick={() => setStatus('PAUSED')} className="p-4 bg-slate-800 hover:bg-amber-600 text-slate-400 hover:text-white rounded-2xl transition-all shadow-lg"><Pause size={20} /></button>
            <button onClick={() => setIsLaunched(false)} className="p-4 bg-slate-900 hover:bg-rose-600 text-slate-500 hover:text-white rounded-2xl transition-all shadow-lg"><Power size={20} /></button>
         </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
         {/* 2. AREA DE GESTIÓN (CRM & SCRIPT & AI) */}
         <div className="col-span-12 lg:col-span-8 flex flex-col space-y-6 min-h-0">
            <div className="glass flex-1 rounded-[56px] border border-slate-800 flex flex-col overflow-hidden shadow-2xl">
               <div className="bg-slate-900/60 p-4 flex space-x-2 border-b border-slate-800 shrink-0">
                  <button onClick={() => setActiveTab('CRM')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center ${activeTab === 'CRM' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                    <User size={14} className="mr-2" /> Expediente
                  </button>
                  <button onClick={() => setActiveTab('SCRIPT')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center ${activeTab === 'SCRIPT' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                    <FileText size={14} className="mr-2" /> Guion de Venta
                  </button>
                  <button onClick={() => setActiveTab('AI_ASSIST')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center ${activeTab === 'AI_ASSIST' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                    <BrainCircuit size={14} className="mr-2" /> Neural Copilot
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
                  {activeTab === 'CRM' && currentLead && (
                    <div className="space-y-10 animate-in fade-in duration-500">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-8">
                             <div className="w-24 h-24 rounded-[40px] bg-slate-800 flex items-center justify-center text-4xl font-black text-blue-400 border-4 border-slate-700 shadow-inner">
                                {currentLead.name.charAt(0)}
                             </div>
                             <div>
                                <h4 className="text-4xl font-black text-white uppercase tracking-tighter">{currentLead.name}</h4>
                                <p className="text-xl font-mono text-slate-500 mt-1">{currentLead.phone}</p>
                             </div>
                          </div>
                          <div className="p-6 bg-blue-600/5 border border-blue-500/20 rounded-[32px] text-right">
                             <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Score de Propensión</p>
                             <p className="text-3xl font-black text-white">88%</p>
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">Ubicación</label>
                             <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-3xl flex items-center group hover:border-blue-500/30 transition-all">
                                <MapPin size={18} className="mr-4 text-blue-500" />
                                <span className="text-sm font-bold text-white uppercase">{currentLead.city}</span>
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">Dirección</label>
                             <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-3xl flex items-center group hover:border-emerald-500/30 transition-all">
                                <Info size={18} className="mr-4 text-emerald-500" />
                                <span className="text-sm font-bold text-white uppercase">{currentLead.address}</span>
                             </div>
                          </div>
                       </div>

                       <div className="p-8 bg-slate-900 border border-slate-800 rounded-[40px] space-y-4 shadow-inner group focus-within:border-blue-500/40 transition-all">
                          <div className="flex justify-between items-center">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center"><MessageSquare size={14} className="mr-2" /> Notas de Gestión</label>
                             <button 
                               onClick={() => handleAiConsult('Analizar notas actuales para recomendación')}
                               className="text-[9px] font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest flex items-center"
                             >
                               <Sparkles size={12} className="mr-1.5" /> Analizar con IA
                             </button>
                          </div>
                          <textarea 
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            className="w-full h-32 bg-transparent border-none outline-none text-slate-300 resize-none font-medium leading-relaxed" 
                            placeholder="Registra detalles importantes aquí... El Copilot analizará estas notas en tiempo real." 
                          />
                       </div>
                    </div>
                  )}

                  {activeTab === 'SCRIPT' && currentLead && (
                    <div className="animate-in slide-in-from-right-4 duration-500">
                       <div className="p-10 glass rounded-[48px] border border-blue-500/20 bg-blue-600/5 relative overflow-hidden group shadow-inner">
                          <Quote size={80} className="absolute -top-4 -right-4 text-blue-500/10 group-hover:scale-110 transition-transform" />
                          <div className="relative z-10 text-xl text-slate-200 leading-relaxed font-medium space-y-6">
                             {renderScript(currentLead.script).split('\n').map((para: string, i: number) => (
                               <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<b class="text-blue-400">$1</b>') }} />
                             ))}
                          </div>
                       </div>
                    </div>
                  )}

                  {activeTab === 'AI_ASSIST' && currentLead && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                             <div className="p-3 bg-purple-600/10 rounded-2xl text-purple-400 border border-purple-500/20">
                                <BrainCircuit size={28} />
                             </div>
                             <div>
                                <h4 className="text-xl font-black text-white uppercase tracking-tight">Nexus Neural Copilot</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Asistencia Cognitiva v4.8</p>
                             </div>
                          </div>
                          {isAiThinking && <RefreshCw size={20} className="animate-spin text-purple-400" />}
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                             <h5 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Manejo de Objeciones</h5>
                             <div className="grid grid-cols-1 gap-3">
                                {[
                                  { label: 'El precio es muy alto', context: 'Objeción de costo/precio' },
                                  { label: 'Ya tengo otro proveedor', context: 'Competencia activa' },
                                  { label: 'No tengo tiempo ahora', context: 'Falta de urgencia' },
                                  { label: 'Debo consultarlo', context: 'Toma de decisión postergada' },
                                ].map((obj, i) => (
                                  <button 
                                    key={i}
                                    onClick={() => handleAiConsult(obj.context)}
                                    className="p-5 bg-slate-900 border border-slate-800 rounded-3xl text-left hover:border-purple-500/50 hover:bg-purple-600/5 transition-all group flex items-center justify-between"
                                  >
                                     <span className="text-xs font-black text-slate-300 group-hover:text-white uppercase tracking-tight">{obj.label}</span>
                                     <ChevronRight size={16} className="text-slate-700 group-hover:text-purple-400" />
                                  </button>
                                ))}
                             </div>
                          </div>

                          <div className="space-y-6">
                             <h5 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Sugerencia Actual</h5>
                             <div className="p-8 bg-purple-600/10 border-2 border-purple-500/20 rounded-[40px] relative overflow-hidden min-h-[300px] flex flex-col shadow-inner">
                                <Sparkles size={100} className="absolute -bottom-10 -right-10 text-purple-500/5" />
                                {aiSuggestion ? (
                                  <div className="relative z-10 space-y-6">
                                     <p className="text-base text-slate-200 font-medium leading-relaxed italic">
                                        "{aiSuggestion}"
                                     </p>
                                     <button 
                                      onClick={() => { setNotes(prev => prev + (prev ? "\n" : "") + "[IA Suggestion]: " + aiSuggestion); toast('Copiado a notas.', 'success'); }}
                                      className="flex items-center space-x-2 text-[10px] font-black text-purple-400 uppercase tracking-widest hover:text-purple-300 transition-colors"
                                     >
                                        <Copy size={12} />
                                        <span>Usar en Notas</span>
                                     </button>
                                  </div>
                                ) : (
                                  <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-center space-y-4">
                                     <Lightbulb size={48} />
                                     <p className="text-xs font-black uppercase tracking-widest">Esperando interacción para sugerir táctica...</p>
                                  </div>
                                )}
                             </div>
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
            <div className="glass p-8 rounded-[48px] border border-slate-800 flex flex-col space-y-6 shrink-0 shadow-xl">
               <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center"><ListChecks size={16} className="mr-2 text-blue-500" /> Tipificar</h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Ready to Save</span>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto scrollbar-hide pr-1">
                  {MOCK_CALL_CODES.map(code => (
                    <button 
                      key={code.id}
                      onClick={() => { setStatus('WRAPUP'); setCurrentLead(null); setAiSuggestion(""); toast(`Tipificación guardada: ${code.name}`, 'success'); }}
                      className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-tighter text-white hover:border-blue-500/50 hover:bg-blue-600/5 transition-all active:scale-95 group text-center shadow-inner"
                    >
                       <div className={`w-2 h-2 rounded-full mx-auto mb-2 ${code.isSale ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-slate-700'}`}></div>
                       {code.name}
                    </button>
                  ))}
               </div>
            </div>

            {/* CONTROLES DE TELEFONÍA AVANZADA */}
            <div className="glass flex-1 rounded-[48px] border border-slate-800 p-8 flex flex-col space-y-8 bg-gradient-to-br from-[#0f172a] to-black relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 p-8 opacity-5 text-blue-400 pointer-events-none"><Signal size={120} /></div>
               
               <div className="grid grid-cols-2 gap-4 relative z-10">
                  <button onClick={() => setIsMuted(!isMuted)} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center justify-center space-y-2 shadow-xl ${isMuted ? 'bg-rose-600/20 border-rose-500 text-rose-500' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white hover:border-blue-500/30'}`}>
                     {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                     <span className="text-[8px] font-black uppercase">Silencio</span>
                  </button>
                  <button className="p-6 rounded-3xl border-2 bg-slate-900 border-slate-800 text-slate-500 hover:text-blue-400 hover:border-blue-500/40 transition-all flex flex-col items-center justify-center space-y-2 shadow-xl">
                     <VolumeX size={24} />
                     <span className="text-[8px] font-black uppercase">Espera</span>
                  </button>
                  <button className="p-6 rounded-3xl border-2 bg-slate-900 border-slate-800 text-slate-500 hover:text-blue-400 hover:border-blue-500/40 transition-all flex flex-col items-center justify-center space-y-2 shadow-xl">
                     <ArrowRightLeft size={24} />
                     <span className="text-[8px] font-black uppercase">Transferir</span>
                  </button>
                  <button className="p-6 rounded-3xl border-2 bg-slate-900 border-slate-800 text-slate-500 hover:text-blue-400 hover:border-blue-500/40 transition-all flex flex-col items-center justify-center space-y-2 shadow-xl">
                     <Users2 size={24} />
                     <span className="text-[8px] font-black uppercase">Conferencia</span>
                  </button>
               </div>

               <div className="space-y-4 pt-4 relative z-10">
                  <button 
                    onClick={() => setIsCallbackModalOpen(true)}
                    className="w-full py-5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center space-x-3 text-blue-400 hover:text-blue-300 hover:bg-slate-900 transition-all active:scale-95 group shadow-xl"
                  >
                     <Clock size={16} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Programar Callback</span>
                  </button>
                  
                  {/* AI Quick Analysis Shortcut */}
                  <button 
                    onClick={() => handleAiConsult('Analizar audio y detectar compromiso de pago')}
                    className="w-full py-5 bg-purple-600/10 border border-purple-500/30 rounded-2xl flex items-center justify-center space-x-3 text-purple-400 hover:bg-purple-600/20 transition-all active:scale-95 group shadow-xl"
                  >
                     <Sparkles size={16} className="animate-pulse" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Extract AI Commit</span>
                  </button>
               </div>

               <div className="mt-auto pt-6 border-t border-slate-800/50 flex items-center justify-between relative z-10">
                  <div className="flex items-center space-x-2">
                     <Wifi size={14} className="text-emerald-500" />
                     <span className="text-[8px] font-black text-slate-500 uppercase">Jitter: 0.02ms</span>
                  </div>
                  <div className="flex items-center space-x-2">
                     <ShieldCheck size={14} className="text-blue-500" />
                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">L7 Encrypted</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* MODAL DE DIALER MANUAL REAL */}
      {isDialerOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="relative w-full max-w-md glass rounded-[64px] border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
              <div className="p-10 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
                 <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                       <Smartphone size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-white uppercase tracking-tighter">Manual Dialer</h3>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Llamada Real vía ESL</p>
                    </div>
                 </div>
                 <button onClick={() => setIsDialerOpen(false)} className="p-3 bg-slate-800 hover:bg-rose-500/10 rounded-xl text-slate-400 hover:text-rose-500 transition-all"><X size={20} /></button>
              </div>

              <div className="p-10 space-y-8">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Número de Destino</label>
                    <div className="relative">
                       <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
                       <input 
                         type="text" 
                         value={dialNumber}
                         onChange={e => setDialNumber(e.target.value)}
                         className="w-full bg-slate-950 border-2 border-slate-800 rounded-[28px] pl-16 pr-8 py-5 text-xl text-white font-mono font-black outline-none focus:border-blue-500 shadow-inner" 
                         placeholder="Ej: 13055550122" 
                       />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Gateway SIP (Opcional)</label>
                    <div className="relative">
                       <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                       <select 
                         value={selectedGateway}
                         onChange={e => setSelectedGateway(e.target.value)}
                         className="w-full bg-slate-950 border-2 border-slate-800 rounded-[28px] pl-16 pr-8 py-5 text-sm text-white font-bold outline-none focus:border-blue-500 shadow-inner appearance-none"
                       >
                          <option value="">Llamada Interna / Eco</option>
                          {MOCK_TRUNKS.map(t => (
                            <option key={t.id} value={t.name}>{t.name}</option>
                          ))}
                       </select>
                    </div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase italic px-2">
                       * Si no selecciona gateway, se realizará una prueba de eco a su extensión.
                    </p>
                 </div>

                 <button 
                   onClick={performRealDial}
                   disabled={isDialing}
                   className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.4em] shadow-xl shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center space-x-4 disabled:opacity-50"
                 >
                    {isDialing ? <RefreshCw className="animate-spin" size={20} /> : <Phone size={20} />}
                    <span>{isDialing ? 'Originando...' : 'Llamar Ahora'}</span>
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* MODAL DE PROGRAMACIÓN DE CALLBACK */}
      {isCallbackModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="relative w-full max-w-xl glass rounded-[64px] border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
              
              {isScheduling && (
                 <div className="absolute inset-0 z-[210] bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center space-y-6 text-center p-10">
                    <RefreshCw className="text-blue-500 animate-spin" size={48} />
                    <h3 className="text-2xl font-black text-white uppercase tracking-[0.2em]">Programando Re-contacto</h3>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Escribiendo en el plano de control...</p>
                 </div>
              )}

              <div className="p-10 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between shrink-0 shadow-lg">
                 <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 rounded-[24px] bg-blue-600/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-inner">
                       <Clock size={32} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Scheduled Callback</h3>
                       <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Aprovisionamiento de Rellamada</p>
                    </div>
                 </div>
                 <button onClick={() => setIsCallbackModalOpen(false)} className="p-4 bg-slate-800 hover:bg-rose-500/10 rounded-[20px] text-slate-400 hover:text-rose-500 transition-all border border-slate-700 shadow-xl"><X size={24} /></button>
              </div>

              <div className="p-12 space-y-10">
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Fecha</label>
                       <div className="relative">
                          <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                          <input 
                            type="date" 
                            value={callbackData.date}
                            onChange={e => setCallbackData({...callbackData, date: e.target.value})}
                            className="w-full bg-slate-950 border-2 border-slate-800 rounded-[28px] pl-16 pr-6 py-5 text-xs text-white font-bold outline-none focus:border-blue-500 shadow-inner appearance-none" 
                          />
                       </div>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Hora (UTC)</label>
                       <div className="relative">
                          <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                          <input 
                            type="time" 
                            value={callbackData.time}
                            onChange={e => setCallbackData({...callbackData, time: e.target.value})}
                            className="w-full bg-slate-950 border-2 border-slate-800 rounded-[28px] pl-16 pr-8 py-5 text-xs text-white font-bold outline-none focus:border-blue-500 shadow-inner appearance-none" 
                          />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Propiedad de la Llamada</label>
                    <div className="grid grid-cols-2 gap-4 p-2 bg-slate-950 border border-slate-800 rounded-[32px] shadow-inner">
                       <button 
                         onClick={() => setCallbackData({...callbackData, type: 'PERSONAL'})}
                         className={`py-4 rounded-[24px] text-[9px] font-black uppercase tracking-widest transition-all ${callbackData.type === 'PERSONAL' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-600 hover:text-slate-400'}`}
                       >
                          Sólo yo (User Specific)
                       </button>
                       <button 
                         onClick={() => setCallbackData({...callbackData, type: 'ANY_AGENT'})}
                         className={`py-4 rounded-[24px] text-[9px] font-black uppercase tracking-widest transition-all ${callbackData.type === 'ANY_AGENT' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-600 hover:text-slate-400'}`}
                       >
                          Cualquier Agente
                       </button>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Notas de Seguimiento</label>
                    <textarea 
                      value={callbackData.notes}
                      onChange={e => setCallbackData({...callbackData, notes: e.target.value})}
                      className="w-full h-32 bg-slate-950 border-2 border-slate-800 rounded-[32px] p-8 text-sm text-slate-300 font-medium outline-none focus:border-blue-500 shadow-inner leading-relaxed resize-none"
                      placeholder="Indique puntos clave para la rellamada..."
                    />
                 </div>
              </div>

              <div className="p-10 bg-slate-900/60 border-t border-slate-800 flex justify-end items-center space-x-6">
                 <div className="flex items-center space-x-3 text-[10px] font-black text-slate-500 uppercase tracking-widest italic opacity-60">
                    <ShieldCheck size={18} className="text-emerald-500" />
                    <span>Inyección en Hopper v4.8</span>
                 </div>
                 <button 
                   onClick={handleScheduleCallback}
                   disabled={isScheduling}
                   className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-5 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-600/30 transition-all active:scale-95 flex items-center space-x-4 group"
                 >
                    <CheckIcon size={20} className="group-hover:scale-110 transition-transform" />
                    <span>Confirmar Agenda</span>
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AgentScreen;

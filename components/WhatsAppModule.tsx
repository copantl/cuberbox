
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MessageCircle, Search, Send, MoreVertical, CheckCheck, 
  Paperclip, Smile, Phone, Info, Music, 
  LayoutGrid, Filter, Settings, ShieldCheck,
  Zap, Bot, Smartphone, Globe, Plus, Trash2, Clock,
  CheckCircle2, RefreshCw, Layers, MessageSquare, 
  X, Network, Share2, ChevronRight, ExternalLink, 
  Shield, Wand2, Sparkles, User, Hash, Facebook, Instagram,
  BrainCircuit, TrendingUp, TrendingDown, Brain as BrainIcon,
  Quote, Headphones, UserCheck, Eye, EyeOff, Radio, AlertCircle,
  // Fix: Added missing Activity icon import
  Activity
} from 'lucide-react';
import { WhatsAppConversation, WhatsAppMessage, ChannelType, InteractionStatus } from '../types';
import { useToast } from '../ToastContext';
import { GoogleGenAI } from "@google/genai";

const MOCK_INTERACTIONS: WhatsAppConversation[] = [
  {
    id: 'c_1',
    channel: 'WHATSAPP',
    status: 'ASSIGNED',
    agentId: 'usr_1',
    contactName: 'Alexander Pierce',
    sentiment: 'POSITIVE',
    lastActivity: '14:02',
    messages: [
      { id: 'm_1', text: 'Hola, vi su anuncio en TikTok sobre el proyecto en Florida.', sender: 'CUSTOMER', timestamp: '14:02' },
      { id: 'm_2', text: '¡Hola Alexander! Con gusto te ayudo. ¿Qué unidad te interesó?', sender: 'AGENT', timestamp: '14:05' },
      { id: 'm_3', text: 'La de 2 habitaciones frente al mar. ¿Tienen planes de financiamiento?', sender: 'CUSTOMER', timestamp: '14:10' },
    ]
  },
  {
    id: 'c_2',
    channel: 'TIKTOK',
    status: 'QUEUE',
    contactName: 'Elena Gilbert',
    sentiment: 'NEUTRAL',
    lastActivity: '09:45',
    messages: [
      { id: 'm_4', text: '¿Podrían enviarme el brochure actualizado? Vi el video de la mansión en Brickell.', sender: 'CUSTOMER', timestamp: '09:45' },
    ]
  },
  {
    id: 'c_3',
    channel: 'FACEBOOK',
    status: 'ASSIGNED',
    agentId: 'usr_2',
    contactName: 'John Wick',
    sentiment: 'NEGATIVE',
    lastActivity: 'Ayer',
    messages: [
      { id: 'm_5', text: 'Nadie me ha llamado para mi cita de ayer. Pésimo seguimiento.', sender: 'CUSTOMER', timestamp: 'Ayer' },
    ]
  },
  {
    id: 'c_4',
    channel: 'INSTAGRAM',
    status: 'QUEUE',
    contactName: 'Selina Kyle',
    sentiment: 'POSITIVE',
    lastActivity: '10:15',
    messages: [
      { id: 'm_6', text: 'Me encanta el diseño de las cocinas en el proyecto Diamond. ¿Precio base?', sender: 'CUSTOMER', timestamp: '10:15' },
    ]
  }
];

const WhatsAppModule: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'MY_CHATS' | 'QUEUE' | 'SUPERVISOR'>('MY_CHATS');
  const [activeChannel, setActiveChannel] = useState<ChannelType | 'ALL'>('ALL');
  const [conversations, setConversations] = useState<WhatsAppConversation[]>(MOCK_INTERACTIONS);
  const [activeConvId, setActiveConvId] = useState<string | null>(MOCK_INTERACTIONS[0].id);
  const [inputText, setInputText] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSupervisorMode, setIsSupervisorMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeConv = useMemo(() => 
    conversations.find(c => c.id === activeConvId)
  , [conversations, activeConvId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeConv?.messages]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeConvId) return;
    const newMessage: WhatsAppMessage = {
      id: `m_${Date.now()}`,
      text: inputText,
      sender: 'AGENT',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(prev => prev.map(c => 
      c.id === activeConvId ? { ...c, messages: [...c.messages, newMessage], lastActivity: 'Ahora' } : c
    ));
    setInputText("");
    toast(`Mensaje enviado vía ${activeConv?.channel}.`, 'success');
  };

  const handleClaimChat = (id: string) => {
    setConversations(prev => prev.map(c => 
      c.id === id ? { ...c, status: 'ASSIGNED', agentId: 'usr_1' } : c
    ));
    setActiveConvId(id);
    setActiveTab('MY_CHATS');
    toast('Has tomado el control de esta conversación.', 'success', 'Chat Reclamado');
  };

  const handleAiSuggest = async () => {
    if (!activeConv || isAiThinking) return;
    setIsAiThinking(true);
    
    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey) {
        toast('API Key no configurada.', 'error');
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      const historyText = activeConv.messages.map(m => `${m.sender}: ${m.text}`).join('\n');
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Eres un agente experto de CUBERBOX en el canal ${activeConv.channel}. 
        Historial:\n${historyText}\n
        Genera la siguiente respuesta profesional, corta y persuasiva.`,
      });

      const suggestion = response.text || "No se pudo generar respuesta.";
      setInputText(suggestion);
      toast('Neural Sugerencia cargada.', 'info');
    } catch (error) {
      console.error('AI Error:', error);
      toast('Falla en el motor Gemini.', 'error');
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleSummarize = async () => {
    if (!activeConv || isSummarizing) return;
    setIsSummarizing(true);
    
    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey) {
        toast('API Key no configurada.', 'error');
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      const historyText = activeConv.messages.map(m => `${m.sender}: ${m.text}`).join('\n');
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Resume esta conversación en un párrafo ejecutivo enfocado en cierres:\n${historyText}`,
      });

      const summary = response.text || "Resumen fallido.";
      setConversations(prev => prev.map(c => 
        c.id === activeConvId ? { ...c, summary } : c
      ));
      toast('Resumen de hilo generado.', 'success');
    } catch (error) {
      console.error('AI Error:', error);
      toast('Error al procesar resumen.', 'error');
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleResolveChat = (id: string) => {
    setConversations(prev => prev.map(c => 
      c.id === id ? { ...c, status: 'RESOLVED' } : c
    ));
    setActiveConvId(null);
    toast('Conversación marcada como resuelta.', 'success', 'Interacción Cerrada');
  };

  const handleQuickReply = (text: string) => {
    setInputText(text);
    toast('Respuesta rápida cargada.', 'info');
  };

  const getChannelStyle = (channel: ChannelType) => {
    switch (channel) {
      case 'WHATSAPP': return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: MessageCircle, label: 'WhatsApp Official' };
      case 'TIKTOK': return { color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/30', icon: Music, label: 'TikTok Lead' };
      case 'FACEBOOK': return { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: Facebook, label: 'Messenger App' };
      case 'INSTAGRAM': return { color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/30', icon: Instagram, label: 'Direct Message' };
      default: return { color: 'text-slate-400', bg: 'bg-slate-800', border: 'border-slate-700', icon: MessageSquare, label: 'Global Channel' };
    }
  };

  const filteredList = useMemo(() => {
    return conversations.filter(c => {
      const matchChannel = activeChannel === 'ALL' || c.channel === activeChannel;
      if (activeTab === 'MY_CHATS') return matchChannel && c.status === 'ASSIGNED' && c.agentId === 'usr_1';
      if (activeTab === 'QUEUE') return matchChannel && c.status === 'QUEUE';
      if (activeTab === 'SUPERVISOR') return matchChannel;
      return false;
    });
  }, [conversations, activeTab, activeChannel]);

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-6 animate-in fade-in duration-700 pb-10">
      
      {/* HUD de Control Omnicanal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
        <div className="flex items-center space-x-5">
           <div className={`p-4 rounded-[24px] bg-blue-600 text-white shadow-2xl shadow-blue-600/20 animate-glow`}>
              <Share2 size={28} />
           </div>
           <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Omnicanal Intelligence Hub</h2>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">Sincronización Neuronal Multi-Agente</p>
           </div>
        </div>

        <div className="flex bg-slate-900 border-2 border-slate-800 p-1.5 rounded-[24px] shadow-inner overflow-x-auto scrollbar-hide">
           {[
             { id: 'MY_CHATS', label: 'Mis Chats', icon: UserCheck },
             { id: 'QUEUE', label: 'Cola Global', icon: Radio },
             { id: 'SUPERVISOR', label: 'Monitoreo GTR', icon: Eye },
           ].map(tab => (
             <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
             >
                <tab.icon size={14} />
                <span>{tab.label}</span>
             </button>
           ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 flex glass rounded-[56px] border border-slate-700/50 overflow-hidden shadow-2xl">
         
         {/* Sidebar: Chat Selection */}
         <div className="w-96 border-r border-slate-800 flex flex-col bg-slate-950/40">
            <div className="p-8 space-y-6">
               <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center">
                     <Layers size={20} className="mr-3 text-blue-500" /> 
                     {activeTab === 'QUEUE' ? 'Inbound Stream' : 'Active Sessions'}
                  </h3>
                  <div className="px-3 py-1 bg-slate-900 rounded-full text-[9px] font-black text-blue-400 border border-slate-800">
                    {filteredList.length} leads
                  </div>
               </div>
               
               <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                  {['ALL', 'WHATSAPP', 'TIKTOK', 'FACEBOOK'].map(c => (
                    <button 
                      key={c} 
                      onClick={() => setActiveChannel(c as any)}
                      className={`flex-1 py-1.5 text-[8px] font-black uppercase tracking-tighter rounded-lg transition-all ${activeChannel === c ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
                    >
                      {c.slice(0,3)}
                    </button>
                  ))}
               </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide px-4 space-y-3 pb-10">
               {filteredList.map(c => {
                 const style = getChannelStyle(c.channel);
                 return (
                   <button 
                    key={c.id} 
                    onClick={() => { setActiveConvId(c.id); }}
                    className={`w-full flex items-center p-5 rounded-[32px] transition-all group relative ${activeConvId === c.id ? 'bg-blue-600 shadow-xl' : 'hover:bg-slate-800/40 border border-transparent hover:border-slate-800'}`}
                   >
                      <div className="relative">
                        <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center text-xl font-black mr-4 shadow-lg ${activeConvId === c.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-blue-400 border border-slate-700'}`}>
                           {c.contactName.charAt(0)}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-lg border-2 border-[#0f172a] shadow-xl ${activeConvId === c.id ? 'bg-white text-blue-600' : `${style.bg} ${style.color} ${style.border}`}`}>
                           <style.icon size={12} />
                        </div>
                      </div>
                      <div className="flex-1 text-left min-w-0">
                         <div className="flex justify-between items-center mb-1">
                            <span className={`text-xs font-black uppercase truncate ${activeConvId === c.id ? 'text-white' : 'text-slate-200'}`}>{c.contactName}</span>
                            <span className={`text-[8px] font-bold ${activeConvId === c.id ? 'text-blue-100' : 'text-slate-500'}`}>{c.lastActivity}</span>
                         </div>
                         <p className={`text-[10px] truncate ${activeConvId === c.id ? 'text-blue-100 font-medium' : 'text-slate-500'}`}>
                            {c.messages[c.messages.length-1].text}
                         </p>
                      </div>
                      {c.status === 'QUEUE' && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_#f43f5e]"></div>}
                   </button>
                 );
               })}
               {filteredList.length === 0 && (
                 <div className="py-20 text-center opacity-20">
                    <AlertCircle size={40} className="mx-auto mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Sin tráfico en este segmento</p>
                 </div>
               )}
            </div>
         </div>

         {/* Chat Workspace */}
         <div className="flex-1 flex flex-col bg-black/10">
            {activeConv ? (
              <>
                {/* Chat Header */}
                <div className="p-8 border-b border-slate-800/60 bg-slate-900/40 flex items-center justify-between">
                   <div className="flex items-center space-x-6">
                      <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-white text-2xl font-black shadow-2xl ${getChannelStyle(activeConv.channel).bg} ${getChannelStyle(activeConv.channel).color}`}>
                         {activeConv.contactName.charAt(0)}
                      </div>
                      <div>
                         <div className="flex items-center space-x-3">
                            <h4 className="text-2xl font-black text-white uppercase tracking-tight">{activeConv.contactName}</h4>
                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter ${getChannelStyle(activeConv.channel).bg} ${getChannelStyle(activeConv.channel).color} border ${getChannelStyle(activeConv.channel).border}`}>
                              {getChannelStyle(activeConv.channel).label}
                            </span>
                         </div>
                         <div className="flex items-center space-x-4 mt-1.5">
                            <div className="flex items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                               {activeConv.sentiment === 'POSITIVE' ? <TrendingUp size={14} className="text-emerald-500 mr-2" /> : activeConv.sentiment === 'NEGATIVE' ? <TrendingDown size={14} className="text-rose-500 mr-2" /> : <Activity size={14} className="text-blue-400 mr-2" />}
                               Sentiment: <span className="ml-1 text-slate-300">{activeConv.sentiment}</span>
                            </div>
                            <div className="h-3 w-px bg-slate-800"></div>
                            <div className="flex items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                               <Clock size={14} className="mr-2 text-indigo-500" />
                               SLA: <span className="ml-1 text-emerald-400">00:14s</span>
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center space-x-3">
                      {activeConv.status === 'QUEUE' ? (
                        <button 
                          onClick={() => handleClaimChat(activeConv.id)}
                          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center space-x-3"
                        >
                           <Zap size={16} fill="currentColor" />
                           <span>Atender Ahora</span>
                        </button>
                      ) : (
                        <>
                          <button 
                            onClick={handleSummarize}
                            disabled={isSummarizing}
                            className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-blue-400 hover:text-white transition-all shadow-lg active:scale-95 group"
                            title="Generar Resumen de Traspaso"
                          >
                             <BrainIcon size={22} className={isSummarizing ? 'animate-spin' : 'group-hover:scale-110'} />
                          </button>
                          <button 
                            onClick={() => toast('Iniciando llamada de voz...', 'info')}
                            className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all shadow-lg"
                          >
                            <Phone size={22} />
                          </button>
                          <button 
                            onClick={() => toast('Opciones adicionales de canal', 'info')}
                            className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all shadow-lg"
                          >
                            <MoreVertical size={22} />
                          </button>
                        </>
                      )}
                   </div>
                </div>

                <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-8 scrollbar-hide bg-[radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.03),_transparent)]">
                   {activeConv.summary && (
                     <div className="animate-in slide-in-from-top-4 duration-500 mb-10">
                        <div className="p-8 bg-blue-600/5 border-2 border-blue-500/20 rounded-[40px] relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-6 opacity-5 text-blue-400 group-hover:scale-110 transition-transform">
                              <BrainCircuit size={100} />
                           </div>
                           <div className="flex items-center space-x-3 mb-4">
                              <Sparkles size={16} className="text-blue-400" />
                              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Resumen de Hilo (Nexus AI)</span>
                           </div>
                           <p className="text-sm text-slate-300 font-medium leading-relaxed italic relative z-10">
                              "{activeConv.summary}"
                           </p>
                        </div>
                     </div>
                   )}

                   {activeConv.messages.map(m => (
                     <div key={m.id} className={`flex ${m.sender === 'AGENT' ? 'justify-end' : m.sender === 'SYSTEM' ? 'justify-center' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                        {m.sender === 'SYSTEM' ? (
                          <div className="bg-slate-900/40 border border-slate-800 px-6 py-2 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">
                            {m.text}
                          </div>
                        ) : (
                          <div className={`max-w-[70%] p-8 rounded-[40px] text-sm relative shadow-2xl transition-all ${m.sender === 'AGENT' ? 'bg-blue-600 text-white rounded-tr-none' : 'glass border-slate-700 text-slate-200 rounded-tl-none'}`}>
                             <p className="font-medium leading-relaxed text-base">{m.text}</p>
                             <div className={`text-[9px] mt-4 font-black uppercase tracking-widest flex items-center justify-end space-x-3 ${m.sender === 'AGENT' ? 'text-blue-100 opacity-60' : 'text-slate-500'}`}>
                                <span>{m.timestamp}</span>
                                {m.sender === 'AGENT' && <CheckCheck size={14} />}
                             </div>
                          </div>
                        )}
                     </div>
                   ))}
                   
                   {isAiThinking && (
                     <div className="flex justify-start animate-in slide-in-from-left-4">
                        <div className="glass border-blue-500/30 p-6 rounded-[32px] rounded-tl-none flex items-center space-x-4 bg-blue-600/5">
                           <RefreshCw size={20} className="text-blue-400 animate-spin" />
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inferencia Gemini Pro 3...</span>
                        </div>
                     </div>
                   )}
                </div>

                {/* Input Area */}
                {activeConv.status === 'ASSIGNED' && (
                  <div className="p-10 bg-slate-900/60 border-t border-slate-800 space-y-6">
                     <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide pb-2">
                        <button 
                          onClick={handleAiSuggest}
                          disabled={isAiThinking}
                          className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all whitespace-nowrap active:scale-95 shadow-xl shadow-blue-600/20 disabled:opacity-50"
                        >
                           <Bot size={18} />
                           <span>Respuesta Inteligente</span>
                        </button>
                        <div className="h-8 w-px bg-slate-800 mx-2"></div>
                        <button 
                          onClick={() => handleQuickReply('¡Hola! Me encantaría agendar una demo personalizada para mostrarte el proyecto. ¿Te parece bien mañana a las 10:00 AM?')}
                          className="bg-slate-950 border border-slate-800 text-slate-400 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-emerald-500/40 hover:text-emerald-400 transition-all whitespace-nowrap"
                        >
                          Agendar Demo
                        </button>
                        <button 
                          onClick={() => handleQuickReply('Claro que sí, te adjunto el brochure digital con todos los detalles técnicos, planos y acabados del desarrollo.')}
                          className="bg-slate-950 border border-slate-800 text-slate-400 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-emerald-500/40 hover:text-emerald-400 transition-all whitespace-nowrap"
                        >
                          Compartir Brochure
                        </button>
                     </div>

                     <div className="flex items-center space-x-5 bg-slate-950 border-2 border-slate-800 rounded-[40px] px-10 py-3 focus-within:border-blue-500/50 transition-all shadow-inner relative group">
                        <button className="text-slate-600 hover:text-blue-400 transition-colors"><Paperclip size={24} /></button>
                        <input 
                          type="text" 
                          value={inputText}
                          onChange={e => setInputText(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                          placeholder={`Escribe una respuesta vía ${activeConv.channel}...`} 
                          className="flex-1 bg-transparent py-6 text-sm text-white outline-none placeholder-slate-800 font-medium"
                        />
                        <button className="text-slate-600 hover:text-amber-400 transition-colors"><Smile size={24} /></button>
                        <button 
                          onClick={handleSendMessage}
                          disabled={!inputText.trim()}
                          className={`p-5 rounded-[22px] transition-all shadow-2xl ${inputText.trim() ? 'bg-blue-600 text-white hover:scale-105 active:scale-95' : 'bg-slate-900 text-slate-800 cursor-not-allowed'}`}
                        >
                           <Send size={24} />
                        </button>
                     </div>

                     <div className="flex items-center justify-between px-4 opacity-60">
                        <div className="flex items-center space-x-6">
                           <div className="flex items-center space-x-2">
                              <ShieldCheck size={14} className="text-emerald-500" />
                              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">PostgreSQL Session Active</span>
                           </div>
                           <div className="flex items-center space-x-2">
                              <Hash size={14} className="text-blue-500" />
                              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Thread ID: {activeConvId}</span>
                           </div>
                        </div>
                     </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-center opacity-30 animate-in fade-in duration-1000">
                 <div className="w-32 h-32 rounded-[48px] bg-slate-900 flex items-center justify-center mb-10 border border-slate-800 shadow-inner">
                    <Share2 size={64} className="text-slate-700" />
                 </div>
                 <h3 className="text-4xl font-black text-white uppercase tracking-[0.2em]">Interacción Unificada</h3>
                 <p className="text-sm text-slate-500 mt-6 max-w-sm font-bold uppercase tracking-widest leading-relaxed">
                    Gestiona leads de todas las redes sociales en una sola interfaz con auditoría Gemini AI en tiempo real.
                 </p>
              </div>
            )}
         </div>

         {/* Right Sidebar: Contact/CRM Context */}
         {activeConv && (
           <div className="w-80 border-l border-slate-800 flex flex-col bg-slate-950/40 p-8 space-y-10 overflow-y-auto scrollbar-hide">
              <div className="text-center space-y-4">
                 <div className="w-24 h-24 rounded-[40px] bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-4xl font-black text-white mx-auto shadow-2xl">
                    {activeConv.contactName.charAt(0)}
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">{activeConv.contactName}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Customer ID: #9281</p>
                 </div>
              </div>

              <div className="space-y-6">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] border-b border-slate-800 pb-3">CRM Insight</h4>
                 <div className="space-y-4">
                    <div className="p-5 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-1">
                       <p className="text-[8px] font-black text-slate-600 uppercase">Interés Principal</p>
                       <p className="text-xs font-black text-white uppercase">Real Estate Florida</p>
                    </div>
                    <div className="p-5 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-1">
                       <p className="text-[8px] font-black text-slate-600 uppercase">Status Comercial</p>
                       <p className="text-xs font-black text-emerald-400 uppercase">Prospecto Calificado</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] border-b border-slate-800 pb-3">Neural Score</h4>
                 <div className="p-6 bg-blue-600/5 border-2 border-blue-500/20 rounded-[36px] flex flex-col items-center">
                    <div className="relative w-32 h-32 mb-4">
                       <svg className="w-full h-full rotate-[-90deg]">
                          <circle cx="64" cy="64" r="58" className="stroke-slate-900 stroke-[8px] fill-none" />
                          <circle cx="64" cy="64" r="58" className="stroke-blue-500 stroke-[8px] fill-none shadow-glow" style={{ strokeDasharray: '364', strokeDashoffset: '100' }} />
                       </svg>
                       <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-black text-white">82%</span>
                          <span className="text-[7px] font-black text-slate-500 uppercase">Closing Prob</span>
                       </div>
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase text-center leading-relaxed">
                       La IA detecta alta propensión de compra basada en el uso de palabras clave de inversión.
                    </p>
                 </div>
              </div>

              <div className="pt-10">
                 <button 
                   onClick={() => handleResolveChat(activeConv.id)}
                   className="w-full py-4 bg-slate-900 hover:bg-rose-600 border border-slate-800 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-xl"
                 >
                   Cerrar Interacción
                 </button>
              </div>
           </div>
         )}
      </div>
    </div>
  );
};

export default WhatsAppModule;

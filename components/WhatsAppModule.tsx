
import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, Search, Send, MoreVertical, CheckCheck, 
  Paperclip, Smile, Phone, Info, ArrowLeft, Music, 
  LayoutGrid, Filter, Settings, ShieldCheck,
  Zap, Bot, Smartphone, Globe, Plus, Trash2, Clock,
  CheckCircle2, RefreshCw, Layers, MessageSquare, 
  X, Network, Share2, ChevronRight, ExternalLink, 
  Shield, Wand2, Sparkles, User, Hash
} from 'lucide-react';
import { WhatsAppConversation, WhatsAppMessage, ChannelType } from '../types';
import { useToast } from '../ToastContext';
import { GoogleGenAI } from "@google/genai";

const MOCK_CONVERSATIONS: WhatsAppConversation[] = [
  {
    id: 'c_1',
    contactName: 'Alexander Pierce',
    messages: [
      { id: 'm_1', text: 'Hola, vi su anuncio en TikTok sobre el proyecto en Florida.', sender: 'CUSTOMER', timestamp: '14:02' },
      { id: 'm_2', text: '¡Hola Alexander! Con gusto te ayudo. ¿Qué unidad te interesó?', sender: 'AGENT', timestamp: '14:05' },
      { id: 'm_3', text: 'La de 2 habitaciones frente al mar.', sender: 'CUSTOMER', timestamp: '14:10' },
    ]
  },
  {
    id: 'c_2',
    contactName: 'Elena Gilbert',
    messages: [
      { id: 'm_4', text: '¿Podrían enviarme el brochure actualizado?', sender: 'CUSTOMER', timestamp: '09:45' },
    ]
  },
  {
    id: 'c_3',
    contactName: 'John Wick',
    messages: [
      { id: 'm_5', text: 'El proceso de pago por SMS fue muy rápido, gracias.', sender: 'CUSTOMER', timestamp: 'Ayer' },
    ]
  }
];

const INITIAL_CHANNELS = [
  { id: 'wa_1', name: 'WhatsApp Business API', provider: 'WABA', status: 'CONNECTED', icon: MessageCircle, color: 'text-emerald-500' },
  { id: 'tk_1', name: 'TikTok Leads API', provider: 'TikTok Business', status: 'CONNECTED', icon: Music, color: 'text-rose-500' },
  { id: 'sms_1', name: 'SMS Gateway (Twilio)', provider: 'Twilio Relay', status: 'STANDBY', icon: Smartphone, color: 'text-blue-500' },
];

const WhatsAppModule: React.FC = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'OPERATIONS' | 'SETTINGS'>('OPERATIONS');
  const [conversations, setConversations] = useState<WhatsAppConversation[]>(MOCK_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string>(MOCK_CONVERSATIONS[0].id);
  const [inputText, setInputText] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeConvId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeConv?.messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMessage: WhatsAppMessage = {
      id: `m_${Date.now()}`,
      text: inputText,
      sender: 'AGENT',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(prev => prev.map(c => 
      c.id === activeConvId ? { ...c, messages: [...c.messages, newMessage] } : c
    ));
    setInputText("");
    toast('Mensaje despachado via WABA.', 'success');
  };

  const handleAiSuggest = async () => {
    if (!activeConv || isAiThinking) return;
    setIsAiThinking(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const lastCustMsg = [...activeConv.messages].reverse().find(m => m.sender === 'CUSTOMER')?.text || "";
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Basado en este mensaje de cliente: "${lastCustMsg}", genera una respuesta corta, profesional y persuasiva para un agente de ventas de bienes raíces. Tono: Ejecutivo.`,
      });

      const suggestion = response.text || "Lo siento, no pude procesar la respuesta.";
      setInputText(suggestion);
      toast('Respuesta sugerida por el Copiloto AI.', 'info', 'Neural Intelligence');
    } catch (error) {
      toast('Error en el motor AI.', 'error');
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleSyncHub = async () => {
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsSyncing(false);
    toast('Puente omnicanal sincronizado con el clúster.', 'success', 'Hub Sync');
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-6 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
        <div className="flex items-center space-x-5">
           <div className={`p-4 rounded-[24px] bg-emerald-600 text-white shadow-2xl shadow-emerald-600/20`}>
              <Share2 size={28} />
           </div>
           <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Social Intelligence Hub</h2>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">Conexión Lead Gen (TikTok/WA/SMS)</p>
           </div>
        </div>

        <div className="flex items-center space-x-4">
           <button onClick={handleSyncHub} disabled={isSyncing} className="bg-slate-900 border-2 border-slate-800 hover:bg-blue-600/10 text-blue-400 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 disabled:opacity-50 border-blue-500/20">
              {isSyncing ? <RefreshCw className="animate-spin mr-2" size={16} /> : <Zap size={16} className="mr-2" />}
              Refresh Streams
           </button>
           <div className="flex bg-slate-900 border-2 border-slate-800 p-1.5 rounded-[24px] shadow-inner">
              <button onClick={() => setViewMode('OPERATIONS')} className={`px-8 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'OPERATIONS' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}>Operaciones</button>
              <button onClick={() => setViewMode('SETTINGS')} className={`px-8 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'SETTINGS' ? 'bg-amber-600 text-white shadow-xl shadow-amber-600/20' : 'text-slate-500 hover:text-slate-300'}`}>Nodos API</button>
           </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex glass rounded-[56px] border border-slate-700/50 overflow-hidden shadow-2xl">
         {viewMode === 'SETTINGS' ? (
            <div className="flex-1 overflow-y-auto p-12 space-y-10 scrollbar-hide">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {INITIAL_CHANNELS.map(chan => (
                    <div key={chan.id} className="p-10 rounded-[48px] bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-all shadow-2xl relative group">
                        <div className="flex items-center justify-between mb-8">
                          <div className={`p-5 rounded-[22px] bg-slate-950 border border-slate-800 ${chan.color}`}><chan.icon size={32} /></div>
                          <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${chan.status === 'CONNECTED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-700 text-slate-500'}`}>{chan.status}</div>
                        </div>
                        <h4 className="font-black text-white uppercase text-lg mb-1">{chan.name}</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">{chan.provider}</p>
                        <div className="mt-10 pt-8 border-t border-slate-800/50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-[9px] font-black text-blue-400 uppercase tracking-widest hover:underline flex items-center">Configurar Webhook <ExternalLink size={12} className="ml-1" /></button>
                          <button className="p-2 text-slate-600 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
                        </div>
                    </div>
                  ))}
               </div>

               <div className="p-12 glass rounded-[64px] border border-blue-500/20 bg-blue-600/5 space-y-8 shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-5 text-blue-400"><Network size={150} /></div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight flex items-center">
                     <Network className="mr-4 text-blue-500" /> API Gateway Routing
                  </h3>
                  <div className="p-8 bg-slate-950 border border-slate-800 rounded-[32px] space-y-4 shadow-inner">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Canal de Captura Lead Gen</span>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center"><ShieldCheck size={12} className="mr-1.5" /> mTLS 1.3 Active</span>
                     </div>
                     <div className="flex items-center space-x-5">
                        <code className="flex-1 bg-black/40 p-5 rounded-[20px] text-blue-400 font-mono text-xs truncate border border-slate-900">https://nexus-hub.cuberbox-pro.net/v1/omni/webhook_secure</code>
                        <button onClick={() => toast('URL de Webhook copiada.')} className="p-4 bg-slate-900 rounded-[20px] text-slate-500 hover:text-white border border-slate-800 transition-all shadow-lg active:scale-95"><Layers size={20} /></button>
                     </div>
                  </div>
               </div>
            </div>
         ) : (
            <div className="flex-1 flex overflow-hidden">
               {/* Contact Sidebar */}
               <div className="w-96 border-r border-slate-800 flex flex-col bg-slate-950/20">
                  <div className="p-8 space-y-6">
                     <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center">
                        <MessageSquare size={20} className="mr-3 text-emerald-500" /> Inbound Feed
                     </h3>
                     <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                        <input type="text" placeholder="Buscar hilos..." className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-xs text-white outline-none focus:border-blue-500 transition-all shadow-inner" />
                     </div>
                  </div>
                  <div className="flex-1 overflow-y-auto scrollbar-hide px-4 space-y-2">
                     {conversations.map(c => (
                       <button 
                        key={c.id} 
                        onClick={() => setActiveConvId(c.id)}
                        className={`w-full flex items-center p-5 rounded-[32px] transition-all group ${activeConvId === c.id ? 'bg-blue-600 shadow-xl' : 'hover:bg-slate-800/40'}`}
                       >
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black mr-4 shadow-lg ${activeConvId === c.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-blue-400'}`}>
                             {c.contactName.charAt(0)}
                          </div>
                          <div className="flex-1 text-left min-w-0">
                             <div className="flex justify-between items-center mb-1">
                                <span className={`text-xs font-black uppercase truncate ${activeConvId === c.id ? 'text-white' : 'text-slate-200'}`}>{c.contactName}</span>
                                <span className={`text-[8px] font-bold ${activeConvId === c.id ? 'text-blue-100' : 'text-slate-500'}`}>{c.messages[c.messages.length-1].timestamp}</span>
                             </div>
                             <p className={`text-[10px] truncate ${activeConvId === c.id ? 'text-blue-100 font-medium' : 'text-slate-500'}`}>
                                {c.messages[c.messages.length-1].text}
                             </p>
                          </div>
                       </button>
                     ))}
                  </div>
               </div>

               {/* Chat Main Area */}
               <div className="flex-1 flex flex-col bg-black/20">
                  {activeConv ? (
                    <>
                      <div className="p-8 border-b border-slate-800/60 bg-slate-900/40 flex items-center justify-between">
                         <div className="flex items-center space-x-5">
                            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-2xl">
                               {activeConv.contactName.charAt(0)}
                            </div>
                            <div>
                               <h4 className="text-xl font-black text-white uppercase tracking-tight">{activeConv.contactName}</h4>
                               <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Sincronizado via WABA</span>
                               </div>
                            </div>
                         </div>
                         <div className="flex items-center space-x-2">
                            <button className="p-4 bg-slate-900 rounded-2xl text-slate-400 hover:text-white transition-all shadow-lg"><Phone size={20} /></button>
                            <button className="p-4 bg-slate-900 rounded-2xl text-slate-400 hover:text-white transition-all shadow-lg"><MoreVertical size={20} /></button>
                         </div>
                      </div>

                      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-6 scrollbar-hide bg-[radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.03),_transparent)]">
                         {activeConv.messages.map(m => (
                           <div key={m.id} className={`flex ${m.sender === 'AGENT' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                              <div className={`max-w-[70%] p-6 rounded-[32px] text-sm relative shadow-2xl ${m.sender === 'AGENT' ? 'bg-blue-600 text-white rounded-tr-none' : 'glass border-slate-700 text-slate-200 rounded-tl-none'}`}>
                                 <p className="font-medium leading-relaxed">{m.text}</p>
                                 <div className={`text-[9px] mt-3 font-black uppercase tracking-widest flex items-center justify-end space-x-2 ${m.sender === 'AGENT' ? 'text-blue-100 opacity-60' : 'text-slate-500'}`}>
                                    <span>{m.timestamp}</span>
                                    {m.sender === 'AGENT' && <CheckCheck size={12} />}
                                 </div>
                              </div>
                           </div>
                         ))}
                         {isAiThinking && (
                           <div className="flex justify-start">
                              <div className="glass border-slate-700 p-5 rounded-[24px] rounded-tl-none flex items-center space-x-3">
                                 <Sparkles size={16} className="text-blue-400 animate-pulse" />
                                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural AI pensando...</span>
                              </div>
                           </div>
                         )}
                      </div>

                      <div className="p-8 bg-slate-900/60 border-t border-slate-800 space-y-4">
                         {/* Copilot Suggestion Bar */}
                         <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide pb-2">
                            <button 
                              onClick={handleAiSuggest}
                              disabled={isAiThinking}
                              className="flex items-center space-x-2 bg-blue-600/10 border border-blue-500/30 text-blue-400 px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all whitespace-nowrap active:scale-95 shadow-lg shadow-blue-600/5"
                            >
                               <Bot size={14} />
                               <span>Sugerencia AI</span>
                            </button>
                            <button className="bg-slate-950 border border-slate-800 text-slate-500 px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:border-blue-500/40 transition-all whitespace-nowrap">Solicitar Brochure</button>
                            <button className="bg-slate-950 border border-slate-800 text-slate-500 px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:border-blue-500/40 transition-all whitespace-nowrap">Agendar Visita</button>
                         </div>

                         <div className="flex items-center space-x-4 bg-slate-950 border-2 border-slate-800 rounded-[32px] px-8 py-2 focus-within:border-emerald-500/50 transition-all shadow-inner">
                            <button className="text-slate-600 hover:text-blue-400 transition-colors"><Paperclip size={22} /></button>
                            <input 
                              type="text" 
                              value={inputText}
                              onChange={e => setInputText(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                              placeholder="Escribe un mensaje omnicanal..." 
                              className="flex-1 bg-transparent py-5 text-sm text-white outline-none placeholder-slate-700 font-medium"
                            />
                            <button className="text-slate-600 hover:text-amber-400 transition-colors"><Smile size={22} /></button>
                            <button 
                              onClick={handleSendMessage}
                              disabled={!inputText.trim()}
                              className={`p-4 rounded-2xl transition-all shadow-xl ${inputText.trim() ? 'bg-emerald-600 text-white hover:scale-105 active:scale-95' : 'text-slate-800 cursor-not-allowed opacity-50'}`}
                            >
                               <Send size={22} />
                            </button>
                         </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center opacity-30">
                       <MessageSquare size={80} className="text-slate-600 mb-8" />
                       <h3 className="text-3xl font-black text-white uppercase tracking-widest">No hay hilos activos</h3>
                       <p className="text-sm text-slate-500 mt-4 max-w-sm font-bold uppercase tracking-widest">Selecciona una conversación del pipeline para interactuar.</p>
                    </div>
                  )}
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default WhatsAppModule;

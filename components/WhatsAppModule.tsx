
import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, Search, Send, MoreVertical, CheckCheck, 
  Paperclip, Smile, Phone, Info, Music, 
  LayoutGrid, Filter, Settings, ShieldCheck,
  Zap, Bot, Smartphone, Globe, Plus, Trash2, Clock,
  CheckCircle2, RefreshCw, Layers, MessageSquare, 
  X, Network, Share2, ChevronRight, ExternalLink, 
  Shield, Wand2, Sparkles, User, Hash, Facebook, Instagram,
  BrainCircuit, TrendingUp, TrendingDown, Brain as BrainIcon,
  Quote
} from 'lucide-react';
import { WhatsAppConversation, WhatsAppMessage } from '../types';
import { useToast } from '../ToastContext';
import { GoogleGenAI } from "@google/genai";

type Channel = 'WHATSAPP' | 'TIKTOK' | 'FACEBOOK' | 'INSTAGRAM' | 'SMS';

interface EnhancedConversation extends WhatsAppConversation {
  channel: Channel;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  summary?: string;
}

const MOCK_CONVERSATIONS: EnhancedConversation[] = [
  {
    id: 'c_1',
    channel: 'WHATSAPP',
    contactName: 'Alexander Pierce',
    sentiment: 'POSITIVE',
    messages: [
      { id: 'm_1', text: 'Hola, vi su anuncio en TikTok sobre el proyecto en Florida.', sender: 'CUSTOMER', timestamp: '14:02' },
      { id: 'm_2', text: '¡Hola Alexander! Con gusto te ayudo. ¿Qué unidad te interesó?', sender: 'AGENT', timestamp: '14:05' },
      { id: 'm_3', text: 'La de 2 habitaciones frente al mar. ¿Tienen planes de financiamiento?', sender: 'CUSTOMER', timestamp: '14:10' },
    ]
  },
  {
    id: 'c_2',
    channel: 'TIKTOK',
    contactName: 'Elena Gilbert',
    sentiment: 'NEUTRAL',
    messages: [
      { id: 'm_4', text: '¿Podrían enviarme el brochure actualizado? Vi el video de la mansión en Brickell.', sender: 'CUSTOMER', timestamp: '09:45' },
    ]
  },
  {
    id: 'c_3',
    channel: 'FACEBOOK',
    contactName: 'John Wick',
    sentiment: 'NEGATIVE',
    messages: [
      { id: 'm_5', text: 'Nadie me ha llamado para mi cita de ayer. Pésimo seguimiento.', sender: 'CUSTOMER', timestamp: 'Ayer' },
    ]
  },
  {
    id: 'c_4',
    channel: 'INSTAGRAM',
    contactName: 'Selina Kyle',
    sentiment: 'POSITIVE',
    messages: [
      { id: 'm_6', text: 'Me encanta el diseño de las cocinas en el proyecto Diamond. ¿Precio base?', sender: 'CUSTOMER', timestamp: '10:15' },
    ]
  }
];

const WhatsAppModule: React.FC = () => {
  const { toast } = useToast();
  const [activeChannel, setActiveChannel] = useState<Channel | 'ALL'>('ALL');
  const [conversations, setConversations] = useState<EnhancedConversation[]>(MOCK_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string>(MOCK_CONVERSATIONS[0].id);
  const [inputText, setInputText] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
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
    toast(`Mensaje enviado vía ${activeConv?.channel}.`, 'success');
  };

  const handleAiSuggest = async () => {
    if (!activeConv || isAiThinking) return;
    setIsAiThinking(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const lastCustMsg = [...activeConv.messages].reverse().find(m => m.sender === 'CUSTOMER')?.text || "";
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Eres un agente experto de CUBERBOX en el canal ${activeConv.channel}. 
        El cliente dice: "${lastCustMsg}". 
        Genera una respuesta profesional, corta y vendedora. Tono: Ejecutivo.`,
      });

      const suggestion = response.text || "Lo siento, no pude procesar la respuesta.";
      setInputText(suggestion);
      toast('Copiloto AI: Sugerencia cargada.', 'info', 'Neural Intelligence');
    } catch (error) {
      toast('Error en el puente neuronal.', 'error');
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleSummarize = async () => {
    if (!activeConv || isSummarizing) return;
    setIsSummarizing(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const historyText = activeConv.messages.map(m => `${m.sender}: ${m.text}`).join('\n');
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Resume esta conversación en un solo párrafo corto enfocado en los puntos clave de negocio:\n${historyText}`,
      });

      const summary = response.text || "No se pudo generar el resumen.";
      setConversations(prev => prev.map(c => 
        c.id === activeConvId ? { ...c, summary } : c
      ));
      toast('Resumen de hilo generado.', 'success', 'Context Extraction');
    } catch (error) {
      toast('Error al procesar el resumen.', 'error');
    } finally {
      setIsSummarizing(false);
    }
  };

  const getChannelStyle = (channel: Channel) => {
    switch (channel) {
      case 'WHATSAPP': return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: MessageCircle };
      case 'TIKTOK': return { color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/30', icon: Music };
      case 'FACEBOOK': return { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: Facebook };
      case 'INSTAGRAM': return { color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/30', icon: Instagram };
      default: return { color: 'text-slate-400', bg: 'bg-slate-800', border: 'border-slate-700', icon: MessageSquare };
    }
  };

  const filteredConversations = conversations.filter(c => 
    activeChannel === 'ALL' || c.channel === activeChannel
  );

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-6 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
        <div className="flex items-center space-x-5">
           <div className={`p-4 rounded-[24px] bg-blue-600 text-white shadow-2xl shadow-blue-600/20`}>
              <Share2 size={28} />
           </div>
           <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Omnicanal Intelligence Hub</h2>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">Plataforma de Interacción Neuronal Unificada</p>
           </div>
        </div>

        <div className="flex bg-slate-900 border-2 border-slate-800 p-1.5 rounded-[24px] shadow-inner overflow-x-auto scrollbar-hide">
           {[
             { id: 'ALL', label: 'Todos', icon: LayoutGrid },
             { id: 'WHATSAPP', label: 'WhatsApp', icon: MessageCircle },
             { id: 'TIKTOK', label: 'TikTok', icon: Music },
             { id: 'FACEBOOK', label: 'Meta', icon: Facebook },
             { id: 'INSTAGRAM', label: 'Insta', icon: Instagram },
           ].map(tab => (
             <button 
              key={tab.id} 
              onClick={() => setActiveChannel(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${activeChannel === tab.id ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
             >
                <tab.icon size={14} />
                <span>{tab.label}</span>
             </button>
           ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 flex glass rounded-[56px] border border-slate-700/50 overflow-hidden shadow-2xl">
         {/* Contact Sidebar */}
         <div className="w-96 border-r border-slate-800 flex flex-col bg-slate-950/40">
            <div className="p-8 space-y-6">
               <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center">
                  <MessageSquare size={20} className="mr-3 text-blue-500" /> Active Streams
               </h3>
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input type="text" placeholder="Buscar en el clúster..." className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-xs text-white outline-none focus:border-blue-500 transition-all shadow-inner" />
               </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide px-4 space-y-3 pb-10">
               {filteredConversations.map(c => {
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
                            <span className={`text-[8px] font-bold ${activeConvId === c.id ? 'text-blue-100' : 'text-slate-500'}`}>{c.messages[c.messages.length-1].timestamp}</span>
                         </div>
                         <p className={`text-[10px] truncate ${activeConvId === c.id ? 'text-blue-100 font-medium' : 'text-slate-500'}`}>
                            {c.messages[c.messages.length-1].text}
                         </p>
                      </div>
                      {c.sentiment === 'POSITIVE' && activeConvId !== c.id && <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-emerald-500"></div>}
                      {c.sentiment === 'NEGATIVE' && activeConvId !== c.id && <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>}
                   </button>
                 );
               })}
            </div>
         </div>

         {/* Chat Main Area */}
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
                            {activeConv.sentiment === 'POSITIVE' ? <TrendingUp size={16} className="text-emerald-500" /> : activeConv.sentiment === 'NEGATIVE' ? <TrendingDown size={16} className="text-rose-500" /> : null}
                         </div>
                         <div className="flex items-center space-x-3 mt-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${getChannelStyle(activeConv.channel).color}`}>
                               Interacción vía {activeConv.channel}
                            </span>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center space-x-3">
                      <button 
                        onClick={handleSummarize}
                        disabled={isSummarizing}
                        className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-blue-400 hover:text-white transition-all shadow-lg active:scale-95 group"
                        title="Resumen Neuronal"
                      >
                         <BrainIcon size={22} className={isSummarizing ? 'animate-spin' : 'group-hover:scale-110'} />
                      </button>
                      <button className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all shadow-lg"><Phone size={22} /></button>
                      <button className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all shadow-lg"><MoreVertical size={22} /></button>
                   </div>
                </div>

                <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-8 scrollbar-hide bg-[radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.03),_transparent)]">
                   {/* Summary Section */}
                   {activeConv.summary && (
                     <div className="animate-in slide-in-from-top-4 duration-500 mb-10">
                        <div className="p-8 bg-blue-600/5 border-2 border-blue-500/20 rounded-[40px] relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-6 opacity-5 text-blue-400 group-hover:scale-110 transition-transform">
                              <BrainCircuit size={100} />
                           </div>
                           <div className="flex items-center space-x-3 mb-4">
                              <Sparkles size={16} className="text-blue-400" />
                              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Resumen del Hilo (Gemini Core)</span>
                           </div>
                           <p className="text-sm text-slate-300 font-medium leading-relaxed italic relative z-10">
                              "{activeConv.summary}"
                           </p>
                        </div>
                     </div>
                   )}

                   {activeConv.messages.map(m => (
                     <div key={m.id} className={`flex ${m.sender === 'AGENT' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                        <div className={`max-w-[70%] p-8 rounded-[40px] text-sm relative shadow-2xl transition-all ${m.sender === 'AGENT' ? 'bg-blue-600 text-white rounded-tr-none hover:bg-blue-500' : 'glass border-slate-700 text-slate-200 rounded-tl-none hover:border-slate-500'}`}>
                           <p className="font-medium leading-relaxed text-base">{m.text}</p>
                           <div className={`text-[9px] mt-4 font-black uppercase tracking-widest flex items-center justify-end space-x-3 ${m.sender === 'AGENT' ? 'text-blue-100 opacity-60' : 'text-slate-500'}`}>
                              <span>{m.timestamp}</span>
                              {m.sender === 'AGENT' && <CheckCheck size={14} />}
                           </div>
                        </div>
                     </div>
                   ))}
                   
                   {isAiThinking && (
                     <div className="flex justify-start animate-in slide-in-from-left-4">
                        <div className="glass border-blue-500/30 p-6 rounded-[32px] rounded-tl-none flex items-center space-x-4 bg-blue-600/5">
                           <BrainIcon size={20} className="text-blue-400 animate-pulse" />
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural AI redactando sugerencia...</span>
                        </div>
                     </div>
                   )}
                </div>

                {/* Input Area */}
                <div className="p-10 bg-slate-900/60 border-t border-slate-800 space-y-6">
                   {/* Copilot Suggestion Bar */}
                   <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide pb-2">
                      <button 
                        onClick={handleAiSuggest}
                        disabled={isAiThinking}
                        className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all whitespace-nowrap active:scale-95 shadow-xl shadow-blue-600/20 disabled:opacity-50"
                      >
                         <Bot size={18} />
                         <span>Sugerencia Inteligente</span>
                      </button>
                      
                      <div className="h-8 w-px bg-slate-800 mx-2"></div>
                      
                      <button className="bg-slate-950 border border-slate-800 text-slate-400 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-emerald-500/40 hover:text-emerald-400 transition-all whitespace-nowrap">Agendar Visita</button>
                      <button className="bg-slate-950 border border-slate-800 text-slate-400 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-emerald-500/40 hover:text-emerald-400 transition-all whitespace-nowrap">Enviar Ubicación</button>
                      <button className="bg-slate-950 border border-slate-800 text-slate-400 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-emerald-500/40 hover:text-emerald-400 transition-all whitespace-nowrap">Documentación Legal</button>
                   </div>

                   <div className="flex items-center space-x-5 bg-slate-950 border-2 border-slate-800 rounded-[40px] px-10 py-3 focus-within:border-blue-500/50 transition-all shadow-inner relative group">
                      <button className="text-slate-600 hover:text-blue-400 transition-colors"><Paperclip size={24} /></button>
                      <input 
                        type="text" 
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                        placeholder={`Respuesta vía ${activeConv.channel}...`} 
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

                   <div className="flex items-center justify-between px-4">
                      <div className="flex items-center space-x-6">
                         <div className="flex items-center space-x-2">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Encriptación E2EE Activa</span>
                         </div>
                         <div className="flex items-center space-x-2">
                            <Globe size={14} className="text-blue-500" />
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">mTLS v1.3</span>
                         </div>
                      </div>
                      <div className="flex items-center space-x-2">
                         <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Sincronizado: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                   </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-center opacity-30 animate-in fade-in duration-1000">
                 <div className="w-32 h-32 rounded-[48px] bg-slate-900 flex items-center justify-center mb-10 border border-slate-800 shadow-inner">
                    <Share2 size={64} className="text-slate-700" />
                 </div>
                 <h3 className="text-4xl font-black text-white uppercase tracking-[0.2em]">Selecciona un Flujo</h3>
                 <p className="text-sm text-slate-500 mt-6 max-w-sm font-bold uppercase tracking-widest leading-relaxed">
                    Gestiona prospectos de WhatsApp, TikTok y Redes Sociales en una sola interfaz de baja latencia.
                 </p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default WhatsAppModule;

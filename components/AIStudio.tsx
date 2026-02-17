import React, { useState } from 'react';
import { Bot, MessageSquare, Save, Zap, Send, Sparkles, RefreshCw, Cpu, Target, ChevronRight, Info, Volume2, Gauge } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { AIBot } from '../types';
import { MOCK_BOTS, MOCK_CAMPAIGNS } from '../constants';
import { useToast } from '../ToastContext';

const AIStudio: React.FC = () => {
  const [bots, setBots] = useState<AIBot[]>(MOCK_BOTS);
  const [selectedBot, setSelectedBot] = useState<AIBot>(MOCK_BOTS[0]);
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'bot', text: string}[]>([]);
  const [previewMsg, setPreviewMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if(!previewMsg.trim() || isTyping) return;
    
    const userText = previewMsg;
    setChatHistory(prev => [...prev, {role: 'user', text: userText}]);
    setPreviewMsg("");
    setIsTyping(true);
    
    try {
      // Inicialización correcta según reglas Gemini v3
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: userText,
        config: {
          systemInstruction: `Eres un agente de ventas experto de CUBERBOX llamado ${selectedBot.name}. Objetivo: ${selectedBot.prompt}. Tono: Profesional, ejecutivo y persuasivo.`,
          temperature: 0.7,
        },
      });

      const botResponse = response.text || "Interface error: Data corrupt.";
      setChatHistory(prev => [...prev, {role: 'bot', text: botResponse}]);
    } catch (error: any) {
      console.error("Gemini Engine Error:", error);
      toast('Error en el puente neuronal: Revise su API_KEY.', 'error', 'AI Core Critical');
      setChatHistory(prev => [...prev, {role: 'bot', text: "[ERROR]: El motor neuronal no pudo procesar la solicitud."}]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setBots(prev => prev.map(b => b.id === selectedBot.id ? selectedBot : b));
    setIsSaving(false);
    toast(`Cerebro "${selectedBot.name}" sincronizado con FreeSwitch mod_esl.`, 'success', 'Sincronización OK');
  };

  const updateBotProperty = (key: keyof AIBot, value: any) => {
    setSelectedBot(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase flex items-center">
            <Bot className="mr-4 text-purple-400" size={36} />
            AI & Neural Lab
          </h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Ingeniería de comportamiento LLM para el Dialer v4.7.9.</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4 space-y-4">
           <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-4 mb-4">Brains en Producción</h4>
           <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-hide">
             {bots.map(bot => (
               <div 
                key={bot.id}
                onClick={() => { setSelectedBot(bot); setChatHistory([]); }}
                className={`p-6 rounded-[36px] border-2 cursor-pointer transition-all relative overflow-hidden group ${selectedBot.id === bot.id ? 'bg-purple-600/10 border-purple-500 shadow-2xl' : 'glass border-slate-800 hover:border-slate-700'}`}
               >
                  <div className="flex items-center space-x-5 relative z-10">
                     <div className={`p-3 rounded-2xl ${selectedBot.id === bot.id ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-900 text-slate-500'}`}>
                        <Zap size={24} />
                     </div>
                     <div className="flex-1 min-w-0">
                        <h4 className="font-black text-white uppercase tracking-tight truncate">{bot.name}</h4>
                        <p className="text-[9px] text-slate-500 font-black uppercase mt-1 tracking-widest flex items-center">
                          <Target size={10} className="mr-1 text-blue-400" />
                          Campaña: {MOCK_CAMPAIGNS.find(c => c.id === bot.campaignId)?.name || 'Global'}
                        </p>
                     </div>
                  </div>
               </div>
             ))}
           </div>
        </div>

        <div className="col-span-12 lg:col-span-8 flex flex-col space-y-8">
           <div className="glass p-10 rounded-[56px] border border-slate-700/50 shadow-2xl space-y-10 relative overflow-hidden">
              <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-6">
                    <div className="p-4 bg-purple-600/10 rounded-2xl text-purple-400 border border-purple-500/20">
                       <Cpu size={28} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-white uppercase tracking-tighter">System Directives</h3>
                       <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Lógica de Inferencia v3.1</p>
                    </div>
                 </div>
                 <button 
                  onClick={handleSaveConfig}
                  disabled={isSaving}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-3.5 rounded-[18px] font-black text-[11px] uppercase tracking-widest active:scale-95 shadow-xl disabled:opacity-50 flex items-center"
                 >
                    {isSaving ? <RefreshCw className="animate-spin mr-2" size={16} /> : <Save size={16} className="mr-2" />}
                    <span>Sincronizar Brain</span>
                 </button>
              </div>

              <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Asignación Campaña</label>
                       <select 
                        value={selectedBot.campaignId}
                        onChange={(e) => updateBotProperty('campaignId', e.target.value)}
                        className="w-full bg-slate-950 border-2 border-slate-800 rounded-[28px] px-6 py-4 text-sm text-white font-bold outline-none focus:border-blue-500 appearance-none transition-all shadow-inner"
                       >
                         {MOCK_CAMPAIGNS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                       </select>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Nombre del Avatar AI</label>
                       <input 
                        type="text" 
                        value={selectedBot.name}
                        onChange={(e) => updateBotProperty('name', e.target.value)}
                        className="w-full bg-slate-950 border-2 border-slate-800 rounded-[28px] px-8 py-4 text-sm text-white font-bold outline-none focus:border-blue-500 shadow-inner"
                       />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Prompt Maestro (Comportamiento)</label>
                    <textarea 
                     value={selectedBot.prompt}
                     onChange={e => updateBotProperty('prompt', e.target.value)}
                     className="w-full h-48 bg-slate-950 border-2 border-slate-800 rounded-[40px] p-8 text-sm text-slate-300 font-medium outline-none focus:border-purple-500 transition-all shadow-inner leading-relaxed resize-none"
                     placeholder="Define la misión del bot..."
                    />
                 </div>
              </div>
           </div>

           <div className="glass flex-1 rounded-[56px] border border-slate-800 shadow-2xl flex flex-col overflow-hidden min-h-[500px]">
              <div className="p-8 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
                 <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center">
                    <MessageSquare size={18} className="mr-3 text-blue-500" /> Live Simulation Hub
                 </h3>
              </div>

              <div className="flex-1 p-10 overflow-y-auto scrollbar-hide space-y-6 bg-slate-950/20">
                 {chatHistory.map((msg, i) => (
                   <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                      <div className={`max-w-[80%] p-6 rounded-[32px] text-sm relative shadow-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'glass border-slate-700 text-slate-200 rounded-tl-none'}`}>
                        <p className="font-medium leading-relaxed">{msg.text}</p>
                        <div className="text-[9px] mt-3 font-black uppercase tracking-widest opacity-40">
                           {msg.role === 'user' ? 'PRUEBA_LÍNEA' : 'MOTOR_IA'}
                        </div>
                      </div>
                   </div>
                 ))}
                 {isTyping && <div className="p-4 rounded-full bg-slate-900 text-blue-400 w-fit animate-pulse text-[10px] font-black uppercase tracking-widest">Procesando señal...</div>}
              </div>

              <div className="p-8 bg-slate-900/60 border-t border-slate-800">
                 <div className="flex items-center space-x-4 bg-slate-950 border-2 border-slate-800 rounded-[32px] px-8 focus-within:border-blue-500 transition-all">
                    <input 
                      type="text" 
                      value={previewMsg}
                      onChange={e => setPreviewMsg(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Simular interacción del cliente..."
                      className="flex-1 bg-transparent py-6 text-sm text-white outline-none placeholder-slate-800 font-medium"
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={!previewMsg.trim() || isTyping}
                      className={`p-4 rounded-2xl transition-all shadow-xl ${previewMsg.trim() ? 'bg-blue-600 text-white hover:scale-110' : 'text-slate-800 opacity-50'}`}
                    >
                       <Send size={20} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AIStudio;

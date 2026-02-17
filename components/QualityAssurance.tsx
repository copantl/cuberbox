
/**
 * @file QualityAssurance.tsx
 * @description Motor de Auditoría de Calidad con métricas objetivas (FCR, AHT, CSAT, Compliance).
 */

import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, Search, Filter, Play, Pause, Star, 
  MessageSquare, Save, Trash2, Edit2, X, RefreshCw, 
  CheckCircle, AlertCircle, PhoneIncoming, Clock, 
  User, Award, Sliders, ChevronRight, Maximize2, 
  Volume2, Info, Sparkles, BrainCircuit, Wand2, Zap, 
  Plus, Smile, Meh, Frown, FileText, Quote, 
  Target, Timer, ShieldAlert, BarChart3, Heart, 
  CheckCircle2, Gauge, Scale
} from 'lucide-react';
import { QAEvaluation } from '../types';
import { MOCK_CDR_DATA, MOCK_USERS_LIST } from '../constants';
import { GoogleGenAI, Type } from "@google/genai";
import { useToast } from '../ToastContext';

interface EnhancedQAEvaluation extends Omit<QAEvaluation, 'scores'> {
  // Nuevas métricas objetivas
  metrics: {
    fcr: boolean;          // First Call Resolution
    aht: number;           // Average Handle Time (segundos)
    csat: number;          // Customer Satisfaction (1-5)
    quality: number;       // Quality Assurance Score (0-100)
    compliance: number;    // Call Compliance Index (0-100)
  };
  sentiment?: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  summary?: string;
}

const MOCK_QA_LIST: EnhancedQAEvaluation[] = [
  {
    id: 'qa_1',
    cdrId: 'cdr_001',
    agentId: 'usr_2',
    evaluatorId: 'usr_1',
    timestamp: '2024-11-20 16:30:00',
    metrics: { 
      fcr: true, 
      aht: 320, 
      csat: 5, 
      quality: 94, 
      compliance: 100 
    },
    comment: 'Excelente manejo de objeciones y cumplimiento total de script legal.',
    finalScore: 94.2,
    status: 'PASSED',
    sentiment: 'POSITIVE',
    summary: 'El cliente confirmó la compra tras la explicación detallada de beneficios. Se cumplió el protocolo de protección de datos.'
  }
];

const QualityAssurance: React.FC = () => {
  const { toast } = useToast();
  const [evaluations, setEvaluations] = useState<EnhancedQAEvaluation[]>(MOCK_QA_LIST);
  const [selectedEval, setSelectedEval] = useState<EnhancedQAEvaluation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Totales Globales para Dashboard
  const globalStats = useMemo(() => {
    if (evaluations.length === 0) return { fcr: 0, aht: 0, csat: 0, quality: 0, compliance: 0 };
    return {
      fcr: (evaluations.filter(e => e.metrics.fcr).length / evaluations.length) * 100,
      aht: evaluations.reduce((acc, e) => acc + e.metrics.aht, 0) / evaluations.length,
      csat: evaluations.reduce((acc, e) => acc + e.metrics.csat, 0) / evaluations.length,
      quality: evaluations.reduce((acc, e) => acc + e.metrics.quality, 0) / evaluations.length,
      compliance: evaluations.reduce((acc, e) => acc + e.metrics.compliance, 0) / evaluations.length,
    };
  }, [evaluations]);

  const filteredEvaluations = useMemo(() => {
    return evaluations.filter(e => {
      const agent = MOCK_USERS_LIST.find(u => u.id === e.agentId);
      return agent?.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [evaluations, searchTerm]);

  const handleOpenModal = (evaluation?: EnhancedQAEvaluation) => {
    if (evaluation) {
      setSelectedEval({ ...evaluation });
    } else {
      setSelectedEval({
        id: Math.random().toString(36).substr(2, 9),
        cdrId: MOCK_CDR_DATA[0].id,
        agentId: 'usr_2',
        evaluatorId: 'usr_1',
        timestamp: new Date().toISOString().replace('T', ' ').substr(0, 19),
        metrics: { fcr: false, aht: 0, csat: 3, quality: 0, compliance: 0 },
        comment: '',
        finalScore: 0,
        status: 'RECALIBRATION',
        sentiment: 'NEUTRAL',
        summary: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleAiAudit = async () => {
    if (!selectedEval) return;
    setIsAiAnalyzing(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analiza este transcript de llamada y evalúa criterios objetivos de calidad. 
      Devuelve un JSON con: fcr (boolean), csat (1-5), quality (0-100), compliance (0-100), 
      sentiment (STRING), summary (STRING), feedback (STRING).
      TRANSCRIPT:
      AGENT: Gracias por llamar a CUBERBOX, le atiende Maria. ¿En qué puedo ayudarle?
      CLIENT: Hola, mi factura llegó con un cargo extra que no reconozco.
      AGENT: Lamento el inconveniente. Revisando su cuenta... veo que es un ajuste de prorrateo. Ya lo he corregido y su próximo pago será el normal.
      CLIENT: Oh, perfecto. Muchas gracias por la rapidez.
      AGENT: ¿Algo más en lo que pueda apoyarle?
      CLIENT: No, eso es todo. Buen día.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              fcr: { type: Type.BOOLEAN },
              csat: { type: Type.NUMBER },
              quality: { type: Type.NUMBER },
              compliance: { type: Type.NUMBER },
              sentiment: { type: Type.STRING },
              summary: { type: Type.STRING },
              feedback: { type: Type.STRING }
            },
            required: ["fcr", "csat", "quality", "compliance", "sentiment", "summary", "feedback"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      
      setSelectedEval({
        ...selectedEval,
        metrics: {
          ...selectedEval.metrics,
          fcr: result.fcr,
          csat: result.csat,
          quality: result.quality,
          compliance: result.compliance
        },
        comment: `[IA AUDIT]: ${result.feedback}`,
        sentiment: result.sentiment,
        summary: result.summary,
        finalScore: (result.quality + result.compliance) / 2
      });

      toast('Auditoría Neuronal completada con KPIs objetivos.', 'success');
    } catch (error) {
      console.error("AI Audit Error:", error);
      toast('Falla en el motor de auditoría.', 'error');
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!selectedEval) return;
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    
    const { quality, compliance } = selectedEval.metrics;
    const avg = (quality + compliance) / 2;
    const status = avg >= 85 && selectedEval.metrics.compliance > 90 ? 'PASSED' : avg >= 70 ? 'RECALIBRATION' : 'FAILED';

    const finalEval = { ...selectedEval, finalScore: avg, status } as EnhancedQAEvaluation;
    setEvaluations(prev => {
      const exists = prev.find(e => e.id === finalEval.id);
      return exists ? prev.map(e => e.id === finalEval.id ? finalEval : e) : [finalEval, ...prev];
    });

    setIsSaving(false);
    setIsModalOpen(false);
    toast('Evaluación archivada en el histórico de calidad.', 'success');
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase flex items-center">
            <ShieldCheck className="mr-4 text-emerald-400" size={36} />
            Calidad & Compliance Pro
          </h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Evaluación objetiva del desempeño y cumplimiento normativo.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar agente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border-2 border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-xs text-white outline-none focus:border-emerald-500 transition-all w-64 shadow-inner"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-[20px] font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            <span>Auditar Llamada</span>
          </button>
        </div>
      </div>

      {/* Global QA Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
         {[
           { label: 'FCR Global', val: `${globalStats.fcr.toFixed(1)}%`, icon: Target, col: 'emerald' },
           { label: 'Avg AHT', val: `${Math.round(globalStats.aht)}s`, icon: Timer, col: 'blue' },
           { label: 'CSAT Score', val: globalStats.csat.toFixed(1), icon: Heart, col: 'rose' },
           { label: 'Internal Quality', val: `${globalStats.quality.toFixed(1)}%`, icon: Gauge, col: 'purple' },
           { label: 'Compliance', val: `${globalStats.compliance.toFixed(1)}%`, icon: ShieldAlert, col: 'amber' },
         ].map((kpi, i) => (
           <div key={i} className="glass p-6 rounded-[32px] border border-slate-700/50 shadow-xl flex flex-col justify-between group hover:border-blue-500/30 transition-all">
              <div className="flex items-center justify-between mb-4">
                 <div className={`p-2 rounded-xl bg-${kpi.col}-600/10 text-${kpi.col}-400 border border-${kpi.col}-500/20`}>
                    <kpi.icon size={18} />
                 </div>
                 <div className="w-10 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full bg-${kpi.col}-500`} style={{ width: kpi.val.includes('%') ? kpi.val : `${(parseFloat(kpi.val)/5)*100}%` }}></div>
                 </div>
              </div>
              <div>
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{kpi.label}</p>
                 <h3 className="text-2xl font-black text-white mt-1 tracking-tighter">{kpi.val}</h3>
              </div>
           </div>
         ))}
      </div>

      {/* Main Evaluations Table */}
      <div className="glass rounded-[48px] border border-slate-700/50 shadow-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-800/60 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
            <tr>
              <th className="px-10 py-6">Operador / Fecha</th>
              <th className="px-10 py-6 text-center">FCR</th>
              <th className="px-10 py-6 text-center">CSAT</th>
              <th className="px-10 py-6 text-center">Compliance</th>
              <th className="px-10 py-6 text-center">Final Score</th>
              <th className="px-10 py-6 text-right">Estatus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {filteredEvaluations.map((evalu) => {
              const agent = MOCK_USERS_LIST.find(u => u.id === evalu.agentId);
              return (
                <tr key={evalu.id} className="hover:bg-blue-600/5 transition-all group cursor-pointer" onClick={() => handleOpenModal(evalu)}>
                  <td className="px-10 py-6">
                    <div className="flex items-center space-x-5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-blue-500 shadow-inner group-hover:scale-105 transition-transform">
                        {agent?.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-black text-white uppercase tracking-tight">{agent?.fullName}</div>
                        <div className="text-[9px] text-slate-600 font-bold uppercase mt-1 flex items-center">
                          <Clock size={10} className="mr-1" /> {evalu.timestamp}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center border ${evalu.metrics.fcr ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-700'}`}>
                      <CheckCircle size={16} />
                    </div>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <div className="flex items-center justify-center space-x-1">
                       <Star size={14} className="text-amber-400 fill-amber-400" />
                       <span className="font-black text-white text-sm">{evalu.metrics.csat}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <div className="flex flex-col items-center">
                       <span className={`text-xs font-black ${evalu.metrics.compliance >= 90 ? 'text-emerald-400' : 'text-rose-400'}`}>{evalu.metrics.compliance}%</span>
                       <div className="w-16 h-1 bg-slate-900 rounded-full mt-1.5 overflow-hidden">
                          <div className={`h-full ${evalu.metrics.compliance >= 90 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${evalu.metrics.compliance}%` }}></div>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <span className="text-xl font-black text-white tracking-tighter">{evalu.finalScore.toFixed(1)}%</span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      evalu.status === 'PASSED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      evalu.status === 'RECALIBRATION' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                      'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                       {evalu.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Evaluation Scorecard Modal */}
      {isModalOpen && selectedEval && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-6xl glass rounded-[64px] border border-slate-700/50 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[95vh]">
             
             {isAiAnalyzing && (
               <div className="absolute inset-0 z-[210] bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-6 text-center p-10">
                  <div className="relative">
                     <div className="w-24 h-24 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
                     <Sparkles size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-[0.2em]">Neural Objective Audit</h3>
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest animate-pulse">Analizando transcript para extraer métricas de FCR y Compliance...</p>
               </div>
             )}

             <div className="p-10 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                   <div className="w-16 h-16 rounded-[24px] bg-emerald-600/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-inner">
                      <Award size={36} />
                   </div>
                   <div>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Objective Quality Scorecard</h3>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">Auditoría Estructural v4.7.9</p>
                   </div>
                </div>
                <div className="flex items-center space-x-4">
                   <button 
                    onClick={handleAiAudit}
                    className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-[20px] transition-all shadow-xl active:scale-95 group"
                   >
                     <BrainCircuit size={20} className="group-hover:rotate-12 transition-transform" />
                     <span className="text-[11px] font-black uppercase tracking-widest">Auto-Score Gemini</span>
                   </button>
                   <button onClick={() => setIsModalOpen(false)} className="p-4 bg-slate-800 hover:bg-rose-500/10 rounded-[20px] text-slate-500 hover:text-rose-400 transition-all border border-slate-700 shadow-xl"><X size={24} /></button>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-12 grid grid-cols-1 md:grid-cols-12 gap-12 scrollbar-hide">
                {/* Column 1: Objective KPIs */}
                <div className="md:col-span-5 space-y-10">
                   <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] border-b-2 border-slate-800 pb-4 flex items-center">
                     <Target size={14} className="mr-2" /> KPI Matrix
                   </h4>
                   
                   <div className="space-y-8">
                      {/* FCR TOGGLE */}
                      <div className="flex items-center justify-between p-6 bg-slate-900 border border-slate-800 rounded-3xl">
                         <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-xl ${selectedEval.metrics.fcr ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-950 text-slate-600'}`}>
                               <CheckCircle2 size={24} />
                            </div>
                            <div>
                               <p className="text-xs font-black text-white uppercase">First Call Resolution</p>
                               <p className="text-[9px] text-slate-500 font-bold uppercase">¿Se resolvió el requerimiento?</p>
                            </div>
                         </div>
                         <button 
                          onClick={() => setSelectedEval({...selectedEval, metrics: {...selectedEval.metrics, fcr: !selectedEval.metrics.fcr}})}
                          className={`w-14 h-7 rounded-full relative transition-all duration-500 ${selectedEval.metrics.fcr ? 'bg-emerald-600 shadow-[0_0_15px_#10b98140]' : 'bg-slate-800'}`}
                         >
                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-500 ${selectedEval.metrics.fcr ? 'right-1' : 'left-1'}`}></div>
                         </button>
                      </div>

                      {/* AHT DISPLAY */}
                      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                         <div className="flex justify-between items-center px-1">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Average Handle Time (AHT)</p>
                            <span className="text-lg font-black text-blue-400 font-mono">{selectedEval.metrics.aht}s</span>
                         </div>
                         <input 
                           type="range" min="0" max="600" step="10"
                           value={selectedEval.metrics.aht}
                           onChange={(e) => setSelectedEval({...selectedEval, metrics: {...selectedEval.metrics, aht: parseInt(e.target.value)}})}
                           className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500" 
                         />
                      </div>

                      {/* CSAT STARS */}
                      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Customer Satisfaction (CSAT)</p>
                         <div className="flex justify-center space-x-4">
                            {[1,2,3,4,5].map(star => (
                              <button 
                                key={star}
                                onClick={() => setSelectedEval({...selectedEval, metrics: {...selectedEval.metrics, csat: star}})}
                                className={`transition-all ${selectedEval.metrics.csat >= star ? 'scale-125 text-amber-400' : 'text-slate-800 hover:text-slate-600'}`}
                              >
                                 <Star size={32} fill={selectedEval.metrics.csat >= star ? 'currentColor' : 'none'} />
                              </button>
                            ))}
                         </div>
                      </div>

                      {/* INTERNAL QUALITY & COMPLIANCE SLIDERS */}
                      <div className="space-y-8 p-8 bg-slate-950/60 rounded-[40px] border border-slate-800 shadow-inner">
                         <div className="space-y-4">
                            <div className="flex justify-between items-center">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Internal Quality Score</label>
                               <span className="text-xs font-mono font-black text-purple-400">{selectedEval.metrics.quality}%</span>
                            </div>
                            <input 
                              type="range" min="0" max="100" step="5"
                              value={selectedEval.metrics.quality}
                              onChange={(e) => setSelectedEval({...selectedEval, metrics: {...selectedEval.metrics, quality: parseInt(e.target.value)}})}
                              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500" 
                            />
                         </div>
                         <div className="space-y-4">
                            <div className="flex justify-between items-center">
                               <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Compliance Index (Risk)</label>
                               <span className="text-xs font-mono font-black text-rose-500">{selectedEval.metrics.compliance}%</span>
                            </div>
                            <input 
                              type="range" min="0" max="100" step="5"
                              value={selectedEval.metrics.compliance}
                              onChange={(e) => setSelectedEval({...selectedEval, metrics: {...selectedEval.metrics, compliance: parseInt(e.target.value)}})}
                              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500" 
                            />
                         </div>
                      </div>
                   </div>
                </div>

                {/* Column 2: Insights & Qualitative Data */}
                <div className="md:col-span-7 space-y-10">
                   <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] border-b-2 border-slate-800 pb-4 flex items-center">
                     <FileText size={14} className="mr-2" /> Forensic Insights
                   </h4>

                   {selectedEval.summary && (
                     <div className="space-y-4 animate-in slide-in-from-bottom-2">
                        <div className="p-8 bg-slate-900 border border-slate-800 rounded-[40px] relative overflow-hidden group">
                           <Quote size={48} className="absolute -top-4 -right-4 text-slate-800 group-hover:text-blue-900/20 transition-colors" />
                           <div className="flex items-center space-x-3 mb-4">
                              <Sparkles size={16} className="text-blue-400" />
                              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Neural Transcript Summary</span>
                           </div>
                           <p className="text-base text-slate-300 font-medium leading-relaxed italic relative z-10">
                              "{selectedEval.summary}"
                           </p>
                        </div>
                     </div>
                   )}

                   <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Retroalimentación Técnica</label>
                         <div className="flex space-x-2">
                            {['POSITIVE', 'NEUTRAL', 'NEGATIVE'].map(s => (
                              <button 
                                key={s}
                                onClick={() => setSelectedEval({...selectedEval, sentiment: s as any})}
                                className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase transition-all ${selectedEval.sentiment === s ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}
                              >
                                 {s}
                              </button>
                            ))}
                         </div>
                      </div>
                      <textarea 
                        value={selectedEval.comment}
                        onChange={(e) => setSelectedEval({...selectedEval, comment: e.target.value})}
                        className="w-full bg-slate-950 border-2 border-slate-800 rounded-[48px] p-10 text-sm text-slate-300 h-64 resize-none outline-none focus:border-emerald-500 shadow-inner font-medium leading-relaxed transition-all"
                        placeholder="Observaciones para el coaching y puntos de mejora..."
                      />
                   </div>

                   <div className="p-8 bg-blue-600/5 border border-blue-500/20 rounded-[40px] flex items-start space-x-6 group">
                      <div className="p-3 rounded-2xl bg-blue-600/10 text-blue-400 group-hover:rotate-6 transition-transform">
                         <Scale size={24} />
                      </div>
                      <div>
                         <h5 className="text-xs font-black text-white uppercase tracking-widest mb-1">Criterio de Evaluación Objetiva</h5>
                         <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-wider">
                            Este reporte se calibra contra los estándares ISO-9001 del Call Center. El puntaje final se promedia ponderando el <span className="text-white">Compliance</span> como factor crítico de aprobación.
                         </p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="p-10 bg-slate-900/60 border-t border-slate-800 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                   <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
                      <ShieldCheck size={18} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">Protocolo de Calidad v4.7.9</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase">Auditor: Admin Root</p>
                   </div>
                </div>
                <div className="flex items-center space-x-6">
                   <div className="text-right">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Final Calibration</p>
                      <p className="text-3xl font-black text-white tracking-tighter">
                         {((selectedEval.metrics.quality + selectedEval.metrics.compliance) / 2).toFixed(1)}%
                      </p>
                   </div>
                   <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-4 bg-emerald-600 hover:bg-emerald-500 text-white px-16 py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.3em] shadow-xl transition-all active:scale-95 disabled:opacity-50"
                   >
                     {isSaving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                     <span>Sellar Evaluación Final</span>
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QualityAssurance;

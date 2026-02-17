
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GitMerge, Database, Bot, 
  ShieldCheck, MessageSquare, 
  Radio, UserCog, ShieldAlert, 
  LayoutDashboard, Share2, Shield, 
  Phone, Cpu, Search,
  Zap, Activity as ActivityIcon,
  Mic, FileSearch, Headphones,
  Server, Network, Terminal, MessageCircle, Smartphone,
  Sparkles, Layers, ArrowRight, ChevronRight, Clock,
  Lock, Globe, Cloud, Workflow as WorkflowIcon,
  BarChart3, Target, Heart, MousePointer2,
  // Added missing import
  Monitor
} from 'lucide-react';

interface WorkflowStep {
  icon: any;
  label: string;
  desc: string;
  path: string;
  isLast?: boolean;
  status?: 'HEALTHY' | 'SYNCING' | 'ALERT';
  technicalDetail: string;
}

interface Workflow {
  title: string;
  description: string;
  configPath: string;
  accent: string;
  fullLogic: string;
  steps: WorkflowStep[];
}

const Workflows: React.FC = () => {
  const [activeWorkflow, setActiveWorkflow] = useState<number>(0);
  const navigate = useNavigate();

  const workflowSteps: Workflow[] = [
    {
      title: "Ciclo de Vida del Lead (Data Pipeline)",
      description: "Flujo del dato desde la ingesta en PostgreSQL hasta la tipificación final.",
      configPath: "/lists",
      accent: "blue",
      fullLogic: "Este flujo describe cómo Nexus Pro gestiona los prospectos. El dato inicia en el 'Data Warehouse', es filtrado por la capa de cumplimiento (DNC) y se inyecta en el Hopper de memoria RAM para garantizar que no haya latencia al momento de que un agente quede libre. Una vez contactado, la IA audita la respuesta y actualiza el CRM externo.",
      steps: [
        { icon: Database, label: "Data Warehouse", desc: "Almacenamiento persistente de leads.", path: "/lists", technicalDetail: "PostgreSQL 16 optimizado con índices B-Tree sobre el campo phone_number.", status: 'HEALTHY' },
        { icon: Shield, label: "DNC Scrubbing", desc: "Filtrado automático de números bloqueados.", path: "/dnc", technicalDetail: "Validación contra listas negras federales y locales mediante un sub-proceso de limpieza de alta velocidad.", status: 'HEALTHY' },
        { icon: Layers, label: "Hopper Engine", desc: "Búfer de prioridad para el marcado.", path: "/campaigns", technicalDetail: "Cola circular que se refresca cada 60 segundos basándose en el 'Lead Order' de la campaña.", status: 'HEALTHY' },
        { icon: Smartphone, label: "Dialer Ingestion", desc: "Entrega del lead al motor SIP.", path: "/agent", technicalDetail: "Comando 'originate' enviado via mod_esl para conectar el lead con la conferencia del agente.", status: 'SYNCING' }
      ]
    },
    {
      title: "Arquitectura de Voz (Media Plane)",
      description: "Puenteo de señales WebRTC y procesamiento de audio forense.",
      configPath: "/telephony",
      accent: "emerald",
      fullLogic: "La voz se captura en el navegador del agente vía WebRTC (Verto). El servidor FreeSwitch actúa como un MCU (Media Control Unit), anclando al agente en una conferencia permanente mientras 'dispara' llamadas hacia los carriers externos. Todo el audio es procesado para detección de voz (VAD) y grabado en formato WAV lineal.",
      steps: [
        { icon: Network, label: "Verto Signaling", desc: "Señalización WSS cifrada (TLS 1.3).", path: "/telephony", technicalDetail: "Protocolo JSON-RPC sobre WebSockets puerto 8089.", status: 'HEALTHY' },
        { icon: Phone, label: "Sofia Gateways", desc: "Registro con carriers mundiales.", path: "/telephony", technicalDetail: "Manejo de perfiles internos (agentes) y externos (troncales) con NAT transversal automático.", status: 'HEALTHY' },
        { icon: Mic, label: "Linear Recording", desc: "Captura forense de alta fidelidad.", path: "/storage", technicalDetail: "Escritura asíncrona en disco para evitar jitter en la llamada mediante mod_native_file.", status: 'HEALTHY' },
        { icon: Server, label: "Storage Plane", desc: "Archivo y compresión de medios.", path: "/storage", technicalDetail: "Transcodificación a MP3/GSM y movimiento a nodos de archivo tras 90 días.", status: 'HEALTHY' }
      ]
    },
    {
      title: "Neural QA Pipeline (IA Audit)",
      description: "Análisis automático de calidad mediante modelos Gemini 3 Flash.",
      configPath: "/ai-studio",
      accent: "purple",
      fullLogic: "Nexus Pro no requiere que supervisores humanos escuchen cada llamada. Al finalizar una grabación, se dispara un evento que envía el audio al motor Gemini. Este extrae la intención del cliente, califica la empatía del agente y actualiza el Dashboard de Inteligencia con métricas objetivas de negocio.",
      steps: [
        { icon: Bot, label: "Inference Engine", desc: "Gemini procesando audio/texto.", path: "/ai-studio", technicalDetail: "Uso de Multimodal Context para analizar entonación y palabras clave simultáneamente.", status: 'HEALTHY' },
        { icon: MessageSquare, label: "Sentiment Scoring", desc: "Detección de emociones del cliente.", path: "/qa", technicalDetail: "Clasificación semántica en escalas de -1.0 a +1.0.", status: 'HEALTHY' },
        { icon: ShieldCheck, label: "Compliance Audit", desc: "Verificación de scripts legales.", path: "/qa", technicalDetail: "Validación de frases obligatorias y avisos de privacidad requeridos por ley.", status: 'HEALTHY' },
        { icon: BarChart3, label: "BI Update", desc: "Inyección de KPIs en el Dashboard.", path: "/reports", technicalDetail: "Actualización de tablas de performance de agentes en PostgreSQL en tiempo real.", status: 'HEALTHY' }
      ]
    }
  ];

  const FlowNode: React.FC<WorkflowStep> = ({ icon: Icon, label, desc, path, isLast, status, technicalDetail }) => (
    <div className="flex items-start group">
      <div className="flex flex-col items-center">
        <button 
          onClick={() => navigate(path)}
          className={`w-24 h-24 rounded-[36px] bg-slate-950 border-2 border-slate-800 flex items-center justify-center transition-all relative z-10 hover:scale-110 hover:border-blue-500 shadow-2xl overflow-hidden`}
        >
           <Icon size={36} className="text-slate-500 group-hover:text-blue-400 transition-colors duration-300" />
           <div className={`absolute top-2 right-2 p-1.5 ${status === 'HEALTHY' ? 'text-emerald-500' : status === 'SYNCING' ? 'text-blue-400' : 'text-rose-500'}`}>
              <div className={`w-2.5 h-2.5 rounded-full bg-current ${status === 'SYNCING' ? 'animate-ping' : ''} shadow-[0_0_10px_currentColor]`}></div>
           </div>
        </button>
        {!isLast && (
          <div className="w-1.5 h-24 bg-gradient-to-b from-blue-500/20 via-slate-800/40 to-transparent"></div>
        )}
      </div>
      <div 
        onClick={() => navigate(path)}
        className="ml-12 pt-4 cursor-pointer flex-1 group"
      >
         <div className="flex items-center space-x-4 mb-2">
            <h4 className="font-black text-white text-2xl uppercase tracking-tighter group-hover:text-blue-400 transition-all duration-300">{label}</h4>
            <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[8px] font-black text-slate-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Ver Módulo</span>
         </div>
         <p className="text-sm text-slate-300 font-medium max-w-lg mb-3 leading-relaxed">
            {desc}
         </p>
         <div className="p-4 bg-black/40 rounded-2xl border border-slate-900/50 max-w-md group-hover:border-blue-500/20 transition-all">
            <p className="text-[10px] font-mono text-slate-600 leading-relaxed italic">
              <span className="text-blue-500 font-black">@TECH:</span> {technicalDetail}
            </p>
         </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase flex items-center">
            <WorkflowIcon className="mr-5 text-blue-500" size={42} />
            Nexus Architecture Blueprints
          </h2>
          <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">Mapa estratégico de procesos e interacciones v4.7.9.</p>
        </div>
        <div className="flex items-center space-x-4">
           <div className="bg-slate-900 border-2 border-slate-800 px-6 py-3.5 rounded-[28px] flex items-center space-x-4 shadow-inner">
              <div className="flex -space-x-2">
                 {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-blue-600 border-2 border-slate-900 shadow-lg"></div>)}
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sync Multi-Nodo Activo</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* Selector de Flujos */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
           {workflowSteps.map((wf, idx) => (
             <button
              key={idx}
              onClick={() => setActiveWorkflow(idx)}
              className={`w-full p-10 rounded-[48px] border-2 text-left transition-all relative overflow-hidden group ${
                activeWorkflow === idx 
                  ? 'bg-blue-600/10 border-blue-500 shadow-2xl scale-[1.03] z-10' 
                  : 'glass border-slate-800 hover:bg-slate-800/40 opacity-70 hover:opacity-100'
              }`}
             >
               <div className="flex justify-between items-center mb-4">
                  <h3 className={`font-black text-base uppercase tracking-[0.1em] ${activeWorkflow === idx ? 'text-white' : 'text-slate-500'}`}>
                    {wf.title}
                  </h3>
                  {activeWorkflow === idx && <Zap size={18} className="text-blue-400 animate-pulse" />}
               </div>
               <p className="text-[11px] text-slate-500 font-bold uppercase leading-relaxed">{wf.description}</p>
               {activeWorkflow === idx && (
                 <div className="absolute top-0 right-0 p-8 opacity-5 text-blue-400 pointer-events-none transform translate-x-10 translate-y-[-10px]">
                    <GitMerge size={120} />
                 </div>
               )}
             </button>
           ))}
        </div>

        {/* Canvas de Visualización de Flujo */}
        <div className="col-span-12 lg:col-span-8">
           <div className="glass p-16 rounded-[72px] border border-slate-700/50 shadow-[0_0_80px_rgba(0,0,0,0.4)] relative overflow-hidden h-full min-h-[850px] flex flex-col bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.05),_transparent)]">
              
              <div className="relative z-10 flex flex-col h-full">
                 <div className="flex flex-col mb-16 space-y-6">
                    <div className="flex items-center space-x-6">
                       <div className="w-20 h-20 rounded-[32px] bg-blue-600 flex items-center justify-center text-white shadow-2xl group-hover:rotate-12 transition-transform">
                          <Zap size={42} fill="currentColor" />
                       </div>
                       <div>
                          <h3 className="text-5xl font-black text-white uppercase tracking-tighter leading-none mb-2">{workflowSteps[activeWorkflow].title}</h3>
                          <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.4em]">Detailed System Interaction v4.7.9</p>
                       </div>
                    </div>
                    <div className="p-8 bg-slate-900/60 rounded-[40px] border border-slate-800 shadow-inner">
                       <p className="text-base text-slate-400 font-medium leading-relaxed italic">
                          "{workflowSteps[activeWorkflow].fullLogic}"
                       </p>
                    </div>
                 </div>

                 <div className="flex-1 space-y-0 pl-10 overflow-y-auto scrollbar-hide">
                    {workflowSteps[activeWorkflow].steps.map((step, idx) => (
                      <FlowNode 
                        key={idx} 
                        {...step}
                        isLast={idx === workflowSteps[activeWorkflow].steps.length - 1} 
                      />
                    ))}
                 </div>

                 <div className="mt-16 pt-10 border-t border-slate-800 flex justify-between items-center opacity-50">
                    <div className="flex items-center space-x-4">
                       <div className="p-2 bg-blue-600/10 rounded-lg"><Monitor size={16} className="text-blue-500" /></div>
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Esquema verificado por Nexus Core Architect</span>
                    </div>
                    <div className="flex items-center space-x-2">
                       <ShieldCheck size={14} className="text-emerald-500" />
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">ISO-27001 Infrastructure Standard</span>
                    </div>
                 </div>
              </div>
              
              {/* Grid de fondo decorativo */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[length:40px_40px] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Workflows;

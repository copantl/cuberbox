
import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Terminal, Cpu, ShieldCheck, Globe, Sliders, Bot, Users, 
  Database, HardDrive, Search, ChevronRight, X, Info, Zap, Shield, 
  Sparkles, Network, Layers, Smartphone, Box, Server, Key, History,
  Trash2, Lock, Activity, FileText, Code, CheckCircle2, AlertCircle,
  Play, Headphones, TerminalSquare, GitMerge, MessageCircle, Share2,
  Music, Smartphone as PhoneIcon, BarChart3, Target, Mic, PhoneIncoming,
  // Added missing imports
  ListChecks, Copy
} from 'lucide-react';
// Added missing useToast import
import { useToast } from '../ToastContext';

interface ManualStep {
  title: string;
  desc: string;
  code?: string;
}

interface ManualEntry {
  id: string;
  title: string;
  icon: any;
  category: 'OPERACIONES' | 'INFRAESTRUCTURA' | 'AI & NEURAL' | 'ADMINISTRACIÓN';
  summary: string;
  functionality: string;
  usage: string;
  steps: ManualStep[];
  technicalNote?: string;
}

const MANUAL_DATABASE: ManualEntry[] = [
  {
    id: 'agent-terminal-pro',
    title: 'Terminal de Agente Blended',
    icon: Headphones,
    category: 'OPERACIONES',
    summary: 'Interfaz unificada para la gestión de tráfico entrante, saliente y omnicanal.',
    functionality: 'La terminal opera sobre el protocolo Verto (WebRTC), permitiendo comunicación de baja latencia sin necesidad de softphones externos. Gestiona estados de pausa, marcación manual, scripts dinámicos y matrices de tipificación con hotkeys.',
    usage: '1. Inicie sesión con su extensión. 2. Active el modo "Ready". 3. Al recibir un lead, el Script se inyectará automáticamente con los datos del cliente. 4. Use la matriz derecha para tipificar en menos de 2 segundos.',
    steps: [
      { title: 'Anclaje de Sesión', desc: 'Al entrar, el sistema realiza una llamada de anclaje a la sala de conferencia 8600+EXT para mantener el canal de audio abierto.' },
      { title: 'Gestión de Pausas', desc: 'Utilice los Pause Codes configurados (Almuerzo, Break, etc.) para detener la inyección de leads del Hopper.' },
      { title: 'Transferencias', desc: 'Habilite el panel de transferencias para mover llamadas a colas de supervisión o niveles superiores de venta.' }
    ]
  },
  {
    id: 'predictive-dialer-core',
    title: 'Motor Predictivo & Hopper',
    icon: Zap,
    category: 'INFRAESTRUCTURA',
    summary: 'Algoritmo de marcación adaptativa basado en probabilidad y tasa de abandono.',
    functionality: 'El motor calcula el "Dial Ratio" dinámicamente. El Hopper actúa como un búfer de memoria pre-cargando los mejores leads de la base de datos para inyectarlos en el marcador en microsegundos cuando un agente queda libre.',
    usage: 'Configura el "Auto Dial Level" en la campaña. Un nivel de 4.0 significa que el sistema marcará 4 líneas por cada agente libre, ajustándose según el Drop Rate detectado.',
    steps: [
      { title: 'Configuración de Ratio', desc: 'Ajuste el multiplicador según la contactabilidad de la base. Ratios altos para bases frías, bajos para bases calientes.' },
      { title: 'AMD (Answering Machine Detection)', desc: 'Active el filtrado de buzones para que el sistema cuelgue automáticamente las máquinas y solo pase humanos al agente.' },
      { title: 'Hopper Flush', desc: 'Use esta función si cambia la prioridad de las listas para limpiar la cola actual de marcación.' }
    ]
  },
  {
    id: 'ai-studio-gemini',
    title: 'AI Studio & Coaching',
    icon: Bot,
    category: 'AI & NEURAL',
    summary: 'Integración de Gemini 3 Pro para análisis semántico y asistencia en vivo.',
    functionality: 'Utiliza modelos LLM para auditar el 100% de las grabaciones, detectar sentimientos, extraer compromisos de pago y sugerir respuestas al agente en el Hub Omnicanal.',
    usage: 'En el módulo AI Studio, defina el "System Instruction" de su bot. Vincule el bot a una campaña para habilitar la auditoría automática post-llamada.',
    steps: [
      { title: 'Neural Prompting', desc: 'Escriba instrucciones detalladas sobre el tono y los KPIs que la IA debe evaluar en cada interacción.' },
      { title: 'Sentiment Analysis', desc: 'La IA calificará cada llamada como POSITIVA, NEUTRAL o NEGATIVA basándose en la transcripción del audio.' },
      { title: 'Auto-Scoring', desc: 'El sistema genera una nota de calidad (QA) sin intervención humana, reduciendo costos de supervisión.' }
    ]
  },
  {
    id: 'cluster-ha-config',
    title: 'Clúster y Alta Disponibilidad',
    icon: ShieldCheck,
    category: 'INFRAESTRUCTURA',
    summary: 'Arquitectura distribuida para garantizar 99.99% de uptime.',
    functionality: 'Nexus Pro utiliza Keepalived para gestionar una Virtual IP (VIP). Si el nodo maestro falla, un nodo esclavo asume la identidad de red en menos de 2 segundos, manteniendo las llamadas activas.',
    usage: 'Monitoree el estado de los nodos en el "Clúster Monitor". Use el botón de "Promote Master" solo en caso de mantenimiento programado del servidor principal.',
    steps: [
      { title: 'Vínculo PostgreSQL', desc: 'Asegure que todos los nodos apunten al clúster de base de datos con replicación síncrona habilitada.' },
      { title: 'Sofia Sync', desc: 'Los perfiles de SIP se sincronizan automáticamente para que los Carriers estén registrados en todos los nodos simultáneamente.' }
    ]
  }
];

const UserManual: React.FC = () => {
  // Initialized useToast hook
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<ManualEntry | null>(MANUAL_DATABASE[0]);

  const filteredManual = useMemo(() => {
    if (!searchQuery) return MANUAL_DATABASE;
    return MANUAL_DATABASE.filter(s => 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.functionality.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center space-x-3 bg-blue-500/10 border border-blue-500/20 px-6 py-2.5 rounded-full mb-2">
          <Sparkles size={18} className="text-blue-400 animate-pulse" />
          <span className="text-[11px] font-black text-blue-400 uppercase tracking-[0.4em]">Nexus Knowledge Base v4.7.9</span>
        </div>
        <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">Manual de Operación Crítica</h1>
        <p className="text-slate-500 text-sm max-w-2xl mx-auto font-bold uppercase tracking-widest">Documentación exhaustiva para administradores y operadores de alto rendimiento.</p>
        <div className="relative max-w-2xl mx-auto mt-10">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={24} />
          <input 
            type="text"
            placeholder="Buscar por componente (Hopper, Dialer, Verto, Gemini)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/60 border-2 border-slate-800 rounded-[32px] pl-16 pr-12 py-6 text-base text-white outline-none focus:border-blue-500 transition-all shadow-inner font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10 flex-1 min-h-0">
        {/* Sidebar de Navegación */}
        <div className="col-span-12 lg:col-span-4 space-y-8 overflow-y-auto scrollbar-hide pr-2">
           {['OPERACIONES', 'AI & NEURAL', 'INFRAESTRUCTURA', 'ADMINISTRACIÓN'].map(cat => {
             const items = filteredManual.filter(e => e.category === cat);
             if (items.length === 0) return null;
             return (
               <div key={cat} className="space-y-4">
                  <div className="flex items-center space-x-3 px-4">
                    <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">{cat}</h4>
                  </div>
                  <div className="space-y-2">
                     {items.map(entry => (
                       <button
                        key={entry.id}
                        onClick={() => setSelectedEntry(entry)}
                        className={`w-full flex items-center p-5 rounded-[28px] border-2 transition-all relative overflow-hidden group ${
                          selectedEntry?.id === entry.id ? 'bg-blue-600/10 border-blue-500 shadow-xl' : 'glass border-slate-800 hover:bg-slate-800/40 hover:border-slate-700'
                        }`}
                       >
                          <div className={`p-3 rounded-2xl mr-5 transition-all ${selectedEntry?.id === entry.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-900 text-slate-600 group-hover:text-blue-400'}`}>
                             <entry.icon size={22} />
                          </div>
                          <div className="text-left min-w-0">
                            <span className={`text-[12px] font-black uppercase tracking-widest block truncate ${selectedEntry?.id === entry.id ? 'text-white' : 'text-slate-400'}`}>{entry.title}</span>
                            <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest truncate">{entry.summary.slice(0, 40)}...</span>
                          </div>
                          {selectedEntry?.id === entry.id && <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
                       </button>
                     ))}
                  </div>
               </div>
             );
           })}
        </div>

        {/* Contenido Detallado */}
        <div className="col-span-12 lg:col-span-8 h-full">
           {selectedEntry ? (
             <div className="glass h-full rounded-[64px] border border-slate-700/50 shadow-2xl overflow-y-auto scrollbar-hide p-14 space-y-12 animate-in slide-in-from-right-10 duration-500 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.03),_transparent)]">
                <div className="flex items-center justify-between border-b border-slate-800 pb-10">
                   <div className="flex items-center space-x-8">
                      <div className="w-24 h-24 rounded-[36px] flex items-center justify-center shadow-2xl border-4 border-white/5 bg-blue-600 text-white transform -rotate-3 group-hover:rotate-0 transition-transform">
                          <selectedEntry.icon size={48} />
                      </div>
                      <div>
                          <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] mb-3 block">{selectedEntry.category}</span>
                          <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">{selectedEntry.title}</h2>
                      </div>
                   </div>
                   <div className="text-right hidden xl:block">
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Protocol ID</p>
                      <p className="text-xs font-mono font-black text-slate-400 mt-1">{selectedEntry.id}</p>
                   </div>
                </div>

                <section className="space-y-6">
                   <div className="flex items-center space-x-4">
                      <Info className="text-blue-400" size={24} />
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">Funcionalidad del Componente</h3>
                   </div>
                   <p className="text-lg text-slate-400 leading-relaxed font-medium bg-slate-900/40 p-8 rounded-[40px] border border-slate-800 shadow-inner">
                      {selectedEntry.functionality}
                   </p>
                </section>

                <section className="space-y-6">
                   <div className="flex items-center space-x-4">
                      <Smartphone className="text-emerald-400" size={24} />
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">Guía de Manejo y Uso</h3>
                   </div>
                   <p className="text-base text-slate-400 leading-relaxed font-medium border-l-4 border-emerald-500 pl-8">
                      {selectedEntry.usage}
                   </p>
                </section>

                <div className="space-y-10">
                   <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center">
                     <ListChecks className="mr-4 text-amber-500" /> Secuencia Lógica Paso a Paso
                   </h3>
                   {selectedEntry.steps.map((step, i) => (
                      <div key={i} className="p-10 bg-slate-950 border border-slate-800 rounded-[48px] shadow-xl space-y-6 group hover:border-blue-500/30 transition-all">
                         <div className="flex items-center space-x-5">
                            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 flex items-center justify-center font-black text-sm text-blue-400 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all">
                               {i+1}
                            </div>
                            <h4 className="text-xl font-black text-white uppercase tracking-tight">{step.title}</h4>
                         </div>
                         <p className="text-slate-500 font-medium pl-14 group-hover:text-slate-300 transition-colors">{step.desc}</p>
                         {step.code && (
                            <div className="mt-4 ml-14 bg-black rounded-3xl p-8 border border-slate-800 shadow-inner relative group/code">
                               <div className="flex justify-between items-center mb-5">
                                  <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">Engine Logic / Configuration Script</span>
                                  <Code size={14} className="text-blue-500 opacity-40" />
                               </div>
                               <pre className="text-sm font-mono text-blue-400/90 overflow-x-auto scrollbar-hide"><code>{step.code}</code></pre>
                               <button onClick={() => { navigator.clipboard.writeText(step.code!); toast('Código copiado.', 'info'); }} className="absolute bottom-6 right-6 p-3 bg-slate-900 rounded-xl text-slate-500 hover:text-white transition-all opacity-0 group-hover/code:opacity-100">
                                  <Copy size={16} />
                                </button>
                            </div>
                         )}
                      </div>
                   ))}
                </div>

                <div className="p-10 bg-blue-600/5 border border-blue-500/20 rounded-[48px] flex items-start space-x-8 group">
                   <div className="p-4 rounded-3xl bg-blue-600/10 text-blue-400 group-hover:scale-110 transition-transform">
                      <ShieldCheck size={32} />
                   </div>
                   <div>
                      <h5 className="text-lg font-black text-white uppercase tracking-widest mb-2">Certificación de Integridad</h5>
                      <p className="text-xs text-slate-500 font-bold leading-relaxed uppercase tracking-wider">
                         Esta documentación es generada dinámicamente y sincronizada con el <span className="text-blue-400">Core Engine v4.7.9</span>. Cualquier discrepancia técnica debe ser reportada al administrador del clúster inmediatamente.
                      </p>
                   </div>
                </div>
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center h-full text-center opacity-20">
                <BookOpen size={120} className="mb-8" />
                <h3 className="text-3xl font-black uppercase tracking-[0.4em]">Wiki Nexus Pro</h3>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default UserManual;

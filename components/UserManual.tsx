
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
    usage: 'Para comenzar a trabajar, el agente debe seguir un flujo lógico que garantiza que el sistema lo reconozca como activo y listo para recibir clientes.',
    steps: [
      { title: 'Paso 1: Inicio de Sesión y Anclaje', desc: 'Ingrese sus credenciales y extensión. El sistema realizará automáticamente una llamada a su navegador. Debe contestar esta llamada; es el "puente de audio" que lo mantendrá conectado con el servidor durante toda su jornada.' },
      { title: 'Paso 2: Selección de Campaña', desc: 'Elija la campaña en la que va a trabajar. Esto cargará los scripts, bases de datos y reglas de marcación específicas para ese proyecto.' },
      { title: 'Paso 3: Ponerse en modo "Ready"', desc: 'Haga clic en el botón verde de "Ready". A partir de este momento, el motor predictivo comenzará a enviarle llamadas o mensajes de redes sociales de forma automática.' },
      { title: 'Paso 4: Gestión de la Interacción', desc: 'Cuando entre una llamada, verá los datos del cliente en pantalla. Siga el script sugerido. Al terminar, use la matriz de botones a la derecha para indicar qué sucedió (Venta, No Contesta, etc.).' },
      { title: 'Paso 5: Uso de Pausas', desc: 'Si necesita retirarse de su puesto, use el menú de Pausas. Elija el motivo correcto (Almuerzo, Capacitación, etc.). Esto es vital para que el supervisor sepa por qué no está recibiendo llamadas.' }
    ]
  },
  {
    id: 'predictive-dialer-core',
    title: 'Motor Predictivo & Hopper',
    icon: Zap,
    category: 'INFRAESTRUCTURA',
    summary: 'Algoritmo de marcación adaptativa basado en probabilidad y tasa de abandono.',
    functionality: 'El motor calcula el "Dial Ratio" dinámicamente. El Hopper actúa como un búfer de memoria pre-cargando los mejores leads de la base de datos para inyectarlos en el marcador en microsegundos cuando un agente queda libre.',
    usage: 'Como administrador, su objetivo es mantener a los agentes hablando el mayor tiempo posible sin generar demasiadas llamadas abandonadas.',
    steps: [
      { title: 'Paso 1: Carga de Bases de Datos', desc: 'Suba sus archivos CSV con los contactos. El sistema los procesará y los asignará a las listas correspondientes de la campaña.' },
      { title: 'Paso 2: Configuración del Hopper', desc: 'Defina cuántos leads quiere que el sistema tenga "listos" en memoria. Un valor de 500 es ideal para la mayoría de las operaciones medianas.' },
      { title: 'Paso 3: Ajuste del Nivel de Marcación', desc: 'Comience con un ratio bajo (ej. 1.5). Si nota que los agentes esperan mucho, suba el ratio. Si nota que entran llamadas y no hay agentes libres (Drop), baje el ratio inmediatamente.' },
      { title: 'Paso 4: Activación de AMD', desc: 'Habilite la detección de contestadoras. Esto ahorra tiempo a sus agentes al filtrar automáticamente los buzones de voz, entregándoles solo personas reales.' }
    ]
  },
  {
    id: 'ai-studio-gemini',
    title: 'AI Studio & Coaching',
    icon: Bot,
    category: 'AI & NEURAL',
    summary: 'Integración de Gemini 3 Pro para análisis semántico y asistencia en vivo.',
    functionality: 'Utiliza modelos LLM para auditar el 100% de las grabaciones, detectar sentimientos, extraer compromisos de pago y sugerir respuestas al agente en el Hub Omnicanal.',
    usage: 'Configure su asistente virtual para que aprenda sobre su negocio y ayude a sus agentes a cerrar más ventas.',
    steps: [
      { title: 'Paso 1: Definir la Personalidad de la IA', desc: 'En el AI Studio, escriba las instrucciones del sistema. Dígale a la IA quién es (ej: "Eres un experto en ventas inmobiliarias") y qué debe buscar en las llamadas.' },
      { title: 'Paso 2: Configurar Reglas de Evaluación', desc: 'Indique qué criterios debe calificar la IA: ¿El agente saludó correctamente? ¿Mencionó el precio? ¿Fue amable?' },
      { title: 'Paso 3: Revisión de Sentimientos', desc: 'Acceda al panel de analítica para ver el "clima" de sus llamadas. La IA marcará en rojo las conversaciones donde el cliente se notó molesto para que usted pueda intervenir.' },
      { title: 'Paso 4: Uso de Sugerencias en Vivo', desc: 'Active la asistencia para agentes. Mientras chatean por WhatsApp, la IA les sugerirá la mejor respuesta basada en el historial de la conversación.' }
    ]
  },
  {
    id: 'manual-installation-nexus',
    title: 'Guía de Instalación Manual',
    icon: TerminalSquare,
    category: 'ADMINISTRACIÓN',
    summary: 'Procedimiento paso a paso para el despliegue de la infraestructura Nexus desde cero.',
    functionality: 'Esta guía detalla la secuencia técnica necesaria para instalar FreeSwitch 1.10, PostgreSQL 16 y el stack de alta disponibilidad en servidores Debian 12/13 limpios.',
    usage: 'Esta guía es para técnicos. Siga cada paso con calma. Si un comando falla, no continúe al siguiente sin resolver el error.',
    steps: [
      { 
        title: 'Paso 0: Limpieza (Solo si tiene errores)', 
        desc: 'Si recibió errores de "Tipo echo desconocido", ejecute este comando para limpiar los archivos corruptos antes de continuar.',
        code: 'rm -f /etc/apt/sources.list.d/freeswitch.list /etc/apt/sources.list.d/pgdg.list && apt-get update'
      },
      { 
        title: 'Paso 1: Preparar el Terreno', 
        desc: 'Primero, debemos limpiar y preparar el servidor con todas las herramientas básicas que FreeSwitch necesitará.',
        code: 'apt-get update && apt-get install -y gnupg2 wget lsb-release curl build-essential cmake automake autoconf libtool libtool-bin pkg-config libssl-dev zlib1g-dev libdb-dev libncurses5-dev libsqlite3-dev libcurl4-openssl-dev libpcre3-dev libspeex-dev libspeexdsp-dev libldns-dev libedit-dev liblua5.2-dev libopus-dev libsndfile1-dev libshout3-dev libmpg123-dev python3-dev git golang-go haproxy keepalived'
      },
      { 
        title: 'Paso 2: Conectar con SignalWire', 
        desc: 'FreeSwitch requiere un token oficial para descargar sus archivos. Ingrese su token donde dice [TOKEN]. Esto le da acceso a la versión más estable y segura.',
        code: 'wget --http-user=signalwire --http-password=[TOKEN] -O - https://assignments.signalwire.com/reference/gpg/signalwire_pub.gpg | gpg --dearmor -o /usr/share/keyrings/signalwire-freeswitch-repo.gpg\necho "deb [signed-by=/usr/share/keyrings/signalwire-freeswitch-repo.gpg] https://signalwire:[TOKEN]@assignments.signalwire.com/reference/debian/$(lsb_release -sc) release main" | tee /etc/apt/sources.list.d/freeswitch.list > /dev/null\nwget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /usr/share/keyrings/postgresql-archive-keyring.gpg\necho "deb [signed-by=/usr/share/keyrings/postgresql-archive-keyring.gpg] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" | tee /etc/apt/sources.list.d/pgdg.list > /dev/null'
      },
      { 
        title: 'Paso 3: Instalación del Corazón del Sistema', 
        desc: 'Ahora instalamos las librerías de SignalWire, el motor de llamadas FreeSwitch y PostgreSQL.',
        code: 'apt-get update && apt-get install -y libks-dev signalwire-client-c-dev freeswitch-all freeswitch-mod-esl freeswitch-mod-verto postgresql-16'
      },
      { 
        title: 'Paso 4: Configurar la Base de Datos', 
        desc: 'Creamos un usuario y una base de datos segura. Piense en esto como crear la oficina donde el sistema guardará todos sus archivos importantes.',
        code: 'sudo -u postgres psql -c "CREATE USER cuberbox_admin WITH PASSWORD \'TitanPass2024!\';" \nsudo -u postgres psql -c "CREATE DATABASE cuberbox_db OWNER cuberbox_admin;"'
      },
      { 
        title: 'Paso 5: Seguridad SSL (El Candado)', 
        desc: 'Para que las llamadas por navegador funcionen, necesitamos certificados de seguridad. Esto encripta la voz para que nadie pueda escucharla externamente.',
        code: 'mkdir -p /etc/freeswitch/tls\nopenssl req -x509 -nodes -days 3650 -newkey rsa:4096 -keyout /etc/freeswitch/tls/wss.key -out /etc/freeswitch/tls/wss.crt -subj "/C=US/ST=Tech/L=Cloud/O=Cuberbox/CN=sip.tu-dominio.com"\ncat /etc/freeswitch/tls/wss.crt /etc/freeswitch/tls/wss.key > /etc/freeswitch/tls/wss.pem\nchown -R freeswitch:freeswitch /etc/freeswitch/tls'
      },
      { 
        title: 'Paso 6: Alta Disponibilidad (El Respaldo)', 
        desc: 'Configuramos un sistema que vigila el servidor. Si algo falla, el sistema de respaldo toma el control automáticamente sin que usted lo note.',
        code: 'mkdir -p /etc/keepalived\ncat <<EOF > /etc/keepalived/keepalived.conf\nvrrp_instance VI_1 {\n    state MASTER\n    interface eth0\n    virtual_router_id 51\n    priority 150\n    advert_int 1\n    authentication {\n        auth_type PASS\n        auth_pass nexus_ha_key\n    }\n    virtual_ipaddress {\n        192.168.1.100\n    }\n}\nEOF'
      },
      {
        title: 'Paso 7: Instalación del Aplicativo Cuberbox Pro',
        desc: 'Finalmente, instalamos la interfaz web y el conector de eventos. Esto es lo que usted ve y usa para gestionar sus campañas.',
        code: '# 1. Instalar Node.js y Go\ncurl -fsSL https://deb.nodesource.com/setup_20.x | bash -\napt-get install -y nodejs golang-go\n\n# 2. Clonar y Preparar\ngit clone https://github.com/copantl/cuberbox-pro.git /opt/cuberbox\ncd /opt/cuberbox\n\n# 3. Construir Backend (Go)\ncd backend\ngo build -o cuberbox-connector main.go\ncp cuberbox-connector /usr/local/bin/\n\n# 4. Construir Frontend (React)\ncd ..\nnpm install\nnpm run build\n\n# 5. Configurar como Servicio\ncat <<EOF > /etc/systemd/system/cuberbox.service\n[Unit]\nDescription=Cuberbox Pro Application\nAfter=network.target freeswitch.service\n\n[Service]\nType=simple\nWorkingDirectory=/opt/cuberbox\nExecStart=/usr/local/bin/cuberbox-connector\nRestart=always\n\n[Install]\nWantedBy=multi-user.target\nEOF\n\nsystemctl enable --now cuberbox'
      }
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

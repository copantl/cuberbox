
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Book, FileText, Settings, AlertCircle, ChevronLeft, ChevronRight, Menu, Zap, Sliders, Users } from 'lucide-react';

const MANUALS = [
  { id: 'introduccion', title: '01. Introducción', file: '/manuals/01-introduccion.md', icon: Book, description: 'Visión general de Nexus Core.' },
  { id: 'requisitos', title: '02. Requisitos', file: '/manuals/02-requisitos.md', icon: Settings, description: 'Hardware, SO y red.' },
  { id: 'instalacion', title: '03. Instalación', file: '/manuals/03-instalacion.md', icon: Zap, description: 'Guía paso a paso (ISO/Script).' },
  { id: 'configuracion', title: '04. Configuración', file: '/manuals/04-configuracion.md', icon: Sliders, description: 'Ajustes post-instalación.' },
  { id: 'administracion', title: '05. Administración', file: '/manuals/05-administracion.md', icon: Users, description: 'Gestión de agentes y campañas.' },
  { id: 'resolucion', title: '06. Resolución', file: '/manuals/06-resolucion-problemas.md', icon: AlertCircle, description: 'Solución de fallos comunes.' },
];

const ManualsViewer: React.FC = () => {
  const [selectedManual, setSelectedManual] = useState(MANUALS[0]);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(selectedManual.file)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.text();
      })
      .then(text => {
        setContent(text);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setContent('# Error al cargar el manual\nNo se pudo encontrar el archivo: ' + selectedManual.file);
        setLoading(false);
      });
  }, [selectedManual]);

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Documentación Nexus</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Guía completa de despliegue y operación</p>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-3 glass rounded-2xl text-slate-400 hover:text-white transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'col-span-12 lg:col-span-4 xl:col-span-3' : 'hidden lg:block lg:col-span-1'} space-y-4 transition-all duration-500 overflow-y-auto scrollbar-hide`}>
          <div className="glass rounded-[32px] border border-slate-800 p-4 space-y-2">
            {MANUALS.map(manual => (
              <button
                key={manual.id}
                onClick={() => setSelectedManual(manual)}
                className={`w-full flex items-start p-4 rounded-2xl border-2 transition-all text-left ${
                  selectedManual.id === manual.id 
                    ? 'bg-blue-600/10 border-blue-500 text-white' 
                    : 'border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                <div className={`p-2 rounded-xl mr-3 ${selectedManual.id === manual.id ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-500'}`}>
                  <manual.icon size={18} />
                </div>
                <div className={`${!sidebarOpen && 'lg:hidden'}`}>
                  <span className="text-[11px] font-black uppercase tracking-widest block">
                    {manual.title}
                  </span>
                  <span className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">
                    {manual.description}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="glass rounded-[32px] border border-slate-800 p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileText size={16} className="text-blue-500" />
              </div>
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Recursos ISO</h4>
            </div>
            <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
              Use el archivo preseed para automatizar la instalación de Debian 12 con Nexus Core.
            </p>
            <div className="grid grid-cols-1 gap-2">
              <a 
                href="/iso/preseed.cfg" 
                download 
                className="flex items-center justify-center space-x-2 w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
              >
                <span>Descargar Preseed</span>
              </a>
              <a 
                href="/build-iso.sh" 
                download 
                className="flex items-center justify-center space-x-2 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
              >
                <span>Script ISO Builder</span>
              </a>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={`${sidebarOpen ? 'col-span-12 lg:col-span-8 xl:col-span-9' : 'col-span-12 lg:col-span-11'} h-full transition-all duration-500`}>
          <div className="glass h-full rounded-[48px] border border-slate-800 shadow-2xl overflow-y-auto scrollbar-hide p-10 lg:p-20 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.02),_transparent)]">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Sincronizando...</span>
                </div>
              </div>
            ) : (
              <article className="prose prose-invert prose-slate max-w-none prose-headings:uppercase prose-headings:tracking-tighter prose-headings:font-black prose-p:text-slate-400 prose-p:leading-relaxed prose-strong:text-white prose-code:text-blue-400 prose-pre:bg-slate-900/50 prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-3xl">
                <div className="markdown-body">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              </article>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualsViewer;

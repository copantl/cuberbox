
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Download, Printer, ArrowLeft, FileText, Shield, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FullManualExport: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchManual = async () => {
      try {
        const response = await fetch('/manuals/full-manual.md');
        if (response.ok) {
          const text = await response.text();
          setContent(text);
        } else {
          setContent('# Error\nNo se pudo cargar el manual maestro.');
        }
      } catch (error) {
        setContent('# Error\nOcurrió un fallo al intentar obtener el manual.');
      } finally {
        setLoading(false);
      }
    };

    fetchManual();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#050505]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 p-4 md:p-12 print:p-0">
      {/* Toolbar - Hidden on Print */}
      <div className="fixed top-4 right-4 flex space-x-3 z-50 print:hidden">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-all border border-slate-200"
        >
          <ArrowLeft size={18} />
          <span className="font-bold text-xs uppercase tracking-widest">Volver</span>
        </button>
        <button 
          onClick={handlePrint}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-all shadow-lg shadow-blue-500/20"
        >
          <Printer size={18} />
          <span className="font-bold text-xs uppercase tracking-widest">Imprimir / Guardar PDF</span>
        </button>
      </div>

      {/* Manual Content Container */}
      <div className="max-w-4xl mx-auto bg-white shadow-2xl print:shadow-none rounded-2xl overflow-hidden border border-slate-100 print:border-none">
        
        {/* Header Section */}
        <div className="bg-slate-900 p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/40">
                <FileText size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">CUBERBOX Nexus Core v4.7.9</h1>
                <p className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Manual Maestro de Operaciones</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mt-12 border-t border-white/10 pt-8">
              <div className="flex items-start space-x-3">
                <Shield className="text-emerald-400 mt-1" size={18} />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Perfil Administrador</p>
                  <p className="text-xs text-slate-300 mt-1">Configuración profunda, gestión de clúster y seguridad.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <User className="text-blue-400 mt-1" size={18} />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Perfil Usuario / Agente</p>
                  <p className="text-xs text-slate-300 mt-1">Operación diaria, gestión de clientes y reportes básicos.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Markdown Content */}
        <div className="p-12 prose prose-slate max-w-none 
          prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase
          prose-h1:text-4xl prose-h2:text-2xl prose-h2:border-b prose-h2:pb-2 prose-h2:mt-12
          prose-p:text-slate-600 prose-p:leading-relaxed
          prose-li:text-slate-600
          prose-strong:text-slate-900 prose-strong:font-bold
          prose-hr:my-12 prose-hr:border-slate-100
        ">
          <ReactMarkdown
            components={{
              img: ({ node, ...props }) => (
                <div className="my-10">
                  <img 
                    {...props} 
                    className="rounded-2xl border border-slate-200 shadow-2xl w-full object-cover aspect-video" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
              )
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-8 border-t border-slate-100 text-center">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Documento Generado Automáticamente por CUBERBOX Nexus Core Authority Node • {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Print-only CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; }
          .min-h-screen { min-height: auto !important; padding: 0 !important; }
          .max-w-4xl { max-width: 100% !important; border: none !important; box-shadow: none !important; }
          .prose { font-size: 11pt !important; }
          @page { margin: 2cm; }
        }
      `}} />
    </div>
  );
};

export default FullManualExport;

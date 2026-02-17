import React, { useState, useEffect } from 'react';
import { 
  Zap, Shield, Database, Radio, Bot, ChevronRight, 
  CheckCircle2, Server, Globe, Key, Lock, Phone, Layers, Play, 
  Sparkles, RefreshCw, Smartphone, ShieldCheck,
  TerminalSquare, Network, Activity, Info, Cpu, HardDrive,
  ShieldAlert, Globe2, Clock, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ToastContext';

type SetupStep = 'ENVIRONMENT' | 'FREESWITCH' | 'SECURITY' | 'DATA' | 'FINISH';

const SystemSetupWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<SetupStep>('ENVIRONMENT');
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const steps: { id: SetupStep; label: string; icon: any }[] = [
    { id: 'ENVIRONMENT', label: 'Debian Check', icon: TerminalSquare },
    { id: 'FREESWITCH', label: 'FreeSwitch Core', icon: Phone },
    { id: 'SECURITY', label: 'ESL Guard', icon: ShieldCheck },
    { id: 'DATA', label: 'SQL Hub', icon: Database },
  ];

  const handleNext = async () => {
    setIsVerifying(true);
    // Simulación de validación técnica real en el backend
    await new Promise(r => setTimeout(r, 1500));
    setIsVerifying(false);

    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1].id;
      setCurrentStep(nextStep);
      toast(`Validación de ${nextStep} v4.7.9 exitosa.`, 'success', 'System Ready');
    } else {
      setCurrentStep('FINISH');
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center py-10 animate-in fade-in duration-700">
      {/* Header del Asistente */}
      <div className="w-full max-w-5xl mb-10 flex items-center justify-between px-10">
         <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-600/20">
               <Zap size={24} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Nexus Deployment Wizard</h2>
         </div>
         <div className="flex space-x-3">
            {steps.map((s, idx) => {
               const isActive = s.id === currentStep;
               const isPast = steps.findIndex(x => x.id === currentStep) > idx;
               return (
                  <div key={s.id} className="flex items-center">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                        isActive ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 
                        isPast ? 'bg-emerald-500 border-emerald-400 text-white' : 
                        'bg-slate-900 border-slate-800 text-slate-600'
                     }`}>
                        {isPast ? <CheckCircle2 size={18} /> : <s.icon size={18} />}
                     </div>
                     {idx < steps.length - 1 && <div className={`w-8 h-0.5 mx-2 ${isPast ? 'bg-emerald-500' : 'bg-slate-800'}`}></div>}
                  </div>
               );
            })}
         </div>
      </div>

      <div className="w-full max-w-5xl glass rounded-[64px] border border-slate-700/50 shadow-2xl p-20 relative overflow-hidden flex flex-col justify-between min-h-[650px] bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.03),_transparent)]">
        
        {/* Paso 1: ENVIRONMENT */}
        {currentStep === 'ENVIRONMENT' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center space-x-8">
                 <div className="p-5 bg-slate-900 rounded-[32px] text-blue-400 border border-slate-800 shadow-inner">
                    <Cpu size={48} />
                 </div>
                 <div>
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter">System Integrity Check</h3>
                    <p className="text-slate-400 font-medium mt-2">Validando entorno Debian 11/12 y dependencias PieceByte.</p>
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {[
                    { label: 'Operating System', val: 'Debian 12 (Bookworm)', icon: Globe2, status: 'OK' },
                    { label: 'Media Library', val: 'libks / signalwire-client', icon: Layers, status: 'OK' },
                    { label: 'Compiler', val: 'CMake 3.25+ / Build-Ess.', icon: TerminalSquare, status: 'OK' },
                    { label: 'Hardware Specs', val: '8 vCPU / 16GB RAM', icon: HardDrive, status: 'OK' },
                 ].map((item, i) => (
                    <div key={i} className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl flex items-center justify-between group hover:border-blue-500/30 transition-all">
                       <div className="flex items-center space-x-4">
                          <item.icon size={20} className="text-slate-500" />
                          <div>
                             <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{item.label}</p>
                             <p className="text-sm font-bold text-white uppercase">{item.val}</p>
                          </div>
                       </div>
                       <CheckCircle2 size={18} className="text-emerald-500" />
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* Paso 2: FREESWITCH */}
        {currentStep === 'FREESWITCH' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center space-x-8">
                <div className="p-5 bg-blue-600/10 rounded-[32px] text-blue-400 border border-blue-500/20 shadow-inner">
                   <Radio size={48} />
                </div>
                <div>
                   <h3 className="text-4xl font-black text-white uppercase tracking-tighter">FreeSwitch 1.10 LTS Core</h3>
                   <p className="text-slate-400 font-medium mt-2">Estableciendo puente de gestión v4.7.9 vía Event Socket Layer (ESL).</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { label: 'SIP Port (Sofia)', val: '5060', icon: Network, desc: 'External/Internal Profiles' },
                  { label: 'ESL Port (TCP)', val: '8021', icon: Zap, desc: 'Real-time Event Stream' },
                  { label: 'WSS Port (Verto)', val: '8089', icon: Activity, desc: 'WebRTC Signaling' },
                ].map(p => (
                  <div key={p.label} className="p-8 rounded-[40px] bg-slate-900 border border-slate-800 text-center space-y-4 shadow-inner relative group hover:border-blue-500/40 transition-all">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{p.label}</p>
                     <p className="text-4xl font-black text-white font-mono tracking-tighter">{p.val}</p>
                     <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest">{p.desc}</p>
                     <div className="absolute top-4 right-4 text-emerald-500"><CheckCircle2 size={14} /></div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* Paso 3: SECURITY */}
        {currentStep === 'SECURITY' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center space-x-8">
                 <div className="p-5 bg-rose-500/10 rounded-[32px] text-rose-500 border border-rose-500/20 shadow-inner">
                    <ShieldAlert size={48} />
                 </div>
                 <div>
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Capa de Blindaje L7</h3>
                    <p className="text-slate-400 font-medium mt-2">Certificación SSL Verto y Firewall de Aplicación.</p>
                 </div>
              </div>
              <div className="p-10 bg-slate-900/60 rounded-[48px] border border-slate-800 space-y-8 shadow-inner">
                 <div className="flex items-center justify-between p-6 bg-slate-950 rounded-[32px] border border-slate-800">
                    <div className="flex items-center space-x-5">
                       <Lock size={24} className="text-rose-500" />
                       <div>
                          <p className="text-sm font-black text-white uppercase">WSS Encryption Status</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Certificado: valid.cuberbox-pro.net</p>
                       </div>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Verified</span>
                 </div>
                 <div className="flex items-center justify-between p-6 bg-slate-950 rounded-[32px] border border-slate-800">
                    <div className="flex items-center space-x-5">
                       <ShieldCheck size={24} className="text-blue-500" />
                       <div>
                          <p className="text-sm font-black text-white uppercase">ESL Authentication Secret</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Hash: SHA-512 Distributed</p>
                       </div>
                    </div>
                    <span className="bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20">Authorized</span>
                 </div>
              </div>
           </div>
        )}

        {/* Paso 4: DATA */}
        {currentStep === 'DATA' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center space-x-8">
                 <div className="p-5 bg-emerald-600/10 rounded-[32px] text-emerald-500 border border-emerald-500/20 shadow-inner">
                    <Database size={48} />
                 </div>
                 <div>
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Data Hub Sync</h3>
                    <p className="text-slate-400 font-medium mt-2">Enlazando con el motor PostgreSQL 16 y esquemas v4.7.9.</p>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                 <div className="p-10 bg-slate-900 border border-slate-800 rounded-[48px] space-y-4">
                    <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                       <Smartphone size={14} className="mr-2" /> CRM Data Persistence
                    </h4>
                    <p className="text-2xl font-black text-white uppercase tracking-tight">Active Connection</p>
                    <div className="pt-4 flex items-center space-x-3 text-emerald-500">
                       <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                       <span className="text-[10px] font-black uppercase tracking-[0.2em]">Pool Size: 200 sessions</span>
                    </div>
                 </div>
                 <div className="p-10 bg-slate-900 border border-slate-800 rounded-[48px] space-y-4">
                    <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                       {/* Fixed missing import for Clock */}
                       <Clock size={14} className="mr-2" /> CDR Real-time Stream
                    </h4>
                    <p className="text-2xl font-black text-white uppercase tracking-tight">Latency: 2ms</p>
                    <div className="pt-4 flex items-center space-x-3 text-blue-400">
                       <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                       <span className="text-[10px] font-black uppercase tracking-[0.2em]">Uptime: Nominal</span>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* Paso FINAL: FINISH */}
        {currentStep === 'FINISH' && (
          <div className="flex flex-col items-center justify-center text-center space-y-12 animate-in zoom-in-95 duration-700">
            <div className="relative">
               <div className="w-48 h-48 bg-blue-500/20 rounded-full flex items-center justify-center border-4 border-blue-500 shadow-[0_0_80px_rgba(59,130,246,0.5)]">
                  <Sparkles size={80} className="text-blue-400 animate-pulse" />
               </div>
               <div className="absolute -top-4 -right-4 bg-emerald-500 p-3 rounded-2xl text-white shadow-2xl animate-bounce">
                  <ShieldCheck size={28} />
               </div>
            </div>
            <div className="space-y-4">
               <h2 className="text-6xl font-black text-white uppercase tracking-tighter">NEXUS v4.7.9 ACTIVADO</h2>
               <p className="text-slate-400 text-xl max-w-xl mx-auto font-medium leading-relaxed">
                  El clúster CUBERBOX está ahora gobernado por <span className="text-white font-black underline decoration-blue-500">FreeSwitch 1.10 LTS</span>. El plano de control está sincronizado.
               </p>
            </div>
            <button 
               onClick={() => navigate('/')} 
               className="bg-blue-600 hover:bg-blue-500 text-white px-20 py-8 rounded-[36px] font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-blue-600/30 transition-all active:scale-95 flex items-center space-x-6 group"
            >
               <span>Entrar al Centro de Mando</span>
               {/* Fixed missing import for ArrowRight */}
               <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        )}

        {/* Botonera de Control */}
        {currentStep !== 'FINISH' && (
          <div className="mt-16 pt-10 border-t border-slate-800/50 flex justify-between items-center relative z-10">
            <div className="flex items-center space-x-4">
               <Info size={20} className="text-blue-500" />
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  Validación técnica de capa automatizada v4.7.9
               </p>
            </div>
            <button 
              onClick={handleNext} 
              disabled={isVerifying}
              className="bg-blue-600 hover:bg-blue-500 text-white px-16 py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50 flex items-center space-x-4 group"
            >
               {isVerifying ? (
                  <>
                     <RefreshCw className="animate-spin" size={20} />
                     <span>Validando...</span>
                  </>
               ) : (
                  <>
                     <span>Siguiente Protocolo</span>
                     <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
               )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemSetupWizard;
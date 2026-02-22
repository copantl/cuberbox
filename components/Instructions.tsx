
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Copy, Terminal, Server, Database, Phone, Code, ShieldCheck, 
  Zap, Github, TerminalSquare, AlertCircle, Play, ChevronRight,
  Layers, Monitor, Globe, ChevronLeft, CheckCircle2
} from 'lucide-react';
import { useToast } from '../ToastContext';

const Instructions: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'ONE_LINER' | 'MANUAL' | 'POST_INSTALL'>('ONE_LINER');

  const CodeBlock = ({ title, code, icon: Icon }: any) => {
    const copyToClipboard = () => {
      navigator.clipboard.writeText(code);
      toast("Comando copiado al portapapeles.", "success", "Portapapeles");
    };

    return (
      <div className="bg-slate-950/90 border border-slate-800 rounded-[32px] overflow-hidden mb-8 shadow-2xl group">
        <div className="px-8 py-5 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2.5 bg-blue-600/10 rounded-xl text-blue-500">
              <Icon size={18} />
            </div>
            <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">{title}</span>
          </div>
          <button 
            onClick={copyToClipboard}
            className="flex items-center space-x-2 text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase px-4 py-1.5 bg-slate-800 rounded-xl border border-slate-700 hover:border-blue-500"
          >
            <Copy size={12} />
            <span>Copiar Snippet</span>
          </button>
        </div>
        <pre className="p-8 text-[13px] text-blue-400/90 overflow-x-auto font-mono leading-relaxed bg-black/20 scrollbar-hide">
          <code>{code}</code>
        </pre>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 pb-40 animate-in fade-in duration-700">
      <div className="text-center mb-20 space-y-4">
        <div className="inline-flex items-center space-x-3 bg-blue-500/10 border border-blue-500/20 px-6 py-2.5 rounded-full mb-6">
          <Zap size={18} className="text-blue-500 animate-pulse" />
          <span className="text-[11px] font-black text-blue-400 uppercase tracking-[0.4em]">Nexus Release v4.7.9</span>
        </div>
        <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">Despliegue FreeSwitch</h1>
        <p className="text-slate-400 text-lg max-w-3xl mx-auto font-medium mt-4 uppercase tracking-widest opacity-60">
          Script unificado para Debian 12: FreeSwitch 1.10 + Postgres 16.
        </p>
      </div>

      <div className="flex bg-slate-900 border-2 border-slate-800 p-1.5 rounded-[32px] mb-16 shadow-2xl max-w-2xl mx-auto">
        {[
          { id: 'ONE_LINER', label: 'Instalación Unificada', icon: Zap },
          { id: 'MANUAL', label: 'Pasos Manuales', icon: Terminal },
          { id: 'POST_INSTALL', label: 'Verificación', icon: ShieldCheck }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-3 py-4 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        {activeTab === 'ONE_LINER' && (
          <div className="glass p-12 rounded-[64px] border border-blue-500/20 bg-blue-600/5 mb-16 relative overflow-hidden">
             <h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center mb-8">
                <ShieldCheck size={32} className="mr-4 text-emerald-400" /> Inyección Nexus-ESL
             </h2>
             <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-2xl font-medium">
                Este script configura los repositorios de SignalWire, instala el motor FreeSwitch 1.10 y aprovisiona el puerto 8021 para el conector CUBERBOX Pro.
             </p>
             <CodeBlock 
                title="Super-Script Nexus (Recomendado)"
                icon={TerminalSquare}
                code={`wget -O install.sh https://raw.githubusercontent.com/copantl/cuberbox-pro/main/setup/install.sh && chmod +x install.sh && sudo ./install.sh`}
             />
             <div className="p-8 bg-slate-900 border border-slate-800 rounded-[36px] flex items-start space-x-6 shadow-inner">
                <AlertCircle size={24} className="text-blue-500 mt-1 shrink-0" />
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">Nota de Seguridad</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-wider">
                     El script generará una contraseña aleatoria para el Event Socket (ESL). Asegúrese de sincronizarla en la pestaña de Configuración &gt; Core.
                  </p>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'MANUAL' && (
          <div className="space-y-8">
             <div className="p-10 glass rounded-[48px] border border-slate-800">
                <h3 className="text-2xl font-black text-white uppercase mb-8 flex items-center"><Terminal className="mr-4 text-blue-500" /> Secuencia SSH Manual</h3>
                <div className="space-y-6">
                   <div className="p-8 bg-slate-950 rounded-3xl border border-slate-800">
                      <p className="text-[10px] font-black text-blue-500 uppercase mb-3 tracking-widest">Paso 1: Preparación del Servidor</p>
                      <p className="text-xs text-slate-500 mb-4 font-bold uppercase tracking-wider">Primero, instalamos las herramientas básicas y librerías que el sistema necesita para funcionar correctamente.</p>
                      <code className="text-emerald-400 text-[11px] font-mono block leading-relaxed bg-black/40 p-4 rounded-xl">apt-get update && apt-get install -y gnupg2 wget lsb-release curl build-essential cmake automake autoconf libtool libtool-bin pkg-config libssl-dev zlib1g-dev libdb-dev libncurses5-dev libsqlite3-dev libcurl4-openssl-dev libpcre3-dev libspeex-dev libspeexdsp-dev libldns-dev libedit-dev liblua5.2-dev libopus-dev libsndfile1-dev libshout3-dev libmpg123-dev python3-dev git golang-go haproxy keepalived</code>
                   </div>
                   <div className="p-8 bg-slate-950 rounded-3xl border border-slate-800">
                      <p className="text-[10px] font-black text-blue-500 uppercase mb-3 tracking-widest">Paso 2: Configuración de Repositorios</p>
                      <p className="text-xs text-slate-500 mb-4 font-bold uppercase tracking-wider">Conectamos el servidor con las fuentes oficiales de software. Reemplace [TOKEN] con su clave de SignalWire.</p>
                      <code className="text-emerald-400 text-[11px] font-mono block leading-relaxed bg-black/40 p-4 rounded-xl">
                        echo "machine assignments.signalwire.com login signalwire password [TOKEN]" &gt; /etc/apt/auth.conf.d/signalwire.conf<br/>
                        wget --http-user=signalwire --http-password=[TOKEN] -O - https://assignments.signalwire.com/reference/gpg/signalwire_pub.gpg | apt-key add -<br/>
                        echo "deb https://assignments.signalwire.com/reference/debian/$(lsb_release -sc) release main" &gt; /etc/apt/sources.list.d/freeswitch.list<br/>
                        sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" &gt; /etc/apt/sources.list.d/pgdg.list'<br/>
                        wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
                      </code>
                   </div>
                   <div className="p-8 bg-slate-950 rounded-3xl border border-slate-800">
                      <p className="text-[10px] font-black text-blue-500 uppercase mb-3 tracking-widest">Paso 3: Instalación de Motores</p>
                      <p className="text-xs text-slate-500 mb-4 font-bold uppercase tracking-wider">Instalamos las librerías de SignalWire, FreeSwitch y PostgreSQL. Este paso es el más importante.</p>
                      <code className="text-emerald-400 text-[11px] font-mono block leading-relaxed bg-black/40 p-4 rounded-xl">apt-get update && apt-get install -y libks-dev signalwire-client-c-dev freeswitch-all freeswitch-mod-esl freeswitch-mod-verto postgresql-16</code>
                   </div>
                   <div className="p-8 bg-slate-950 rounded-3xl border border-slate-800">
                      <p className="text-[10px] font-black text-blue-500 uppercase mb-3 tracking-widest">Paso 4: Base de Datos Segura</p>
                      <p className="text-xs text-slate-500 mb-4 font-bold uppercase tracking-wider">Creamos el espacio donde se guardará toda la información de sus clientes y llamadas.</p>
                      <code className="text-emerald-400 text-[11px] font-mono block leading-relaxed bg-black/40 p-4 rounded-xl">
                        sudo -u postgres psql -c "CREATE USER cuberbox_admin WITH PASSWORD 'TitanPass2024!';"<br/>
                        sudo -u postgres psql -c "CREATE DATABASE cuberbox_db OWNER cuberbox_admin;"
                      </code>
                   </div>
                   <div className="p-8 bg-slate-950 rounded-3xl border border-slate-800">
                      <p className="text-[10px] font-black text-blue-500 uppercase mb-3 tracking-widest">Paso 5: Seguridad SSL</p>
                      <p className="text-xs text-slate-500 mb-4 font-bold uppercase tracking-wider">Generamos certificados para que las llamadas desde el navegador sean privadas y seguras.</p>
                      <code className="text-emerald-400 text-[11px] font-mono block leading-relaxed bg-black/40 p-4 rounded-xl">
                        mkdir -p /etc/freeswitch/tls<br/>
                        openssl req -x509 -nodes -days 3650 -newkey rsa:4096 -keyout /etc/freeswitch/tls/wss.key -out /etc/freeswitch/tls/wss.crt -subj "/C=US/ST=Tech/L=Cloud/O=Cuberbox/CN=sip.tu-dominio.com"<br/>
                        cat /etc/freeswitch/tls/wss.crt /etc/freeswitch/tls/wss.key &gt; /etc/freeswitch/tls/wss.pem<br/>
                        chown -R freeswitch:freeswitch /etc/freeswitch/tls
                      </code>
                   </div>
                   <div className="p-8 bg-slate-950 rounded-3xl border border-slate-800">
                      <p className="text-[10px] font-black text-blue-500 uppercase mb-3 tracking-widest">Paso 6: Alta Disponibilidad</p>
                      <p className="text-xs text-slate-500 mb-4 font-bold uppercase tracking-wider">Configuramos el sistema de vigilancia que mantiene su servidor siempre en línea.</p>
                      <code className="text-emerald-400 text-[11px] font-mono block leading-relaxed bg-black/40 p-4 rounded-xl">
                        mkdir -p /etc/keepalived<br/>
                        cat &lt;&lt;EOF &gt; /etc/keepalived/keepalived.conf<br/>
                        vrrp_instance VI_1 &#123;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;state MASTER<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;interface eth0<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;virtual_router_id 51<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;priority 150<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;advert_int 1<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;authentication &#123;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;auth_type PASS<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;auth_pass nexus_ha_key<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;virtual_ipaddress &#123;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;192.168.1.100<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
                        &#125;<br/>
                        EOF
                      </code>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'POST_INSTALL' && (
           <div className="max-w-4xl mx-auto text-center space-y-12">
              <div className="w-32 h-32 bg-blue-600 rounded-[40px] flex items-center justify-center text-white mx-auto shadow-[0_0_60px_rgba(59,130,246,0.4)]">
                <CheckCircle2 size={64} />
              </div>
              <div className="space-y-4">
                <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">Nexus Clúster Activo</h2>
                <p className="text-slate-400 text-lg font-medium uppercase tracking-widest opacity-60">
                  FreeSwitch 1.10 LTS está ahora gobernando el Media Plane de tu red v4.7.9.
                </p>
              </div>
              <button 
                onClick={() => navigate('/')}
                className="bg-white text-slate-900 px-16 py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-100 transition-all flex items-center justify-center mx-auto space-x-4"
              >
                <span>Finalizar y Entrar</span>
                <Play size={20} fill="currentColor" />
              </button>
           </div>
        )}
      </div>
    </div>
  );
};

export default Instructions;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Copy, Terminal, Server, Database, Phone, Code, ShieldCheck, 
  Zap, Github, TerminalSquare, AlertCircle, Play, ChevronRight,
  Layers, Monitor, Globe, ChevronLeft, CheckCircle2, Bot, MessageSquare
} from 'lucide-react';
import { useToast } from '../ToastContext';

const Instructions: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'ONE_LINER' | 'MANUAL' | 'POST_INSTALL' | 'OMNICHANNEL_AI'>('ONE_LINER');

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
          <span className="text-[11px] font-black text-blue-400 uppercase tracking-[0.4em]">CUBERBOX Release v4.7.9</span>
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
          { id: 'OMNICHANNEL_AI', label: 'Omnicanalidad & IA', icon: Globe },
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
        {activeTab === 'OMNICHANNEL_AI' && (
          <div className="space-y-12">
            <div className="glass p-12 rounded-[64px] border border-blue-500/20 bg-blue-600/5">
               <h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center mb-8">
                  <Globe size={32} className="mr-4 text-blue-400" /> Activación Omnicanal (WhatsApp)
               </h2>
               <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-2xl font-medium">
                  Para que la omnicanalidad funcione en su servidor local, debe configurar el Webhook de Meta y las variables de entorno.
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-[32px]">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4">1. Configurar Webhook en Meta</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-wider mb-4">
                      Apunte el Webhook de su App de Meta a la siguiente URL (use un túnel como Cloudflare o Ngrok si no tiene IP pública):
                    </p>
                    <code className="text-blue-400 text-[11px] font-mono block bg-black/40 p-4 rounded-xl break-all">
                      https://tu-dominio.com/api/webhook/whatsapp
                    </code>
                  </div>
                  <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-[32px]">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4">2. Variables de Entorno (.env)</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-wider mb-4">
                      Añada estas líneas a su archivo .env local para habilitar la comunicación real:
                    </p>
                    <code className="text-emerald-400 text-[11px] font-mono block bg-black/40 p-4 rounded-xl">
                      WHATSAPP_VERIFY_TOKEN=nexus_token_2026<br/>
                      WHATSAPP_ACCESS_TOKEN=tu_token_de_meta<br/>
                      WHATSAPP_PHONE_NUMBER_ID=tu_id_de_telefono
                    </code>
                  </div>
               </div>
            </div>

            <div className="glass p-12 rounded-[64px] border border-emerald-500/20 bg-emerald-600/5">
               <h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center mb-8">
                  <Bot size={32} className="mr-4 text-emerald-400" /> Inteligencia Artificial (Gemini)
               </h2>
               <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-2xl font-medium">
                  Active las sugerencias inteligentes y el análisis de sentimiento configurando su API Key de Google Gemini.
               </p>
               <CodeBlock 
                  title="Configuración de IA en .env"
                  icon={Code}
                  code={`GEMINI_API_KEY=tu_api_key_de_google_ai_studio`}
               />
               <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-4">
                  Nota: Puede obtener su clave gratuita en <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-blue-400 underline">Google AI Studio</a>.
               </p>
            </div>

            <div className="glass p-12 rounded-[64px] border border-pink-500/20 bg-pink-600/5">
               <h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center mb-8">
                  <MessageSquare size={32} className="mr-4 text-pink-400" /> Activación Omnicanal (TikTok)
               </h2>
               <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-2xl font-medium">
                  Integre TikTok Business para recibir y responder mensajes de sus seguidores directamente desde CUBERBOX Nexus Core.
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-[32px]">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4">1. Configurar Webhook en TikTok</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-wider mb-4">
                      Apunte el Webhook de su App de TikTok Business a la siguiente URL:
                    </p>
                    <code className="text-pink-400 text-[11px] font-mono block bg-black/40 p-4 rounded-xl break-all">
                      https://tu-dominio.com/api/webhook/tiktok
                    </code>
                  </div>
                  <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-[32px]">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4">2. Variables de Entorno (.env)</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-wider mb-4">
                      Añada estas líneas a su archivo .env local para habilitar TikTok:
                    </p>
                    <code className="text-emerald-400 text-[11px] font-mono block bg-black/40 p-4 rounded-xl">
                      TIKTOK_VERIFY_TOKEN=nexus_tiktok_token_2026<br/>
                      TIKTOK_ACCESS_TOKEN=tu_token_de_tiktok<br/>
                      TIKTOK_CLIENT_KEY=tu_client_key
                    </code>
                  </div>
               </div>
            </div>

            <div className="glass p-12 rounded-[64px] border border-blue-500/20 bg-blue-600/5">
               <h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center mb-8">
                  <Globe size={32} className="mr-4 text-blue-400" /> Activación Omnicanal (Facebook & Instagram)
               </h2>
               <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-2xl font-medium">
                  Conecte sus páginas de Facebook y cuentas de Instagram Business para centralizar toda su atención al cliente.
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-[32px]">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4">1. Configurar Webhook en Meta</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-wider mb-4">
                      Configure el Webhook de su App de Meta (Messenger e Instagram) a estas URLs:
                    </p>
                    <code className="text-blue-400 text-[11px] font-mono block bg-black/40 p-4 rounded-xl break-all">
                      https://tu-dominio.com/api/webhook/facebook<br/>
                      https://tu-dominio.com/api/webhook/instagram
                    </code>
                  </div>
                  <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-[32px]">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4">2. Variables de Entorno (.env)</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-wider mb-4">
                      Añada estas líneas para habilitar Facebook e Instagram:
                    </p>
                    <code className="text-emerald-400 text-[11px] font-mono block bg-black/40 p-4 rounded-xl">
                      META_VERIFY_TOKEN=nexus_meta_token_2026<br/>
                      FACEBOOK_PAGE_ACCESS_TOKEN=tu_token_de_pagina<br/>
                      FACEBOOK_PAGE_ID=tu_id_de_pagina
                    </code>
                  </div>
               </div>
            </div>

            <div className="glass p-12 rounded-[64px] border border-indigo-500/20 bg-indigo-600/5">
               <h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center mb-8">
                  <ShieldCheck size={32} className="mr-4 text-indigo-400" /> Autenticación (Keycloak)
               </h2>
               <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-2xl font-medium">
                  Configure el servidor de identidad Keycloak para gestionar el acceso seguro de sus agentes y administradores.
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-[32px]">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4">1. Configuración del Realm</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-wider mb-4">
                      Asegúrese de que el Realm y el Client ID coincidan con los definidos en su servidor Keycloak:
                    </p>
                    <ul className="text-[11px] text-slate-400 font-bold space-y-2 uppercase tracking-widest">
                      <li>• Realm: <span className="text-indigo-400">nexus</span></li>
                      <li>• Client ID: <span className="text-indigo-400">nexus-core</span></li>
                      <li>• Access Type: <span className="text-indigo-400">confidential</span></li>
                    </ul>
                  </div>
                  <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-[32px]">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4">2. Variables de Entorno (.env)</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-wider mb-4">
                      Añada estas líneas para conectar con Keycloak:
                    </p>
                    <code className="text-emerald-400 text-[11px] font-mono block bg-black/40 p-4 rounded-xl">
                      VITE_KEYCLOAK_URL=https://tu-keycloak.com<br/>
                      VITE_KEYCLOAK_REALM=nexus<br/>
                      VITE_KEYCLOAK_CLIENT_ID=nexus-core<br/>
                      KEYCLOAK_CLIENT_SECRET=tu_secret
                    </code>
                  </div>
               </div>
            </div>
          </div>
        )}
        {activeTab === 'ONE_LINER' && (
          <div className="glass p-12 rounded-[64px] border border-blue-500/20 bg-blue-600/5 mb-16 relative overflow-hidden">
             <h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center mb-8">
                <ShieldCheck size={32} className="mr-4 text-emerald-400" /> Inyección CUBERBOX-ESL
             </h2>
             <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-2xl font-medium">
                Este script configura los repositorios de SignalWire, instala el motor FreeSwitch 1.10 y aprovisiona el puerto 8021 para el conector CUBERBOX Nexus Core.
             </p>
             <CodeBlock 
                title="Super-Script CUBERBOX (Recomendado)"
                icon={TerminalSquare}
                code={`wget -O install.sh ${typeof window !== 'undefined' ? window.location.origin : ''}/setup/install.sh && chmod +x install.sh && sudo ./install.sh`}
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
                   <div className="p-8 bg-rose-950/30 rounded-3xl border border-rose-500/30">
                      <p className="text-[10px] font-black text-rose-500 uppercase mb-3 tracking-widest">⚠️ Comando de Reparación</p>
                      <p className="text-xs text-rose-300 mb-4 font-bold uppercase tracking-wider">Si tiene errores de "Tipo echo desconocido", ejecute esto primero:</p>
                      <code className="text-rose-400 text-[11px] font-mono block leading-relaxed bg-black/40 p-4 rounded-xl">rm -f /etc/apt/sources.list.d/freeswitch.list /etc/apt/sources.list.d/pgdg.list && apt-get update</code>
                   </div>
                   <div className="p-8 bg-slate-950 rounded-3xl border border-slate-800">
                      <p className="text-[10px] font-black text-blue-500 uppercase mb-3 tracking-widest">Paso 1: Preparación del Servidor</p>
                      <p className="text-xs text-slate-500 mb-4 font-bold uppercase tracking-wider">Primero, instalamos las herramientas básicas y librerías que el sistema necesita para funcionar correctamente.</p>
                      <code className="text-emerald-400 text-[11px] font-mono block leading-relaxed bg-black/40 p-4 rounded-xl">apt-get update && apt-get install -y gnupg2 wget lsb-release curl build-essential cmake automake autoconf libtool libtool-bin pkg-config libssl-dev zlib1g-dev libdb-dev libncurses-dev libsqlite3-dev libcurl4-openssl-dev libpcre3-dev libspeex-dev libspeexdsp-dev libldns-dev libedit-dev liblua5.2-dev libopus-dev libsndfile1-dev libshout3-dev libmpg123-dev python3-dev git golang-go haproxy keepalived uuid-dev</code>
                   </div>
                   <div className="p-8 bg-slate-950 rounded-3xl border border-slate-800">
                      <p className="text-[10px] font-black text-blue-500 uppercase mb-3 tracking-widest">Paso 2: Configuración de Repositorios</p>
                      <p className="text-xs text-slate-500 mb-4 font-bold uppercase tracking-wider">Conectamos el servidor con las fuentes oficiales de software. Reemplace [TOKEN] con su clave de SignalWire.</p>
                      <code className="text-emerald-400 text-[11px] font-mono block leading-relaxed bg-black/40 p-4 rounded-xl">
                        wget --http-user=signalwire --http-password=[TOKEN] -O /usr/share/keyrings/signalwire-freeswitch-repo.gpg https://freeswitch.signalwire.com/repo/deb/debian-release/signalwire-freeswitch-repo.gpg<br/>
                        echo "machine freeswitch.signalwire.com login signalwire password [TOKEN]" &gt; /etc/apt/auth.conf.d/freeswitch.conf<br/>
                        echo "deb [signed-by=/usr/share/keyrings/signalwire-freeswitch-repo.gpg] https://freeswitch.signalwire.com/repo/deb/debian-release/ $(lsb_release -sc) main" &gt; /etc/apt/sources.list.d/freeswitch.list<br/>
                        wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /usr/share/keyrings/postgresql-archive-keyring.gpg<br/>
                        echo "deb [signed-by=/usr/share/keyrings/postgresql-archive-keyring.gpg] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" | tee /etc/apt/sources.list.d/pgdg.list &gt; /dev/null
                      </code>
                   </div>
                   <div className="p-8 bg-slate-950 rounded-3xl border border-slate-800">
                      <p className="text-[10px] font-black text-blue-500 uppercase mb-3 tracking-widest">Paso 3: Instalación de Motores</p>
                      <p className="text-xs text-slate-500 mb-4 font-bold uppercase tracking-wider">Instalamos las librerías de SignalWire, FreeSwitch y PostgreSQL. Este paso es el más importante.</p>
                      <code className="text-emerald-400 text-[11px] font-mono block leading-relaxed bg-black/40 p-4 rounded-xl">
                        # Compilar SignalWire Core<br/>
                        mkdir -p /usr/src/libs && cd /usr/src/libs<br/>
                        git clone https://github.com/signalwire/libks.git && cd libks && cmake . -DCMAKE_INSTALL_PREFIX=/usr && make install<br/>
                        cd .. && git clone https://github.com/signalwire/signalwire-c.git && cd signalwire-c && cmake . -DCMAKE_INSTALL_PREFIX=/usr && make install<br/>
                        ldconfig<br/>
                        <br/>
                        # Instalar FreeSwitch y DB<br/>
                        apt-get update && apt-get install -y freeswitch-all freeswitch-mod-esl freeswitch-mod-verto postgresql-16
                      </code>
                   </div>
                   <div className="p-8 bg-slate-950 rounded-3xl border border-slate-800">
                      <p className="text-[10px] font-black text-blue-500 uppercase mb-3 tracking-widest">Paso 4: Base de Datos Segura</p>
                      <p className="text-xs text-slate-500 mb-4 font-bold uppercase tracking-wider">Creamos el espacio donde se guardará toda la información de sus clientes y llamadas.</p>
                      <code className="text-emerald-400 text-[11px] font-mono block leading-relaxed bg-black/40 p-4 rounded-xl">
                        sudo -u postgres psql -c "CREATE USER nexus_admin WITH PASSWORD 'TitanPass2026!';"<br/>
                        sudo -u postgres psql -c "CREATE DATABASE nexus_db OWNER nexus_admin;"
                      </code>
                   </div>
                   <div className="p-8 bg-slate-950 rounded-3xl border border-slate-800">
                      <p className="text-[10px] font-black text-blue-500 uppercase mb-3 tracking-widest">Paso 5: Seguridad SSL</p>
                      <p className="text-xs text-slate-500 mb-4 font-bold uppercase tracking-wider">Generamos certificados para que las llamadas desde el navegador sean privadas y seguras.</p>
                      <code className="text-emerald-400 text-[11px] font-mono block leading-relaxed bg-black/40 p-4 rounded-xl">
                        mkdir -p /etc/freeswitch/tls<br/>
                        openssl req -x509 -nodes -days 3650 -newkey rsa:4096 -keyout /etc/freeswitch/tls/wss.key -out /etc/freeswitch/tls/wss.crt -subj "/C=US/ST=Tech/L=Cloud/O=CUBERBOXNexusCore/CN=sip.tu-dominio.com"<br/>
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
                   <div className="p-8 bg-slate-950 rounded-3xl border border-slate-800">
                      <p className="text-[10px] font-black text-blue-500 uppercase mb-3 tracking-widest">Paso 7: Instalación del Aplicativo</p>
                      <p className="text-xs text-slate-500 mb-4 font-bold uppercase tracking-wider">Desplegamos la interfaz web y el conector de eventos para el usuario final.</p>
                      <code className="text-emerald-400 text-[11px] font-mono block leading-relaxed bg-black/40 p-4 rounded-xl">
                        # Instalar Node y Go<br/>
                        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -<br/>
                        apt-get install -y nodejs golang-go<br/>
                        <br/>
                        # Clonar y Construir<br/>
                        git clone https://github.com/copantl/nexus-core.git /opt/nexus-core<br/>
                        cd /opt/nexus-core/backend && go build -o /usr/local/bin/nexus-connector main.go<br/>
                        cd /opt/nexus-core && npm install && npm run build<br/>
                        <br/>
                        # Configurar Servicios Systemd<br/>
                        chmod +x /opt/nexus-core/setup-service.sh<br/>
                        sudo /opt/nexus-core/setup-service.sh
                      </code>
                   </div>
                   <div className="p-8 bg-slate-950 rounded-3xl border border-slate-800">
                      <p className="text-[10px] font-black text-blue-500 uppercase mb-3 tracking-widest">Paso 8: Configuración Multi-Nodo (Opcional)</p>
                      <p className="text-xs text-slate-500 mb-4 font-bold uppercase tracking-wider">Si tiene múltiples servidores FreeSwitch, regístrelos en la base de datos para habilitar el clúster.</p>
                      <code className="text-emerald-400 text-[11px] font-mono block leading-relaxed bg-black/40 p-4 rounded-xl">
                        # Acceder a PostgreSQL<br/>
                        sudo -u postgres psql -d nexus_db<br/>
                        <br/>
                        # Registrar un nodo remoto<br/>
                        INSERT INTO telephony_nodes (name, ip, port, password, role) <br/>
                        VALUES ('Nodo Miami', '192.168.1.60', 8021, 'ClueCon', 'MEDIA');
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
                <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">CUBERBOX Clúster Activo</h2>
                <p className="text-slate-400 text-lg font-medium uppercase tracking-widest opacity-60">
                  FreeSwitch 1.10 LTS está ahora gobernando el Media Plane de tu red CUBERBOX Nexus Core v4.7.9.
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

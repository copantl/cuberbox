import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Activity, Users, PhoneIncoming, PhoneOutgoing, RefreshCw, Headphones, X, ShieldCheck, Mic, MessageSquare, History, Clock, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Channel {
  uuid: string;
  direction: string;
  state: string;
  cid_name: string;
  cid_num: string;
  dest: string;
  presence_id: string;
  x?: number;
  y?: number;
}

interface AuditLog {
  id: string;
  timestamp: string;
  supervisorExtension: string;
  targetUuid: string;
  customerName: string;
  customerNumber: string;
  mode: SpyMode;
}

type SpyMode = 'listen' | 'whisper' | 'barge';

export const LiveChannelMonitor: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [supervisorExt, setSupervisorExt] = useState('1000');
  const [activeSpy, setActiveSpy] = useState<{ uuid: string, mode: SpyMode } | null>(null);
  const [showSpyModal, setShowSpyModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [selectedMode, setSelectedMode] = useState<SpyMode>('listen');
  const [showHistory, setShowHistory] = useState(false);

  const fetchChannels = async () => {
    try {
      const res = await fetch('/api/telephony/channels');
      const data = await res.json();
      setChannels(data);
    } catch (error) {
      console.error('Error fetching channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('/api/telephony/audit-logs');
      const data = await res.json();
      setAuditLogs(data);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    }
  };

  useEffect(() => {
    fetchChannels();
    fetchAuditLogs();
    const interval = setInterval(() => {
      fetchChannels();
      if (showHistory) fetchAuditLogs();
    }, 5000);
    return () => clearInterval(interval);
  }, [showHistory]);

  const handleListen = async (channel: Channel) => {
    setSelectedChannel(channel);
    setSelectedMode('listen');
    setShowSpyModal(true);
  };

  const confirmListen = async () => {
    if (!selectedChannel) return;
    
    setActiveSpy({ uuid: selectedChannel.uuid, mode: selectedMode });
    try {
      const response = await fetch('/api/telephony/eavesdrop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          uuid: selectedChannel.uuid, 
          supervisorExtension: supervisorExt,
          mode: selectedMode,
          customerName: selectedChannel.cid_name,
          customerNumber: selectedChannel.cid_num
        })
      });
      const data = await response.json();
      console.log('Spy session started:', data);
      fetchAuditLogs();
    } catch (error) {
      console.error('Error starting spy session:', error);
    } finally {
      setShowSpyModal(false);
      setTimeout(() => setActiveSpy(null), 15000); // Reset after 15s for demo
    }
  };

  useEffect(() => {
    if (!svgRef.current || channels.length === 0) return;

    const width = svgRef.current.clientWidth || 800;
    const height = 550;
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    const simulation = d3.forceSimulation<Channel>(channels)
      .force('charge', d3.forceManyBody().strength(50))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(60))
      .on('tick', ticked);

    const node = svg.append('g')
      .selectAll('g')
      .data(channels)
      .enter()
      .append('g')
      .style('cursor', 'pointer')
      .on('click', (event, d: Channel) => handleListen(d))
      .call(d3.drag<SVGGElement, Channel>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Bubble circle
    node.append('circle')
      .attr('r', 50)
      .attr('fill', (d: Channel) => d.direction === 'inbound' ? '#10b981' : 'var(--accent-primary)')
      .attr('fill-opacity', 0.05)
      .attr('stroke', (d: Channel) => d.direction === 'inbound' ? '#10b981' : 'var(--accent-primary)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .attr('class', (d: Channel) => activeSpy?.uuid === d.uuid ? 'animate-ping' : 'animate-[spin_10s_linear_infinite]');

    // Inner circle - The "Hardware" look
    node.append('circle')
      .attr('r', 42)
      .attr('fill', 'var(--bg-sidebar)')
      .attr('stroke', (d: Channel) => {
        if (activeSpy?.uuid === d.uuid) {
          if (activeSpy.mode === 'barge') return '#9333ea';
          if (activeSpy.mode === 'whisper') return 'var(--accent-primary)';
          return '#f43f5e'; // listen
        }
        return 'var(--border-main)';
      })
      .attr('stroke-width', 2);

    // Glow effect for active
    node.filter((d: Channel) => activeSpy?.uuid === d.uuid)
      .append('circle')
      .attr('r', 42)
      .attr('fill', 'none')
      .attr('stroke', (d: Channel) => {
        if (activeSpy?.mode === 'barge') return '#9333ea';
        if (activeSpy?.mode === 'whisper') return 'var(--accent-primary)';
        return '#f43f5e'; // listen
      })
      .attr('stroke-width', 4)
      .attr('filter', 'blur(8px)')
      .attr('opacity', 0.5);

    // Name text
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', -5)
      .attr('font-size', '10px')
      .attr('font-weight', '900')
      .attr('fill', 'var(--text-primary)')
      .attr('class', 'uppercase tracking-tighter')
      .text((d: Channel) => d.cid_name || 'Unknown');

    // Number text
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 12)
      .attr('font-size', '8px')
      .attr('fill', 'var(--text-secondary)')
      .attr('font-family', 'monospace')
      .text((d: Channel) => d.cid_num);

    // Direction indicator dot
    node.append('circle')
      .attr('cx', 0)
      .attr('cy', 28)
      .attr('r', 3)
      .attr('fill', (d: Channel) => d.direction === 'inbound' ? '#10b981' : 'var(--accent-primary)')
      .attr('class', 'animate-pulse');

    function ticked() {
      node.attr('transform', (d: Channel) => `translate(${d.x},${d.y})`);
    }

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => simulation.stop();
  }, [channels, activeSpy]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="bg-bg-card backdrop-blur-xl rounded-3xl border border-border-main p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 relative z-10">
          <div>
            <h2 className="text-2xl font-black tracking-tighter text-text-primary uppercase flex items-center gap-3">
              <div className="p-2 bg-accent-primary/20 rounded-lg border border-accent-primary/30">
                <Activity className="w-5 h-5 text-accent-primary" />
              </div>
              Monitor de Burbujas
            </h2>
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mt-1">Real-time Neural Channel Visualization</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-border-main">
              <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Extensión:</span>
              <input 
                type="text" 
                value={supervisorExt}
                onChange={(e) => setSupervisorExt(e.target.value)}
                className="w-16 bg-transparent border-none p-0 text-xs font-black text-accent-primary focus:outline-none focus:ring-0 uppercase"
              />
            </div>
            
            <div className="flex items-center gap-6 px-4 py-2 bg-white/5 border border-border-main rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Inbound</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-primary shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Outbound</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setShowHistory(!showHistory);
                  if (!showHistory) fetchAuditLogs();
                }}
                className={`h-10 px-4 rounded-2xl transition-all flex items-center gap-2 border font-black text-[10px] uppercase tracking-widest ${
                  showHistory 
                    ? 'bg-accent-primary border-accent-primary text-white shadow-[0_0_15px_rgba(var(--accent-primary-rgb),0.4)]' 
                    : 'bg-white/5 border-border-main text-text-secondary hover:text-text-primary hover:bg-white/10'
                }`}
              >
                <History className="w-4 h-4" />
                Audit Log
              </button>
              
              <button 
                onClick={fetchChannels}
                className="w-10 h-10 flex items-center justify-center bg-white/5 border border-border-main rounded-2xl hover:bg-white/10 transition-all text-text-secondary hover:text-text-primary"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 relative z-10">
          <div className="flex-1 relative bg-black/40 rounded-3xl border border-border-main overflow-hidden min-h-[550px] shadow-inner">
            {/* Grid background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            
            {channels.length === 0 && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-text-secondary space-y-6">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-border-main">
                  <Users className="w-8 h-8 opacity-20" />
                </div>
                <p className="text-[10px] uppercase tracking-[0.4em] font-black opacity-40">No active neural channels detected</p>
              </div>
            )}
            
            <svg ref={svgRef} className="w-full h-[550px] cursor-move" />
            
            <AnimatePresence>
              {activeSpy && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`absolute top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 z-50 border ${
                    activeSpy.mode === 'barge' 
                      ? 'bg-purple-600/90 border-purple-400/50 shadow-purple-600/20' 
                      : activeSpy.mode === 'whisper' 
                      ? 'bg-accent-primary/90 border-accent-secondary/50 shadow-accent-primary/20' 
                      : 'bg-rose-600/90 border-rose-400/50 shadow-rose-600/20'
                  } backdrop-blur-md`}
                >
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    {activeSpy.mode === 'barge' ? <Mic className="w-4 h-4 animate-pulse" /> : activeSpy.mode === 'whisper' ? <MessageSquare className="w-4 h-4 animate-pulse" /> : <Headphones className="w-4 h-4 animate-pulse" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">
                      {activeSpy.mode === 'barge' ? 'Intervención Activa' : activeSpy.mode === 'whisper' ? 'Susurro al Agente' : 'Escucha Activa'}
                    </span>
                    <span className="text-[8px] font-bold text-white/60 uppercase tracking-tighter">Nexus Protocol Secured</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {showHistory && (
              <motion.div 
                initial={{ opacity: 0, x: 40, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 380 }}
                exit={{ opacity: 0, x: 40, width: 0 }}
                className="bg-bg-card rounded-3xl border border-border-main overflow-hidden flex flex-col backdrop-blur-md shadow-2xl"
              >
                <div className="p-6 border-b border-border-main bg-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <h3 className="text-[10px] font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
                      <History className="w-3 h-3 text-accent-primary" />
                      Auditoría de Sesiones
                    </h3>
                    <span className="text-[8px] font-bold text-text-secondary uppercase tracking-tighter mt-0.5">Forense Audit Log</span>
                  </div>
                  <button onClick={() => setShowHistory(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-text-secondary transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
                  {auditLogs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-text-secondary space-y-4 py-20">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-border-main">
                        <Clock className="w-5 h-5 opacity-20" />
                      </div>
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">No records found</p>
                    </div>
                  ) : (
                    auditLogs.map((log) => (
                      <div key={log.id} className="bg-white/5 p-4 rounded-2xl border border-border-main group hover:bg-white/10 transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${
                            log.mode === 'barge' ? 'bg-purple-500/20 text-purple-400' : 
                            log.mode === 'whisper' ? 'bg-accent-primary/20 text-accent-primary' : 
                            'bg-rose-500/20 text-rose-400'
                          }`}>
                            {log.mode}
                          </span>
                          <span className="text-[9px] text-text-secondary font-mono font-bold">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-border-main text-text-secondary">
                              <UserCheck className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                              <p className="text-[11px] font-black text-text-primary uppercase tracking-tight">{log.customerName}</p>
                              <p className="text-[9px] text-text-secondary font-mono">{log.customerNumber}</p>
                            </div>
                          </div>
                          <div className="pt-2 border-t border-border-main flex items-center justify-between">
                            <span className="text-[8px] font-black text-text-secondary uppercase tracking-widest">Supervisor Node:</span>
                            <span className="text-[10px] font-black text-accent-primary font-mono">{log.supervisorExtension}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {[
            { label: 'Total Canales', value: channels.length, icon: Activity, color: 'accent-primary' },
            { label: 'Entrantes', value: channels.filter(c => c.direction === 'inbound').length, icon: PhoneIncoming, color: 'emerald-500' },
            { label: 'Salientes', value: channels.filter(c => c.direction === 'outbound').length, icon: PhoneOutgoing, color: 'accent-secondary' }
          ].map((stat, idx) => (
            <div key={idx} className="p-6 bg-white/5 rounded-3xl border border-border-main group hover:bg-white/10 transition-all duration-500">
              <div className="flex items-center gap-4">
                <div className={`p-3 bg-${stat.color}/20 text-${stat.color} rounded-2xl border border-${stat.color}/20 group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-text-secondary uppercase tracking-[0.3em]">{stat.label}</p>
                  <p className="text-2xl font-black text-text-primary tracking-tighter mt-1">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spy Confirmation Modal */}
      <AnimatePresence>
        {showSpyModal && selectedChannel && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-bg-sidebar rounded-[2.5rem] shadow-2xl max-w-md w-full overflow-hidden border border-border-main"
            >
              <div className="p-10 text-center relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-primary to-transparent opacity-50"></div>
                
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-border-main relative group">
                  <div className="absolute inset-0 bg-accent-primary/10 rounded-full blur-xl group-hover:bg-accent-primary/20 transition-colors"></div>
                  <Headphones className="w-10 h-10 text-accent-primary relative z-10" />
                </div>
                
                <h3 className="text-2xl font-black text-text-primary uppercase tracking-tighter mb-2">Intervención Neural</h3>
                <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest mb-8">
                  Selecciona el protocolo para <span className="text-accent-primary">{selectedChannel.cid_name}</span>
                </p>

                <div className="grid grid-cols-1 gap-3 mb-10">
                  {[
                    { id: 'listen', label: 'Solo Escucha', sub: 'Modo Silencioso Indetectable', icon: Headphones, color: 'rose' },
                    { id: 'whisper', label: 'Susurro (Whisper)', sub: 'Solo el agente recibe audio', icon: 'accent-primary', color: 'accent-primary' },
                    { id: 'barge', label: 'Intervención (Barge)', sub: 'Conferencia Tripartita Activa', icon: Mic, color: 'purple' }
                  ].map((mode) => (
                    <button 
                      key={mode.id}
                      onClick={() => setSelectedMode(mode.id as SpyMode)}
                      className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all duration-300 ${
                        selectedMode === mode.id 
                          ? `border-${mode.color === 'accent-primary' ? 'accent-primary' : mode.color + '-500'}/50 bg-${mode.color === 'accent-primary' ? 'accent-primary' : mode.color + '-500'}/10` 
                          : 'border-border-main bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                        selectedMode === mode.id 
                          ? `bg-${mode.color === 'accent-primary' ? 'accent-primary' : mode.color + '-600'} text-white shadow-[0_0_15px_rgba(var(--${mode.color === 'accent-primary' ? 'accent-primary' : mode.color + '-rgb'}),0.4)]` 
                          : 'bg-white/5 text-text-secondary'
                      }`}>
                        {typeof mode.icon === 'string' ? <MessageSquare className="w-6 h-6" /> : <mode.icon className="w-6 h-6" />}
                      </div>
                      <div className="text-left">
                        <p className={`text-sm font-black uppercase tracking-tight ${selectedMode === mode.id ? 'text-text-primary' : 'text-text-secondary'}`}>
                          {mode.label}
                        </p>
                        <p className="text-[9px] text-text-secondary/60 font-bold uppercase tracking-widest">{mode.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-4">
                  <button 
                    onClick={confirmListen}
                    className={`w-full py-5 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all shadow-2xl flex items-center justify-center gap-3 ${
                      selectedMode === 'barge' ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20' : 
                      selectedMode === 'whisper' ? 'bg-accent-primary hover:bg-accent-secondary shadow-accent-primary/20' : 
                      'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5" />
                    Ejecutar Protocolo
                  </button>
                  <button 
                    onClick={() => setShowSpyModal(false)}
                    className="w-full py-4 text-text-secondary font-black uppercase tracking-[0.2em] text-[10px] hover:text-text-primary transition-colors"
                  >
                    Abortar Operación
                  </button>
                </div>
              </div>
              <div className="bg-white/5 px-10 py-5 border-t border-border-main">
                <p className="text-[9px] text-text-secondary text-center uppercase tracking-[0.3em] font-black">
                  Nexus Security Protocol v4.7.9 - Authority Level 9
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

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

    const width = svgRef.current.clientWidth;
    const height = 500;
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
      .on('click', (event, d) => handleListen(d))
      .call(d3.drag<SVGGElement, Channel>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Bubble circle
    node.append('circle')
      .attr('r', 50)
      .attr('fill', d => d.direction === 'inbound' ? '#10b981' : '#3b82f6')
      .attr('fill-opacity', 0.15)
      .attr('stroke', d => d.direction === 'inbound' ? '#10b981' : '#3b82f6')
      .attr('stroke-width', 2)
      .attr('class', d => activeSpy?.uuid === d.uuid ? 'animate-ping' : 'animate-pulse');

    // Inner circle
    node.append('circle')
      .attr('r', 40)
      .attr('fill', 'white')
      .attr('fill-opacity', 0.9)
      .attr('stroke', d => activeSpy?.uuid === d.uuid ? (activeSpy.mode === 'barge' ? '#9333ea' : '#ef4444') : '#e2e8f0')
      .attr('stroke-width', d => activeSpy?.uuid === d.uuid ? 3 : 1);

    // Headphones icon for active spy
    node.filter(d => activeSpy?.uuid === d.uuid)
      .append('path')
      .attr('d', 'M3 12c0-4.97 4.03-9 9-9s9 4.03 9 9M3 12v5c0 1.1.9 2 2 2h2v-7H3zm18 0v5c0 1.1-.9 2-2 2h-2v-7h4z')
      .attr('fill', 'none')
      .attr('stroke', d => activeSpy?.mode === 'barge' ? '#9333ea' : '#ef4444')
      .attr('stroke-width', 2)
      .attr('transform', 'translate(-12, -35) scale(1)');

    // Name text
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', -5)
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('fill', '#1e293b')
      .text(d => d.cid_name || 'Unknown');

    // Number text
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 10)
      .attr('font-size', '9px')
      .attr('fill', '#64748b')
      .text(d => d.cid_num);

    // Icon indicator
    node.append('circle')
      .attr('cx', 0)
      .attr('cy', 25)
      .attr('r', 8)
      .attr('fill', d => d.direction === 'inbound' ? '#10b981' : '#3b82f6');

    function ticked() {
      node.attr('transform', d => `translate(${d.x},${d.y})`);
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
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Monitor de Canales Vivos
            </h2>
            <p className="text-sm text-gray-500">Visualización en tiempo real de llamadas activas. Haz clic en una burbuja para escuchar.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-black/5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Tu Extensión:</span>
              <input 
                type="text" 
                value={supervisorExt}
                onChange={(e) => setSupervisorExt(e.target.value)}
                className="w-16 bg-white border border-black/10 rounded-lg px-2 py-1 text-xs font-bold text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-emerald-600">Entrante</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-blue-600">Saliente</span>
              </div>
            </div>
            <button 
              onClick={() => {
                setShowHistory(!showHistory);
                if (!showHistory) fetchAuditLogs();
              }}
              className={`p-2 rounded-xl transition-colors flex items-center gap-2 ${showHistory ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <History className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest px-1">Historial</span>
            </button>
            <button 
              onClick={fetchChannels}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 relative bg-slate-50 rounded-2xl border border-dashed border-slate-200 overflow-hidden min-h-[500px]">
            {channels.length === 0 && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 space-y-4">
                <Users className="w-12 h-12 opacity-20" />
                <p className="text-xs uppercase tracking-widest font-black">No hay llamadas activas en este momento</p>
              </div>
            )}
            <svg ref={svgRef} className="w-full h-[500px] cursor-move" />
            
            <AnimatePresence>
              {activeSpy && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`absolute top-4 left-1/2 -translate-x-1/2 ${activeSpy.mode === 'barge' ? 'bg-purple-600' : activeSpy.mode === 'whisper' ? 'bg-blue-600' : 'bg-red-600'} text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 z-50`}
                >
                  {activeSpy.mode === 'barge' ? <Mic className="w-4 h-4 animate-bounce" /> : activeSpy.mode === 'whisper' ? <MessageSquare className="w-4 h-4 animate-bounce" /> : <Headphones className="w-4 h-4 animate-bounce" />}
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {activeSpy.mode === 'barge' ? 'Intervención Activa (Barge)' : activeSpy.mode === 'whisper' ? 'Susurro al Agente (Whisper)' : 'Escuchando Llamada Activa...'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {showHistory && (
              <motion.div 
                initial={{ opacity: 0, x: 20, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 350 }}
                exit={{ opacity: 0, x: 20, width: 0 }}
                className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col"
              >
                <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <History className="w-3 h-3" />
                    Auditoría de Sesiones
                  </h3>
                  <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {auditLogs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-2 py-10">
                      <Clock className="w-8 h-8 opacity-20" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">Sin registros hoy</p>
                    </div>
                  ) : (
                    auditLogs.map((log) => (
                      <div key={log.id} className="bg-white p-3 rounded-xl border border-black/5 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${log.mode === 'barge' ? 'bg-purple-100 text-purple-600' : log.mode === 'whisper' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                            {log.mode}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <UserCheck className="w-3 h-3 text-slate-400" />
                            {log.customerName}
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            Ext. Supervisor: <span className="text-blue-600 font-bold">{log.supervisorExtension}</span>
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 text-white rounded-lg">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Total Canales</p>
                <p className="text-xl font-bold text-blue-900">{channels.length}</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 text-white rounded-lg">
                <PhoneIncoming className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Entrantes</p>
                <p className="text-xl font-bold text-emerald-900">{channels.filter(c => c.direction === 'inbound').length}</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 text-white rounded-lg">
                <PhoneOutgoing className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Salientes</p>
                <p className="text-xl font-bold text-blue-900">{channels.filter(c => c.direction === 'outbound').length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spy Confirmation Modal */}
      <AnimatePresence>
        {showSpyModal && selectedChannel && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-black/5"
            >
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Headphones className="w-10 h-10 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">¿Cómo deseas intervenir?</h3>
                <p className="text-gray-500 text-sm mb-6">
                  Selecciona el modo de auditoría para la llamada de <span className="font-bold text-gray-900">{selectedChannel.cid_name}</span>.
                </p>

                <div className="grid grid-cols-1 gap-3 mb-8">
                  <button 
                    onClick={() => setSelectedMode('listen')}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${selectedMode === 'listen' ? 'border-red-600 bg-red-50' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <div className={`p-2 rounded-lg ${selectedMode === 'listen' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-900">Solo Escucha</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">Modo Silencioso</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setSelectedMode('whisper')}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${selectedMode === 'whisper' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <div className={`p-2 rounded-lg ${selectedMode === 'whisper' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-900">Susurro (Whisper)</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">Solo el agente te escucha</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setSelectedMode('barge')}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${selectedMode === 'barge' ? 'border-purple-600 bg-purple-50' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <div className={`p-2 rounded-lg ${selectedMode === 'barge' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      <Mic className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-900">Intervención (Barge)</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">Ambos te escuchan</p>
                    </div>
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={confirmListen}
                    className={`w-full py-4 text-white rounded-2xl font-bold uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${selectedMode === 'barge' ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20' : selectedMode === 'whisper' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'}`}
                  >
                    <ShieldCheck className="w-5 h-5" />
                    Iniciar {selectedMode === 'barge' ? 'Intervención' : selectedMode === 'whisper' ? 'Susurro' : 'Escucha'}
                  </button>
                  <button 
                    onClick={() => setShowSpyModal(false)}
                    className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold uppercase tracking-widest hover:bg-gray-200 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 px-8 py-4 border-t border-black/5">
                <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">
                  Nexus Security Protocol v4.2 - Auditoría Activa
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

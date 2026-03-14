import React, { useState } from 'react';
import { Terminal, Send, Play, Square, RefreshCcw, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export const TelephonyConsole: React.FC = () => {
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{cmd: string, res: string, time: string}[]>([]);

  const executeCommand = async (cmdToExec?: string) => {
    const finalCmd = cmdToExec || command;
    if (!finalCmd) return;

    setLoading(true);
    try {
      const res = await fetch('/api/telephony/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: finalCmd })
      });
      const data = await res.json();
      
      const newEntry = {
        cmd: finalCmd,
        res: data.message || data.error,
        time: new Date().toLocaleTimeString()
      };
      
      setResponse(newEntry.res);
      setHistory(prev => [newEntry, ...prev].slice(0, 50));
      if (!cmdToExec) setCommand('');
    } catch (error) {
      setResponse("Error de red al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const quickCommands = [
    { name: 'Status', cmd: 'status' },
    { name: 'Show Channels', cmd: 'show channels' },
    { name: 'Show Calls', cmd: 'show calls' },
    { name: 'Reload XML', cmd: 'reloadxml' },
    { name: 'Sofia Status', cmd: 'sofia status' },
    { name: 'Uptime', cmd: 'uptime' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Command Input & Quick Actions */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-blue-600" />
            Consola ESL
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Comando Manual</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && executeCommand()}
                  placeholder="ej: status"
                  className="flex-1 px-4 py-2 bg-gray-50 border border-black/10 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button 
                  onClick={() => executeCommand()}
                  disabled={loading}
                  className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Acciones Rápidas</label>
              <div className="grid grid-cols-2 gap-2">
                {quickCommands.map((qc) => (
                  <button
                    key={qc.name}
                    onClick={() => executeCommand(qc.cmd)}
                    className="px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-50 border border-black/5 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all text-left flex items-center justify-between group"
                  >
                    {qc.name}
                    <Zap className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-900 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-2">Estado del Nodo</h3>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-blue-100">Conectado a FreeSwitch 1.10</span>
            </div>
            <p className="text-xs text-blue-200 leading-relaxed">
              La consola ESL permite enviar comandos directos al motor de telefonía. Úsela con precaución en producción.
            </p>
          </div>
          <Terminal className="w-24 h-24 absolute -bottom-4 -right-4 text-white/10 rotate-12" />
        </div>
      </div>

      {/* Output & History */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-white/5 flex flex-col h-[600px]">
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-950/50">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="ml-4 text-xs font-mono text-slate-400">nexus-esl-terminal v4.7.9</span>
            </div>
            <button 
              onClick={() => setHistory([])}
              className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
            >
              Limpiar Consola
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 font-mono text-sm space-y-4 scrollbar-hide">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                <Terminal className="w-12 h-12 opacity-20" />
                <p className="text-xs uppercase tracking-widest font-black">Esperando comandos...</p>
              </div>
            ) : (
              history.map((entry, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-1"
                >
                  <div className="flex items-center gap-2 text-blue-400">
                    <span className="text-slate-600">[{entry.time}]</span>
                    <span className="text-emerald-500">$</span>
                    <span>{entry.cmd}</span>
                  </div>
                  <pre className="text-slate-300 whitespace-pre-wrap pl-6 border-l border-slate-800 ml-2 py-1">
                    {entry.res}
                  </pre>
                </motion.div>
              ))
            )}
            {loading && (
              <div className="flex items-center gap-2 text-blue-400 animate-pulse">
                <span className="text-emerald-500">$</span>
                <span className="w-2 h-4 bg-blue-400" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

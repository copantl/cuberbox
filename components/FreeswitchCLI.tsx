import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Send, Trash2, Play, Pause, Database, ChevronRight, X, Cpu, AlertCircle, RefreshCw, Clock } from 'lucide-react';
import { useToast } from '../ToastContext';

interface LogEntry {
  timestamp: string;
  level: 'DEBUG' | 'INFO' | 'NOTICE' | 'WARNING' | 'ERR' | 'CRIT' | 'LUA' | 'CMD_IN' | 'CMD_OUT';
  message: string;
}

const FreeswitchCLI: React.FC = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [command, setCommand] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const mockEvents = [
    { level: 'DEBUG', message: 'sofia.c:2344 Incoming INVITE from carrier_twilio_prim' },
    { level: 'LUA', message: 'cuberbox_router.lua:12 [TELEMETRY] Dispatching CUSTOM event: cuberbox::telemetry' },
    { level: 'NOTICE', message: 'switch_xml.c:642 Config Reloaded: Trunks and DIDs synchronized with PostgreSQL' },
    { level: 'INFO', message: 'mod_dialplan_xml.c:332 [CUBERBOX TRACE] Mapping DID +13055550122 -> Camp: Real Estate' },
    { level: 'NOTICE', message: 'switch_channel.c:1112 New Channel bridge/1001-agent [CONNECTED]' },
    { level: 'DEBUG', message: 'switch_core_state_machine.c:455 EXEC conference(conf_1001@default)' },
    { level: 'CRIT', message: 'mod_sofia.c:1102 [SIP_FAIL] Lost connection to Twilio Gateway 54.172.60.0' },
    { level: 'ERR', message: 'switch_core_sqldb.c:442 PostgreSQL connection timed out on fs-node-01' },
  ];

  const commandResponses: Record<string, string[]> = {
    'sofia status': [
      'Name          Type      Data                                State',
      '================================================================================',
      'external      profile   sip:mod_sofia@10.0.0.10:5060        RUNNING (0)',
      'internal      profile   sip:mod_sofia@10.0.0.10:5061        RUNNING (0)',
      'twilio        gateway   sip:cuberbox@twilio.com             REGED',
      '================================================================================',
      '3 profiles 1 gateway'
    ],
    'show calls': [
      'UUID                                 Direction  Created                     Status       Target',
      '--------------------------------------------------------------------------------------------------',
      '7482-af23-11ed-9482-0123456789ab    inbound    2024-11-21 14:05:22         ACTIVE       conf_1001',
      '1 total calls'
    ],
    'version': ['FreeSWITCH Version 1.10.12-release-27~64bit (Nexus Core v4.7.9)'],
    'status': [
      'UP 12 days, 8 hours, 14 minutes, 22 seconds',
      'FreeSWITCH (Version 1.10.12) is ready',
      '1 session(s) since startup',
      '0 session(s) active',
      'Max sessions 1000',
      'Sessions per second 30'
    ],
    'reloadxml': ['+OK [Config Reloaded]'],
    'help': ['Comandos disponibles: status, version, sofia status, show calls, reloadxml, clear']
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      const randomMsg = mockEvents[Math.floor(Math.random() * mockEvents.length)];
      addLog(randomMsg.level as any, randomMsg.message);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  const addLog = (level: LogEntry['level'], message: string) => {
    const newEntry: LogEntry = {
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    };
    
    if (level === 'CRIT') toast(message, 'critical', 'SIP STACK FAILURE', true);
    if (level === 'ERR') toast(message, 'error', 'FS CORE ERROR');

    setLogs(prev => [...prev, newEntry].slice(-150));
  };

  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const cmd = command.trim().toLowerCase();
    addLog('CMD_IN', `fs_cli> ${command}`);

    if (cmd === 'clear') {
      setLogs([]);
      setCommand("");
      return;
    }

    setTimeout(() => {
      const responses = commandResponses[cmd] || [`-ERR: Command '${cmd}' not found. Type 'help' for options.`];
      responses.forEach((line, i) => {
        setTimeout(() => addLog('CMD_OUT', line), i * 50);
      });
    }, 200);

    setCommand("");
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'LUA': return 'text-purple-400 font-bold';
      case 'DEBUG': return 'text-slate-500';
      case 'NOTICE': return 'text-emerald-400';
      case 'WARNING': return 'text-amber-400';
      case 'ERR': return 'text-rose-500';
      case 'CRIT': return 'text-white bg-rose-600 px-1 rounded font-black';
      case 'CMD_IN': return 'text-blue-400 font-black';
      case 'CMD_OUT': return 'text-slate-300 italic';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="flex flex-col h-[700px] glass rounded-[48px] border border-slate-700/50 overflow-hidden bg-black/60 shadow-2xl animate-in zoom-in-95 duration-500">
      <div className="px-10 py-6 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          </div>
          <div className="h-6 w-px bg-slate-800"></div>
          <div className="flex items-center space-x-3">
            <Terminal size={18} className="text-blue-400" />
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white">FreeSwitch Titan CLI v4.7.9</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-950 px-4 py-1.5 rounded-xl border border-slate-800">
            <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-slate-600' : 'bg-emerald-500 animate-pulse'}`}></div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{isPaused ? 'CLI PAUSED' : 'ESL CONNECTED'}</span>
          </div>
          <button onClick={() => setIsPaused(!isPaused)} className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-all shadow-lg active:scale-95">
            {isPaused ? <Play size={18} fill="currentColor" /> : <Pause size={18} fill="currentColor" />}
          </button>
          <button onClick={() => setLogs([])} className="p-2.5 bg-slate-800 hover:bg-rose-500/10 border border-slate-700 text-slate-400 hover:text-rose-500 rounded-xl transition-all">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 font-mono text-[12px] leading-relaxed space-y-1 bg-[#020617]/50 scrollbar-hide">
        <div className="mb-6 p-6 border border-blue-500/20 bg-blue-600/5 rounded-3xl">
           <p className="text-blue-400 font-bold mb-1 uppercase tracking-widest flex items-center">
             <RefreshCw size={14} className="mr-2" /> Initializing ESL Session...
           </p>
           <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest opacity-60">Connected to FreeSwitch at 127.0.0.1:8021</p>
        </div>

        {logs.map((log, i) => (
          <div key={i} className="flex space-x-6 group hover:bg-white/5 px-2 py-0.5 rounded transition-colors animate-in slide-in-from-left-2">
            <span className="text-slate-600 shrink-0 select-none">[{log.timestamp}]</span>
            <span className={`shrink-0 w-20 text-center font-black tracking-tighter ${getLevelColor(log.level)}`}>[{log.level}]</span>
            <span className={`${log.level === 'CMD_OUT' ? 'pl-8 text-slate-400' : 'text-slate-200'}`}>{log.message}</span>
          </div>
        ))}
      </div>

      <div className="p-6 bg-slate-950 border-t border-slate-800">
        <form onSubmit={handleSendCommand} className="flex items-center space-x-4 bg-slate-900 border-2 border-slate-800 rounded-2xl px-6 py-4 focus-within:border-blue-500 transition-all shadow-inner">
          <span className="text-emerald-500 font-black font-mono">freeswitch@nexus&gt;</span>
          <input 
            type="text" 
            value={command}
            onChange={e => setCommand(e.target.value)}
            placeholder="Type 'help' for commands list..." 
            className="flex-1 bg-transparent text-sm font-mono text-white outline-none placeholder-slate-700"
          />
          <button type="submit" className={`p-2 rounded-xl transition-all ${command.trim() ? 'text-blue-400 hover:bg-blue-600/10' : 'text-slate-800 opacity-50'}`}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default FreeswitchCLI;
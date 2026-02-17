
import React, { useState, useRef } from 'react';
import { 
  Database, Upload, Trash2, PieChart, FileSpreadsheet, 
  CheckCircle, Edit2, X, Save, RefreshCw, Search, Layers,
  Activity, CheckCircle2, ShieldAlert, FileDown, Shield,
  // Added missing ShieldCheck import
  ShieldCheck
} from 'lucide-react';
import { useToast } from '../ToastContext';

const ListsManagement: React.FC = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isScrubbing, setIsScrubbing] = useState(false);
  
  const [lists, setLists] = useState([
    { id: '1001', name: 'Real Estate Florida - Nov', count: 4500, active: true, campaign: 'Florida_Sales', scrubbing: 'DONE' },
    { id: '1002', name: 'Health Leads Cold', count: 12000, active: true, campaign: 'Insurance_Out', scrubbing: 'PENDING' },
  ]);

  const handleDNCScrub = async (listId: string) => {
    setIsScrubbing(true);
    toast('Iniciando Scrubbing contra Global DNC Registry...', 'info', 'Compliance Shield');
    await new Promise(r => setTimeout(r, 2500));
    
    setLists(prev => prev.map(l => l.id === listId ? { ...l, scrubbing: 'DONE' } : l));
    setIsScrubbing(false);
    toast('Scrubbing finalizado. 12 registros bloqueados.', 'success');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newList = {
        id: (Math.floor(Math.random() * 9000) + 1000).toString(),
        name: file.name.replace('.csv', ''),
        count: Math.floor(Math.random() * 5000) + 500,
        active: true,
        campaign: 'UNASSIGNED',
        scrubbing: 'PENDING'
      };
      setLists([newList, ...lists]);
      setIsUploading(false);
      toast(`Importación exitosa: ${newList.count} leads inyectados.`, 'success', 'Data Sync');
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase flex items-center">
            <Layers className="mr-4 text-blue-400" size={32} />
            Data Warehouse & Inventario
          </h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Gestión integral de bases de datos con limpieza DNC automática.</p>
        </div>
        <div className="flex items-center space-x-4">
           <div className="relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
             <input type="text" placeholder="Buscar listas..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-slate-900 border-2 border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-xs text-white outline-none focus:border-blue-500 transition-all w-72 shadow-inner" />
          </div>
          <button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl transition-all shadow-xl font-black text-xs uppercase tracking-widest flex items-center space-x-2">
            <Upload size={20} />
            <span>Importar CSV</span>
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileChange} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {lists.map(list => (
          <div key={list.id} className="glass p-10 rounded-[56px] border border-slate-800 flex items-center justify-between hover:border-blue-500/30 transition-all shadow-2xl relative overflow-hidden group">
             <div className="flex items-center space-x-10 z-10">
                <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center border-2 transition-all ${list.active ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-500 grayscale'}`}>
                   <Database size={36} />
                </div>
                <div>
                   <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{list.name}</h3>
                      <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${list.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-900 text-slate-500'}`}>{list.active ? 'LIVE' : 'INACTIVE'}</span>
                   </div>
                   <div className="flex items-center text-[10px] font-black text-slate-500 uppercase tracking-widest space-x-6">
                      <span className="text-blue-500">ID: {list.id}</span>
                      <span>CAMP: <span className="text-slate-300">{list.campaign}</span></span>
                      <span className="flex items-center"><CheckCircle size={12} className="mr-1.5 text-emerald-500" /> {list.count.toLocaleString()} Leads</span>
                   </div>
                </div>
             </div>

             <div className="flex items-center space-x-6 z-10">
                <div className="flex flex-col items-center space-y-2">
                   <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Compliance Status</span>
                   <button 
                     onClick={() => handleDNCScrub(list.id)}
                     disabled={isScrubbing || list.scrubbing === 'DONE'}
                     className={`flex items-center space-x-2 px-6 py-2.5 rounded-2xl border transition-all text-[9px] font-black uppercase ${list.scrubbing === 'DONE' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white'}`}
                   >
                      <Shield size={14} />
                      <span>{list.scrubbing === 'DONE' ? 'Scrubbed OK' : 'Scrub DNC'}</span>
                   </button>
                </div>
                <div className="h-12 w-px bg-slate-800 mx-2"></div>
                <div className="flex space-x-2">
                   <button className="p-4 bg-slate-900 border border-slate-800 hover:bg-blue-600 text-slate-500 hover:text-white rounded-[24px] transition-all shadow-xl"><Edit2 size={20} /></button>
                   <button className="p-4 bg-slate-900 border border-slate-800 hover:bg-rose-600 text-slate-500 hover:text-white rounded-[24px] transition-all shadow-xl"><Trash2 size={20} /></button>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="p-12 glass rounded-[64px] border border-blue-500/20 bg-blue-600/5 flex items-center justify-between shadow-inner group">
         <div className="flex items-center space-x-8">
            <div className="w-20 h-20 rounded-[32px] bg-blue-600/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
               <ShieldCheck size={44} />
            </div>
            <div>
               <h4 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Lead Portability v2.0</h4>
               <p className="text-sm text-slate-400 max-w-2xl font-medium uppercase tracking-widest leading-relaxed">
                  Exporta e importa tus listas entre nodos de clúster manteniendo el hash de integridad v4.7.9. Soporte nativo para mapeo de campos dinámicos.
               </p>
            </div>
         </div>
         <button className="bg-slate-950 border-2 border-blue-500/30 text-blue-400 px-10 py-5 rounded-[28px] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95">Cloud Data Transfer</button>
      </div>
    </div>
  );
};

export default ListsManagement;

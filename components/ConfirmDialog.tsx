import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight">{title}</h3>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 transition-all">
            <X size={20} />
          </button>
        </div>
        <div className="p-8">
          <p className="text-slate-400 font-medium leading-relaxed">{message}</p>
        </div>
        <div className="p-8 bg-slate-950/50 flex items-center justify-end space-x-4">
          <button 
            onClick={onCancel}
            className="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={() => { onConfirm(); onCancel(); }}
            className="px-8 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-600/20 transition-all active:scale-95"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

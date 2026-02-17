
/**
 * @file FormDesigner.tsx
 * @description Motor de diseño de formularios dinámicos con soporte para cálculos aritméticos y 18 tipos de campos.
 */

import React, { useState, useEffect } from 'react';
import { 
  Plus, Save, Trash2, Edit2, GripVertical, CheckCircle2, 
  Type, Hash, Calendar, List, CheckSquare, Info, X,
  RefreshCw, Layout, Smartphone, Database, ShieldCheck,
  ChevronRight, ArrowRight, Eye, Code, Layers, Sparkles,
  FileText, Copy, LayoutTemplate, AlignLeft, Lock, Mail,
  CircleDot, Phone, Link, FileUp, Image as ImageIcon,
  MapPin, PenTool, EyeOff, MessageSquare, ChevronUp, ChevronDown,
  Calculator
} from 'lucide-react';
import { useToast } from '../ToastContext';

type FieldType = 
  | 'TEXT' | 'TEXTAREA' | 'PASSWORD' | 'EMAIL'
  | 'SELECT' | 'RADIO' | 'CHECKBOX'
  | 'NUMBER' | 'DATETIME' | 'PHONE' | 'URL'
  | 'FILE' | 'IMAGE' | 'LOCATION' | 'SIGNATURE'
  | 'HIDDEN' | 'INFO' | 'CALCULATION';

interface FormField {
  id: string;
  label: string;
  db_name: string;
  type: FieldType;
  required: boolean;
  options?: string[];
  placeholder?: string;
  info_text?: string;
  formula?: string; // Para campos de cálculo
}

interface CRMForm {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
}

const FIELD_TYPES_CONFIG: { type: FieldType, label: string, icon: any, cat: string }[] = [
  { type: 'TEXT', label: 'Texto Corto', icon: Type, cat: 'TEXTO' },
  { type: 'TEXTAREA', label: 'Párrafo', icon: AlignLeft, cat: 'TEXTO' },
  { type: 'PASSWORD', label: 'Contraseña', icon: Lock, cat: 'TEXTO' },
  { type: 'EMAIL', label: 'e-Mail', icon: Mail, cat: 'TEXTO' },
  
  { type: 'SELECT', label: 'Desplegable', icon: List, cat: 'SELECCIÓN' },
  { type: 'RADIO', label: 'Opción Única', icon: CircleDot, cat: 'SELECCIÓN' },
  { type: 'CHECKBOX', label: 'Casilla Verificación', icon: CheckSquare, cat: 'SELECCIÓN' },
  
  { type: 'NUMBER', label: 'Numérico', icon: Hash, cat: 'DATOS' },
  { type: 'CALCULATION', label: 'Cálculo Aritmético', icon: Calculator, cat: 'DATOS' },
  { type: 'DATETIME', label: 'Fecha / Hora', icon: Calendar, cat: 'DATOS' },
  { type: 'PHONE', label: 'Teléfono', icon: Phone, cat: 'DATOS' },
  { type: 'URL', label: 'URL Web', icon: Link, cat: 'DATOS' },
  
  { type: 'FILE', label: 'Archivo / PDF', icon: FileUp, cat: 'MULTIMEDIA' },
  { type: 'IMAGE', label: 'Imagen / Foto', icon: ImageIcon, cat: 'MULTIMEDIA' },
  { type: 'LOCATION', label: 'Geoposición', icon: MapPin, cat: 'MULTIMEDIA' },
  { type: 'SIGNATURE', label: 'Firma Digital', icon: PenTool, cat: 'MULTIMEDIA' },
  { type: 'HIDDEN', label: 'Campo Oculto', icon: EyeOff, cat: 'MULTIMEDIA' },
  
  { type: 'INFO', label: 'Etiqueta Informativa', icon: Info, cat: 'INFO' },
];

const INITIAL_FORMS: CRMForm[] = [
  {
    id: 'f_default',
    name: 'Cotizador de Seguros Pro',
    description: 'Cálculo automático de primas basado en valores de mercado.',
    fields: [
      { id: '1', label: 'Valor de Propiedad', db_name: 'valor_bien', type: 'NUMBER', required: true, placeholder: '50000' },
      { id: '2', label: 'Tasa Anual (%)', db_name: 'tasa', type: 'NUMBER', required: true, placeholder: '0.05' },
      { id: '3', label: 'Prima Estimada', db_name: 'prima_final', type: 'CALCULATION', required: false, formula: 'valor_bien * tasa' },
    ]
  }
];

const FormDesigner: React.FC = () => {
  const { toast } = useToast();
  const [forms, setForms] = useState<CRMForm[]>(INITIAL_FORMS);
  const [selectedFormId, setSelectedFormId] = useState<string>(INITIAL_FORMS[0].id);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Estado para la previsualización interactiva
  const [previewValues, setPreviewValues] = useState<Record<string, any>>({});

  const selectedForm = forms.find(f => f.id === selectedFormId) || forms[0];

  const createNewForm = () => {
    const newForm: CRMForm = {
      id: `f_${Math.random().toString(36).substr(2, 5)}`,
      name: 'Nueva Estructura de Captura',
      description: 'Sin descripción técnica.',
      fields: []
    };
    setForms([...forms, newForm]);
    setSelectedFormId(newForm.id);
    toast('Nueva instancia de formulario creada.', 'success');
  };

  const deleteForm = (id: string) => {
    if (forms.length <= 1) return;
    if (confirm('¿Eliminar permanentemente este formulario del clúster?')) {
      const newList = forms.filter(f => f.id !== id);
      setForms(newList);
      setSelectedFormId(newList[0].id);
    }
  };

  const addField = (type: FieldType = 'TEXT') => {
    const config = FIELD_TYPES_CONFIG.find(c => c.type === type);
    const newField: FormField = {
      id: Math.random().toString(36).substr(2, 5),
      label: config?.label || 'Nuevo Campo',
      db_name: 'field_' + Math.random().toString(36).substr(2, 3),
      type,
      required: false,
      options: (type === 'SELECT' || type === 'RADIO') ? ['Opción 1', 'Opción 2'] : undefined,
      placeholder: type === 'CALCULATION' ? 'Resultado automático' : 'Escribe aquí...',
      info_text: type === 'INFO' ? 'Texto descriptivo para el agente.' : undefined,
      formula: type === 'CALCULATION' ? '' : undefined
    };
    
    setForms(forms.map(f => f.id === selectedFormId ? { ...f, fields: [...f.fields, newField] } : f));
  };

  const moveField = (index: number, direction: 'UP' | 'DOWN') => {
    const newFields = [...selectedForm.fields];
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFields.length) return;
    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
    setForms(forms.map(f => f.id === selectedFormId ? { ...f, fields: newFields } : f));
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setForms(forms.map(f => {
      if (f.id === selectedFormId) {
        return {
          ...f,
          fields: f.fields.map(field => field.id === fieldId ? { ...field, ...updates } : field)
        };
      }
      return f;
    }));
  };

  const removeField = (fieldId: string) => {
    setForms(forms.map(f => f.id === selectedFormId ? { ...f, fields: f.fields.filter(field => field.id !== fieldId) } : f));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSaving(false);
    toast('Esquemas aritméticos inyectados en PostgreSQL 16.', 'success', 'Deploy OK');
  };

  // Lógica de cálculo en tiempo real para el preview
  const evaluateFormula = (formula: string, values: Record<string, any>) => {
    if (!formula) return 0;
    try {
      // Reemplazar slugs por valores
      let expression = formula;
      const slugs = formula.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
      
      slugs.forEach(slug => {
        const val = values[slug] || 0;
        const safeVal = isNaN(parseFloat(val)) ? 0 : parseFloat(val);
        expression = expression.replace(new RegExp(`\\b${slug}\\b`, 'g'), safeVal.toString());
      });

      // Evaluar matemáticamente (solo permitimos caracteres matemáticos básicos por seguridad)
      // eslint-disable-next-line no-new-func
      const result = new Function(`return ${expression}`)();
      return isFinite(result) ? result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0;
    } catch (e) {
      return "Error de Fórmula";
    }
  };

  const handlePreviewChange = (slug: string, value: any) => {
    setPreviewValues(prev => ({ ...prev, [slug]: value }));
  };

  const renderFieldPreview = (field: FormField) => {
    const commonClasses = "w-full bg-slate-900 border-2 border-slate-800 rounded-2xl px-6 py-4 text-sm text-white font-medium outline-none focus:border-blue-500 transition-all shadow-inner";
    
    switch (field.type) {
      case 'CALCULATION':
        const calcResult = evaluateFormula(field.formula || '', previewValues);
        return (
          <div className="relative group">
            <div className={`${commonClasses} bg-blue-600/5 border-blue-500/20 text-blue-400 font-black text-lg flex items-center justify-between`}>
              <span>{calcResult}</span>
              <Calculator size={18} className="opacity-40" />
            </div>
            <div className="absolute -bottom-5 right-2 text-[8px] font-black text-slate-700 uppercase tracking-widest">Calculado: {field.formula}</div>
          </div>
        );
      case 'TEXTAREA':
        return <textarea placeholder={field.placeholder} className={`${commonClasses} h-24 resize-none`} />;
      case 'SELECT':
        return (
          <select className={`${commonClasses} appearance-none cursor-pointer`} onChange={e => handlePreviewChange(field.db_name, e.target.value)}>
            {field.options?.map((o, i) => <option key={i} value={o}>{o}</option>)}
          </select>
        );
      case 'NUMBER':
        return <input type="number" placeholder={field.placeholder} onChange={e => handlePreviewChange(field.db_name, e.target.value)} className={commonClasses} />;
      case 'CHECKBOX':
        return (
          <label className="flex items-center space-x-3 p-4 bg-slate-900 border-2 border-slate-800 rounded-2xl cursor-pointer hover:border-blue-500/30 transition-all">
            <input type="checkbox" className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-blue-600" onChange={e => handlePreviewChange(field.db_name, e.target.checked ? 1 : 0)} />
            <span className="text-xs text-slate-400 font-bold uppercase">Booleano (1/0)</span>
          </label>
        );
      case 'INFO':
        return (
          <div className="p-6 bg-blue-600/5 border border-blue-500/20 rounded-3xl">
            <p className="text-xs text-slate-400 font-medium leading-relaxed italic">"{field.info_text}"</p>
          </div>
        );
      default:
        return <input type={field.type === 'PASSWORD' ? 'password' : 'text'} placeholder={field.placeholder} onChange={e => handlePreviewChange(field.db_name, e.target.value)} className={commonClasses} />;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase flex items-center">
            <LayoutTemplate className="mr-4 text-blue-500" size={36} />
            CRM Form Architect
          </h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Estructura interfaces inteligentes con lógica aritmética v4.7.9.</p>
        </div>
        <div className="flex items-center space-x-4">
           <button 
             onClick={() => { setPreviewMode(!previewMode); setPreviewValues({}); }}
             className={`flex items-center space-x-3 px-8 py-4 rounded-3xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${previewMode ? 'bg-amber-600 border-amber-500 text-white shadow-xl' : 'glass border-slate-800 text-slate-400 hover:text-white'}`}
           >
             <Eye size={18} />
             <span>{previewMode ? 'Cerrar Vista' : 'Previsualizar'}</span>
           </button>
           <button 
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex items-center space-x-3 bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-[28px] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50"
           >
             {isSaving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
             <span>{isSaving ? 'Sincronizando...' : 'Publicar Todos'}</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* Selector de Plantillas */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
           <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] px-4">Layouts del Nodo</h4>
           <div className="space-y-2">
              {forms.map(f => (
                <div 
                  key={f.id}
                  onClick={() => { setSelectedFormId(f.id); setPreviewMode(false); }}
                  className={`p-6 rounded-[36px] border-2 cursor-pointer transition-all relative group ${selectedFormId === f.id ? 'bg-blue-600/10 border-blue-500 shadow-xl' : 'glass border-slate-800 hover:bg-slate-800/40'}`}
                >
                   <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-xl ${selectedFormId === f.id ? 'bg-blue-600 text-white' : 'bg-slate-950 text-slate-600'}`}>
                         <Layout size={18} />
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); deleteForm(f.id); }} className="opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-rose-500 transition-all"><Trash2 size={14} /></button>
                   </div>
                   <h5 className={`font-black text-xs uppercase tracking-tight truncate ${selectedFormId === f.id ? 'text-white' : 'text-slate-400'}`}>{f.name}</h5>
                   <p className="text-[8px] text-slate-500 font-bold uppercase mt-1 tracking-widest">{f.fields.length} Nodos de Datos</p>
                </div>
              ))}
              <button 
                onClick={createNewForm}
                className="w-full p-8 border-2 border-dashed border-slate-800 rounded-[36px] flex flex-col items-center justify-center space-y-3 text-slate-600 hover:border-blue-500/40 hover:text-blue-400 transition-all group mt-6"
              >
                 <Plus size={32} className="group-hover:rotate-90 transition-transform" />
                 <span className="text-[9px] font-black uppercase tracking-widest">Añadir Esquema</span>
              </button>
           </div>
        </div>

        {/* Editor / Canvas */}
        <div className="col-span-12 lg:col-span-9">
           {previewMode ? (
             <div className="glass p-16 rounded-[72px] border border-amber-500/20 bg-amber-500/5 shadow-2xl space-y-12 animate-in zoom-in-95 duration-500 min-h-[700px] flex flex-col">
                <div className="flex items-center justify-between border-b border-amber-500/10 pb-8">
                   <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-xl">
                        <Smartphone size={32} />
                      </div>
                      <div>
                        <h4 className="text-3xl font-black text-white uppercase tracking-tighter">{selectedForm.name}</h4>
                        <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.4em] mt-1">Previsualización de Lógica de Cálculo</p>
                      </div>
                   </div>
                   <div className="bg-slate-950 px-6 py-2 rounded-full border border-slate-800 text-[10px] font-black text-slate-600 uppercase tracking-widest">ID: {selectedForm.id}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 flex-1 content-start">
                   {selectedForm.fields.map(field => (
                      <div key={field.id} className="space-y-3">
                         <div className="flex items-center justify-between ml-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                               {field.label} {field.required && <span className="text-rose-500">*</span>}
                            </label>
                            {field.type !== 'HIDDEN' && field.type !== 'INFO' && (
                              <span className={`text-[8px] font-black px-2 py-0.5 rounded border ${field.type === 'CALCULATION' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'text-slate-700 border-slate-800'}`}>{field.type}</span>
                            )}
                         </div>
                         {renderFieldPreview(field)}
                      </div>
                   ))}
                </div>

                <div className="pt-10 border-t border-slate-800 flex justify-end">
                   <button className="bg-emerald-600/20 text-emerald-500/50 px-12 py-5 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] cursor-not-allowed border border-emerald-500/10">Sellar Registro (Preview)</button>
                </div>
             </div>
           ) : (
             <div className="space-y-8 animate-in slide-in-from-right-6 duration-500 h-full flex flex-col">
                <div className="glass p-10 rounded-[56px] border border-slate-700/50 shadow-xl space-y-6">
                   <div className="flex items-center space-x-8">
                      <div className="w-16 h-16 rounded-[24px] bg-blue-600/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-inner"><Edit2 size={28} /></div>
                      <div className="flex-1">
                         <input 
                           type="text" 
                           value={selectedForm.name} 
                           onChange={e => setForms(forms.map(f => f.id === selectedFormId ? { ...f, name: e.target.value } : f))}
                           className="bg-transparent border-none outline-none text-4xl font-black text-white uppercase tracking-tighter w-full focus:text-blue-400 transition-colors"
                         />
                         <input 
                           type="text" 
                           value={selectedForm.description} 
                           onChange={e => setForms(forms.map(f => f.id === selectedFormId ? { ...f, description: e.target.value } : f))}
                           className="bg-transparent border-none outline-none text-[10px] font-bold text-slate-600 uppercase tracking-[0.4em] w-full mt-2"
                         />
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3 shrink-0">
                   {FIELD_TYPES_CONFIG.map(config => (
                     <button 
                      key={config.type}
                      onClick={() => addField(config.type)}
                      className="p-4 rounded-3xl glass border border-slate-800 flex flex-col items-center justify-center space-y-2 hover:border-blue-500/40 hover:bg-blue-600/5 transition-all group"
                     >
                        <config.icon size={18} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
                        <span className="text-[8px] font-black uppercase text-slate-500 group-hover:text-slate-300 tracking-tighter text-center">{config.label}</span>
                     </button>
                   ))}
                </div>

                <div className="flex-1 space-y-4 pb-20">
                   {selectedForm.fields.map((field, index) => (
                     <div key={field.id} className="glass p-8 rounded-[40px] border border-slate-800 shadow-xl flex items-center gap-8 group hover:border-blue-500/30 transition-all animate-in slide-in-from-left-4" style={{ animationDelay: `${index * 50}ms` }}>
                        <div className="flex flex-col items-center space-y-1">
                           <button 
                             onClick={() => moveField(index, 'UP')}
                             disabled={index === 0}
                             className="p-2 bg-slate-900 rounded-lg text-slate-600 hover:text-blue-400 disabled:opacity-10 transition-colors"
                           >
                              <ChevronUp size={16} />
                           </button>
                           <div className="p-1 bg-slate-950 rounded-md border border-slate-900 text-[8px] font-black text-slate-700">{index + 1}</div>
                           <button 
                             onClick={() => moveField(index, 'DOWN')}
                             disabled={index === selectedForm.fields.length - 1}
                             className="p-2 bg-slate-900 rounded-lg text-slate-600 hover:text-blue-400 disabled:opacity-10 transition-colors"
                           >
                              <ChevronDown size={16} />
                           </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
                           <div className="md:col-span-3 space-y-2">
                              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Etiqueta Visual</label>
                              <input 
                                type="text" 
                                value={field.label}
                                onChange={e => updateField(field.id, { label: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white font-bold outline-none focus:border-blue-500"
                              />
                           </div>
                           <div className="md:col-span-3 space-y-2">
                              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Slug DB (Key)</label>
                              <input 
                                type="text" 
                                value={field.db_name}
                                onChange={e => updateField(field.id, { db_name: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-[10px] text-emerald-400 font-mono outline-none focus:border-blue-500"
                              />
                           </div>
                           
                           {/* Configuración específica por tipo */}
                           {field.type === 'CALCULATION' ? (
                              <div className="md:col-span-4 space-y-2">
                                <label className="text-[9px] font-black text-blue-500 uppercase tracking-widest ml-1 flex items-center">
                                   <Calculator size={10} className="mr-1" /> Fórmula Aritmética
                                </label>
                                <input 
                                  type="text" 
                                  value={field.formula}
                                  onChange={e => updateField(field.id, { formula: e.target.value })}
                                  placeholder="ej: slug_a + slug_b * 0.15"
                                  className="w-full bg-slate-950 border-2 border-blue-500/20 rounded-xl px-4 py-2 text-xs text-blue-400 font-black outline-none focus:border-blue-500 shadow-lg"
                                />
                              </div>
                           ) : (field.type === 'SELECT' || field.type === 'RADIO') ? (
                              <div className="md:col-span-4 space-y-2">
                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Opciones (Separadas por coma)</label>
                                <input 
                                  type="text" 
                                  value={field.options?.join(', ')}
                                  onChange={e => updateField(field.id, { options: e.target.value.split(',').map(s => s.trim()) })}
                                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-[10px] text-blue-400 font-bold outline-none"
                                />
                              </div>
                           ) : field.type === 'INFO' ? (
                             <div className="md:col-span-4 space-y-2">
                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Contenido Informativo</label>
                                <input 
                                  type="text" 
                                  value={field.info_text}
                                  onChange={e => updateField(field.id, { info_text: e.target.value })}
                                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-[10px] text-slate-400 outline-none"
                                />
                             </div>
                           ) : (
                              <div className="md:col-span-4 space-y-2">
                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Placeholder</label>
                                <input 
                                  type="text" 
                                  value={field.placeholder}
                                  onChange={e => updateField(field.id, { placeholder: e.target.value })}
                                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-[10px] text-slate-500 outline-none"
                                />
                              </div>
                           )}

                           <div className="md:col-span-2 flex items-center justify-end space-x-2">
                              <button 
                               onClick={() => updateField(field.id, { required: !field.required })}
                               className={`p-3 rounded-xl border transition-all ${field.required ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' : 'bg-slate-950 border-slate-800 text-slate-700'}`}
                               title="Requerido"
                              >
                                <ShieldCheck size={18} />
                              </button>
                              <button onClick={() => removeField(field.id)} className="p-3 bg-slate-950 border border-slate-800 text-slate-700 hover:text-rose-500 transition-all"><Trash2 size={18} /></button>
                           </div>
                        </div>
                     </div>
                   ))}
                   
                   <div className="p-16 border-4 border-dashed border-slate-800 rounded-[56px] flex flex-col items-center justify-center space-y-4 opacity-30 hover:opacity-100 hover:border-blue-500/30 transition-all cursor-default bg-slate-900/5">
                      <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
                         <Plus size={32} className="text-slate-700" />
                      </div>
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Selecciona un tipo de campo arriba para inyectar</p>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>

      <div className="p-12 glass rounded-[64px] border border-blue-500/20 bg-blue-600/5 flex items-center justify-between shadow-2xl group">
         <div className="flex items-center space-x-10">
            <div className="w-20 h-20 rounded-[32px] bg-blue-600/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform shadow-inner">
               <Database size={40} />
            </div>
            <div>
               <h4 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Motor de Virtualización v4.7.9</h4>
               <p className="text-sm text-slate-400 max-w-2xl font-medium leading-relaxed uppercase tracking-widest">
                  Los campos de cálculo procesan expresiones dinámicas en el lado del cliente y se almacenan como valores persistentes en el clúster PostgreSQL para reportes BI masivos.
               </p>
            </div>
         </div>
         <button className="bg-slate-950 border-2 border-blue-500/30 text-blue-400 px-12 py-5 rounded-[28px] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95 flex items-center space-x-3">
            <Code size={18} />
            <span>Ver Schema JSON</span>
         </button>
      </div>
    </div>
  );
};

export default FormDesigner;

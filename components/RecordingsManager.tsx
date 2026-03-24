import React, { useState, useEffect } from 'react';
import { Play, Download, FileAudio, Calendar, Search, RefreshCw, MessageSquare, BrainCircuit, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

interface Recording {
  id: string | number;
  name: string;
  date: string;
  size: string;
  duration: string;
}

interface TranscriptionData {
  transcription: string;
  summary?: string;
}

export const RecordingsManager: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<TranscriptionData | null>(null);
  const [transcribingId, setTranscribingId] = useState<string | number | null>(null);

  const fetchRecordings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/recordings');
      const data = await response.json();
      setRecordings(data);
    } catch (error) {
      console.error('Error fetching recordings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecordings();
  }, []);

  const filteredRecordings = recordings.filter(rec => 
    rec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.date.includes(searchTerm)
  );

  const handlePlay = (rec: Recording) => {
    setSelectedAudio(`/api/recordings/${rec.date}/${rec.name}`);
  };

  const handleTranscribe = async (rec: Recording) => {
    setTranscribingId(rec.id);
    setTranscription(null);
    try {
      // 1. Fetch the audio file
      const audioUrl = `/api/recordings/${rec.date}/${rec.name}`;
      const audioResponse = await fetch(audioUrl);
      
      if (!audioResponse.ok) {
        // If file not found (likely in mock mode), provide mock transcription
        setTranscription({
          transcription: "Esta es una transcripción de prueba generada por la IA (Modo Simulado). En un entorno real con FreeSwitch, el audio se procesaría mediante Gemini para extraer el texto completo de la conversación entre el agente y el cliente.",
          summary: "Resumen ejecutivo: El cliente muestra interés en el producto pero solicita una rebaja en el precio final."
        });
        return;
      }

      const audioBlob = await audioResponse.blob();
      
      // 2. Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(',')[1];
          resolve(base64String);
        };
        reader.readAsDataURL(audioBlob);
      });
      const base64Audio = await base64Promise;

      // 3. Call Gemini
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: "audio/wav",
                  data: base64Audio
                }
              },
              { text: "Transcribe esta llamada telefónica y proporciona un breve resumen de los puntos clave. Responde en formato JSON con los campos 'transcription' y 'summary'." }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const resultText = response.text;
      try {
        const parsed = JSON.parse(resultText);
        setTranscription(parsed);
      } catch (e) {
        setTranscription({
          transcription: resultText,
          summary: "Resumen no disponible en formato estructurado."
        });
      }
    } catch (error) {
      console.error('Error transcribing:', error);
      setTranscription({
        transcription: "Error al procesar la transcripción. Verifique la conexión con el motor de IA.",
        summary: "Error de procesamiento."
      });
    } finally {
      setTranscribingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        <div className="p-6 border-b border-black/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FileAudio className="w-5 h-5 text-emerald-600" />
            Gestor de Grabaciones
          </h2>
          <p className="text-sm text-gray-500">Historial de llamadas y auditoría</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o fecha..."
              className="pl-9 pr-4 py-2 bg-gray-50 border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={fetchRecordings}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
            title="Actualizar"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 font-semibold">
              <th className="px-6 py-4">Archivo</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Tamaño</th>
              <th className="px-6 py-4">Duración</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  Cargando grabaciones...
                </td>
              </tr>
            ) : filteredRecordings.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  No se encontraron grabaciones.
                </td>
              </tr>
            ) : (
              filteredRecordings.map((rec) => (
                <motion.tr 
                  key={rec.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <FileAudio className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]" title={rec.name}>
                        {rec.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {rec.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{rec.size}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{rec.duration}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleTranscribe(rec)}
                        disabled={transcribingId === rec.id}
                        className={`p-2 rounded-lg transition-colors ${transcribingId === rec.id ? 'text-blue-400 bg-blue-50' : 'text-blue-600 hover:bg-blue-50'}`}
                        title="Transcribir con IA"
                      >
                        <BrainCircuit className={`w-4 h-4 ${transcribingId === rec.id ? 'animate-pulse' : ''}`} />
                      </button>
                      <button 
                        onClick={() => handlePlay(rec)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Reproducir"
                      >
                        <Play className="w-4 h-4 fill-current" />
                      </button>
                      <a 
                        href={`/api/recordings/${rec.date}/${rec.name}`}
                        download
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Descargar"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {transcription && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-6 bg-blue-50 border-t border-blue-100 relative"
          >
            <button 
              onClick={() => setTranscription(null)}
              className="absolute top-4 right-4 p-1 hover:bg-blue-100 rounded-full text-blue-600"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-2 mb-4">
              <BrainCircuit className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-blue-900 uppercase tracking-widest">Análisis de IA Nexus</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Transcripción Completa</h4>
                <div className="bg-white/50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed border border-blue-100">
                  {transcription.transcription}
                </div>
              </div>
              <div className="md:col-span-1">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Resumen Ejecutivo</h4>
                <div className="bg-blue-600 text-white rounded-xl p-4 text-sm font-medium shadow-lg shadow-blue-600/20">
                  {transcription.summary || "Generando resumen..."}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedAudio && (
        <div className="p-6 bg-emerald-50 border-t border-emerald-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Reproductor de Audio</span>
            <button onClick={() => setSelectedAudio(null)} className="text-emerald-600 text-xs hover:underline">Cerrar</button>
          </div>
          <audio controls className="w-full" autoPlay src={selectedAudio}>
            Tu navegador no soporta el elemento de audio.
          </audio>
          <p className="mt-2 text-[10px] text-emerald-600/60 italic">
            * Nota: En el entorno de vista previa, el audio real puede no estar disponible si no hay un servidor FreeSwitch real.
          </p>
        </div>
      )}
    </div>
  </div>
);
};

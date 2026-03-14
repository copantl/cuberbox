import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import esl from 'modesl';

import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", version: "4.7.9" });
  });

  // Recordings API
  app.get("/api/recordings", (req, res) => {
    const recordingsBase = "/opt/cuberbox/recordings";
    const isMockMode = process.env.MOCK_ESL === 'true' || !fs.existsSync(recordingsBase);

    if (isMockMode) {
      // Mock data for preview/dev
      return res.json([
        { id: 1, name: "Juan_Perez_5551234567_103005.wav", date: "2026-03-14", size: "1.2 MB", duration: "02:15" },
        { id: 2, name: "Maria_Gomez_5559876543_114520.wav", date: "2026-03-14", size: "850 KB", duration: "01:30" },
        { id: 3, name: "agent_1001_120000.wav", date: "2026-03-13", size: "5.4 MB", duration: "10:00" },
      ]);
    }

    try {
      const dates = fs.readdirSync(recordingsBase);
      let allFiles: any[] = [];
      dates.forEach(date => {
        const datePath = path.join(recordingsBase, date);
        if (fs.lstatSync(datePath).isDirectory()) {
          const files = fs.readdirSync(datePath);
          files.forEach(file => {
            const stats = fs.statSync(path.join(datePath, file));
            allFiles.push({
              id: `${date}_${file}`,
              name: file,
              date: date,
              size: `${(stats.size / 1024).toFixed(1)} KB`,
              duration: "--:--" // Duration extraction would require ffmpeg/ffprobe
            });
          });
        }
      });
      res.json(allFiles.reverse());
    } catch (err) {
      res.status(500).json({ error: "Error al leer grabaciones", details: err });
    }
  });

  app.get("/api/recordings/:date/:filename", (req, res) => {
    const { date, filename } = req.params;
    const filePath = path.join("/opt/cuberbox/recordings", date, filename);

    if (process.env.MOCK_ESL === 'true' || !fs.existsSync(filePath)) {
      // In mock mode, we could return a placeholder audio or 404
      return res.status(404).send("Archivo no encontrado (Modo Mock)");
    }

    res.download(filePath);
  });

  app.post("/api/recordings/transcribe", async (req, res) => {
    const { date, filename } = req.body;
    const isMockMode = process.env.MOCK_ESL === 'true';

    if (isMockMode) {
      return res.json({
        transcription: "Esta es una transcripción de prueba generada por la IA. En un entorno real, el audio se procesaría mediante Gemini para extraer el texto completo de la conversación entre el agente y el cliente.",
        summary: "Resumen ejecutivo: El cliente muestra interés en el producto pero solicita una rebaja en el precio final."
      });
    }

    try {
      const filePath = path.join("/opt/cuberbox/recordings", date, filename);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Archivo no encontrado" });
      }

      // Read file and convert to base64
      const audioData = fs.readFileSync(filePath).toString("base64");

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: "audio/wav",
            data: audioData
          }
        },
        { text: "Transcribe esta llamada telefónica y proporciona un breve resumen de los puntos clave." },
      ]);

      const response = await result.response;
      res.json({ transcription: response.text() });
    } catch (err) {
      console.error("Transcription error:", err);
      res.status(500).json({ error: "Error en la transcripción", details: err });
    }
  });

  // Generic ESL Command API
  app.post("/api/telephony/command", (req, res) => {
    const { command } = req.body;
    
    if (!command) {
      return res.status(400).json({ error: "El comando es obligatorio" });
    }

    const eslHost = process.env.ESL_HOST || '127.0.0.1';
    const eslPort = parseInt(process.env.ESL_PORT || '8021');
    const eslPassword = process.env.ESL_PASSWORD || 'ClueCon';
    const isMockMode = process.env.MOCK_ESL === 'true';

    if (isMockMode) {
      console.log(`[MOCK ESL CMD] Executing: ${command}`);
      return res.json({ status: "success", message: "+OK (Simulated response for: " + command + ")" });
    }

    const conn = new esl.Connection(eslHost, eslPort, eslPassword, () => {
      conn.api(command, (response) => {
        const body = response.getBody();
        conn.disconnect();
        res.json({ status: "success", message: body });
      });
    });

    conn.on('error', (err: any) => {
      res.status(500).json({ error: "Error de conexión ESL", details: err });
    });
  });

  // In-memory audit logs (in a real app, these would be in a database)
  const auditLogs: any[] = [];

  app.get("/api/telephony/audit-logs", (req, res) => {
    res.json(auditLogs);
  });

  app.post("/api/telephony/eavesdrop", (req, res) => {
    const { uuid, supervisorExtension, mode, customerName, customerNumber } = req.body;
    
    if (!uuid || !supervisorExtension) {
      return res.status(400).json({ error: "UUID y Extensión del Supervisor son obligatorios" });
    }

    // Record audit log
    auditLogs.unshift({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      supervisorExtension,
      targetUuid: uuid,
      customerName: customerName || 'Desconocido',
      customerNumber: customerNumber || 'N/A',
      mode: mode || 'listen'
    });

    // Keep only last 100 logs
    if (auditLogs.length > 100) auditLogs.pop();

    const eslHost = process.env.ESL_HOST || '127.0.0.1';
    const eslPort = parseInt(process.env.ESL_PORT || '8021');
    const eslPassword = process.env.ESL_PASSWORD || 'ClueCon';
    const isMockMode = process.env.MOCK_ESL === 'true';

    // Modes: listen (default), whisper (agent only), barge (both)
    let vars = '';
    if (mode === 'whisper') {
      vars = 'eavesdrop_whisper_aleg=false,eavesdrop_whisper_bleg=true,';
    } else if (mode === 'barge') {
      vars = 'eavesdrop_whisper_aleg=true,eavesdrop_whisper_bleg=true,';
    }

    const command = `originate {${vars}origination_caller_id_name=NexusSpy,origination_caller_id_number=000}user/${supervisorExtension} &eavesdrop(${uuid})`;

    if (isMockMode) {
      console.log(`[MOCK ESL SPY] Mode: ${mode || 'listen'} | Executing: ${command}`);
      return res.json({ status: "success", message: `Listening session initiated (${mode || 'listen'}) (Mock)` });
    }

    const conn = new esl.Connection(eslHost, eslPort, eslPassword, () => {
      conn.api(command, (response) => {
        const body = response.getBody();
        conn.disconnect();
        res.json({ status: "success", message: body });
      });
    });

    conn.on('error', (err: any) => {
      res.status(500).json({ error: "Error de conexión ESL", details: err });
    });
  });

  // Telephony API (ESL Bridge)
  app.post("/api/telephony/originate", (req, res) => {
    const { destination, extension, gateway, customerName } = req.body;
    
    if (!destination || !extension) {
      return res.status(400).json({ error: "Destino y Extensión son obligatorios" });
    }

    const eslHost = process.env.ESL_HOST || '127.0.0.1';
    const eslPort = parseInt(process.env.ESL_PORT || '8021');
    const eslPassword = process.env.ESL_PASSWORD || 'ClueCon';
    const isMockMode = process.env.MOCK_ESL === 'true';

    if (isMockMode && eslHost === '127.0.0.1') {
      // Simulación de ESL solo si está explícitamente en modo MOCK y es localhost
      console.log(`[MOCK ESL] Originating call to ${destination} (${customerName || 'Unknown'}) via ${gateway || 'internal'}...`);
      setTimeout(() => {
        res.json({ 
          status: "success", 
          message: "+OK 7482-af23-11ed-9482-0123456789ab",
          isMock: true 
        });
      }, 1000);
      return;
    }

    // Intentar conectar al ESL de FreeSwitch real
    const conn = new esl.Connection(eslHost, eslPort, eslPassword, () => {
      // Comando para originar llamada: 
      // 1. Llama a la extensión del agente
      // 2. Al contestar, lo puentea (bridge) al destino externo vía gateway
      
      let command = "";
      const nameVar = customerName ? `cuberbox_customer_name='${customerName.replace(/'/g, "")}',` : "";
      
      if (gateway) {
        command = `originate {${nameVar}origination_caller_id_number=${extension}}user/${extension} &bridge(sofia/gateway/${gateway}/${destination})`;
      } else {
        // Modo prueba: Llama a la extensión y lo manda a un eco
        command = `originate {${nameVar}}user/${extension} &echo`;
      }

      conn.api(command, (response) => {
        const body = response.getBody();
        conn.disconnect();
        if (body.startsWith('+OK')) {
          res.json({ status: "success", message: body });
        } else {
          res.status(500).json({ status: "error", message: body });
        }
      });
    });

    conn.on('error', (err: any) => {
      console.error("ESL Connection Error:", err);
      res.status(500).json({ 
        error: "Error de conexión con FreeSwitch (ESL)", 
        details: `No se pudo conectar a ${eslHost}:${eslPort}. Verifique que FreeSwitch esté corriendo y que la contraseña sea correcta.` 
      });
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
});

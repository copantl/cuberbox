import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import esl from 'modesl';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  
  // Database Pool Setup
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'nexus_admin',
    password: process.env.DB_PASSWORD || 'NexusPass2026!',
    database: process.env.DB_NAME || 'nexus_db',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  let dbConnected = false;

  // Test DB connection on startup
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.log('[DB] Running in Preview Mode (PostgreSQL not detected). Using in-memory fallback.');
      dbConnected = false;
    } else {
      console.log('[DB] Connected to PostgreSQL at:', res.rows[0].now);
      dbConnected = true;
      
      // Ensure omnichannel_messages table exists
      pool.query(`
        CREATE TABLE IF NOT EXISTS omnichannel_messages (
          id SERIAL PRIMARY KEY,
          channel VARCHAR(50) NOT NULL,
          sender_id VARCHAR(100) NOT NULL,
          content TEXT NOT NULL,
          direction VARCHAR(20) NOT NULL,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          status VARCHAR(20) DEFAULT 'delivered',
          campaign_id VARCHAR(100)
        )
      `).catch(e => console.error('[DB] Error creating omnichannel table:', e.message));

      // Add campaign_id column if it doesn't exist (for existing tables)
      pool.query(`
        DO $$ 
        BEGIN 
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='omnichannel_messages' AND column_name='campaign_id') THEN
            ALTER TABLE omnichannel_messages ADD COLUMN campaign_id VARCHAR(100);
          END IF;
        END $$;
      `).catch(e => console.error('[DB] Error altering omnichannel table:', e.message));

      // Ensure telephony_nodes table exists
      pool.query(`
        CREATE TABLE IF NOT EXISTS telephony_nodes (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          ip VARCHAR(50) NOT NULL,
          port INTEGER DEFAULT 8021,
          password VARCHAR(100) DEFAULT 'ClueCon',
          role VARCHAR(20) DEFAULT 'MEDIA', -- 'MASTER', 'MEDIA', 'AI_BRIDGE'
          status VARCHAR(20) DEFAULT 'OFFLINE',
          last_seen TIMESTAMP
        )
      `).catch(e => console.error('[DB] Error creating nodes table:', e.message));
    }
  });

  // --- Telephony Nodes API ---

  app.get("/api/telephony/nodes", async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM telephony_nodes ORDER BY name ASC');
      res.json(result.rows);
    } catch (err: any) {
      res.json([
        { id: 1, name: 'Default Node (ENV)', ip: process.env.ESL_HOST || '127.0.0.1', port: 8021, role: 'MASTER', status: 'ONLINE' }
      ]);
    }
  });

  app.post("/api/telephony/nodes", async (req, res) => {
    const { name, ip, port, password, role } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO telephony_nodes (name, ip, port, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, ip, port || 8021, password || 'ClueCon', role || 'MEDIA']
      );
      res.json(result.rows[0]);
    } catch (err: any) {
      res.status(500).json({ error: "Error al crear nodo", details: err.message });
    }
  });

  // Serve setup scripts directly
  app.use('/setup', express.static(path.join(__dirname, 'setup')));
  
  // Serve manuals and ISO files
  app.use('/manuals', express.static(path.join(__dirname, 'manuals')));
  app.use('/iso', express.static(path.join(__dirname, 'iso')));
  
  // Direct download for the installer and ISO builder
  app.get('/nexus-installer.sh', (req, res) => {
    res.sendFile(path.join(__dirname, 'nexus-installer.sh'));
  });
  app.get('/build-iso.sh', (req, res) => {
    res.sendFile(path.join(__dirname, 'build-iso.sh'));
  });

  // Keycloak Middleware
  const keycloakUrl = process.env.VITE_KEYCLOAK_URL || 'https://keycloak.nexus-core.com';
  const keycloakRealm = process.env.VITE_KEYCLOAK_REALM || 'nexus-core';

  const client = jwksClient({
    jwksUri: `${keycloakUrl}/realms/${keycloakRealm}/protocol/openid-connect/certs`
  });

  function getKey(header: any, callback: any) {
    client.getSigningKey(header.kid, (err, key: any) => {
      if (err) return callback(err);
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    });
  }

  const checkAuth = (req: any, res: any, next: any) => {
    // Si no hay URL de Keycloak configurada (entorno de desarrollo/preview sin secretos), permitimos el paso
    if (!process.env.KEYCLOAK_URL) {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No se proporcionó token de autenticación' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, getKey, {
      issuer: `${keycloakUrl}/realms/${keycloakRealm}`,
      algorithms: ['RS256']
    }, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Token inválido o expirado', details: err.message });
      }
      (req as any).user = decoded;
      next();
    });
  };

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", version: "4.7.9" });
  });

  // Protect all other /api routes
  app.use("/api", checkAuth);

  // Database Status API
  app.get("/api/db/status", async (req, res) => {
    if (!dbConnected) {
      return res.json({ status: "preview", message: "Running in Preview Mode (In-Memory Fallback)" });
    }
    try {
      const result = await pool.query('SELECT version()');
      res.json({ status: "connected", version: result.rows[0].version });
    } catch (err: any) {
      res.status(500).json({ status: "error", message: err.message });
    }
  });

  // Users API (Real DB)
  app.get("/api/users", async (req, res) => {
    if (!dbConnected) {
      return res.json([
        { id: '1', username: 'admin', full_name: 'Administrador CUBERBOX Nexus', role: 'ADMIN', email: 'admin@cuberbox-nexus.com', extension: '1000', mfa_enabled: true, is_active: true },
        { id: '2', username: 'agent1', full_name: 'Juan Perez', role: 'AGENT', email: 'juan@cuberbox-nexus.com', extension: '1001', mfa_enabled: false, is_active: true }
      ]);
    }
    try {
      const result = await pool.query('SELECT id, username, full_name, role, email, extension, mfa_enabled, is_active, created_at FROM users');
      res.json(result.rows);
    } catch (err: any) {
      res.json([
        { id: '1', username: 'admin', full_name: 'Administrador CUBERBOX Nexus', role: 'ADMIN', email: 'admin@cuberbox-nexus.com', extension: '1000', mfa_enabled: true, is_active: true },
        { id: '2', username: 'agent1', full_name: 'Juan Perez', role: 'AGENT', email: 'juan@cuberbox-nexus.com', extension: '1001', mfa_enabled: false, is_active: true }
      ]);
    }
  });

  // Campaigns API (Real DB)
  app.get("/api/campaigns", async (req, res) => {
    if (!dbConnected) {
      return res.json([
        { id: '1', name: 'Real Estate Florida', campaign_type: 'OUTBOUND', dial_method: 'RATIO', auto_dial_level: 2.5, hopper_level: 500, amd_enabled: true },
        { id: '2', name: 'Soporte Técnico', campaign_type: 'INBOUND', dial_method: 'MANUAL', auto_dial_level: 1.0, hopper_level: 100, amd_enabled: false }
      ]);
    }
    try {
      const result = await pool.query('SELECT * FROM campaigns ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (err: any) {
      res.json([
        { id: '1', name: 'Real Estate Florida', campaign_type: 'OUTBOUND', dial_method: 'RATIO', auto_dial_level: 2.5, hopper_level: 500, amd_enabled: true },
        { id: '2', name: 'Soporte Técnico', campaign_type: 'INBOUND', dial_method: 'MANUAL', auto_dial_level: 1.0, hopper_level: 100, amd_enabled: false }
      ]);
    }
  });

  // Audit Logs API (Real DB)
  app.get("/api/telephony/audit-logs", async (req, res) => {
    if (!dbConnected) {
      return res.json(auditLogs);
    }
    try {
      // In a real app, we'd have an audit_logs table. For now, we use CDR or a dedicated table.
      // If the table doesn't exist, we'll catch and return the in-memory logs.
      const result = await pool.query('SELECT * FROM cdr ORDER BY start_time DESC LIMIT 100');
      res.json(result.rows);
    } catch (err: any) {
      res.json(auditLogs);
    }
  });

  // Recordings API
  app.get("/api/recordings", (req, res) => {
    const recordingsBase = process.env.RECORDINGS_PATH || "/opt/nexus/recordings";
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
    const recordingsBase = process.env.RECORDINGS_PATH || "/opt/nexus/recordings";
    const filePath = path.join(recordingsBase, date, filename);

    if (process.env.MOCK_ESL === 'true' || !fs.existsSync(filePath)) {
      // In mock mode, we could return a placeholder audio or 404
      return res.status(404).send("Archivo no encontrado (Modo Mock)");
    }

    res.download(filePath);
  });

  app.post("/api/recordings/transcribe", async (req, res) => {
    // This endpoint is deprecated. Transcription should be handled on the frontend using @google/genai.
    res.status(410).json({ error: "Endpoint deprecated. Use frontend Gemini integration." });
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

  app.get("/api/telephony/channels", (req, res) => {
    const eslHost = process.env.ESL_HOST || '127.0.0.1';
    const eslPort = parseInt(process.env.ESL_PORT || '8021');
    const eslPassword = process.env.ESL_PASSWORD || 'ClueCon';
    const isMockMode = process.env.MOCK_ESL === 'true';

    if (isMockMode) {
      // Mock data for bubbles
      return res.json([
        { uuid: '1', direction: 'inbound', state: 'CS_EXECUTE', cid_name: 'Juan Perez', cid_num: '5551234567', dest: '1001', presence_id: '1001@default' },
        { uuid: '2', direction: 'outbound', state: 'CS_EXECUTE', cid_name: 'Maria Gomez', cid_num: '5559876543', dest: '1002', presence_id: '1002@default' },
        { uuid: '3', direction: 'inbound', state: 'CS_EXECUTE', cid_name: 'Carlos Ruiz', cid_num: '5550001111', dest: '1003', presence_id: '1003@default' },
        { uuid: '4', direction: 'inbound', state: 'CS_EXECUTE', cid_name: 'Ana Belen', cid_num: '5552223333', dest: '1004', presence_id: '1004@default' },
      ]);
    }

    const conn = new esl.Connection(eslHost, eslPort, eslPassword, () => {
      conn.api('show channels as json', (response) => {
        try {
          const body = response.getBody();
          const data = JSON.parse(body);
          const channels = (data.rows || []).map((row: any) => ({
            uuid: row.uuid,
            direction: row.direction,
            state: row.state,
            cid_name: row.cid_name,
            cid_num: row.cid_num,
            dest: row.dest,
            presence_id: row.presence_id
          }));
          res.json(channels);
        } catch (e) {
          res.status(500).json({ error: "Error parseando canales", details: e });
        } finally {
          conn.disconnect();
        }
      });
    });

    conn.on('error', (err: any) => {
      res.status(500).json({ error: "Error de conexión ESL", details: err });
    });
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

    const command = `originate {${vars}origination_caller_id_name=CUBERBOXNexusSpy,origination_caller_id_number=000}user/${supervisorExtension} &eavesdrop(${uuid})`;

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
      const nameVar = customerName ? `nexus_customer_name='${customerName.replace(/'/g, "")}',` : "";
      
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

  // --- WhatsApp Omnichannel API ---

  // Webhook Verification (Meta requires this for initial setup)
  app.get("/api/webhook/whatsapp", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'nexus_token_2026';

    if (mode && token) {
      if (mode === "subscribe" && token === verifyToken) {
        console.log("[WA] Webhook verified successfully.");
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    }
  });

  // Webhook: Receiving Messages from Meta
  app.post("/api/webhook/whatsapp", async (req, res) => {
    const body = req.body;

    // Check if it's a WhatsApp message event
    if (body.object === "whatsapp_business_account") {
      try {
        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const message = value?.messages?.[0];

        if (message) {
          const from = message.from; // Sender's phone number
          const text = message.text?.body; // Message content
          const timestamp = message.timestamp;

          console.log(`[WA] New message from ${from}: ${text}`);

          // Try to find the campaign associated with this session
          let campaignId = null;
          try {
            const lastOutbound = await pool.query(
              'SELECT campaign_id FROM omnichannel_messages WHERE sender_id = $1 AND direction = $2 AND campaign_id IS NOT NULL ORDER BY timestamp DESC LIMIT 1',
              [from, 'outbound']
            );
            if (lastOutbound.rows.length > 0) {
              campaignId = lastOutbound.rows[0].campaign_id;
            }
          } catch (e) {
            console.error('[DB] Error fetching last outbound for campaign association:', e);
          }

          // 1. Store in Database (CDR or dedicated messages table)
          await pool.query(
            'INSERT INTO omnichannel_messages (channel, sender_id, content, direction, timestamp, campaign_id) VALUES ($1, $2, $3, $4, to_timestamp($5), $6)',
            ['whatsapp', from, text, 'inbound', parseInt(timestamp), campaignId]
          ).catch(err => console.error('[DB] Error saving WA message:', err.message));

          // 2. Broadcast to Frontend (In a real app, use WebSockets)
          // For now, we'll rely on the frontend polling or a simple event bus
        }
        
        res.sendStatus(200);
      } catch (err) {
        console.error("[WA] Error processing webhook:", err);
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(404);
    }
  });

  // API: Sending Messages via Meta
  app.post("/api/whatsapp/send", async (req, res) => {
    const { to, text, campaignId } = req.body;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const version = process.env.WHATSAPP_API_VERSION || 'v18.0';

    if (!to || !text) {
      return res.status(400).json({ error: "Destinatario y texto son obligatorios" });
    }

    if (!accessToken || !phoneId) {
      console.warn("[WA] Missing credentials, simulating send...");
      // Record in DB even if simulated
      await pool.query(
        'INSERT INTO omnichannel_messages (channel, sender_id, content, direction, campaign_id) VALUES ($1, $2, $3, $4, $5)',
        ['whatsapp', to, text, 'outbound', campaignId]
      ).catch(err => console.error('[DB] Error saving WA simulated message:', err.message));
      
      return res.json({ status: "simulated", message: "Mensaje enviado (Modo Simulación)" });
    }

    try {
      const response = await fetch(`https://graph.facebook.com/${version}/${phoneId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: to,
          type: "text",
          text: { body: text }
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Record in DB
        await pool.query(
          'INSERT INTO omnichannel_messages (channel, sender_id, content, direction, campaign_id) VALUES ($1, $2, $3, $4, $5)',
          ['whatsapp', to, text, 'outbound', campaignId]
        ).catch(err => console.error('[DB] Error saving WA outbound message:', err.message));

        res.json({ status: "success", data });
      } else {
        res.status(response.status).json({ status: "error", data });
      }
    } catch (err) {
      res.status(500).json({ error: "Error enviando mensaje de WhatsApp", details: err });
    }
  });

  // --- TIKTOK INTEGRATION ---

  // Webhook: Verification for TikTok
  app.get('/api/webhook/tiktok', (req, res) => {
    const verifyToken = process.env.TIKTOK_VERIFY_TOKEN;
    const challenge = req.query['challenge'];
    const token = req.query['verify_token'];

    if (challenge && token === verifyToken) {
      console.log("[TT] Webhook verificado correctamente.");
      res.send(challenge);
    } else {
      console.error("[TT] Error de verificación de Webhook.");
      res.sendStatus(403);
    }
  });

  // Webhook: Receiving Messages from TikTok
  app.post('/api/webhook/tiktok', async (req, res) => {
    const body = req.body;
    console.log("[TT] Webhook recibido:", JSON.stringify(body, null, 2));

    // TikTok sends events in a specific format
    if (body.event === 'message') {
      try {
        const message = body.data;
        const senderId = message.sender_openid;
        const content = message.content;

        // Try to find the campaign associated with this session
        let campaignId = null;
        try {
          const lastOutbound = await pool.query(
            'SELECT campaign_id FROM omnichannel_messages WHERE sender_id = $1 AND direction = $2 AND campaign_id IS NOT NULL ORDER BY timestamp DESC LIMIT 1',
            [senderId, 'outbound']
          );
          if (lastOutbound.rows.length > 0) {
            campaignId = lastOutbound.rows[0].campaign_id;
          }
        } catch (e) {
          console.error('[DB] Error fetching last outbound for campaign association:', e);
        }

        // Record in DB
        await pool.query(
          'INSERT INTO omnichannel_messages (channel, sender_id, content, direction, campaign_id) VALUES ($1, $2, $3, $4, $5)',
          ['tiktok', senderId, content, 'inbound', campaignId]
        ).catch(err => console.error('[DB] Error saving TT inbound message:', err.message));
        
        res.sendStatus(200);
      } catch (err) {
        console.error("[TT] Error processing webhook:", err);
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(200); // Acknowledge other events
    }
  });

  // API: Sending Messages via TikTok
  app.post("/api/tiktok/send", async (req, res) => {
    const { to, text, campaignId } = req.body;
    const accessToken = process.env.TIKTOK_ACCESS_TOKEN;

    if (!to || !text) {
      return res.status(400).json({ error: "Destinatario y texto son obligatorios" });
    }

    if (!accessToken) {
      console.warn("[TT] Missing credentials, simulating send...");
      // Record in DB even if simulated
      await pool.query(
        'INSERT INTO omnichannel_messages (channel, sender_id, content, direction, campaign_id) VALUES ($1, $2, $3, $4, $5)',
        ['tiktok', to, text, 'outbound', campaignId]
      ).catch(err => console.error('[DB] Error saving TT simulated message:', err.message));
      
      return res.json({ status: "simulated", message: "Mensaje enviado (Modo Simulación)" });
    }

    try {
      // TikTok Business API endpoint for sending messages
      const response = await fetch(`https://business-api.tiktok.com/open_api/v1.3/message/send/`, {
        method: 'POST',
        headers: {
          'Access-Token': accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipient_openid: to,
          message_type: "text",
          content: text
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Record in DB
        await pool.query(
          'INSERT INTO omnichannel_messages (channel, sender_id, content, direction, campaign_id) VALUES ($1, $2, $3, $4, $5)',
          ['tiktok', to, text, 'outbound', campaignId]
        ).catch(err => console.error('[DB] Error saving TT outbound message:', err.message));
        res.json({ status: "success", data });
      } else {
        res.status(response.status).json({ status: "error", data });
      }
    } catch (err) {
      console.error("[TT] Error sending message:", err);
      res.status(500).json({ error: "Error al enviar mensaje" });
    }
  });

  // --- FACEBOOK & INSTAGRAM INTEGRATION ---

  // Webhook: Verification for Facebook/Instagram
  app.get(['/api/webhook/facebook', '/api/webhook/instagram'], (req, res) => {
    const verifyToken = process.env.META_VERIFY_TOKEN;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
      if (mode === 'subscribe' && token === verifyToken) {
        console.log("[META] Webhook verificado correctamente.");
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    }
  });

  // Webhook: Receiving Messages from Facebook/Instagram
  app.post(['/api/webhook/facebook', '/api/webhook/instagram'], async (req, res) => {
    const body = req.body;
    console.log("[META] Webhook recibido:", JSON.stringify(body, null, 2));

    if (body.object === 'page' || body.object === 'instagram') {
      try {
        for (const entry of (body.entry || [])) {
          const messaging = entry.messaging?.[0];
          if (messaging && messaging.message) {
            const senderId = messaging.sender.id;
            const content = messaging.message.text;
            const channel = body.object === 'page' ? 'facebook' : 'instagram';

            if (content) {
              // Try to find the campaign associated with this session
              let campaignId = null;
              try {
                const lastOutbound = await pool.query(
                  'SELECT campaign_id FROM omnichannel_messages WHERE sender_id = $1 AND direction = $2 AND campaign_id IS NOT NULL ORDER BY timestamp DESC LIMIT 1',
                  [senderId, 'outbound']
                );
                if (lastOutbound.rows.length > 0) {
                  campaignId = lastOutbound.rows[0].campaign_id;
                }
              } catch (e) {
                console.error('[DB] Error fetching last outbound for campaign association:', e);
              }

              await pool.query(
                'INSERT INTO omnichannel_messages (channel, sender_id, content, direction, campaign_id) VALUES ($1, $2, $3, $4, $5)',
                [channel, senderId, content, 'inbound', campaignId]
              );
            }
          }
        }
        res.sendStatus(200);
      } catch (err) {
        console.error("[META] Error processing webhook:", err);
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(404);
    }
  });

  // API: Sending Messages via Facebook
  app.post("/api/facebook/send", async (req, res) => {
    const { to, text, campaignId } = req.body;
    const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

    if (!to || !text) return res.status(400).json({ error: "Destinatario y texto son obligatorios" });
    if (!accessToken) {
      await pool.query('INSERT INTO omnichannel_messages (channel, sender_id, content, direction, campaign_id) VALUES ($1, $2, $3, $4, $5)', ['facebook', to, text, 'outbound', campaignId]);
      return res.json({ status: "simulated", message: "Mensaje enviado (Modo Simulación)" });
    }

    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/me/messages?access_token=${accessToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: { id: to },
          message: { text: text }
        })
      });
      const data = await response.json();
      if (response.ok) {
        await pool.query('INSERT INTO omnichannel_messages (channel, sender_id, content, direction, campaign_id) VALUES ($1, $2, $3, $4, $5)', ['facebook', to, text, 'outbound', campaignId]);
        res.json({ status: "success", data });
      } else res.status(response.status).json({ status: "error", data });
    } catch (err) { res.status(500).json({ error: "Error enviando mensaje de Facebook", details: err }); }
  });

  // API: Sending Messages via Instagram
  app.post("/api/instagram/send", async (req, res) => {
    const { to, text, campaignId } = req.body;
    const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

    if (!to || !text) return res.status(400).json({ error: "Destinatario y texto son obligatorios" });
    if (!accessToken) {
      await pool.query('INSERT INTO omnichannel_messages (channel, sender_id, content, direction, campaign_id) VALUES ($1, $2, $3, $4, $5)', ['instagram', to, text, 'outbound', campaignId]);
      return res.json({ status: "simulated", message: "Mensaje enviado (Modo Simulación)" });
    }

    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/me/messages?access_token=${accessToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: { id: to },
          message: { text: text }
        })
      });
      const data = await response.json();
      if (response.ok) {
        await pool.query('INSERT INTO omnichannel_messages (channel, sender_id, content, direction, campaign_id) VALUES ($1, $2, $3, $4, $5)', ['instagram', to, text, 'outbound', campaignId]);
        res.json({ status: "success", data });
      } else res.status(response.status).json({ status: "error", data });
    } catch (err) { res.status(500).json({ error: "Error enviando mensaje de Instagram", details: err }); }
  });

  // API: Fetching Omnichannel Messages
  app.get("/api/omnichannel/messages", async (req, res) => {
    if (!dbConnected) {
      return res.json([]);
    }
    const { campaignId } = req.query;
    try {
      let query = 'SELECT * FROM omnichannel_messages';
      let params: any[] = [];
      
      if (campaignId) {
        query += ' WHERE campaign_id = $1';
        params.push(campaignId);
      }
      
      query += ' ORDER BY timestamp DESC LIMIT 100';
      
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (err: any) {
      res.status(500).json({ error: "Error al obtener mensajes", details: err.message });
    }
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

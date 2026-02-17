
import { 
  UserRole, Campaign, User, CallCode, PauseCode, AIBot, UserGroup, 
  CRMIntegration, SIPTrunk, DID, AudioAsset, UserProfile, SMTPServer,
  ClusterNode, GTRAgentMetric, GTRQueueMetric, StorageNode, RecordingAsset,
  BackupJob, DBNode, HANode, HAConfig
} from './types';

// Exported PAUSE_CODES
export const PAUSE_CODES: PauseCode[] = [
  { id: '1', name: 'Almuerzo', billable: false, isActive: true, color: '#3b82f6' },
  { id: '2', name: 'Baño', billable: true, isActive: true, color: '#10b981' },
  { id: '3', name: 'Break', billable: true, isActive: true, color: '#f59e0b' },
  { id: '4', name: 'Capacitación', billable: true, isActive: true, color: '#8b5cf6' },
];

export const MOCK_CALL_CODES: CallCode[] = [
  { id: 'SALE', name: 'VENTA CERRADA', isSale: true, isDNC: false, isCallback: false, selectable: true, color: 'emerald', description: 'Venta completada satisfactoriamente' },
  { id: 'CBK', name: 'LLAMAR LUEGO', isSale: false, isDNC: false, isCallback: true, selectable: true, color: 'blue', description: 'Cliente solicita rellamada' },
  { id: 'NI', name: 'NO INTERESADO', isSale: false, isDNC: false, isCallback: false, selectable: true, color: 'rose', description: 'Cliente no desea el servicio' },
  { id: 'DNC', name: 'REMOVER (DNC)', isSale: false, isDNC: true, isCallback: false, selectable: true, color: 'red', description: 'Bloqueo legal solicitado' },
  { id: 'NA', name: 'NO CONTESTA', isSale: false, isDNC: false, isCallback: false, selectable: false, color: 'slate', description: 'Sin respuesta del destino' },
  { id: 'VM', name: 'BUZON DE VOZ', isSale: false, isDNC: false, isCallback: false, selectable: false, color: 'slate', description: 'Contestador automático' },
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  { 
    id: '1', 
    name: 'Real Estate Florida', 
    status: 'ACTIVE', 
    type: 'OUTBOUND',
    dialMethod: 'PREDICTIVE', 
    autoDialLevel: 4.5, 
    adaptiveMaxDropRate: 3.0,
    hopperLevel: 250,
    amdEnabled: true,
    recordingMode: 'ALL_CALLS',
    liveStats: {
      callsActive: 42, callsRinging: 12, agentsOnline: 45, agentsOnCall: 40,
      agentsPaused: 3, agentsReady: 2, salesToday: 15, dropRate: 1.2,
      pacingLevel: 4.5, hopperAvailable: 1500
    }
  },
  { 
    id: '2', 
    name: 'Atención Clientes (IN)', 
    status: 'ACTIVE', 
    type: 'INBOUND',
    dialMethod: 'MANUAL', 
    autoDialLevel: 1.0, 
    adaptiveMaxDropRate: 0,
    hopperLevel: 50,
    amdEnabled: false,
    recordingMode: 'ALL_CALLS'
  },
];

export const MOCK_USER: User = {
  id: 'usr_1',
  username: 'admin',
  role: UserRole.ADMIN,
  fullName: 'Administrador Maestro',
  email: 'admin@cuberbox.com',
  extension: '1000',
  status: 'online',
  userLevel: 9
};

// Exported missing mock data
export const MOCK_BOTS: AIBot[] = [
  { id: 'bot_1', name: 'Helena - Sales Expert', campaignId: '1', prompt: 'Eres una vendedora experta...' },
  { id: 'bot_2', name: 'Kore - Support Agent', campaignId: '2', prompt: 'Eres un agente de soporte técnico...' },
];

export const MOCK_LISTS = [
  { id: '1001', name: 'Real Estate Florida - Nov', total: 4500 },
  { id: '1002', name: 'Health Leads Cold', total: 12000 },
];

export const MOCK_CDR_DATA = [
  { id: 'cdr_001', timestamp: '2024-11-20 16:30:00', source: '1001', destination: '+13055550122', duration: 320, disposition: 'ANSWERED', cost: 0.45 },
  { id: 'cdr_002', timestamp: '2024-11-20 16:35:00', source: '1002', destination: '+13055550123', duration: 120, disposition: 'NO ANSWER', cost: 0 },
];

export const MOCK_PAUSE_RECORDS = [
  { id: 'pr_1', agentId: 'usr_2', codeId: '1', duration: 3600, timestamp: '2024-11-20 12:00:00' },
  { id: 'pr_2', agentId: 'usr_2', codeId: '2', duration: 300, timestamp: '2024-11-20 14:00:00' },
];

export const MOCK_USERS_LIST: User[] = [
  MOCK_USER,
  { id: 'usr_2', username: 'mgonzalez', role: UserRole.AGENT, fullName: 'Maria Gonzalez', email: 'maria@cuberbox.com', extension: '1001', status: 'online', userLevel: 1, groupId: 'g_1' },
  { id: 'usr_3', username: 'jperez', role: UserRole.AGENT, fullName: 'Juan Perez', email: 'juan@cuberbox.com', extension: '1002', status: 'paused', userLevel: 1, groupId: 'g_1' },
];

export const MOCK_USER_GROUPS: UserGroup[] = [
  { 
    id: 'g_1', name: 'Sales Team A', description: 'Equipo de ventas primario', accessLevel: 1, 
    permissions: { 
      canRecord: true, canManualDial: true, canExportReports: false, canDeleteLeads: false, 
      canChangeCampaign: false, canViewAgentStats: true, canBargeCalls: false, 
      canManageDNC: false, canUseAICopilot: true, canModifyWorkflows: false 
    }, 
    memberIds: ['usr_2', 'usr_3'] 
  },
];

export const MOCK_CRM_INTEGRATIONS: CRMIntegration[] = [
  { 
    id: 'crm_1', name: 'Salesforce Core', provider: 'SALESFORCE', apiUrl: 'https://salesforce.com/api', 
    apiKey: 'sfdc_key_123', isActive: true, syncEvents: ['CALL_END', 'DISPOSITION'], 
    fieldMapping: { 'phone': 'MobilePhone', 'status': 'Status' } 
  },
];

export const MOCK_TRUNKS: SIPTrunk[] = [
  { id: 'trunk_1', name: 'Twilio Gateway', status: 'registered', host: 'sip.twilio.com' },
];

export const MOCK_DIDS: DID[] = [
  { id: 'did_1', number: '+13055550122', carrierId: 'trunk_1', campaignId: '1' },
];

export const MOCK_AUDIO_ASSETS: AudioAsset[] = [
  { id: 'aud_1', name: 'welcome.wav', campaignId: '1', url: '#', duration: '0:15', size: '1.2 MB', format: 'WAV', createdAt: '2024-11-20', minAccessLevel: 1, category: 'IVR_PROMPT' },
];

export const MOCK_USER_PROFILES: UserProfile[] = [
  { 
    id: 'prof_1', name: 'Standard Agent', description: 'Perfil base para agentes', accessLevel: 1, userCount: 12, color: 'blue', 
    permissions: { canBarge: false, canWhisper: false, canDeleteLeads: false, canExportReports: false, canModifyCampaigns: false, canUseAI: true, canManageDNC: false, canRecord: true } 
  },
];

export const MOCK_SMTP_SERVERS: SMTPServer[] = [
  { id: 'smtp_1', name: 'Gmail Relay', host: 'smtp.gmail.com', port: 587, encryption: 'TLS', authMethod: 'LOGIN', username: 'relay@cuberbox.com', fromEmail: 'noreply@cuberbox.com', fromName: 'Cuberbox', isActive: true, status: 'CONNECTED' },
];

export const MOCK_AGENT_STATS = [
  { agentName: 'Maria Gonzalez', campaignId: '1', calls: 150, sales: 12, talkTime: 18000, pauseTime: 3600, wrapUpTime: 1200, waitTime: 4500, occupancy: 88, callsPerHour: 18, aht: 120, dispositions: { 'SALE': 12, 'CBK': 20 } },
];

export const MOCK_STORAGE_NODES: StorageNode[] = [
  { id: 'st_1', name: 'Alpha Storage', ip: '10.0.0.50', path: '/mnt/recordings', status: 'ONLINE', usedSpace: 450, totalSpace: 1000, iops: 1200 },
];

export const MOCK_RECORDINGS: RecordingAsset[] = [
  { id: 'rec_1', timestamp: '2024-11-21 14:05:22', agentName: 'Maria G.', campaignName: 'Real Estate Florida', customerPhone: '+13055550122', callId: 'cid_7482', fileSize: '1.2 MB', sentiment: 'POSITIVE' },
];

export const MOCK_BACKUP_JOBS: BackupJob[] = [
  { id: 'job_1', timestamp: '2024-11-21 02:00:00', destination: 'AWS S3', type: 'FULL', size: '4.2 GB', status: 'COMPLETED' },
];

export const MOCK_DB_NODES: DBNode[] = [
  { id: 'db_1', name: 'Primary DB', ip: '10.0.0.5', port: 5432, role: 'MASTER', status: 'SYNCHRONIZED', replicationLag: '0ms', uptime: '12d 8h' },
];

export const MOCK_HA_NODES: HANode[] = [
  { id: 'ha_1', name: 'Load Balancer 01', ip: '10.0.0.1', weight: 100, isPrimary: true, status: 'ACTIVE' },
  { id: 'ha_2', name: 'Load Balancer 02', ip: '10.0.0.2', weight: 100, isPrimary: false, status: 'STANDBY' },
];

export const MOCK_HA_CONFIG: HAConfig = {
  loadBalancerMode: 'ROUND_ROBIN',
  virtualIP: '10.0.0.100',
  interface: 'eth0',
  keepalivedPriority: 100,
  healthCheckInterval: 2000
};

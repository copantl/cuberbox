
export enum UserRole {
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
  MANAGER = 'MANAGER',
  MONITOR_GTR = 'MONITOR_GTR',
  SOCIAL_MEDIA_MANAGER = 'SOCIAL_MEDIA_MANAGER'
}

export type ThemeType = 'midnight' | 'light' | 'ocean' | 'obsidian' | 'forest' | 'sunset' | 'cyber' | 'minimal';
export type DialMethod = 'MANUAL' | 'RATIO' | 'PREDICTIVE' | 'PREVIEW';
export type CampaignType = 'OUTBOUND' | 'INBOUND' | 'BLENDED' | 'SURVEY';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  city: string;
  address?: string;
  custom_fields: Record<string, string>;
  status: string;
  last_call?: string;
}

export interface Script {
  id: string;
  name: string;
  content: string; 
}

export interface CampaignRealTime {
  callsActive: number;
  callsRinging: number;
  agentsOnline: number;
  agentsOnCall: number;
  agentsPaused: number;
  agentsReady: number;
  salesToday: number;
  dropRate: number;
  pacingLevel: number;
  hopperAvailable: number;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  type: CampaignType;
  dialMethod: DialMethod;
  autoDialLevel: number;
  adaptiveMaxDropRate: number;
  hopperLevel: number;
  amdEnabled: boolean;
  recordingMode: 'ALL_CALLS' | 'MANUAL' | 'NEVER';
  scriptId?: string;
  mohId?: string;
  liveStats?: CampaignRealTime;
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  fullName: string;
  email: string;
  extension: string;
  status: 'online' | 'offline' | 'oncall' | 'paused' | 'wrapup';
  userLevel: number;
  groupId?: string;
  mfaEnabled?: boolean;
  authMethod?: 'LOCAL' | 'LDAP' | 'OIDC';
}

export type ChannelType = 'WHATSAPP' | 'TIKTOK' | 'FACEBOOK' | 'INSTAGRAM' | 'SMS';
export type InteractionStatus = 'QUEUE' | 'ASSIGNED' | 'RESOLVED';

export interface WhatsAppMessage {
  id: string;
  text: string;
  sender: 'AGENT' | 'CUSTOMER' | 'SYSTEM';
  timestamp: string;
}

export interface WhatsAppConversation {
  id: string;
  contactName: string;
  channel: ChannelType;
  status: InteractionStatus;
  agentId?: string;
  campaignId?: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  lastActivity: string;
  messages: WhatsAppMessage[];
  summary?: string;
}

export interface UserGroup {
  id: string;
  name: string;
  description: string;
  accessLevel: number;
  permissions: {
    canRecord: boolean;
    canManualDial: boolean;
    canExportReports: boolean;
    canDeleteLeads: boolean;
    canChangeCampaign: boolean;
    canViewAgentStats: boolean;
    canBargeCalls: boolean;
    canManageDNC: boolean;
    canUseAICopilot: boolean;
    canModifyWorkflows: boolean;
  };
  memberIds: string[];
}

export interface CRMIntegration {
  id: string;
  name: string;
  provider: string;
  apiUrl: string;
  apiKey: string;
  isActive: boolean;
  syncEvents: ('CALL_START' | 'CALL_END' | 'DISPOSITION' | 'RECORDING')[];
  fieldMapping: Record<string, string>;
}

export interface PauseCode {
  id: string;
  name: string;
  billable: boolean;
  isActive: boolean;
  color: string;
}

export interface SIPTrunk {
  id: string;
  name: string;
  status: 'registered' | 'unregistered' | 'error';
  host: string;
}

export interface DID {
  id: string;
  number: string;
  carrierId: string;
  campaignId: string;
}

export interface QAEvaluation {
  id: string;
  cdrId: string;
  agentId: string;
  evaluatorId: string;
  timestamp: string;
  comment: string;
  finalScore: number;
  status: 'PASSED' | 'FAILED' | 'RECALIBRATION';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  ip: string;
  level: 'INFO' | 'WARN' | 'SECURITY' | 'CRITICAL';
  status: 'SUCCESS' | 'FAILURE';
  integrityHash: string;
  details: string;
}

export interface IVRNode {
  id: string;
  type: 'START' | 'PLAY_AUDIO' | 'MENU' | 'AI_BOT' | 'QUEUE' | 'HANGUP';
  title: string;
  position: { x: number; y: number };
  config: any;
}

export interface DNCRecord {
  id: string;
  phoneNumber: string;
  reason: string;
  addedBy: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  description: string;
  accessLevel: number;
  userCount: number;
  color: string;
  permissions: {
    canBarge: boolean;
    canWhisper: boolean;
    canDeleteLeads: boolean;
    canExportReports: boolean;
    canModifyCampaigns: boolean;
    canUseAI: boolean;
    canManageDNC: boolean;
    canRecord: boolean;
  };
}

export interface AudioAsset {
  id: string;
  name: string;
  campaignId: string;
  url: string;
  duration: string;
  size: string;
  format: string;
  createdAt: string;
  minAccessLevel: number;
  category: string;
}

export interface SMTPServer {
  id: string;
  name: string;
  host: string;
  port: number;
  encryption: 'NONE' | 'SSL' | 'TLS' | 'STARTTLS';
  authMethod: 'LOGIN' | 'PLAIN' | 'CRAM-MD5';
  username: string;
  password?: string;
  fromEmail: string;
  fromName: string;
  isActive: boolean;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
}

export type NodeRole = 'MASTER' | 'MEDIA' | 'DATABASE' | 'AI_BRIDGE';
export type SyncStatus = 'ONLINE' | 'OFFLINE' | 'PROVISIONING' | 'REPLICATING' | 'SYNCHRONIZED';

export interface ClusterNode {
  id: string;
  name: string;
  ip: string;
  sshPort?: number;
  role: NodeRole;
  status: SyncStatus;
  cpu: number;
  mem: number;
  channels: number;
  threads: number;
  dbLatency: number;
  lastSync?: string;
}

export interface GTRAgentMetric {
  agentId: string;
  agentName: string;
  status: string;
  statusDuration: number;
  campaignName: string;
  callsToday: number;
  salesToday: number;
  occupancyRate: number;
  currentCallDuration?: number;
  warningLevel: 'NONE' | 'LOW' | 'CRITICAL';
}

export interface GTRQueueMetric {
  queueName: string;
  callsWaiting: number;
  longestWait: number;
  agentsLogged: number;
  agentsReady: number;
  slaPercent: number;
}

export interface StorageNode {
  id: string;
  name: string;
  ip: string;
  path: string;
  status: 'ONLINE' | 'OFFLINE';
  usedSpace: number;
  totalSpace: number;
  iops: number;
}

export interface RecordingAsset {
  id: string;
  timestamp: string;
  agentName: string;
  campaignName: string;
  customerPhone: string;
  callId: string;
  fileSize: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
}

export interface BackupJob {
  id: string;
  timestamp: string;
  destination: string;
  type: string;
  size: string;
  status: 'COMPLETED' | 'FAILED' | 'PENDING';
}

export interface DBNode {
  id: string;
  name: string;
  ip: string;
  port: number;
  role: 'MASTER' | 'SLAVE';
  status: SyncStatus;
  replicationLag?: string;
  uptime?: string;
}

export interface HANode {
  id: string;
  name: string;
  ip: string;
  weight: number;
  isPrimary: boolean;
  status: 'ACTIVE' | 'DOWN' | 'STANDBY';
}

export interface HAConfig {
  loadBalancerMode: 'ROUND_ROBIN' | 'LEAST_CONN' | 'IP_HASH';
  virtualIP: string;
  interface: string;
  keepalivedPriority: number;
  healthCheckInterval: number;
}

// Added CallCode interface
export interface CallCode {
  id: string;
  name: string;
  isSale: boolean;
  isDNC: boolean;
  isCallback: boolean;
  selectable: boolean;
  color: string;
  description: string;
  hotkey?: string;
  category?: string;
}

// Added AIBot interface
export interface AIBot {
  id: string;
  name: string;
  campaignId: string;
  prompt: string;
}

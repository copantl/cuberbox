
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AgentScreen from './components/AgentScreen';
import Campaigns from './components/Campaigns';
import ClusterMonitor from './components/ClusterMonitor';
import ClusterProvisioning from './components/ClusterProvisioning';
import HAConfig from './components/HAConfig';
import WhatsAppModule from './components/WhatsAppModule';
import EmailModule from './components/EmailModule';
import RealTimeMonitor from './components/RealTimeMonitor';
import GTRDashboard from './components/GTRDashboard';
import Login from './components/Login';
import TelephonyConfig from './components/TelephonyConfig';
import AIStudio from './components/AIStudio';
import Reports from './components/Reports';
import Settings from './components/Settings';
import UserManual from './components/UserManual';
import RequirementsSpec from './components/RequirementsSpec';
import Instructions from './components/Instructions';
import ListsManagement from './components/ListsManagement';
import UsersManagement from './components/UsersManagement';
import UserGroupsManagement from './components/UserGroupsManagement';
import UserProfilesManagement from './components/UserProfilesManagement';
import DNCManagement from './components/DNCManagement';
import QualityAssurance from './components/QualityAssurance';
import AnalyticsHub from './components/AnalyticsHub';
import BroadcastAI from './components/BroadcastAI';
import CRMIntegrations from './components/CRMIntegrations';
import ExternalIntegrations from './components/ExternalIntegrations';
import PauseCodesManagement from './components/PauseCodesManagement';
import CallCodesManagement from './components/CallCodesManagement';
import AudioLibrary from './components/AudioLibrary';
import SMTPServerManagement from './components/SMTPServerManagement';
import SystemAudit from './components/SystemAudit';
import SystemSetupWizard from './components/SystemSetupWizard';
import IVRDesigner from './components/IVRDesigner';
import Workflows from './components/Workflows';
import AgentPerformanceReport from './components/AgentPerformanceReport';
import StorageServer from './components/StorageServer';
import FormDesigner from './components/FormDesigner';
import ExternalCRMHub from './components/ExternalCRMHub';
import AccessControl from './components/AccessControl';
import Logo from './components/Logo';
import { RecordingsManager } from './components/RecordingsManager';
import { TelephonyConsole } from './components/TelephonyConsole';
import { LiveChannelMonitor } from './components/LiveChannelMonitor';

import { User, UserRole, ThemeType } from './types';
import { MOCK_USER } from './constants';
import { ToastProvider } from './ToastContext';
import { AuthProvider, useAuth } from './AuthContext';

const AppContent: React.FC = () => {
  const { isAuthenticated, user, login, logout, isInitialized } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<ThemeType>((localStorage.getItem('cuberbox-theme') as ThemeType) || 'midnight');

  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
    localStorage.setItem('cuberbox-theme', newTheme);
  };

  if (!isInitialized) {
    return (
      <div className="h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Logo className="w-16 h-16 animate-pulse" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] animate-pulse">Initializing Nexus Core</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isAuthenticated ? (
        <Login onLogin={(role?: UserRole) => {
          // Si Keycloak no está configurado, el login manual funciona
          login();
        }} />
      ) : (
        <Router>
          <div className={`flex h-screen overflow-hidden bg-[var(--bg-main)] text-[var(--ink)] selection:bg-blue-500/30 transition-colors duration-500`}>
            <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} role={user?.role || UserRole.AGENT} userLevel={user?.userLevel || 1} />
            
            <main className={`flex-1 flex flex-col transition-all duration-500 ease-in-out relative ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
              <Header 
                user={user || MOCK_USER} 
                currentTheme={theme} 
                onThemeToggle={handleThemeChange} 
                onLogout={logout} 
              />
              
              <div className="flex-1 overflow-y-auto p-8 scrollbar-hide relative">
                {/* Background Grid Accent */}
                <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                
                <div className="fixed bottom-12 right-12 opacity-[0.02] pointer-events-none z-0 rotate-12">
                  <Logo className="w-32 h-32" />
                </div>

                <div className="relative z-10 max-w-[1600px] mx-auto">
                  <Routes>
                    {/* Command Center */}
                    <Route path="/" element={
                      user?.role === UserRole.MONITOR_GTR ? <Navigate to="/gtr" /> :
                      user?.role === UserRole.SOCIAL_MEDIA_MANAGER ? <Navigate to="/whatsapp" /> :
                      <AccessControl userLevel={user?.userLevel || 1} minLevel={4} userRole={user?.role} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}><Dashboard /></AccessControl>
                    } />
                    <Route path="/agent" element={<AgentScreen user={user || MOCK_USER} />} />
                    <Route path="/realtime" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={4} userRole={user?.role} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.MONITOR_GTR]}><RealTimeMonitor /></AccessControl>} />
                    <Route path="/gtr" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={4} userRole={user?.role} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.MONITOR_GTR]}><GTRDashboard /></AccessControl>} />
                    <Route path="/live-monitor" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={4} userRole={user?.role} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.MONITOR_GTR]}><LiveChannelMonitor /></AccessControl>} />
                    <Route path="/whatsapp" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={1} userRole={user?.role} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.SOCIAL_MEDIA_MANAGER, UserRole.AGENT]}><WhatsAppModule /></AccessControl>} />
                    <Route path="/blueprint" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={6} userRole={user?.role} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}><Workflows /></AccessControl>} />

                    {/* Dialer Engine */}
                    <Route path="/campaigns" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={7} userRole={user?.role} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}><Campaigns /></AccessControl>} />
                    <Route path="/broadcast-ai" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={8} userRole={user?.role} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}><BroadcastAI /></AccessControl>} />
                    <Route path="/lists" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={7} userRole={user?.role} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}><ListsManagement /></AccessControl>} />
                    <Route path="/dnc" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={7} userRole={user?.role} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}><DNCManagement /></AccessControl>} />

                    {/* Neural Lab */}
                    <Route path="/ai-studio" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={7} userRole={user?.role} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}><AIStudio /></AccessControl>} />
                    <Route path="/ivr" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={7} userRole={user?.role} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}><IVRDesigner /></AccessControl>} />
                    <Route path="/audio-library" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={4} userRole={user?.role} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.AGENT]}><AudioLibrary user={user || MOCK_USER} /></AccessControl>} />

                    {/* Data & BI */}
                    <Route path="/analytics-hub" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={6} userRole={user?.role} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}><AnalyticsHub /></AccessControl>} />
                    <Route path="/reports" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={4} userRole={user?.role} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}><Reports /></AccessControl>} />
                    <Route path="/qa" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={5} userRole={user?.role} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}><QualityAssurance /></AccessControl>} />
                    <Route path="/recordings" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={4} userRole={user?.role} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}><RecordingsManager /></AccessControl>} />
                    <Route path="/integrations" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={8} userRole={user?.role} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}><ExternalIntegrations /></AccessControl>} />
                    <Route path="/crm" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={8} userRole={user?.role} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}><CRMIntegrations /></AccessControl>} />
                    <Route path="/crm-designer" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={8} userRole={user?.role} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}><FormDesigner /></AccessControl>} />
                    <Route path="/crm-hub" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={6} userRole={user?.role} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.SOCIAL_MEDIA_MANAGER]}><ExternalCRMHub /></AccessControl>} />

                    {/* Infrastructure */}
                    <Route path="/cluster" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={9} userRole={user?.role} allowedRoles={[UserRole.ADMIN]}><ClusterMonitor /></AccessControl>} />
                    <Route path="/cluster-provisioning" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={9} userRole={user?.role} allowedRoles={[UserRole.ADMIN]}><ClusterProvisioning /></AccessControl>} />
                    <Route path="/ha-config" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={9} userRole={user?.role} allowedRoles={[UserRole.ADMIN]}><HAConfig /></AccessControl>} />
                    <Route path="/telephony" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={9} userRole={user?.role} allowedRoles={[UserRole.ADMIN]}><TelephonyConfig /></AccessControl>} />
                    <Route path="/telephony-console" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={9} userRole={user?.role} allowedRoles={[UserRole.ADMIN]}><TelephonyConsole /></AccessControl>} />
                    <Route path="/storage" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={9} userRole={user?.role} allowedRoles={[UserRole.ADMIN]}><StorageServer /></AccessControl>} />

                    {/* Governance */}
                    <Route path="/users" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={9} userRole={user?.role} allowedRoles={[UserRole.ADMIN]}><UsersManagement currentUser={user || MOCK_USER} /></AccessControl>} />
                    <Route path="/user-groups" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={9} userRole={user?.role} allowedRoles={[UserRole.ADMIN]}><UserGroupsManagement /></AccessControl>} />
                    <Route path="/audit" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={9} userRole={user?.role} allowedRoles={[UserRole.ADMIN]}><SystemAudit /></AccessControl>} />
                    <Route path="/pause-codes" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={8} userRole={user?.role} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}><PauseCodesManagement /></AccessControl>} />
                    <Route path="/call-codes" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={8} userRole={user?.role} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}><CallCodesManagement /></AccessControl>} />

                    {/* System */}
                    <Route path="/settings" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={1} userRole={user?.role} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.SOCIAL_MEDIA_MANAGER, UserRole.AGENT, UserRole.MONITOR_GTR]}><Settings user={user || MOCK_USER} currentTheme={theme} onThemeChange={handleThemeChange} /></AccessControl>} />
                    <Route path="/setup-wizard" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={9} userRole={user?.role} allowedRoles={[UserRole.ADMIN]}><SystemSetupWizard /></AccessControl>} />
                    <Route path="/requirements" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={1} userRole={user?.role} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.SOCIAL_MEDIA_MANAGER, UserRole.AGENT, UserRole.MONITOR_GTR]}><RequirementsSpec /></AccessControl>} />
                    <Route path="/manual" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={1} userRole={user?.role} allowedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.SOCIAL_MEDIA_MANAGER, UserRole.AGENT, UserRole.MONITOR_GTR]}><UserManual /></AccessControl>} />
                    <Route path="/instructions" element={<AccessControl userLevel={user?.userLevel || 1} minLevel={9} userRole={user?.role} allowedRoles={[UserRole.ADMIN]}><Instructions /></AccessControl>} />
                    
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </div>
              </div>
            </main>
          </div>
        </Router>
      )}
    </>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;

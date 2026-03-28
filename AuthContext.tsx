
import React, { createContext, useContext, useEffect, useState } from 'react';
import Keycloak from 'keycloak-js';
import { User, UserRole } from './types';
import { MOCK_USER } from './constants';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: () => void;
  logout: () => void;
  token: string | null;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const kcUrl = import.meta.env.VITE_KEYCLOAK_URL;
    const kcRealm = import.meta.env.VITE_KEYCLOAK_REALM;
    const kcClientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;

    // Si no hay configuración de Keycloak, usamos el modo mock/invitado para desarrollo
    if (!kcUrl || !kcRealm || !kcClientId) {
      console.warn('Keycloak configuration missing. Running in mock auth mode.');
      setIsInitialized(true);
      return;
    }

    const initKeycloak = async () => {
      const kc = new Keycloak({
        url: kcUrl,
        realm: kcRealm,
        clientId: kcClientId,
      });

      try {
        const authenticated = await kc.init({
          onLoad: 'login-required',
          pkceMethod: 'S256',
        });

        setKeycloak(kc);
        setIsAuthenticated(authenticated);

        if (authenticated) {
          // Mapear roles de Keycloak a UserRole de la aplicación
          const kcRoles = kc.tokenParsed?.realm_access?.roles || [];
          let role = UserRole.AGENT;
          let level = 1;

          if (kcRoles.includes('admin')) {
            role = UserRole.ADMIN;
            level = 9;
          } else if (kcRoles.includes('manager')) {
            role = UserRole.MANAGER;
            level = 6;
          } else if (kcRoles.includes('monitor_gtr')) {
            role = UserRole.MONITOR_GTR;
            level = 4;
          } else if (kcRoles.includes('social_media')) {
            role = UserRole.SOCIAL_MEDIA_MANAGER;
            level = 4;
          }

          setUser({
            ...MOCK_USER,
            id: kc.tokenParsed?.sub || MOCK_USER.id,
            username: kc.tokenParsed?.preferred_username || MOCK_USER.username,
            email: kc.tokenParsed?.email || MOCK_USER.email,
            role,
            userLevel: level,
          });
        }
      } catch (error) {
        console.error('Failed to initialize Keycloak', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initKeycloak();
  }, []);

  const login = () => {
    if (keycloak) {
      keycloak.login();
    } else {
      // Fallback para modo mock
      setIsAuthenticated(true);
      setUser({ ...MOCK_USER, role: UserRole.ADMIN, userLevel: 9 });
    }
  };

  const logout = () => {
    if (keycloak) {
      keycloak.logout();
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout, 
      token: keycloak?.token || null,
      isInitialized 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

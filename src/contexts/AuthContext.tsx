import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, firebaseStatus } from '../firebase/config';
import {
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { AdminUser } from '../types';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemoAdmin: () => void;
  logout: () => Promise<void>;
}

const DEFAULT_DEMO_ADMIN: AdminUser = {
  uid: 'admin-dek-001',
  email: 'admin@deknovacore.com',
  displayName: 'Administrador NovaCore',
  role: 'superadmin',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('deknovacore_auth_user');
    return saved ? JSON.parse(saved) : DEFAULT_DEMO_ADMIN; // default demo logged in for effortless preview
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (firebaseStatus.isConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          const adminUser: AdminUser = {
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || 'Administrador',
            role: 'superadmin',
            photoURL: fbUser.photoURL || undefined,
          };
          setUser(adminUser);
          localStorage.setItem('deknovacore_auth_user', JSON.stringify(adminUser));
        }
        setIsLoading(false);
      });
      return () => unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    if (firebaseStatus.isConfigured && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        const adminUser: AdminUser = {
          uid: cred.user.uid,
          email: cred.user.email || email,
          displayName: cred.user.displayName || email.split('@')[0],
          role: 'superadmin',
        };
        setUser(adminUser);
        localStorage.setItem('deknovacore_auth_user', JSON.stringify(adminUser));
        setIsLoading(false);
        return { success: true };
      } catch (err: any) {
        setIsLoading(false);
        return { success: false, error: err.message || 'Error al autenticar con Firebase' };
      }
    } else {
      // Local demo authentication
      if (email.trim() && pass.length >= 4) {
        const demoUser: AdminUser = {
          uid: 'admin-local-' + Date.now(),
          email,
          displayName: email.split('@')[0] || 'Administrador',
          role: 'superadmin',
        };
        setUser(demoUser);
        localStorage.setItem('deknovacore_auth_user', JSON.stringify(demoUser));
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: 'Credenciales inválidas. Ingresa un correo válido y contraseña.' };
      }
    }
  };

  const loginAsDemoAdmin = () => {
    setUser(DEFAULT_DEMO_ADMIN);
    localStorage.setItem('deknovacore_auth_user', JSON.stringify(DEFAULT_DEMO_ADMIN));
  };

  const logout = async () => {
    if (firebaseStatus.isConfigured && auth) {
      try {
        await fbSignOut(auth);
      } catch (err) {
        console.warn('Logout error:', err);
      }
    }
    setUser(null);
    localStorage.removeItem('deknovacore_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginAsDemoAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isAdmin') === 'true';
    }
    return false;
  });

  const login = (password: string) => {
    // Simple password check - in production, use proper authentication
    if (password === 'admin123') {
      setIsAdmin(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('isAdmin', 'true');
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAdmin');
    }
  };

  useEffect(() => {
    // Keep isAdmin in sync with localStorage (in case of manual change)
    const handleStorage = () => {
      setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

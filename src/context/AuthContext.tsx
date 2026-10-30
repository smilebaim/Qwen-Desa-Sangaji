import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  username: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS = [
  { username: 'admin', password: 'admin123', name: 'Administrator Desa', role: 'Super Admin' },
  { username: 'operator', password: 'operator123', name: 'Operator Data', role: 'Operator Data' },
  { username: 'gis', password: 'gis123', name: 'Petugas GIS', role: 'Petugas GIS' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('maba_sangaji_user');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch { localStorage.removeItem('maba_sangaji_user'); }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const foundUser = DEMO_USERS.find(u => u.username === username && u.password === password);
    if (foundUser) {
      const userData: User = { username: foundUser.username, name: foundUser.name, role: foundUser.role };
      setUser(userData);
      localStorage.setItem('maba_sangaji_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('maba_sangaji_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

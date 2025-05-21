
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Company } from '@/types/models';
import { mockCompanies, mockUsers } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  company: Company | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Check for stored auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('schedulerUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
        
        // Find and set the company
        const userCompany = mockCompanies.find(c => c.id === parsedUser.companyId);
        if (userCompany) {
          setCompany(userCompany);
        }
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('schedulerUser');
      }
    }
    setLoading(false);
  }, []);
  
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by email (in a real app, would verify password too)
      const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        throw new Error('Usuário ou senha inválidos');
      }
      
      // Find the company for this user
      const userCompany = mockCompanies.find(c => c.id === foundUser.companyId);
      if (!userCompany) {
        throw new Error('Empresa não encontrada');
      }
      
      // Store in state and localStorage
      setUser(foundUser);
      setCompany(userCompany);
      localStorage.setItem('schedulerUser', JSON.stringify(foundUser));
      
      toast({
        title: "Login efetuado com sucesso",
        description: `Bem-vindo, ${foundUser.name}!`,
      });
    } catch (error) {
      toast({
        title: "Erro no login",
        description: error instanceof Error ? error.message : "Ocorreu um erro durante o login",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    setCompany(null);
    localStorage.removeItem('schedulerUser');
    toast({
      title: "Logout efetuado com sucesso",
    });
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      company,
      loading,
      login,
      logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

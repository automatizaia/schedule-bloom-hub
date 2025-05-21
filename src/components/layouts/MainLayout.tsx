
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Building, Calendar, Users, Settings, Bell, User, LogOut } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  const { user, company, logout } = useAuth();
  const navigate = useNavigate();

  if (!user || !company) return null;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar p-4 text-sidebar-foreground flex flex-col">
        <div className="mb-6 flex items-center space-x-2">
          <Building className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-bold">{company.name}</h1>
            <p className="text-sm opacity-80">Sistema de Agendamentos</p>
          </div>
        </div>
        
        <Separator className="bg-sidebar-border my-4" />
        
        <div className="space-y-1 mb-6 flex-1">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => navigate('/dashboard')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Agenda
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => navigate('/clients')}
          >
            <Users className="mr-2 h-4 w-4" />
            Clientes
          </Button>
          
          {user.role === 'admin' && (
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => navigate('/professionals')}
            >
              <Users className="mr-2 h-4 w-4" />
              Profissionais
            </Button>
          )}
          
          {user.role === 'admin' && (
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => navigate('/settings')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => navigate('/notifications')}
          >
            <Bell className="mr-2 h-4 w-4" />
            Notificações
          </Button>
        </div>
        
        <div className="mt-auto pt-4 border-t border-sidebar-border">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <div className="ml-2">
              <p className="font-medium">{user.name}</p>
              <p className="text-xs opacity-80">{user.role === 'admin' ? 'Administrador' : user.role === 'professional' ? 'Profissional' : 'Cliente'}</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white p-4 border-b">
          <h1 className="text-2xl font-bold">{title}</h1>
        </header>
        
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;

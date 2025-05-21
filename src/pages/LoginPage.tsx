
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Building } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the auth context
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20">
      <Card className="w-[380px] shadow-lg animate-fade-in">
        <CardHeader className="text-center">
          <div className="mx-auto p-2 rounded-full bg-primary/10 mb-2">
            <Building className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Bem-vindo</CardTitle>
          <CardDescription>
            Faça login para acessar seu sistema de agendamentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center flex-col text-center text-sm text-muted-foreground">
          <p>Para demonstração, use:</p>
          <p>- admin@clinica.com (Admin)</p>
          <p>- dr.marcos@clinica.com (Profissional)</p>
          <p>- cliente1@email.com (Cliente)</p>
          <p>A senha pode ser qualquer valor</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;

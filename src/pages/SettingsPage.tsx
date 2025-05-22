
import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SettingsPage: React.FC = () => {
  const { company } = useAuth();

  return (
    <MainLayout title="Configurações">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Settings className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-xl font-semibold">Configurações do Sistema</h2>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="company">Empresa</TabsTrigger>
          <TabsTrigger value="schedules">Agendamentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Ajuste as configurações gerais do seu sistema de agendamentos.
              </p>
              {/* Configurações gerais serão implementadas aqui */}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Empresa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Nome da empresa</h3>
                  <p>{company?.name}</p>
                </div>
                <div>
                  <h3 className="font-medium">Endereço</h3>
                  <p>{company?.address || 'Não informado'}</p>
                </div>
                <div>
                  <h3 className="font-medium">Telefone</h3>
                  <p>{company?.phone || 'Não informado'}</p>
                </div>
                {/* Outros dados da empresa serão exibidos aqui */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedules">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Agendamento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Configure regras para agendamentos, horários de funcionamento e outras opções.
              </p>
              {/* Configurações de agendamento serão implementadas aqui */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default SettingsPage;

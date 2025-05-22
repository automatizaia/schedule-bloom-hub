
import React, { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const SettingsPage: React.FC = () => {
  const { company } = useAuth();
  const { toast } = useToast();
  
  const [companySettings, setCompanySettings] = useState({
    name: company?.name || '',
    address: '',
    phone: '',
    email: '',
    description: ''
  });

  const [generalSettings, setGeneralSettings] = useState({
    darkMode: false,
    autoLogout: true,
    language: 'pt-BR'
  });

  const [scheduleSettings, setScheduleSettings] = useState({
    allowSelfScheduling: true,
    requireConfirmation: true,
    minimumAdvanceTimeHours: 2,
    defaultAppointmentDuration: 60
  });

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanySettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGeneralToggle = (setting: keyof typeof generalSettings) => {
    setGeneralSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleScheduleToggle = (setting: keyof typeof scheduleSettings) => {
    setScheduleSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleScheduleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setScheduleSettings(prev => ({
      ...prev,
      [name]: parseInt(value)
    }));
  };

  const saveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas alterações foram salvas com sucesso."
    });
  };

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
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="darkMode">Modo escuro</Label>
                    <p className="text-sm text-muted-foreground">Ativar o tema escuro no sistema</p>
                  </div>
                  <Switch 
                    id="darkMode" 
                    checked={generalSettings.darkMode}
                    onCheckedChange={() => handleGeneralToggle('darkMode')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoLogout">Logout automático</Label>
                    <p className="text-sm text-muted-foreground">Desconectar automaticamente após período de inatividade</p>
                  </div>
                  <Switch 
                    id="autoLogout" 
                    checked={generalSettings.autoLogout}
                    onCheckedChange={() => handleGeneralToggle('autoLogout')}
                  />
                </div>
                
                <div className="mt-6">
                  <Button onClick={saveSettings} className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Configurações
                  </Button>
                </div>
              </div>
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
                  <Label htmlFor="companyName">Nome da empresa</Label>
                  <Input
                    id="companyName"
                    name="name"
                    value={companySettings.name}
                    onChange={handleCompanyChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="companyAddress">Endereço</Label>
                  <Input
                    id="companyAddress"
                    name="address"
                    value={companySettings.address}
                    onChange={handleCompanyChange}
                    placeholder="Endereço completo"
                  />
                </div>
                
                <div>
                  <Label htmlFor="companyPhone">Telefone</Label>
                  <Input
                    id="companyPhone"
                    name="phone"
                    value={companySettings.phone}
                    onChange={handleCompanyChange}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                
                <div>
                  <Label htmlFor="companyEmail">E-mail</Label>
                  <Input
                    id="companyEmail"
                    name="email"
                    type="email"
                    value={companySettings.email}
                    onChange={handleCompanyChange}
                    placeholder="contato@empresa.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="companyDescription">Descrição</Label>
                  <Textarea
                    id="companyDescription"
                    name="description"
                    value={companySettings.description}
                    onChange={handleCompanyChange}
                    placeholder="Descreva sua empresa"
                  />
                </div>
                
                <div className="mt-6">
                  <Button onClick={saveSettings} className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Dados da Empresa
                  </Button>
                </div>
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
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowSelfScheduling">Permitir auto-agendamento</Label>
                    <p className="text-sm text-muted-foreground">Clientes podem agendar sem aprovação prévia</p>
                  </div>
                  <Switch 
                    id="allowSelfScheduling" 
                    checked={scheduleSettings.allowSelfScheduling}
                    onCheckedChange={() => handleScheduleToggle('allowSelfScheduling')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireConfirmation">Exigir confirmação</Label>
                    <p className="text-sm text-muted-foreground">Agendamentos precisam ser confirmados pela empresa</p>
                  </div>
                  <Switch 
                    id="requireConfirmation" 
                    checked={scheduleSettings.requireConfirmation}
                    onCheckedChange={() => handleScheduleToggle('requireConfirmation')}
                  />
                </div>
                
                <div>
                  <Label htmlFor="minimumAdvanceTimeHours">Antecedência mínima (horas)</Label>
                  <Input
                    id="minimumAdvanceTimeHours"
                    name="minimumAdvanceTimeHours"
                    type="number"
                    min="0"
                    value={scheduleSettings.minimumAdvanceTimeHours}
                    onChange={handleScheduleChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="defaultAppointmentDuration">Duração padrão de consultas (minutos)</Label>
                  <Input
                    id="defaultAppointmentDuration"
                    name="defaultAppointmentDuration"
                    type="number"
                    min="15"
                    step="15"
                    value={scheduleSettings.defaultAppointmentDuration}
                    onChange={handleScheduleChange}
                  />
                </div>
                
                <div className="mt-6">
                  <Button onClick={saveSettings} className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Configurações de Agendamento
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default SettingsPage;

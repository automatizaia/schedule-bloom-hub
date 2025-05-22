
import React, { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type NotificationType = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

const NotificationsPage: React.FC = () => {
  const { toast } = useToast();
  const [notificationTypes, setNotificationTypes] = useState<NotificationType[]>([
    {
      id: '1',
      title: 'Confirmação de Agendamento',
      description: 'Receba notificações quando um novo agendamento for confirmado',
      enabled: true,
    },
    {
      id: '2',
      title: 'Cancelamento de Agendamento',
      description: 'Receba notificações quando um agendamento for cancelado',
      enabled: false,
    },
    {
      id: '3',
      title: 'Lembretes de Agendamentos',
      description: 'Receba lembretes algumas horas antes do seu agendamento',
      enabled: true,
    },
    {
      id: '4',
      title: 'Novos Clientes',
      description: 'Receba notificações quando novos clientes se registrarem',
      enabled: false,
    },
  ]);

  const handleToggle = (id: string) => {
    setNotificationTypes(prevTypes =>
      prevTypes.map(type =>
        type.id === id ? { ...type, enabled: !type.enabled } : type
      )
    );
  };

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas preferências de notificação foram atualizadas com sucesso."
    });
  };

  return (
    <MainLayout title="Notificações">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Bell className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-xl font-semibold">Preferências de Notificações</h2>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Configurações de Notificações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Personalize quais notificações você deseja receber e como prefere recebê-las.
          </p>

          <div className="space-y-6">
            {notificationTypes.map((type) => (
              <div key={type.id} className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{type.title}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
                <div className="flex items-center">
                  <Switch
                    checked={type.enabled}
                    onCheckedChange={() => handleToggle(type.id)}
                  />
                  {type.enabled ? (
                    <Bell className="ml-2 h-4 w-4 text-primary" />
                  ) : (
                    <BellOff className="ml-2 h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Canais de Notificação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">Notificações por E-mail</h3>
                <p className="text-sm text-muted-foreground">
                  Receba notificações por e-mail
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">Notificações no Sistema</h3>
                <p className="text-sm text-muted-foreground">
                  Receba notificações dentro do sistema
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">Notificações por WhatsApp</h3>
                <p className="text-sm text-muted-foreground">
                  Receba notificações via WhatsApp (requer configuração adicional)
                </p>
              </div>
              <Switch />
            </div>
          </div>
          
          <div className="mt-6">
            <Button onClick={handleSave}>Salvar Preferências</Button>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default NotificationsPage;

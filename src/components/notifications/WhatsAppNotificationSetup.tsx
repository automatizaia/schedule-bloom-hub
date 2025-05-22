
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Check, WhatsApp } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const whatsAppSchema = z.object({
  apiKey: z.string().min(10, { message: 'API key é obrigatória' }),
  fromNumber: z.string().min(10, { message: 'Número deve ter pelo menos 10 dígitos' }),
  messageTemplate: z.string().min(10, { message: 'Template deve ter pelo menos 10 caracteres' }),
  enableConfirmation: z.boolean(),
  enableReminder: z.boolean(),
  enableCancellation: z.boolean(),
});

type WhatsAppFormValues = z.infer<typeof whatsAppSchema>;

const WhatsAppNotificationSetup: React.FC = () => {
  const { toast } = useToast();
  const [isConfigured, setIsConfigured] = useState(false);
  const [testNumber, setTestNumber] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  
  const form = useForm<WhatsAppFormValues>({
    resolver: zodResolver(whatsAppSchema),
    defaultValues: {
      apiKey: '',
      fromNumber: '',
      messageTemplate: 'Olá {{name}}, seu agendamento para {{service}} com {{professional}} está marcado para {{date}} às {{time}}. Agradecemos a preferência!',
      enableConfirmation: true,
      enableReminder: true,
      enableCancellation: true,
    },
  });
  
  const onSubmit = (data: WhatsAppFormValues) => {
    // In a real application, we would save this to the database
    console.log('WhatsApp config:', data);
    toast({
      title: "Configuração salva",
      description: "Suas configurações de WhatsApp foram salvas com sucesso!"
    });
    setIsConfigured(true);
  };
  
  const handleTestMessage = async () => {
    if (!testNumber) {
      toast({
        title: "Erro",
        description: "Insira um número para o teste",
        variant: "destructive"
      });
      return;
    }
    
    setIsTesting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Mensagem de teste enviada",
        description: `Mensagem enviada para ${testNumber}`,
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Não foi possível enviar a mensagem de teste",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <WhatsApp className="h-5 w-5 mr-2 text-green-500" />
          Configuração do WhatsApp
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key do WhatsApp Business</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira sua API key" {...field} type="password" />
                    </FormControl>
                    <FormDescription>
                      Você pode obter essa chave no painel do WhatsApp Business API
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fromNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Envio</FormLabel>
                    <FormControl>
                      <Input placeholder="+55 11 99999-9999" {...field} />
                    </FormControl>
                    <FormDescription>
                      Este é o número que enviará as mensagens (com código do país)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="messageTemplate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template de Mensagem</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Use {{name}}, {{service}}, {{professional}}, {{date}}, {{time}} como variáveis
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="enableConfirmation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Confirmação</FormLabel>
                        <FormDescription>
                          Enviar quando agendamento for confirmado
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="enableReminder"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Lembrete</FormLabel>
                        <FormDescription>
                          Enviar lembrete antes do agendamento
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="enableCancellation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Cancelamento</FormLabel>
                        <FormDescription>
                          Enviar quando agendamento for cancelado
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="flex flex-col space-y-4">
              <Button type="submit">Salvar Configurações</Button>
              
              {isConfigured && (
                <div className="bg-gray-100 rounded-lg p-4 mt-4">
                  <div className="text-sm font-medium mb-2">Enviar mensagem de teste</div>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="+55 11 99999-9999"
                      value={testNumber}
                      onChange={(e) => setTestNumber(e.target.value)}
                      className="max-w-[200px]"
                    />
                    <Button 
                      variant="outline" 
                      onClick={handleTestMessage}
                      disabled={isTesting}
                    >
                      {isTesting ? "Enviando..." : "Enviar Teste"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default WhatsAppNotificationSetup;

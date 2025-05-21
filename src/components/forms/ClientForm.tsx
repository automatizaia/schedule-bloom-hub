
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useScheduler } from '@/contexts/SchedulerContext';
import { toast } from '@/components/ui/sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

// Define the form schema using Zod
const clientFormSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }).optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal(''))
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ isOpen, onClose }) => {
  const { createClient } = useScheduler();
  
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: ''
    }
  });
  
  const onSubmit = async (values: ClientFormValues) => {
    try {
      await createClient({
        name: values.name,
        email: values.email || undefined,
        phone: values.phone || undefined,
      });
      
      toast('Cliente cadastrado com sucesso!');
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error creating client:', error);
      toast('Erro ao cadastrar cliente', {
        variant: 'destructive'
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@exemplo.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 00000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
              <Button type="submit">Cadastrar Cliente</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientForm;

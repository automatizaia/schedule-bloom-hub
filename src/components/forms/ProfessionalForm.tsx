
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useScheduler } from '@/contexts/SchedulerContext';
import { toast } from '@/components/ui/sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

// Define the form schema using Zod
const professionalFormSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  bio: z.string().optional().or(z.literal(''))
});

type ProfessionalFormValues = z.infer<typeof professionalFormSchema>;

interface ProfessionalFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfessionalForm: React.FC<ProfessionalFormProps> = ({ isOpen, onClose }) => {
  const { createProfessional, services } = useScheduler();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  const form = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalFormSchema),
    defaultValues: {
      name: '',
      email: '',
      bio: ''
    }
  });
  
  const handleServiceChange = (checked: boolean, serviceId: string) => {
    if (checked) {
      setSelectedServices(prev => [...prev, serviceId]);
    } else {
      setSelectedServices(prev => prev.filter(id => id !== serviceId));
    }
  };
  
  const onSubmit = async (values: ProfessionalFormValues) => {
    try {
      await createProfessional({
        user: {
          name: values.name,
          email: values.email
        },
        bio: values.bio || undefined,
        serviceIds: selectedServices
      });
      
      toast('Profissional cadastrado com sucesso!');
      form.reset();
      setSelectedServices([]);
      onClose();
    } catch (error) {
      console.error('Error creating professional:', error);
      toast('Erro ao cadastrar profissional');
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Profissional</DialogTitle>
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
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biografia</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva brevemente a experiência do profissional..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel>Serviços Oferecidos</FormLabel>
              <div className="grid grid-cols-2 gap-2">
                {services.map(service => (
                  <div key={service.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`service-${service.id}`} 
                      checked={selectedServices.includes(service.id)}
                      onCheckedChange={(checked) => handleServiceChange(!!checked, service.id)}
                    />
                    <label htmlFor={`service-${service.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {service.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
              <Button type="submit">Cadastrar Profissional</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfessionalForm;

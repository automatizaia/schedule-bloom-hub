
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Calendar } from 'lucide-react';
import { Client } from '@/types/models';
import { format } from 'date-fns';

interface ClientDetailsProps {
  client: Client | null;
  open: boolean;
  onClose: () => void;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ client, open, onClose }) => {
  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes do Cliente</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
              {client.name.substring(0, 1).toUpperCase()}
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{client.name}</h2>
              <p className="text-sm text-muted-foreground">
                Cliente desde {client.createdAt ? format(new Date(client.createdAt), 'dd/MM/yyyy') : 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <User className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Nome completo</p>
                <p>{client.name}</p>
              </div>
            </div>
            
            {client.email && (
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">E-mail</p>
                  <p>{client.email}</p>
                </div>
              </div>
            )}
            
            {client.phone && (
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Telefone</p>
                  <p>{client.phone}</p>
                </div>
              </div>
            )}
            
            {client.notes && (
              <div className="border-t pt-3 mt-4">
                <p className="text-sm font-medium mb-1">Observações</p>
                <p className="text-sm">{client.notes}</p>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>Fechar</Button>
          <Button>Editar Cliente</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetails;

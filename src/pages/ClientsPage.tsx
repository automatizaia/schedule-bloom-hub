
import React, { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useScheduler } from '@/contexts/SchedulerContext';
import { Users, UserPlus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ClientForm from '@/components/forms/ClientForm';
import ClientDetails from '@/components/clients/ClientDetails';
import { Client } from '@/types/models';

const ClientsPage: React.FC = () => {
  const { clients } = useScheduler();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const filteredClients = searchTerm 
    ? clients.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (client.phone && client.phone.includes(searchTerm))
      )
    : clients;

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
    setIsDetailsOpen(true);
  };

  return (
    <MainLayout title="Gerenciamento de Clientes">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Users className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-xl font-semibold">Lista de Clientes</h2>
          <span className="ml-3 text-muted-foreground text-sm">
            {clients.length} clientes cadastrados
          </span>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium flex items-center justify-between">
            <span>Clientes Cadastrados</span>
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar cliente..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredClients.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>
                {searchTerm ? 'Nenhum cliente encontrado para esta busca' : 'Nenhum cliente cadastrado'}
              </p>
              {!searchTerm && (
                <Button variant="outline" className="mt-4" onClick={() => setIsFormOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Adicionar Primeiro Cliente
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y">
              {filteredClients.map(client => (
                <div key={client.id} className="py-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {client.name.substring(0, 1).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-muted-foreground">{client.email || 'Sem e-mail'}</div>
                      {client.phone && (
                        <div className="text-sm text-muted-foreground">{client.phone}</div>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleViewDetails(client)}
                  >
                    Ver detalhes
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <ClientForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      <ClientDetails 
        client={selectedClient} 
        open={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
      />
    </MainLayout>
  );
};

export default ClientsPage;

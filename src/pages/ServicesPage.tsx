
import React, { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useScheduler } from '@/contexts/SchedulerContext';
import { Search, Plus, Clock, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Service } from '@/types/models';
import ServiceForm from '@/components/forms/ServiceForm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ServicesPage: React.FC = () => {
  const { services } = useScheduler();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = searchTerm
    ? services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : services;

  return (
    <MainLayout title="Gerenciamento de Serviços">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Calendar className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-xl font-semibold">Lista de Serviços</h2>
          <span className="ml-3 text-muted-foreground text-sm">
            {services.length} serviços cadastrados
          </span>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Serviço
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium flex items-center justify-between">
            <span>Serviços Cadastrados</span>
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar serviço..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredServices.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Calendar className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>
                {searchTerm ? 'Nenhum serviço encontrado para esta busca' : 'Nenhum serviço cadastrado'}
              </p>
              {!searchTerm && (
                <Button variant="outline" className="mt-4" onClick={() => setIsFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Primeiro Serviço
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">
                      {service.name}
                      {service.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {service.description}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        {service.duration} min
                      </div>
                    </TableCell>
                    <TableCell>
                      {service.price ? `R$ ${service.price.toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ServiceForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </MainLayout>
  );
};

export default ServicesPage;

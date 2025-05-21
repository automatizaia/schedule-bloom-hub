
import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useScheduler } from '@/contexts/SchedulerContext';
import { Users, UserPlus, Search, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const ProfessionalsPage: React.FC = () => {
  const { professionals, services } = useScheduler();

  return (
    <MainLayout title="Gerenciamento de Profissionais">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Users className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-xl font-semibold">Lista de Profissionais</h2>
          <span className="ml-3 text-muted-foreground text-sm">
            {professionals.length} profissionais cadastrados
          </span>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Profissional
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium flex items-center justify-between">
            <span>Profissionais Cadastrados</span>
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar profissional..." className="pl-8" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {professionals.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>Nenhum profissional cadastrado</p>
              <Button variant="outline" className="mt-4">
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar Primeiro Profissional
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {professionals.map(professional => {
                // Find services this professional offers
                const professionalServices = services.filter(s => 
                  s.professionalIds?.includes(professional.id)
                );
                
                return (
                  <div key={professional.id} className="py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {professional.user?.name.substring(0, 1).toUpperCase() || '?'}
                      </div>
                      <div className="ml-3">
                        <div className="font-medium">{professional.user?.name}</div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{professional.scheduleDays?.join(', ') || 'Sem dias definidos'}</span>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {professionalServices.slice(0, 3).map(service => (
                            <Badge key={service.id} variant="outline" className="text-xs">
                              {service.name}
                            </Badge>
                          ))}
                          {professionalServices.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{professionalServices.length - 3} mais
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Ver detalhes</Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default ProfessionalsPage;

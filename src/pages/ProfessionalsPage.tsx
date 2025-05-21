
import React, { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useScheduler } from '@/contexts/SchedulerContext';
import { Users, UserPlus, Search, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Professional, Service } from '@/types/models';
import ProfessionalForm from '@/components/forms/ProfessionalForm';

const ProfessionalsPage: React.FC = () => {
  const { professionals, services, availabilities } = useScheduler();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Helper function to get the services a professional offers
  const getProfessionalServices = (professionalId: string): Service[] => {
    // Look for services that have this professional in mock data
    return services.filter(service => {
      // Check in mockProfessionalServices data (imported in SchedulerContext)
      // Since we don't have direct access, we'll find services based on context
      const professionalAvailability = availabilities.some(
        availability => availability.professionalId === professionalId
      );
      return professionalAvailability;
    });
  };

  // Helper function to get the days a professional is available
  const getProfessionalScheduleDays = (professionalId: string): string => {
    const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const professionalDays = availabilities
      .filter(availability => availability.professionalId === professionalId)
      .map(availability => days[availability.dayOfWeek]);
    
    return professionalDays.length > 0 ? professionalDays.join(', ') : 'Sem dias definidos';
  };
  
  const filteredProfessionals = searchTerm 
    ? professionals.filter(professional => 
        professional.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (professional.bio && professional.bio.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (professional.specialties && professional.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())))
      )
    : professionals;

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
        <Button onClick={() => setIsFormOpen(true)}>
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
              <Input 
                placeholder="Buscar profissional..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProfessionals.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>
                {searchTerm ? 'Nenhum profissional encontrado para esta busca' : 'Nenhum profissional cadastrado'}
              </p>
              {!searchTerm && (
                <Button variant="outline" className="mt-4" onClick={() => setIsFormOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Adicionar Primeiro Profissional
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y">
              {filteredProfessionals.map(professional => {
                // Find services this professional offers using our helper
                const professionalServices = getProfessionalServices(professional.id);
                // Get schedule days using our helper
                const scheduleDays = getProfessionalScheduleDays(professional.id);
                
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
                          <span>{scheduleDays}</span>
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
      
      <ProfessionalForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </MainLayout>
  );
};

export default ProfessionalsPage;

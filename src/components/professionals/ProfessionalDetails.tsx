
import React, { useState } from 'react';
import { Professional, Service } from '@/types/models';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useScheduler } from '@/contexts/SchedulerContext';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ProfessionalDetailsProps {
  professionalId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ProfessionalDetails: React.FC<ProfessionalDetailsProps> = ({ professionalId, isOpen, onClose }) => {
  const { professionals, services, availabilities } = useScheduler();
  const [activeTab, setActiveTab] = useState('info');
  
  // Find the professional by ID
  const professional = professionals.find(p => p.id === professionalId);
  
  if (!professional) {
    return null;
  }
  
  // Helper function to get the services this professional offers
  const getProfessionalServices = (): Service[] => {
    // In a real implementation, we would use professionalServices from the database
    // For now, we'll just return a subset of services as an example
    return services.filter((_, index) => index % 2 === 0); // Just for demo
  };
  
  // Get professional services
  const professionalServices = getProfessionalServices();
  
  // Helper function to format days of week
  const formatDaysOfWeek = () => {
    const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const professionalDays = availabilities
      .filter(a => a.professionalId === professionalId)
      .map(a => ({
        dayName: days[a.dayOfWeek],
        startTime: a.startTime,
        endTime: a.endTime
      }));
    
    return professionalDays;
  };
  
  const scheduleData = formatDaysOfWeek();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Profissional</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
            {professional.user?.name.substring(0, 1).toUpperCase() || '?'}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{professional.user?.name}</h3>
            <p className="text-sm text-muted-foreground">{professional.user?.email}</p>
          </div>
        </div>
        
        <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="schedule">Agenda</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4">
            {professional.bio && (
              <div>
                <h4 className="font-medium mb-1">Biografia</h4>
                <p className="text-sm text-muted-foreground">{professional.bio}</p>
              </div>
            )}
            
            {professional.specialties && professional.specialties.length > 0 && (
              <div>
                <h4 className="font-medium mb-1">Especialidades</h4>
                <div className="flex flex-wrap gap-1">
                  {professional.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary">{specialty}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h4 className="font-medium mb-1">Desde</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(professional.createdAt).toLocaleDateString()}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="services">
            <Card>
              <CardContent className="pt-4">
                {professionalServices.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Nenhum serviço cadastrado para este profissional.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Serviço</TableHead>
                        <TableHead>Duração</TableHead>
                        <TableHead>Preço</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {professionalServices.map(service => (
                        <TableRow key={service.id}>
                          <TableCell className="font-medium">{service.name}</TableCell>
                          <TableCell>{service.duration} min</TableCell>
                          <TableCell>
                            {service.price ? `R$ ${service.price.toFixed(2)}` : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="schedule">
            <Card>
              <CardContent className="pt-4">
                {scheduleData.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Nenhum horário definido para este profissional.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Dia</TableHead>
                        <TableHead>Horário</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scheduleData.map((day, index) => (
                        <TableRow key={index}>
                          <TableCell>{day.dayName}</TableCell>
                          <TableCell>{day.startTime} às {day.endTime}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between mt-4">
          <Button variant="outline" onClick={onClose}>Fechar</Button>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Editar Profissional
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfessionalDetails;


import React, { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { useScheduler } from '@/contexts/SchedulerContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck, Plus, User, Clock } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { appointments, professionals, services } = useScheduler();
  const [date, setDate] = useState<Date>(new Date());
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string>("");
  
  // Filter appointments for the selected day
  const todaysAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.startTime);
    return (
      appointmentDate.getDate() === date.getDate() &&
      appointmentDate.getMonth() === date.getMonth() &&
      appointmentDate.getFullYear() === date.getFullYear()
    );
  });
  
  // Get upcoming appointments (next 3)
  const upcomingAppointments = [...appointments]
    .filter(appointment => new Date(appointment.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 3);
  
  // For admin or professionals, filter data based on role
  const filteredAppointments = user?.role === 'professional' 
    ? appointments.filter(app => {
      const professional = professionals.find(p => p.userId === user.id);
      return professional && app.professionalId === professional.id;
    })
    : appointments;
  
  // Get professionals for the select dropdown
  const availableProfessionals = user?.role === 'professional'
    ? professionals.filter(p => p.userId === user.id)
    : professionals;
  
  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <MainLayout title="Painel de Controle">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar section */}
        <Card className="md:col-span-2 overflow-hidden">
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex justify-between items-center">
              <span>Agenda</span>
              <Button size="sm" onClick={() => setShowNewAppointmentDialog(true)}>
                <Plus className="mr-2 h-4 w-4" /> Novo Agendamento
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-b">
              <div className="p-3 bg-muted/20">
                <Select 
                  value={selectedProfessionalId} 
                  onValueChange={setSelectedProfessionalId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um profissional" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os profissionais</SelectItem>
                    {availableProfessionals.map(professional => (
                      <SelectItem key={professional.id} value={professional.id}>
                        {professionals.find(p => p.id === professional.id)?.user?.name || 'Profissional'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  className="rounded-md border"
                />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-4">
                Agendamentos para {date.toLocaleDateString('pt-BR')}
              </h3>
              {todaysAppointments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum agendamento para esta data
                </div>
              ) : (
                <div className="space-y-3">
                  {todaysAppointments
                    .filter(app => selectedProfessionalId ? app.professionalId === selectedProfessionalId : true)
                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                    .map(appointment => {
                      const professional = professionals.find(p => p.id === appointment.professionalId);
                      const service = services.find(s => s.id === appointment.serviceId);
                      
                      return (
                        <div 
                          key={appointment.id} 
                          className="p-3 border rounded-lg flex items-center hover:bg-muted/10 transition-colors cursor-pointer"
                        >
                          <div className="mr-3">
                            <div className={`w-2 h-12 rounded-full ${getAppointmentStatusColor(appointment.status)}`}></div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center mb-1">
                              <User className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span className="font-medium">{appointment.client?.name || "Cliente"}</span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {appointment.status === 'confirmed' ? 'Confirmado' : 
                                 appointment.status === 'pending' ? 'Pendente' :
                                 appointment.status === 'cancelled' ? 'Cancelado' : 'Concluído'}
                              </Badge>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>
                                {new Date(appointment.startTime).toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })} - {new Date(appointment.endTime).toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <div className="text-sm mt-1">
                              {service?.name || "Serviço"} com {professional?.user?.name || "Profissional"}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            Detalhes
                          </Button>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Summary cards */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Resumo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total de hoje:</span>
                  <span className="font-semibold">{todaysAppointments.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Confirmados:</span>
                  <span className="font-semibold">
                    {todaysAppointments.filter(a => a.status === 'confirmed').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pendentes:</span>
                  <span className="font-semibold">
                    {todaysAppointments.filter(a => a.status === 'pending').length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Próximos Agendamentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingAppointments.length === 0 ? (
                <div className="text-muted-foreground text-center py-3">
                  Nenhum agendamento próximo
                </div>
              ) : (
                upcomingAppointments.map(appointment => {
                  const professional = professionals.find(p => p.id === appointment.professionalId);
                  const service = services.find(s => s.id === appointment.serviceId);
                  const appointmentDate = new Date(appointment.startTime);
                  
                  return (
                    <div key={appointment.id} className="flex items-center p-2 border rounded-lg">
                      <CalendarCheck className="h-9 w-9 mr-3 text-primary" />
                      <div>
                        <p className="font-medium">{service?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {appointmentDate.toLocaleDateString('pt-BR')} às {" "}
                          {appointmentDate.toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p className="text-xs">{professional?.user?.name}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* New Appointment Dialog */}
      <Dialog open={showNewAppointmentDialog} onOpenChange={setShowNewAppointmentDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Agendar Nova Consulta</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              Para criar um novo agendamento, selecione o cliente, profissional, serviço e horário desejado.
            </p>
            <Button
              className="w-full mt-4"
              onClick={() => navigate('/schedule/new')}
            >
              Continuar para o Agendamento
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewAppointmentDialog(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default DashboardPage;

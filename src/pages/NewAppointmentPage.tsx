
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { useScheduler } from '@/contexts/SchedulerContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const NewAppointmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { company } = useAuth();
  const { 
    professionals, 
    services, 
    clients,
    createAppointment,
    getAvailableSlots,
    isLoading 
  } = useScheduler();
  
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedProfessionalId, setSelectedProfessionalId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<Date[]>([]);
  const [newClientInfo, setNewClientInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isNewClient, setIsNewClient] = useState(false);
  
  // Step tracking
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  // Format a date to display time
  const formatTimeSlot = (date: Date) => {
    return format(date, 'HH:mm', { locale: ptBR });
  };
  
  // When professional, service, or date changes, update available slots
  useEffect(() => {
    if (selectedProfessionalId && selectedServiceId && selectedDate) {
      const slots = getAvailableSlots(selectedProfessionalId, selectedDate, selectedServiceId);
      setAvailableSlots(slots);
      setSelectedTimeSlot(null); // Reset selected time slot
    } else {
      setAvailableSlots([]);
      setSelectedTimeSlot(null);
    }
  }, [selectedProfessionalId, selectedServiceId, selectedDate, getAvailableSlots]);
  
  // Group time slots by hour for better display
  const groupedTimeSlots: { [hour: string]: Date[] } = {};
  availableSlots.forEach(slot => {
    const hour = format(slot, 'HH:00');
    if (!groupedTimeSlots[hour]) {
      groupedTimeSlots[hour] = [];
    }
    groupedTimeSlots[hour].push(slot);
  });
  
  const handleSubmit = async () => {
    if (!company || !selectedTimeSlot) return;
    
    try {
      // Get the selected service for its duration
      const service = services.find(s => s.id === selectedServiceId);
      if (!service) return;
      
      // Calculate end time based on service duration
      const startTime = new Date(selectedTimeSlot);
      const endTime = new Date(startTime.getTime() + service.duration * 60000);
      
      let clientId = selectedClientId;
      
      // If it's a new client, we would create one first (mocked here)
      if (isNewClient && newClientInfo.name) {
        // In a real app, you would create the client in the database first
        // For now, we'll just use a placeholder ID
        clientId = `new-client-${Date.now()}`;
      }
      
      // Create the appointment
      await createAppointment({
        clientId,
        professionalId: selectedProfessionalId,
        serviceId: selectedServiceId,
        startTime,
        endTime,
        status: 'confirmed',
        companyId: company.id,
      });
      
      // Navigate back to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error("Failed to create appointment:", error);
    }
  };
  
  // Handle step navigation
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  
  // Check if can proceed to next step
  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1: // Client selection
        return isNewClient 
          ? !!(newClientInfo.name && newClientInfo.phone)
          : !!selectedClientId;
      case 2: // Professional selection
        return !!selectedProfessionalId;
      case 3: // Service selection
        return !!selectedServiceId;
      case 4: // Date and time selection
        return !!selectedTimeSlot;
      default:
        return false;
    }
  };

  return (
    <MainLayout title="Novo Agendamento">
      <Card className="max-w-3xl mx-auto animate-fade-in">
        <CardHeader>
          <CardTitle>Agendar Nova Consulta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex mb-2">
              {Array.from({ length: totalSteps }).map((_, idx) => (
                <React.Fragment key={idx}>
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm 
                      ${currentStep > idx + 1 
                        ? 'bg-primary text-primary-foreground' 
                        : currentStep === idx + 1 
                          ? 'bg-primary/20 border-2 border-primary text-primary' 
                          : 'bg-muted text-muted-foreground'}`}
                  >
                    {idx + 1}
                  </div>
                  {idx < totalSteps - 1 && (
                    <div className={`flex-1 h-1 self-center mx-2 
                      ${currentStep > idx + 1 ? 'bg-primary' : 'bg-muted'}`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="text-sm text-muted-foreground mt-1 text-center">
              {currentStep === 1 && "Selecione o cliente"}
              {currentStep === 2 && "Selecione o profissional"}
              {currentStep === 3 && "Selecione o serviço"}
              {currentStep === 4 && "Selecione data e hora"}
            </div>
          </div>
          
          <div className="py-4">
            {/* Step 1: Client Selection */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-slide-up">
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Selecione o Cliente</h3>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsNewClient(!isNewClient)}
                      size="sm"
                    >
                      {isNewClient ? "Selecionar cliente existente" : "Novo cliente"}
                    </Button>
                  </div>
                  
                  {isNewClient ? (
                    <div className="space-y-4 animate-fade-in">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome do Cliente</Label>
                        <Input 
                          id="name"
                          value={newClientInfo.name}
                          onChange={(e) => setNewClientInfo({...newClientInfo, name: e.target.value})}
                          placeholder="Nome completo"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input 
                          id="email"
                          type="email"
                          value={newClientInfo.email}
                          onChange={(e) => setNewClientInfo({...newClientInfo, email: e.target.value})}
                          placeholder="email@exemplo.com"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input 
                          id="phone"
                          value={newClientInfo.phone}
                          onChange={(e) => setNewClientInfo({...newClientInfo, phone: e.target.value})}
                          placeholder="(99) 99999-9999"
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 animate-fade-in">
                      <Label htmlFor="client">Cliente</Label>
                      <Select
                        value={selectedClientId}
                        onValueChange={setSelectedClientId}
                      >
                        <SelectTrigger id="client">
                          <SelectValue placeholder="Selecione o cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map(client => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Step 2: Professional Selection */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-slide-up">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium mb-4">Selecione o Profissional</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {professionals.map(professional => {
                      const user = professional.user || { name: 'Profissional' };
                      
                      return (
                        <div 
                          key={professional.id}
                          className={`
                            p-4 border rounded-lg cursor-pointer transition-all
                            ${selectedProfessionalId === professional.id 
                              ? 'border-primary bg-primary/5' 
                              : 'hover:border-primary/50'}
                          `}
                          onClick={() => setSelectedProfessionalId(professional.id)}
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                              <span className="font-medium text-primary">{user.name.charAt(0)}</span>
                            </div>
                            <div>
                              <h4 className="font-medium">{user.name}</h4>
                              {professional.specialties && (
                                <p className="text-sm text-muted-foreground">
                                  {professional.specialties.join(', ')}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Service Selection */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-slide-up">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium mb-4">Selecione o Serviço</h3>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {services
                      .filter(service => {
                        // Only show services provided by the selected professional
                        if (!selectedProfessionalId) return true;
                        return true; // In a real app, check professional services
                      })
                      .map(service => (
                        <div 
                          key={service.id}
                          className={`
                            p-4 border rounded-lg cursor-pointer transition-all
                            ${selectedServiceId === service.id 
                              ? 'border-primary bg-primary/5' 
                              : 'hover:border-primary/50'}
                          `}
                          onClick={() => setSelectedServiceId(service.id)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{service.name}</h4>
                              <p className="text-sm text-muted-foreground">{service.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {service.price ? `R$ ${service.price.toFixed(2)}` : 'Gratuito'}
                              </p>
                              <p className="text-sm text-muted-foreground">{service.duration} min</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 4: Date and Time Selection */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-slide-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Selecione a Data</h3>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={{ before: new Date() }}
                      className="rounded-md border"
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Selecione o Horário</h3>
                    {selectedDate ? (
                      Object.keys(groupedTimeSlots).length > 0 ? (
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                          {Object.entries(groupedTimeSlots).map(([hour, slots]) => (
                            <div key={hour}>
                              <h4 className="text-sm text-muted-foreground mb-2">{hour}</h4>
                              <div className="grid grid-cols-3 gap-2">
                                {slots.map((slot) => (
                                  <button
                                    key={slot.toISOString()}
                                    onClick={() => setSelectedTimeSlot(slot)}
                                    className={`
                                      py-2 px-3 text-sm rounded-md border text-center
                                      ${selectedTimeSlot?.toISOString() === slot.toISOString()
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:border-primary/50'}
                                    `}
                                  >
                                    {formatTimeSlot(slot)}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-[200px] text-center text-muted-foreground border rounded-md p-4">
                          <p>
                            {selectedProfessionalId && selectedServiceId
                              ? "Não há horários disponíveis para esta data"
                              : "Selecione um profissional e serviço primeiro"}
                          </p>
                        </div>
                      )
                    ) : (
                      <div className="flex items-center justify-center h-[200px] text-center text-muted-foreground border rounded-md p-4">
                        <p>Selecione uma data para ver os horários disponíveis</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedTimeSlot && (
                  <div className="p-4 bg-muted/20 rounded-lg border">
                    <h3 className="font-medium mb-2">Resumo do Agendamento</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Cliente</p>
                        <p className="font-medium">
                          {isNewClient 
                            ? newClientInfo.name 
                            : clients.find(client => client.id === selectedClientId)?.name || 'Cliente'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Profissional</p>
                        <p className="font-medium">
                          {professionals.find(p => p.id === selectedProfessionalId)?.user?.name || 'Profissional'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Serviço</p>
                        <p className="font-medium">
                          {services.find(s => s.id === selectedServiceId)?.name || 'Serviço'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Data e Hora</p>
                        <p className="font-medium">
                          {format(selectedTimeSlot, "PPP 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6 flex justify-between">
          <Button 
            variant="outline" 
            onClick={currentStep === 1 ? () => navigate('/dashboard') : prevStep}
          >
            {currentStep === 1 ? 'Cancelar' : 'Voltar'}
          </Button>
          <Button 
            onClick={currentStep === totalSteps ? handleSubmit : nextStep}
            disabled={!canProceedToNextStep() || isLoading}
          >
            {currentStep === totalSteps ? 'Finalizar Agendamento' : 'Próximo'}
          </Button>
        </CardFooter>
      </Card>
    </MainLayout>
  );
};

export default NewAppointmentPage;

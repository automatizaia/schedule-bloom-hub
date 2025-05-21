
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useScheduler } from '@/contexts/SchedulerContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Building, CalendarCheck } from 'lucide-react';
import { mockCompanies } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';

const PublicBookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get('company') || '1'; // Default to first company if not specified
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Get company info
  const company = mockCompanies.find(c => c.id === companyId);
  
  const { 
    professionals, 
    services, 
    createAppointment,
    getAvailableSlots,
    isLoading 
  } = useScheduler();
  
  const [selectedProfessionalId, setSelectedProfessionalId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<Date[]>([]);
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
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
    if (!company || !selectedTimeSlot || !clientInfo.name || !clientInfo.phone) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Get the selected service for its duration
      const service = services.find(s => s.id === selectedServiceId);
      if (!service) return;
      
      // Calculate end time based on service duration
      const startTime = new Date(selectedTimeSlot);
      const endTime = new Date(startTime.getTime() + service.duration * 60000);
      
      // In a real app, you would first create the client
      const clientId = `public-client-${Date.now()}`;
      
      // Create the appointment
      await createAppointment({
        clientId,
        professionalId: selectedProfessionalId,
        serviceId: selectedServiceId,
        startTime,
        endTime,
        status: 'pending', // Appointments from public form are pending until confirmed
        companyId: company.id,
        notes: `Agendamento feito pelo site público. Cliente: ${clientInfo.name}, Telefone: ${clientInfo.phone}`,
      });
      
      setCurrentStep(5); // Success step
    } catch (error) {
      console.error("Failed to create appointment:", error);
      toast({
        title: "Erro ao criar agendamento",
        description: "Ocorreu um erro ao tentar agendar. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  // Handle step navigation
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  
  // Check if can proceed to next step
  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1: // Service selection
        return !!selectedServiceId;
      case 2: // Professional selection
        return !!selectedProfessionalId;
      case 3: // Date and time selection
        return !!selectedTimeSlot;
      case 4: // Client info
        return !!(clientInfo.name && clientInfo.phone);
      default:
        return false;
    }
  };
  
  // If no company found, show error
  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Empresa não encontrada</CardTitle>
            <CardDescription>O link para agendamento é inválido.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/')} className="w-full">
              Voltar para a página inicial
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 p-4 flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Building className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">{company.name}</h1>
          <p className="text-muted-foreground">Agendamento online de consultas e serviços</p>
        </div>
        
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>
              {currentStep === 5 ? "Agendamento Concluído!" : "Agendar Consulta"}
            </CardTitle>
            {currentStep < 5 && (
              <CardDescription>
                {currentStep === 1 ? "Selecione o serviço desejado" :
                 currentStep === 2 ? "Selecione o profissional" :
                 currentStep === 3 ? "Escolha a data e horário" :
                 "Complete suas informações"}
              </CardDescription>
            )}
          </CardHeader>
          
          <CardContent>
            {currentStep < 5 && (
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
              </div>
            )}
            
            {/* Step 1: Service Selection */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-slide-up">
                <div className="space-y-2">
                  <div className="grid grid-cols-1 gap-3">
                    {services
                      .filter(service => service.companyId === company.id)
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
            
            {/* Step 2: Professional Selection */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-slide-up">
                <div className="space-y-2">
                  <div className="grid grid-cols-1 gap-4">
                    {professionals
                      .filter(professional => professional.companyId === company.id)
                      .map(professional => {
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
            
            {/* Step 3: Date and Time Selection */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-slide-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-4">Data</h3>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={{ before: new Date() }}
                      className="rounded-md border"
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-4">Horário</h3>
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
              </div>
            )}
            
            {/* Step 4: Client Information */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-slide-up">
                <div className="space-y-4">
                  <div className="bg-muted/20 p-4 rounded-md mb-6">
                    <h3 className="font-medium mb-2">Resumo do Agendamento</h3>
                    <div className="text-sm space-y-1">
                      <p><span className="text-muted-foreground">Serviço:</span> {services.find(s => s.id === selectedServiceId)?.name}</p>
                      <p><span className="text-muted-foreground">Profissional:</span> {professionals.find(p => p.id === selectedProfessionalId)?.user?.name}</p>
                      <p><span className="text-muted-foreground">Data e Hora:</span> {selectedTimeSlot && format(selectedTimeSlot, "PPP 'às' HH:mm", { locale: ptBR })}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo *</Label>
                      <Input 
                        id="name"
                        value={clientInfo.name}
                        onChange={(e) => setClientInfo({...clientInfo, name: e.target.value})}
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input 
                        id="email"
                        type="email"
                        value={clientInfo.email}
                        onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})}
                        placeholder="seu@email.com"
                      />
                      <p className="text-xs text-muted-foreground">Para receber confirmações e lembretes</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone *</Label>
                      <Input 
                        id="phone"
                        value={clientInfo.phone}
                        onChange={(e) => setClientInfo({...clientInfo, phone: e.target.value})}
                        placeholder="(99) 99999-9999"
                        required
                      />
                      <p className="text-xs text-muted-foreground">Para contato e avisos importantes</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 5: Success */}
            {currentStep === 5 && (
              <div className="text-center py-8 animate-fade-in">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CalendarCheck className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-2">Agendamento Realizado!</h2>
                <p className="mb-6 text-muted-foreground">Seu agendamento foi recebido com sucesso e está aguardando confirmação.</p>
                <div className="bg-muted/20 p-4 rounded-md max-w-md mx-auto mb-8">
                  <div className="text-sm space-y-2">
                    <p><span className="text-muted-foreground">Serviço:</span> {services.find(s => s.id === selectedServiceId)?.name}</p>
                    <p><span className="text-muted-foreground">Profissional:</span> {professionals.find(p => p.id === selectedProfessionalId)?.user?.name}</p>
                    <p><span className="text-muted-foreground">Data e Hora:</span> {selectedTimeSlot && format(selectedTimeSlot, "PPP 'às' HH:mm", { locale: ptBR })}</p>
                    <p><span className="text-muted-foreground">Nome:</span> {clientInfo.name}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Em breve você receberá um e-mail ou mensagem de confirmação.</p>
              </div>
            )}
          </CardContent>
          
          {currentStep < 5 && (
            <CardFooter className="border-t pt-6 flex justify-between">
              <Button 
                variant="outline" 
                onClick={currentStep === 1 ? () => navigate('/') : prevStep}
              >
                {currentStep === 1 ? 'Cancelar' : 'Voltar'}
              </Button>
              <Button 
                onClick={currentStep === totalSteps ? handleSubmit : nextStep}
                disabled={!canProceedToNextStep() || isLoading}
              >
                {currentStep === totalSteps ? 'Confirmar Agendamento' : 'Próximo'}
              </Button>
            </CardFooter>
          )}
          
          {currentStep === 5 && (
            <CardFooter className="border-t pt-6">
              <Button 
                onClick={() => {
                  // Reset form and go back to step 1
                  setSelectedServiceId('');
                  setSelectedProfessionalId('');
                  setSelectedDate(new Date());
                  setSelectedTimeSlot(null);
                  setClientInfo({ name: '', email: '', phone: '' });
                  setCurrentStep(1);
                }}
                className="w-full"
              >
                Fazer Novo Agendamento
              </Button>
            </CardFooter>
          )}
        </Card>
        
        <div className="text-center mt-6 text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {company.name} - Sistema de Agendamento
        </div>
      </div>
    </div>
  );
};

export default PublicBookingPage;

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Appointment, 
  Professional, 
  Service, 
  Client,
  Availability,
  BlockedTime,
  User,
  ProfessionalService
} from '@/types/models';
import { useAuth } from './AuthContext';
import { mockAppointments, mockProfessionals, mockServices, mockClients, mockAvailabilities } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';

interface SchedulerContextType {
  appointments: Appointment[];
  professionals: Professional[];
  services: Service[];
  clients: Client[];
  availabilities: Availability[];
  blockedTimes: BlockedTime[];
  
  // Appointment management
  createAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Appointment>;
  updateAppointment: (id: string, data: Partial<Appointment>) => Promise<Appointment>;
  deleteAppointment: (id: string) => Promise<void>;
  
  // Client management
  createClient: (clientData: { name: string; email?: string; phone?: string }) => Promise<Client>;
  updateClient: (id: string, data: Partial<Client>) => Promise<Client>;
  deleteClient: (id: string) => Promise<void>;
  
  // Professional management
  createProfessional: (data: { 
    user: { name: string; email: string };
    bio?: string;
    serviceIds?: string[] 
  }) => Promise<Professional>;
  updateProfessional: (id: string, data: Partial<Professional> & { serviceIds?: string[] }) => Promise<Professional>;
  deleteProfessional: (id: string) => Promise<void>;
  
  // Available time slots
  getAvailableSlots: (professionalId: string, date: Date, serviceId: string) => Date[];
  
  // State management
  isLoading: boolean;
  error: string | null;
}

const SchedulerContext = createContext<SchedulerContextType | undefined>(undefined);

export const useScheduler = () => {
  const context = useContext(SchedulerContext);
  if (context === undefined) {
    throw new Error('useScheduler must be used within a SchedulerProvider');
  }
  return context;
};

export const SchedulerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { company } = useAuth();
  const { toast } = useToast();
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load data based on the current company
  useEffect(() => {
    if (!company) {
      setIsLoading(false);
      return;
    }
    
    try {
      // Filter data for the current company
      const companyAppointments = mockAppointments.filter(a => a.companyId === company.id);
      const companyProfessionals = mockProfessionals.filter(p => p.companyId === company.id);
      const companyServices = mockServices.filter(s => s.companyId === company.id);
      const companyClients = mockClients.filter(c => c.companyId === company.id);
      
      // Get availabilities for the company's professionals
      const professionalIds = companyProfessionals.map(p => p.id);
      const professionalAvailabilities = mockAvailabilities.filter(a => 
        professionalIds.includes(a.professionalId)
      );
      
      // Update state with company-specific data
      setAppointments(companyAppointments);
      setProfessionals(companyProfessionals);
      setServices(companyServices);
      setClients(companyClients);
      setAvailabilities(professionalAvailabilities);
      setBlockedTimes([]); // No mock blocked times for now
      
    } catch (err) {
      setError('Erro ao carregar dados da agenda');
      console.error('Failed to load scheduler data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [company]);
  
  // Calculate available time slots for a professional on a specific date
  const getAvailableSlots = (professionalId: string, date: Date, serviceId: string): Date[] => {
    if (!date || !professionalId || !serviceId) return [];
    
    try {
      // Get the day of the week (0 = Sunday, 1 = Monday, etc.)
      const dayOfWeek = date.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
      
      // Find the professional's availability for this day
      const dayAvailability = availabilities.find(a => 
        a.professionalId === professionalId && a.dayOfWeek === dayOfWeek
      );
      
      if (!dayAvailability) return []; // No availability for this day
      
      // Parse the start and end times
      const [startHour, startMinute] = dayAvailability.startTime.split(':').map(Number);
      const [endHour, endMinute] = dayAvailability.endTime.split(':').map(Number);
      
      // Find the service to get its duration
      const service = services.find(s => s.id === serviceId);
      if (!service) return [];
      
      const serviceDuration = service.duration;
      
      // Create a new date object for the start time
      const startDate = new Date(date);
      startDate.setHours(startHour, startMinute, 0, 0);
      
      // Create a new date object for the end time
      const endDate = new Date(date);
      endDate.setHours(endHour, endMinute, 0, 0);
      
      // Get existing appointments for this professional on this date
      const existingAppointments = appointments.filter(a => {
        const appointmentDate = new Date(a.startTime);
        return (
          a.professionalId === professionalId &&
          appointmentDate.getDate() === date.getDate() &&
          appointmentDate.getMonth() === date.getMonth() &&
          appointmentDate.getFullYear() === date.getFullYear() &&
          a.status !== 'cancelled'
        );
      });
      
      // Generate time slots at 15-minute intervals
      const slots: Date[] = [];
      let currentSlot = new Date(startDate);
      
      while (currentSlot.getTime() + serviceDuration * 60000 <= endDate.getTime()) {
        // Check if this slot conflicts with any existing appointment
        const hasConflict = existingAppointments.some(appointment => {
          const apptStart = new Date(appointment.startTime).getTime();
          const apptEnd = new Date(appointment.endTime).getTime();
          const slotStart = currentSlot.getTime();
          const slotEnd = slotStart + serviceDuration * 60000;
          
          // Check for overlap
          return (
            (slotStart >= apptStart && slotStart < apptEnd) || // Slot starts during appointment
            (slotEnd > apptStart && slotEnd <= apptEnd) || // Slot ends during appointment
            (slotStart <= apptStart && slotEnd >= apptEnd) // Slot contains appointment
          );
        });
        
        if (!hasConflict) {
          slots.push(new Date(currentSlot));
        }
        
        // Move to next 15-minute slot
        currentSlot = new Date(currentSlot.getTime() + 15 * 60000);
      }
      
      return slots;
    } catch (err) {
      console.error('Error calculating available slots:', err);
      return [];
    }
  };
  
  // Create a new appointment
  const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a new ID
      const id = `appointment-${Date.now()}`;
      
      // Create the new appointment
      const newAppointment: Appointment = {
        ...appointmentData,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Update the local state
      setAppointments(prev => [...prev, newAppointment]);
      
      toast({
        title: "Agendamento criado",
        description: `Agendamento para ${new Date(newAppointment.startTime).toLocaleString()} criado com sucesso!`,
      });
      
      return newAppointment;
    } catch (err) {
      const errorMessage = "Erro ao criar agendamento";
      setError(errorMessage);
      toast({
        title: errorMessage,
        description: err instanceof Error ? err.message : "Ocorreu um erro ao criar o agendamento",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update an existing appointment
  const updateAppointment = async (id: string, data: Partial<Appointment>): Promise<Appointment> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find the appointment to update
      const appointment = appointments.find(a => a.id === id);
      if (!appointment) {
        throw new Error("Agendamento não encontrado");
      }
      
      // Update the appointment
      const updatedAppointment: Appointment = {
        ...appointment,
        ...data,
        updatedAt: new Date(),
      };
      
      // Update the local state
      setAppointments(prev => prev.map(a => a.id === id ? updatedAppointment : a));
      
      toast({
        title: "Agendamento atualizado",
        description: "Agendamento atualizado com sucesso!",
      });
      
      return updatedAppointment;
    } catch (err) {
      const errorMessage = "Erro ao atualizar agendamento";
      setError(errorMessage);
      toast({
        title: errorMessage,
        description: err instanceof Error ? err.message : "Ocorreu um erro ao atualizar o agendamento",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete an appointment
  const deleteAppointment = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the local state
      setAppointments(prev => prev.filter(a => a.id !== id));
      
      toast({
        title: "Agendamento excluído",
        description: "Agendamento excluído com sucesso!",
      });
    } catch (err) {
      const errorMessage = "Erro ao excluir agendamento";
      setError(errorMessage);
      toast({
        title: errorMessage,
        description: err instanceof Error ? err.message : "Ocorreu um erro ao excluir o agendamento",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Client management functions
  const createClient = async (clientData: { name: string; email?: string; phone?: string }): Promise<Client> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!company) {
        throw new Error("Empresa não encontrada");
      }
      
      // Generate a new ID
      const id = `client-${Date.now()}`;
      
      // Create the new client
      const newClient: Client = {
        ...clientData,
        id,
        companyId: company.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Update the local state
      setClients(prev => [...prev, newClient]);
      
      toast({
        title: "Cliente criado",
        description: `Cliente ${newClient.name} criado com sucesso!`,
      });
      
      return newClient;
    } catch (err) {
      const errorMessage = "Erro ao criar cliente";
      setError(errorMessage);
      toast({
        title: errorMessage,
        description: err instanceof Error ? err.message : "Ocorreu um erro ao criar o cliente",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateClient = async (id: string, data: Partial<Client>): Promise<Client> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find the client to update
      const client = clients.find(c => c.id === id);
      if (!client) {
        throw new Error("Cliente não encontrado");
      }
      
      // Update the client
      const updatedClient: Client = {
        ...client,
        ...data,
        updatedAt: new Date(),
      };
      
      // Update the local state
      setClients(prev => prev.map(c => c.id === id ? updatedClient : c));
      
      toast({
        title: "Cliente atualizado",
        description: "Cliente atualizado com sucesso!",
      });
      
      return updatedClient;
    } catch (err) {
      const errorMessage = "Erro ao atualizar cliente";
      setError(errorMessage);
      toast({
        title: errorMessage,
        description: err instanceof Error ? err.message : "Ocorreu um erro ao atualizar o cliente",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteClient = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the local state
      setClients(prev => prev.filter(c => c.id !== id));
      
      toast({
        title: "Cliente excluído",
        description: "Cliente excluído com sucesso!",
      });
    } catch (err) {
      const errorMessage = "Erro ao excluir cliente";
      setError(errorMessage);
      toast({
        title: errorMessage,
        description: err instanceof Error ? err.message : "Ocorreu um erro ao excluir o cliente",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Professional management functions
  const createProfessional = async (data: { 
    user: { name: string; email: string };
    bio?: string;
    serviceIds?: string[] 
  }): Promise<Professional> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!company) {
        throw new Error("Empresa não encontrada");
      }
      
      // Generate new IDs
      const userId = `user-${Date.now()}`;
      const professionalId = `professional-${Date.now()}`;
      
      // Create a new user
      const newUser: User = {
        id: userId,
        email: data.user.email,
        name: data.user.name,
        role: "professional",
        companyId: company.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Create the new professional
      const newProfessional: Professional = {
        id: professionalId,
        userId: userId,
        companyId: company.id,
        bio: data.bio,
        user: newUser,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Update the local state
      setProfessionals(prev => [...prev, newProfessional]);
      
      // If services are provided, associate them with this professional
      if (data.serviceIds && data.serviceIds.length > 0) {
        // In a real app, this would update the ProfessionalService join table
        // For now, we'll just log it
        console.log(`Services ${data.serviceIds} associated with professional ${professionalId}`);
      }
      
      toast({
        title: "Profissional criado",
        description: `Profissional ${newProfessional.user?.name} criado com sucesso!`,
      });
      
      return newProfessional;
    } catch (err) {
      const errorMessage = "Erro ao criar profissional";
      setError(errorMessage);
      toast({
        title: errorMessage,
        description: err instanceof Error ? err.message : "Ocorreu um erro ao criar o profissional",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateProfessional = async (id: string, data: Partial<Professional> & { serviceIds?: string[] }): Promise<Professional> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find the professional to update
      const professional = professionals.find(p => p.id === id);
      if (!professional) {
        throw new Error("Profissional não encontrado");
      }
      
      // Update the professional
      const updatedProfessional: Professional = {
        ...professional,
        ...data,
        updatedAt: new Date(),
      };
      
      // Update the local state
      setProfessionals(prev => prev.map(p => p.id === id ? updatedProfessional : p));
      
      // If services are provided, update service associations
      if (data.serviceIds) {
        // In a real app, this would update the ProfessionalService join table
        // For now, we'll just log it
        console.log(`Updated services for professional ${id}: ${data.serviceIds}`);
      }
      
      toast({
        title: "Profissional atualizado",
        description: "Profissional atualizado com sucesso!",
      });
      
      return updatedProfessional;
    } catch (err) {
      const errorMessage = "Erro ao atualizar profissional";
      setError(errorMessage);
      toast({
        title: errorMessage,
        description: err instanceof Error ? err.message : "Ocorreu um erro ao atualizar o profissional",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteProfessional = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the local state
      setProfessionals(prev => prev.filter(p => p.id !== id));
      
      toast({
        title: "Profissional excluído",
        description: "Profissional excluído com sucesso!",
      });
    } catch (err) {
      const errorMessage = "Erro ao excluir profissional";
      setError(errorMessage);
      toast({
        title: errorMessage,
        description: err instanceof Error ? err.message : "Ocorreu um erro ao excluir o profissional",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SchedulerContext.Provider value={{
      appointments,
      professionals,
      services,
      clients,
      availabilities,
      blockedTimes,
      createAppointment,
      updateAppointment,
      deleteAppointment,
      createClient,
      updateClient,
      deleteClient,
      createProfessional,
      updateProfessional,
      deleteProfessional,
      getAvailableSlots,
      isLoading,
      error,
    }}>
      {children}
    </SchedulerContext.Provider>
  );
};

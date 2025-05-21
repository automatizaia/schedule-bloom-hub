
import { 
  Company, 
  User, 
  Professional, 
  Service, 
  ProfessionalService, 
  Availability, 
  Appointment, 
  Client 
} from '@/types/models';

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Clínica Bem Estar',
    logo: 'https://i.imgur.com/1234567.png',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Pet Shop Amigo Fiel',
    logo: 'https://i.imgur.com/7654321.png',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  }
];

export const mockUsers: User[] = [
  // Company 1 users
  {
    id: '1',
    email: 'admin@clinica.com',
    name: 'Ana Silva',
    role: 'admin',
    companyId: '1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    email: 'dr.marcos@clinica.com',
    name: 'Dr. Marcos Santos',
    role: 'professional',
    companyId: '1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    email: 'dra.julia@clinica.com',
    name: 'Dra. Julia Mendes',
    role: 'professional',
    companyId: '1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '4',
    email: 'cliente1@email.com',
    name: 'Roberto Alves',
    role: 'client',
    companyId: '1',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  
  // Company 2 users
  {
    id: '5',
    email: 'admin@petshop.com',
    name: 'Carlos Oliveira',
    role: 'admin',
    companyId: '2',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: '6',
    email: 'luiza@petshop.com',
    name: 'Luiza Martins',
    role: 'professional',
    companyId: '2',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
];

export const mockProfessionals: Professional[] = [
  {
    id: '1',
    userId: '2',
    companyId: '1',
    bio: 'Especialista em clínica geral com 10 anos de experiência.',
    specialties: ['Clínica Geral', 'Cardiologia'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    userId: '3',
    companyId: '1',
    bio: 'Dermatologista com foco em tratamentos estéticos.',
    specialties: ['Dermatologia', 'Estética'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    userId: '6',
    companyId: '2',
    bio: 'Veterinária especialista em pequenos animais.',
    specialties: ['Cães', 'Gatos', 'Banho e tosa'],
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
];

export const mockServices: Service[] = [
  // Company 1 services
  {
    id: '1',
    name: 'Consulta Médica',
    description: 'Consulta geral de rotina',
    duration: 30,
    price: 150,
    companyId: '1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Exame Dermatológico',
    description: 'Avaliação completa da pele',
    duration: 45,
    price: 200,
    companyId: '1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    name: 'Avaliação Cardiológica',
    description: 'Inclui eletrocardiograma',
    duration: 60,
    price: 250,
    companyId: '1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  
  // Company 2 services
  {
    id: '4',
    name: 'Consulta Veterinária',
    description: 'Avaliação geral do pet',
    duration: 30,
    price: 100,
    companyId: '2',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: '5',
    name: 'Banho e Tosa',
    description: 'Higienização completa',
    duration: 90,
    price: 80,
    companyId: '2',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
];

export const mockProfessionalServices: ProfessionalService[] = [
  {
    professionalId: '1',
    serviceId: '1',
  },
  {
    professionalId: '1',
    serviceId: '3',
  },
  {
    professionalId: '2',
    serviceId: '1',
  },
  {
    professionalId: '2',
    serviceId: '2',
  },
  {
    professionalId: '3',
    serviceId: '4',
  },
  {
    professionalId: '3',
    serviceId: '5',
  },
];

export const mockAvailabilities: Availability[] = [
  // Dr. Marcos (Professional 1) availabilities
  {
    id: '1',
    professionalId: '1',
    dayOfWeek: 1, // Monday
    startTime: '08:00',
    endTime: '17:00',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    professionalId: '1',
    dayOfWeek: 3, // Wednesday
    startTime: '08:00',
    endTime: '17:00',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    professionalId: '1',
    dayOfWeek: 5, // Friday
    startTime: '08:00',
    endTime: '12:00',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  
  // Dra. Julia (Professional 2) availabilities
  {
    id: '4',
    professionalId: '2',
    dayOfWeek: 2, // Tuesday
    startTime: '09:00',
    endTime: '18:00',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '5',
    professionalId: '2',
    dayOfWeek: 4, // Thursday
    startTime: '09:00',
    endTime: '18:00',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  
  // Luiza (Professional 3) availabilities
  {
    id: '6',
    professionalId: '3',
    dayOfWeek: 1, // Monday
    startTime: '08:00',
    endTime: '18:00',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: '7',
    professionalId: '3',
    dayOfWeek: 2, // Tuesday
    startTime: '08:00',
    endTime: '18:00',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: '8',
    professionalId: '3',
    dayOfWeek: 3, // Wednesday
    startTime: '08:00',
    endTime: '18:00',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: '9',
    professionalId: '3',
    dayOfWeek: 4, // Thursday
    startTime: '08:00',
    endTime: '18:00',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: '10',
    professionalId: '3',
    dayOfWeek: 5, // Friday
    startTime: '08:00',
    endTime: '18:00',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
];

export const mockClients: Client[] = [
  {
    id: '1',
    userId: '4',
    name: 'Roberto Alves',
    email: 'cliente1@email.com',
    phone: '(11) 98765-4321',
    companyId: '1',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: '2',
    name: 'Fernanda Costa',
    email: 'fernanda@email.com',
    phone: '(11) 91234-5678',
    companyId: '1',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
  {
    id: '3',
    name: 'Mariana Souza',
    email: 'mariana@email.com',
    phone: '(11) 99876-5432',
    companyId: '2',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
];

// Create mock appointments for the next 7 days
export const mockAppointments: Appointment[] = (() => {
  const now = new Date();
  const appointments: Appointment[] = [];
  
  // Add some appointments for the next 7 days
  for (let i = 0; i < 10; i++) {
    const startDay = new Date(now);
    startDay.setDate(now.getDate() + Math.floor(Math.random() * 7)); // Random day in the next week
    startDay.setHours(8 + Math.floor(Math.random() * 8), 0, 0, 0); // Between 8 AM and 4 PM
    
    const professionalId = i % 2 === 0 ? '1' : '2';
    const serviceId = i % 2 === 0 ? '1' : '2';
    const service = mockServices.find(s => s.id === serviceId);
    
    const endDay = new Date(startDay);
    endDay.setMinutes(startDay.getMinutes() + (service?.duration || 30));
    
    appointments.push({
      id: `appointment-${i + 1}`,
      clientId: i % 3 === 0 ? '1' : '2',
      professionalId,
      serviceId,
      startTime: startDay,
      endTime: endDay,
      status: Math.random() > 0.2 ? 'confirmed' : 'pending',
      companyId: '1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    });
  }
  
  // Add a few appointments for company 2
  for (let i = 0; i < 5; i++) {
    const startDay = new Date(now);
    startDay.setDate(now.getDate() + Math.floor(Math.random() * 7));
    startDay.setHours(9 + Math.floor(Math.random() * 6), 0, 0, 0);
    
    const serviceId = '4';
    const service = mockServices.find(s => s.id === serviceId);
    
    const endDay = new Date(startDay);
    endDay.setMinutes(startDay.getMinutes() + (service?.duration || 30));
    
    appointments.push({
      id: `appointment-company2-${i + 1}`,
      clientId: '3',
      professionalId: '3',
      serviceId,
      startTime: startDay,
      endTime: endDay,
      status: Math.random() > 0.2 ? 'confirmed' : 'pending',
      companyId: '2',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    });
  }
  
  return appointments;
})();


// Company represents a tenant in our multi-tenant system
export interface Company {
  id: string;
  name: string;
  logo?: string;
  domain?: string;
  createdAt: Date;
  updatedAt: Date;
}

// User represents someone who can log in to the system
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "professional" | "client";
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Professional represents someone who provides services
export interface Professional {
  id: string;
  userId: string;
  companyId: string;
  bio?: string;
  specialties?: string[];
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}

// Service represents a service offered by the company
export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number; // in minutes
  price?: number;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ProfessionalService links professionals to the services they offer
export interface ProfessionalService {
  professionalId: string;
  serviceId: string;
  professional?: Professional;
  service?: Service;
}

// Availability represents when a professional is available
export interface Availability {
  id: string;
  professionalId: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 6 = Saturday
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  createdAt: Date;
  updatedAt: Date;
}

// BlockedTime represents times when a professional is not available
export interface BlockedTime {
  id: string;
  professionalId: string;
  startTime: Date;
  endTime: Date;
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Appointment represents a booked appointment
export interface Appointment {
  id: string;
  clientId: string;
  professionalId: string;
  serviceId: string;
  startTime: Date;
  endTime: Date;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  companyId: string;
  client?: User;
  professional?: Professional;
  service?: Service;
  createdAt: Date;
  updatedAt: Date;
}

// Client represents a client of the company
export interface Client {
  id: string;
  userId?: string;
  name: string;
  email?: string;
  phone?: string;
  companyId: string;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}

// ReminderSetting represents settings for appointment reminders
export interface ReminderSetting {
  id: string;
  companyId: string;
  type: "email" | "whatsapp";
  advanceTimeMinutes: number;
  template: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// WhatsAppIntegration represents WhatsApp integration settings
export interface WhatsAppIntegration {
  id: string;
  companyId: string;
  webhookUrl: string;
  apiKey?: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}


export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export type AppointmentType = 'consultation' | 'follow_up' | 'procedure' | 'lab_work' | 'imaging' | 'therapy' | 'emergency';

export type RecurrencePattern = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Appointment {
  id: string;
  patient_id: string;
  created_by: string;
  title: string;
  description?: string;
  appointment_type: AppointmentType;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  status: AppointmentStatus;
  provider_name?: string;
  location?: string;
  notes?: string;
  is_recurring: boolean;
  recurrence_pattern: RecurrencePattern;
  recurrence_interval?: number;
  recurrence_end_date?: string;
  parent_appointment_id?: string;
  send_reminder: boolean;
  reminder_minutes_before?: number;
  created_at: string;
  updated_at: string;
  // Joined data
  patient_name?: string;
}

export interface AppointmentFormData {
  patient_id: string;
  title: string;
  description?: string;
  appointment_type: AppointmentType;
  start_time: Date;
  end_time: Date;
  duration_minutes: number;
  status: AppointmentStatus;
  provider_name?: string;
  location?: string;
  notes?: string;
  is_recurring: boolean;
  recurrence_pattern: RecurrencePattern;
  recurrence_interval?: number;
  recurrence_end_date?: Date;
  send_reminder: boolean;
  reminder_minutes_before?: number;
}


import { supabase } from "@/integrations/supabase/client";
import { Appointment, AppointmentFormData } from "@/types/appointment";

export const appointmentService = {
  // Get all appointments with patient names
  async getAppointments(): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients!inner(name)
      `)
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }

    return data?.map(appointment => ({
      ...appointment,
      patient_name: appointment.patients?.name
    })) || [];
  },

  // Get appointments for a specific date range
  async getAppointmentsByDateRange(startDate: string, endDate: string): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients!inner(name)
      `)
      .gte('start_time', startDate)
      .lte('start_time', endDate)
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching appointments by date range:', error);
      throw error;
    }

    return data?.map(appointment => ({
      ...appointment,
      patient_name: appointment.patients?.name
    })) || [];
  },

  // Get appointments for a specific patient
  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients!inner(name)
      `)
      .eq('patient_id', patientId)
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching appointments by patient:', error);
      throw error;
    }

    return data?.map(appointment => ({
      ...appointment,
      patient_name: appointment.patients?.name
    })) || [];
  },

  // Create a new appointment
  async createAppointment(appointmentData: AppointmentFormData): Promise<Appointment> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const appointmentPayload = {
      ...appointmentData,
      created_by: user.id,
      start_time: appointmentData.start_time.toISOString(),
      end_time: appointmentData.end_time.toISOString(),
      recurrence_end_date: appointmentData.recurrence_end_date?.toISOString().split('T')[0]
    };

    const { data, error } = await supabase
      .from('appointments')
      .insert([appointmentPayload])
      .select(`
        *,
        patients!inner(name)
      `)
      .single();

    if (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }

    return {
      ...data,
      patient_name: data.patients?.name
    };
  },

  // Update an appointment
  async updateAppointment(id: string, appointmentData: Partial<AppointmentFormData>): Promise<Appointment> {
    const updatePayload = {
      ...appointmentData,
      start_time: appointmentData.start_time?.toISOString(),
      end_time: appointmentData.end_time?.toISOString(),
      recurrence_end_date: appointmentData.recurrence_end_date?.toISOString().split('T')[0]
    };

    const { data, error } = await supabase
      .from('appointments')
      .update(updatePayload)
      .eq('id', id)
      .select(`
        *,
        patients!inner(name)
      `)
      .single();

    if (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }

    return {
      ...data,
      patient_name: data.patients?.name
    };
  },

  // Delete an appointment
  async deleteAppointment(id: string): Promise<void> {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  },

  // Update appointment status
  async updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)
      .select(`
        *,
        patients!inner(name)
      `)
      .single();

    if (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }

    return {
      ...data,
      patient_name: data.patients?.name
    };
  }
};

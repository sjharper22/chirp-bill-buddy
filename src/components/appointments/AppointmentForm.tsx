import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Appointment, AppointmentFormData, AppointmentType, AppointmentStatus, RecurrencePattern } from "@/types/appointment";
import { patientService } from "@/services/patientService";

interface AppointmentFormProps {
  appointment?: Appointment | null;
  onSubmit: (data: AppointmentFormData | Partial<AppointmentFormData>) => void;
  onCancel: () => void;
}

export function AppointmentForm({ appointment, onSubmit, onCancel }: AppointmentFormProps) {
  const [formData, setFormData] = useState<AppointmentFormData>({
    patient_id: "",
    title: "",
    description: "",
    appointment_type: "consultation" as AppointmentType,
    start_time: new Date(),
    end_time: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes later
    duration_minutes: 30,
    status: "scheduled" as AppointmentStatus,
    provider_name: "",
    location: "",
    notes: "",
    is_recurring: false,
    recurrence_pattern: "none" as RecurrencePattern,
    recurrence_interval: 1,
    recurrence_end_date: undefined,
    send_reminder: true,
    reminder_minutes_before: 60,
  });

  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: () => patientService.getAll(),
  });

  useEffect(() => {
    if (appointment) {
      setFormData({
        patient_id: appointment.patient_id,
        title: appointment.title,
        description: appointment.description || "",
        appointment_type: appointment.appointment_type,
        start_time: new Date(appointment.start_time),
        end_time: new Date(appointment.end_time),
        duration_minutes: appointment.duration_minutes,
        status: appointment.status,
        provider_name: appointment.provider_name || "",
        location: appointment.location || "",
        notes: appointment.notes || "",
        is_recurring: appointment.is_recurring,
        recurrence_pattern: appointment.recurrence_pattern,
        recurrence_interval: appointment.recurrence_interval || 1,
        recurrence_end_date: appointment.recurrence_end_date ? new Date(appointment.recurrence_end_date) : undefined,
        send_reminder: appointment.send_reminder,
        reminder_minutes_before: appointment.reminder_minutes_before || 60,
      });
    }
  }, [appointment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateEndTime = (startTime: Date, durationMinutes: number) => {
    const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);
    setFormData(prev => ({ ...prev, end_time: endTime }));
  };

  const handleStartTimeChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, start_time: date }));
      updateEndTime(date, formData.duration_minutes);
    }
  };

  const handleDurationChange = (duration: number) => {
    setFormData(prev => ({ ...prev, duration_minutes: duration }));
    updateEndTime(formData.start_time, duration);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="patient_id">Patient *</Label>
          <Select 
            value={formData.patient_id} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, patient_id: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a patient" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id}>
                  {patient.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="appointment_type">Appointment Type</Label>
          <Select 
            value={formData.appointment_type} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, appointment_type: value as AppointmentType }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="consultation">Consultation</SelectItem>
              <SelectItem value="follow_up">Follow Up</SelectItem>
              <SelectItem value="procedure">Procedure</SelectItem>
              <SelectItem value="lab_work">Lab Work</SelectItem>
              <SelectItem value="imaging">Imaging</SelectItem>
              <SelectItem value="therapy">Therapy</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Appointment title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Appointment description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Start Date & Time *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !formData.start_time && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.start_time ? format(formData.start_time, "PPP p") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.start_time}
                onSelect={handleStartTimeChange}
                initialFocus
              />
              <div className="p-3 border-t">
                <Input
                  type="time"
                  value={format(formData.start_time, "HH:mm")}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':');
                    const newDate = new Date(formData.start_time);
                    newDate.setHours(parseInt(hours), parseInt(minutes));
                    handleStartTimeChange(newDate);
                  }}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Select 
            value={formData.duration_minutes.toString()} 
            onValueChange={(value) => handleDurationChange(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
              <SelectItem value="90">1.5 hours</SelectItem>
              <SelectItem value="120">2 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as AppointmentStatus }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="no_show">No Show</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="provider_name">Provider Name</Label>
          <Input
            id="provider_name"
            value={formData.provider_name}
            onChange={(e) => setFormData(prev => ({ ...prev, provider_name: e.target.value }))}
            placeholder="Dr. Smith"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Room 101"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Additional notes"
          rows={3}
        />
      </div>

      <div className="space-y-4 border-t pt-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_recurring"
            checked={formData.is_recurring}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_recurring: checked }))}
          />
          <Label htmlFor="is_recurring">Recurring Appointment</Label>
        </div>

        {formData.is_recurring && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-6">
            <div className="space-y-2">
              <Label htmlFor="recurrence_pattern">Recurrence Pattern</Label>
              <Select 
                value={formData.recurrence_pattern} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, recurrence_pattern: value as RecurrencePattern }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recurrence_interval">Every</Label>
              <Input
                id="recurrence_interval"
                type="number"
                min="1"
                value={formData.recurrence_interval}
                onChange={(e) => setFormData(prev => ({ ...prev, recurrence_interval: parseInt(e.target.value) || 1 }))}
              />
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !formData.recurrence_end_date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.recurrence_end_date ? format(formData.recurrence_end_date, "PPP") : "No end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.recurrence_end_date}
                    onSelect={(date) => setFormData(prev => ({ ...prev, recurrence_end_date: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 border-t pt-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="send_reminder"
            checked={formData.send_reminder}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, send_reminder: checked }))}
          />
          <Label htmlFor="send_reminder">Send Reminder</Label>
        </div>

        {formData.send_reminder && (
          <div className="ml-6">
            <div className="space-y-2">
              <Label htmlFor="reminder_minutes_before">Remind (minutes before)</Label>
              <Select 
                value={formData.reminder_minutes_before?.toString() || "60"} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, reminder_minutes_before: parseInt(value) }))}
              >
                <SelectTrigger className="w-auto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="1440">1 day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {appointment ? "Update" : "Create"} Appointment
        </Button>
      </div>
    </form>
  );
}

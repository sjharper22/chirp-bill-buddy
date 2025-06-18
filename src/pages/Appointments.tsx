
import { useState, useEffect } from "react";
import { Calendar, Clock, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentCalendar } from "@/components/appointments/AppointmentCalendar";
import { AppointmentList } from "@/components/appointments/AppointmentList";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import { AppointmentStats } from "@/components/appointments/AppointmentStats";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { appointmentService } from "@/services/appointmentService";
import { Appointment, AppointmentFormData, AppointmentStatus } from "@/types/appointment";
import { useAuth } from "@/context/auth-context";

export default function Appointments() {
  const { toast } = useToast();
  const { isAdmin, isEditor } = useAuth();
  const canEdit = isAdmin || isEditor;
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAppointments();
      setAppointments(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to load appointments: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAppointment = async (appointmentData: AppointmentFormData) => {
    try {
      const newAppointment = await appointmentService.createAppointment(appointmentData);
      setAppointments(prev => [...prev, newAppointment]);
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Appointment created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to create appointment: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleUpdateAppointment = async (appointmentData: Partial<AppointmentFormData>) => {
    if (!selectedAppointment) return;
    
    try {
      const updatedAppointment = await appointmentService.updateAppointment(
        selectedAppointment.id,
        appointmentData
      );
      
      setAppointments(prev =>
        prev.map(app => app.id === selectedAppointment.id ? updatedAppointment : app)
      );
      setIsEditDialogOpen(false);
      setSelectedAppointment(null);
      
      toast({
        title: "Success",
        description: "Appointment updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update appointment: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    try {
      await appointmentService.deleteAppointment(id);
      setAppointments(prev => prev.filter(app => app.id !== id));
      
      toast({
        title: "Success",
        description: "Appointment deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete appointment: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const updatedAppointment = await appointmentService.updateAppointmentStatus(id, status as AppointmentStatus);
      setAppointments(prev =>
        prev.map(app => app.id === id ? updatedAppointment : app)
      );
      
      toast({
        title: "Success",
        description: "Appointment status updated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update status: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsEditDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">Manage patient appointments and scheduling</p>
        </div>
        {canEdit && (
          <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Appointment
          </Button>
        )}
      </div>

      {/* Stats */}
      <AppointmentStats appointments={appointments} />

      {/* Main Content */}
      <Tabs defaultValue="calendar" className="mt-8">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            List View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-6">
          <AppointmentCalendar
            appointments={appointments}
            onEditAppointment={handleEditAppointment}
            onDeleteAppointment={handleDeleteAppointment}
            onStatusChange={handleStatusChange}
            canEdit={canEdit}
          />
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <AppointmentList
            appointments={appointments}
            onEditAppointment={handleEditAppointment}
            onDeleteAppointment={handleDeleteAppointment}
            onStatusChange={handleStatusChange}
            canEdit={canEdit}
          />
        </TabsContent>
      </Tabs>

      {/* Create Appointment Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Appointment</DialogTitle>
          </DialogHeader>
          <AppointmentForm
            onSubmit={handleCreateAppointment}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Appointment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
          </DialogHeader>
          <AppointmentForm
            appointment={selectedAppointment}
            onSubmit={handleUpdateAppointment}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setSelectedAppointment(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

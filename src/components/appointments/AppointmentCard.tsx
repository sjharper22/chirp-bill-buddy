
import { format } from "date-fns";
import { Calendar, Clock, User, MapPin, FileText, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Appointment } from "@/types/appointment";

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
  canEdit: boolean;
}

export function AppointmentCard({
  appointment,
  onEdit,
  onDelete,
  onStatusChange,
  canEdit
}: AppointmentCardProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'confirmed': 'bg-green-100 text-green-800',
      'in_progress': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-emerald-100 text-emerald-800',
      'cancelled': 'bg-red-100 text-red-800',
      'no_show': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'consultation': 'bg-purple-100 text-purple-800',
      'follow_up': 'bg-blue-100 text-blue-800',
      'procedure': 'bg-orange-100 text-orange-800',
      'lab_work': 'bg-cyan-100 text-cyan-800',
      'imaging': 'bg-indigo-100 text-indigo-800',
      'therapy': 'bg-green-100 text-green-800',
      'emergency': 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{appointment.title}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getStatusColor(appointment.status)}>
                {appointment.status.replace('_', ' ')}
              </Badge>
              <Badge variant="outline" className={getTypeColor(appointment.appointment_type)}>
                {appointment.appointment_type.replace('_', ' ')}
              </Badge>
            </div>
          </div>
          {canEdit && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(appointment)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(appointment.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="h-4 w-4" />
          <span>{appointment.patient_name}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(appointment.start_time), 'PPP')}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>
            {format(new Date(appointment.start_time), 'p')} - {format(new Date(appointment.end_time), 'p')}
            {' '}({appointment.duration_minutes} mins)
          </span>
        </div>
        
        {appointment.provider_name && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>Dr. {appointment.provider_name}</span>
          </div>
        )}
        
        {appointment.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{appointment.location}</span>
          </div>
        )}
        
        {appointment.description && (
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <FileText className="h-4 w-4 mt-0.5" />
            <span>{appointment.description}</span>
          </div>
        )}
        
        {canEdit && (
          <div className="pt-2 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <Select 
                value={appointment.status} 
                onValueChange={(value) => onStatusChange(appointment.id, value)}
              >
                <SelectTrigger className="w-auto">
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
        )}
      </CardContent>
    </Card>
  );
}

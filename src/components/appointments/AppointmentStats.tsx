
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Users } from "lucide-react";
import { Appointment } from "@/types/appointment";

interface AppointmentStatsProps {
  appointments: Appointment[];
}

export function AppointmentStats({ appointments }: AppointmentStatsProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const thisWeek = new Date(today);
  thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());

  const nextWeek = new Date(thisWeek);
  nextWeek.setDate(nextWeek.getDate() + 7);

  // Today's appointments
  const todayAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.start_time);
    aptDate.setHours(0, 0, 0, 0);
    return aptDate.getTime() === today.getTime();
  });

  // This week's appointments
  const thisWeekAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.start_time);
    return aptDate >= thisWeek && aptDate < nextWeek;
  });

  // Status counts
  const statusCounts = appointments.reduce((acc, apt) => {
    acc[apt.status] = (acc[apt.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Upcoming appointments (next 7 days)
  const upcomingAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.start_time);
    const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return aptDate >= today && aptDate <= weekFromNow;
  });

  const stats = [
    {
      title: "Today's Appointments",
      value: todayAppointments.length,
      icon: Calendar,
      description: `${todayAppointments.filter(a => a.status === 'confirmed').length} confirmed`,
      color: "text-blue-600"
    },
    {
      title: "This Week",
      value: thisWeekAppointments.length,
      icon: Clock,
      description: `${thisWeekAppointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed').length} scheduled`,
      color: "text-green-600"
    },
    {
      title: "Completed",
      value: statusCounts.completed || 0,
      icon: CheckCircle,
      description: "Total completed",
      color: "text-emerald-600"
    },
    {
      title: "Cancelled",
      value: (statusCounts.cancelled || 0) + (statusCounts.no_show || 0),
      icon: XCircle,
      description: `${statusCounts.no_show || 0} no-shows`,
      color: "text-red-600"
    },
    {
      title: "In Progress",
      value: statusCounts.in_progress || 0,
      icon: AlertCircle,
      description: "Currently active",
      color: "text-yellow-600"
    },
    {
      title: "Total Patients",
      value: new Set(appointments.map(a => a.patient_id)).size,
      icon: Users,
      description: "Unique patients",
      color: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

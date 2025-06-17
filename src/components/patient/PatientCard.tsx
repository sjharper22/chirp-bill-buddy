
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientProfile } from "@/types/patient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Phone, Mail, MapPin, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils/format-utils";

interface PatientCardProps {
  patient: PatientProfile;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  canEdit: boolean;
}

export function PatientCard({ patient, isSelected, onToggleSelection, canEdit }: PatientCardProps) {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'discharged': return 'bg-blue-100 text-blue-800';
      case 'deceased': return 'bg-red-100 text-red-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const handleViewProfile = () => {
    navigate(`/patients/${patient.id}`);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {canEdit && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggleSelection(patient.id)}
              />
            )}
            
            <Avatar className="h-12 w-12">
              <AvatarImage src={patient.avatar_url} alt={patient.name} />
              <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-semibold text-lg">{patient.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {formatDate(patient.dob)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(patient.patient_status)}>
              {patient.patient_status || 'active'}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewProfile}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm">
          {patient.phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-3 w-3" />
              {patient.phone}
            </div>
          )}
          
          {patient.email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-3 w-3" />
              {patient.email}
            </div>
          )}
          
          {(patient.city || patient.state) && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {[patient.city, patient.state].filter(Boolean).join(', ')}
            </div>
          )}
        </div>
        
        {(patient.commonIcdCodes?.length > 0 || patient.commonCptCodes?.length > 0) && (
          <div className="mt-3 pt-3 border-t">
            <div className="text-xs text-muted-foreground mb-1">Common Codes</div>
            <div className="flex flex-wrap gap-1">
              {patient.commonIcdCodes?.slice(0, 3).map(code => (
                <Badge key={code} variant="outline" className="text-xs">
                  {code}
                </Badge>
              ))}
              {patient.commonCptCodes?.slice(0, 2).map(code => (
                <Badge key={code} variant="outline" className="text-xs">
                  {code}
                </Badge>
              ))}
              {(patient.commonIcdCodes?.length > 3 || patient.commonCptCodes?.length > 2) && (
                <Badge variant="outline" className="text-xs">
                  +more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

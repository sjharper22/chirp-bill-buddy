
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSuperbill } from "@/context/superbill-context";
import { useAuth } from "@/context/auth-context";
import { User, Settings, LogOut, Users, Shield } from "lucide-react";

export function UserMenu() {
  const { clinicDefaults } = useSuperbill();
  const { user, profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const getUserInitials = () => {
    if (profile?.full_name) {
      const names = profile.full_name.split(' ');
      return names.length > 1 
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : profile.full_name.charAt(0).toUpperCase();
    }
    return <User className="h-5 w-5" />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-accent/10"
        >
          <Avatar className="h-8 w-8 border-2 border-primary/20">
            <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">
              {profile?.full_name || user?.email || "User"}
            </span>
            <span className="text-xs text-muted-foreground truncate max-w-[150px]">
              {clinicDefaults.clinicName || "No Clinic"}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{profile?.full_name || user?.email}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Account Settings</span>
        </DropdownMenuItem>
        
        {isAdmin && (
          <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/team')}>
            <Users className="mr-2 h-4 w-4" />
            <span>Team Management</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive cursor-pointer" 
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

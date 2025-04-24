
import React from 'react';
import { useNavigate } from "react-router-dom";
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
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{profile?.full_name || user?.email || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{clinicDefaults.clinicName}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        {isAdmin && (
          <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/team')}>
            <Users className="mr-2 h-4 w-4" />
            <span>Team Management</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

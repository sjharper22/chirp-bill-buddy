
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/context/auth-context";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Users, UserPlus, Shield, Mail, Trash2 } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";

interface TeamMember {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
}

interface Invitation {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  expires_at: string;
}

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("viewer");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  
  const fetchTeamMembers = async () => {
    try {
      // Get all user profiles
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url');
        
      if (profileError) {
        throw profileError;
      }
      
      // Get user roles
      const { data: userRoles, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id, role');
        
      if (roleError) {
        throw roleError;
      }
      
      // Get user emails
      const { data: users, error: userError } = await supabase.auth.admin.listUsers();
      
      if (userError) {
        throw userError;
      }
      
      // Combine data
      const teamMembers = profiles.map((profile: any) => {
        const userRole = userRoles.find((r: any) => r.user_id === profile.id);
        const userData = users.users.find((u: any) => u.id === profile.id);
        
        return {
          id: profile.id,
          email: userData?.email || "",
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          role: userRole?.role || "viewer",
        };
      });
      
      setMembers(teamMembers);
    } catch (error: any) {
      console.error("Error fetching team members:", error);
      toast({
        title: "Error",
        description: "Failed to load team members",
        variant: "destructive",
      });
    }
  };
  
  const fetchInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setInvitations(data || []);
    } catch (error: any) {
      console.error("Error fetching invitations:", error);
    }
  };
  
  const loadData = async () => {
    setIsLoading(true);
    await fetchTeamMembers();
    await fetchInvitations();
    setIsLoading(false);
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('invitations')
        .insert({
          email: inviteEmail.trim(),
          role: inviteRole,
          invited_by: user?.id,
        });
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Invitation Sent",
        description: `An invitation has been sent to ${inviteEmail}`,
      });
      
      setInviteEmail("");
      setDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send invitation",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteInvitation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('invitations')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Invitation Deleted",
        description: "The invitation has been deleted",
      });
      
      await fetchInvitations();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete invitation",
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    try {
      // First delete existing role
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);
        
      // Then insert new role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: newRole,
        });
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Role Updated",
        description: "User role has been updated successfully",
      });
      
      await fetchTeamMembers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update role",
        variant: "destructive",
      });
    }
  };
  
  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "editor":
        return "bg-blue-100 text-blue-800";
      case "viewer":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <ProtectedRoute requiredRoles={["admin"]}>
      <div className="container max-w-screen-xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Team Management</h1>
            <p className="text-muted-foreground">
              Manage team members and invitations
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Team Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to a new team member to join your organization.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="colleague@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as UserRole)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInvite}>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Invitation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          <Card>
            <CardHeader className="border-b pb-3">
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Team Members
              </CardTitle>
              <CardDescription>
                Manage existing team members and their roles
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                </div>
              ) : members.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No team members found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Name</th>
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">Role</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((member) => (
                        <tr key={member.id} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                {member.full_name ? member.full_name.charAt(0).toUpperCase() : "?"}
                              </div>
                              <span>{member.full_name || "Unknown"}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">{member.email}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadgeClass(member.role)}`}>
                              {member.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Select
                              value={member.role}
                              onValueChange={(value) => handleUpdateRole(member.id, value as UserRole)}
                              disabled={member.id === user?.id} // Can't change own role
                            >
                              <SelectTrigger className="w-32 ml-auto">
                                <SelectValue placeholder="Change Role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                                <SelectItem value="viewer">Viewer</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="border-b pb-3">
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Pending Invitations
              </CardTitle>
              <CardDescription>
                Manage invitations that have not been accepted yet
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                </div>
              ) : invitations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No pending invitations</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">Role</th>
                        <th className="text-left py-3 px-4">Sent</th>
                        <th className="text-left py-3 px-4">Expires</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invitations.map((invitation) => {
                        const sentDate = new Date(invitation.created_at);
                        const expiresDate = new Date(invitation.expires_at);
                        const isExpired = expiresDate < new Date();
                        
                        return (
                          <tr key={invitation.id} className={`border-b last:border-0 hover:bg-muted/50 ${isExpired ? 'opacity-60' : ''}`}>
                            <td className="py-3 px-4">{invitation.email}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadgeClass(invitation.role)}`}>
                                {invitation.role}
                              </span>
                            </td>
                            <td className="py-3 px-4">{sentDate.toLocaleDateString()}</td>
                            <td className="py-3 px-4">
                              {isExpired ? 'Expired' : expiresDate.toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Invitation</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this invitation? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteInvitation(invitation.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="border-b pb-3">
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Role Permissions
              </CardTitle>
              <CardDescription>
                Information about the permissions for each role
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 text-purple-700">Admin</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Manage team members and invitations</li>
                    <li>• Full access to all patients and superbills</li>
                    <li>• Create and edit system-wide settings</li>
                    <li>• Delete records and team members</li>
                    <li>• View reports and analytics</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 text-blue-700">Editor</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Create and edit patients</li>
                    <li>• Create and edit superbills</li>
                    <li>• View all patients and records</li>
                    <li>• Generate reports</li>
                    <li>• Cannot delete or manage team members</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Viewer</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• View all patients</li>
                    <li>• View all superbills</li>
                    <li>• Generate reports</li>
                    <li>• Cannot create or edit records</li>
                    <li>• Cannot delete anything</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}

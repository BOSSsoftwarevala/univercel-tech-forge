import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  LogOut, 
  Users, 
  Shield, 
  AlertTriangle, 
  Search,
  UserX,
  RefreshCw,
  Clock,
  Zap
} from "lucide-react";

interface UserSession {
  id: string;
  user_id: string;
  role: string;
  approval_status: string;
  force_logged_out_at: string | null;
  force_logged_out_by: string | null;
  created_at: string;
  last_activity?: string;
}

const ForceLogoutManager = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserSession | null>(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showLogoutAllDialog, setShowLogoutAllDialog] = useState(false);

  // Fetch all user sessions
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['user-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .neq('role', 'master')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as UserSession[];
    }
  });

  // Force logout single user
  const forceLogoutMutation = useMutation({
    mutationFn: async (targetUserId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.rpc('force_logout_user', {
        target_user_id: targetUserId,
        admin_user_id: user.id
      });

      if (error) throw error;

      // Log the action
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'force_logout_user',
        module: 'security',
        meta_json: { target_user_id: targetUserId, timestamp: new Date().toISOString() }
      });
    },
    onSuccess: () => {
      toast.success('User has been force logged out');
      queryClient.invalidateQueries({ queryKey: ['user-sessions'] });
      setShowLogoutDialog(false);
      setSelectedUser(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to force logout user');
    }
  });

  // Force logout all users
  const forceLogoutAllMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.rpc('force_logout_all_except_master', {
        admin_user_id: user.id
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (count) => {
      toast.success(`${count} users have been force logged out`);
      queryClient.invalidateQueries({ queryKey: ['user-sessions'] });
      setShowLogoutAllDialog(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to force logout all users');
    }
  });

  // Clear force logout for a user
  const clearLogoutMutation = useMutation({
    mutationFn: async (userId: string) => {
      await supabase.rpc('clear_force_logout', { clear_user_id: userId });
    },
    onSuccess: () => {
      toast.success('Force logout cleared for user');
      queryClient.invalidateQueries({ queryKey: ['user-sessions'] });
    }
  });

  const filteredUsers = users?.filter(user => 
    user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.user_id.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const activeLogouts = users?.filter(u => u.force_logged_out_at) || [];
  const totalUsers = users?.length || 0;

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      super_admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      demo_manager: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      developer: 'bg-green-500/20 text-green-400 border-green-500/30',
      franchise: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      reseller: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      client: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      prime: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    };
    return colors[role] || 'bg-secondary text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <LogOut className="w-6 h-6 text-red-400" />
            Force Logout Management
          </h2>
          <p className="text-muted-foreground">Control user sessions and force logout when needed</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => setShowLogoutAllDialog(true)}
          >
            <Zap className="w-4 h-4 mr-2" />
            Logout All Users
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="bg-card/50 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="bg-card/50 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Logouts</p>
                  <p className="text-2xl font-bold text-red-400">{activeLogouts.length}</p>
                </div>
                <UserX className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="bg-card/50 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Protected</p>
                  <p className="text-2xl font-bold text-green-400">{totalUsers - activeLogouts.length}</p>
                </div>
                <Shield className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="bg-card/50 border-orange-500/20 border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Session Monitor</p>
                  <p className="text-sm font-medium text-orange-400">Active</p>
                </div>
                <Clock className="w-8 h-8 text-orange-400 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by role or user ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-secondary/30"
        />
      </div>

      {/* Users Table */}
      <Card className="bg-card/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">User Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Force Logout</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-mono text-xs">
                      {user.user_id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.approval_status === 'approved' ? 'default' : 'secondary'}>
                        {user.approval_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.force_logged_out_at ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive" className="text-xs">
                            Logged Out
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(user.force_logged_out_at).toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-green-400 border-green-400/30">
                          Active
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {user.force_logged_out_at ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => clearLogoutMutation.mutate(user.user_id)}
                            disabled={clearLogoutMutation.isPending}
                          >
                            Clear
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowLogoutDialog(true);
                            }}
                          >
                            <LogOut className="w-3 h-3 mr-1" />
                            Force Logout
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Force Logout Single User Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Force Logout User
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to force logout this user? They will be immediately signed out 
              and will need to log in again.
              <div className="mt-2 p-2 bg-secondary/30 rounded text-sm">
                <span className="font-medium">Role:</span> {selectedUser?.role}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedUser && forceLogoutMutation.mutate(selectedUser.user_id)}
              className="bg-red-500 hover:bg-red-600"
            >
              Force Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Force Logout All Dialog */}
      <AlertDialog open={showLogoutAllDialog} onOpenChange={setShowLogoutAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-400">
              <Zap className="w-5 h-5" />
              Emergency: Logout All Users
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-2">
                <p>This will immediately terminate ALL user sessions except Master Admin.</p>
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 font-medium">⚠️ This action cannot be undone!</p>
                  <p className="text-sm mt-1">All {totalUsers} users will be logged out instantly.</p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => forceLogoutAllMutation.mutate()}
              className="bg-red-500 hover:bg-red-600"
            >
              Logout All Users
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ForceLogoutManager;

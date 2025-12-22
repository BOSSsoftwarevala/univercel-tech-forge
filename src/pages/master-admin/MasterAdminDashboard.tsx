import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Users, 
  LogOut, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Crown,
  AlertTriangle,
  Power,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  approval_status: string;
  created_at: string;
  approved_at: string | null;
  approved_by: string | null;
  force_logged_out_at: string | null;
}

const MasterAdminDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, isMaster, forceLogoutUser } = useAuth();
  const [users, setUsers] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [forceLogoutAllLoading, setForceLogoutAllLoading] = useState(false);

  useEffect(() => {
    if (!isMaster) {
      navigate('/access-denied', { replace: true });
      return;
    }
    fetchUsers();
  }, [isMaster, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const viewerRole = 'master';
      const { data, error } = await supabase.rpc('get_users_for_approval', {
        viewer_role: viewerRole,
      });

      if (error) throw error;
      setUsers((data as any) || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    setActionLoading(userId);
    try {
      const { data, error } = await supabase.rpc('approve_user', {
        _target_user_id: userId,
        _approver_id: user?.id,
      });

      if (error) throw error;
      if (!data) throw new Error('Approval failed');

      toast.success('User approved successfully');
      fetchUsers();
    } catch (err) {
      console.error('Error approving user:', err);
      toast.error('Failed to approve user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId: string) => {
    setActionLoading(userId);
    try {
      const { data, error } = await supabase.rpc('reject_user', {
        _target_user_id: userId,
        _rejector_id: user?.id,
        _reason: null,
      });

      if (error) throw error;
      if (!data) throw new Error('Rejection failed');

      toast.success('User rejected');
      fetchUsers();
    } catch (err) {
      console.error('Error rejecting user:', err);
      toast.error('Failed to reject user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleForceLogout = async (userId: string) => {
    setActionLoading(userId);
    try {
      const { error } = await forceLogoutUser(userId);
      if (error) throw error;
      toast.success('User has been force logged out');
      fetchUsers();
    } catch (err) {
      console.error('Error force logging out user:', err);
      toast.error('Failed to force logout user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleForceLogoutAll = async () => {
    setForceLogoutAllLoading(true);
    try {
      const { data, error } = await supabase.rpc('force_logout_all_except_master', {
        admin_user_id: user?.id,
      });

      if (error) throw error;
      toast.success(`${data} user(s) have been force logged out`);
      fetchUsers();
    } catch (err) {
      console.error('Error force logging out all users:', err);
      toast.error('Failed to force logout all users');
    } finally {
      setForceLogoutAllLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth', { replace: true });
  };

  const pendingUsers = users.filter(u => u.approval_status === 'pending');
  const approvedUsers = users.filter(u => u.approval_status === 'approved');
  const rejectedUsers = users.filter(u => u.approval_status === 'rejected');
  const nonMasterUsers = users.filter(u => u.role !== 'master');

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'master': return 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white';
      case 'super_admin': return 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white';
      case 'developer': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'franchise': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'reseller': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const UserCard = ({ userRole, showActions = true }: { userRole: UserRole; showActions?: boolean }) => (
    <Card className="bg-card/50 border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              {userRole.role === 'master' ? (
                <Crown className="w-5 h-5 text-yellow-500" />
              ) : (
                <Users className="w-5 h-5 text-primary" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{userRole.user_id.slice(0, 8)}...</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getRoleBadgeColor(userRole.role)}>
                  {userRole.role.replace(/_/g, ' ')}
                </Badge>
                {userRole.force_logged_out_at && (
                  <Badge variant="destructive" className="text-xs">
                    Force Logged Out
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {showActions && userRole.role !== 'master' && (
            <div className="flex items-center gap-2">
              {userRole.approval_status === 'pending' && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                    onClick={() => handleApprove(userRole.user_id)}
                    disabled={actionLoading === userRole.user_id}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    onClick={() => handleReject(userRole.user_id)}
                    disabled={actionLoading === userRole.user_id}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </>
              )}
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={actionLoading === userRole.user_id}
                  >
                    <Power className="w-4 h-4 mr-1" />
                    Force Logout
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Force Logout User?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will immediately log out the user from all devices. They will need to log in again.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleForceLogout(userRole.user_id)}>
                      Force Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-yellow-500/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Master Admin Control Center</h1>
              <p className="text-muted-foreground">Complete system oversight and user management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={fetchUsers} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  disabled={forceLogoutAllLoading || nonMasterUsers.length === 0}
                >
                  <Power className="w-4 h-4 mr-2" />
                  Force Logout All ({nonMasterUsers.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Force Logout All Users?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will immediately log out all {nonMasterUsers.length} non-Master users from all devices. 
                    Master Admin accounts will NOT be affected.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleForceLogoutAll}>
                    Force Logout All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Button variant="outline" onClick={() => navigate('/super-admin')}>
              <Shield className="w-4 h-4 mr-2" />
              Super Admin Panel
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{users.length}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-amber-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{pendingUsers.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Approval</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{approvedUsers.length}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-red-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{rejectedUsers.length}</p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert for pending users */}
        {pendingUsers.length > 0 && (
          <Card className="bg-amber-500/10 border-amber-500/30">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              <div>
                <p className="font-medium text-foreground">{pendingUsers.length} user(s) awaiting approval</p>
                <p className="text-sm text-muted-foreground">Review and approve or reject pending accounts</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Management Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="w-4 h-4" />
              Pending ({pendingUsers.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Approved ({approvedUsers.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2">
              <XCircle className="w-4 h-4" />
              Rejected ({rejectedUsers.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="gap-2">
              <Users className="w-4 h-4" />
              All Users ({users.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Users waiting for access approval</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <p className="text-muted-foreground text-center py-8">Loading...</p>
                ) : pendingUsers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No pending approvals</p>
                ) : (
                  pendingUsers.map(u => <UserCard key={u.id} userRole={u} />)
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Approved Users</CardTitle>
                <CardDescription>Users with dashboard access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <p className="text-muted-foreground text-center py-8">Loading...</p>
                ) : approvedUsers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No approved users</p>
                ) : (
                  approvedUsers.map(u => <UserCard key={u.id} userRole={u} />)
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejected" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Rejected Users</CardTitle>
                <CardDescription>Users denied access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <p className="text-muted-foreground text-center py-8">Loading...</p>
                ) : rejectedUsers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No rejected users</p>
                ) : (
                  rejectedUsers.map(u => <UserCard key={u.id} userRole={u} showActions={false} />)
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Complete user list</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <p className="text-muted-foreground text-center py-8">Loading...</p>
                ) : users.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No users found</p>
                ) : (
                  users.map(u => <UserCard key={u.id} userRole={u} />)
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MasterAdminDashboard;

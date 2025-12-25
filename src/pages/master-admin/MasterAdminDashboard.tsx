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
  Power,
  RefreshCw,
  Activity,
  ChevronDown,
  LayoutDashboard,
  Megaphone,
  Monitor,
  UserCog,
  Settings,
  KeyRound,
  ArrowLeft,
  ClipboardList,
  Rocket,
  Bug,
  UserCheck,
  RotateCcw
} from 'lucide-react';
import TestPlanScreen from './screens/TestPlanScreen';
import DeployChecklistScreen from './screens/DeployChecklistScreen';
import BugFixExecutionScreen from './screens/BugFixExecutionScreen';
import RoleBugFixScreen from './screens/RoleBugFixScreen';
import RegressionTestScreen from './screens/RegressionTestScreen';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { LiveReportsDashboard } from '@/components/live-reports/LiveReportsDashboard';
import MasterWelcome from '@/components/animations/MasterWelcome';
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
    <div className="bg-[#1a1a2e] border border-gray-800/50 rounded-xl p-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
            {userRole.role === 'master' ? (
              <Crown className="w-5 h-5 text-amber-400" />
            ) : (
              <Users className="w-5 h-5 text-violet-400" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{userRole.user_id.slice(0, 8)}...</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getRoleBadgeColor(userRole.role)}>
                {userRole.role.replace(/_/g, ' ')}
              </Badge>
              {userRole.force_logged_out_at && (
                <Badge className="bg-red-500/20 text-red-400 border-0 text-xs">
                  Force Logged Out
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        {showActions && userRole.role !== 'master' && (
          <div className="flex items-center gap-2 flex-wrap">
            {userRole.approval_status === 'pending' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-green-500/50 text-green-400 hover:bg-green-500/10 bg-transparent"
                  onClick={() => handleApprove(userRole.user_id)}
                  disabled={actionLoading === userRole.user_id}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
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
                  className="bg-red-500 hover:bg-red-600 text-white border-0"
                  disabled={actionLoading === userRole.user_id}
                >
                  <Power className="w-4 h-4 mr-1" />
                  Force Logout
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#12121a] border-gray-800">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Force Logout User?</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    This will immediately log out the user from all devices. They will need to log in again.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleForceLogout(userRole.user_id)} className="bg-red-500 hover:bg-red-600">
                    Force Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header - Clean */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-white">Master Admin</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Module Switcher Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-[#1a1a2e] border-gray-800 text-gray-300 hover:bg-gray-800 gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Switch Module
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#12121a] border-gray-800 w-56">
                <DropdownMenuLabel className="text-gray-400">Admin Modules</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem onClick={() => navigate('/super-admin')} className="text-gray-300 hover:bg-gray-800 cursor-pointer">
                  <Shield className="w-4 h-4 mr-2" />
                  Super Admin
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/demo-manager')} className="text-gray-300 hover:bg-gray-800 cursor-pointer">
                  <Monitor className="w-4 h-4 mr-2" />
                  Demo Manager
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/leads')} className="text-gray-300 hover:bg-gray-800 cursor-pointer">
                  <Megaphone className="w-4 h-4 mr-2" />
                  Leads
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/developer-dashboard')} className="text-gray-300 hover:bg-gray-800 cursor-pointer">
                  <UserCog className="w-4 h-4 mr-2" />
                  Developer Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem onClick={() => navigate('/settings')} className="text-gray-300 hover:bg-gray-800 cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" onClick={fetchUsers} disabled={loading} size="sm" className="bg-[#1a1a2e] border-gray-800 text-gray-300 hover:bg-gray-800">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="sm"
                  disabled={forceLogoutAllLoading || nonMasterUsers.length === 0}
                  className="bg-red-500/80 hover:bg-red-600 border-0"
                >
                  <Power className="w-4 h-4 mr-1" />
                  Logout All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#12121a] border-gray-800">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Force Logout All Users?</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    This will immediately log out all {nonMasterUsers.length} non-Master users.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleForceLogoutAll} className="bg-red-500 hover:bg-red-600">
                    Force Logout All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')} className="bg-[#1a1a2e] border-gray-800 text-gray-300 hover:bg-gray-800">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/super-admin')} className="bg-[#1a1a2e] border-gray-800 text-gray-300 hover:bg-gray-800">
              <Shield className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/change-password')} className="bg-[#1a1a2e] border-gray-800 text-gray-300 hover:bg-gray-800">
              <KeyRound className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="bg-[#1a1a2e] border-gray-800 text-gray-300 hover:bg-gray-800">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Master Welcome Banner */}
        <MasterWelcome />

        {/* User Management Tabs */}
        <Tabs defaultValue="live-reports" className="w-full">
          <TabsList className="bg-[#1a1a2e] border border-gray-800 h-10">
            <TabsTrigger value="live-reports" className="gap-2">
              <Activity className="w-4 h-4" />
              Live Reports
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-2 data-[state=active]:bg-violet-500 data-[state=active]:text-white">
              <Clock className="w-4 h-4" />
              Pending ({pendingUsers.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <CheckCircle className="w-4 h-4" />
              Approved ({approvedUsers.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2 data-[state=active]:bg-red-500 data-[state=active]:text-white">
              <XCircle className="w-4 h-4" />
              Rejected ({rejectedUsers.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Users className="w-4 h-4" />
              All Users ({users.length})
            </TabsTrigger>
            <TabsTrigger value="test-plan" className="gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              <ClipboardList className="w-4 h-4" />
              Test Plan
            </TabsTrigger>
            <TabsTrigger value="deploy" className="gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <Rocket className="w-4 h-4" />
              Deploy
            </TabsTrigger>
            <TabsTrigger value="bug-fix" className="gap-2 data-[state=active]:bg-red-500 data-[state=active]:text-white">
              <Bug className="w-4 h-4" />
              Bug Fix
            </TabsTrigger>
            <TabsTrigger value="role-bugs" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <UserCheck className="w-4 h-4" />
              Role Bugs
            </TabsTrigger>
            <TabsTrigger value="regression" className="gap-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
              <RotateCcw className="w-4 h-4" />
              Regression
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live-reports" className="mt-4">
            <LiveReportsDashboard />
          </TabsContent>

          <TabsContent value="pending" className="mt-4">
            <Card className="bg-[#12121a] border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white">Pending Approvals</CardTitle>
                <CardDescription className="text-gray-400">Users waiting for access approval</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <p className="text-gray-400 text-center py-8">Loading...</p>
                ) : pendingUsers.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No pending approvals</p>
                ) : (
                  pendingUsers.map(u => <UserCard key={u.id} userRole={u} />)
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved" className="mt-4">
            <Card className="bg-[#12121a] border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white">Approved Users</CardTitle>
                <CardDescription className="text-gray-400">Users with dashboard access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <p className="text-gray-400 text-center py-8">Loading...</p>
                ) : approvedUsers.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No approved users</p>
                ) : (
                  approvedUsers.map(u => <UserCard key={u.id} userRole={u} />)
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejected" className="mt-4">
            <Card className="bg-[#12121a] border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white">Rejected Users</CardTitle>
                <CardDescription className="text-gray-400">Users denied access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <p className="text-gray-400 text-center py-8">Loading...</p>
                ) : rejectedUsers.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No rejected users</p>
                ) : (
                  rejectedUsers.map(u => <UserCard key={u.id} userRole={u} showActions={false} />)
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="mt-4">
            <Card className="bg-[#12121a] border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white">All Users</CardTitle>
                <CardDescription className="text-gray-400">Complete user list</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <p className="text-gray-400 text-center py-8">Loading...</p>
                ) : users.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No users found</p>
                ) : (
                  users.map(u => <UserCard key={u.id} userRole={u} />)
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test-plan" className="mt-4">
            <Card className="bg-[#12121a] border-gray-800/50">
              <CardContent className="p-6">
                <TestPlanScreen />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deploy" className="mt-4">
            <Card className="bg-[#12121a] border-gray-800/50">
              <CardContent className="p-6">
                <DeployChecklistScreen />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bug-fix" className="mt-4">
            <Card className="bg-[#12121a] border-gray-800/50">
              <CardContent className="p-6">
                <BugFixExecutionScreen />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="role-bugs" className="mt-4">
            <Card className="bg-[#12121a] border-gray-800/50">
              <CardContent className="p-6">
                <RoleBugFixScreen />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regression" className="mt-4">
            <Card className="bg-[#12121a] border-gray-800/50">
              <CardContent className="p-6">
                <RegressionTestScreen />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MasterAdminDashboard;

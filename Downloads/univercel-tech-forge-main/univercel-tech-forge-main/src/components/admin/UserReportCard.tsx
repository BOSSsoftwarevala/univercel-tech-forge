import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  User, 
  Calendar, 
  Wallet, 
  FolderKanban, 
  AlertTriangle, 
  LogOut,
  Activity,
  Globe,
  Smartphone,
  Copy,
  CheckCircle,
  Clock,
  Shield
} from "lucide-react";
import { format } from "date-fns";

interface UserReportCardProps {
  user: {
    id: string;
    email: string;
    full_name: string;
    role: string;
    approval_status: string;
    created_at: string;
    last_login?: string;
    is_online?: boolean;
  };
  stats?: {
    total_payouts: number;
    total_projects: number;
    total_issues: number;
    force_logout_count: number;
    copy_attempts: number;
    uptime_percentage: number;
  };
  activity?: Array<{
    id: string;
    action: string;
    timestamp: string;
    details?: string;
  }>;
  devices?: Array<{
    ip: string;
    device: string;
    last_used: string;
  }>;
  onForceLogout?: () => void;
  showForceLogout?: boolean;
}

export default function UserReportCard({
  user,
  stats,
  activity = [],
  devices = [],
  onForceLogout,
  showForceLogout = false
}: UserReportCardProps) {
  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      master: 'bg-red-500/20 text-red-400 border-red-500/30',
      super_admin: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      admin: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      demo_manager: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      developer: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      franchise: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      reseller: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
      client: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    };
    return colors[role] || colors.client;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              {user.is_online && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-card" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">{user.full_name}</CardTitle>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <Badge className={getRoleColor(user.role)}>
              {user.role.replace(/_/g, ' ')}
            </Badge>
            <Badge className={getStatusColor(user.approval_status)}>
              {user.approval_status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 rounded-lg bg-background/50">
            <Calendar className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Joined</p>
            <p className="text-sm font-medium">
              {format(new Date(user.created_at), 'MMM d, yyyy')}
            </p>
          </div>
          <div className="text-center p-2 rounded-lg bg-background/50">
            <Wallet className="w-4 h-4 mx-auto mb-1 text-green-400" />
            <p className="text-xs text-muted-foreground">Payouts</p>
            <p className="text-sm font-medium text-green-400">
              ₹{(stats?.total_payouts || 0).toLocaleString()}
            </p>
          </div>
          <div className="text-center p-2 rounded-lg bg-background/50">
            <FolderKanban className="w-4 h-4 mx-auto mb-1 text-blue-400" />
            <p className="text-xs text-muted-foreground">Projects</p>
            <p className="text-sm font-medium">{stats?.total_projects || 0}</p>
          </div>
        </div>

        <Separator />

        {/* Security Metrics */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security Metrics
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center justify-between p-2 rounded bg-background/30">
              <span className="text-muted-foreground flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Issues
              </span>
              <span className={stats?.total_issues ? 'text-yellow-400' : ''}>
                {stats?.total_issues || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-background/30">
              <span className="text-muted-foreground flex items-center gap-1">
                <LogOut className="w-3 h-3" /> Force Logouts
              </span>
              <span className={stats?.force_logout_count ? 'text-red-400' : ''}>
                {stats?.force_logout_count || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-background/30">
              <span className="text-muted-foreground flex items-center gap-1">
                <Copy className="w-3 h-3" /> Copy Attempts
              </span>
              <span className={stats?.copy_attempts ? 'text-orange-400' : ''}>
                {stats?.copy_attempts || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-background/30">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> Uptime
              </span>
              <span className="text-green-400">
                {stats?.uptime_percentage || 100}%
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Devices */}
        {devices.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Recent Devices
            </h4>
            <div className="space-y-1">
              {devices.slice(0, 3).map((device, i) => (
                <div key={i} className="flex items-center justify-between text-xs p-2 rounded bg-background/30">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3 h-3 text-muted-foreground" />
                    <span className="font-mono">{device.ip}</span>
                  </div>
                  <span className="text-muted-foreground truncate max-w-[120px]">
                    {device.device}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Activity Timeline */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Recent Activity
          </h4>
          <ScrollArea className="h-[120px]">
            <div className="space-y-2">
              {activity.length > 0 ? (
                activity.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-start gap-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                    <div>
                      <p className="text-foreground">{item.action}</p>
                      <p className="text-muted-foreground">
                        {format(new Date(item.timestamp), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No recent activity</p>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Force Logout Button (Master only) */}
        {showForceLogout && onForceLogout && user.role !== 'master' && (
          <>
            <Separator />
            <Button 
              variant="destructive" 
              size="sm" 
              className="w-full"
              onClick={onForceLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Force Logout User
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

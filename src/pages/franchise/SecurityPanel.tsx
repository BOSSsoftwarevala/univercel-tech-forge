import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Monitor, Smartphone, MapPin, Clock, AlertTriangle,
  CheckCircle, Lock, Eye, EyeOff, Key, LogOut, History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

interface DeviceSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

interface SecurityLog {
  id: string;
  action: string;
  ip: string;
  location: string;
  timestamp: string;
  status: 'success' | 'warning' | 'blocked';
}

const FranchiseSecurityPanel = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [ipLockEnabled, setIpLockEnabled] = useState(true);
  const [deviceLockEnabled, setDeviceLockEnabled] = useState(true);

  const deviceSessions: DeviceSession[] = [
    { id: '1', device: 'Windows PC', browser: 'Chrome 120', ip: '103.42.***.*', location: 'Mumbai, India', lastActive: 'Now', isCurrent: true },
    { id: '2', device: 'iPhone 15', browser: 'Safari', ip: '103.42.***.*', location: 'Mumbai, India', lastActive: '2 hours ago', isCurrent: false },
    { id: '3', device: 'MacBook Pro', browser: 'Firefox', ip: '182.73.***.*', location: 'Pune, India', lastActive: '1 day ago', isCurrent: false },
  ];

  const securityLogs: SecurityLog[] = [
    { id: '1', action: 'Login successful', ip: '103.42.***.*', location: 'Mumbai', timestamp: '10:30 AM Today', status: 'success' },
    { id: '2', action: 'Password changed', ip: '103.42.***.*', location: 'Mumbai', timestamp: '9:15 AM Today', status: 'success' },
    { id: '3', action: 'New device detected', ip: '182.73.***.*', location: 'Pune', timestamp: 'Yesterday 4:22 PM', status: 'warning' },
    { id: '4', action: 'Login attempt blocked', ip: '45.67.***.*', location: 'Unknown', timestamp: 'Yesterday 2:10 PM', status: 'blocked' },
    { id: '5', action: '2FA verification', ip: '103.42.***.*', location: 'Mumbai', timestamp: '2 days ago', status: 'success' },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'success': return { color: 'text-emerald-400 bg-emerald-500/20', icon: CheckCircle };
      case 'warning': return { color: 'text-amber-400 bg-amber-500/20', icon: AlertTriangle };
      case 'blocked': return { color: 'text-red-400 bg-red-500/20', icon: Lock };
      default: return { color: 'text-slate-400 bg-slate-500/20', icon: Clock };
    }
  };

  const handleLogoutDevice = (deviceId: string) => {
    toast.success('Device session terminated');
  };

  const handleLogoutAll = () => {
    toast.success('All other sessions terminated');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Security Panel</h1>
          <p className="text-slate-400">Manage your account security and device access</p>
        </div>
        <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 gap-2" onClick={handleLogoutAll}>
          <LogOut className="w-4 h-4" />
          Logout All Devices
        </Button>
      </div>

      {/* Security Status */}
      <Alert className="bg-emerald-500/10 border-emerald-500/30">
        <Shield className="w-4 h-4 text-emerald-400" />
        <AlertDescription className="text-slate-300">
          <strong className="text-emerald-400">Security Status: Protected</strong> — Your account has enhanced security enabled with IP lock and device binding.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Security Settings */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Lock className="w-5 h-5 text-indigo-400" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <Key className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Two-Factor Auth</p>
                  <p className="text-xs text-slate-400">Extra security layer</p>
                </div>
              </div>
              <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-white">IP Lock</p>
                  <p className="text-xs text-slate-400">Restrict to known IPs</p>
                </div>
              </div>
              <Switch checked={ipLockEnabled} onCheckedChange={setIpLockEnabled} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Device Binding</p>
                  <p className="text-xs text-slate-400">Single device access</p>
                </div>
              </div>
              <Switch checked={deviceLockEnabled} onCheckedChange={setDeviceLockEnabled} />
            </div>

            <div className="pt-4 border-t border-slate-700/50 space-y-2">
              <Button variant="outline" className="w-full border-slate-600 text-white hover:bg-slate-700">
                Change Password
              </Button>
              <Button variant="outline" className="w-full border-slate-600 text-white hover:bg-slate-700">
                View Recovery Codes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Monitor className="w-5 h-5 text-indigo-400" />
              Active Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {deviceSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${
                  session.isCurrent 
                    ? 'bg-emerald-500/10 border-emerald-500/30' 
                    : 'bg-slate-900/50 border-slate-700/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      session.isCurrent ? 'bg-emerald-500/20' : 'bg-slate-700/50'
                    }`}>
                      {session.device.includes('iPhone') || session.device.includes('Phone') 
                        ? <Smartphone className={`w-6 h-6 ${session.isCurrent ? 'text-emerald-400' : 'text-slate-400'}`} />
                        : <Monitor className={`w-6 h-6 ${session.isCurrent ? 'text-emerald-400' : 'text-slate-400'}`} />
                      }
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">{session.device}</p>
                        {session.isCurrent && (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-400">{session.browser}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {session.location}
                        </span>
                        <span>IP: {session.ip}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 mb-2">{session.lastActive}</p>
                    {!session.isCurrent && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={() => handleLogoutDevice(session.id)}
                      >
                        <LogOut className="w-3 h-3 mr-1" />
                        End
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Security Activity Log */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <History className="w-5 h-5 text-indigo-400" />
            Security Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityLogs.map((log, index) => {
              const statusConfig = getStatusConfig(log.status);
              const StatusIcon = statusConfig.icon;
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${statusConfig.color}`}>
                      <StatusIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">{log.action}</p>
                      <p className="text-xs text-slate-400">IP: {log.ip} • {log.location}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">{log.timestamp}</span>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FranchiseSecurityPanel;

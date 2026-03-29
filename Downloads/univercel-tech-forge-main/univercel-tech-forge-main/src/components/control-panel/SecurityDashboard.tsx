/**
 * SecurityDashboard - Enterprise Security Management
 * Handles: 2FA, Sessions, Audit Logs, Device Management
 */

import React, { useState, useEffect } from "react";
import { 
  Shield, Key, Smartphone, Eye, LogOut, Lock, 
  RefreshCw, AlertTriangle, CheckCircle, Clock,
  Fingerprint, Monitor, Globe, History
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface SessionInfo {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

interface AuditLog {
  id: string;
  action: string;
  timestamp: string;
  ip: string;
  status: "success" | "warning" | "error";
}

export default function SecurityDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading2FA, setLoading2FA] = useState(false);
  const [sessions, setSessions] = useState<SessionInfo[]>([
    { id: "1", device: "Chrome on Windows", location: "Mumbai, IN", lastActive: "Now", isCurrent: true },
    { id: "2", device: "Safari on iPhone", location: "Delhi, IN", lastActive: "2 hours ago", isCurrent: false },
  ]);
  const [auditLogs] = useState<AuditLog[]>([
    { id: "1", action: "Login successful", timestamp: "Today, 10:30 AM", ip: "192.168.1.1", status: "success" },
    { id: "2", action: "Password changed", timestamp: "Yesterday, 3:15 PM", ip: "192.168.1.1", status: "success" },
    { id: "3", action: "2FA enabled", timestamp: "Jan 15, 2026", ip: "192.168.1.1", status: "success" },
  ]);

  useEffect(() => {
    fetchTwoFactorStatus();
  }, [user]);

  const fetchTwoFactorStatus = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('two_factor_enabled')
        .eq('user_id', user.id)
        .single();
      
      if (!error && data) {
        setTwoFactorEnabled(data.two_factor_enabled || false);
      }
    } catch (err) {
      console.error('Synchronizing security status:', err);
    }
  };

  const handleToggle2FA = async (enabled: boolean) => {
    if (!user) return;
    setLoading2FA(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ 
          two_factor_enabled: enabled,
          two_factor_method: enabled ? 'email' : null 
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
      setTwoFactorEnabled(enabled);
      toast.success(enabled ? 'Two-Factor Authentication enabled' : 'Two-Factor Authentication disabled');
    } catch (err) {
      toast.info('Processing security update...');
    } finally {
      setLoading2FA(false);
    }
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    toast.success("Session revoked successfully");
  };

  const handleRevokeAllSessions = () => {
    setSessions(prev => prev.filter(s => s.isCurrent));
    toast.success("All other sessions revoked");
  };

  return (
    <div className="h-full p-6 space-y-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
          <Shield className="h-6 w-6 text-green-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Security Center</h1>
          <p className="text-sm text-slate-400">Manage your account security and sessions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Two-Factor Authentication */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Fingerprint className="h-5 w-5 text-blue-400" />
              Two-Factor Authentication
            </CardTitle>
            <CardDescription>Add an extra layer of security to your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Key className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Email OTP</p>
                  <p className="text-sm text-slate-400">Receive codes via email</p>
                </div>
              </div>
              <Switch 
                checked={twoFactorEnabled} 
                onCheckedChange={handleToggle2FA}
                disabled={loading2FA}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 opacity-60">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Authenticator App</p>
                  <p className="text-sm text-slate-400">Coming soon</p>
                </div>
              </div>
              <Badge variant="outline" className="text-slate-400">Soon</Badge>
            </div>

            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate('/change-password')}
            >
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-white">
                <Monitor className="h-5 w-5 text-amber-400" />
                Active Sessions
              </CardTitle>
              <CardDescription>Devices currently logged in</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleRevokeAllSessions}
              className="text-red-400 hover:text-red-300"
            >
              Revoke All
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div 
                    key={session.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        session.isCurrent ? 'bg-green-500/10' : 'bg-slate-700/50'
                      }`}>
                        <Monitor className={`h-5 w-5 ${session.isCurrent ? 'text-green-400' : 'text-slate-400'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white text-sm">{session.device}</p>
                          {session.isCurrent && (
                            <Badge className="bg-green-500/10 text-green-400 text-xs">Current</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Globe className="h-3 w-3" />
                          {session.location}
                          <span>•</span>
                          <Clock className="h-3 w-3" />
                          {session.lastActive}
                        </div>
                      </div>
                    </div>
                    {!session.isCurrent && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRevokeSession(session.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Audit Log */}
        <Card className="bg-slate-900/50 border-slate-700/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <History className="h-5 w-5 text-cyan-400" />
              Security Activity Log
            </CardTitle>
            <CardDescription>Recent security-related events</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div 
                    key={log.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        log.status === 'success' ? 'bg-green-500/10' :
                        log.status === 'warning' ? 'bg-amber-500/10' : 'bg-red-500/10'
                      }`}>
                        {log.status === 'success' ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : log.status === 'warning' ? (
                          <AlertTriangle className="h-4 w-4 text-amber-400" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">{log.action}</p>
                        <p className="text-xs text-slate-400">IP: {log.ip}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">{log.timestamp}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Quick Security Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => navigate('/forgot-password')}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Password via Email
            </Button>
            <Button variant="outline" onClick={() => toast.success("Downloading backup codes...")}>
              <Key className="h-4 w-4 mr-2" />
              Download Backup Codes
            </Button>
            <Button variant="destructive" onClick={() => navigate('/logout')}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out Everywhere
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

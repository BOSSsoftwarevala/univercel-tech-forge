import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { 
  Shield, Lock, Mail, Phone, Key, CheckCircle, XCircle, 
  Clock, AlertTriangle, History, Settings
} from "lucide-react";

export function TwoFactorSettings() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['2fa-settings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_2fa_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // If no settings exist, create default
      if (error?.code === 'PGRST116') {
        const { data: newSettings, error: createError } = await supabase
          .from('user_2fa_settings')
          .insert([{ user_id: user.id }])
          .select()
          .single();
        
        if (createError) throw createError;
        return newSettings;
      }

      if (error) throw error;
      return data;
    }
  });

  const { data: actionLogs } = useQuery({
    queryKey: ['verified-action-logs'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('verified_action_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    }
  });

  const { data: pendingActions } = useQuery({
    queryKey: ['pending-actions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('action_approval_queue')
        .select('*')
        .eq('user_id', user.id)
        .in('approval_status', ['pending', 'otp_pending'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const updateSettings = useMutation({
    mutationFn: async (updates: Partial<typeof settings>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_2fa_settings')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['2fa-settings'] });
      toast.success('Settings updated');
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    }
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Two-Factor Authentication
          </h2>
          <p className="text-muted-foreground">
            Secure your account with OTP verification for critical actions
          </p>
        </div>
        <Badge variant={settings?.is_2fa_enabled ? "default" : "secondary"}>
          {settings?.is_2fa_enabled ? "Enabled" : "Disabled"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-medium">2FA Status</span>
              </div>
              <Switch
                checked={settings?.is_2fa_enabled || false}
                onCheckedChange={(checked) => updateSettings.mutate({ is_2fa_enabled: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">OTP for Actions</span>
              </div>
              <Switch
                checked={settings?.require_otp_for_actions || false}
                onCheckedChange={(checked) => updateSettings.mutate({ require_otp_for_actions: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-blue-500" />
                <span className="font-medium">OTP for Login</span>
              </div>
              <Switch
                checked={settings?.require_otp_for_login || false}
                onCheckedChange={(checked) => updateSettings.mutate({ require_otp_for_login: checked })}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Verification Method</CardTitle>
          <CardDescription>Choose how you receive OTP codes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                settings?.preferred_method === 'email' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => updateSettings.mutate({ preferred_method: 'email' })}
            >
              <div className="flex items-center gap-3">
                <Mail className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-xs text-muted-foreground">Receive codes via email</p>
                </div>
              </div>
              {settings?.preferred_method === 'email' && (
                <Badge className="mt-2">Active</Badge>
              )}
            </div>

            <div 
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                settings?.preferred_method === 'sms' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => {
                if (!settings?.phone_verified) {
                  toast.error('Please verify your phone number first');
                  return;
                }
                updateSettings.mutate({ preferred_method: 'sms' });
              }}
            >
              <div className="flex items-center gap-3">
                <Phone className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-medium">SMS</p>
                  <p className="text-xs text-muted-foreground">Receive codes via SMS</p>
                </div>
              </div>
              {!settings?.phone_verified && (
                <Badge variant="secondary" className="mt-2">Not Verified</Badge>
              )}
            </div>

            <div 
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                settings?.preferred_method === 'authenticator' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => {
                if (!settings?.authenticator_verified) {
                  toast.error('Please set up authenticator app first');
                  return;
                }
                updateSettings.mutate({ preferred_method: 'authenticator' });
              }}
            >
              <div className="flex items-center gap-3">
                <Key className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="font-medium">Authenticator</p>
                  <p className="text-xs text-muted-foreground">Use authenticator app</p>
                </div>
              </div>
              {!settings?.authenticator_verified && (
                <Badge variant="secondary" className="mt-2">Not Set Up</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Actions ({pendingActions?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="history">Action History</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardContent className="pt-4">
              <ScrollArea className="h-[300px]">
                {pendingActions && pendingActions.length > 0 ? (
                  <div className="space-y-2">
                    {pendingActions.map(action => (
                      <div key={action.id} className="p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{action.action_type}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(action.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{action.action_target}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {action.otp_verified ? (
                            <Badge variant="default" className="gap-1">
                              <CheckCircle className="h-3 w-3" />
                              OTP Verified
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="gap-1">
                              <Clock className="h-3 w-3" />
                              Awaiting OTP
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No pending actions</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="pt-4">
              <ScrollArea className="h-[300px]">
                {actionLogs && actionLogs.length > 0 ? (
                  <div className="space-y-2">
                    {actionLogs.map(log => (
                      <div key={log.id} className="p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {log.success ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <Badge variant="outline">{log.action_type}</Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{log.action_target}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Verified via: {log.verification_method || 'OTP'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No action history</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-yellow-500/30 bg-yellow-500/5">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <p className="font-medium">Security Notice</p>
              <p className="text-sm text-muted-foreground">
                With 2FA enabled, all critical actions (add, edit, delete, financial operations, AI actions) 
                require OTP verification. This protects you and creates an audit trail for all changes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

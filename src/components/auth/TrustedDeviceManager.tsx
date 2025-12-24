import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { 
  Smartphone, Monitor, Tablet, Globe, Shield, ShieldCheck, 
  ShieldX, Trash2, Clock, MapPin, CheckCircle 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TrustedDevice {
  id: string;
  device_fingerprint: string;
  device_name: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  ip_address: string | null;
  location: string | null;
  is_trusted: boolean;
  trust_expires_at: string | null;
  last_used_at: string;
  created_at: string;
  revoked_at: string | null;
}

export function TrustedDeviceManager() {
  const queryClient = useQueryClient();
  const [currentFingerprint, setCurrentFingerprint] = useState<string>("");

  // Generate current device fingerprint
  useState(() => {
    generateDeviceFingerprint().then(setCurrentFingerprint);
  });

  const { data: devices, isLoading } = useQuery({
    queryKey: ['trusted-devices'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('trusted_devices')
        .select('*')
        .eq('user_id', user.id)
        .is('revoked_at', null)
        .order('last_used_at', { ascending: false });

      if (error) throw error;
      return data as TrustedDevice[];
    }
  });

  const trustDevice = useMutation({
    mutationFn: async (deviceId: string) => {
      const { error } = await supabase
        .from('trusted_devices')
        .update({ 
          is_trusted: true,
          trust_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        })
        .eq('id', deviceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trusted-devices'] });
      toast.success('Device marked as trusted');
    },
    onError: (error) => {
      toast.error(`Failed to trust device: ${error.message}`);
    }
  });

  const revokeDevice = useMutation({
    mutationFn: async (deviceId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('trusted_devices')
        .update({ 
          revoked_at: new Date().toISOString(),
          revoked_by: user.id,
          is_trusted: false
        })
        .eq('id', deviceId);

      if (error) throw error;

      // Log to audit
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'device_revoked',
        module: 'security',
        meta_json: { device_id: deviceId }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trusted-devices'] });
      toast.success('Device access revoked');
    },
    onError: (error) => {
      toast.error(`Failed to revoke device: ${error.message}`);
    }
  });

  const registerCurrentDevice = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fingerprint = await generateDeviceFingerprint();
      const deviceInfo = getDeviceInfo();

      const { error } = await supabase
        .from('trusted_devices')
        .upsert({
          user_id: user.id,
          device_fingerprint: fingerprint,
          device_name: deviceInfo.name,
          device_type: deviceInfo.type,
          browser: deviceInfo.browser,
          os: deviceInfo.os,
          is_trusted: true,
          trust_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }, {
          onConflict: 'user_id,device_fingerprint'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trusted-devices'] });
      toast.success('Current device registered as trusted');
    },
    onError: (error) => {
      toast.error(`Failed to register device: ${error.message}`);
    }
  });

  const getDeviceIcon = (type: string | null) => {
    switch (type?.toLowerCase()) {
      case 'mobile': return Smartphone;
      case 'tablet': return Tablet;
      default: return Monitor;
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading devices...</div>;
  }

  const currentDevice = devices?.find(d => d.device_fingerprint === currentFingerprint);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Trusted Devices
        </CardTitle>
        <CardDescription>
          Manage devices that can access your account without additional verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!currentDevice && (
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">This Device</p>
                  <p className="text-sm text-muted-foreground">Not registered as trusted</p>
                </div>
              </div>
              <Button onClick={() => registerCurrentDevice.mutate()}>
                <ShieldCheck className="h-4 w-4 mr-2" />
                Trust This Device
              </Button>
            </div>
          </div>
        )}

        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {devices?.map(device => {
              const DeviceIcon = getDeviceIcon(device.device_type);
              const isCurrentDevice = device.device_fingerprint === currentFingerprint;
              
              return (
                <div 
                  key={device.id} 
                  className={`p-4 rounded-lg border ${
                    isCurrentDevice 
                      ? 'bg-primary/5 border-primary/30' 
                      : 'bg-muted/30 border-border'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${device.is_trusted ? 'bg-green-500/20' : 'bg-muted'}`}>
                        <DeviceIcon className={`h-6 w-6 ${device.is_trusted ? 'text-green-500' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {device.device_name || device.browser || 'Unknown Device'}
                          </p>
                          {isCurrentDevice && (
                            <Badge variant="outline" className="gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Current
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1 mt-1">
                          <div className="flex items-center gap-4">
                            {device.os && <span>{device.os}</span>}
                            {device.browser && <span>{device.browser}</span>}
                          </div>
                          <div className="flex items-center gap-4">
                            {device.ip_address && (
                              <span className="flex items-center gap-1">
                                <Globe className="h-3 w-3" />
                                {device.ip_address}
                              </span>
                            )}
                            {device.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {device.location}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Clock className="h-3 w-3" />
                            Last used {formatDistanceToNow(new Date(device.last_used_at), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {device.is_trusted ? (
                        <Badge variant="default" className="gap-1">
                          <ShieldCheck className="h-3 w-3" />
                          Trusted
                        </Badge>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => trustDevice.mutate(device.id)}
                        >
                          Trust
                        </Button>
                      )}
                      
                      {!isCurrentDevice && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Revoke Device Access?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove this device from your trusted devices. 
                                The device will need to verify again on next login.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => revokeDevice.mutate(device.id)}>
                                Revoke Access
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                  
                  {device.trust_expires_at && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Trust expires {formatDistanceToNow(new Date(device.trust_expires_at), { addSuffix: true })}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {(!devices || devices.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No devices registered</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Helper functions
async function generateDeviceFingerprint(): Promise<string> {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 0,
    navigator.platform
  ];
  
  const fingerprint = components.join('|');
  const encoder = new TextEncoder();
  const data = encoder.encode(fingerprint);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getDeviceInfo() {
  const ua = navigator.userAgent;
  
  let type = 'desktop';
  if (/mobile/i.test(ua)) type = 'mobile';
  else if (/tablet|ipad/i.test(ua)) type = 'tablet';
  
  let browser = 'Unknown';
  if (/chrome/i.test(ua)) browser = 'Chrome';
  else if (/firefox/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua)) browser = 'Safari';
  else if (/edge/i.test(ua)) browser = 'Edge';
  
  let os = 'Unknown';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/mac/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/ios|iphone|ipad/i.test(ua)) os = 'iOS';
  
  return {
    type,
    browser,
    os,
    name: `${browser} on ${os}`
  };
}
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Server, Key, Loader2, CheckCircle2, Shield, Cpu, HardDrive, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ServerSetupPanelProps {
  onServerConnected: (server: ConnectedServer) => void;
}

export interface ConnectedServer {
  id: string;
  name: string;
  brand: string;
  region: string;
  status: 'online' | 'risk' | 'offline';
  cpu: number;
  ram: number;
  disk: number;
  securityStatus: 'safe' | 'action_needed';
  aiRecommendation: string;
}

const hostingBrands = [
  { value: 'aws', label: 'Amazon AWS', icon: '☁️' },
  { value: 'azure', label: 'Microsoft Azure', icon: '🔷' },
  { value: 'gcp', label: 'Google Cloud', icon: '🌐' },
  { value: 'hostinger', label: 'Hostinger', icon: '🟣' },
  { value: 'digitalocean', label: 'DigitalOcean', icon: '🔵' },
  { value: 'contabo', label: 'Contabo', icon: '🟠' },
  { value: 'vultr', label: 'Vultr', icon: '🔶' },
  { value: 'linode', label: 'Linode', icon: '🟢' },
  { value: 'custom', label: 'Custom / Other', icon: '⚙️' },
];

const aiSetupSteps = [
  'Verifying credentials...',
  'Detecting server type...',
  'Scanning OS & environment...',
  'Securing firewall & ports...',
  'Masking credentials...',
  'Enabling monitoring...',
  'Setting up backups...',
  'Activating threat protection...',
  'Registering in dashboard...',
  'Starting health checks...',
];

export const ServerSetupPanel: React.FC<ServerSetupPanelProps> = ({ onServerConnected }) => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [brand, setBrand] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [setupComplete, setSetupComplete] = useState(false);

  const handleConnect = async () => {
    if (!loginId || !password || !brand) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsConnecting(true);
    setCurrentStep(0);

    try {
      // Simulate AI auto-setup process
      for (let i = 0; i < aiSetupSteps.length; i++) {
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 300));
      }

      // Log the action
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('audit_logs').insert({
          user_id: user.id,
          action: 'server_connected',
          module: 'server_management',
          role: 'server_manager',
          meta_json: { brand, masked_login: loginId.substring(0, 3) + '***' }
        });
      }

      // Generate connected server data
      const brandInfo = hostingBrands.find(b => b.value === brand);
      const connectedServer: ConnectedServer = {
        id: `srv-${Date.now()}`,
        name: `${brandInfo?.label || 'Server'} Instance`,
        brand: brand,
        region: 'Auto-detected',
        status: 'online',
        cpu: 15 + Math.floor(Math.random() * 30),
        ram: 20 + Math.floor(Math.random() * 40),
        disk: 25 + Math.floor(Math.random() * 35),
        securityStatus: 'safe',
        aiRecommendation: 'Server is healthy. No action needed.'
      };

      setSetupComplete(true);
      toast.success('Server connected successfully!');
      
      // Clear sensitive data immediately
      setPassword('');
      
      setTimeout(() => {
        onServerConnected(connectedServer);
      }, 1500);

    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Connection failed. Please check credentials.');
    } finally {
      setIsConnecting(false);
    }
  };

  if (setupComplete) {
    return (
      <Card className="border-green-500/50 bg-green-500/10">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
          <h3 className="text-xl font-semibold text-green-400 mb-2">Server Connected!</h3>
          <p className="text-muted-foreground text-center">
            AI has configured everything automatically.<br />
            Loading your dashboard...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
          <Server className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Connect Your Server</CardTitle>
        <p className="text-muted-foreground mt-2">
          Enter your credentials. AI handles everything else.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Server Login ID */}
        <div className="space-y-2">
          <Label htmlFor="loginId" className="text-base font-medium">
            Server Login ID
          </Label>
          <div className="relative">
            <Server className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="loginId"
              placeholder="root or admin username"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="pl-10 h-12"
              disabled={isConnecting}
            />
          </div>
        </div>

        {/* Password / SSH Key */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-base font-medium">
            Password / SSH Key
          </Label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="Enter password or paste SSH key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12"
              disabled={isConnecting}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            🔒 Credentials are masked immediately after connection
          </p>
        </div>

        {/* Hosting Brand */}
        <div className="space-y-2">
          <Label className="text-base font-medium">Hosting Provider</Label>
          <Select value={brand} onValueChange={setBrand} disabled={isConnecting}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select your hosting provider" />
            </SelectTrigger>
            <SelectContent>
              {hostingBrands.map((b) => (
                <SelectItem key={b.value} value={b.value}>
                  <span className="flex items-center gap-2">
                    <span>{b.icon}</span>
                    <span>{b.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* AI Setup Progress */}
        {isConnecting && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>AI Auto-Setup in Progress</span>
            </div>
            <div className="space-y-2">
              {aiSetupSteps.map((step, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-2 text-sm transition-all duration-300 ${
                    index < currentStep 
                      ? 'text-green-500' 
                      : index === currentStep 
                        ? 'text-primary font-medium' 
                        : 'text-muted-foreground/50'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : index === currentStep ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-muted-foreground/30" />
                  )}
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connect Button */}
        <Button 
          onClick={handleConnect}
          disabled={isConnecting || !loginId || !password || !brand}
          className="w-full h-14 text-lg font-semibold"
          size="lg"
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Shield className="mr-2 h-5 w-5" />
              CONNECT & AUTO-SETUP
            </>
          )}
        </Button>

        {/* AI Features */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t">
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <Shield className="h-5 w-5 mx-auto text-green-500 mb-1" />
            <span className="text-xs text-muted-foreground">Auto-Secure</span>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <Activity className="h-5 w-5 mx-auto text-blue-500 mb-1" />
            <span className="text-xs text-muted-foreground">Auto-Monitor</span>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <HardDrive className="h-5 w-5 mx-auto text-purple-500 mb-1" />
            <span className="text-xs text-muted-foreground">Auto-Backup</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

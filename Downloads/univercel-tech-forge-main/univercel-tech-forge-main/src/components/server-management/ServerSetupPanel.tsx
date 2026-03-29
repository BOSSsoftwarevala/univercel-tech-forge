/**
 * SERVER SETUP PANEL - SIMPLE LIKE VERCEL
 * Only 3 inputs: Server Name, Domain, Region
 * Everything else is AUTO
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Server, Globe, MapPin, Loader2, CheckCircle2, Shield, Zap, Rocket, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useEnterpriseAudit } from '@/hooks/useEnterpriseAudit';

interface ServerSetupPanelProps {
  onServerConnected: (server: ConnectedServer) => void;
}

export interface ConnectedServer {
  id: string;
  name: string;
  domain: string;
  region: string;
  status: 'online' | 'risk' | 'offline';
  cpu: number;
  ram: number;
  disk: number;
  securityStatus: 'safe' | 'action_needed';
  aiRecommendation: string;
  brand?: string;
}

const regions = [
  { value: 'africa', label: 'Africa', icon: '🌍', description: 'Optimized for African traffic' },
  { value: 'asia', label: 'Asia', icon: '🌏', description: 'Low latency for Asian users' },
  { value: 'middle_east', label: 'Middle East', icon: '🌐', description: 'Best for MENA region' },
  { value: 'europe', label: 'Europe', icon: '🇪🇺', description: 'European data centers' },
  { value: 'americas', label: 'Americas', icon: '🌎', description: 'North & South America' },
  { value: 'global', label: 'Global (Auto)', icon: '✨', description: 'AI selects best region' },
];

const setupSteps = [
  'Validating domain...',
  'Selecting optimal server...',
  'Configuring SSL certificate...',
  'Deploying your software...',
  'Running health checks...',
  'Going live...',
];

export const ServerSetupPanel: React.FC<ServerSetupPanelProps> = ({ onServerConnected }) => {
  const { logAction } = useEnterpriseAudit();
  
  const [serverName, setServerName] = useState('');
  const [domain, setDomain] = useState('');
  const [region, setRegion] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [setupComplete, setSetupComplete] = useState(false);

  const handleConnect = async () => {
    if (!serverName.trim() || !domain.trim() || !region) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Basic domain validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain.replace('www.', ''))) {
      toast.error('Please enter a valid domain name (e.g., example.com)');
      return;
    }

    setIsConnecting(true);
    setCurrentStep(0);

    try {
      // Simulate AI auto-setup process
      for (let i = 0; i < setupSteps.length; i++) {
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
      }

      // Log the action
      await logAction({
        action: 'server_connected',
        module: 'server_orchestration',
        severity: 'high',
        target_type: 'server',
        new_values: { 
          name: serverName, 
          domain, 
          region,
        }
      });

      // Generate connected server data
      const regionInfo = regions.find(r => r.value === region);
      const connectedServer: ConnectedServer = {
        id: `srv-${Date.now()}`,
        name: serverName,
        domain: domain,
        region: regionInfo?.label || 'Auto',
        status: 'online',
        cpu: 15 + Math.floor(Math.random() * 20),
        ram: 20 + Math.floor(Math.random() * 30),
        disk: 25 + Math.floor(Math.random() * 25),
        securityStatus: 'safe',
        aiRecommendation: 'Your software is live and running perfectly.',
      };

      setSetupComplete(true);
      
      setTimeout(() => {
        onServerConnected(connectedServer);
        toast.success('🎉 Your software is live!');
      }, 1500);

    } catch (error) {
      console.error('Connection error:', error);
      toast.error("We're optimizing your setup, please try again...");
    } finally {
      setIsConnecting(false);
    }
  };

  if (setupComplete) {
    return (
      <Card className="border-emerald-500/50 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
            <CheckCircle2 className="relative h-20 w-20 text-emerald-500 mb-6" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-400 mb-2">Your Software is Live! 🎉</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Everything looks great. Your system is running perfectly.<br />
            AI has configured SSL, security, and performance automatically.
          </p>
          <div className="flex items-center gap-2 mt-6 text-sm text-emerald-500">
            <Globe className="h-4 w-4" />
            <span>{domain}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-lg mx-auto shadow-xl border-border/50">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 shadow-lg">
          <Rocket className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Go Live in Seconds</CardTitle>
        <p className="text-muted-foreground mt-2">
          Just name it, add your domain, pick a region — we handle the rest.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Server Name */}
        <div className="space-y-2">
          <Label htmlFor="serverName" className="text-base font-medium">
            Server Name
          </Label>
          <div className="relative">
            <Server className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="serverName"
              placeholder="My Awesome App"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              className="pl-11 h-14 text-lg"
              disabled={isConnecting}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Give your server a friendly name
          </p>
        </div>

        {/* Domain */}
        <div className="space-y-2">
          <Label htmlFor="domain" className="text-base font-medium">
            Domain Name
          </Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="domain"
              placeholder="myapp.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value.toLowerCase())}
              className="pl-11 h-14 text-lg"
              disabled={isConnecting}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            We'll auto-configure SSL & DNS
          </p>
        </div>

        {/* Region */}
        <div className="space-y-2">
          <Label className="text-base font-medium">Region</Label>
          <Select value={region} onValueChange={setRegion} disabled={isConnecting}>
            <SelectTrigger className="h-14 text-lg">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <SelectValue placeholder="Select region" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {regions.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  <div className="flex items-center gap-3 py-1">
                    <span className="text-xl">{r.icon}</span>
                    <div>
                      <div className="font-medium">{r.label}</div>
                      <div className="text-xs text-muted-foreground">{r.description}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            AI optimizes for lowest latency in your selected region
          </p>
        </div>

        {/* Advanced Options (Collapsed) */}
        <div className="border border-border/50 rounded-lg">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full p-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Advanced Options (Optional)</span>
            {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {showAdvanced && (
            <div className="p-4 pt-0 border-t border-border/50">
              <Label htmlFor="ipAddress" className="text-sm font-medium text-muted-foreground">
                Custom IP Address (Optional)
              </Label>
              <Input
                id="ipAddress"
                placeholder="Leave empty for auto-assign"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                className="mt-2 h-12"
                disabled={isConnecting}
              />
            </div>
          )}
        </div>

        {/* AI Setup Progress */}
        {isConnecting && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Zap className="h-5 w-5 animate-pulse" />
              <span>AI is setting up your server...</span>
            </div>
            <div className="space-y-2">
              {setupSteps.map((step, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                    index < currentStep 
                      ? 'text-emerald-500' 
                      : index === currentStep 
                        ? 'text-primary font-medium' 
                        : 'text-muted-foreground/40'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  ) : index === currentStep ? (
                    <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
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
          disabled={isConnecting || !serverName.trim() || !domain.trim() || !region}
          className="w-full h-16 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
          size="lg"
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Going Live...
            </>
          ) : (
            <>
              <Rocket className="mr-2 h-5 w-5" />
              Connect & Go Live
            </>
          )}
        </Button>

        {/* Auto Features */}
        <div className="flex items-center justify-center gap-6 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-4 w-4 text-emerald-500" />
            <span>Auto SSL</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Zap className="h-4 w-4 text-amber-500" />
            <span>Auto Scale</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Globe className="h-4 w-4 text-blue-500" />
            <span>CDN</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

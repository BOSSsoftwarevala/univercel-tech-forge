/**
 * ON-DEVICE AI (ANDROID) SECTION
 * Offline models, size limit, sync status
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  Smartphone, HardDrive, RefreshCw, Download, Check, Clock, 
  AlertTriangle, Wifi, WifiOff, Trash2, Upload 
} from "lucide-react";
import { toast } from "sonner";

const offlineModels = [
  { name: 'TinyLlama Chat', size: '1.2 GB', version: '1.0.3', status: 'synced', devices: 1245, lastSync: '2 hours ago' },
  { name: 'Whisper Tiny', size: '75 MB', version: '2.1.0', status: 'synced', devices: 2890, lastSync: '30 mins ago' },
  { name: 'MobileBERT NER', size: '120 MB', version: '1.5.0', status: 'syncing', devices: 890, lastSync: 'Syncing...' },
  { name: 'On-Device OCR', size: '45 MB', version: '3.0.1', status: 'pending', devices: 0, lastSync: 'Not deployed' },
];

const deviceStats = [
  { region: 'India', devices: 2456, synced: 2100, pending: 356, failed: 0 },
  { region: 'US', devices: 890, synced: 850, pending: 40, failed: 0 },
  { region: 'EU', devices: 654, synced: 600, pending: 50, failed: 4 },
];

const sizeConfig = {
  maxPerModel: 2048,
  maxTotal: 5120,
  currentUsage: 1440,
};

export const OnDeviceAISection = () => {
  const [autoSync, setAutoSync] = useState(true);
  const [wifiOnly, setWifiOnly] = useState(true);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'synced': return 'bg-emerald-500/20 text-emerald-400';
      case 'syncing': return 'bg-blue-500/20 text-blue-400';
      case 'pending': return 'bg-amber-500/20 text-amber-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'synced': return <Check className="w-4 h-4 text-emerald-400" />;
      case 'syncing': return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'pending': return <Clock className="w-4 h-4 text-amber-400" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Smartphone className="w-5 h-5 text-violet-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">4,000</p>
            <p className="text-xs text-muted-foreground">Active Devices</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <HardDrive className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">4</p>
            <p className="text-xs text-muted-foreground">Offline Models</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Download className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">1.44 GB</p>
            <p className="text-xs text-muted-foreground">Total Size</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <RefreshCw className="w-5 h-5 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">88%</p>
            <p className="text-xs text-muted-foreground">Sync Rate</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Offline Models</CardTitle>
          <Button size="sm" variant="outline" onClick={() => toast.success('Upload model dialog opened')}>
            <Upload className="w-3 h-3 mr-2" />
            Upload Model
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {offlineModels.map((model, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(model.status)}
                    <div>
                      <p className="font-medium text-white text-sm">{model.name}</p>
                      <p className="text-xs text-muted-foreground">v{model.version} • {model.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right text-xs text-muted-foreground">
                      <p>{model.devices.toLocaleString()} devices</p>
                      <p>{model.lastSync}</p>
                    </div>
                    <Badge className={getStatusBadge(model.status)}>{model.status}</Badge>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => toast.success('Syncing model')}>
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-red-400" onClick={() => toast.success('Model removed')}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-sm">Size Limits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Total Usage</span>
                <span className="text-white">{sizeConfig.currentUsage} MB / {sizeConfig.maxTotal} MB</span>
              </div>
              <Progress value={(sizeConfig.currentUsage / sizeConfig.maxTotal) * 100} className="h-2" />
            </div>
            <div className="p-3 rounded-lg bg-muted/20">
              <p className="text-sm text-muted-foreground mb-2">Limits:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max per model:</span>
                  <span className="text-white">{sizeConfig.maxPerModel} MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max total:</span>
                  <span className="text-white">{sizeConfig.maxTotal} MB</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-sm">Sync Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm text-white">Auto Sync</p>
                  <p className="text-xs text-muted-foreground">Automatically sync models</p>
                </div>
              </div>
              <Switch checked={autoSync} onCheckedChange={(v) => { setAutoSync(v); toast.success(`Auto sync ${v ? 'enabled' : 'disabled'}`); }} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div className="flex items-center gap-3">
                <Wifi className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-sm text-white">WiFi Only</p>
                  <p className="text-xs text-muted-foreground">Sync only on WiFi</p>
                </div>
              </div>
              <Switch checked={wifiOnly} onCheckedChange={(v) => { setWifiOnly(v); toast.success(`WiFi only ${v ? 'enabled' : 'disabled'}`); }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm">Device Sync Status by Region</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {deviceStats.map((stat, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/20">
                <p className="font-medium text-white mb-3">{stat.region}</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Devices</span>
                    <span className="text-white">{stat.devices.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-400">Synced</span>
                    <span className="text-emerald-400">{stat.synced.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-400">Pending</span>
                    <span className="text-amber-400">{stat.pending}</span>
                  </div>
                  {stat.failed > 0 && (
                    <div className="flex justify-between">
                      <span className="text-red-400">Failed</span>
                      <span className="text-red-400">{stat.failed}</span>
                    </div>
                  )}
                </div>
                <Progress 
                  value={(stat.synced / stat.devices) * 100} 
                  className="h-1.5 mt-3" 
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

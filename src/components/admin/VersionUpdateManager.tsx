import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  RefreshCw, Download, Check, Clock, AlertTriangle,
  Rocket, GitBranch, Calendar, Users, Shield, 
  Play, Pause, ChevronDown, ChevronRight, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from '@/hooks/use-toast';

interface Version {
  id: string;
  version: string;
  codename: string;
  releaseDate: Date;
  status: 'current' | 'available' | 'beta' | 'deprecated';
  size: string;
  changes: string[];
  breaking: boolean;
  downloadProgress?: number;
}

const versions: Version[] = [
  {
    id: '1',
    version: '4.2.1',
    codename: 'Phoenix',
    releaseDate: new Date('2024-12-15'),
    status: 'current',
    size: '156 MB',
    changes: [
      'Enhanced AI performance scoring',
      'New real-time collaboration features',
      'Improved demo health monitoring',
      'Bug fixes and performance improvements',
    ],
    breaking: false,
  },
  {
    id: '2',
    version: '4.3.0',
    codename: 'Thunderbird',
    releaseDate: new Date('2024-12-22'),
    status: 'available',
    size: '178 MB',
    changes: [
      'New multi-language support (19 languages)',
      'Advanced fraud detection for influencer clicks',
      'Redesigned permission matrix UI',
      'GraphQL API support',
      'Breaking: Updated authentication flow',
    ],
    breaking: true,
  },
  {
    id: '3',
    version: '5.0.0-beta',
    codename: 'Supernova',
    releaseDate: new Date('2025-01-15'),
    status: 'beta',
    size: '215 MB',
    changes: [
      'Complete UI overhaul with new design system',
      'AI-powered task auto-assignment',
      'Real-time video collaboration',
      'Advanced analytics dashboard',
      'Breaking: New database schema',
    ],
    breaking: true,
  },
  {
    id: '4',
    version: '4.1.0',
    codename: 'Falcon',
    releaseDate: new Date('2024-11-01'),
    status: 'deprecated',
    size: '148 MB',
    changes: [
      'Initial release of new franchise management',
      'Developer timer improvements',
      'Wallet system enhancements',
    ],
    breaking: false,
  },
];

interface AutoBackupSettings {
  enabled: boolean;
  frequency: 'hourly' | 'daily' | 'weekly';
  retentionDays: number;
  includeMedia: boolean;
  encryptBackups: boolean;
  lastBackup: Date | null;
  nextBackup: Date;
  backupSize: string;
}

export function VersionUpdateManager() {
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [betaChannel, setBetaChannel] = useState(false);
  const [downloadingVersion, setDownloadingVersion] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const [backupSettings, setBackupSettings] = useState<AutoBackupSettings>({
    enabled: true,
    frequency: 'daily',
    retentionDays: 30,
    includeMedia: true,
    encryptBackups: true,
    lastBackup: new Date(Date.now() - 3600000),
    nextBackup: new Date(Date.now() + 82800000),
    backupSize: '2.4 GB',
  });

  const startUpdate = (version: Version) => {
    if (version.status === 'deprecated') {
      toast({
        title: "Version Deprecated",
        description: "This version is no longer supported.",
        variant: "destructive",
      });
      return;
    }

    setDownloadingVersion(version.id);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadingVersion(null);
          toast({
            title: "Update Ready",
            description: `Version ${version.version} downloaded. Restart to apply.`,
          });
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
  };

  const triggerBackup = () => {
    toast({
      title: "Backup Started",
      description: "Manual backup has been initiated.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-500/20 text-green-500 border-green-500/50';
      case 'available': return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      case 'beta': return 'bg-purple-500/20 text-purple-500 border-purple-500/50';
      case 'deprecated': return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-mono font-bold text-foreground flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-primary" />
            Version & Backup Manager
          </h2>
          <p className="text-sm text-muted-foreground">Manage system updates and automated backups</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Auto-update</span>
            <Switch checked={autoUpdate} onCheckedChange={setAutoUpdate} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Beta channel</span>
            <Switch checked={betaChannel} onCheckedChange={setBetaChannel} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Versions */}
        <div className="glass-panel p-4">
          <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" />
            Available Versions
          </h3>
          
          <div className="space-y-3">
            {versions.filter(v => betaChannel || v.status !== 'beta').map((version, index) => (
              <motion.div
                key={version.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-xl border ${
                  version.status === 'current' 
                    ? 'border-green-500/30 bg-green-500/5' 
                    : 'border-border/30 bg-background/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-lg text-foreground">
                        v{version.version}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {version.codename}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(version.status)}>
                        {version.status}
                      </Badge>
                      {version.breaking && (
                        <Badge variant="destructive" className="text-xs">
                          Breaking
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {version.releaseDate.toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {version.size}
                      </span>
                    </div>
                    
                    <Accordion type="single" collapsible className="mt-2">
                      <AccordionItem value="changes" className="border-none">
                        <AccordionTrigger className="py-1 text-xs text-muted-foreground hover:no-underline">
                          View Changes
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="text-xs text-muted-foreground space-y-1 mt-1">
                            {version.changes.map((change, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                <span className={change.includes('Breaking') ? 'text-red-500' : ''}>
                                  {change}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  {version.status !== 'current' && version.status !== 'deprecated' && (
                    <Button
                      size="sm"
                      onClick={() => startUpdate(version)}
                      disabled={downloadingVersion === version.id}
                    >
                      {downloadingVersion === version.id ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                          {Math.round(downloadProgress)}%
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-1" />
                          Update
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {downloadingVersion === version.id && (
                  <Progress value={downloadProgress} className="mt-3 h-1" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Backup Settings */}
        <div className="glass-panel p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Auto-Backup Settings
            </h3>
            <Switch 
              checked={backupSettings.enabled} 
              onCheckedChange={(v) => setBackupSettings({...backupSettings, enabled: v})}
            />
          </div>

          <div className="space-y-4">
            {/* Backup Status */}
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="font-medium text-green-500">Backup System Active</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Last Backup</p>
                  <p className="font-mono text-foreground">
                    {backupSettings.lastBackup?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Next Backup</p>
                  <p className="font-mono text-foreground">
                    {backupSettings.nextBackup.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Size</p>
                  <p className="font-mono text-foreground">{backupSettings.backupSize}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Retention</p>
                  <p className="font-mono text-foreground">{backupSettings.retentionDays} days</p>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/30">
                <div>
                  <p className="font-medium text-foreground">Backup Frequency</p>
                  <p className="text-xs text-muted-foreground">How often to create backups</p>
                </div>
                <Badge variant="outline" className="font-mono">
                  {backupSettings.frequency}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-background/30">
                <div>
                  <p className="font-medium text-foreground">Include Media Files</p>
                  <p className="text-xs text-muted-foreground">Backup uploaded images and documents</p>
                </div>
                <Switch 
                  checked={backupSettings.includeMedia}
                  onCheckedChange={(v) => setBackupSettings({...backupSettings, includeMedia: v})}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-background/30">
                <div>
                  <p className="font-medium text-foreground">Encrypt Backups</p>
                  <p className="text-xs text-muted-foreground">AES-256 encryption for security</p>
                </div>
                <Switch 
                  checked={backupSettings.encryptBackups}
                  onCheckedChange={(v) => setBackupSettings({...backupSettings, encryptBackups: v})}
                />
              </div>
            </div>

            <Button onClick={triggerBackup} className="w-full gap-2">
              <RefreshCw className="w-4 h-4" />
              Trigger Manual Backup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VersionUpdateManager;

/**
 * DEMO URL MANAGER SCREEN
 * Features: Generate URL, Domain Lock, Time Lock, Geo Lock, Read-Only Enforcement
 * Rules: No login edit, No delete, No add, View + Click only
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Link,
  Globe,
  Clock,
  MapPin,
  Eye,
  Copy,
  ExternalLink,
  Lock,
  Shield,
  Plus,
  Search,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface DemoUrl {
  id: string;
  software: string;
  url: string;
  domainLocked: boolean;
  timeLock: string | null;
  geoLock: string[];
  readOnly: boolean;
  isActive: boolean;
  accessCount: number;
  createdAt: string;
}

const demoUrls: DemoUrl[] = [
  { id: '1', software: 'SchoolERP Pro', url: 'demo.softwarevala.com/schoolerp', domainLocked: true, timeLock: '7 days', geoLock: ['IN', 'US'], readOnly: true, isActive: true, accessCount: 1245, createdAt: '2024-01-15' },
  { id: '2', software: 'HospitalCRM', url: 'demo.softwarevala.com/hospital', domainLocked: true, timeLock: '30 days', geoLock: [], readOnly: true, isActive: true, accessCount: 892, createdAt: '2024-01-10' },
  { id: '3', software: 'RetailPOS Master', url: 'demo.softwarevala.com/retailpos', domainLocked: false, timeLock: null, geoLock: ['IN'], readOnly: true, isActive: false, accessCount: 234, createdAt: '2024-01-05' },
  { id: '4', software: 'BuilderCRM Elite', url: 'demo.softwarevala.com/builder', domainLocked: true, timeLock: '14 days', geoLock: ['IN', 'AE', 'GB'], readOnly: true, isActive: true, accessCount: 567, createdAt: '2024-01-12' },
  { id: '5', software: 'LogisticsERP', url: 'demo.softwarevala.com/logistics', domainLocked: true, timeLock: '7 days', geoLock: [], readOnly: true, isActive: true, accessCount: 421, createdAt: '2024-01-08' },
];

export const DMEUrlsScreen: React.FC = () => {
  const [urls, setUrls] = useState(demoUrls);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(`https://${url}`);
    toast.success('URL copied to clipboard');
  };

  const handleGenerateUrl = () => {
    toast.success('Generating new demo URL...');
  };

  const toggleActive = (id: string) => {
    setUrls(prev => prev.map(u => 
      u.id === id ? { ...u, isActive: !u.isActive } : u
    ));
    toast.success('URL status updated');
  };

  const filteredUrls = urls.filter(u =>
    u.software.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Demo URL Manager</h1>
          <p className="text-muted-foreground text-sm">Generate & manage demo access URLs</p>
        </div>
        <Button onClick={handleGenerateUrl} className="gap-2">
          <Plus className="w-4 h-4" />
          Generate URL
        </Button>
      </div>

      {/* Rules Banner */}
      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 flex items-center gap-3">
        <Shield className="w-5 h-5 text-primary" />
        <div className="flex-1">
          <p className="text-sm text-foreground font-medium">Read-Only Demo Access</p>
          <p className="text-xs text-muted-foreground">
            Clients can only View + Click. No login edit, No delete, No add operations allowed.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by software name or URL..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* URL List */}
      <div className="space-y-3">
        {filteredUrls.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{item.software}</h3>
                      <Badge className={item.isActive ? 'bg-neon-green/20 text-neon-green' : 'bg-muted text-muted-foreground'}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Link className="w-4 h-4 text-primary" />
                      <code className="text-sm text-primary bg-primary/10 px-2 py-0.5 rounded">{item.url}</code>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleCopyUrl(item.url)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {/* Domain Lock */}
                      <div className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        <span>Domain: {item.domainLocked ? 'Locked' : 'Open'}</span>
                        {item.domainLocked && <Lock className="w-3 h-3 text-neon-orange" />}
                      </div>

                      {/* Time Lock */}
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Time: {item.timeLock || 'No limit'}</span>
                      </div>

                      {/* Geo Lock */}
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>Geo: {item.geoLock.length > 0 ? item.geoLock.join(', ') : 'Global'}</span>
                      </div>

                      {/* Access Count */}
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{item.accessCount} views</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Active</span>
                      <Switch
                        checked={item.isActive}
                        onCheckedChange={() => toggleActive(item.id)}
                      />
                    </div>
                    <Button variant="outline" size="sm" className="gap-1">
                      <RefreshCw className="w-3 h-3" />
                      Regenerate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

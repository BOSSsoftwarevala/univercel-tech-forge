/**
 * MARKETPLACE SYNC SCREEN
 * Sync demos with marketplace and home page
 * LOCK: No modifications without approval
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Store,
  Home,
  RefreshCw,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  ExternalLink,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export const DMEMarketplaceSyncScreen: React.FC = () => {
  const [demos, setDemos] = useState([
    { id: 1, name: 'E-Commerce Pro', marketplace: true, homepage: true, status: 'synced', lastSync: '5 min ago' },
    { id: 2, name: 'Hospital Management', marketplace: true, homepage: false, status: 'synced', lastSync: '10 min ago' },
    { id: 3, name: 'School ERP', marketplace: false, homepage: false, status: 'hidden', lastSync: '1 hour ago' },
    { id: 4, name: 'Sales CRM', marketplace: true, homepage: true, status: 'synced', lastSync: '2 min ago' },
    { id: 5, name: 'Fleet Manager', marketplace: true, homepage: false, status: 'synced', lastSync: '15 min ago' },
    { id: 6, name: 'Property Portal', marketplace: false, homepage: false, status: 'inactive', lastSync: 'Never' },
  ]);

  const toggleMarketplace = (id: number) => {
    setDemos(demos.map(d => d.id === id ? { ...d, marketplace: !d.marketplace } : d));
  };

  const toggleHomepage = (id: number) => {
    setDemos(demos.map(d => d.id === id ? { ...d, homepage: !d.homepage } : d));
  };

  const syncAll = () => {
    console.log('Syncing all demos...');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return 'bg-neon-green/20 text-neon-green border-neon-green/30';
      case 'hidden': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'inactive': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-secondary text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Store className="w-5 h-5 text-blue-400" />
            </div>
            Marketplace & Home Sync
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Control demo visibility on marketplace and home page</p>
        </div>
        <Button onClick={syncAll} className="bg-neon-teal/20 text-neon-teal hover:bg-neon-teal/30 border border-neon-teal/30">
          <RefreshCw className="w-4 h-4 mr-2" />
          Sync All
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Store className="w-4 h-4 text-blue-400" />
            <p className="text-xs text-muted-foreground">On Marketplace</p>
          </div>
          <p className="text-2xl font-bold text-blue-400">{demos.filter(d => d.marketplace).length}</p>
        </div>
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Home className="w-4 h-4 text-purple-400" />
            <p className="text-xs text-muted-foreground">On Home Page</p>
          </div>
          <p className="text-2xl font-bold text-purple-400">{demos.filter(d => d.homepage).length}</p>
        </div>
        <div className="p-4 rounded-xl bg-neon-green/10 border border-neon-green/30">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-neon-green" />
            <p className="text-xs text-muted-foreground">Synced</p>
          </div>
          <p className="text-2xl font-bold text-neon-green">{demos.filter(d => d.status === 'synced').length}</p>
        </div>
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-center gap-2 mb-1">
            <EyeOff className="w-4 h-4 text-amber-400" />
            <p className="text-xs text-muted-foreground">Hidden</p>
          </div>
          <p className="text-2xl font-bold text-amber-400">{demos.filter(d => !d.marketplace && !d.homepage).length}</p>
        </div>
      </div>

      {/* Demo List */}
      <div className="space-y-4">
        {demos.map((demo, index) => (
          <motion.div
            key={demo.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-5 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  demo.marketplace || demo.homepage ? 'bg-neon-green/10' : 'bg-secondary'
                }`}>
                  {demo.marketplace || demo.homepage ? (
                    <Eye className="w-6 h-6 text-neon-green" />
                  ) : (
                    <EyeOff className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{demo.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    Last sync: {demo.lastSync}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                {/* Marketplace Toggle */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">Marketplace</p>
                    <p className="text-xs text-muted-foreground">
                      {demo.marketplace ? 'Visible' : 'Hidden'}
                    </p>
                  </div>
                  <Switch
                    checked={demo.marketplace}
                    onCheckedChange={() => toggleMarketplace(demo.id)}
                    className="data-[state=checked]:bg-blue-500"
                  />
                </div>

                {/* Homepage Toggle */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">Home Page</p>
                    <p className="text-xs text-muted-foreground">
                      {demo.homepage ? 'Visible' : 'Hidden'}
                    </p>
                  </div>
                  <Switch
                    checked={demo.homepage}
                    onCheckedChange={() => toggleHomepage(demo.id)}
                    className="data-[state=checked]:bg-purple-500"
                  />
                </div>

                <Badge className={getStatusColor(demo.status)}>
                  {demo.status.toUpperCase()}
                </Badge>

                <Button size="sm" variant="outline" className="border-border">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Sync
                </Button>
              </div>
            </div>

            {/* Auto-hide Notice */}
            {demo.status === 'inactive' && (
              <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400" />
                <p className="text-sm text-red-400">
                  Demo is inactive. It will be automatically hidden from marketplace and home page.
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/**
 * DEMO HEALTH MONITOR SCREEN
 * Auto checks: Button click, Route validation, API connectivity, CRUD, Role switch
 * Status: Healthy, Warning, Broken, Critical
 * Actions: Auto Fix, Send to AI Queue, Force Rebuild
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  HeartPulse,
  MousePointer2,
  Route,
  Plug,
  Database,
  Users,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  AlertOctagon,
  Wrench,
  Bot,
  RefreshCw,
  Play
} from 'lucide-react';
import { toast } from 'sonner';

interface HealthCheck {
  id: string;
  name: string;
  icon: any;
  status: 'healthy' | 'warning' | 'broken' | 'critical';
  percentage: number;
  lastCheck: string;
  issues: number;
}

interface SoftwareHealth {
  id: string;
  name: string;
  overallStatus: 'healthy' | 'warning' | 'broken' | 'critical';
  checks: HealthCheck[];
}

const healthData: SoftwareHealth[] = [
  {
    id: '1',
    name: 'SchoolERP Pro',
    overallStatus: 'healthy',
    checks: [
      { id: 'btn', name: 'Button Click Test', icon: MousePointer2, status: 'healthy', percentage: 100, lastCheck: '5 min ago', issues: 0 },
      { id: 'route', name: 'Route Validation', icon: Route, status: 'healthy', percentage: 100, lastCheck: '5 min ago', issues: 0 },
      { id: 'api', name: 'API Connectivity', icon: Plug, status: 'healthy', percentage: 99, lastCheck: '5 min ago', issues: 0 },
      { id: 'crud', name: 'CRUD Operations', icon: Database, status: 'healthy', percentage: 100, lastCheck: '5 min ago', issues: 0 },
      { id: 'role', name: 'Role Switch', icon: Users, status: 'healthy', percentage: 100, lastCheck: '5 min ago', issues: 0 },
    ]
  },
  {
    id: '2',
    name: 'HospitalCRM',
    overallStatus: 'warning',
    checks: [
      { id: 'btn', name: 'Button Click Test', icon: MousePointer2, status: 'healthy', percentage: 98, lastCheck: '10 min ago', issues: 2 },
      { id: 'route', name: 'Route Validation', icon: Route, status: 'warning', percentage: 85, lastCheck: '10 min ago', issues: 3 },
      { id: 'api', name: 'API Connectivity', icon: Plug, status: 'healthy', percentage: 100, lastCheck: '10 min ago', issues: 0 },
      { id: 'crud', name: 'CRUD Operations', icon: Database, status: 'warning', percentage: 90, lastCheck: '10 min ago', issues: 1 },
      { id: 'role', name: 'Role Switch', icon: Users, status: 'healthy', percentage: 100, lastCheck: '10 min ago', issues: 0 },
    ]
  },
  {
    id: '3',
    name: 'RetailPOS Master',
    overallStatus: 'broken',
    checks: [
      { id: 'btn', name: 'Button Click Test', icon: MousePointer2, status: 'broken', percentage: 45, lastCheck: '1 hour ago', issues: 12 },
      { id: 'route', name: 'Route Validation', icon: Route, status: 'broken', percentage: 60, lastCheck: '1 hour ago', issues: 8 },
      { id: 'api', name: 'API Connectivity', icon: Plug, status: 'warning', percentage: 75, lastCheck: '1 hour ago', issues: 4 },
      { id: 'crud', name: 'CRUD Operations', icon: Database, status: 'critical', percentage: 20, lastCheck: '1 hour ago', issues: 15 },
      { id: 'role', name: 'Role Switch', icon: Users, status: 'broken', percentage: 50, lastCheck: '1 hour ago', issues: 5 },
    ]
  },
];

export const DMEHealthScreen: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle2 className="w-4 h-4 text-neon-green" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-neon-orange" />;
      case 'broken': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'critical': return <AlertOctagon className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-neon-green/20 text-neon-green border-neon-green/30';
      case 'warning': return 'bg-neon-orange/20 text-neon-orange border-neon-orange/30';
      case 'broken': return 'bg-red-400/20 text-red-400 border-red-400/30';
      case 'critical': return 'bg-red-600/20 text-red-500 border-red-500/30';
      default: return '';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-neon-green';
      case 'warning': return 'bg-neon-orange';
      case 'broken': return 'bg-red-400';
      case 'critical': return 'bg-red-500';
      default: return 'bg-primary';
    }
  };

  const handleScan = () => {
    setIsScanning(true);
    toast.success('Health scan started...');
    setTimeout(() => setIsScanning(false), 3000);
  };

  const handleAction = (softwareId: string, action: string) => {
    toast.success(`${action} triggered for software ID: ${softwareId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Demo Health Monitor</h1>
          <p className="text-muted-foreground text-sm">Automated health checks & diagnostics</p>
        </div>
        <Button onClick={handleScan} disabled={isScanning} className="gap-2">
          {isScanning ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {isScanning ? 'Scanning...' : 'Run Full Scan'}
        </Button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Healthy', count: 189, color: 'text-neon-green', bg: 'bg-neon-green/10' },
          { label: 'Warning', count: 23, color: 'text-neon-orange', bg: 'bg-neon-orange/10' },
          { label: 'Broken', count: 12, color: 'text-red-400', bg: 'bg-red-400/10' },
          { label: 'Critical', count: 3, color: 'text-red-500', bg: 'bg-red-500/10' },
        ].map((stat) => (
          <Card key={stat.label} className="glass-card border-border/50">
            <CardContent className={`p-4 ${stat.bg} rounded-lg`}>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.count}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Health Details */}
      <div className="space-y-4">
        {healthData.map((software, index) => (
          <motion.div
            key={software.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    {getStatusIcon(software.overallStatus)}
                    {software.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(software.overallStatus)}>
                      {software.overallStatus.toUpperCase()}
                    </Badge>
                    <Button variant="outline" size="sm" className="gap-1 h-7" onClick={() => handleAction(software.id, 'Auto Fix')}>
                      <Wrench className="w-3 h-3" />
                      Auto Fix
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1 h-7" onClick={() => handleAction(software.id, 'AI Queue')}>
                      <Bot className="w-3 h-3" />
                      AI Queue
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1 h-7 text-red-400" onClick={() => handleAction(software.id, 'Force Rebuild')}>
                      <RefreshCw className="w-3 h-3" />
                      Rebuild
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-4">
                  {software.checks.map((check) => {
                    const Icon = check.icon;
                    return (
                      <div key={check.id} className="p-3 rounded-lg bg-background/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs font-medium text-foreground">{check.name}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold">{check.percentage}%</span>
                            {getStatusIcon(check.status)}
                          </div>
                          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                            <div 
                              className={`h-full ${getProgressColor(check.status)} transition-all`}
                              style={{ width: `${check.percentage}%` }}
                            />
                          </div>
                          {check.issues > 0 && (
                            <p className="text-[10px] text-red-400">{check.issues} issues found</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

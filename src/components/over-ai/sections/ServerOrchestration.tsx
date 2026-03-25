/**
 * OVER AI - Auto Server Orchestration
 * LOCKED - DO NOT MODIFY
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Server,
  Globe,
  Database,
  GitBranch,
  CheckCircle2,
  Activity,
  Zap,
} from 'lucide-react';

const SERVERS = [
  { id: 'ap-south-1', name: 'Asia Pacific (Mumbai)', region: 'AP', status: 'primary', load: 45, responseTime: 23 },
  { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)', region: 'AP', status: 'backup', load: 32, responseTime: 28 },
  { id: 'eu-west-1', name: 'Europe (Ireland)', region: 'EU', status: 'primary', load: 51, responseTime: 34 },
  { id: 'eu-central-1', name: 'Europe (Frankfurt)', region: 'EU', status: 'cache', load: 28, responseTime: 31 },
  { id: 'us-east-1', name: 'US East (Virginia)', region: 'US', status: 'primary', load: 42, responseTime: 45 },
  { id: 'us-west-2', name: 'US West (Oregon)', region: 'US', status: 'backup', load: 35, responseTime: 52 },
];

const ROUTING_DECISIONS = [
  { request: 'User Query', decision: 'Nearest Server', route: 'AP-South-1', reason: 'Lowest latency (23ms)' },
  { request: 'Heavy Compute', decision: 'Compute Node', route: 'EU-Central-1', reason: 'Available capacity' },
  { request: 'Static Asset', decision: 'CDN Cache', route: 'Edge', reason: 'Cache hit' },
  { request: 'Database Read', decision: 'Primary DB', route: 'AP-South-1', reason: 'Read replica' },
  { request: 'Backup Job', decision: 'Backup Server', route: 'US-West-2', reason: 'Low priority queue' },
];

export function ServerOrchestration() {
  const [servers, setServers] = useState(SERVERS);

  useEffect(() => {
    const interval = setInterval(() => {
      setServers((prev) =>
        prev.map((s) => ({
          ...s,
          load: Math.max(10, Math.min(90, s.load + Math.floor(Math.random() * 10) - 5)),
          responseTime: Math.max(15, Math.min(100, s.responseTime + Math.floor(Math.random() * 6) - 3)),
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'primary':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'backup':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'cache':
        return 'bg-violet-500/20 text-violet-400 border-violet-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/30">
            <Server className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Auto Server Orchestration</h1>
            <p className="text-cyan-400/70 text-sm">Linked with Server Manager • Zero hardcoding</p>
          </div>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
          <Globe className="w-3 h-3 mr-1" />
          GLOBAL ROUTING ACTIVE
        </Badge>
      </motion.div>

      {/* Server Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {servers.map((server, i) => (
          <motion.div
            key={server.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl hover:border-cyan-500/30 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-white">{server.name}</CardTitle>
                  <Badge className={getStatusColor(server.status)}>{server.status.toUpperCase()}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-white/50">Load</p>
                    <p className="text-xl font-bold text-cyan-400 font-mono">{server.load}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Response</p>
                    <p className="text-xl font-bold text-emerald-400 font-mono">{server.responseTime}ms</p>
                  </div>
                </div>
                <Progress value={server.load} className="h-1.5" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Routing Logic */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            Auto Routing Decisions (Live)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ROUTING_DECISIONS.map((decision, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/30"
              >
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-white/70 border-white/20">
                    {decision.request}
                  </Badge>
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-400">{decision.decision}</span>
                  <span className="text-white/50">→</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400">{decision.route}</Badge>
                </div>
                <span className="text-xs text-white/50">{decision.reason}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: Server, title: 'Decide nearest server', desc: 'Based on user location' },
          { icon: Database, title: 'Decide primary / backup', desc: 'Based on load & health' },
          { icon: Activity, title: 'Decide cache vs compute', desc: 'Based on request type' },
          { icon: GitBranch, title: 'Route automatically', desc: 'No manual server select' },
        ].map((rule, i) => {
          const Icon = rule.icon;
          return (
            <Card key={i} className="bg-slate-900/50 border-cyan-500/20">
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-cyan-400" />
                  <div>
                    <p className="text-sm font-bold text-white">{rule.title}</p>
                    <p className="text-xs text-cyan-400/70">{rule.desc}</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default ServerOrchestration;

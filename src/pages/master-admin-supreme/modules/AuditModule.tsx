import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Lock, Search, Clock, Download, Eye,
  Calendar, User, Shield, ChevronRight, Play, Pause, Box
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { BlackboxPanel, useBlackbox } from '../engines/BlackboxEngine';

interface AuditLog {
  id: string;
  action: string;
  actor: string;
  actorRole: string;
  target: string;
  timestamp: string;
  module: string;
}

const auditLogs: AuditLog[] = [
  { id: '1', action: 'Withdrawal Approved', actor: 'SA-0012', actorRole: 'Super Admin', target: 'User #4521', timestamp: '2024-01-15 14:32:45', module: 'Finance' },
  { id: '2', action: 'Role Upgraded', actor: 'MA-0001', actorRole: 'Master Admin', target: 'SA-0089', timestamp: '2024-01-15 14:28:12', module: 'Roles' },
  { id: '3', action: 'Policy Updated', actor: 'SA-0023', actorRole: 'Super Admin', target: 'Rule #47', timestamp: '2024-01-15 14:15:33', module: 'Rules' },
  { id: '4', action: 'Account Suspended', actor: 'SA-0034', actorRole: 'Super Admin', target: 'Franchise #12', timestamp: '2024-01-15 14:02:18', module: 'Accounts' },
  { id: '5', action: 'Security Alert Dismissed', actor: 'SA-0012', actorRole: 'Super Admin', target: 'Alert #892', timestamp: '2024-01-15 13:45:00', module: 'Security' },
  { id: '6', action: 'Bulk Export Requested', actor: 'MA-0001', actorRole: 'Master Admin', target: 'Reports Q4', timestamp: '2024-01-15 13:30:22', module: 'Reports' },
];

export function AuditModule() {
  const [timelinePosition, setTimelinePosition] = useState([50]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { events } = useBlackbox();
  return (
    <div className="space-y-6">
      {/* Read-Only Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="p-4 bg-gradient-to-r from-blue-950/80 to-indigo-950/80 border-blue-400/30 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-blue-300">Immutable Audit Logs</h3>
              <p className="text-sm text-blue-200/60">Read-only access • Cryptographically signed • Tamper-proof records</p>
            </div>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Shield className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          </div>
        </Card>
      </motion.div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Search logs by action, actor, or target..."
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="bg-white/5 border-white/10 text-white gap-2">
          <Calendar className="w-4 h-4" />
          Date Range
        </Button>
        <Button variant="outline" className="bg-blue-500/20 border-blue-500/30 text-blue-300 gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Time-Based Replay Slider */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-5 bg-gradient-to-br from-blue-950/50 to-indigo-950/30 border-blue-400/20 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Timeline Replay
            </h3>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                className="w-8 h-8 bg-white/5 border-white/10"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <span className="text-sm text-white/50">Jan 15, 2024</span>
            </div>
          </div>
          <div className="space-y-3">
            <Slider
              value={timelinePosition}
              onValueChange={setTimelinePosition}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex items-center justify-between text-xs text-white/40">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>23:59</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Ledger-Style Logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-blue-950/50 to-indigo-950/30 border-blue-400/20 backdrop-blur-xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-white/5">
            <div className="col-span-3 text-xs font-semibold text-white/50 uppercase tracking-wider">Action</div>
            <div className="col-span-2 text-xs font-semibold text-white/50 uppercase tracking-wider">Actor</div>
            <div className="col-span-2 text-xs font-semibold text-white/50 uppercase tracking-wider">Target</div>
            <div className="col-span-2 text-xs font-semibold text-white/50 uppercase tracking-wider">Module</div>
            <div className="col-span-2 text-xs font-semibold text-white/50 uppercase tracking-wider">Timestamp</div>
            <div className="col-span-1 text-xs font-semibold text-white/50 uppercase tracking-wider">View</div>
          </div>

          {/* Rows */}
          {auditLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors group"
            >
              <div className="col-span-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-white font-medium">{log.action}</span>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <User className="w-3 h-3 text-white/40" />
                <div>
                  <p className="text-sm text-white">{log.actor}</p>
                  <p className="text-[10px] text-white/40">{log.actorRole}</p>
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-white/80">{log.target}</p>
              </div>
              <div className="col-span-2">
                <Badge variant="outline" className="bg-white/5 text-white/60 border-white/20 text-xs">
                  {log.module}
                </Badge>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-white/50 font-mono">{log.timestamp}</p>
              </div>
              <div className="col-span-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" className="w-6 h-6">
                  <Eye className="w-3 h-3 text-blue-400" />
                </Button>
              </div>
            </motion.div>
          ))}
        </Card>
      </motion.div>

      {/* Blackbox Mirror (Full View) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="relative">
          <div className="absolute -top-2 left-4 px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
            <div className="flex items-center gap-2">
              <Box className="w-3 h-3 text-blue-400" />
              <span className="text-[10px] text-blue-300 uppercase tracking-wider font-bold">Blackbox Mirror - Read Only</span>
            </div>
          </div>
          <BlackboxPanel maxEvents={15} />
        </div>
      </motion.div>

      {/* Rental Access */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-400/20 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-300">Audit Window Rental</h4>
                <p className="text-xs text-blue-200/60">Extended access • Compliance reports • Historical data</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-white/50">Rental Expires</p>
                <p className="text-lg font-bold text-blue-300">18:45:00</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

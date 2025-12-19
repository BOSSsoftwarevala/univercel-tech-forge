import React from 'react';
import { motion } from 'framer-motion';
import { 
  Handshake, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Users,
  TrendingUp,
  Timer,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import promiseHandshakeIcon from '@/assets/promise-handshake-icon.jpg';

interface PromiseData {
  id: string;
  developerName: string;
  taskTitle: string;
  status: 'promised' | 'in_progress' | 'breached' | 'completed';
  deadline: string;
  elapsedMinutes: number;
  totalMinutes: number;
  region?: string;
}

// Mock data for demonstration
const promiseData: PromiseData[] = [
  {
    id: '1',
    developerName: 'Dev_A1***',
    taskTitle: 'Payment Gateway Integration',
    status: 'in_progress',
    deadline: new Date(Date.now() + 3600000).toISOString(),
    elapsedMinutes: 45,
    totalMinutes: 120,
    region: 'India',
  },
  {
    id: '2',
    developerName: 'Dev_K2***',
    taskTitle: 'Dashboard Analytics',
    status: 'promised',
    deadline: new Date(Date.now() + 7200000).toISOString(),
    elapsedMinutes: 15,
    totalMinutes: 180,
    region: 'Kenya',
  },
  {
    id: '3',
    developerName: 'Dev_U3***',
    taskTitle: 'User Module Bug Fix',
    status: 'breached',
    deadline: new Date(Date.now() - 1800000).toISOString(),
    elapsedMinutes: 150,
    totalMinutes: 120,
    region: 'UK',
  },
  {
    id: '4',
    developerName: 'Dev_P4***',
    taskTitle: 'API Optimization',
    status: 'completed',
    deadline: new Date(Date.now() - 3600000).toISOString(),
    elapsedMinutes: 90,
    totalMinutes: 120,
    region: 'Philippines',
  },
];

const stats = {
  totalActive: 12,
  promised: 5,
  inProgress: 4,
  breached: 1,
  completedToday: 23,
  avgCompletionRate: 94,
};

const statusConfig = {
  promised: { color: 'text-cyan-400', bg: 'bg-cyan-500/20', icon: Handshake },
  in_progress: { color: 'text-amber-400', bg: 'bg-amber-500/20', icon: Timer },
  breached: { color: 'text-red-400', bg: 'bg-red-500/20', icon: AlertTriangle },
  completed: { color: 'text-green-400', bg: 'bg-green-500/20', icon: CheckCircle },
};

const GlobalPromiseStatus: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={promiseHandshakeIcon} 
              alt="Promise System" 
              className="w-14 h-14 rounded-full border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20"
            />
            <motion.div
              className="absolute -inset-1 rounded-full border-2 border-cyan-400/30"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Global Promise Status</h2>
            <p className="text-slate-400 text-sm">Real-time promise tracking across all developers</p>
          </div>
        </div>
        <Badge className="bg-cyan-500/20 text-cyan-400 text-sm px-4 py-1">
          Live Sync Active
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.totalActive}</p>
            <p className="text-xs text-slate-400">Active Promises</p>
          </CardContent>
        </Card>
        <Card className="bg-cyan-500/10 border-cyan-500/30">
          <CardContent className="p-4 text-center">
            <Handshake className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-cyan-400">{stats.promised}</p>
            <p className="text-xs text-slate-400">Promised</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-4 text-center">
            <Timer className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-amber-400">{stats.inProgress}</p>
            <p className="text-xs text-slate-400">In Progress</p>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-400">{stats.breached}</p>
            <p className="text-xs text-slate-400">Breached</p>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-400">{stats.completedToday}</p>
            <p className="text-xs text-slate-400">Completed Today</p>
          </CardContent>
        </Card>
      </div>

      {/* Completion Rate */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-medium">Promise Completion Rate</span>
            </div>
            <span className="text-2xl font-bold text-cyan-400">{stats.avgCompletionRate}%</span>
          </div>
          <Progress value={stats.avgCompletionRate} className="h-2 bg-slate-700" />
          <p className="text-xs text-slate-500 mt-2">Based on last 30 days performance</p>
        </CardContent>
      </Card>

      {/* Active Promise List */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            Live Promise Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {promiseData.map((promise, index) => {
              const config = statusConfig[promise.status];
              const StatusIcon = config.icon;
              const progress = Math.min((promise.elapsedMinutes / promise.totalMinutes) * 100, 100);
              const isOverdue = promise.elapsedMinutes > promise.totalMinutes;
              
              return (
                <motion.div
                  key={promise.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border transition-all ${
                    isOverdue 
                      ? 'bg-red-500/5 border-red-500/30' 
                      : 'bg-slate-900/50 border-slate-700/50 hover:border-cyan-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium truncate">{promise.taskTitle}</span>
                        <Badge className={`${config.bg} ${config.color} text-xs`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {promise.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>{promise.developerName}</span>
                        <span>•</span>
                        <span>{promise.region}</span>
                        <span>•</span>
                        <span className={isOverdue ? 'text-red-400' : ''}>
                          {promise.elapsedMinutes}m / {promise.totalMinutes}m
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Deadline</p>
                      <p className={`text-sm font-medium ${isOverdue ? 'text-red-400' : 'text-white'}`}>
                        {new Date(promise.deadline).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <Progress 
                      value={progress} 
                      className={`h-1.5 bg-slate-700 ${isOverdue ? '[&>div]:bg-red-500' : ''}`}
                    />
                  </div>
                  
                  {/* Breach Warning */}
                  {isOverdue && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-red-400">
                      <AlertTriangle className="w-3 h-3" />
                      Promise breached - Escalation initiated
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalPromiseStatus;

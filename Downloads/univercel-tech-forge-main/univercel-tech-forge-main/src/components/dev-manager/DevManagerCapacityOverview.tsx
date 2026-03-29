import React from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Developer {
  valaId: string;
  availability: 'available' | 'busy' | 'overloaded' | 'offline';
  activeTasks: number;
  maxCapacity: number;
  overdueCount: number;
  skillTags: string[];
}

// Mock data - in production, fetch from database
const mockDevelopers: Developer[] = [
  { valaId: 'DEV-7842', availability: 'busy', activeTasks: 3, maxCapacity: 5, overdueCount: 0, skillTags: ['React', 'Node'] },
  { valaId: 'DEV-3291', availability: 'available', activeTasks: 1, maxCapacity: 4, overdueCount: 0, skillTags: ['Python', 'ML'] },
  { valaId: 'DEV-5104', availability: 'overloaded', activeTasks: 6, maxCapacity: 5, overdueCount: 2, skillTags: ['Java', 'Spring'] },
  { valaId: 'DEV-8877', availability: 'busy', activeTasks: 4, maxCapacity: 5, overdueCount: 1, skillTags: ['React', 'TypeScript'] },
];

const getAvailabilityColor = (availability: Developer['availability']) => {
  switch (availability) {
    case 'available': return 'bg-emerald-500';
    case 'busy': return 'bg-amber-500';
    case 'overloaded': return 'bg-red-500';
    case 'offline': return 'bg-zinc-500';
  }
};

const getCapacityColor = (active: number, max: number) => {
  const ratio = active / max;
  if (ratio >= 1) return 'text-red-400';
  if (ratio >= 0.8) return 'text-amber-400';
  return 'text-emerald-400';
};

export default function DevManagerCapacityOverview() {
  const totalDevelopers = mockDevelopers.length;
  const availableCount = mockDevelopers.filter(d => d.availability === 'available').length;
  const overloadedCount = mockDevelopers.filter(d => d.availability === 'overloaded').length;
  const totalOverdue = mockDevelopers.reduce((sum, d) => sum + d.overdueCount, 0);

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-mono font-bold">{totalDevelopers}</p>
                <p className="text-xs text-zinc-500">Total Devs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-mono font-bold">{availableCount}</p>
                <p className="text-xs text-zinc-500">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-mono font-bold">{overloadedCount}</p>
                <p className="text-xs text-zinc-500">Overloaded</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-mono font-bold">{totalOverdue}</p>
                <p className="text-xs text-zinc-500">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Developer List */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono tracking-wider text-zinc-400">
            DEVELOPER CAPACITY
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockDevelopers.map((dev, idx) => (
            <motion.div
              key={dev.valaId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${getAvailabilityColor(dev.availability)}`} />
                  <span className="font-mono text-sm">{dev.valaId}</span>
                  {dev.overdueCount > 0 && (
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">
                      {dev.overdueCount} overdue
                    </span>
                  )}
                </div>
                <span className={`font-mono text-sm ${getCapacityColor(dev.activeTasks, dev.maxCapacity)}`}>
                  {dev.activeTasks}/{dev.maxCapacity}
                </span>
              </div>
              <Progress 
                value={(dev.activeTasks / dev.maxCapacity) * 100} 
                className="h-1.5"
              />
              <div className="flex gap-1 mt-2">
                {dev.skillTags.map(skill => (
                  <span key={skill} className="px-2 py-0.5 bg-zinc-700/50 text-zinc-400 text-xs rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

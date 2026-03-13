/**
 * SOURCE CODE LOCK SYSTEM
 * Developer can only work on assigned domain/project
 * Code is locked, read-only for unassigned projects
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, Unlock, Globe, Shield, Eye, Code2, 
  AlertTriangle, CheckCircle, GitBranch, FolderLock,
  Monitor, Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface AssignedProject {
  id: string;
  name: string;
  domain: string;
  branch: string;
  accessLevel: 'full' | 'read-only' | 'locked';
  deadline: string;
  progress: number;
  filesUnlocked: number;
  totalFiles: number;
  lastActivity: string;
}

const mockProjects: AssignedProject[] = [
  { id: '1', name: 'E-Commerce Module', domain: 'shop.softwarevala.com', branch: 'feature/checkout-v2', accessLevel: 'full', deadline: '2026-03-15', progress: 68, filesUnlocked: 24, totalFiles: 24, lastActivity: '5 min ago' },
  { id: '2', name: 'CRM Dashboard', domain: 'crm.clientsite.in', branch: 'dev/crm-main', accessLevel: 'read-only', deadline: '2026-03-20', progress: 35, filesUnlocked: 0, totalFiles: 42, lastActivity: '2 hours ago' },
  { id: '3', name: 'API Gateway', domain: 'api.softwarevala.com', branch: 'main', accessLevel: 'locked', deadline: '-', progress: 0, filesUnlocked: 0, totalFiles: 18, lastActivity: 'Not assigned' },
];

const DevSourceCodeLock: React.FC = () => {
  const accessIcons = {
    'full': { icon: Unlock, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'Full Access' },
    'read-only': { icon: Eye, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'View Only' },
    'locked': { icon: Lock, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'Locked' },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <FolderLock className="w-7 h-7 text-cyan-400" />
          Source Code Lock
        </h1>
        <p className="text-slate-400 mt-1">You can only edit code on your assigned domain & project</p>
      </div>

      {/* Security Notice */}
      <Card className="bg-slate-900/50 border-cyan-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-white font-medium">Code Access Policy</p>
              <p className="text-xs text-slate-400 mt-1">
                Source code is locked per domain assignment. You can only modify files in your assigned project branch. 
                All changes are tracked, reviewed by Vala AI, and require approval before merge.
                Copying, downloading, or screenshotting code is <span className="text-red-400 font-medium">strictly prohibited</span>.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Assigned Projects', value: '1', icon: Globe, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'Files Unlocked', value: '24', icon: Unlock, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'View-Only', value: '1', icon: Eye, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Locked Projects', value: '1', icon: Lock, color: 'text-red-400', bg: 'bg-red-500/10' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">{stat.label}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Project List */}
      <div className="space-y-3">
        {mockProjects.map((project, i) => {
          const access = accessIcons[project.accessLevel];
          const AccessIcon = access.icon;
          return (
            <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={`bg-slate-900/50 border-slate-700/50 ${project.accessLevel === 'full' ? 'hover:border-emerald-500/30' : ''} transition-colors`}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl ${access.bg} flex items-center justify-center`}>
                        <AccessIcon className={`w-6 h-6 ${access.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-white">{project.name}</p>
                          <Badge variant="outline" className={`text-[10px] ${access.color} ${access.bg} border-none`}>
                            {access.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Globe className="w-3 h-3" /> {project.domain}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <GitBranch className="w-3 h-3" /> {project.branch}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Files</p>
                        <p className="text-sm font-medium text-white">{project.filesUnlocked}/{project.totalFiles}</p>
                      </div>
                      {project.accessLevel === 'full' && (
                        <div className="text-right">
                          <p className="text-xs text-slate-400">Deadline</p>
                          <p className="text-sm font-medium text-white">{project.deadline}</p>
                        </div>
                      )}
                      <div className="text-right">
                        <p className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> Last</p>
                        <p className="text-xs text-slate-400">{project.lastActivity}</p>
                      </div>
                    </div>
                  </div>
                  
                  {project.accessLevel === 'full' && (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-emerald-400">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-1.5" />
                    </div>
                  )}

                  {project.accessLevel === 'locked' && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/5 border border-red-500/10 mt-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-xs text-red-400">This project is not assigned to you. Request access from your manager.</span>
                    </div>
                  )}

                  {project.accessLevel === 'read-only' && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/5 border border-amber-500/10 mt-2">
                      <Eye className="w-4 h-4 text-amber-400" />
                      <span className="text-xs text-amber-400">View-only access. You can read code but cannot make changes.</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Anti-Copy Notice */}
      <Card className="bg-slate-900/50 border-red-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-sm text-red-400 font-medium">Anti-Leak Protection Active</p>
              <p className="text-xs text-slate-500 mt-0.5">Copy/paste, screenshots, screen recording, and dev tools are disabled. All code interactions are logged.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DevSourceCodeLock;

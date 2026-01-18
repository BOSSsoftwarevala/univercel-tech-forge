/**
 * DEV VERSIONS
 * Version control with rollback capability
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GitBranch, 
  RotateCcw,
  Lock,
  CheckCircle,
  AlertTriangle,
  Clock,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Version {
  id: string;
  version: string;
  project: string;
  status: 'current' | 'stable' | 'faulty';
  createdAt: string;
  createdBy: string;
  changes: string;
}

const versions: Version[] = [
  { id: '1', version: 'v2.1.4', project: 'CRM-Pro', status: 'current', createdAt: '2 hours ago', createdBy: 'AI Build', changes: 'Bug fixes and performance improvements' },
  { id: '2', version: 'v2.1.3', project: 'CRM-Pro', status: 'stable', createdAt: '1 day ago', createdBy: 'AI Build', changes: 'Added email integration' },
  { id: '3', version: 'v2.1.2', project: 'CRM-Pro', status: 'faulty', createdAt: '3 days ago', createdBy: 'AI Build', changes: 'Dashboard redesign (known issues)' },
  { id: '4', version: 'v2.1.1', project: 'CRM-Pro', status: 'stable', createdAt: '1 week ago', createdBy: 'AI Build', changes: 'User management updates' },
  { id: '5', version: 'v2.1.0', project: 'CRM-Pro', status: 'stable', createdAt: '2 weeks ago', createdBy: 'AI Build', changes: 'Major release with new features' },
];

export const DevVersions: React.FC = () => {
  const handleRollback = (version: string) => {
    toast.success(`Rollback to ${version} initiated`);
  };

  const handleFreeze = (version: string) => {
    toast.success(`Version ${version} has been frozen`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-purple-400" />
          Versions
        </h1>
        <p className="text-sm text-muted-foreground">Version control with rollback capability</p>
      </div>

      {/* Version List */}
      <div className="space-y-3">
        {versions.map((ver, index) => (
          <motion.div
            key={ver.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={cn(
              "bg-card/80",
              ver.status === 'current' ? "border-primary/50" :
              ver.status === 'faulty' ? "border-red-500/30" : "border-border/50"
            )}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center",
                      ver.status === 'current' ? "bg-primary/20" :
                      ver.status === 'faulty' ? "bg-red-500/20" : "bg-muted/50"
                    )}>
                      {ver.status === 'current' ? (
                        <CheckCircle className="w-6 h-6 text-primary" />
                      ) : ver.status === 'faulty' ? (
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                      ) : (
                        <GitBranch className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-foreground">{ver.version}</span>
                        <Badge className={cn(
                          "text-xs",
                          ver.status === 'current' ? "bg-primary/20 text-primary" :
                          ver.status === 'faulty' ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
                        )}>
                          {ver.status === 'current' ? 'Current' : ver.status === 'faulty' ? 'Faulty' : 'Stable'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{ver.changes}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {ver.createdAt}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {ver.createdBy}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {ver.status !== 'current' && ver.status !== 'faulty' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRollback(ver.version)}
                        className="text-primary border-primary/50 hover:bg-primary/10"
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Rollback
                      </Button>
                    )}
                    {ver.status === 'faulty' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleFreeze(ver.version)}
                        className="text-red-400 border-red-500/50 hover:bg-red-500/10"
                      >
                        <Lock className="w-4 h-4 mr-1" />
                        Freeze
                      </Button>
                    )}
                    {ver.status === 'current' && (
                      <Badge variant="outline" className="text-primary border-primary/50">
                        Active
                      </Badge>
                    )}
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

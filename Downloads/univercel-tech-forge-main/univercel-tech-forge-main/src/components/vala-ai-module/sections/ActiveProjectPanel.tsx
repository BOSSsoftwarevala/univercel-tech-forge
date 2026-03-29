/**
 * VALA AI - Active Project Panel
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderOpen,
  FileCode,
  Globe,
  GitBranch,
  Clock,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Layers,
  Database,
  Server,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const MOCK_PROJECT = {
  name: 'Restaurant POS System',
  status: 'active',
  lastBuild: '2 min ago',
  domain: 'restaurant-pos.softwarevala.com',
  repo: 'github.com/BOSSsoftwarevala/restaurant-pos',
  screens: 12,
  apis: 18,
  tables: 8,
  progress: 85,
  files: [
    { name: 'src/App.tsx', status: 'modified', size: '4.2 KB' },
    { name: 'src/pages/Dashboard.tsx', status: 'new', size: '8.1 KB' },
    { name: 'src/pages/Orders.tsx', status: 'new', size: '6.3 KB' },
    { name: 'src/components/MenuGrid.tsx', status: 'new', size: '3.8 KB' },
    { name: 'src/api/routes.ts', status: 'new', size: '2.1 KB' },
    { name: 'database/schema.sql', status: 'new', size: '1.5 KB' },
  ],
  recentActions: [
    { action: 'Generated 12 screens', time: '2 min ago' },
    { action: 'Created database schema', time: '3 min ago' },
    { action: 'API endpoints designed', time: '4 min ago' },
    { action: 'Build deployed to demo', time: '5 min ago' },
  ],
};

const ActiveProjectPanel: React.FC = () => {
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      toast.success('Project synced successfully');
    }, 1200);
  };

  const handleOpenDemo = () => {
    toast.info(`Opening: ${MOCK_PROJECT.domain}`);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 py-4 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/15">
            <FolderOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">{MOCK_PROJECT.name}</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Active
              </span>
              <span>•</span>
              <span>Last build: {MOCK_PROJECT.lastBuild}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-xs gap-1.5"
            onClick={handleSync}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            Sync
          </Button>
          <Button size="sm" className="h-8 px-3 text-xs gap-1.5" onClick={handleOpenDemo}>
            <ExternalLink className="w-3.5 h-3.5" />
            Open Demo
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[{
              label: 'Screens',
              value: MOCK_PROJECT.screens,
              icon: Layers,
            }, {
              label: 'APIs',
              value: MOCK_PROJECT.apis,
              icon: Server,
            }, {
              label: 'DB Tables',
              value: MOCK_PROJECT.tables,
              icon: Database,
            }, {
              label: 'Progress',
              value: `${MOCK_PROJECT.progress}%`,
              icon: Eye,
            }].map((stat) => (
              <Card key={stat.label} className="bg-card/60 border-border/50">
                <CardContent className="p-4">
                  <stat.icon className="w-4 h-4 mb-2 text-primary" />
                  <div className="text-xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Card className="bg-card/60 border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-xs font-semibold text-foreground">Demo Domain</div>
                  <div className="text-[11px] font-mono text-muted-foreground">{MOCK_PROJECT.domain}</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/60 border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <GitBranch className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-xs font-semibold text-foreground">Repository</div>
                  <div className="text-[11px] font-mono text-muted-foreground">{MOCK_PROJECT.repo}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-primary" />
              Generated Files
            </h3>
            <Card className="bg-card/60 border-border/50">
              <CardContent className="p-2">
                {MOCK_PROJECT.files.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileCode className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="text-xs font-mono text-foreground/80 truncate">{file.name}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] text-muted-foreground">{file.size}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/15 text-primary">
                        {file.status}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Recent Actions
            </h3>
            <Card className="bg-card/60 border-border/50">
              <CardContent className="p-3 space-y-2">
                {MOCK_PROJECT.recentActions.map((action, i) => (
                  <motion.div
                    key={`${action.action}-${i}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/20"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs text-foreground/80 flex-1">{action.action}</span>
                    <span className="text-[10px] text-muted-foreground">{action.time}</span>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ActiveProjectPanel;

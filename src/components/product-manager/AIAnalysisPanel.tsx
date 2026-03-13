import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bot, FolderTree, Cpu, Package, Shield, Rocket,
  Terminal, RefreshCw, ChevronRight, ChevronDown,
  Activity
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import ProjectStructureTree from './ProjectStructureTree';
import FrameworkDetection from './FrameworkDetection';
import SecurityIssuesPanel from './SecurityIssuesPanel';
import DeploymentReadiness from './DeploymentReadiness';
import BuildLogsViewer from './BuildLogsViewer';
import { toast } from 'sonner';

type PanelSection = 'structure' | 'frameworks' | 'missing' | 'security' | 'deployment' | 'logs';

interface PanelSectionConfig {
  id: PanelSection;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
}

const SECTIONS: PanelSectionConfig[] = [
  { id: 'structure', label: 'Project Structure', icon: FolderTree },
  { id: 'frameworks', label: 'Frameworks', icon: Cpu, badge: '6', badgeColor: 'text-blue-400' },
  { id: 'missing', label: 'Missing Packages', icon: Package, badge: '4', badgeColor: 'text-amber-400' },
  { id: 'security', label: 'Security Issues', icon: Shield, badge: '2', badgeColor: 'text-orange-400' },
  { id: 'deployment', label: 'Deploy Readiness', icon: Rocket },
  { id: 'logs', label: 'Build Logs', icon: Terminal },
];

const MISSING_PACKAGES = [
  { name: '@types/node', reason: 'TypeScript definitions for Node.js', severity: 'required' },
  { name: 'eslint-config-prettier', reason: 'Formatting conflict resolver', severity: 'recommended' },
  { name: 'husky', reason: 'Git hooks for pre-commit checks', severity: 'optional' },
  { name: 'dotenv-vault', reason: 'Secure environment variable management', severity: 'optional' },
];

interface AIAnalysisPanelProps {
  className?: string;
}

const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({ className }) => {
  const [activeSection, setActiveSection] = useState<PanelSection>('structure');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsRefreshing(false);
    toast.success('Analysis updated');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'structure':
        return (
          <div className="p-3">
            <ProjectStructureTree />
          </div>
        );
      case 'frameworks':
        return (
          <div className="p-3">
            <FrameworkDetection />
          </div>
        );
      case 'missing':
        return (
          <div className="p-3 space-y-1.5">
            {MISSING_PACKAGES.map((pkg, idx) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/50"
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <Package className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="text-[11px] font-mono font-medium text-slate-300">{pkg.name}</span>
                  <Badge
                    className={cn(
                      'text-[9px] h-3.5 px-1.5 ml-auto',
                      pkg.severity === 'required'
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : pkg.severity === 'recommended'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-slate-700 text-slate-500 border-slate-600'
                    )}
                  >
                    {pkg.severity}
                  </Badge>
                </div>
                <p className="text-[10px] text-slate-600 pl-5">{pkg.reason}</p>
              </motion.div>
            ))}
            <Button
              size="sm"
              className="w-full mt-2 h-8 text-xs bg-violet-600/20 text-violet-300 border border-violet-500/30 hover:bg-violet-600/30"
            >
              Install All Missing Packages
            </Button>
          </div>
        );
      case 'security':
        return (
          <div className="p-3">
            <SecurityIssuesPanel />
          </div>
        );
      case 'deployment':
        return (
          <div className="p-3">
            <DeploymentReadiness onDeploy={() => toast.success('Deployment initiated!')} />
          </div>
        );
      case 'logs':
        return (
          <div className="p-3">
            <BuildLogsViewer isLive />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        'w-80 flex flex-col bg-slate-900/50 border-l border-slate-800 h-full',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800">
        <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
          <Bot className="w-3.5 h-3.5 text-violet-400" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-200">AI Analysis</p>
          <div className="flex items-center gap-1">
            <Activity className="w-2.5 h-2.5 text-emerald-400" />
            <span className="text-[10px] text-slate-500">Live analysis</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          className="ml-auto h-7 w-7 p-0 text-slate-500 hover:text-slate-300"
        >
          <RefreshCw className={cn('w-3.5 h-3.5', isRefreshing && 'animate-spin')} />
        </Button>
      </div>

      {/* Section nav */}
      <div className="border-b border-slate-800">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                'w-full flex items-center gap-2.5 px-4 py-2 text-left transition-colors',
                isActive
                  ? 'bg-violet-500/10 border-r-2 border-violet-500 text-violet-300'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'
              )}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="text-xs flex-1">{section.label}</span>
              {section.badge && (
                <span className={cn('text-[10px] font-medium', section.badgeColor || 'text-slate-500')}>
                  {section.badge}
                </span>
              )}
              {isActive ? (
                <ChevronDown className="w-3 h-3 text-slate-600" />
              ) : (
                <ChevronRight className="w-3 h-3 text-slate-700" />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          {renderContent()}
        </motion.div>
      </ScrollArea>
    </div>
  );
};

export default AIAnalysisPanel;

import { useState } from 'react';
import softwareValaLogo from '@/assets/software-vala-logo-transparent.png';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Users, GitBranch, Layers, UserPlus, Activity,
  Zap, Brain, Copy, ShieldAlert, Globe, Plug, FileBarChart, Settings,
  ChevronDown, ChevronRight, Target, TrendingUp
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { leadManagerSidebarItems } from './data/leadData';

interface LMEnterpriseSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const iconMap: Record<string, any> = {
  LayoutDashboard, Users, GitBranch, Layers, UserPlus, Activity,
  Zap, Brain, Copy, ShieldAlert, Globe, Plug, FileBarChart, Settings
};

const LMEnterpriseSidebar = ({ activeSection, onSectionChange }: LMEnterpriseSidebarProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['sources']);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col z-50"
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-border flex justify-center">
        <img src={softwareValaLogo} alt="Software Vala Logo" className="w-14 h-14 rounded-full object-contain border-2 border-cyan-500/30" />
      </div>

      {/* Quick Stats */}
      <div className="p-3 border-b border-border">
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-lg font-bold text-primary">3,717</p>
            <p className="text-xs text-muted-foreground">Total Leads</p>
          </div>
          <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <p className="text-lg font-bold text-green-500">24.8%</p>
            </div>
            <p className="text-xs text-muted-foreground">Conversion</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-0.5">
          {leadManagerSidebarItems.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const isActive = activeSection === item.id;
            const hasChildren = item.id === 'sources' || item.id === 'pipeline';
            const isExpanded = expandedItems.includes(item.id);

            return (
              <div key={item.id}>
                <motion.button
                  onClick={() => {
                    if (hasChildren) {
                      toggleExpand(item.id);
                    }
                    onSectionChange(item.id);
                  }}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${
                    isActive
                      ? 'bg-primary/15 text-primary border border-primary/30'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
                  <span className="font-medium flex-1 text-left">{item.label}</span>
                  {item.badge > 0 && (
                    <Badge 
                      variant="secondary" 
                      className={`text-xs px-1.5 py-0 ${
                        item.id === 'fraud_filter' 
                          ? 'bg-red-500/20 text-red-400 border-red-500/30'
                          : item.id === 'duplicates'
                          ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                          : 'bg-primary/20 text-primary border-primary/30'
                      }`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                  {hasChildren && (
                    isExpanded 
                      ? <ChevronDown className="w-4 h-4" />
                      : <ChevronRight className="w-4 h-4" />
                  )}
                </motion.button>

                {/* Sub-items for Sources */}
                {item.id === 'sources' && isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-4 pl-3 border-l border-border/50 mt-1 space-y-0.5"
                  >
                    {['Website', 'Meta / Facebook', 'Google', 'WhatsApp', 'Manual', 'API / Webhook'].map((source) => (
                      <button
                        key={source}
                        onClick={() => onSectionChange(`source_${source.toLowerCase().replace(/[^a-z]/g, '_')}`)}
                        className="w-full text-left px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors"
                      >
                        {source}
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* Sub-items for Pipeline */}
                {item.id === 'pipeline' && isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-4 pl-3 border-l border-border/50 mt-1 space-y-0.5"
                  >
                    {['New', 'Contacted', 'Qualified', 'Interested', 'Proposal Sent', 'Negotiation', 'Won', 'Lost', 'Dormant'].map((stage) => (
                      <button
                        key={stage}
                        onClick={() => onSectionChange(`stage_${stage.toLowerCase().replace(/\s+/g, '_')}`)}
                        className="w-full text-left px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors"
                      >
                        {stage}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <div className="p-2 rounded-lg bg-accent/50 border border-border">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-muted-foreground">AI Scoring Active</span>
          </div>
          <div className="flex items-center gap-2 text-xs mt-1">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-muted-foreground">Auto-Routing Enabled</span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default LMEnterpriseSidebar;

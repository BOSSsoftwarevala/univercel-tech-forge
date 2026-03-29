import { motion } from 'framer-motion';
import { PlayCircle, Eye, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface DemoCategory {
  name: string;
  count: number;
  views: number;
  conversions: number;
  health: 'good' | 'warning' | 'critical';
}

const demoCategories: DemoCategory[] = [
  { name: 'Healthcare CRM', count: 9, views: 2847, conversions: 127, health: 'good' },
  { name: 'E-commerce Suite', count: 9, views: 3291, conversions: 189, health: 'good' },
  { name: 'Education ERP', count: 9, views: 1892, conversions: 84, health: 'good' },
  { name: 'Real Estate', count: 9, views: 2103, conversions: 112, health: 'warning' },
  { name: 'Manufacturing', count: 4, views: 892, conversions: 34, health: 'critical' },
];

const DemoStatus = ({ delay = 0 }: { delay?: number }) => {
  const getHealthIcon = (health: DemoCategory['health']) => {
    switch (health) {
      case 'good': return <CheckCircle2 className="w-3.5 h-3.5 text-neon-green" />;
      case 'warning': return <AlertCircle className="w-3.5 h-3.5 text-neon-orange" />;
      case 'critical': return <AlertCircle className="w-3.5 h-3.5 text-neon-red" />;
    }
  };

  const totalDemos = demoCategories.reduce((acc, cat) => acc + cat.count, 0);
  const totalViews = demoCategories.reduce((acc, cat) => acc + cat.views, 0);
  const totalConversions = demoCategories.reduce((acc, cat) => acc + cat.conversions, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="glass-panel p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Demo Manager</h3>
        <span className="px-2 py-0.5 rounded-full bg-neon-green/20 text-neon-green text-xs font-medium">
          {totalDemos} Active
        </span>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-2 rounded-lg bg-secondary/50">
          <PlayCircle className="w-4 h-4 mx-auto mb-1 text-primary" />
          <div className="font-mono text-lg font-bold text-foreground">{totalDemos}</div>
          <div className="text-[10px] text-muted-foreground">Demos</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-secondary/50">
          <Eye className="w-4 h-4 mx-auto mb-1 text-neon-cyan" />
          <div className="font-mono text-lg font-bold text-foreground">{(totalViews / 1000).toFixed(1)}k</div>
          <div className="text-[10px] text-muted-foreground">Views</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-secondary/50">
          <TrendingUp className="w-4 h-4 mx-auto mb-1 text-neon-green" />
          <div className="font-mono text-lg font-bold text-foreground">{totalConversions}</div>
          <div className="text-[10px] text-muted-foreground">Leads</div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        {demoCategories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + (index * 0.05) }}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              {getHealthIcon(category.health)}
              <span className="text-sm text-foreground">{category.name}</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-muted-foreground">{category.count} demos</span>
              <span className="text-neon-cyan font-mono">{category.views} views</span>
              <span className="text-neon-green font-mono">{category.conversions} conv</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DemoStatus;
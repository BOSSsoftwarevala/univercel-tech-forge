import { motion } from 'framer-motion';
import { Shield, Check, X, Brain, Zap, Database, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const permissionsData = [
  { 
    role: 'Super Admin', 
    generative: true, 
    lite: true, 
    cache: true, 
    settings: true,
    description: 'Full access to all AI modes and settings'
  },
  { 
    role: 'Prime User', 
    generative: true, 
    lite: true, 
    cache: true, 
    settings: false,
    description: 'Limited access with priority processing'
  },
  { 
    role: 'Franchise', 
    generative: false, 
    lite: true, 
    cache: true, 
    settings: false,
    description: 'Lite and cached responses only'
  },
  { 
    role: 'Reseller', 
    generative: false, 
    lite: true, 
    cache: true, 
    settings: false,
    description: 'Lite mode for demos and support'
  },
  { 
    role: 'Developer', 
    generative: false, 
    lite: true, 
    cache: true, 
    settings: false,
    description: 'No generative AI access'
  },
  { 
    role: 'Support', 
    generative: false, 
    lite: true, 
    cache: true, 
    settings: false,
    description: 'Lite mode for customer support'
  },
  { 
    role: 'Marketing', 
    generative: true, 
    lite: true, 
    cache: true, 
    settings: false,
    description: 'Full AI for content generation'
  },
  { 
    role: 'SEO Manager', 
    generative: true, 
    lite: true, 
    cache: true, 
    settings: false,
    description: 'Full AI for SEO optimization'
  },
];

const PermissionsScreen = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground font-mono flex items-center gap-3">
          <Shield className="w-6 h-6 text-primary" />
          AI Permissions Matrix
        </h2>
        <Badge variant="outline" className="text-xs">
          <Lock className="w-3 h-3 mr-1" />
          Role-Based Access Control
        </Badge>
      </div>

      {/* Permissions Table */}
      <motion.div 
        className="metric-card overflow-x-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left py-4 px-4 text-sm font-medium text-foreground">Role</th>
              <th className="text-center py-4 px-4">
                <div className="flex flex-col items-center gap-1">
                  <Brain className="w-5 h-5 text-neon-purple" />
                  <span className="text-xs text-muted-foreground">Generative</span>
                </div>
              </th>
              <th className="text-center py-4 px-4">
                <div className="flex flex-col items-center gap-1">
                  <Zap className="w-5 h-5 text-neon-cyan" />
                  <span className="text-xs text-muted-foreground">Lite</span>
                </div>
              </th>
              <th className="text-center py-4 px-4">
                <div className="flex flex-col items-center gap-1">
                  <Database className="w-5 h-5 text-neon-green" />
                  <span className="text-xs text-muted-foreground">Cache</span>
                </div>
              </th>
              <th className="text-center py-4 px-4">
                <div className="flex flex-col items-center gap-1">
                  <Shield className="w-5 h-5 text-gold" />
                  <span className="text-xs text-muted-foreground">Settings</span>
                </div>
              </th>
              <th className="text-left py-4 px-4 text-sm font-medium text-foreground">Description</th>
            </tr>
          </thead>
          <tbody>
            {permissionsData.map((row, idx) => (
              <motion.tr 
                key={row.role}
                className="border-b border-border/30 hover:bg-secondary/30 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <td className="py-4 px-4">
                  <span className="font-medium text-foreground">{row.role}</span>
                </td>
                <td className="text-center py-4 px-4">
                  {row.generative ? (
                    <motion.div 
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-neon-purple/20"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Check className="w-4 h-4 text-neon-purple" />
                    </motion.div>
                  ) : (
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary/50">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </td>
                <td className="text-center py-4 px-4">
                  {row.lite ? (
                    <motion.div 
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-neon-cyan/20"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Check className="w-4 h-4 text-neon-cyan" />
                    </motion.div>
                  ) : (
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary/50">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </td>
                <td className="text-center py-4 px-4">
                  {row.cache ? (
                    <motion.div 
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-neon-green/20"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Check className="w-4 h-4 text-neon-green" />
                    </motion.div>
                  ) : (
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary/50">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </td>
                <td className="text-center py-4 px-4">
                  {row.settings ? (
                    <motion.div 
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold/20"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Check className="w-4 h-4 text-gold" />
                    </motion.div>
                  ) : (
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary/50">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </td>
                <td className="py-4 px-4">
                  <span className="text-xs text-muted-foreground">{row.description}</span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {[
          { icon: Brain, label: 'Generative AI', color: 'neon-purple', desc: 'Full AI capabilities' },
          { icon: Zap, label: 'Lite Mode', color: 'neon-cyan', desc: 'Lightweight processing' },
          { icon: Database, label: 'Cache Mode', color: 'neon-green', desc: 'Cached responses' },
          { icon: Shield, label: 'Admin Settings', color: 'gold', desc: 'System configuration' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
            >
              <Icon className={`w-5 h-5 text-${item.color}`} />
              <div>
                <span className="text-sm font-medium text-foreground">{item.label}</span>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PermissionsScreen;

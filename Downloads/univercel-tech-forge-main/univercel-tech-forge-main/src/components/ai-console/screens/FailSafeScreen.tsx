import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, Shield, Power, MessageSquare, RefreshCw, 
  Clock, Zap, AlertOctagon, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

const fallbackMessages = [
  { id: 1, trigger: 'High Load', message: 'System optimizing performance. Your request is being processed with care.', active: true },
  { id: 2, trigger: 'AI Unavailable', message: 'Our AI systems are briefly updating. Please wait a moment.', active: true },
  { id: 3, trigger: 'Rate Limit', message: 'Processing your requests. Thank you for your patience.', active: true },
  { id: 4, trigger: 'Maintenance', message: 'Scheduled maintenance in progress. We appreciate your understanding.', active: false },
];

const FailSafeScreen = () => {
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [messages, setMessages] = useState(fallbackMessages);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground font-mono flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-neon-orange" />
          Fail-Safe Actions
        </h2>
        <Badge variant="outline" className={`${emergencyMode ? 'bg-destructive/20 text-destructive border-destructive/30' : 'bg-neon-green/20 text-neon-green border-neon-green/30'}`}>
          {emergencyMode ? 'Emergency Mode Active' : 'Normal Operations'}
        </Badge>
      </div>

      {/* Emergency Switch */}
      <motion.div 
        className={`metric-card border-2 ${emergencyMode ? 'border-destructive/50' : 'border-border/30'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                emergencyMode ? 'bg-destructive/20' : 'bg-secondary'
              }`}
              animate={emergencyMode ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Power className={`w-8 h-8 ${emergencyMode ? 'text-destructive' : 'text-muted-foreground'}`} />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Emergency AI Switch</h3>
              <p className="text-sm text-muted-foreground">
                {emergencyMode 
                  ? 'All AI requests are currently routed to cache fallback'
                  : 'AI systems operating normally with auto-routing'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-sm font-medium ${emergencyMode ? 'text-destructive' : 'text-muted-foreground'}`}>
              {emergencyMode ? 'ACTIVE' : 'STANDBY'}
            </span>
            <Switch 
              checked={emergencyMode}
              onCheckedChange={setEmergencyMode}
              className="data-[state=checked]:bg-destructive"
            />
          </div>
        </div>

        {emergencyMode && (
          <motion.div 
            className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertOctagon className="w-4 h-4" />
              <span className="text-sm font-medium">Emergency Mode Active</span>
            </div>
            <p className="text-xs text-muted-foreground">
              All generative AI requests are being served from cache. New requests will receive fallback messages.
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Force Cache', icon: RefreshCw, color: 'neon-green' },
          { label: 'Pause AI', icon: Clock, color: 'neon-orange' },
          { label: 'Lite Only', icon: Zap, color: 'neon-cyan' },
          { label: 'Full Reset', icon: Power, color: 'destructive' },
        ].map((action, idx) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={idx}
              className={`p-4 rounded-lg bg-secondary/30 border border-border/30 hover:bg-${action.color}/10 hover:border-${action.color}/30 transition-all duration-300 group`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className={`w-6 h-6 text-${action.color} mb-2 mx-auto group-hover:scale-110 transition-transform`} />
              <span className="text-sm font-medium text-foreground">{action.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Fallback Message Templates */}
      <motion.div 
        className="metric-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">Fallback Message Templates</span>
          </div>
          <Button variant="outline" size="sm" className="text-xs">
            Add Template
          </Button>
        </div>

        <div className="space-y-3">
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              className={`p-4 rounded-lg border ${msg.active ? 'bg-secondary/30 border-border/50' : 'bg-secondary/10 border-border/20 opacity-60'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {msg.trigger}
                  </Badge>
                  {msg.active && (
                    <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30 text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  )}
                </div>
                <Switch 
                  checked={msg.active}
                  onCheckedChange={(checked) => {
                    setMessages(messages.map(m => 
                      m.id === msg.id ? { ...m, active: checked } : m
                    ));
                  }}
                />
              </div>
              <p className="text-sm text-muted-foreground italic">"{msg.message}"</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Escalation Chain */}
      <motion.div 
        className="metric-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-gold" />
          <span className="text-sm font-medium text-foreground">Escalation Chain</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {['AI System', 'Cache Fallback', 'Lite Mode', 'Support Alert', 'Super Admin'].map((step, idx) => (
            <div key={idx} className="flex items-center">
              <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                idx === 0 ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
              }`}>
                {step}
              </div>
              {idx < 4 && (
                <div className="w-6 h-0.5 bg-border mx-1" />
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FailSafeScreen;

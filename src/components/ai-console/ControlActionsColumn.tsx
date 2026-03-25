import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, ToggleLeft, Brain, Zap, Database, 
  DollarSign, Bell, Key, RefreshCw, Timer, Shield
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ControlActionsColumnProps {
  currentMode: 'generative' | 'lite' | 'cache';
  onModeChange: (mode: 'generative' | 'lite' | 'cache') => void;
}

const ControlActionsColumn = ({ currentMode, onModeChange }: ControlActionsColumnProps) => {
  const [autoMode, setAutoMode] = useState(true);
  const [costLimit, setCostLimit] = useState([20000]);
  const [alertThreshold, setAlertThreshold] = useState([80]);

  const modeOptions = [
    { value: 'auto', label: 'Auto Mode', description: 'AI decides optimal mode', icon: Brain },
    { value: 'generative', label: 'Force Generative', description: 'Full AI capabilities', icon: Brain },
    { value: 'lite', label: 'Force Lite', description: 'Lightweight processing', icon: Zap },
    { value: 'cache', label: 'Force Cache', description: 'Cached responses only', icon: Database },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground font-mono flex items-center gap-2">
        <Settings className="w-5 h-5 text-primary" />
        Control Actions
      </h2>

      {/* Mode Toggle Section */}
      <motion.div 
        className="metric-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-foreground">AI Mode Control</span>
          <ToggleLeft className="w-4 h-4 text-primary" />
        </div>

        <div className="space-y-2">
          {modeOptions.map((option) => {
            const Icon = option.icon;
            const isActive = (option.value === 'auto' && autoMode) || 
                           (!autoMode && option.value === currentMode);
            
            return (
              <motion.button
                key={option.value}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 text-left ${
                  isActive 
                    ? 'bg-primary/20 border border-primary/50' 
                    : 'bg-secondary/30 border border-border/30 hover:bg-secondary/50'
                }`}
                onClick={() => {
                  if (option.value === 'auto') {
                    setAutoMode(true);
                  } else {
                    setAutoMode(false);
                    onModeChange(option.value as 'generative' | 'lite' | 'cache');
                  }
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isActive ? 'bg-primary/30' : 'bg-secondary'
                }`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1">
                  <span className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {option.label}
                  </span>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
                {isActive && (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Cost Guardrail Slider */}
      <motion.div 
        className="metric-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-foreground">Cost Guardrail</span>
          <DollarSign className="w-4 h-4 text-neon-orange" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Max Monthly Limit</span>
            <span className="text-sm font-bold text-neon-orange">${costLimit[0].toLocaleString()}</span>
          </div>
          <Slider
            value={costLimit}
            onValueChange={setCostLimit}
            max={50000}
            min={1000}
            step={1000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$1,000</span>
            <span>$50,000</span>
          </div>
        </div>
      </motion.div>

      {/* Cache Settings */}
      <motion.div 
        className="metric-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-foreground">Cache Settings</span>
          <Database className="w-4 h-4 text-neon-cyan" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Refresh Interval</Label>
            <Select defaultValue="1h">
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15m">15 min</SelectItem>
                <SelectItem value="30m">30 min</SelectItem>
                <SelectItem value="1h">1 hour</SelectItem>
                <SelectItem value="6h">6 hours</SelectItem>
                <SelectItem value="24h">24 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Expire Policy</Label>
            <Select defaultValue="7d">
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">1 day</SelectItem>
                <SelectItem value="3d">3 days</SelectItem>
                <SelectItem value="7d">7 days</SelectItem>
                <SelectItem value="30d">30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Auto Update</Label>
            <Switch defaultChecked />
          </div>
        </div>
      </motion.div>

      {/* Alert Settings */}
      <motion.div 
        className="metric-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-foreground">Alert Settings</span>
          <Bell className="w-4 h-4 text-neon-purple" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Alert at usage</span>
            <span className="text-sm font-bold text-neon-purple">{alertThreshold[0]}%</span>
          </div>
          <Slider
            value={alertThreshold}
            onValueChange={setAlertThreshold}
            max={100}
            min={50}
            step={5}
            className="w-full"
          />
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Notify: Super Admin</span>
            <Switch defaultChecked />
          </div>
        </div>
      </motion.div>

      {/* API Keys Section */}
      <motion.div 
        className="metric-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-foreground">API Keys</span>
          <Key className="w-4 h-4 text-gold" />
        </div>
        <div className="space-y-2">
          {[
            { label: 'Lightweight Model', status: 'active' },
            { label: 'Translation Model', status: 'active' },
            { label: 'Classification', status: 'pending' },
            { label: 'Generative Model', status: 'active' },
          ].map((key, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
              <span className="text-xs text-muted-foreground">{key.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                key.status === 'active' 
                  ? 'bg-neon-green/20 text-neon-green' 
                  : 'bg-neon-orange/20 text-neon-orange'
              }`}>
                {key.status}
              </span>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full mt-2 text-xs">
            <Key className="w-3 h-3 mr-1" />
            Manage API Keys
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ControlActionsColumn;

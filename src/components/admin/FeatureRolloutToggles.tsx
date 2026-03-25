import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ToggleLeft, ToggleRight, Users, Percent, Calendar,
  AlertTriangle, Check, X, Play, Pause, Trash2,
  Plus, Settings, Globe, Shield, Zap, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  key: string;
  enabled: boolean;
  rolloutPercentage: number;
  targetRoles: string[];
  targetRegions: string[];
  createdAt: Date;
  lastModified: Date;
  status: 'active' | 'paused' | 'scheduled';
  scheduledDate?: Date;
  usageCount: number;
}

const mockFeatures: FeatureFlag[] = [
  {
    id: '1',
    name: 'AI Task Assignment',
    description: 'Automatically assign tasks to developers using AI matching',
    key: 'ai_task_assignment',
    enabled: true,
    rolloutPercentage: 100,
    targetRoles: ['developer', 'task_manager'],
    targetRegions: ['all'],
    createdAt: new Date('2024-10-01'),
    lastModified: new Date('2024-12-15'),
    status: 'active',
    usageCount: 15234,
  },
  {
    id: '2',
    name: 'Real-time Collaboration',
    description: 'Enable live editing and collaboration on documents',
    key: 'realtime_collab',
    enabled: true,
    rolloutPercentage: 50,
    targetRoles: ['all'],
    targetRegions: ['IN', 'US', 'UK'],
    createdAt: new Date('2024-11-15'),
    lastModified: new Date('2024-12-18'),
    status: 'active',
    usageCount: 8923,
  },
  {
    id: '3',
    name: 'Video Demo Recording',
    description: 'Record and share video demonstrations of products',
    key: 'video_demo_recording',
    enabled: false,
    rolloutPercentage: 25,
    targetRoles: ['demo_manager', 'reseller'],
    targetRegions: ['all'],
    createdAt: new Date('2024-12-01'),
    lastModified: new Date('2024-12-10'),
    status: 'paused',
    usageCount: 456,
  },
  {
    id: '4',
    name: 'Advanced Fraud Detection',
    description: 'ML-based fraud detection for influencer clicks',
    key: 'advanced_fraud_detection',
    enabled: false,
    rolloutPercentage: 0,
    targetRoles: ['influencer', 'marketing_manager'],
    targetRegions: ['all'],
    createdAt: new Date('2024-12-20'),
    lastModified: new Date('2024-12-20'),
    status: 'scheduled',
    scheduledDate: new Date('2025-01-01'),
    usageCount: 0,
  },
  {
    id: '5',
    name: 'Multi-currency Wallets',
    description: 'Support for multiple currencies in wallet system',
    key: 'multi_currency_wallet',
    enabled: true,
    rolloutPercentage: 75,
    targetRoles: ['franchise', 'reseller', 'influencer'],
    targetRegions: ['IN', 'AE', 'SA'],
    createdAt: new Date('2024-11-01'),
    lastModified: new Date('2024-12-12'),
    status: 'active',
    usageCount: 4567,
  },
];

export function FeatureRolloutToggles() {
  const [features, setFeatures] = useState<FeatureFlag[]>(mockFeatures);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused' | 'scheduled'>('all');
  const [isCreating, setIsCreating] = useState(false);

  const filteredFeatures = features.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         f.key.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || f.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const toggleFeature = (id: string) => {
    setFeatures(features.map(f => 
      f.id === id ? { 
        ...f, 
        enabled: !f.enabled,
        status: !f.enabled ? 'active' : 'paused',
        lastModified: new Date()
      } : f
    ));
  };

  const updateRollout = (id: string, percentage: number) => {
    setFeatures(features.map(f =>
      f.id === id ? { ...f, rolloutPercentage: percentage, lastModified: new Date() } : f
    ));
  };

  const deleteFeature = (id: string) => {
    setFeatures(features.filter(f => f.id !== id));
    toast({
      title: "Feature Deleted",
      description: "The feature flag has been removed.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="w-4 h-4 text-green-500" />;
      case 'paused': return <Pause className="w-4 h-4 text-orange-500" />;
      case 'scheduled': return <Calendar className="w-4 h-4 text-blue-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-500 border-green-500/50';
      case 'paused': return 'bg-orange-500/20 text-orange-500 border-orange-500/50';
      case 'scheduled': return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-mono font-bold text-foreground flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Feature Rollout Toggles
          </h2>
          <p className="text-sm text-muted-foreground">Control feature flags and gradual rollouts</p>
        </div>
        
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Feature Flag
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-panel border-border/50">
            <DialogHeader>
              <DialogTitle>Create Feature Flag</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input placeholder="Feature Name" />
              <Input placeholder="Feature Key (e.g., my_feature)" className="font-mono" />
              <Input placeholder="Description" />
              <Button onClick={() => setIsCreating(false)} className="w-full">
                Create Feature Flag
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Features', value: features.length, color: 'text-primary' },
          { label: 'Active', value: features.filter(f => f.status === 'active').length, color: 'text-green-500' },
          { label: 'Paused', value: features.filter(f => f.status === 'paused').length, color: 'text-orange-500' },
          { label: 'Scheduled', value: features.filter(f => f.status === 'scheduled').length, color: 'text-blue-500' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-panel p-4 text-center"
          >
            <p className={`text-2xl font-mono font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search features..."
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Feature List */}
      <div className="space-y-3">
        {filteredFeatures.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="glass-panel p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                {/* Toggle */}
                <div className="pt-1">
                  <Switch
                    checked={feature.enabled}
                    onCheckedChange={() => toggleFeature(feature.id)}
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground">{feature.name}</h3>
                    <Badge variant="outline" className={getStatusColor(feature.status)}>
                      {getStatusIcon(feature.status)}
                      <span className="ml-1">{feature.status}</span>
                    </Badge>
                    {feature.scheduledDate && (
                      <Badge variant="outline" className="text-xs">
                        {feature.scheduledDate.toLocaleDateString()}
                      </Badge>
                    )}
                  </div>
                  <code className="text-xs text-muted-foreground font-mono">{feature.key}</code>
                  <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>

                  {/* Rollout Slider */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Rollout Percentage</span>
                      <span className="font-mono text-primary">{feature.rolloutPercentage}%</span>
                    </div>
                    <Slider
                      value={[feature.rolloutPercentage]}
                      onValueChange={([v]) => updateRollout(feature.id, v)}
                      max={100}
                      step={5}
                      className="w-full"
                      disabled={!feature.enabled}
                    />
                  </div>

                  {/* Target Info */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {feature.targetRoles.includes('all') 
                        ? 'All Roles' 
                        : feature.targetRoles.join(', ')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {feature.targetRegions.includes('all') 
                        ? 'Global' 
                        : feature.targetRegions.join(', ')}
                    </span>
                    <span className="font-mono">{feature.usageCount.toLocaleString()} uses</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => deleteFeature(feature.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default FeatureRolloutToggles;

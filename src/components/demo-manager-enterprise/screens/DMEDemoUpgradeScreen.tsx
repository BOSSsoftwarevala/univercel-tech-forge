/**
 * DEMO UPGRADE SCREEN (VALA AI)
 * AI-assisted demo fixes and upgrades
 * LOCK: No modifications without approval
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  Sparkles,
  Wrench,
  Zap,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight,
  Shield,
  Palette
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export const DMEDemoUpgradeScreen: React.FC = () => {
  const [upgradeRequest, setUpgradeRequest] = useState('');
  const [processing, setProcessing] = useState(false);

  const aiCapabilities = [
    { icon: Wrench, label: 'Fix demo bugs', allowed: true },
    { icon: Sparkles, label: 'Add missing features', allowed: true },
    { icon: Zap, label: 'Improve UI logic', allowed: true },
    { icon: ArrowRight, label: 'Optimize demo flow', allowed: true },
  ];

  const aiRestrictions = [
    { icon: Palette, label: 'Change theme', allowed: false },
    { icon: Palette, label: 'Change color', allowed: false },
    { icon: Palette, label: 'Change font', allowed: false },
    { icon: Shield, label: 'Access source export', allowed: false },
  ];

  const suggestions = [
    { id: 1, type: 'bug', title: 'Cart calculation error on discount', severity: 'high', status: 'pending' },
    { id: 2, type: 'feature', title: 'Add wishlist functionality', severity: 'medium', status: 'approved' },
    { id: 3, type: 'ui', title: 'Mobile navigation improvement', severity: 'low', status: 'applied' },
    { id: 4, type: 'flow', title: 'Optimize checkout process', severity: 'medium', status: 'pending' },
  ];

  const handleApply = async (id: number) => {
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setProcessing(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low': return 'bg-neon-green/20 text-neon-green border-neon-green/30';
      default: return 'bg-secondary text-muted-foreground border-border';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-neon-green/20 text-neon-green';
      case 'approved': return 'bg-neon-teal/20 text-neon-teal';
      case 'pending': return 'bg-amber-500/20 text-amber-400';
      default: return 'bg-secondary text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-teal to-primary flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            Demo Upgrade (Vala AI)
          </h1>
          <p className="text-muted-foreground text-sm mt-1">AI-assisted demo improvements</p>
        </div>
        <Badge className="bg-neon-teal/20 text-neon-teal border-neon-teal/30 animate-pulse">
          <Sparkles className="w-3 h-3 mr-1" />
          AI READY
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - AI Capabilities */}
        <div className="space-y-6">
          {/* Capabilities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-neon-green/5 border border-neon-green/30"
          >
            <h2 className="text-lg font-semibold text-neon-green mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Vala AI CAN
            </h2>
            <div className="space-y-3">
              {aiCapabilities.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-neon-green/10 border border-neon-green/20">
                  <item.icon className="w-5 h-5 text-neon-green" />
                  <span className="text-sm text-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Restrictions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl bg-red-500/5 border border-red-500/30"
          >
            <h2 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Vala AI CANNOT
            </h2>
            <div className="space-y-3">
              {aiRestrictions.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <item.icon className="w-5 h-5 text-red-400" />
                  <span className="text-sm text-muted-foreground line-through">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Upgrade Request */}
        <div className="space-y-6">
          {/* Request Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-card border border-border"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">Request Upgrade</h2>
            <Textarea
              placeholder="Describe what you want Vala AI to fix or improve in the demo..."
              value={upgradeRequest}
              onChange={(e) => setUpgradeRequest(e.target.value)}
              className="min-h-[120px] bg-background border-border resize-none mb-4"
            />
            <Button
              disabled={!upgradeRequest.trim() || processing}
              className="w-full bg-gradient-to-r from-neon-teal to-primary text-primary-foreground hover:opacity-90"
            >
              {processing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Submit to Vala AI
            </Button>
          </motion.div>

          {/* AI Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl bg-card border border-border"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">AI Suggestions</h2>
            <div className="space-y-3">
              {suggestions.map((item) => (
                <div key={item.id} className="p-4 rounded-lg bg-secondary/30 border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <Badge variant="outline" className={`mt-1 text-xs ${getSeverityColor(item.severity)}`}>
                        {item.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.toUpperCase()}
                    </Badge>
                  </div>
                  {item.status === 'pending' && (
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={() => handleApply(item.id)}
                        className="bg-neon-green/20 text-neon-green hover:bg-neon-green/30 border border-neon-green/30"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

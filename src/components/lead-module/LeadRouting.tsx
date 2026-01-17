/**
 * LEAD ROUTING (AUTO)
 */

import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Building2, Handshake, Users, Crown, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const routingRules = [
  { 
    priority: 1, 
    condition: 'Country has Local Franchise', 
    action: 'Route to Local Franchise',
    icon: Building2,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20'
  },
  { 
    priority: 2, 
    condition: 'No Franchise Available', 
    action: 'Route to Nearest Reseller',
    icon: Handshake,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20'
  },
  { 
    priority: 3, 
    condition: 'No Reseller Available', 
    action: 'Route to Central Sales Team',
    icon: Users,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20'
  },
  { 
    priority: 4, 
    condition: 'High Value Lead (Score > 90)', 
    action: 'Alert Boss + Priority Queue',
    icon: Crown,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20'
  },
];

const recentRoutes = [
  { lead: 'Rahul Sharma', country: 'India', routedTo: 'Mumbai Franchise', time: '5 min ago' },
  { lead: 'John Smith', country: 'USA', routedTo: 'Sales Team', time: '12 min ago' },
  { lead: 'Priya Patel', country: 'India', routedTo: 'Delhi Franchise', time: '18 min ago' },
  { lead: 'Ahmed Khan', country: 'UAE', routedTo: 'Dubai Reseller', time: '25 min ago' },
];

export const LeadRouting: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-emerald-400" />
          Lead Routing
        </h1>
        <p className="text-sm text-muted-foreground">Automatic lead assignment rules</p>
      </div>

      {/* Routing Rules */}
      <Card className="bg-card/80 border-border/50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Auto-Routing Rules</h3>
          <div className="space-y-3">
            {routingRules.map((rule, idx) => {
              const Icon = rule.icon;
              return (
                <motion.div
                  key={rule.priority}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center p-0">
                    {rule.priority}
                  </Badge>
                  <div className={`w-10 h-10 rounded-lg ${rule.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${rule.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{rule.condition}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-emerald-400">{rule.action}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Routes */}
      <Card className="bg-card/80 border-border/50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Recent Auto-Routes</h3>
          <div className="space-y-3">
            {recentRoutes.map((route, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/20"
              >
                <div>
                  <p className="font-medium text-foreground text-sm">{route.lead}</p>
                  <p className="text-xs text-muted-foreground">{route.country}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <div className="text-right">
                  <p className="text-sm text-emerald-400">{route.routedTo}</p>
                  <p className="text-xs text-muted-foreground">{route.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

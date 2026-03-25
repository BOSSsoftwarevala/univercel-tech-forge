/**
 * CONVERSIONS
 */

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShoppingCart, Package, Monitor, Bell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const recentConversions = [
  { id: '1', lead: 'Rahul Sharma', product: 'School ERP Pro', amount: 49999, date: 'Today', assignedTo: 'Mumbai Franchise', demo: true },
  { id: '2', lead: 'John Smith', product: 'Hospital Management', amount: 89999, date: 'Yesterday', assignedTo: 'Sales Team', demo: true },
  { id: '3', lead: 'Priya Patel', product: 'Franchise License', amount: 250000, date: '2 days ago', assignedTo: 'Admin', demo: false },
  { id: '4', lead: 'Ahmed Khan', product: 'Restaurant POS', amount: 29999, date: '3 days ago', assignedTo: 'Dubai Reseller', demo: true },
];

const stats = [
  { label: 'This Month', value: 156, change: '+23%' },
  { label: 'Revenue', value: '₹45.6L', change: '+18%' },
  { label: 'Avg Deal Size', value: '₹29.2K', change: '+5%' },
  { label: 'Conversion Rate', value: '18.5%', change: '+2.3%' },
];

export const Conversions: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          Conversions
        </h1>
        <p className="text-sm text-muted-foreground">Track lead-to-customer conversions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="bg-card/80 border-border/50">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <Badge className="bg-emerald-500/20 text-emerald-400 text-xs mt-1">{stat.change}</Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Conversion Actions Explained */}
      <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground mb-3">When Lead is Converted</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <ShoppingCart className="w-4 h-4 text-emerald-400" />
              <span>Create Order</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Package className="w-4 h-4 text-blue-400" />
              <span>Link Product</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Monitor className="w-4 h-4 text-violet-400" />
              <span>Assign Demo</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Notify Team</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Conversions */}
      <Card className="bg-card/80 border-border/50">
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground mb-4">Recent Conversions</h3>
          <div className="space-y-3">
            {recentConversions.map((conversion, idx) => (
              <motion.div
                key={conversion.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{conversion.lead}</p>
                    <p className="text-xs text-muted-foreground">{conversion.product}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-bold text-foreground">₹{conversion.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{conversion.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{conversion.assignedTo}</p>
                  {conversion.demo && <Badge variant="outline" className="text-xs">Demo Assigned</Badge>}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

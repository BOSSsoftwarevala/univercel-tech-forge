import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, TrendingUp, Bot, Globe, CheckCircle, AlertTriangle, Plus, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const districts = [
  { name: 'Mumbai', assigned: true, resellers: 12, leads: 89, revenue: '₹24L', performance: 92 },
  { name: 'Pune', assigned: true, resellers: 8, leads: 56, revenue: '₹18L', performance: 87 },
  { name: 'Nagpur', assigned: true, resellers: 5, leads: 34, revenue: '₹12L', performance: 78 },
  { name: 'Nashik', assigned: false, resellers: 0, leads: 0, revenue: '₹0', performance: 0 },
  { name: 'Thane', assigned: true, resellers: 6, leads: 45, revenue: '₹15L', performance: 84 },
];

const demandForecast = [
  { category: 'POS Systems', demand: 85, trend: 'up' },
  { category: 'School ERP', demand: 72, trend: 'up' },
  { category: 'Hospital Management', demand: 65, trend: 'stable' },
  { category: 'Restaurant Software', demand: 58, trend: 'down' },
];

export const TerritoryControlCenter = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-mono font-bold text-foreground">Territory Control Center</h2>
          <p className="text-sm text-muted-foreground">Manage your state/region assignments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-primary/30">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button className="bg-gradient-to-r from-primary to-neon-teal text-background">
            <Plus className="w-4 h-4 mr-2" />
            Request New Region
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Region Heatmap */}
        <Card className="lg:col-span-2 glass-panel border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <MapPin className="w-5 h-5 text-primary" />
              Region Heatmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {districts.map((district, index) => (
                <motion.div
                  key={district.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    district.assigned 
                      ? selectedDistrict === district.name
                        ? 'border-primary bg-primary/10'
                        : 'border-border/30 bg-secondary/20 hover:border-primary/50'
                      : 'border-dashed border-muted-foreground/30 bg-muted/10'
                  }`}
                  onClick={() => setSelectedDistrict(district.name)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{district.name}</span>
                    {district.assigned ? (
                      <CheckCircle className="w-4 h-4 text-neon-green" />
                    ) : (
                      <Globe className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  {district.assigned ? (
                    <>
                      <div className="text-xs text-muted-foreground mb-2">
                        {district.resellers} Resellers • {district.leads} Leads
                      </div>
                      <Progress value={district.performance} className="h-1.5" />
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-neon-green">{district.performance}% Performance</span>
                        <span className="text-xs font-mono text-primary">{district.revenue}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      Available for expansion
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Demand Forecast */}
        <Card className="glass-panel border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Bot className="w-5 h-5 text-primary" />
              AI Demand Forecast
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {demandForecast.map((item, index) => (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-lg bg-secondary/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{item.category}</span>
                  <Badge variant={item.trend === 'up' ? 'default' : item.trend === 'down' ? 'destructive' : 'secondary'}>
                    {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'}
                  </Badge>
                </div>
                <Progress value={item.demand} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{item.demand}% demand score</p>
              </motion.div>
            ))}
            <Button variant="outline" className="w-full border-primary/30 text-primary">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Full Analysis
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Reseller Cluster View */}
      <Card className="glass-panel border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Users className="w-5 h-5 text-primary" />
            Reseller Cluster Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-neon-green/10 border border-neon-green/30">
              <p className="text-2xl font-mono font-bold text-neon-green">31</p>
              <p className="text-sm text-muted-foreground">Active Resellers</p>
            </div>
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
              <p className="text-2xl font-mono font-bold text-primary">224</p>
              <p className="text-sm text-muted-foreground">Total Leads</p>
            </div>
            <div className="p-4 rounded-xl bg-neon-purple/10 border border-neon-purple/30">
              <p className="text-2xl font-mono font-bold text-neon-purple">₹69L</p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
            <div className="p-4 rounded-xl bg-neon-orange/10 border border-neon-orange/30">
              <p className="text-2xl font-mono font-bold text-neon-orange">85%</p>
              <p className="text-sm text-muted-foreground">Avg. Performance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, MapPin, Bot, Target, Users, BarChart3, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const cityPerformance = [
  { city: 'Mumbai', leads: 89, conversions: 34, ratio: 38, trend: 'up', revenue: '₹24L' },
  { city: 'Pune', leads: 56, conversions: 18, ratio: 32, trend: 'up', revenue: '₹18L' },
  { city: 'Nagpur', leads: 34, conversions: 8, ratio: 24, trend: 'down', revenue: '₹12L' },
  { city: 'Thane', leads: 45, conversions: 15, ratio: 33, trend: 'stable', revenue: '₹15L' },
];

const categoryDemand = [
  { category: 'POS System', demand: 92, change: '+15%' },
  { category: 'School ERP', demand: 78, change: '+8%' },
  { category: 'Hospital Management', demand: 65, change: '-3%' },
  { category: 'Restaurant Software', demand: 54, change: '+5%' },
  { category: 'CRM System', demand: 45, change: '+12%' },
];

const competitorThreats = [
  { competitor: 'TechPro Solutions', threat: 72, region: 'Mumbai', category: 'POS' },
  { competitor: 'EduSoft India', threat: 58, region: 'Pune', category: 'School ERP' },
  { competitor: 'MedTech Systems', threat: 45, region: 'Nagpur', category: 'Hospital' },
];

export const TerritoryInsights = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-mono font-bold text-foreground">Territory Insights</h2>
          <p className="text-sm text-muted-foreground">Performance analytics and AI-powered insights</p>
        </div>
        <Button variant="outline" className="border-primary/30">
          <Bot className="w-4 h-4 mr-2" />
          Generate AI Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="glass-panel border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Overall Conversion</span>
              <TrendingUp className="w-4 h-4 text-neon-green" />
            </div>
            <p className="text-3xl font-mono font-bold text-foreground">33.5%</p>
            <p className="text-xs text-neon-green">+5.2% vs last month</p>
          </CardContent>
        </Card>
        <Card className="glass-panel border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Revenue</span>
              <Target className="w-4 h-4 text-primary" />
            </div>
            <p className="text-3xl font-mono font-bold text-foreground">₹69L</p>
            <p className="text-xs text-primary">87% of target</p>
          </CardContent>
        </Card>
        <Card className="glass-panel border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Active Leads</span>
              <Users className="w-4 h-4 text-neon-purple" />
            </div>
            <p className="text-3xl font-mono font-bold text-foreground">224</p>
            <p className="text-xs text-neon-purple">45 hot leads</p>
          </CardContent>
        </Card>
        <Card className="glass-panel border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Competitor Threat</span>
              <AlertTriangle className="w-4 h-4 text-neon-orange" />
            </div>
            <p className="text-3xl font-mono font-bold text-foreground">58</p>
            <p className="text-xs text-neon-orange">AI threat score</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* City Performance */}
        <Card className="glass-panel border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <MapPin className="w-5 h-5 text-primary" />
              High/Low Performing Cities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cityPerformance.map((city, index) => (
              <motion.div
                key={city.city}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-secondary/20 border border-border/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{city.city}</span>
                    {city.trend === 'up' && <TrendingUp className="w-4 h-4 text-neon-green" />}
                    {city.trend === 'down' && <TrendingDown className="w-4 h-4 text-neon-red" />}
                  </div>
                  <span className="font-mono text-primary">{city.revenue}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <span>{city.leads} leads</span>
                  <span>{city.conversions} conversions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={city.ratio} className="flex-1 h-2" />
                  <span className={`text-sm font-medium ${
                    city.ratio >= 35 ? 'text-neon-green' : 
                    city.ratio >= 25 ? 'text-neon-orange' : 'text-neon-red'
                  }`}>{city.ratio}%</span>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Category Demand */}
        <Card className="glass-panel border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <BarChart3 className="w-5 h-5 text-primary" />
              Business Category Demand
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryDemand.map((item, index) => (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{item.category}</span>
                  <Badge variant={item.change.startsWith('+') ? 'default' : 'destructive'}>
                    {item.change}
                  </Badge>
                </div>
                <Progress value={item.demand} className="h-2" />
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Competitor Threat AI Score */}
      <Card className="glass-panel border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Bot className="w-5 h-5 text-primary" />
            AI Competitor Threat Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {competitorThreats.map((threat, index) => (
              <motion.div
                key={threat.competitor}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border ${
                  threat.threat >= 70 ? 'bg-neon-red/10 border-neon-red/30' :
                  threat.threat >= 50 ? 'bg-neon-orange/10 border-neon-orange/30' :
                  'bg-secondary/20 border-border/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{threat.competitor}</span>
                  <span className={`text-lg font-mono font-bold ${
                    threat.threat >= 70 ? 'text-neon-red' :
                    threat.threat >= 50 ? 'text-neon-orange' : 'text-neon-green'
                  }`}>{threat.threat}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline">{threat.region}</Badge>
                  <Badge variant="outline">{threat.category}</Badge>
                </div>
                <Progress 
                  value={threat.threat} 
                  className={`h-1.5 mt-2 ${
                    threat.threat >= 70 ? '[&>div]:bg-neon-red' :
                    threat.threat >= 50 ? '[&>div]:bg-neon-orange' : ''
                  }`} 
                />
              </motion.div>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/30">
            <p className="text-sm text-foreground">
              <strong>AI Recommendation:</strong> Focus on POS System promotions in Mumbai to counter TechPro Solutions. 
              Consider exclusive offers for school management in Pune region.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

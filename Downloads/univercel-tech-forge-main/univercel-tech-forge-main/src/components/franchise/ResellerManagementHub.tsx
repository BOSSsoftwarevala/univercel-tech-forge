import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, CheckCircle, XCircle, TrendingUp, MapPin, Wallet, BarChart3, Eye, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const resellers = [
  { 
    id: 1, 
    name: 'Tech Solutions Mumbai', 
    initials: 'TS',
    territory: 'Mumbai Central', 
    leads: 34, 
    conversions: 12, 
    commission: '₹2.4L',
    performance: 92,
    status: 'active'
  },
  { 
    id: 2, 
    name: 'Digital Pune', 
    initials: 'DP',
    territory: 'Pune East', 
    leads: 28, 
    conversions: 9, 
    commission: '₹1.8L',
    performance: 78,
    status: 'active'
  },
  { 
    id: 3, 
    name: 'InfoTech Nagpur', 
    initials: 'IN',
    territory: 'Nagpur', 
    leads: 15, 
    conversions: 4, 
    commission: '₹0.9L',
    performance: 65,
    status: 'pending'
  },
  { 
    id: 4, 
    name: 'Smart Systems Thane', 
    initials: 'SS',
    territory: 'Thane', 
    leads: 22, 
    conversions: 7, 
    commission: '₹1.5L',
    performance: 85,
    status: 'active'
  },
];

const commissionTiers = [
  { tier: 'Bronze', range: '0-5 sales', rate: '8%' },
  { tier: 'Silver', range: '6-15 sales', rate: '10%' },
  { tier: 'Gold', range: '16-30 sales', rate: '12%' },
  { tier: 'Platinum', range: '31+ sales', rate: '15%' },
];

export const ResellerManagementHub = () => {
  const [selectedReseller, setSelectedReseller] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-mono font-bold text-foreground">Reseller Management Hub</h2>
          <p className="text-sm text-muted-foreground">Manage your reseller network</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-neon-teal text-background">
          <Plus className="w-4 h-4 mr-2" />
          Add Reseller (Approval Required)
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        <Card className="glass-panel border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-neon-green/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-neon-green" />
              </div>
              <div>
                <p className="text-2xl font-mono font-bold text-foreground">{resellers.length}</p>
                <p className="text-xs text-muted-foreground">Total Resellers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-mono font-bold text-foreground">99</p>
                <p className="text-xs text-muted-foreground">Total Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-neon-purple/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-neon-purple" />
              </div>
              <div>
                <p className="text-2xl font-mono font-bold text-foreground">32</p>
                <p className="text-xs text-muted-foreground">Conversions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-neon-orange/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-neon-orange" />
              </div>
              <div>
                <p className="text-2xl font-mono font-bold text-foreground">₹6.6L</p>
                <p className="text-xs text-muted-foreground">Total Commission</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Reseller List */}
        <Card className="lg:col-span-2 glass-panel border-border/30">
          <CardHeader>
            <CardTitle className="text-foreground">Active Resellers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {resellers.map((reseller, index) => (
              <motion.div
                key={reseller.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedReseller === reseller.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border/30 bg-secondary/20 hover:border-primary/30'
                }`}
                onClick={() => setSelectedReseller(reseller.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-primary/50 to-neon-teal/50 text-foreground">
                        {reseller.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{reseller.name}</span>
                        <Badge variant={reseller.status === 'active' ? 'default' : 'secondary'}>
                          {reseller.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {reseller.territory}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-mono font-bold text-primary">{reseller.commission}</p>
                    <p className="text-xs text-muted-foreground">{reseller.conversions}/{reseller.leads} converted</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Performance</span>
                    <span className={`text-xs font-medium ${
                      reseller.performance >= 80 ? 'text-neon-green' : 
                      reseller.performance >= 60 ? 'text-neon-orange' : 'text-neon-red'
                    }`}>{reseller.performance}%</span>
                  </div>
                  <Progress value={reseller.performance} className="h-1.5" />
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Commission Structure */}
        <Card className="glass-panel border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <BarChart3 className="w-5 h-5 text-primary" />
              Commission Tiers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {commissionTiers.map((tier, index) => (
              <motion.div
                key={tier.tier}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border ${
                  tier.tier === 'Gold' ? 'bg-neon-orange/10 border-neon-orange/30' :
                  tier.tier === 'Platinum' ? 'bg-neon-purple/10 border-neon-purple/30' :
                  'bg-secondary/20 border-border/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`font-medium ${
                      tier.tier === 'Gold' ? 'text-neon-orange' :
                      tier.tier === 'Platinum' ? 'text-neon-purple' :
                      'text-foreground'
                    }`}>{tier.tier}</span>
                    <p className="text-xs text-muted-foreground">{tier.range}</p>
                  </div>
                  <span className="text-lg font-mono font-bold text-primary">{tier.rate}</span>
                </div>
              </motion.div>
            ))}
            <Button variant="outline" className="w-full mt-4 border-primary/30">
              <Settings className="w-4 h-4 mr-2" />
              Configure Tiers
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

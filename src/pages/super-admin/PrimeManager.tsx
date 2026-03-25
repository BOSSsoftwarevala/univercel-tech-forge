import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, Users, CreditCard, Calendar, Bell, TrendingUp, 
  Zap, Star, RefreshCw, AlertTriangle
} from 'lucide-react';
import SuperAdminLayout from '@/components/layouts/SuperAdminLayout';
import { PrimeUsersList } from '@/components/prime-management/PrimeUsersList';
import { SubscriptionManager } from '@/components/prime-management/SubscriptionManager';
import { PlanManager } from '@/components/prime-management/PlanManager';
import { FollowUpTracker } from '@/components/prime-management/FollowUpTracker';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const PrimeManager = () => {
  const [activeTab, setActiveTab] = useState('users');

  // Fetch prime stats
  const { data: stats } = useQuery({
    queryKey: ['prime-stats'],
    queryFn: async () => {
      const [primeUsers, activeSubscriptions, expiringSubscriptions, totalRevenue] = await Promise.all([
        supabase.from('prime_user_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('subscriptions').select('sub_id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('subscriptions').select('sub_id', { count: 'exact', head: true })
          .eq('status', 'active')
          .lt('expired_at', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('subscriptions').select('amount').eq('status', 'active')
      ]);

      const revenue = totalRevenue.data?.reduce((sum, s) => sum + Number(s.amount || 0), 0) || 0;

      return {
        totalPrimeUsers: primeUsers.count || 0,
        activeSubscriptions: activeSubscriptions.count || 0,
        expiringSubscriptions: expiringSubscriptions.count || 0,
        totalRevenue: revenue
      };
    }
  });

  const statCards = [
    { 
      label: 'Prime Users', 
      value: stats?.totalPrimeUsers || 0, 
      icon: Crown, 
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-400'
    },
    { 
      label: 'Active Subscriptions', 
      value: stats?.activeSubscriptions || 0, 
      icon: CreditCard, 
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-400'
    },
    { 
      label: 'Expiring Soon', 
      value: stats?.expiringSubscriptions || 0, 
      icon: AlertTriangle, 
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-400'
    },
    { 
      label: 'Total Revenue', 
      value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, 
      icon: TrendingUp, 
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-500/10',
      textColor: 'text-cyan-400'
    }
  ];

  return (
    <SuperAdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Crown className="w-7 h-7 text-stone-900" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                Prime Management
              </h1>
              <p className="text-muted-foreground">
                Manage prime users, subscriptions, plans & follow-ups
              </p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-900 px-4 py-2 text-sm">
            <Star className="w-4 h-4 mr-2" />
            VIP Control Center
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-card/50 border-amber-500/10 hover:border-amber-500/30 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.textColor}`}>
                        {stat.value}
                      </p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Tabs */}
        <Card className="bg-card/50 border-amber-500/10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <CardHeader className="pb-0">
              <TabsList className="grid grid-cols-4 gap-4 bg-muted/30 p-1">
                <TabsTrigger 
                  value="users" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-stone-900"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Prime Users
                </TabsTrigger>
                <TabsTrigger 
                  value="subscriptions"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-stone-900"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Subscriptions
                </TabsTrigger>
                <TabsTrigger 
                  value="plans"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-stone-900"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Plans
                </TabsTrigger>
                <TabsTrigger 
                  value="followups"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-stone-900"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Follow-ups
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="pt-6">
              <TabsContent value="users" className="mt-0">
                <PrimeUsersList />
              </TabsContent>
              <TabsContent value="subscriptions" className="mt-0">
                <SubscriptionManager />
              </TabsContent>
              <TabsContent value="plans" className="mt-0">
                <PlanManager />
              </TabsContent>
              <TabsContent value="followups" className="mt-0">
                <FollowUpTracker />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </SuperAdminLayout>
  );
};

export default PrimeManager;

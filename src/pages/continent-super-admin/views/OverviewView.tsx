// Continent Super Admin - Overview Screen (DB-Driven)
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe2, TrendingUp, AlertTriangle, Users, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { EmptyState } from '@/components/ui/empty-state';

const OverviewView = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ countries: 0, alerts: 0, managers: 0 });

  useEffect(() => {
    const fetch = async () => {
      try {
        const [countriesRes, alertsRes, managersRes] = await Promise.all([
          supabase.from('franchise_accounts').select('country').not('country', 'is', null),
          supabase.from('boss_alerts').select('id', { count: 'exact', head: true }).eq('is_resolved', false),
          supabase.from('area_manager_accounts').select('id', { count: 'exact', head: true }),
        ]);
        const uniqueCountries = new Set((countriesRes.data || []).map(f => f.country)).size;
        setData({
          countries: uniqueCountries,
          alerts: alertsRes.count || 0,
          managers: managersRes.count || 0,
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const summaryCards = [
    { title: 'Active Countries', value: loading ? '...' : String(data.countries), icon: Globe2, trend: 'From franchise data' },
    { title: 'Total Revenue', value: '—', icon: TrendingUp, trend: 'Connect billing to view' },
    { title: 'Pending Alerts', value: loading ? '...' : String(data.alerts), icon: AlertTriangle, trend: 'Unresolved alerts' },
    { title: 'Area Managers', value: loading ? '...' : String(data.managers), icon: Users, trend: 'Registered managers' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Overview</h1>
        <p className="text-muted-foreground">Continent summary and key metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                {loading ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : <card.icon className="h-4 w-4 text-muted-foreground" />}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{card.trend}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState title="No revenue data" description="Revenue chart will appear when billing data is available" />
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Risk Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-emerald-500/10 rounded-lg">
              <p className="text-2xl font-bold text-emerald-500">{data.alerts === 0 ? 'Low' : data.alerts > 5 ? 'High' : 'Medium'}</p>
              <p className="text-sm text-muted-foreground">Overall Risk</p>
            </div>
            <div className="p-4 bg-amber-500/10 rounded-lg">
              <p className="text-2xl font-bold text-amber-500">{data.alerts}</p>
              <p className="text-sm text-muted-foreground">Pending Alerts</p>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-lg">
              <p className="text-2xl font-bold text-blue-500">{data.countries}</p>
              <p className="text-sm text-muted-foreground">Active Countries</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewView;

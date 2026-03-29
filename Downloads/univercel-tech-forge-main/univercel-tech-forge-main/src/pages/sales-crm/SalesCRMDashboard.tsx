import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Trophy, XCircle, Clock, TrendingUp, ArrowUpRight, ArrowDownRight, Calendar, Target, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { EmptyState } from "@/components/ui/empty-state";

const SalesCRMDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ newLeads: 0, dealsWon: 0, dealsLost: 0, pendingFollowups: 0 });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const [leadsRes, recentRes] = await Promise.all([
          supabase.from('leads').select('id, status, created_at').gte('created_at', today),
          supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(10),
        ]);
        
        const todayLeads = leadsRes.data || [];
        setStats({
          newLeads: todayLeads.length,
          dealsWon: todayLeads.filter(l => l.status === 'closed_won').length,
          dealsLost: todayLeads.filter(l => l.status === 'closed_lost').length,
          pendingFollowups: todayLeads.filter(l => l.status === 'follow_up').length,
        });
        setRecentLeads(recentRes.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: "New Leads Today", value: String(stats.newLeads), change: "", trend: "up", icon: Users, color: "blue" },
    { label: "Deals Won", value: String(stats.dealsWon), change: "", trend: "up", icon: Trophy, color: "green" },
    { label: "Deals Lost", value: String(stats.dealsLost), change: "", trend: "down", icon: XCircle, color: "red" },
    { label: "Pending Follow-ups", value: String(stats.pendingFollowups), change: "", trend: "up", icon: Clock, color: "orange" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sales Dashboard</h1>
          <p className="text-slate-500 mt-1">Here's your sales overview.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2"><Calendar className="w-4 h-4" /> This Month</Button>
          <Button className="gap-2 bg-blue-500 hover:bg-blue-600"><Users className="w-4 h-4" /> Add Lead</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl bg-muted`}>
                    {loading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : <stat.icon className="w-6 h-6 text-muted-foreground" />}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-800">{loading ? '...' : stat.value}</p>
                  <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Target className="w-5 h-5 text-blue-500" />
              Sales Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState title="No funnel data" description="Sales funnel will populate as leads progress through stages" />
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-slate-800">
              <span className="flex items-center gap-2"><Users className="w-5 h-5 text-blue-500" /> Recent Leads</span>
              <Button variant="ghost" size="sm" className="text-blue-600">View All</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : recentLeads.length === 0 ? (
              <EmptyState title="No leads yet" description="Recent leads will appear here" />
            ) : (
              <div className="space-y-4">
                {recentLeads.map((lead, index) => (
                  <motion.div key={lead.id || index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium">
                      {(lead.name || lead.full_name || 'L').charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">{lead.name || lead.full_name || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">{lead.source || 'Direct'} • {new Date(lead.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">{lead.status || 'new'}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Monthly Sales Target
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState title="No target data" description="Sales targets will appear when configured" />
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesCRMDashboard;

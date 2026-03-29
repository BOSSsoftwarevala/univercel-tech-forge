import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scale, FileCheck, AlertTriangle, Copyright, Award, Globe, Eye, Edit, Lock, CheckCircle, History, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { EmptyState } from "@/components/ui/empty-state";

interface LMDashboardProps {
  activeSubSection: string;
}

const LMDashboard = ({ activeSubSection }: LMDashboardProps) => {
  const [loading, setLoading] = useState(true);
  const [agreements, setAgreements] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await supabase
          .from('system_events')
          .select('*')
          .eq('event_type', 'legal_agreement')
          .order('created_at', { ascending: false })
          .limit(10);
        setAgreements(data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleAction = (action: string, item: string) => {
    const actions: Record<string, () => void> = {
      view: () => toast.info(`Viewing: ${item}`),
      edit: () => toast.info(`Editing: ${item}`),
      lock: () => toast.warning(`Locking: ${item}`),
      publish: () => toast.success(`Published: ${item}`),
      history: () => toast.info(`Viewing history: ${item}`),
    };
    actions[action]?.();
  };

  const stats = [
    { label: "Active Agreements", value: "—", icon: FileCheck, color: "emerald" },
    { label: "Pending Acceptances", value: "—", icon: AlertTriangle, color: "yellow" },
    { label: "Policy Violations", value: "—", icon: Scale, color: "red" },
    { label: "Copyright Alerts", value: "—", icon: Copyright, color: "orange" },
    { label: "Trademark Status", value: "—", icon: Award, color: "cyan" },
    { label: "Country Compliance", value: "—", icon: Globe, color: "blue" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-800 flex items-center justify-center shadow-lg">
          <Scale className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Legal Dashboard</h1>
          <p className="text-muted-foreground">Overview of all legal & compliance matters</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="bg-card/50 border-border/50 cursor-pointer hover:scale-105 transition-transform" onClick={() => toast.info(`Viewing ${stat.label}`)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-rose-400" />
            Agreements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : agreements.length === 0 ? (
            <EmptyState title="No agreements found" description="Legal agreements will appear here when created" />
          ) : (
            <div className="space-y-3">
              {agreements.map((agreement) => (
                <motion.div key={agreement.id} whileHover={{ scale: 1.01 }} className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-rose-600/20 flex items-center justify-center">
                      <FileCheck className="w-5 h-5 text-rose-400" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{agreement.event_type}</p>
                      <p className="text-xs text-muted-foreground">{new Date(agreement.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{agreement.status}</Badge>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("view", agreement.id)}><Eye className="w-4 h-4" /></Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LMDashboard;

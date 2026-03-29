import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  GitBranch, Filter, Globe, Layers, Activity, AlertCircle,
  Eye, Edit, Settings, Loader2
} from 'lucide-react';
import { useLeadRoutingRules, useUpdateRoutingRule, useLeadAssignments } from '@/hooks/useLeadData';
import { formatDistanceToNow } from 'date-fns';

const ruleIcons: Record<string, any> = {
  round_robin: GitBranch,
  rule_based: Filter,
  geo_routing: Globe,
  product_routing: Layers,
  load_balancing: Activity,
  failover: AlertCircle,
};

const LMCapture = () => {
  const { data: rules, isLoading: rulesLoading } = useLeadRoutingRules();
  const { data: assignments, isLoading: assignLoading } = useLeadAssignments();
  const updateRule = useUpdateRoutingRule();

  const handleToggleRule = (id: string, current: boolean) => {
    updateRule.mutate({ id, updates: { is_active: !current } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lead Capture & Auto Routing</h1>
          <p className="text-muted-foreground">Configure automatic lead distribution rules</p>
        </div>
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
          {rulesLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
          {rules?.filter(r => r.is_active).length || 0} Active Rules
        </Badge>
      </div>

      {rulesLoading ? (
        <div className="flex items-center justify-center h-40"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (rules || []).length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center text-muted-foreground">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p>No routing rules configured yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(rules || []).map((rule: any, index: number) => {
            const Icon = ruleIcons[rule.rule_type] || GitBranch;
            return (
              <motion.div key={rule.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="bg-card border-border hover:border-primary/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${rule.is_active ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}>
                          <Icon className={`w-5 h-5 ${rule.is_active ? 'text-green-500' : 'text-yellow-500'}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{rule.name}</h3>
                          <p className="text-xs text-muted-foreground">{rule.description || rule.rule_type}</p>
                        </div>
                      </div>
                      <Switch checked={rule.is_active} onCheckedChange={() => handleToggleRule(rule.id, rule.is_active)} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>Executed: <span className="text-foreground">{rule.execution_count || 0}×</span></span>
                      <span>{rule.last_triggered_at ? `Last: ${formatDistanceToNow(new Date(rule.last_triggered_at), { addSuffix: true })}` : 'Never triggered'}</span>
                    </div>
                    <div className="flex items-center gap-1 pt-2 border-t border-border">
                      <Button size="sm" variant="ghost" className="h-7 text-xs"><Eye className="w-3 h-3 mr-1" /> View</Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs"><Edit className="w-3 h-3 mr-1" /> Edit</Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs"><Settings className="w-3 h-3 mr-1" /> Config</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Recent Assignments */}
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <CardTitle>Recent Auto-Assignments</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {assignLoading ? (
            <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : (assignments || []).length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">No assignments yet</div>
          ) : (
            <table className="w-full">
              <thead className="bg-accent/50">
                <tr>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Lead ID</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Assigned To</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Role</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Time</th>
                </tr>
              </thead>
              <tbody>
                {(assignments || []).slice(0, 10).map((a: any) => (
                  <tr key={a.id} className="border-b border-border hover:bg-accent/30">
                    <td className="p-3 font-mono text-xs text-foreground">{a.lead_id?.slice(0, 8)}...</td>
                    <td className="p-3 text-sm text-muted-foreground">{a.assigned_to?.slice(0, 8) || '—'}</td>
                    <td className="p-3"><Badge variant="outline" className="text-xs">{a.assigned_role || 'agent'}</Badge></td>
                    <td className="p-3 text-xs text-muted-foreground">{formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LMCapture;

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, Activity, BarChart3, AlertCircle,
  Eye, Edit, UserCog, Phone, Loader2
} from 'lucide-react';
import { useLeadAssignments, useLeadEscalations, useLeadStats } from '@/hooks/useLeadData';
import { formatDistanceToNow } from 'date-fns';

const LMTeam = () => {
  const { data: assignments, isLoading: assignLoading } = useLeadAssignments();
  const { data: escalations, isLoading: escLoading } = useLeadEscalations();
  const { data: stats, isLoading: statsLoading } = useLeadStats();

  // Derive team stats from assignments
  const uniqueAgents = new Set((assignments || []).map((a: any) => a.assigned_to)).size;
  const totalAssigned = (assignments || []).length;

  const teamMetrics = [
    { label: 'Agents Assigned', value: uniqueAgents, icon: Users, color: 'text-primary' },
    { label: 'Total Assignments', value: totalAssigned, icon: Activity, color: 'text-green-500' },
    { label: 'Conversion Rate', value: `${stats?.conversionRate || 0}%`, icon: BarChart3, color: 'text-blue-500' },
    { label: 'Escalations', value: (escalations || []).length, icon: AlertCircle, color: 'text-red-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team Management</h1>
          <p className="text-muted-foreground">Sales team overview and performance</p>
        </div>
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
          {statsLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
          Live Data
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {teamMetrics.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{assignLoading ? '...' : stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Assignments Table */}
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center justify-between">
            <span>Recent Assignments</span>
            <Badge variant="secondary">{totalAssigned} total</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {assignLoading ? (
            <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : totalAssigned === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
              <AlertCircle className="w-8 h-8 mb-2" />
              <p className="text-sm">No assignments yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-accent/50">
                <tr>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Lead</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Assigned To</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Role</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Time</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(assignments || []).slice(0, 10).map((a: any, index: number) => (
                  <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="border-b border-border hover:bg-accent/30">
                    <td className="p-3 font-mono text-xs text-foreground">{a.lead_id?.slice(0, 8)}...</td>
                    <td className="p-3 text-sm text-muted-foreground">{a.assigned_to?.slice(0, 8) || '—'}</td>
                    <td className="p-3"><Badge variant="outline" className="text-xs">{a.assigned_role || 'agent'}</Badge></td>
                    <td className="p-3 text-xs text-muted-foreground">{formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7"><Eye className="w-3.5 h-3.5" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7"><Edit className="w-3.5 h-3.5" /></Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Escalations */}
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <CardTitle>Escalation Rules & History</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {escLoading ? (
            <div className="flex items-center justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : (escalations || []).length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-4">No escalations recorded</div>
          ) : (
            <div className="space-y-3">
              {(escalations || []).map((esc: any) => (
                <div key={esc.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/30 border border-border">
                  <div>
                    <p className="font-medium text-foreground">{esc.reason || 'Escalation'}</p>
                    <p className="text-xs text-muted-foreground">Lead: {esc.lead_id?.slice(0, 8)}... • {formatDistanceToNow(new Date(esc.created_at), { addSuffix: true })}</p>
                  </div>
                  <Badge className={`text-xs ${esc.severity === 'critical' ? 'bg-red-500/20 text-red-400' : esc.severity === 'high' ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {esc.severity || 'medium'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LMTeam;

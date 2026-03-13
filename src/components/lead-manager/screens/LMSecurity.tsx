import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, Lock, FileSearch, Eye, Settings,
  Check, AlertTriangle, Loader2, AlertCircle
} from 'lucide-react';
import { useLeadLogs } from '@/hooks/useLeadData';
import { formatDistanceToNow } from 'date-fns';

const securityFeatures = [
  { id: 'access', name: 'Lead Access Control', icon: Shield, description: 'RLS-enforced role-based access' },
  { id: 'masked', name: 'Masked Contact Info', icon: Lock, description: 'PII auto-masked at DB level' },
  { id: 'export', name: 'Export Permission Lock', icon: Lock, description: 'Restricted data export' },
  { id: 'audit', name: 'Immutable Audit Logs', icon: FileSearch, description: 'All actions permanently logged' },
];

const accessMatrix = [
  { role: 'Admin', view: true, edit: true, delete: true, export: true },
  { role: 'Lead Manager', view: true, edit: true, delete: false, export: true },
  { role: 'Agent', view: true, edit: true, delete: false, export: false },
  { role: 'Viewer', view: true, edit: false, delete: false, export: false },
];

const LMSecurity = () => {
  const { data: logs, isLoading } = useLeadLogs();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Security & Compliance</h1>
          <p className="text-muted-foreground">Lead data protection and access control</p>
        </div>
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
          All Protections Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {securityFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div key={feature.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{feature.name}</h3>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 text-xs"><Check className="w-3 h-3 mr-1" /> Enforced</Badge>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border"><CardTitle>Access Control Matrix</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-accent/50">
              <tr>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Role</th>
                <th className="text-center p-3 text-xs font-medium text-muted-foreground">View</th>
                <th className="text-center p-3 text-xs font-medium text-muted-foreground">Edit</th>
                <th className="text-center p-3 text-xs font-medium text-muted-foreground">Delete</th>
                <th className="text-center p-3 text-xs font-medium text-muted-foreground">Export</th>
              </tr>
            </thead>
            <tbody>
              {accessMatrix.map((rule) => (
                <tr key={rule.role} className="border-b border-border hover:bg-accent/30">
                  <td className="p-3 font-medium text-foreground">{rule.role}</td>
                  {[rule.view, rule.edit, rule.delete, rule.export].map((val, i) => (
                    <td key={i} className="p-3 text-center">
                      {val ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : <AlertTriangle className="w-4 h-4 text-red-500 mx-auto" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center justify-between">
            <span>Audit Logs</span>
            <Badge variant="secondary">{(logs || []).length} entries</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : (logs || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
              <AlertCircle className="w-8 h-8 mb-2" />
              <p className="text-sm">No audit logs yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-accent/50">
                <tr>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Action</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Lead</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">By</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Time</th>
                </tr>
              </thead>
              <tbody>
                {(logs || []).slice(0, 10).map((log: any, index: number) => (
                  <motion.tr key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="border-b border-border hover:bg-accent/30">
                    <td className="p-3"><Badge variant="outline" className="text-xs">{log.action_type || log.action}</Badge></td>
                    <td className="p-3 text-xs text-muted-foreground font-mono">{log.lead_id?.slice(0, 8) || '—'}...</td>
                    <td className="p-3 text-sm text-muted-foreground">{log.performed_by?.slice(0, 8) || '—'}</td>
                    <td className="p-3 text-xs text-muted-foreground">{formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LMSecurity;

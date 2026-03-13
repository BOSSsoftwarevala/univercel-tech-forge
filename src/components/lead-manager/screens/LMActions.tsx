import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Eye, Edit, UserCog, GitBranch, Phone, MessageCircle, Mail,
  Calendar, UserCheck, XCircle, Loader2, AlertCircle
} from 'lucide-react';
import { useLeadActivities } from '@/hooks/useLeadData';
import { formatDistanceToNow } from 'date-fns';

const actionButtons = [
  { id: 'view', label: 'View', icon: Eye, color: 'bg-blue-500', description: 'View lead details' },
  { id: 'edit', label: 'Edit', icon: Edit, color: 'bg-purple-500', description: 'Edit lead information' },
  { id: 'assign', label: 'Assign', icon: UserCog, color: 'bg-cyan-500', description: 'Assign to agent' },
  { id: 'reassign', label: 'Reassign', icon: GitBranch, color: 'bg-yellow-500', description: 'Reassign to different agent' },
  { id: 'call', label: 'Call', icon: Phone, color: 'bg-green-500', description: 'Initiate call' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'bg-emerald-500', description: 'Send WhatsApp message' },
  { id: 'email', label: 'Email', icon: Mail, color: 'bg-orange-500', description: 'Send email' },
  { id: 'schedule', label: 'Schedule Follow-Up', icon: Calendar, color: 'bg-pink-500', description: 'Schedule follow-up' },
  { id: 'convert', label: 'Convert to Client', icon: UserCheck, color: 'bg-teal-500', description: 'Convert lead to client' },
  { id: 'lost', label: 'Mark Lost', icon: XCircle, color: 'bg-red-500', description: 'Mark lead as lost' },
];

const LMActions = () => {
  const { data: activities, isLoading } = useLeadActivities();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lead Actions</h1>
          <p className="text-muted-foreground">All actions available for every lead card</p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
          10 Actions Available
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {actionButtons.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div key={action.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }}>
              <Card className="bg-card border-border hover:border-primary/30 transition-all cursor-pointer group">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 rounded-xl mx-auto mb-3 ${action.color} bg-opacity-20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${action.color.replace('bg-', 'text-')}`} />
                  </div>
                  <p className="font-semibold text-foreground">{action.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center justify-between">
            <span>Recent Activity Log</span>
            <Badge variant="secondary">{(activities || []).length} activities</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : (activities || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
              <AlertCircle className="w-8 h-8 mb-2" />
              <p className="text-sm">No activity recorded yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-accent/50">
                <tr>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Action</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Description</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">By</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Time</th>
                </tr>
              </thead>
              <tbody>
                {(activities || []).slice(0, 10).map((act: any, index: number) => (
                  <motion.tr key={act.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="border-b border-border hover:bg-accent/30">
                    <td className="p-3"><Badge variant="outline" className="text-xs">{act.activity_type}</Badge></td>
                    <td className="p-3 text-sm text-muted-foreground">{act.description}</td>
                    <td className="p-3 text-sm text-muted-foreground">{act.performed_by_role || act.performed_by?.slice(0, 8) || '—'}</td>
                    <td className="p-3 text-xs text-muted-foreground">{formatDistanceToNow(new Date(act.created_at), { addSuffix: true })}</td>
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

export default LMActions;

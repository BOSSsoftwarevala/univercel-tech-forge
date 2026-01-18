import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Eye, Edit, UserCog, GitBranch, Phone, MessageCircle, Mail,
  Calendar, UserCheck, XCircle
} from 'lucide-react';

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

const recentActions = [
  { id: 1, lead: 'Rahul Sharma', action: 'Called', by: 'Vikram Singh', time: '2 mins ago', status: 'success' },
  { id: 2, lead: 'Priya Patel', action: 'Email Sent', by: 'Neha Verma', time: '15 mins ago', status: 'success' },
  { id: 3, lead: 'Amit Kumar', action: 'Reassigned', by: 'Admin', time: '32 mins ago', status: 'success' },
  { id: 4, lead: 'Sneha Gupta', action: 'Follow-Up Scheduled', by: 'Raj Malhotra', time: '1 hour ago', status: 'pending' },
  { id: 5, lead: 'Vikram Singh', action: 'Converted', by: 'Anita Desai', time: '2 hours ago', status: 'success' },
];

const LMActions = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lead Actions</h1>
          <p className="text-muted-foreground">All actions available for every lead card</p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
          10 Actions Available
        </Badge>
      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {actionButtons.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
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

      {/* Recent Actions Table */}
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center justify-between">
            <span>Recent Actions Log</span>
            <Badge variant="secondary">{recentActions.length} actions</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-accent/50">
              <tr>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Lead</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Action</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Performed By</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Time</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActions.map((action, index) => (
                <motion.tr
                  key={action.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border hover:bg-accent/30"
                >
                  <td className="p-3 font-medium text-foreground">{action.lead}</td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-xs">{action.action}</Badge>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">{action.by}</td>
                  <td className="p-3 text-xs text-muted-foreground">{action.time}</td>
                  <td className="p-3">
                    <Badge 
                      className={`text-xs ${
                        action.status === 'success' ? 'bg-green-500/20 text-green-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {action.status}
                    </Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LMActions;

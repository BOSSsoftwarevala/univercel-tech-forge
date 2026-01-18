import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, Activity, BarChart3, Layers, AlertCircle,
  Eye, Edit, UserCog, Phone
} from 'lucide-react';

const teamStats = [
  { label: 'Total Agents', value: 24, icon: Users, color: 'text-primary' },
  { label: 'Online Now', value: 18, icon: Activity, color: 'text-green-500' },
  { label: 'Avg Performance', value: '87%', icon: BarChart3, color: 'text-blue-500' },
  { label: 'Escalations', value: 3, icon: AlertCircle, color: 'text-red-500' },
];

const teamMembers = [
  { 
    id: 1, 
    name: 'Vikram Singh', 
    role: 'Senior Agent',
    status: 'online',
    leads: 45,
    capacity: 60,
    performance: 92,
    calls: 128
  },
  { 
    id: 2, 
    name: 'Neha Verma', 
    role: 'Agent',
    status: 'online',
    leads: 38,
    capacity: 50,
    performance: 88,
    calls: 98
  },
  { 
    id: 3, 
    name: 'Raj Malhotra', 
    role: 'Agent',
    status: 'busy',
    leads: 42,
    capacity: 50,
    performance: 85,
    calls: 112
  },
  { 
    id: 4, 
    name: 'Anita Desai', 
    role: 'Team Lead',
    status: 'online',
    leads: 52,
    capacity: 70,
    performance: 95,
    calls: 156
  },
  { 
    id: 5, 
    name: 'Suresh Reddy', 
    role: 'Agent',
    status: 'offline',
    leads: 28,
    capacity: 50,
    performance: 78,
    calls: 67
  },
];

const escalationRules = [
  { id: 1, rule: 'No response in 24 hours', escalateTo: 'Team Lead', priority: 'high' },
  { id: 2, rule: 'High value lead (>5L)', escalateTo: 'Senior Agent', priority: 'medium' },
  { id: 3, rule: 'Customer complaint', escalateTo: 'Manager', priority: 'critical' },
];

const LMTeam = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team Management</h1>
          <p className="text-muted-foreground">Sales team overview and performance</p>
        </div>
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
          18 Online
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {teamStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Team Members Table */}
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center justify-between">
            <span>Sales Team List</span>
            <Badge variant="secondary">{teamMembers.length} members</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-accent/50">
              <tr>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Agent</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Role</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Lead Load</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Performance</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Calls</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member, index) => (
                <motion.tr
                  key={member.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border hover:bg-accent/30"
                >
                  <td className="p-3 font-medium text-foreground">{member.name}</td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-xs">{member.role}</Badge>
                  </td>
                  <td className="p-3">
                    <Badge 
                      className={`text-xs ${
                        member.status === 'online' ? 'bg-green-500/20 text-green-400' :
                        member.status === 'busy' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {member.status}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Progress value={(member.leads / member.capacity) * 100} className="w-16 h-2" />
                      <span className="text-xs text-muted-foreground">{member.leads}/{member.capacity}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge 
                      className={`text-xs ${
                        member.performance >= 90 ? 'bg-green-500/20 text-green-400' :
                        member.performance >= 80 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {member.performance}%
                    </Badge>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {member.calls}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7">
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7">
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7">
                        <UserCog className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Escalation Rules */}
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <CardTitle>Escalation Rules</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {escalationRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/30 border border-border">
                <div>
                  <p className="font-medium text-foreground">{rule.rule}</p>
                  <p className="text-xs text-muted-foreground">Escalate to: {rule.escalateTo}</p>
                </div>
                <Badge 
                  className={`text-xs ${
                    rule.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                    rule.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {rule.priority}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LMTeam;

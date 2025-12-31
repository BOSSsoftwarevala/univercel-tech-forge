import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  TrendingUp,
  Target,
  Clock,
  CheckCircle,
  MessageSquare,
  Eye,
  Shield
} from 'lucide-react';

interface TeamMember {
  id: string;
  valaId: string;
  role: 'sales_exec' | 'support_agent';
  activeItems: number;
  completedToday: number;
  avgResponseTime: string;
  satisfaction?: number;
  conversionRate?: number;
  status: 'online' | 'busy' | 'away';
}

const mockTeam: TeamMember[] = [
  {
    id: '1',
    valaId: 'VL-SE-001',
    role: 'sales_exec',
    activeItems: 8,
    completedToday: 3,
    avgResponseTime: '12m',
    conversionRate: 28,
    status: 'online'
  },
  {
    id: '2',
    valaId: 'VL-SE-002',
    role: 'sales_exec',
    activeItems: 5,
    completedToday: 2,
    avgResponseTime: '18m',
    conversionRate: 22,
    status: 'busy'
  },
  {
    id: '3',
    valaId: 'VL-SE-003',
    role: 'sales_exec',
    activeItems: 6,
    completedToday: 4,
    avgResponseTime: '15m',
    conversionRate: 32,
    status: 'online'
  },
  {
    id: '4',
    valaId: 'VL-SA-001',
    role: 'support_agent',
    activeItems: 4,
    completedToday: 7,
    avgResponseTime: '8m',
    satisfaction: 94,
    status: 'online'
  },
  {
    id: '5',
    valaId: 'VL-SA-002',
    role: 'support_agent',
    activeItems: 3,
    completedToday: 5,
    avgResponseTime: '10m',
    satisfaction: 91,
    status: 'busy'
  },
  {
    id: '6',
    valaId: 'VL-SA-003',
    role: 'support_agent',
    activeItems: 2,
    completedToday: 6,
    avgResponseTime: '6m',
    satisfaction: 97,
    status: 'away'
  }
];

export const SSMTeamPerformance: React.FC = () => {
  const salesTeam = mockTeam.filter(m => m.role === 'sales_exec');
  const supportTeam = mockTeam.filter(m => m.role === 'support_agent');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'away':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const renderTeamCard = (member: TeamMember) => (
    <motion.div
      key={member.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="border border-border rounded-lg p-4 bg-background"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${getStatusColor(member.status)}`} />
          </div>
          <div>
            <span className="font-mono text-sm text-primary">{member.valaId}</span>
            <p className="text-xs text-muted-foreground capitalize">{member.role.replace('_', ' ')}</p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {member.activeItems} active
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-muted/30 rounded p-2">
          <CheckCircle className="h-3 w-3 mx-auto mb-1 text-green-500" />
          <span className="text-lg font-bold text-foreground">{member.completedToday}</span>
          <p className="text-xs text-muted-foreground">Today</p>
        </div>
        <div className="bg-muted/30 rounded p-2">
          <Clock className="h-3 w-3 mx-auto mb-1 text-blue-500" />
          <span className="text-lg font-bold text-foreground">{member.avgResponseTime}</span>
          <p className="text-xs text-muted-foreground">Avg Time</p>
        </div>
        <div className="bg-muted/30 rounded p-2">
          {member.role === 'sales_exec' ? (
            <>
              <Target className="h-3 w-3 mx-auto mb-1 text-purple-500" />
              <span className="text-lg font-bold text-foreground">{member.conversionRate}%</span>
              <p className="text-xs text-muted-foreground">Convert</p>
            </>
          ) : (
            <>
              <MessageSquare className="h-3 w-3 mx-auto mb-1 text-yellow-500" />
              <span className="text-lg font-bold text-foreground">{member.satisfaction}%</span>
              <p className="text-xs text-muted-foreground">CSAT</p>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );

  // Calculate totals
  const totalSalesActive = salesTeam.reduce((sum, m) => sum + m.activeItems, 0);
  const totalSupportActive = supportTeam.reduce((sum, m) => sum + m.activeItems, 0);
  const avgSalesConversion = Math.round(salesTeam.reduce((sum, m) => sum + (m.conversionRate || 0), 0) / salesTeam.length);
  const avgSupportCSAT = Math.round(supportTeam.reduce((sum, m) => sum + (m.satisfaction || 0), 0) / supportTeam.length);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <TrendingUp className="h-5 w-5 text-primary" />
            Team Performance Snapshot
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-muted">
              <Eye className="h-3 w-3 mr-1" />
              Read-Only
            </Badge>
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
              <Shield className="h-3 w-3 mr-1" />
              Edit BLOCKED
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-blue-500/10 rounded-lg p-3 text-center">
            <span className="text-2xl font-bold text-blue-500">{salesTeam.length}</span>
            <p className="text-xs text-muted-foreground">Sales Execs</p>
          </div>
          <div className="bg-green-500/10 rounded-lg p-3 text-center">
            <span className="text-2xl font-bold text-green-500">{supportTeam.length}</span>
            <p className="text-xs text-muted-foreground">Support Agents</p>
          </div>
          <div className="bg-purple-500/10 rounded-lg p-3 text-center">
            <span className="text-2xl font-bold text-purple-500">{avgSalesConversion}%</span>
            <p className="text-xs text-muted-foreground">Avg Conversion</p>
          </div>
          <div className="bg-yellow-500/10 rounded-lg p-3 text-center">
            <span className="text-2xl font-bold text-yellow-500">{avgSupportCSAT}%</span>
            <p className="text-xs text-muted-foreground">Avg CSAT</p>
          </div>
        </div>

        {/* Sales Team */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Sales Executives
            </h4>
            <Badge variant="outline">{totalSalesActive} active leads</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {salesTeam.map(renderTeamCard)}
          </div>
        </div>

        {/* Support Team */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              Support Agents
            </h4>
            <Badge variant="outline">{totalSupportActive} active tickets</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {supportTeam.map(renderTeamCard)}
          </div>
        </div>

        <div className="mt-4 p-3 bg-muted/30 border border-border rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> Sales ≠ Support - teams are separate. 
            Performance metrics are calculated automatically and cannot be manually edited.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

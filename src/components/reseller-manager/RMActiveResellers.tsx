import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Search,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Shield,
  TrendingUp,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

interface ActiveReseller {
  id: string;
  valaId: string;
  businessName: string;
  territory: string;
  region: string;
  status: 'active' | 'suspended' | 'warning';
  joinedAt: string;
  validLeadRatio: number;
  duplicateRate: number;
  totalLeads: number;
  qualifiedLeads: number;
  lastActivity: string;
}

const mockResellers: ActiveReseller[] = [
  {
    id: '1',
    valaId: 'VL-RS-3421',
    businessName: 'Prime Distribution Co.',
    territory: 'West Region',
    region: 'Gujarat',
    status: 'active',
    joinedAt: '2023-06-15',
    validLeadRatio: 87,
    duplicateRate: 3,
    totalLeads: 245,
    qualifiedLeads: 213,
    lastActivity: '2 hours ago'
  },
  {
    id: '2',
    valaId: 'VL-RS-5678',
    businessName: 'Eastern Sales Network',
    territory: 'East Region',
    region: 'West Bengal',
    status: 'warning',
    joinedAt: '2023-09-22',
    validLeadRatio: 62,
    duplicateRate: 15,
    totalLeads: 156,
    qualifiedLeads: 97,
    lastActivity: '1 day ago'
  },
  {
    id: '3',
    valaId: 'VL-RS-9012',
    businessName: 'Central Trade Partners',
    territory: 'Central Region',
    region: 'Madhya Pradesh',
    status: 'suspended',
    joinedAt: '2023-04-10',
    validLeadRatio: 45,
    duplicateRate: 28,
    totalLeads: 89,
    qualifiedLeads: 40,
    lastActivity: '5 days ago'
  }
];

export const RMActiveResellers: React.FC = () => {
  const [resellers, setResellers] = useState<ActiveReseller[]>(mockResellers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReseller, setSelectedReseller] = useState<string | null>(null);
  const [suspendReason, setSuspendReason] = useState('');

  const handleSuspend = (id: string) => {
    if (!suspendReason.trim()) {
      toast.error('Suspension reason is mandatory');
      return;
    }
    setResellers(prev => 
      prev.map(r => r.id === id ? { ...r, status: 'suspended' as const } : r)
    );
    toast.success('Reseller suspended - cannot submit leads or earn');
    setSuspendReason('');
    setSelectedReseller(null);
  };

  const handleReinstate = (id: string) => {
    setResellers(prev => 
      prev.map(r => r.id === id ? { ...r, status: 'active' as const } : r)
    );
    toast.success('Reseller reinstated');
    setSelectedReseller(null);
  };

  const filteredResellers = resellers.filter(r => 
    r.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.valaId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.territory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/30">Active</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">Warning</Badge>;
      case 'suspended':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/30">Suspended</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Users className="h-5 w-5 text-primary" />
            Active Resellers
          </CardTitle>
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
            <Shield className="h-3 w-3 mr-1" />
            Cross-Territory Access BLOCKED
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, Vala ID, or territory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background border-border"
          />
        </div>

        <div className="space-y-4">
          {filteredResellers.map((reseller) => (
            <motion.div
              key={reseller.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border border-border rounded-lg p-4 bg-background"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm text-primary">{reseller.valaId}</span>
                    {getStatusBadge(reseller.status)}
                  </div>
                  <h4 className="font-semibold text-foreground">{reseller.businessName}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    <span>{reseller.territory} • {reseller.region}</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  Last active: {reseller.lastActivity}
                </span>
              </div>

              {/* Performance Metrics - READ ONLY */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-muted/30 rounded-lg p-2 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Target className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Valid Lead Ratio</span>
                  </div>
                  <span className={`font-bold ${reseller.validLeadRatio >= 70 ? 'text-green-500' : reseller.validLeadRatio >= 50 ? 'text-yellow-500' : 'text-destructive'}`}>
                    {reseller.validLeadRatio}%
                  </span>
                </div>
                <div className="bg-muted/30 rounded-lg p-2 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <AlertTriangle className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Duplicate Rate</span>
                  </div>
                  <span className={`font-bold ${reseller.duplicateRate <= 5 ? 'text-green-500' : reseller.duplicateRate <= 15 ? 'text-yellow-500' : 'text-destructive'}`}>
                    {reseller.duplicateRate}%
                  </span>
                </div>
                <div className="bg-muted/30 rounded-lg p-2 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Total Leads</span>
                  </div>
                  <span className="font-bold text-foreground">{reseller.totalLeads}</span>
                </div>
                <div className="bg-muted/30 rounded-lg p-2 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <CheckCircle className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Qualified</span>
                  </div>
                  <span className="font-bold text-green-500">{reseller.qualifiedLeads}</span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>Performance metrics are read-only • Manual edit BLOCKED</span>
              </div>

              {selectedReseller === reseller.id ? (
                <div className="border-t border-border pt-4 space-y-3">
                  {reseller.status !== 'suspended' && (
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Suspension Reason (mandatory):
                      </label>
                      <Textarea
                        value={suspendReason}
                        onChange={(e) => setSuspendReason(e.target.value)}
                        placeholder="Provide detailed reason for suspension..."
                        className="bg-background border-border"
                      />
                    </div>
                  )}
                  <div className="flex gap-2">
                    {reseller.status === 'suspended' ? (
                      <Button 
                        size="sm"
                        onClick={() => handleReinstate(reseller.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Reinstate
                      </Button>
                    ) : (
                      <Button 
                        size="sm"
                        variant="destructive"
                        onClick={() => handleSuspend(reseller.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Suspend
                      </Button>
                    )}
                    <Button 
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedReseller(null);
                        setSuspendReason('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedReseller(reseller.id)}
                >
                  Manage Status
                </Button>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-muted/30 border border-border rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Status Flow:</strong> Applied → Approved → Active → Suspended / Removed
            <br />
            <strong>Suspended resellers:</strong> Cannot submit leads • Cannot earn • Reason is logged
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

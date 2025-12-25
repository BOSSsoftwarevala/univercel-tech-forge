import React from 'react';
import { Shield, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const AMApprovals: React.FC = () => {
  const pendingApprovals = [
    { id: 'APR-001', type: 'Payout Request', amount: '₹25,000', requester: 'Franchise F-001', risk: 'low', time: '2 hours ago' },
    { id: 'APR-002', type: 'Lead Assignment', amount: '-', requester: 'System', risk: 'low', time: '3 hours ago' },
    { id: 'APR-003', type: 'Wallet Withdrawal', amount: '₹50,000', requester: 'Reseller R-003', risk: 'medium', time: '4 hours ago' },
    { id: 'APR-004', type: 'Account Activation', amount: '-', requester: 'New Franchise', risk: 'high', time: '5 hours ago' },
    { id: 'APR-005', type: 'Credit Addition', amount: '₹10,000', requester: 'Support', risk: 'low', time: '6 hours ago' },
  ];

  const approvalStats = [
    { label: 'Pending', value: 12, color: 'text-yellow-400' },
    { label: 'Approved Today', value: 28, color: 'text-green-400' },
    { label: 'Rejected Today', value: 3, color: 'text-red-400' },
    { label: 'Escalated', value: 2, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Approvals</h2>
        <p className="text-muted-foreground">Low/Medium action approvals - High risk escalates to Super Admin</p>
      </div>

      {/* Approval Stats */}
      <div className="grid grid-cols-4 gap-4">
        {approvalStats.map((stat, index) => (
          <Card key={index} className="bg-card/50 border-border/50">
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Approvals */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-yellow-400" />
            Pending Approvals Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/30">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="font-mono text-sm text-muted-foreground">{approval.id}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{approval.type}</p>
                    <p className="text-sm text-muted-foreground">{approval.requester}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {approval.amount !== '-' && (
                    <span className="font-mono text-foreground">{approval.amount}</span>
                  )}
                  <Badge variant={
                    approval.risk === 'high' ? 'destructive' :
                    approval.risk === 'medium' ? 'default' : 'secondary'
                  }>
                    {approval.risk} risk
                  </Badge>
                  <span className="text-sm text-muted-foreground">{approval.time}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-green-400 border-green-400/50 hover:bg-green-500/10">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-400 border-red-400/50 hover:bg-red-500/10">
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Authority Notice */}
      <Card className="bg-yellow-500/10 border-yellow-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <div>
              <p className="font-medium text-yellow-400">Approval Authority</p>
              <p className="text-sm text-muted-foreground">
                You can approve Low and Medium risk actions. High risk actions are automatically escalated to Super Admin.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AMApprovals;

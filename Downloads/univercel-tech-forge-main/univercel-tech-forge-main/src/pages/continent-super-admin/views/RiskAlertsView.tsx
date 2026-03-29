// Continent Super Admin - Risk & Alerts Screen
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Clock, Eye, ArrowUpCircle, Loader2, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SecurityAlert {
  id: string;
  type: string;
  country: string;
  severity: 'Critical' | 'High' | 'Medium';
  time: string;
  status: 'Open' | 'Under Review' | 'Escalated' | 'Resolved';
}

interface SLABreach {
  id: string;
  task: string;
  country: string;
  overdue: string;
  assignee: string;
  status: 'Pending' | 'Escalated' | 'Resolved';
}

interface FraudFlag {
  id: string;
  type: string;
  country: string;
  amount: string;
  status: 'Under Review' | 'Flagged' | 'Escalated' | 'Cleared';
}

const RiskAlertsView = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([
    { id: '1', type: 'Unauthorized Access', country: 'Egypt', severity: 'Critical', time: '2 hours ago', status: 'Open' },
    { id: '2', type: 'Suspicious Login', country: 'Nigeria', severity: 'High', time: '5 hours ago', status: 'Open' },
    { id: '3', type: 'Multiple Failed Attempts', country: 'Kenya', severity: 'Medium', time: '1 day ago', status: 'Open' },
  ]);

  const [slaBreaches, setSlaBreaches] = useState<SLABreach[]>([
    { id: '1', task: 'Security Audit', country: 'Egypt', overdue: '3 days', assignee: 'Ahmed Hassan', status: 'Pending' },
    { id: '2', task: 'Compliance Report', country: 'Ghana', overdue: '1 day', assignee: 'Kwame Asante', status: 'Pending' },
  ]);

  const [fraudFlags, setFraudFlags] = useState<FraudFlag[]>([
    { id: '1', type: 'Unusual Transaction', country: 'Nigeria', amount: '$45,000', status: 'Under Review' },
    { id: '2', type: 'Pattern Anomaly', country: 'South Africa', amount: '$12,000', status: 'Flagged' },
  ]);

  const [reviewDialog, setReviewDialog] = useState<{ 
    open: boolean; 
    type: 'security' | 'sla' | 'fraud'; 
    id: string | null;
    notes: string;
  }>({ open: false, type: 'security', id: null, notes: '' });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'High': return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
      case 'Medium': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      default: return '';
    }
  };

  const logAudit = async (action: string, details: Record<string, string | number | boolean | null>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('audit_logs').insert([{
          user_id: user.id,
          action,
          module: 'risk_alerts',
          role: 'super_admin' as const,
          meta_json: details as Record<string, string | number | boolean | null>
        }]);
      }
    } catch (error) {
      console.error('Audit log error:', error);
    }
  };

  const handleReview = (type: 'security' | 'sla' | 'fraud', id: string) => {
    setReviewDialog({ open: true, type, id, notes: '' });
  };

  const handleSubmitReview = async () => {
    if (!reviewDialog.id) return;
    setLoading(reviewDialog.id);
    
    try {
      await logAudit(`${reviewDialog.type}_alert_reviewed`, { 
        alert_id: reviewDialog.id,
        type: reviewDialog.type,
        notes: reviewDialog.notes,
        status: 'Under Review'
      });

      if (reviewDialog.type === 'security') {
        setSecurityAlerts(prev => prev.map(a => 
          a.id === reviewDialog.id ? { ...a, status: 'Under Review' as const } : a
        ));
      } else if (reviewDialog.type === 'sla') {
        setSlaBreaches(prev => prev.map(a => 
          a.id === reviewDialog.id ? { ...a, status: 'Pending' as const } : a
        ));
      } else if (reviewDialog.type === 'fraud') {
        setFraudFlags(prev => prev.map(a => 
          a.id === reviewDialog.id ? { ...a, status: 'Under Review' as const } : a
        ));
      }

      toast({
        title: 'Review Submitted',
        description: 'Alert has been marked as under review.',
      });

      setReviewDialog({ open: false, type: 'security', id: null, notes: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit review.',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  const handleEscalate = async (type: 'security' | 'sla' | 'fraud', id: string) => {
    setLoading(id);
    
    try {
      await logAudit(`${type}_alert_escalated`, { 
        alert_id: id,
        type,
        escalated_to: 'master_admin'
      });

      if (type === 'security') {
        setSecurityAlerts(prev => prev.map(a => 
          a.id === id ? { ...a, status: 'Escalated' as const } : a
        ));
      } else if (type === 'sla') {
        setSlaBreaches(prev => prev.map(a => 
          a.id === id ? { ...a, status: 'Escalated' as const } : a
        ));
      } else if (type === 'fraud') {
        setFraudFlags(prev => prev.map(a => 
          a.id === id ? { ...a, status: 'Escalated' as const } : a
        ));
      }

      toast({
        title: 'Alert Escalated',
        description: 'Alert has been escalated to Master Admin.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to escalate alert.',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  const handleResolve = async (type: 'security' | 'sla' | 'fraud', id: string) => {
    setLoading(id);
    
    try {
      await logAudit(`${type}_alert_resolved`, { 
        alert_id: id,
        type
      });

      if (type === 'security') {
        setSecurityAlerts(prev => prev.map(a => 
          a.id === id ? { ...a, status: 'Resolved' as const } : a
        ));
      } else if (type === 'sla') {
        setSlaBreaches(prev => prev.map(a => 
          a.id === id ? { ...a, status: 'Resolved' as const } : a
        ));
      } else if (type === 'fraud') {
        setFraudFlags(prev => prev.map(a => 
          a.id === id ? { ...a, status: 'Cleared' as const } : a
        ));
      }

      toast({
        title: 'Alert Resolved',
        description: 'Alert has been marked as resolved.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resolve alert.',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Open':
      case 'Pending':
      case 'Flagged':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">{status}</Badge>;
      case 'Under Review':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">{status}</Badge>;
      case 'Escalated':
        return <Badge variant="outline" className="border-purple-500 text-purple-500">{status}</Badge>;
      case 'Resolved':
      case 'Cleared':
        return <Badge variant="outline" className="border-emerald-500 text-emerald-500">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderActionButtons = (type: 'security' | 'sla' | 'fraud', id: string, status: string, colorClass: string) => {
    const isLoading = loading === id;
    const isActionable = !['Resolved', 'Cleared', 'Escalated'].includes(status);
    
    if (!isActionable) {
      return <span className="text-sm text-muted-foreground">{status}</span>;
    }

    return (
      <div className="flex gap-2 mt-3">
        <Button 
          size="sm" 
          variant="outline" 
          className={`border-current ${colorClass}`}
          onClick={() => handleReview(type, id)}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Eye className="h-3 w-3 mr-1" />}
          Review
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className={`border-current ${colorClass}`}
          onClick={() => handleEscalate(type, id)}
          disabled={isLoading}
        >
          <ArrowUpCircle className="h-3 w-3 mr-1" />
          Escalate
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="border-emerald-500/30 text-emerald-500"
          onClick={() => handleResolve(type, id)}
          disabled={isLoading}
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Resolve
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Risk & Alerts</h1>
        <p className="text-muted-foreground">Monitor security alerts, SLA breaches, and fraud flags</p>
      </div>

      {/* Security Alerts */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Shield className="h-5 w-5 text-red-500" />
            Security Alerts
            <Badge className="ml-2 bg-red-500/20 text-red-500">
              {securityAlerts.filter(a => a.status === 'Open').length} Open
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">{alert.type}</span>
                      {getStatusBadge(alert.status)}
                    </div>
                    <p className="text-sm opacity-80 mt-1">{alert.country}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                    <p className="text-xs opacity-70 mt-1">{alert.time}</p>
                  </div>
                </div>
                {renderActionButtons('security', alert.id, alert.status, '')}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SLA Breaches */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Clock className="h-5 w-5 text-amber-500" />
              SLA Breaches
              <Badge className="ml-2 bg-amber-500/20 text-amber-500">
                {slaBreaches.filter(a => a.status === 'Pending').length} Pending
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {slaBreaches.map((breach, index) => (
                <motion.div
                  key={breach.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{breach.task}</p>
                        {getStatusBadge(breach.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{breach.country} • {breach.assignee}</p>
                    </div>
                    <Badge variant="destructive">Overdue {breach.overdue}</Badge>
                  </div>
                  {renderActionButtons('sla', breach.id, breach.status, 'text-amber-500')}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fraud Flags */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Fraud Flags
              <Badge className="ml-2 bg-red-500/20 text-red-500">
                {fraudFlags.filter(a => !['Cleared', 'Escalated'].includes(a.status)).length} Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {fraudFlags.map((flag, index) => (
                <motion.div
                  key={flag.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-red-500/10 rounded-lg border border-red-500/20"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{flag.type}</p>
                        {getStatusBadge(flag.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{flag.country} • {flag.amount}</p>
                    </div>
                  </div>
                  {renderActionButtons('fraud', flag.id, flag.status, 'text-red-500')}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewDialog.open} onOpenChange={(open) => {
        if (!open) setReviewDialog({ open: false, type: 'security', id: null, notes: '' });
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Alert</DialogTitle>
            <DialogDescription>
              Add notes and mark this alert as under review.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Textarea
              placeholder="Add review notes..."
              value={reviewDialog.notes}
              onChange={(e) => setReviewDialog(prev => ({ ...prev, notes: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialog({ open: false, type: 'security', id: null, notes: '' })}>
              Cancel
            </Button>
            <Button onClick={handleSubmitReview} disabled={loading !== null}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RiskAlertsView;

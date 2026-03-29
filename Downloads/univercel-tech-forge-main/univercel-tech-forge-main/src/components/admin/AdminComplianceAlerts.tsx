// ==============================================
// Admin Compliance Alerts
// Read-Only View - Cannot Modify
// ==============================================

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, AlertTriangle, Eye, Clock, 
  CheckCircle, XCircle, Lock, ArrowUpRight
} from 'lucide-react';
import { toast } from 'sonner';

interface ComplianceAlert {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'violation' | 'critical';
  status: 'open' | 'acknowledged' | 'resolved';
  detectedAt: string;
  affectedEntity: string;
  regulation: string;
}

export function AdminComplianceAlerts() {
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);

  useEffect(() => {
    // Simulated compliance alerts
    setAlerts([
      {
        id: 'comp-001',
        type: 'DATA_RETENTION',
        title: 'Data Retention Policy Approaching',
        description: '15 user records approaching 7-year retention limit',
        severity: 'warning',
        status: 'open',
        detectedAt: '2024-01-30 10:00',
        affectedEntity: 'User Records',
        regulation: 'GDPR',
      },
      {
        id: 'comp-002',
        type: 'ACCESS_VIOLATION',
        title: 'Unusual Access Pattern Detected',
        description: 'Multiple failed login attempts from restricted region',
        severity: 'violation',
        status: 'acknowledged',
        detectedAt: '2024-01-30 08:30',
        affectedEntity: 'Auth System',
        regulation: 'SOC2',
      },
      {
        id: 'comp-003',
        type: 'CONSENT_EXPIRED',
        title: 'Marketing Consent Expiring',
        description: '250 users have consents expiring in 30 days',
        severity: 'info',
        status: 'open',
        detectedAt: '2024-01-29 15:00',
        affectedEntity: 'Marketing DB',
        regulation: 'GDPR',
      },
      {
        id: 'comp-004',
        type: 'PII_EXPOSURE',
        title: 'Potential PII Exposure Risk',
        description: 'Unmasked data detected in non-production logs',
        severity: 'critical',
        status: 'open',
        detectedAt: '2024-01-30 09:45',
        affectedEntity: 'Logging System',
        regulation: 'CCPA',
      },
    ]);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'violation': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'info': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'acknowledged': return <Eye className="h-4 w-4 text-blue-400" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-400" />;
      default: return null;
    }
  };

  const handleAction = () => {
    toast.error('BLOCKED: Compliance alerts are read-only for Admin. Escalate to Super Admin for actions.');
  };

  const handleEscalate = (alertId: string) => {
    toast.info(`Alert ${alertId} escalated to Super Admin for action`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Compliance Alerts
        </h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400">
            <Eye className="h-3 w-3 mr-1" />
            Read-Only
          </Badge>
          <Badge variant="outline" className="bg-red-500/10 text-red-400">
            {alerts.filter(a => a.severity === 'critical').length} Critical
          </Badge>
        </div>
      </div>

      {/* Read-Only Notice */}
      <Card className="bg-blue-500/10 border-blue-500/30">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-sm text-blue-400">
            <Lock className="h-4 w-4" />
            <span>Admin has read-only access to compliance alerts. Actions require Super Admin approval.</span>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="bg-card border-border">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-red-400">
              {alerts.filter(a => a.severity === 'critical').length}
            </p>
            <p className="text-xs text-muted-foreground">Critical</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-orange-400">
              {alerts.filter(a => a.severity === 'violation').length}
            </p>
            <p className="text-xs text-muted-foreground">Violations</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-yellow-400">
              {alerts.filter(a => a.severity === 'warning').length}
            </p>
            <p className="text-xs text-muted-foreground">Warnings</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-blue-400">
              {alerts.filter(a => a.severity === 'info').length}
            </p>
            <p className="text-xs text-muted-foreground">Info</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.map(alert => (
          <Card key={alert.id} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(alert.status)}
                    <span className="font-medium">{alert.title}</span>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {alert.regulation}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                </div>
                <Badge variant="outline" className="text-xs font-mono">
                  {alert.type}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Entity: {alert.affectedEntity}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {alert.detectedAt}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleAction}
                    disabled
                    className="text-xs text-muted-foreground"
                  >
                    <Lock className="h-3 w-3 mr-1" />
                    Action (Locked)
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEscalate(alert.id)}
                    className="text-xs"
                  >
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    Escalate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

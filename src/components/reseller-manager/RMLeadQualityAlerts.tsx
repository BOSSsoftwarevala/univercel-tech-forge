import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  TrendingDown,
  Copy,
  Target,
  XCircle,
  Eye,
  Shield,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface QualityAlert {
  id: string;
  resellerId: string;
  resellerName: string;
  alertType: 'low_valid_ratio' | 'high_duplicate' | 'high_rejection' | 'low_conversion';
  severity: 'critical' | 'high' | 'medium' | 'low';
  metric: string;
  threshold: string;
  currentValue: string;
  detectedAt: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

const mockAlerts: QualityAlert[] = [
  {
    id: '1',
    resellerId: 'VL-RS-5678',
    resellerName: 'Eastern Sales Network',
    alertType: 'high_duplicate',
    severity: 'critical',
    metric: 'Duplicate Lead Rate',
    threshold: '< 10%',
    currentValue: '28%',
    detectedAt: '2024-01-15T08:30:00Z',
    status: 'active'
  },
  {
    id: '2',
    resellerId: 'VL-RS-9012',
    resellerName: 'Central Trade Partners',
    alertType: 'low_valid_ratio',
    severity: 'high',
    metric: 'Valid Lead Ratio',
    threshold: '> 60%',
    currentValue: '45%',
    detectedAt: '2024-01-14T15:20:00Z',
    status: 'active'
  },
  {
    id: '3',
    resellerId: 'VL-RS-2345',
    resellerName: 'Northern Traders',
    alertType: 'high_rejection',
    severity: 'medium',
    metric: 'Lead Rejection Rate',
    threshold: '< 20%',
    currentValue: '32%',
    detectedAt: '2024-01-13T11:45:00Z',
    status: 'acknowledged'
  },
  {
    id: '4',
    resellerId: 'VL-RS-6789',
    resellerName: 'Coastal Distribution',
    alertType: 'low_conversion',
    severity: 'low',
    metric: 'Conversion Contribution',
    threshold: '> 5%',
    currentValue: '3.2%',
    detectedAt: '2024-01-12T09:15:00Z',
    status: 'resolved'
  }
];

export const RMLeadQualityAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<QualityAlert[]>(mockAlerts);
  const [filter, setFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('all');

  const handleAcknowledge = (id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, status: 'acknowledged' as const } : alert
      )
    );
    toast.success('Alert acknowledged');
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'high_duplicate':
        return <Copy className="h-4 w-4" />;
      case 'low_valid_ratio':
        return <Target className="h-4 w-4" />;
      case 'high_rejection':
        return <XCircle className="h-4 w-4" />;
      case 'low_conversion':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 text-red-500 border-red-500/30';
      case 'high':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case 'low':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const filteredAlerts = alerts.filter(alert => 
    filter === 'all' || alert.status === filter
  );

  const activeCount = alerts.filter(a => a.status === 'active').length;
  const criticalCount = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Lead Quality Alerts
          </CardTitle>
          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <Badge className="bg-red-500/10 text-red-500 border-red-500/30">
                {criticalCount} Critical
              </Badge>
            )}
            <Badge variant="outline">
              {activeCount} Active
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
            <Shield className="h-3 w-3 mr-1" />
            Manual Edit BLOCKED
          </Badge>
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            <Eye className="h-3 w-3 mr-1" />
            Read-Only Metrics
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex gap-2 mb-4">
          {(['all', 'active', 'acknowledged', 'resolved'] as const).map((status) => (
            <Button
              key={status}
              size="sm"
              variant={filter === status ? 'default' : 'outline'}
              onClick={() => setFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`border rounded-lg p-4 ${
                alert.status === 'resolved' 
                  ? 'bg-muted/20 border-border opacity-60' 
                  : 'bg-background border-border'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                    {getAlertIcon(alert.alertType)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{alert.metric}</h4>
                    <p className="text-sm text-muted-foreground">
                      {alert.resellerName} ({alert.resellerId})
                    </p>
                  </div>
                </div>
                <Badge className={getSeverityColor(alert.severity)}>
                  {alert.severity.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Threshold:</span>
                  <span className="ml-2 text-foreground font-medium">{alert.threshold}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Current:</span>
                  <span className="ml-2 text-destructive font-bold">{alert.currentValue}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(alert.detectedAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge variant="outline" className={
                  alert.status === 'active' ? 'bg-red-500/10 text-red-500' :
                  alert.status === 'acknowledged' ? 'bg-yellow-500/10 text-yellow-500' :
                  'bg-green-500/10 text-green-500'
                }>
                  {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                </Badge>

                {alert.status === 'active' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleAcknowledge(alert.id)}
                  >
                    Acknowledge
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p>No alerts in this category</p>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-xs text-blue-400">
            <strong>Lead Quality Priority:</strong> Quality &gt; Volume • All metrics are system-calculated • 
            AI flags require human review before any action
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

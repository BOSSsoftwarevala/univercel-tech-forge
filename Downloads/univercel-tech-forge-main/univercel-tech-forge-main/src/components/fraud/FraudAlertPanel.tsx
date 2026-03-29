import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, AlertTriangle, Ban, CheckCircle, Eye, 
  MapPin, Monitor, Clock, TrendingUp, Filter
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FraudAlert {
  id: string;
  user_id: string;
  alert_type: string;
  severity: string;
  title: string;
  description: string;
  details: any;
  ip_address: string;
  device_fingerprint: string;
  status: string;
  escalation_level: number;
  created_at: string;
}

export function FraudAlertPanel() {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  useEffect(() => {
    fetchAlerts();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('fraud-alerts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'fraud_alerts' }, 
        (payload) => {
          setAlerts(prev => [payload.new as FraudAlert, ...prev]);
          toast.warning('New fraud alert detected!', {
            description: (payload.new as FraudAlert).title,
          });
        })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase.functions.invoke('api-fraud', {
        body: { path: '/alerts' },
      });
      setAlerts(data?.alerts || []);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    }
    setIsLoading(false);
  };

  const handleResolve = async (action: 'dismiss' | 'escalate' | 'suspend') => {
    if (!selectedAlert) return;

    try {
      await supabase.functions.invoke('api-fraud', {
        body: {
          path: `/alerts/${selectedAlert.id}/resolve`,
          status: action === 'dismiss' ? 'dismissed' : 'resolved',
          action,
          notes: resolutionNotes,
        },
      });

      setAlerts(prev => prev.map(a => 
        a.id === selectedAlert.id ? { ...a, status: action === 'dismiss' ? 'dismissed' : 'resolved' } : a
      ));
      setSelectedAlert(null);
      setResolutionNotes('');
      toast.success(`Alert ${action === 'dismiss' ? 'dismissed' : 'resolved'}`);
    } catch (error) {
      toast.error('Failed to resolve alert');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'impossible_travel': return MapPin;
      case 'suspicious_login': return Monitor;
      case 'blocked_access': return Ban;
      case 'high_risk_transaction': return TrendingUp;
      default: return AlertTriangle;
    }
  };

  const filteredAlerts = alerts.filter(a => 
    filter === 'all' || a.status === filter || a.severity === filter
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Fraud Detection Center</h2>
            <p className="text-muted-foreground">AI-powered threat monitoring</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'critical', 'high'].map(f => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Pending', count: alerts.filter(a => a.status === 'pending').length, color: 'text-yellow-400' },
          { label: 'Critical', count: alerts.filter(a => a.severity === 'critical').length, color: 'text-red-400' },
          { label: 'Resolved', count: alerts.filter(a => a.status === 'resolved').length, color: 'text-green-400' },
          { label: 'Total', count: alerts.length, color: 'text-blue-400' },
        ].map(stat => (
          <Card key={stat.label} className="bg-card/50">
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.count}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts List */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredAlerts.map((alert, index) => {
            const Icon = getAlertIcon(alert.alert_type);
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`border-l-4 ${
                  alert.severity === 'critical' ? 'border-l-red-500' :
                  alert.severity === 'high' ? 'border-l-orange-500' :
                  alert.severity === 'medium' ? 'border-l-yellow-500' : 'border-l-blue-500'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{alert.title}</h3>
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                            <Badge variant="outline">
                              L{alert.escalation_level}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {alert.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(alert.created_at).toLocaleString()}
                            </span>
                            {alert.ip_address && (
                              <span>IP: {alert.ip_address}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {alert.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedAlert(alert)}
                            >
                              <Eye className="h-4 w-4 mr-1" /> Review
                            </Button>
                          </>
                        )}
                        {alert.status !== 'pending' && (
                          <Badge variant="outline" className="text-green-400">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {alert.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Resolution Modal */}
      <AnimatePresence>
        {selectedAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedAlert(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-card border border-border rounded-xl p-6 max-w-lg w-full"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Resolve Alert</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium">{selectedAlert.title}</p>
                  <p className="text-sm text-muted-foreground">{selectedAlert.description}</p>
                  {selectedAlert.details && (
                    <pre className="mt-2 text-xs bg-background p-2 rounded overflow-auto max-h-32">
                      {JSON.stringify(selectedAlert.details, null, 2)}
                    </pre>
                  )}
                </div>
                
                <Textarea
                  placeholder="Resolution notes..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  rows={3}
                />
                
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleResolve('dismiss')} className="flex-1">
                    Dismiss
                  </Button>
                  <Button variant="outline" onClick={() => handleResolve('escalate')} className="flex-1">
                    Escalate
                  </Button>
                  <Button variant="destructive" onClick={() => handleResolve('suspend')} className="flex-1">
                    <Ban className="h-4 w-4 mr-1" /> Suspend
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

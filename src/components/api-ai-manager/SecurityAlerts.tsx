import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Bot, Zap, Clock, CheckCircle, XCircle, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SecurityAlert {
  id: string;
  type: 'api_anomaly' | 'ai_misuse' | 'integration_failure' | 'rate_breach' | 'auth_failure';
  title: string;
  description: string;
  source: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'investigating' | 'resolved';
  timestamp: string;
  escalatedTo?: string;
}

const mockAlerts: SecurityAlert[] = [
  { id: '1', type: 'api_anomaly', title: 'Unusual API Traffic Pattern', description: 'Payment API receiving 10x normal request volume from single IP range', source: 'Payment Gateway', severity: 'high', status: 'investigating', timestamp: '5 min ago', escalatedTo: 'Security Team' },
  { id: '2', type: 'ai_misuse', title: 'AI Input Validation Bypass Attempt', description: 'Detected attempt to inject malicious prompts into Lead Scoring AI', source: 'Lead Scoring AI', severity: 'critical', status: 'active', timestamp: '15 min ago' },
  { id: '3', type: 'integration_failure', title: 'SMS Gateway Connection Timeout', description: 'Twilio integration experiencing intermittent connectivity issues', source: 'SMS Gateway', severity: 'medium', status: 'investigating', timestamp: '30 min ago' },
  { id: '4', type: 'rate_breach', title: 'Rate Limit Exceeded - Auth API', description: 'IP 45.33.xxx.xxx exceeded auth rate limits by 500%', source: 'Auth API', severity: 'high', status: 'resolved', timestamp: '1 hour ago' },
  { id: '5', type: 'auth_failure', title: 'Multiple API Key Validation Failures', description: 'Expired API key being used repeatedly from multiple sources', source: 'API Gateway', severity: 'medium', status: 'active', timestamp: '2 hours ago' },
];

export function SecurityAlerts() {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'api_anomaly': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'ai_misuse': return <Bot className="w-5 h-5 text-red-400" />;
      case 'integration_failure': return <XCircle className="w-5 h-5 text-orange-400" />;
      case 'rate_breach': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      default: return <Shield className="w-5 h-5 text-red-400" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'investigating': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'resolved': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const activeAlerts = mockAlerts.filter(a => a.status !== 'resolved').length;
  const criticalAlerts = mockAlerts.filter(a => a.severity === 'critical' && a.status !== 'resolved').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Security Alerts</h2>
          <p className="text-sm text-muted-foreground">API anomalies • AI misuse • Integration failures</p>
        </div>
        <div className="flex gap-2">
          {criticalAlerts > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {criticalAlerts} CRITICAL
            </Badge>
          )}
          <Badge variant="outline" className="bg-amber-500/10 text-amber-400">
            {activeAlerts} Active
          </Badge>
        </div>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Zap className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-foreground">
              {mockAlerts.filter(a => a.type === 'api_anomaly').length}
            </div>
            <div className="text-xs text-muted-foreground">API Anomalies</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Bot className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-foreground">
              {mockAlerts.filter(a => a.type === 'ai_misuse').length}
            </div>
            <div className="text-xs text-muted-foreground">AI Misuse</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <XCircle className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-foreground">
              {mockAlerts.filter(a => a.type === 'integration_failure').length}
            </div>
            <div className="text-xs text-muted-foreground">Integration Failures</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-foreground">
              {mockAlerts.filter(a => a.status === 'resolved').length}
            </div>
            <div className="text-xs text-muted-foreground">Resolved Today</div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {mockAlerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`bg-card/50 ${
              alert.severity === 'critical' ? 'border-red-500/50' :
              alert.severity === 'high' ? 'border-orange-500/30' : 'border-border/50'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    alert.severity === 'critical' ? 'bg-red-500/20' :
                    alert.severity === 'high' ? 'bg-orange-500/20' : 'bg-muted'
                  }`}>
                    {getTypeIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">{alert.title}</span>
                      <Badge variant="outline" className={getSeverityBadge(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className={getStatusBadge(alert.status)}>
                        {alert.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Source: {alert.source}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{alert.timestamp}</span>
                      </div>
                      {alert.escalatedTo && (
                        <div className="flex items-center gap-1 text-primary">
                          <ArrowUpRight className="w-3 h-3" />
                          <span>Escalated to {alert.escalatedTo}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {alert.status !== 'resolved' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Investigate
                      </Button>
                      <Button size="sm" variant="outline">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        Escalate
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

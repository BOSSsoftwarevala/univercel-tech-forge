import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bell, Check, Eye, Loader2
} from 'lucide-react';
import { useLeadAlerts } from '@/hooks/useLeadData';
import { formatDistanceToNow } from 'date-fns';

const LMAlerts = () => {
  const { data: alerts, isLoading } = useLeadAlerts();

  const getSeverityStyle = (severity: string | null) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alerts & Notifications</h1>
          <p className="text-muted-foreground">Real-time lead alerts from database</p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
          {alerts?.length || 0} Active Alerts
        </Badge>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : !alerts?.length ? (
        <Card className="bg-card border-border">
          <CardContent className="p-8 flex flex-col items-center text-muted-foreground">
            <Check className="w-10 h-10 mb-3 text-green-500" />
            <p className="text-sm font-medium">No active alerts</p>
            <p className="text-xs">All clear — no pending notifications</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert: any, index: number) => (
            <motion.div key={alert.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
              <Card className={`border ${getSeverityStyle(alert.severity)}`}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-current animate-pulse" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{alert.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px]">{alert.alert_type}</Badge>
                        <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getSeverityStyle(alert.severity)}`}>{alert.severity || 'info'}</Badge>
                    <Button size="sm" variant="ghost" className="h-7 text-xs"><Eye className="w-3 h-3 mr-1" /> View</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LMAlerts;

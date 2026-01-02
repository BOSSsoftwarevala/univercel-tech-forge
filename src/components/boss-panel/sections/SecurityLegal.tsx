import React from 'react';
import { motion } from 'framer-motion';
import { 
  Lock,
  AlertTriangle,
  Shield,
  Eye,
  FileWarning,
  CheckCircle,
  XCircle,
  Clock,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SecurityAlert {
  id: string;
  type: 'login_anomaly' | 'role_misuse' | 'data_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
  location?: string;
  resolved: boolean;
}

const securityAlerts: SecurityAlert[] = [
  { id: '1', type: 'login_anomaly', severity: 'high', title: 'Unusual Login Location', description: 'Login attempt from new country (Russia) for user wei.chen@company.com', timestamp: new Date(Date.now() - 300000), user: 'Wei Chen', location: 'Moscow, Russia', resolved: false },
  { id: '2', type: 'role_misuse', severity: 'medium', title: 'Elevated Access Attempt', description: 'Franchise user attempted to access Super Admin dashboard', timestamp: new Date(Date.now() - 600000), user: 'John Smith', resolved: true },
  { id: '3', type: 'data_access', severity: 'critical', title: 'Bulk Data Export', description: 'Large data export (50,000+ records) initiated by country admin', timestamp: new Date(Date.now() - 900000), user: 'Maria Garcia', resolved: false },
  { id: '4', type: 'login_anomaly', severity: 'low', title: 'Multiple Failed Logins', description: '5 failed login attempts for user account', timestamp: new Date(Date.now() - 1200000), user: 'James Wilson', resolved: true },
];

const complianceStatus = [
  { name: 'GDPR Compliance', status: 'compliant', lastAudit: '2024-01-15' },
  { name: 'SOC 2 Type II', status: 'compliant', lastAudit: '2024-01-10' },
  { name: 'ISO 27001', status: 'pending', lastAudit: '2023-12-20' },
  { name: 'HIPAA', status: 'not_applicable', lastAudit: 'N/A' },
  { name: 'PCI DSS', status: 'compliant', lastAudit: '2024-01-12' },
];

const severityColors = {
  low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusColors = {
  compliant: 'text-green-400',
  pending: 'text-amber-400',
  not_applicable: 'text-white/40',
  non_compliant: 'text-red-400',
};

const statusIcons = {
  compliant: CheckCircle,
  pending: Clock,
  not_applicable: Eye,
  non_compliant: XCircle,
};

export function SecurityLegal() {
  const unresolvedAlerts = securityAlerts.filter(a => !a.resolved).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Security & Legal</h1>
          <p className="text-white/50 text-sm">Security alerts and compliance monitoring</p>
        </div>
        {unresolvedAlerts > 0 && (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            {unresolvedAlerts} Unresolved Alerts
          </Badge>
        )}
      </div>

      {/* Security Alerts */}
      <Card className="bg-[#12121a] border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Security Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg border ${alert.resolved ? 'bg-white/5 border-white/10' : 'bg-red-500/5 border-red-500/20'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${severityColors[alert.severity]}`}>
                      {alert.type === 'login_anomaly' && <MapPin className="w-5 h-5" />}
                      {alert.type === 'role_misuse' && <Shield className="w-5 h-5" />}
                      {alert.type === 'data_access' && <FileWarning className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-white font-medium">{alert.title}</h4>
                        <Badge className={`${severityColors[alert.severity]} border text-[10px]`}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-white/60 mt-1">{alert.description}</p>
                      {alert.user && (
                        <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                          <span>User: {alert.user}</span>
                          {alert.location && <span>Location: {alert.location}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={alert.resolved ? 'border-green-500/30 text-green-400' : 'border-red-500/30 text-red-400'}>
                      {alert.resolved ? 'Resolved' : 'Open'}
                    </Badge>
                    <div className="text-xs text-white/40 mt-1">
                      {alert.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Status */}
      <Card className="bg-[#12121a] border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            Legal Compliance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {complianceStatus.map((item, index) => {
              const StatusIcon = statusIcons[item.status as keyof typeof statusIcons];
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <StatusIcon className={`w-5 h-5 ${statusColors[item.status as keyof typeof statusColors]}`} />
                    <span className="text-white font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-white/40">
                      Last Audit: {item.lastAudit}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={`border-white/20 ${statusColors[item.status as keyof typeof statusColors]}`}
                    >
                      {item.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Data Access Violations */}
      <Card className="bg-[#12121a] border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" />
            Data Access Violations (Last 30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-white/5 text-center">
              <p className="text-3xl font-bold text-white">12</p>
              <p className="text-xs text-white/50">Total Violations</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 text-center">
              <p className="text-3xl font-bold text-green-400">9</p>
              <p className="text-xs text-white/50">Resolved</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 text-center">
              <p className="text-3xl font-bold text-red-400">3</p>
              <p className="text-xs text-white/50">Pending</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 text-center">
              <p className="text-3xl font-bold text-amber-400">2</p>
              <p className="text-xs text-white/50">High Severity</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

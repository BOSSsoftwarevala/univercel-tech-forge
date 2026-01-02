import React from 'react';
import { motion } from 'framer-motion';
import { 
  Settings,
  Bell,
  Phone,
  Database,
  Shield,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const notificationSettings = [
  { id: 'critical_alerts', label: 'Critical Security Alerts', description: 'Immediate notification for high-severity security events', enabled: true },
  { id: 'revenue_reports', label: 'Daily Revenue Reports', description: 'Summary of daily revenue at end of business day', enabled: true },
  { id: 'new_superadmin', label: 'Super Admin Changes', description: 'Notification when super admins are added or removed', enabled: true },
  { id: 'system_health', label: 'System Health Alerts', description: 'Alerts when system health drops below 90%', enabled: false },
  { id: 'compliance', label: 'Compliance Updates', description: 'Updates on compliance status changes', enabled: true },
];

const emergencyContacts = [
  { name: 'Primary IT Support', contact: '+1 (555) 123-4567', type: 'Phone' },
  { name: 'Security Team Lead', contact: '+1 (555) 234-5678', type: 'Phone' },
  { name: 'Legal Department', contact: 'legal@company.com', type: 'Email' },
  { name: 'CEO Direct Line', contact: '+1 (555) 999-0000', type: 'Phone' },
];

const backupStatus = [
  { name: 'Database Backup', lastBackup: '2024-01-20 03:00 AM', status: 'verified', size: '2.4 TB' },
  { name: 'File Storage Backup', lastBackup: '2024-01-20 04:30 AM', status: 'verified', size: '850 GB' },
  { name: 'Configuration Backup', lastBackup: '2024-01-20 02:00 AM', status: 'verified', size: '12 MB' },
  { name: 'Audit Log Archive', lastBackup: '2024-01-19 11:59 PM', status: 'pending', size: '45 GB' },
];

export function BossSettings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-white/50 text-sm">Limited configuration options for Boss role</p>
        </div>
        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
          LIMITED ACCESS
        </Badge>
      </div>

      {/* Notification Rules */}
      <Card className="bg-[#12121a] border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />
            Notification Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notificationSettings.map((setting, index) => (
              <motion.div
                key={setting.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5"
              >
                <div className="flex-1">
                  <Label className="text-white font-medium">{setting.label}</Label>
                  <p className="text-sm text-white/50 mt-1">{setting.description}</p>
                </div>
                <Switch defaultChecked={setting.enabled} />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card className="bg-[#12121a] border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Phone className="w-5 h-5 text-red-400" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {emergencyContacts.map((contact, index) => (
              <motion.div
                key={contact.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{contact.name}</p>
                    <p className="text-sm text-white/50">{contact.type}</p>
                  </div>
                </div>
                <code className="text-sm text-amber-400 bg-amber-500/10 px-3 py-1 rounded">
                  {contact.contact}
                </code>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Backup Verification Status */}
      <Card className="bg-[#12121a] border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Database className="w-5 h-5 text-green-400" />
            Backup Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {backupStatus.map((backup, index) => (
              <motion.div
                key={backup.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5"
              >
                <div className="flex items-center gap-3">
                  {backup.status === 'verified' ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-400" />
                  )}
                  <div>
                    <p className="text-white font-medium">{backup.name}</p>
                    <p className="text-xs text-white/50">Size: {backup.size}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="outline" 
                    className={backup.status === 'verified' ? 'border-green-500/30 text-green-400' : 'border-amber-500/30 text-amber-400'}
                  >
                    {backup.status.toUpperCase()}
                  </Badge>
                  <p className="text-xs text-white/40 mt-1">{backup.lastBackup}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="bg-amber-500/10 border-amber-500/30">
        <CardContent className="p-4 flex items-center gap-3">
          <Shield className="w-5 h-5 text-amber-400" />
          <p className="text-amber-200 text-sm">
            System-level settings are managed by the technical team. Contact IT support for configuration changes beyond this scope.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

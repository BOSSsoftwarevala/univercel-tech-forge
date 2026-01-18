import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, Lock, FileSearch, Eye, Settings,
  Check, AlertTriangle
} from 'lucide-react';

const securitySettings = [
  { 
    id: 'access', 
    name: 'Lead Access Control', 
    icon: Shield, 
    enabled: true,
    description: 'Control who can view and edit leads',
    rules: 5
  },
  { 
    id: 'masked', 
    name: 'Masked Contact Info', 
    icon: Lock, 
    enabled: true,
    description: 'Hide sensitive contact information',
    rules: 3
  },
  { 
    id: 'export', 
    name: 'Export Permission Lock', 
    icon: Lock, 
    enabled: true,
    description: 'Restrict data export capabilities',
    rules: 2
  },
  { 
    id: 'audit', 
    name: 'Audit Logs', 
    icon: FileSearch, 
    enabled: true,
    description: 'Track all lead-related activities',
    rules: 0
  },
];

const auditLogs = [
  { id: 1, action: 'Lead Viewed', user: 'Vikram Singh', lead: 'Rahul Sharma', time: '2 mins ago', ip: '192.168.1.***' },
  { id: 2, action: 'Lead Edited', user: 'Neha Verma', lead: 'Priya Patel', time: '15 mins ago', ip: '192.168.1.***' },
  { id: 3, action: 'Export Attempted', user: 'Raj Malhotra', lead: 'Bulk Export', time: '32 mins ago', ip: '192.168.1.***' },
  { id: 4, action: 'Contact Unmasked', user: 'Anita Desai', lead: 'Amit Kumar', time: '1 hour ago', ip: '192.168.1.***' },
  { id: 5, action: 'Lead Deleted', user: 'Admin', lead: 'Test Lead', time: '2 hours ago', ip: '192.168.1.***' },
];

const accessRules = [
  { role: 'Admin', view: true, edit: true, delete: true, export: true },
  { role: 'Team Lead', view: true, edit: true, delete: false, export: true },
  { role: 'Agent', view: true, edit: true, delete: false, export: false },
  { role: 'Viewer', view: true, edit: false, delete: false, export: false },
];

const LMSecurity = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Security & Compliance</h1>
          <p className="text-muted-foreground">Lead data protection and access control</p>
        </div>
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
          All Protections Active
        </Badge>
      </div>

      {/* Security Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {securitySettings.map((setting, index) => {
          const Icon = setting.icon;
          return (
            <motion.div
              key={setting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{setting.name}</h3>
                        <p className="text-xs text-muted-foreground">{setting.description}</p>
                      </div>
                    </div>
                    <Switch checked={setting.enabled} />
                  </div>
                  
                  {setting.rules > 0 && (
                    <div className="text-xs text-muted-foreground mb-3">
                      {setting.rules} active rules
                    </div>
                  )}

                  <div className="flex items-center gap-1 pt-2 border-t border-border">
                    <Button size="sm" variant="ghost" className="h-7 text-xs">
                      <Eye className="w-3 h-3 mr-1" /> View
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">
                      <Settings className="w-3 h-3 mr-1" /> Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Access Control Matrix */}
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <CardTitle>Access Control Matrix</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-accent/50">
              <tr>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Role</th>
                <th className="text-center p-3 text-xs font-medium text-muted-foreground">View</th>
                <th className="text-center p-3 text-xs font-medium text-muted-foreground">Edit</th>
                <th className="text-center p-3 text-xs font-medium text-muted-foreground">Delete</th>
                <th className="text-center p-3 text-xs font-medium text-muted-foreground">Export</th>
              </tr>
            </thead>
            <tbody>
              {accessRules.map((rule) => (
                <tr key={rule.role} className="border-b border-border hover:bg-accent/30">
                  <td className="p-3 font-medium text-foreground">{rule.role}</td>
                  <td className="p-3 text-center">
                    {rule.view ? (
                      <Check className="w-4 h-4 text-green-500 mx-auto" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-500 mx-auto" />
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {rule.edit ? (
                      <Check className="w-4 h-4 text-green-500 mx-auto" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-500 mx-auto" />
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {rule.delete ? (
                      <Check className="w-4 h-4 text-green-500 mx-auto" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-500 mx-auto" />
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {rule.export ? (
                      <Check className="w-4 h-4 text-green-500 mx-auto" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-500 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center justify-between">
            <span>Recent Audit Logs</span>
            <Button size="sm" variant="outline">View All</Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-accent/50">
              <tr>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Action</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">User</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Lead</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Time</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">IP</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log, index) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border hover:bg-accent/30"
                >
                  <td className="p-3">
                    <Badge variant="outline" className="text-xs">{log.action}</Badge>
                  </td>
                  <td className="p-3 font-medium text-foreground">{log.user}</td>
                  <td className="p-3 text-sm text-muted-foreground">{log.lead}</td>
                  <td className="p-3 text-xs text-muted-foreground">{log.time}</td>
                  <td className="p-3 text-xs text-muted-foreground font-mono">{log.ip}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LMSecurity;

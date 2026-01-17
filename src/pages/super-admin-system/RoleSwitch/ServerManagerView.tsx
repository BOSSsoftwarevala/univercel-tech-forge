/**
 * SERVER MANAGER VIEW
 * Content-only component for use within RoleSwitchDashboard
 * Uses the new ultra-simple ServerModuleContainer
 */

import React from 'react';
import { ServerModuleContainer } from '@/components/server-module/ServerModuleContainer';

interface ServerManagerViewProps {
  activeNav?: string;
}

const ServerManagerView: React.FC<ServerManagerViewProps> = ({ activeNav = 'dashboard' }) => {
  // Map old nav values to new section values if needed
  const getSectionFromNav = (nav: string) => {
    const mapping: Record<string, any> = {
      'dashboard': 'overview',
      'servers': 'active-servers',
      'databases': 'overview',
      'storage': 'overview',
      'monitoring': 'health-load',
      'performance': 'health-load',
      'security': 'security',
      'activity': 'logs',
      'settings': 'settings',
    };
    return mapping[nav] || 'overview';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'healthy':
        return 'bg-emerald-500';
      case 'warning':
        return 'bg-amber-500';
      case 'offline':
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-slate-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
      case 'healthy':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'warning':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'offline':
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const renderContent = () => {
    switch (activeNav) {
      case 'servers':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">All Servers</h2>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Server
              </Button>
            </div>
            <div className="grid gap-3">
              {mockServers.map((server, index) => (
                <motion.div
                  key={server.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-card/80 border-border/50 hover:border-border transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn("w-2.5 h-2.5 rounded-full", getStatusColor(server.status))} />
                          <div>
                            <p className="font-medium text-foreground">{server.name}</p>
                            <p className="text-xs text-muted-foreground">{server.region}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">CPU</p>
                            <p className={cn("text-sm font-medium", server.cpu > 70 ? "text-amber-400" : "text-foreground")}>{server.cpu}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">RAM</p>
                            <p className={cn("text-sm font-medium", server.ram > 70 ? "text-amber-400" : "text-foreground")}>{server.ram}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Disk</p>
                            <p className={cn("text-sm font-medium", server.disk > 70 ? "text-amber-400" : "text-foreground")}>{server.disk}%</p>
                          </div>
                          <Badge className={cn("text-xs", getStatusBadge(server.status))}>
                            {server.status}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'databases':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Databases</h2>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Database
              </Button>
            </div>
            <div className="grid gap-3">
              {mockDatabases.map((db, index) => (
                <motion.div
                  key={db.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-card/80 border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <Database className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{db.name}</p>
                            <p className="text-xs text-muted-foreground">{db.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Size</p>
                            <p className="text-sm font-medium text-foreground">{db.size}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Connections</p>
                            <p className="text-sm font-medium text-foreground">{db.connections}</p>
                          </div>
                          <Badge className={cn("text-xs", getStatusBadge(db.status))}>
                            {db.status}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'storage':
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Storage Overview</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: 'Primary Storage', used: 2.4, total: 10, type: 'SSD' },
                { name: 'Backup Storage', used: 8.1, total: 20, type: 'HDD' },
                { name: 'Archive Storage', used: 15.2, total: 50, type: 'Cold' },
              ].map((storage, index) => (
                <motion.div
                  key={storage.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-card/80 border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <HardDrive className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="font-medium text-foreground">{storage.name}</p>
                          <p className="text-xs text-muted-foreground">{storage.type}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{storage.used} TB used</span>
                          <span className="text-foreground">{storage.total} TB</span>
                        </div>
                        <Progress value={(storage.used / storage.total) * 100} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'monitoring':
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">System Monitoring</h2>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Active Alerts', value: '3', icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/20' },
                { label: 'Uptime', value: '99.97%', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
                { label: 'Response Time', value: '45ms', icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/20' },
                { label: 'Requests/sec', value: '12.4K', icon: Activity, color: 'text-purple-400', bg: 'bg-purple-500/20' },
              ].map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-card/80 border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">{metric.label}</p>
                          <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                        </div>
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", metric.bg)}>
                          <metric.icon className={cn("w-5 h-5", metric.color)} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Performance Metrics</h2>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-card/80 border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">CPU Usage Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32 flex items-end gap-1">
                    {[35, 42, 38, 55, 48, 62, 45, 52, 48, 41, 38, 45].map((val, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-emerald-500/60 rounded-t"
                        style={{ height: `${val}%` }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card/80 border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Memory Usage Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32 flex items-end gap-1">
                    {[58, 62, 65, 71, 68, 72, 69, 74, 71, 68, 65, 62].map((val, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-blue-500/60 rounded-t"
                        style={{ height: `${val}%` }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Security Center</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'SSL Certificates', status: 'Valid', icon: Lock, color: 'text-emerald-400' },
                { label: 'Firewall', status: 'Active', icon: Shield, color: 'text-emerald-400' },
                { label: 'DDoS Protection', status: 'Active', icon: Cloud, color: 'text-emerald-400' },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-card/80 border-border/50">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <item.icon className={cn("w-6 h-6", item.color)} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-emerald-400">{item.status}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'activity':
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
            <Card className="bg-card/80 border-border/50">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {[
                    { time: '2 min ago', event: 'Server srv-1 scaled up CPU', type: 'info' },
                    { time: '5 min ago', event: 'Database backup completed', type: 'success' },
                    { time: '12 min ago', event: 'High memory alert on srv-4', type: 'warning' },
                    { time: '1 hour ago', event: 'SSL certificate renewed', type: 'success' },
                    { time: '3 hours ago', event: 'Security scan completed', type: 'info' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        activity.type === 'success' ? 'bg-emerald-500' :
                        activity.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                      )} />
                      <span className="text-xs text-muted-foreground w-20">{activity.time}</span>
                      <span className="text-sm text-foreground">{activity.event}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Server Settings</h2>
            <Card className="bg-card/80 border-border/50">
              <CardContent className="p-4 space-y-4">
                {[
                  { label: 'Auto-scaling', enabled: true },
                  { label: 'Auto-healing', enabled: true },
                  { label: 'Automatic backups', enabled: true },
                  { label: 'DDoS protection', enabled: true },
                  { label: 'Debug mode', enabled: false },
                ].map((setting, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <span className="text-foreground">{setting.label}</span>
                    <Badge className={cn(
                      "text-xs",
                      setting.enabled ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-500/20 text-slate-400"
                    )}>
                      {setting.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );

      // Default dashboard view
      default:
        return (
          <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-5 gap-4">
              {[
                { label: 'Total Servers', value: '5', icon: Server, color: 'text-blue-400', bg: 'bg-blue-500/20' },
                { label: 'Online', value: '4', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
                { label: 'Warnings', value: '1', icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/20' },
                { label: 'Databases', value: '3', icon: Database, color: 'text-purple-400', bg: 'bg-purple-500/20' },
                { label: 'Uptime', value: '99.97%', icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-card/80 border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        </div>
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.bg)}>
                          <stat.icon className={cn("w-5 h-5", stat.color)} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Server List */}
            <Card className="bg-card/80 border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Server Status</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleRefresh}
                    disabled={refreshing}
                  >
                    <RefreshCw className={cn("w-4 h-4 mr-2", refreshing && "animate-spin")} />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockServers.map((server, index) => (
                    <motion.div
                      key={server.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn("w-2.5 h-2.5 rounded-full", getStatusColor(server.status))} />
                        <div>
                          <p className="font-medium text-foreground">{server.name}</p>
                          <p className="text-xs text-muted-foreground">{server.region} • Uptime: {server.uptime}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className={cn("text-sm", server.cpu > 70 ? "text-amber-400" : "text-muted-foreground")}>{server.cpu}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wifi className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className={cn("text-sm", server.ram > 70 ? "text-amber-400" : "text-muted-foreground")}>{server.ram}%</span>
                        </div>
                        <Badge className={cn("text-xs", getStatusBadge(server.status))}>
                          {server.status}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Add Server', icon: Plus, color: 'bg-emerald-600 hover:bg-emerald-700' },
                { label: 'Run Backup', icon: HardDrive, color: 'bg-blue-600 hover:bg-blue-700' },
                { label: 'Security Scan', icon: Shield, color: 'bg-purple-600 hover:bg-purple-700' },
                { label: 'View Logs', icon: Activity, color: 'bg-amber-600 hover:bg-amber-700' },
              ].map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Button className={cn("w-full h-12 justify-center gap-2", action.color)}>
                    <action.icon className="w-4 h-4" />
                    {action.label}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg">
            <Server className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Server Management</h1>
            <p className="text-xs text-muted-foreground">Infrastructure Control Center</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse" />
            All Systems Operational
          </Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-8"
          >
            <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={activeNav}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {renderContent()}
      </motion.div>
    </div>
  );
};

export default ServerManagerView;

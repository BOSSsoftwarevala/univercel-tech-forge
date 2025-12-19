import SuperAdminLayout from '@/components/layouts/SuperAdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, Store, Code2, Megaphone, Crown, Wallet, 
  TrendingUp, Activity, AlertTriangle, CheckCircle 
} from 'lucide-react';

const stats = [
  { label: 'Total Users', value: '12,453', change: '+12%', icon: Users, color: 'text-blue-500' },
  { label: 'Franchises', value: '42', change: '+3', icon: Store, color: 'text-green-500' },
  { label: 'Developers', value: '128', change: '+8', icon: Code2, color: 'text-purple-500' },
  { label: 'Resellers', value: '356', change: '+24', icon: Megaphone, color: 'text-orange-500' },
  { label: 'Prime Users', value: '89', change: '+5', icon: Crown, color: 'text-yellow-500' },
  { label: 'Revenue', value: '₹45.2L', change: '+18%', icon: Wallet, color: 'text-emerald-500' },
];

const recentAlerts = [
  { type: 'warning', message: 'High login attempts from IP 192.168.1.x', time: '2 min ago' },
  { type: 'success', message: 'Developer task #4521 completed', time: '5 min ago' },
  { type: 'error', message: 'Payment gateway timeout', time: '12 min ago' },
  { type: 'info', message: 'New franchise application received', time: '25 min ago' },
];

const SuperAdminDashboardPage = () => {
  return (
    <SuperAdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">Complete system overview and control</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-xs text-green-500">{stat.change}</span>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Activity */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Live Activity
              </CardTitle>
              <CardDescription>Real-time system activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <div className="flex-1">
                      <p className="text-sm">User activity #{Math.floor(Math.random() * 1000)}</p>
                      <p className="text-xs text-muted-foreground">Just now</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Recent Alerts
              </CardTitle>
              <CardDescription>System notifications and warnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAlerts.map((alert, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />}
                    {alert.type === 'success' && <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />}
                    {alert.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />}
                    {alert.type === 'info' && <Activity className="w-4 h-4 text-blue-500 mt-0.5" />}
                    <div className="flex-1">
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                'Add User', 'Create Task', 'New Demo', 'Send Alert',
                'Generate Report', 'View Logs', 'Manage Roles', 'System Health'
              ].map((action) => (
                <button
                  key={action}
                  className="p-3 bg-muted/50 hover:bg-muted rounded-lg text-sm font-medium transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminDashboardPage;

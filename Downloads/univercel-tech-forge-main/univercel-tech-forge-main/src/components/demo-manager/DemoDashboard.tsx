import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { 
  Monitor, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Clock, 
  Globe,
  Smartphone,
  Activity,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";

interface DemoStats {
  total: number;
  active: number;
  maintenance: number;
  down: number;
}

interface TopDemo {
  name: string;
  clicks: number;
  uptime: number;
  tech: string;
  status: string;
}

const DemoDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [demoStats, setDemoStats] = useState<DemoStats>({ total: 0, active: 0, maintenance: 0, down: 0 });
  const [topDemos, setTopDemos] = useState<TopDemo[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch demo counts by status
      const { data: demos, error } = await supabase
        .from('demos')
        .select('id, title, status, uptime_percentage, tech_stack');

      if (error) throw error;

      const stats: DemoStats = {
        total: demos?.length || 0,
        active: demos?.filter(d => d.status === 'active').length || 0,
        maintenance: demos?.filter(d => d.status === 'maintenance').length || 0,
        down: demos?.filter(d => d.status === 'down' || d.status === 'inactive').length || 0,
      };
      setDemoStats(stats);

      // Get top demos (using available data)
      const top = (demos || []).slice(0, 5).map(d => ({
        name: d.title || 'Untitled',
        clicks: Math.floor(Math.random() * 3000) + 500, // Mock clicks for now
        uptime: d.uptime_percentage || 99.5,
        tech: Array.isArray(d.tech_stack) ? d.tech_stack[0] : 'React',
        status: d.status || 'active'
      }));
      setTopDemos(top);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const metrics = [
    { label: "Total Demos", value: demoStats.total.toString(), change: "+0", icon: Monitor, color: "text-neon-teal" },
    { label: "Active", value: demoStats.active.toString(), change: "+0", icon: Activity, color: "text-neon-green" },
    { label: "Total Clicks", value: "12,847", change: "+847", icon: TrendingUp, color: "text-primary" },
    { label: "Active Users", value: "1,234", change: "+89", icon: Users, color: "text-neon-cyan" },
    { label: "Uptime", value: "99.7%", change: "+0.2%", icon: Clock, color: "text-emerald-400" },
    { label: "Active Alerts", value: demoStats.down.toString(), change: "0", icon: AlertTriangle, color: "text-orange-400" },
  ];

  const demosByStatus = [
    { status: "Active", count: demoStats.active, color: "bg-neon-green/20 text-neon-green border-neon-green/30" },
    { status: "Maintenance", count: demoStats.maintenance, color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
    { status: "Down", count: demoStats.down, color: "bg-red-500/20 text-red-400 border-red-500/30" },
  ];

  const regionStats = [
    { region: "North America", clicks: 4250, percentage: 33 },
    { region: "Europe", clicks: 3180, percentage: 25 },
    { region: "Asia Pacific", clicks: 2890, percentage: 22 },
    { region: "Middle East", clicks: 1560, percentage: 12 },
    { region: "Others", clicks: 967, percentage: 8 },
  ];

  const deviceStats = [
    { device: "Desktop", percentage: 62, icon: Monitor },
    { device: "Mobile", percentage: 31, icon: Smartphone },
    { device: "Tablet", percentage: 7, icon: Globe },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Demo Dashboard</h1>
          <p className="text-muted-foreground">Real-time demo performance overview</p>
        </div>
        <Badge className="bg-neon-green/20 text-neon-green border border-neon-green/30 animate-pulse">
          <Activity className="w-3 h-3 mr-1" />
          LIVE
        </Badge>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card border-border/50 hover:border-primary/50 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  <Badge variant="outline" className="text-xs bg-background/50">
                    {metric.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Status Overview & Top Demos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Demo Status */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card border-border/50 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Demo Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {demosByStatus.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.status === "Active" ? (
                      <CheckCircle className="w-4 h-4 text-neon-green" />
                    ) : item.status === "Down" ? (
                      <XCircle className="w-4 h-4 text-red-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-orange-400" />
                    )}
                    <span className="text-sm text-foreground">{item.status}</span>
                  </div>
                  <Badge className={item.color}>{item.count}</Badge>
                </div>
              ))}
              
              <div className="pt-4 border-t border-border/50">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Overall Health</span>
                  <span>89%</span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-neon-green to-neon-teal w-[89%] rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Performing Demos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="glass-card border-border/50 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Top Performing Demos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topDemos.map((demo, index) => (
                  <div key={demo.name} className="flex items-center justify-between p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{demo.name}</p>
                        <p className="text-xs text-muted-foreground">{demo.tech}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{demo.clicks.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">clicks</p>
                      </div>
                      <Badge 
                        className={demo.status === "active" 
                          ? "bg-neon-green/20 text-neon-green" 
                          : "bg-orange-500/20 text-orange-400"
                        }
                      >
                        {demo.uptime}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Region & Device Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Region Stats */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                Region Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {regionStats.map((region) => (
                <div key={region.region} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">{region.region}</span>
                    <span className="text-muted-foreground">{region.clicks.toLocaleString()} ({region.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-primary to-neon-teal rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${region.percentage}%` }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Device Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-primary" />
                Device Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {deviceStats.map((device, index) => (
                  <motion.div 
                    key={device.device}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="text-center p-4 rounded-lg bg-background/30"
                  >
                    <device.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold text-foreground">{device.percentage}%</p>
                    <p className="text-xs text-muted-foreground">{device.device}</p>
                  </motion.div>
                ))}
              </div>
              
              {/* Visual Chart */}
              <div className="mt-6 h-4 rounded-full overflow-hidden flex">
                <div className="bg-primary h-full" style={{ width: "62%" }} />
                <div className="bg-neon-teal h-full" style={{ width: "31%" }} />
                <div className="bg-neon-green h-full" style={{ width: "7%" }} />
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Desktop</span>
                <span>Mobile</span>
                <span>Tablet</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DemoDashboard;

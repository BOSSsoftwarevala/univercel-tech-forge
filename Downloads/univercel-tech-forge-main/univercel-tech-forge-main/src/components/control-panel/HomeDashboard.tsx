/**
 * HomeDashboard - Enterprise Home/Landing Management
 * Quick overview and navigation hub
 */

import React from "react";
import { 
  Home, Activity, Users, Server, TrendingUp, 
  Clock, Bell, ArrowRight, Star, Zap, Globe,
  BarChart3, Shield, CheckCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  route: string;
}

interface RecentActivity {
  id: string;
  action: string;
  time: string;
  status: "success" | "pending" | "info";
}

export default function HomeDashboard() {
  const { user, userRole } = useAuth();
  
  const quickActions: QuickAction[] = [
    { id: "1", label: "View Analytics", icon: BarChart3, color: "from-blue-500 to-cyan-500", route: "analytics" },
    { id: "2", label: "Manage Users", icon: Users, color: "from-purple-500 to-pink-500", route: "users" },
    { id: "3", label: "Server Status", icon: Server, color: "from-green-500 to-emerald-500", route: "servers" },
    { id: "4", label: "Security", icon: Shield, color: "from-amber-500 to-orange-500", route: "security" },
  ];

  const recentActivity: RecentActivity[] = [
    { id: "1", action: "New lead assigned to Franchise Mumbai", time: "2 min ago", status: "success" },
    { id: "2", action: "Server backup completed", time: "15 min ago", status: "success" },
    { id: "3", action: "New support ticket opened", time: "32 min ago", status: "pending" },
    { id: "4", action: "Marketing campaign launched", time: "1 hour ago", status: "info" },
    { id: "5", action: "Developer task completed", time: "2 hours ago", status: "success" },
  ];

  const stats = [
    { label: "Active Users", value: "2,847", change: "+12%", icon: Users },
    { label: "System Health", value: "99.9%", change: "Stable", icon: Activity },
    { label: "Tasks Completed", value: "156", change: "Today", icon: CheckCircle },
    { label: "Revenue", value: "₹24.5L", change: "+8%", icon: TrendingUp },
  ];

  return (
    <div className="h-full p-6 space-y-6 overflow-auto">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Home className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}!
            </h1>
            <p className="text-sm text-slate-400">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
        <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
          <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
          System Online
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-slate-900/50 border-slate-700/50 hover:border-slate-600/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <Badge variant="outline" className="mt-2 text-xs text-green-400 border-green-400/20">
                    {stat.change}
                  </Badge>
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="bg-slate-900/50 border-slate-700/50 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Zap className="h-5 w-5 text-amber-400" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="ghost"
                className="w-full justify-between h-14 bg-slate-800/30 hover:bg-slate-800/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-white">{action.label}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-slate-900/50 border-slate-700/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Clock className="h-5 w-5 text-cyan-400" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest system events</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[280px]">
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
                  >
                    <div className={`h-2 w-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-400' :
                      activity.status === 'pending' ? 'bg-amber-400' : 'bg-blue-400'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-white">{activity.action}</p>
                    </div>
                    <span className="text-xs text-slate-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Globe className="h-5 w-5 text-green-400" />
            System Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "API Response", value: 98, color: "bg-green-500" },
              { label: "Database Load", value: 42, color: "bg-blue-500" },
              { label: "Storage Used", value: 67, color: "bg-amber-500" },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="text-white font-medium">{item.value}%</span>
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

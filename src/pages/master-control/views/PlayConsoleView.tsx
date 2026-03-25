import { useState } from 'react';
import { 
  Smartphone, Download, RefreshCw, CheckCircle, 
  Globe, Users, TrendingUp, ExternalLink, Settings,
  Play, AlertTriangle, Clock, Shield
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const PlayConsoleView = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const consoleDetails = {
    email: 'hello.digitaldna@gmail.com',
    account: 'Digital DNA India',
    accountId: '5003822724528726207',
    appId: 'com.softwarevala.app',
    appName: 'Software Vala',
  };

  const appStats = [
    { label: 'Total Installs', value: '0', icon: Download, trend: 'New App' },
    { label: 'Active Users', value: '0', icon: Users, trend: 'Starting' },
    { label: 'Countries', value: 'Worldwide', icon: Globe, trend: 'All' },
    { label: 'App Status', value: 'Ready', icon: CheckCircle, trend: 'Pending Upload' },
  ];

  const appFeatures = [
    { role: 'Master Admin', features: 'Full system control, Play Console management', color: 'bg-purple-500' },
    { role: 'Super Admin', features: 'Admin management, User oversight', color: 'bg-blue-500' },
    { role: 'Franchise', features: 'Franchise dashboard, Reseller management', color: 'bg-green-500' },
    { role: 'Reseller', features: 'Sales tools, Lead management', color: 'bg-yellow-500' },
    { role: 'Developer', features: 'Task management, Code access', color: 'bg-orange-500' },
    { role: 'Client', features: 'Demo access, Support portal', color: 'bg-pink-500' },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Play Console data refreshed');
    }, 2000);
  };

  const openPlayConsole = () => {
    window.open('https://play.google.com/console', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Play className="w-6 h-6 text-green-500" />
            Google Play Console
          </h2>
          <p className="text-gray-400 mt-1">Manage your Android app distribution</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="border-gray-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={openPlayConsole} className="bg-green-600 hover:bg-green-700">
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Console
          </Button>
        </div>
      </div>

      {/* Account Info */}
      <Card className="bg-[#1a1a2e] border-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            Account Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Developer Email</p>
              <p className="text-white font-medium">{consoleDetails.email}</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Account Name</p>
              <p className="text-white font-medium">{consoleDetails.account}</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Account ID</p>
              <p className="text-white font-mono text-sm">{consoleDetails.accountId}</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Package ID</p>
              <p className="text-white font-mono text-sm">{consoleDetails.appId}</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">App Name</p>
              <p className="text-white font-medium">{consoleDetails.appName}</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <Badge className="bg-green-500/20 text-green-400 border-0">
                <CheckCircle className="w-3 h-3 mr-1" />
                No Issues
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {appStats.map((stat) => (
          <Card key={stat.label} className="bg-[#1a1a2e] border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.trend}</p>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* APK Architecture */}
      <Card className="bg-[#1a1a2e] border-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-purple-400" />
            APK Architecture (Role-Based Features)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-blue-400 font-medium">One APK - All Features</p>
                <p className="text-sm text-gray-400 mt-1">
                  Single APK for all users. Features are shown based on login role. 
                  Updates are automatic - when you update the website, APK users get updates instantly!
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {appFeatures.map((feature) => (
              <div key={feature.role} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${feature.color}`} />
                  <p className="text-white font-medium">{feature.role}</p>
                </div>
                <p className="text-xs text-gray-400">{feature.features}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Build Status */}
      <Card className="bg-[#1a1a2e] border-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-400" />
            Build & Deploy Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">GitHub Actions</span>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-0">Ready</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Download className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">APK Build Workflow</span>
              </div>
              <Badge className="bg-blue-500/20 text-blue-400 border-0">Configured</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">Worldwide Distribution</span>
              </div>
              <Badge className="bg-purple-500/20 text-purple-400 border-0">All Countries</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">Auto-Update</span>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-0">Enabled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          variant="outline" 
          className="h-auto py-4 flex-col gap-2 border-gray-700 hover:bg-gray-800"
          onClick={openPlayConsole}
        >
          <Play className="w-6 h-6 text-green-500" />
          <span>Open Play Console</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto py-4 flex-col gap-2 border-gray-700 hover:bg-gray-800"
          onClick={() => window.open('https://github.com', '_blank')}
        >
          <Download className="w-6 h-6 text-blue-500" />
          <span>Build APK (GitHub)</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto py-4 flex-col gap-2 border-gray-700 hover:bg-gray-800"
          onClick={() => toast.info('APK uses live website - updates are automatic!')}
        >
          <RefreshCw className="w-6 h-6 text-purple-500" />
          <span>Force App Update</span>
        </Button>
      </div>
    </div>
  );
};

export default PlayConsoleView;

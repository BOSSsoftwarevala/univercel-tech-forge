// Area Manager Dashboard - Region-based control panel
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Activity, Users, Store, Package, HeadphonesIcon,
  Target, Wallet, BarChart3, Shield, Bell, FileText, MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SidebarItem {
  id: string;
  label: string;
  icon: any;
}

const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'live', label: 'Live Activity', icon: Activity },
  { id: 'users', label: 'User Oversight', icon: Users },
  { id: 'franchise', label: 'Franchise Oversight', icon: Store },
  { id: 'reseller', label: 'Reseller Oversight', icon: Package },
  { id: 'sales-support', label: 'Sales & Support', icon: HeadphonesIcon },
  { id: 'leads', label: 'Leads Monitor', icon: Target },
  { id: 'wallet', label: 'Wallet Monitor', icon: Wallet },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'approvals', label: 'Approvals', icon: Shield },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'audit', label: 'Audit View', icon: FileText },
];

const AreaManagerDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  // Mock data for the region
  const regionData = {
    name: 'India',
    code: 'IN',
    totalUsers: 1245,
    activeNow: 89,
    pendingApprovals: 12,
    alerts: 3,
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Clean Icon + Name Only */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <MapPin className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Area Manager</h2>
              <p className="text-xs text-slate-400">{regionData.name} Region</p>
            </div>
          </div>
        </div>

        {/* Navigation - Clean Style */}
        <ScrollArea className="flex-1 py-2">
          <nav className="px-2 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                    isActive 
                      ? "bg-orange-500/20 text-orange-400" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Status */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-slate-400">Region Active</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-100 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              {activeSection === 'dashboard' ? 'Dashboard Overview' : 
               sidebarItems.find(i => i.id === activeSection)?.label}
            </h1>
            <p className="text-slate-600 mt-1">
              {regionData.name} Region Management
            </p>
          </div>

          {/* Stats Cards */}
          {activeSection === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
            >
              <Card className="bg-white border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Total Users</p>
                      <p className="text-2xl font-bold text-slate-900">{regionData.totalUsers}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Active Now</p>
                      <p className="text-2xl font-bold text-green-600">{regionData.activeNow}</p>
                    </div>
                    <Activity className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Pending Approvals</p>
                      <p className="text-2xl font-bold text-orange-600">{regionData.pendingApprovals}</p>
                    </div>
                    <Shield className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Active Alerts</p>
                      <p className="text-2xl font-bold text-red-600">{regionData.alerts}</p>
                    </div>
                    <Bell className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Section Content */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-slate-900">
                {sidebarItems.find(i => i.id === activeSection)?.label || 'Dashboard'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <p className="text-slate-500">
                  {activeSection === 'wallet' || activeSection === 'audit' 
                    ? 'Read-only access - View data for your region only'
                    : `${sidebarItems.find(i => i.id === activeSection)?.label} content for ${regionData.name} region`
                  }
                </p>
                {(activeSection === 'wallet' || activeSection === 'audit') && (
                  <Badge variant="secondary" className="mt-2">
                    Read Only
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AreaManagerDashboard;

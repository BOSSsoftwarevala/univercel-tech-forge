// Area Manager Dashboard - Region-based control panel
// Note: This dashboard now redirects to /super-admin-system/role-switch?role=area_manager for full functionality
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Users, Shield, Bell, MapPin, Lock, Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Read-only sections that Area Manager cannot modify
const READ_ONLY_SECTIONS = ['wallet', 'audit'];

// Section content components
const DashboardOverview = ({ regionData }: { regionData: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold text-foreground">{regionData.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Now</p>
              <p className="text-2xl font-bold text-green-600">{regionData.activeNow}</p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Approvals</p>
              <p className="text-2xl font-bold text-orange-600">{regionData.pendingApprovals}</p>
            </div>
            <Shield className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Alerts</p>
              <p className="text-2xl font-bold text-red-600">{regionData.alerts}</p>
            </div>
            <Bell className="h-8 w-8 text-red-500" />
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Performance Metrics */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Sales This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-foreground">₹{regionData.salesThisMonth?.toLocaleString() || '0'}</p>
          <p className="text-xs text-green-500">+12% from last month</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Leads Converted</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-foreground">{regionData.leadsConverted || 0}</p>
          <p className="text-xs text-muted-foreground">This month</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-foreground">{regionData.conversionRate || '0'}%</p>
          <p className="text-xs text-muted-foreground">Region average</p>
        </CardContent>
      </Card>
    </div>
  </motion.div>
);

const SectionPlaceholder = ({ section, isReadOnly, regionName }: { section: string; isReadOnly: boolean; regionName: string }) => (
  <Card className="bg-card border-border">
    <CardHeader className="border-b border-border">
      <div className="flex items-center justify-between">
        <CardTitle className="text-foreground capitalize">{section.replace('-', ' ')}</CardTitle>
        {isReadOnly && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            Read Only
          </Badge>
        )}
      </div>
    </CardHeader>
    <CardContent className="p-6">
      <div className="text-center py-12">
        {isReadOnly ? (
          <div className="space-y-2">
            <Lock className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <p className="text-muted-foreground">
              View-only access - Data for {regionName} region
            </p>
            <p className="text-xs text-muted-foreground">
              You can view but cannot modify this data
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground">
            {section} content for {regionName} region
          </p>
        )}
      </div>
    </CardContent>
  </Card>
);

const AreaManagerDashboard = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [regionData, setRegionData] = useState({
    name: 'India',
    code: 'IN',
    totalUsers: 1245,
    activeNow: 89,
    pendingApprovals: 12,
    alerts: 3,
    salesThisMonth: 4250000,
    leadsConverted: 156,
    conversionRate: 23.5,
  });

  // Get current section from URL path
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentSection = pathParts[1] || 'dashboard';
  const isReadOnly = READ_ONLY_SECTIONS.includes(currentSection);

  // Fetch region data on mount
  useEffect(() => {
    const fetchRegionData = async () => {
      if (!user?.id) return;
      
      try {
        const { data: areaManager } = await supabase
          .from('area_manager_accounts')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (areaManager) {
          setRegionData(prev => ({
            ...prev,
            name: areaManager.country || 'India',
            code: areaManager.country?.slice(0, 2).toUpperCase() || 'IN',
          }));
        }
      } catch (error) {
        console.error('Error fetching region data:', error);
      }
    };

    fetchRegionData();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-background">

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header with Region Info */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/20">
                  <MapPin className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {currentSection === 'dashboard' ? 'Dashboard Overview' : 
                     currentSection.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h1>
                  <p className="text-muted-foreground">
                    {regionData.name} Region Management
                  </p>
                </div>
              </div>
            </div>
            
            {/* Region Badge */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-orange-500 border-orange-500/50">
                <MapPin className="h-3 w-3 mr-1" />
                {regionData.name} ({regionData.code})
              </Badge>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">Active</span>
              </div>
            </div>
          </div>

          {/* Restrictions Notice */}
          <div className="mb-4 p-3 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span>
                Access restricted to {regionData.name} region only. 
                Data export, copy, and screenshot features are disabled for security.
              </span>
            </div>
          </div>

          {/* Section Content */}
          {currentSection === 'dashboard' ? (
            <DashboardOverview regionData={regionData} />
          ) : (
            <SectionPlaceholder 
              section={currentSection} 
              isReadOnly={isReadOnly}
              regionName={regionData.name}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default AreaManagerDashboard;

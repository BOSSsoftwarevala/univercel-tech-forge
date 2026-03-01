import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Building2,
  Store,
  Users,
  DollarSign,
  Target,
  Activity,
  CheckCircle,
  AlertTriangle,
  Eye,
  MapPin,
  List,
  FileText,
  History,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { FranchiseManagerSection } from "./FranchiseManagerSidebar";
import { supabase } from "@/integrations/supabase/client";


interface FranchiseManagerDashboardContentProps {
  activeSection: FranchiseManagerSection;
}

const FranchiseManagerDashboardContent = ({ activeSection }: FranchiseManagerDashboardContentProps) => {
  const [franchiseStats, setFranchiseStats] = useState({
    totalFranchises: 0,
    activeFranchises: 0,
    onHold: 0,
    totalStaff: 0,
    totalLeads: 0,
    totalRevenue: 0,
  });
  const [franchiseList, setFranchiseList] = useState<Array<{ id: string | number; name: string; status: string; staff?: number; leads?: number; revenue?: number }>>([]);
  const [recentActivity, setRecentActivity] = useState<Array<{ id: string | number; action: string; target: string; time: string; type: string }>>([]);
  const [pendingApprovals, setPendingApprovals] = useState<Array<{ id: string | number; title: string; franchise?: string; amount?: string | null; priority: string }>>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: franchises, error: fError } = await supabase
        .from('franchises')
        .select('id, name, status');
      if (!fError) {
        const totalFranchises = franchises?.length || 0;
        const activeFranchises = franchises?.filter((f: { status: string }) => f.status === 'active').length || 0;
        const onHold = franchises?.filter((f: { status: string }) => f.status === 'on_hold').length || 0;
        setFranchiseStats(prev => ({ ...prev, totalFranchises, activeFranchises, onHold }));
        setFranchiseList(franchises?.map((f: { id: string; name: string; status: string }) => ({ id: f.id, name: f.name, status: f.status })) || []);
      } else {
        console.error('Failed to fetch franchises:', fError);
      }

      const { count: staffCount, error: staffError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'franchise');
      if (!staffError) {
        setFranchiseStats(prev => ({ ...prev, totalStaff: staffCount || 0 }));
      }

      const { count: leadsCount, error: leadsError } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });
      if (!leadsError) {
        setFranchiseStats(prev => ({ ...prev, totalLeads: leadsCount || 0 }));
      }

      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('amount')
        .eq('payment_status', 'success');
      if (!ordersError) {
        const totalRevenue = orders?.reduce((sum: number, o: { amount: number }) => sum + (o.amount || 0), 0) || 0;
        setFranchiseStats(prev => ({ ...prev, totalRevenue }));
      }

      const { data: activity, error: activityError } = await supabase
        .from('audit_logs')
        .select('id, action, meta_json, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      if (!activityError) {
        setRecentActivity(activity?.map((a: { id: string; action: string; meta_json?: { target?: string }; created_at: string }) => ({
          id: a.id,
          action: a.action,
          target: a.meta_json?.target || '—',
          time: new Date(a.created_at).toLocaleString(),
          type: 'log',
        })) || []);
      }

      const { data: approvals, error: approvalsError } = await supabase
        .from('approvals')
        .select('id, title, status, created_at')
        .eq('status', 'pending')
        .limit(5);
      if (!approvalsError) {
        setPendingApprovals(approvals?.map((a: { id: string; title: string }) => ({
          id: a.id,
          title: a.title,
          priority: 'medium',
        })) || []);
      }
    };

    fetchStats();
  }, []);

  const handleAction = (action: string, target?: string) => {
    toast.success(`${action}${target ? ` for ${target}` : ''}`);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Franchises</p>
                <p className="text-2xl font-bold text-indigo-400">{franchiseStats.totalFranchises}</p>
              </div>
              <Building2 className="w-8 h-8 text-indigo-400/30" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-emerald-500/10 border-emerald-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-emerald-400">{franchiseStats.activeFranchises}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-400/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-500/10 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">On Hold</p>
                <p className="text-2xl font-bold text-orange-400">{franchiseStats.onHold}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-400/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Staff</p>
                <p className="text-2xl font-bold text-blue-400">{franchiseStats.totalStaff}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-500/10 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold text-purple-400">{franchiseStats.totalLeads}</p>
              </div>
              <Target className="w-8 h-8 text-purple-400/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-cyan-500/10 border-cyan-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-cyan-400">₹{(franchiseStats.totalRevenue / 100000).toFixed(1)}L</p>
              </div>
              <DollarSign className="w-8 h-8 text-cyan-400/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Franchise List Preview */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Store className="w-5 h-5 text-indigo-400" />
                Franchise Overview
              </h3>
              <Button variant="outline" size="sm" onClick={() => handleAction("View", "All Franchises")}>
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
            </div>
            <div className="space-y-2">
              {franchiseList.slice(0, 4).map((franchise) => (
                <div key={franchise.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                      <Store className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{franchise.name}</p>
                      <p className="text-xs text-muted-foreground">{franchise.staff} staff • {franchise.leads} leads</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs",
                        franchise.status === "active"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-orange-500/20 text-orange-400"
                      )}
                    >
                      {franchise.status}
                    </Badge>
                    <span className="text-sm font-medium text-cyan-400">{franchise.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                Recent Activity
              </h3>
            </div>
            <div className="space-y-2">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.target}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-amber-400" />
              Pending Approvals
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="p-4 bg-background/50 rounded-lg border border-border/50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-foreground">{approval.title}</h4>
                  <Badge 
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      approval.priority === "high" 
                        ? "bg-red-500/20 text-red-400"
                        : approval.priority === "medium"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-slate-500/20 text-slate-400"
                    )}
                  >
                    {approval.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{approval.franchise}</p>
                {approval.amount && (
                  <p className="text-sm font-semibold text-cyan-400 mb-3">{approval.amount}</p>
                )}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                    onClick={() => handleAction("Approve", approval.title)}
                  >
                    Approve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleAction("View", approval.title)}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFranchiseMap = () => (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-bold text-foreground">Franchise Map</h2>
          </div>
          <div className="h-[400px] bg-slate-800/50 rounded-xl flex items-center justify-center border border-slate-700/50">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-indigo-400/50 mx-auto mb-3" />
              <p className="text-slate-400">Interactive Franchise Map</p>
              <p className="text-xs text-slate-500 mt-1">Showing {franchiseStats.totalFranchises} franchise locations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFranchiseList = () => (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <List className="w-6 h-6 text-indigo-400" />
              <h2 className="text-xl font-bold text-foreground">Franchise List</h2>
            </div>
          </div>
          <div className="space-y-3">
            {franchiseList.map((franchise) => (
              <motion.div
                key={franchise.id}
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/50 hover:border-indigo-500/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                    <Store className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{franchise.name}</p>
                    <p className="text-sm text-muted-foreground">{franchise.staff} staff • {franchise.leads} leads</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-cyan-400">{franchise.revenue}</span>
                  <Badge 
                    variant="secondary"
                    className={cn(
                      franchise.status === "active" 
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-orange-500/20 text-orange-400"
                    )}
                  >
                    {franchise.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleAction("Viewing", franchise.name)}>
                      View
                    </Button>
                    {franchise.status === "hold" ? (
                      <Button size="sm" className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30" onClick={() => handleAction("Resumed", franchise.name)}>
                        Resume
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="text-orange-400 hover:bg-orange-500/10" onClick={() => handleAction("Suspended", franchise.name)}>
                        Suspend
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFranchiseStaff = () => (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-xl font-bold text-foreground">Franchise Staff</h2>
              <p className="text-sm text-muted-foreground">Manage staff across assigned franchises</p>
            </div>
          </div>
          <div className="space-y-3">
            {franchiseList.map((franchise) => (
              <div key={franchise.id} className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/50">
                <div>
                  <p className="font-semibold text-foreground">{franchise.name}</p>
                  <p className="text-sm text-muted-foreground">Total Staff: {franchise.staff}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleAction("View", `${franchise.name} Staff`)}>
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSalesRevenue = () => (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-cyan-400" />
            <div>
              <h2 className="text-xl font-bold text-foreground">Sales & Revenue</h2>
              <p className="text-sm text-muted-foreground">Revenue per franchise</p>
            </div>
          </div>
          <div className="space-y-3">
            {franchiseList.map((franchise) => (
              <div key={franchise.id} className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/50">
                <div>
                  <p className="font-semibold text-foreground">{franchise.name}</p>
                  <p className="text-sm text-muted-foreground">Revenue: {franchise.revenue}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleAction("View", `${franchise.name} Revenue`)}>
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLeadsManagement = () => (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-purple-400" />
            <div>
              <h2 className="text-xl font-bold text-foreground">Leads Management</h2>
              <p className="text-sm text-muted-foreground">Leads per franchise</p>
            </div>
          </div>
          <div className="space-y-3">
            {franchiseList.map((franchise) => (
              <div key={franchise.id} className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/50">
                <div>
                  <p className="font-semibold text-foreground">{franchise.name}</p>
                  <p className="text-sm text-muted-foreground">Total Leads: {franchise.leads}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleAction("View", `${franchise.name} Leads`)}>
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCustomerActivity = () => (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-xl font-bold text-foreground">Customer Activity</h2>
              <p className="text-sm text-muted-foreground">Recent customer-related events</p>
            </div>
          </div>
          <div className="space-y-3">
            {recentActivity
              .filter((a) => a.type === "customer")
              .map((a) => (
                <div key={a.id} className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/50">
                  <div>
                    <p className="font-semibold text-foreground">{a.action}</p>
                    <p className="text-sm text-muted-foreground">{a.target}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleAction("View", a.target)}>
                    View
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderApprovals = () => (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <div>
              <h2 className="text-xl font-bold text-foreground">Approvals</h2>
              <p className="text-sm text-muted-foreground">Review and approve requests</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="p-4 bg-background/50 rounded-lg border border-border/50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-foreground">{approval.title}</h4>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      approval.priority === "high"
                        ? "bg-red-500/20 text-red-400"
                        : approval.priority === "medium"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-slate-500/20 text-slate-400"
                    )}
                  >
                    {approval.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{approval.franchise}</p>
                {approval.amount && (
                  <p className="text-sm font-semibold text-cyan-400 mb-3">{approval.amount}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                    onClick={() => handleAction("Approve", approval.title)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleAction("View", approval.title)}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-indigo-400" />
            <div>
              <h2 className="text-xl font-bold text-foreground">Reports</h2>
              <p className="text-sm text-muted-foreground">Franchise performance reports</p>
            </div>
          </div>
          <div className="space-y-3">
            {["Weekly Summary", "Monthly Revenue", "Leads Report"].map((report) => (
              <div key={report} className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/50">
                <div>
                  <p className="font-semibold text-foreground">{report}</p>
                  <p className="text-sm text-muted-foreground">Assigned Franchise(s)</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleAction("View", report)}>
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderActivityLog = () => (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <History className="w-6 h-6 text-slate-400" />
            <div>
              <h2 className="text-xl font-bold text-foreground">Activity Log</h2>
              <p className="text-sm text-muted-foreground">Recent actions</p>
            </div>
          </div>
          <div className="space-y-3">
            {recentActivity.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-500/10 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{a.action}</p>
                    <p className="text-sm text-muted-foreground">{a.target}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{a.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview();
      case "franchise_map":
        return renderFranchiseMap();
      case "franchise_list":
        return renderFranchiseList();
      case "franchise_staff":
        return renderFranchiseStaff();
      case "sales_revenue":
        return renderSalesRevenue();
      case "leads_management":
        return renderLeadsManagement();
      case "customer_activity":
        return renderCustomerActivity();
      case "approvals":
        return renderApprovals();
      case "reports":
        return renderReports();
      case "activity_log":
        return renderActivityLog();
      default:
        return renderOverview();
    }
  };

  return (
    <ScrollArea className="flex-1">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Store className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Franchise Manager Dashboard</h1>
              <p className="text-muted-foreground">Manage Assigned Franchises</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
              RUNNING
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
              AI ACTIVE
            </Badge>
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
              HEALTHY
            </Badge>
          </div>
        </div>

        {renderContent()}
      </div>
    </ScrollArea>
  );
};

export default FranchiseManagerDashboardContent;

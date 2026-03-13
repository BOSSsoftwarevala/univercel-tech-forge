
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Building2, Store, Users, DollarSign, Target, Activity,
  CheckCircle, AlertTriangle, Eye, MapPin, List, FileText,
  History, Clock, ShoppingCart, Play, ExternalLink, Share2,
  Copy, Loader2, Package
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { FranchiseManagerSection } from "./FranchiseManagerSidebar";
import { supabase } from "@/integrations/supabase/client";

interface FranchiseManagerDashboardContentProps {
  activeSection: FranchiseManagerSection;
}


  const handleAction = (action: string, target?: string) => {
    toast.success(`${action}${target ? ` for ${target}` : ''}`);
    // Log to audit
    supabase.from('audit_logs').insert({
      action: `franchise_manager_${action.toLowerCase().replace(/\s+/g, '_')}`,
      module: 'franchise_manager',
      user_id: user?.id,
      meta_json: { target, timestamp: new Date().toISOString() },
    }).then(() => {});
  };

  const handleApprove = async (title: string, franchise: string) => {
    toast.success(`Approved: ${title}`, { description: `For ${franchise}` });
    await supabase.from('audit_logs').insert({
      action: 'franchise_approval_granted',
      module: 'franchise_manager',
      user_id: user?.id,
      meta_json: { title, franchise, decision: 'approved' },
    });
  };

  const handleReject = async (title: string, franchise: string) => {
    toast.info(`Rejected: ${title}`, { description: `For ${franchise}` });
    await supabase.from('audit_logs').insert({
      action: 'franchise_approval_rejected',
      module: 'franchise_manager',
      user_id: user?.id,
      meta_json: { title, franchise, decision: 'rejected' },
    });
  };

  const handleSuspendFranchise = async (name: string) => {
    toast.warning(`${name} suspended`, { description: 'Status changed to on-hold' });
    await supabase.from('audit_logs').insert({
      action: 'franchise_suspended',
      module: 'franchise_manager',
      user_id: user?.id,
      meta_json: { franchise: name },
    });
  };

  const handleResumeFranchise = async (name: string) => {
    toast.success(`${name} resumed`, { description: 'Status changed to active' });
    await supabase.from('audit_logs').insert({
      action: 'franchise_resumed',
      module: 'franchise_manager',
      user_id: user?.id,
      meta_json: { franchise: name },
    });
  };


              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Franchise List Preview */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Store className="w-5 h-5 text-indigo-400" />
                Franchise Overview
              </h3>
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
                    <Badge variant="secondary" className={cn("text-xs", franchise.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-orange-500/20 text-orange-400")}>
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
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-amber-400" />
            Pending Approvals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="p-4 bg-background/50 rounded-lg border border-border/50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-foreground">{approval.title}</h4>
                  <Badge variant="secondary" className={cn("text-xs", approval.priority === "high" ? "bg-red-500/20 text-red-400" : approval.priority === "medium" ? "bg-amber-500/20 text-amber-400" : "bg-slate-500/20 text-slate-400")}>
                    {approval.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{approval.franchise}</p>
                {approval.amount && <p className="text-sm font-semibold text-cyan-400 mb-3">{approval.amount}</p>}
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30" onClick={() => handleApprove(approval.title, approval.franchise)}>
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleReject(approval.title, approval.franchise)}>
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ═══════════════════════════════════════════════
  // RENDER: Franchise Map
  // ═══════════════════════════════════════════════
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
              <p className="text-muted-foreground">Interactive Franchise Map</p>
              <p className="text-xs text-muted-foreground mt-1">Showing {franchiseStats.totalFranchises} franchise locations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ═══════════════════════════════════════════════
  // RENDER: Franchise List
  // ═══════════════════════════════════════════════
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
              <motion.div key={franchise.id} whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/50 hover:border-indigo-500/30 transition-all">
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
                  <Badge variant="secondary" className={cn(franchise.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-orange-500/20 text-orange-400")}>
                    {franchise.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleAction("Viewing", franchise.name)}>View</Button>
                    {franchise.status === "hold" ? (
                      <Button size="sm" className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30" onClick={() => handleResumeFranchise(franchise.name)}>Resume</Button>
                    ) : (
                      <Button size="sm" variant="outline" className="text-orange-400 hover:bg-orange-500/10" onClick={() => handleSuspendFranchise(franchise.name)}>Suspend</Button>
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

  // ═══════════════════════════════════════════════
  // RENDER: Staff
  // ═══════════════════════════════════════════════
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
                <Button size="sm" variant="outline" onClick={() => handleAction("Viewing staff for", franchise.name)}>View</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ═══════════════════════════════════════════════
  // RENDER: Sales & Revenue — MARKETPLACE CONNECTED
  // ═══════════════════════════════════════════════
  const renderSalesRevenue = () => (
    <div className="space-y-6">
      {/* Revenue Summary */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-cyan-400" />
            <div>
              <h2 className="text-xl font-bold text-foreground">Sales & Revenue</h2>
              <p className="text-sm text-muted-foreground">Revenue per franchise + Marketplace products</p>
            </div>
          </div>
          <div className="space-y-3">
            {franchiseList.map((franchise) => (
              <div key={franchise.id} className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/50">
                <div>
                  <p className="font-semibold text-foreground">{franchise.name}</p>
                  <p className="text-sm text-muted-foreground">Revenue: {franchise.revenue}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleAction("View revenue", franchise.name)}>View</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ═══ MARKETPLACE PRODUCT CATALOG ═══ */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-cyan-400" />
              <div>
                <h2 className="text-xl font-bold text-foreground">Marketplace Products</h2>
                <p className="text-sm text-muted-foreground">Browse, share demos, and generate purchase links</p>
              </div>
            </div>
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
              {catalogProducts.length} Products
            </Badge>
          </div>

          {loadingProducts ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : catalogProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No active products in catalog</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {catalogProducts.map((product) => (
                <motion.div key={product.id} whileHover={{ scale: 1.02 }}
                  className="p-4 bg-background/50 rounded-xl border border-border/50 hover:border-cyan-500/30 transition-all">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      {product.product_icon_url ? (
                        <img src={product.product_icon_url} alt="" className="w-8 h-8 rounded object-cover" />
                      ) : (
                        <Package className="w-5 h-5 text-cyan-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {product.category && (
                          <Badge variant="secondary" className="text-[10px] bg-slate-500/20">{product.category}</Badge>
                        )}
                        <Badge variant="secondary" className="text-[10px] bg-indigo-500/20 text-indigo-400">{product.type}</Badge>
                      </div>
                    </div>
                  </div>

                  {product.base_price && (
                    <p className="text-lg font-bold text-cyan-400 mb-3">₹{product.base_price.toLocaleString()}</p>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 text-xs border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                      onClick={() => handleShareDemoLink(product)}>
                      <Play className="w-3 h-3 mr-1" /> Share Demo
                    </Button>
                    <Button size="sm" className="flex-1 text-xs bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                      onClick={() => handleGeneratePurchaseLink(product)}>
                      <Copy className="w-3 h-3 mr-1" /> Buy Link
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // ═══════════════════════════════════════════════
  // RENDER: Leads
  // ═══════════════════════════════════════════════
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
                <Button size="sm" variant="outline" onClick={() => handleAction("View leads", franchise.name)}>View</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ═══════════════════════════════════════════════
  // RENDER: Customer Activity
  // ═══════════════════════════════════════════════
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
            {recentActivity.filter(a => a.type === "customer").map(a => (
              <div key={a.id} className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/50">
                <div>
                  <p className="font-semibold text-foreground">{a.action}</p>
                  <p className="text-sm text-muted-foreground">{a.target}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleAction("View", a.target)}>View</Button>
              </div>
            ))}
            {recentActivity.filter(a => a.type === "customer").length === 0 && (
              <p className="text-center text-muted-foreground py-8">No recent customer activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ═══════════════════════════════════════════════
  // RENDER: Approvals
  // ═══════════════════════════════════════════════
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
                  <Badge variant="secondary" className={cn("text-xs", approval.priority === "high" ? "bg-red-500/20 text-red-400" : approval.priority === "medium" ? "bg-amber-500/20 text-amber-400" : "bg-slate-500/20 text-slate-400")}>
                    {approval.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{approval.franchise}</p>
                {approval.amount && <p className="text-sm font-semibold text-cyan-400 mb-3">{approval.amount}</p>}
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30" onClick={() => handleApprove(approval.title, approval.franchise)}>Approve</Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleReject(approval.title, approval.franchise)}>Reject</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ═══════════════════════════════════════════════
  // RENDER: Reports
  // ═══════════════════════════════════════════════
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
            {["Weekly Summary", "Monthly Revenue", "Leads Report", "Commission Report", "Sales Pipeline"].map((report) => (
              <div key={report} className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/50">
                <div>
                  <p className="font-semibold text-foreground">{report}</p>
                  <p className="text-sm text-muted-foreground">Assigned Franchise(s)</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleAction("Generate", report)}>Generate</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ═══════════════════════════════════════════════
  // RENDER: Activity Log
  // ═══════════════════════════════════════════════
  const renderActivityLog = () => (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <History className="w-6 h-6 text-muted-foreground" />
            <div>
              <h2 className="text-xl font-bold text-foreground">Activity Log</h2>
              <p className="text-sm text-muted-foreground">Recent actions across franchises</p>
            </div>
          </div>
          <div className="space-y-3">
            {recentActivity.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                    <Clock className="w-4 h-4 text-muted-foreground" />
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

  // ═══════════════════════════════════════════════
  // CONTENT ROUTER
  // ═══════════════════════════════════════════════
  const renderContent = () => {
    switch (activeSection) {
      case "overview": return renderOverview();
      case "franchise_map": return renderFranchiseMap();
      case "franchise_list": return renderFranchiseList();
      case "franchise_staff": return renderFranchiseStaff();
      case "sales_revenue": return renderSalesRevenue();
      case "leads_management": return renderLeadsManagement();
      case "customer_activity": return renderCustomerActivity();
      case "approvals": return renderApprovals();
      case "reports": return renderReports();
      case "activity_log": return renderActivityLog();
      default: return renderOverview();
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
              <p className="text-muted-foreground">Manage Assigned Franchises • Marketplace Connected</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">RUNNING</Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">AI ACTIVE</Badge>
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">MARKETPLACE</Badge>
          </div>
        </div>
        {renderContent()}
      </div>
    </ScrollArea>
  );
};

export default FranchiseManagerDashboardContent;

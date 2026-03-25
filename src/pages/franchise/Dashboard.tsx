import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Activity,
  Bot,
  Building2,
  CheckCircle2,
  CreditCard,
  Gauge,
  Map,
  Radar,
  ShieldAlert,
  Store,
  TrendingUp,
  UserCog,
  Users,
  XCircle,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { franchiseApi } from '@/lib/api/franchise';
import { useFranchiseControlSystem } from '@/hooks/useFranchiseControlSystem';

type FranchiseSection = 'overview' | 'franchises' | 'map' | 'staff' | 'revenue' | 'leads' | 'customers' | 'approvals' | 'activity' | 'ai' | 'report';

const sectionMeta: Array<{ id: FranchiseSection; label: string; icon: typeof Gauge }> = [
  { id: 'overview', label: 'Overview', icon: Gauge },
  { id: 'franchises', label: 'Franchise Control', icon: Building2 },
  { id: 'map', label: 'Franchise Map', icon: Map },
  { id: 'staff', label: 'Staff Management', icon: UserCog },
  { id: 'revenue', label: 'Sales & Revenue', icon: CreditCard },
  { id: 'leads', label: 'Leads Engine', icon: Radar },
  { id: 'customers', label: 'Customer Activity', icon: Users },
  { id: 'approvals', label: 'Approvals', icon: CheckCircle2 },
  { id: 'activity', label: 'Activity Log', icon: Activity },
  { id: 'ai', label: 'AI Control', icon: Bot },
  { id: 'report', label: 'Reports', icon: TrendingUp },
];

const currency = (value: number) => `₹${value.toLocaleString()}`;

const FranchiseDashboardPage = () => {
  const [activeSection, setActiveSection] = useState<FranchiseSection>('overview');
  const system = useFranchiseControlSystem();

  const roleQuery = useQuery({ queryKey: ['franchise-control', 'role-resolve'], queryFn: franchiseApi.resolveRole, staleTime: 60_000 });
  const overviewQuery = useQuery({ queryKey: ['franchise-control', 'manager-overview'], queryFn: franchiseApi.getManagerOverview, staleTime: 20_000 });
  const franchiseListQuery = useQuery({ queryKey: ['franchise-control', 'manager-list'], queryFn: franchiseApi.getFranchiseList, staleTime: 20_000 });
  const mapQuery = useQuery({ queryKey: ['franchise-control', 'manager-map'], queryFn: franchiseApi.getFranchiseMap, staleTime: 20_000 });
  const staffQuery = useQuery({ queryKey: ['franchise-control', 'manager-staff'], queryFn: franchiseApi.getStaff, staleTime: 20_000 });
  const revenueQuery = useQuery({ queryKey: ['franchise-control', 'manager-revenue'], queryFn: franchiseApi.getRevenue, staleTime: 20_000 });
  const leadsQuery = useQuery({ queryKey: ['franchise-control', 'manager-leads'], queryFn: franchiseApi.getLeadsManager, staleTime: 20_000 });
  const customersQuery = useQuery({ queryKey: ['franchise-control', 'manager-customers'], queryFn: franchiseApi.getCustomerActivity, staleTime: 20_000 });
  const approvalsQuery = useQuery({ queryKey: ['franchise-control', 'manager-approvals'], queryFn: franchiseApi.getApprovals, staleTime: 20_000 });
  const activityQuery = useQuery({ queryKey: ['franchise-control', 'manager-activity'], queryFn: franchiseApi.getActivity, staleTime: 20_000 });
  const reportsQuery = useQuery({ queryKey: ['franchise-control', 'manager-reports'], queryFn: franchiseApi.getReports, staleTime: 20_000 });
  const aiReportQuery = useQuery({ queryKey: ['franchise-control', 'ai-report'], queryFn: franchiseApi.getAIReport, staleTime: 20_000 });

  const managerAiMutation = useMutation({
    mutationFn: () => franchiseApi.runManagerAI(),
    onSuccess: (result) => toast.success(`AI generated ${result.suggestions.length} suggestions`),
    onError: () => toast.error('AI control run failed'),
  });

  const holdMutation = useMutation({
    mutationFn: ({ franchiseId, action }: { franchiseId: string; action: 'hold' | 'resume' }) => franchiseApi.actOnFranchise({ franchise_id: franchiseId, action }),
    onSuccess: (_, variables) => {
      toast.success(variables.action === 'hold' ? 'Franchise moved to hold' : 'Franchise resumed');
      void franchiseListQuery.refetch();
      void overviewQuery.refetch();
    },
    onError: () => toast.error('Franchise state update failed'),
  });

  const approvalMutation = useMutation({
    mutationFn: ({ approvalId, decision }: { approvalId: string; decision: 'approve' | 'reject' }) => franchiseApi.takeApprovalAction({ approval_id: approvalId, decision }),
    onSuccess: (_, variables) => {
      toast.success(variables.decision === 'approve' ? 'Approval granted' : 'Request rejected');
      void approvalsQuery.refetch();
      void activityQuery.refetch();
    },
    onError: () => toast.error('Approval action failed'),
  });

  const moduleLabel = roleQuery.data?.module_name || 'Franchise Owner';
  const dashboardTitle = overviewQuery.data?.title || roleQuery.data?.dashboard_title || 'Franchise Manager Dashboard';
  const dashboardSubtext = overviewQuery.data?.subtext || 'Manage Assigned Franchises • Marketplace Connected';
  const badges = overviewQuery.data?.badges || ['RUNNING', 'AI ACTIVE', 'MARKETPLACE CONNECTED'];
  const recentLead = system.dashboard?.recent_leads?.[0];
  const overviewCards = overviewQuery.data?.cards;
  const franchiseItems = franchiseListQuery.data?.items || [];
  const mapDensity = mapQuery.data?.traffic_density || [];
  const staff = staffQuery.data?.staff || [];
  const approvals = approvalsQuery.data?.approvals || [];
  const activity = activityQuery.data?.activity || [];
  const aiPlan = aiReportQuery.data?.action_plan || [];

  const topMetrics = useMemo(() => ([
    { label: 'Total Franchises', value: overviewCards?.total_franchises || 0, section: 'franchises' as FranchiseSection },
    { label: 'Total Staff', value: overviewCards?.total_staff || 0, section: 'staff' as FranchiseSection },
    { label: 'Total Leads', value: overviewCards?.total_leads || 0, section: 'leads' as FranchiseSection },
    { label: 'Revenue', value: currency(overviewCards?.revenue || 0), section: 'revenue' as FranchiseSection },
    { label: 'Catalog Products', value: overviewCards?.catalog_products || 0, section: 'report' as FranchiseSection },
  ]), [overviewCards]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.16),transparent_28%),linear-gradient(135deg,#03111c,#0b1728_45%,#111827)] text-white">
      <div className="mx-auto flex max-w-[1600px] gap-6 p-6">
        <aside className="w-72 shrink-0 rounded-3xl border border-white/10 bg-slate-950/60 p-4 backdrop-blur">
          <div className="mb-6 rounded-2xl border border-sky-400/20 bg-sky-500/10 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sky-500/20 p-3">
                <Building2 className="h-6 w-6 text-sky-200" />
              </div>
              <div>
                <p className="text-sm text-slate-300">{moduleLabel}</p>
                <p className="text-lg font-semibold">Unified Role Layer</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-300">Franchise Manager = Franchise Owner. Same permissions, display-only label change.</p>
          </div>

          <div className="space-y-2">
            {sectionMeta.map((item) => {
              const Icon = item.icon;
              const active = item.id === activeSection;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${active ? 'border border-sky-400/30 bg-sky-500/20 text-white' : 'border border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5'}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <Card className="mt-6 border-white/10 bg-white/5 text-white">
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Zero Confusion Rule</p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between"><span>Display</span><Badge className="bg-sky-500/20 text-sky-100">Franchise Manager</Badge></div>
                <div className="flex items-center justify-between"><span>System</span><Badge className="bg-emerald-500/20 text-emerald-100">Franchise Owner</Badge></div>
                <div className="flex items-center justify-between"><span>Lead Loss</span><Badge className={(leadsQuery.data?.no_lead_loss ?? true) ? 'bg-emerald-500/20 text-emerald-100' : 'bg-red-500/20 text-red-100'}>{(leadsQuery.data?.no_lead_loss ?? true) ? 'Blocked' : 'Risk'}</Badge></div>
              </div>
            </CardContent>
          </Card>
        </aside>

        <main className="min-w-0 flex-1 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-6 backdrop-blur">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Unified System</p>
                <h1 className="mt-2 text-4xl font-semibold">{dashboardTitle}</h1>
                <p className="mt-2 max-w-3xl text-sm text-slate-300">{dashboardSubtext}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <Badge key={badge} className="border border-white/10 bg-white/5 px-3 py-1 text-white">{badge}</Badge>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="bg-sky-600 hover:bg-sky-700" onClick={() => managerAiMutation.mutate()}>
                <Bot className="mr-2 h-4 w-4" />Run AI Control
              </Button>
              <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10" onClick={() => system.createLeadMutation.mutate({ lead_name: 'Manager Traffic Lead', city: 'Mumbai', region: 'Maharashtra', industry: 'Retail', lead_score: 88 })}>
                <Zap className="mr-2 h-4 w-4" />Add Lead
              </Button>
              <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10" onClick={() => system.createStoreMutation.mutate({ store_name: 'Demand Expansion Node', city: 'Thane', state: 'Maharashtra', capacity: 160 })}>
                <Store className="mr-2 h-4 w-4" />Add Store
              </Button>
              <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10" onClick={() => franchiseItems[0] && holdMutation.mutate({ franchiseId: franchiseItems[0].id, action: franchiseItems[0].status === 'on_hold' ? 'resume' : 'hold' })}>
                <ShieldAlert className="mr-2 h-4 w-4" />{franchiseItems[0]?.status === 'on_hold' ? 'Resume' : 'Hold'} Franchise
              </Button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-5">
              {topMetrics.map((metric) => (
                <button key={metric.label} onClick={() => setActiveSection(metric.section)} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-sky-400/30 hover:bg-sky-500/10">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{metric.label}</p>
                  <p className="mt-3 text-2xl font-semibold">{metric.value}</p>
                </button>
              ))}
            </div>
          </div>

          {activeSection === 'overview' ? (
            <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
              <Card className="border-white/10 bg-slate-950/50 text-white">
                <CardHeader><CardTitle>Overview Cards</CardTitle></CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className={`rounded-2xl border p-4 ${overviewQuery.data?.highlight_alert ? 'border-amber-400/30 bg-amber-500/10' : 'border-white/10 bg-white/5'}`}><p className="text-sm text-slate-400">On Hold</p><p className="mt-2 text-2xl font-semibold">{overviewCards?.on_hold || 0}</p></div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-sm text-slate-400">Active</p><p className="mt-2 text-2xl font-semibold">{overviewCards?.active || 0}</p></div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-sm text-slate-400">Live Leads</p><p className="mt-2 text-2xl font-semibold">{system.dashboard?.metrics.live_leads || 0}</p></div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-sm text-slate-400">Revenue/Sec</p><p className="mt-2 text-2xl font-semibold">{currency(Math.round(system.dashboard?.metrics.revenue_per_second || 0))}</p></div>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-slate-950/50 text-white">
                <CardHeader><CardTitle>Unified Flow</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-200">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Traffic {'->'} Leads {'->'} Franchise Assign {'->'} Staff {'->'} Sales {'->'} Revenue {'->'} Approval {'->'} Expansion</div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">AI suggests only. No execution without approval.</div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Recent lead: {recentLead ? String(recentLead.lead_name || 'Lead') : 'No recent lead'}</div>
                </CardContent>
              </Card>
            </div>
          ) : null}

          {activeSection === 'franchises' ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {franchiseItems.map((item) => (
                <Card key={item.id} className="border-white/10 bg-slate-950/50 text-white">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">{item.franchise_name}</h3>
                        <p className="text-sm text-slate-400">{item.deep_analytics.city}{item.deep_analytics.state ? `, ${item.deep_analytics.state}` : ''}</p>
                      </div>
                      <Badge className={item.status === 'active' ? 'bg-emerald-500/20 text-emerald-100' : 'bg-amber-500/20 text-amber-100'}>{item.status.toUpperCase()}</Badge>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                      <div><p className="text-slate-400">Staff</p><p className="font-semibold">{item.staff_count}</p></div>
                      <div><p className="text-slate-400">Leads</p><p className="font-semibold">{item.leads}</p></div>
                      <div><p className="text-slate-400">Revenue</p><p className="font-semibold">{currency(item.revenue)}</p></div>
                    </div>
                    {item.ai_suggestion ? <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-3 text-sm text-amber-100">AI suggestion: {item.ai_suggestion}</div> : null}
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10" onClick={() => setActiveSection('report')}>View</Button>
                      <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10" onClick={() => setActiveSection('staff')}>Manage</Button>
                      <Button className="bg-sky-600 hover:bg-sky-700" onClick={() => holdMutation.mutate({ franchiseId: item.id, action: item.status === 'on_hold' ? 'resume' : 'hold' })}>{item.status === 'on_hold' ? 'Resume' : 'Hold'}</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}

          {activeSection === 'map' ? (
            <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
              <Card className="border-white/10 bg-slate-950/50 text-white">
                <CardHeader><CardTitle>Franchise Map</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {(mapQuery.data?.city_wise_distribution || []).map((item) => (
                    <div key={item.city} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div>
                        <p className="font-medium">{item.city}</p>
                        <p className="text-sm text-slate-400">Franchise count {item.franchises}</p>
                      </div>
                      <Badge className="bg-sky-500/20 text-sky-100">City Zone</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-slate-950/50 text-white">
                <CardHeader><CardTitle>Demand Signals</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {mapDensity.map((item) => (
                    <div key={item.city} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-slate-400">{item.city}</p>
                      <p className="mt-2 text-2xl font-semibold">{item.density.toFixed(1)}</p>
                    </div>
                  ))}
                  {(mapQuery.data?.expansion_suggestions || []).map((item) => (
                    <div key={item.city} className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">{item.city}: {item.reason}</div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ) : null}

          {activeSection === 'staff' ? (
            <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
              <Card className="border-white/10 bg-slate-950/50 text-white">
                <CardHeader><CardTitle>Staff Management</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {staff.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div>
                        <p className="font-medium">{item.full_name}</p>
                        <p className="text-sm text-slate-400">{item.role} • performance {item.performance_score.toFixed(1)}</p>
                      </div>
                      <Badge className={item.activity_status === 'inactive' ? 'bg-red-500/20 text-red-100' : item.reward_status === 'reward' ? 'bg-emerald-500/20 text-emerald-100' : 'bg-slate-500/20 text-slate-100'}>{item.activity_status.toUpperCase()}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-slate-950/50 text-white">
                <CardHeader><CardTitle>Auto Actions</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-200">
                  <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4">Inactive staff alerts: {staffQuery.data?.inactive_alerts.length || 0}</div>
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">Top staff reward candidates: {staffQuery.data?.top_staff.length || 0}</div>
                </CardContent>
              </Card>
            </div>
          ) : null}

          {activeSection === 'revenue' ? (
            <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
              <Card className="border-white/10 bg-slate-950/50 text-white">
                <CardHeader><CardTitle>Franchise Wise Revenue</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {(revenueQuery.data?.franchise_wise_revenue || []).map((item) => (
                    <div key={item.franchise_id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div>
                        <p className="font-medium">{item.franchise_name}</p>
                        <p className="text-sm text-slate-400">{item.status}</p>
                      </div>
                      <p className="text-lg font-semibold">{currency(item.revenue)}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-slate-950/50 text-white">
                <CardHeader><CardTitle>Revenue Engine</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className={`rounded-2xl border p-4 text-sm ${revenueQuery.data?.investigation_triggered ? 'border-amber-400/20 bg-amber-500/10 text-amber-100' : 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100'}`}>
                    {revenueQuery.data?.investigation_triggered ? 'Revenue drop detected. Investigation triggered.' : 'Revenue stable. Monitoring active.'}
                  </div>
                  {(revenueQuery.data?.daily || []).slice(-5).map((item) => (
                    <div key={item.date} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3 text-sm">
                      <span>{item.date}</span>
                      <span>{currency(item.revenue)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ) : null}

          {activeSection === 'leads' ? (
            <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
              <Card className="border-white/10 bg-slate-950/50 text-white">
                <CardHeader><CardTitle>High Traffic Leads Core</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {(leadsQuery.data?.leads || []).slice(0, 8).map((lead, index) => (
                    <div key={String(lead.id || index)} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div>
                        <p className="font-medium">{String(lead.lead_name || 'Lead')}</p>
                        <p className="text-sm text-slate-400">Score {String(lead.lead_score || '')} • {String(lead.status || '')}</p>
                      </div>
                      <Button onClick={() => system.routeLeadMutation.mutate({ franchise_lead_id: lead.id })}>Assign</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-slate-950/50 text-white">
                <CardHeader><CardTitle>No Lead Loss Rule</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-200">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">AI score average: {(leadsQuery.data?.ai_score_average || 0).toFixed(1)}</div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Queue depth: {(leadsQuery.data?.routing_queue || []).length}</div>
                  <div className={`rounded-2xl border p-4 ${(leadsQuery.data?.no_lead_loss ?? true) ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100' : 'border-red-400/20 bg-red-500/10 text-red-100'}`}>{(leadsQuery.data?.no_lead_loss ?? true) ? 'No lead loss detected' : 'Lead leakage risk detected'}</div>
                </CardContent>
              </Card>
            </div>
          ) : null}

          {activeSection === 'customers' ? (
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="border-white/10 bg-slate-950/50 text-white"><CardContent className="p-5"><p className="text-sm text-slate-400">New Customers</p><p className="mt-2 text-2xl font-semibold">{customersQuery.data?.totals.new_customers || 0}</p></CardContent></Card>
              <Card className="border-white/10 bg-slate-950/50 text-white"><CardContent className="p-5"><p className="text-sm text-slate-400">Repeat</p><p className="mt-2 text-2xl font-semibold">{customersQuery.data?.totals.repeat_customers || 0}</p></CardContent></Card>
              <Card className="border-white/10 bg-slate-950/50 text-white"><CardContent className="p-5"><p className="text-sm text-slate-400">Churn</p><p className="mt-2 text-2xl font-semibold">{customersQuery.data?.totals.churn_customers || 0}</p></CardContent></Card>
              <Card className="border-white/10 bg-slate-950/50 text-white"><CardContent className="p-5"><p className="text-sm text-slate-400">Predicted Churn</p><p className="mt-2 text-2xl font-semibold">{(customersQuery.data?.churn_prediction || 0).toFixed(1)}%</p></CardContent></Card>
            </div>
          ) : null}

          {activeSection === 'approvals' ? (
            <Card className="border-white/10 bg-slate-950/50 text-white">
              <CardHeader><CardTitle>Approval System</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {approvals.map((approval) => (
                  <div key={approval.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium">{approval.request_title}</p>
                        <p className="text-sm text-slate-400">{approval.request_type.replace('_', ' ')} • {approval.requested_by_name}</p>
                        <p className="mt-1 text-sm text-slate-300">{currency(approval.amount)}</p>
                      </div>
                      <Badge className={approval.status === 'approved' ? 'bg-emerald-500/20 text-emerald-100' : approval.status === 'rejected' ? 'bg-red-500/20 text-red-100' : 'bg-amber-500/20 text-amber-100'}>{approval.status.toUpperCase()}</Badge>
                    </div>
                    {approval.status === 'pending' ? (
                      <div className="mt-4 flex gap-2">
                        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => approvalMutation.mutate({ approvalId: approval.id, decision: 'approve' })}><CheckCircle2 className="mr-2 h-4 w-4" />Approve</Button>
                        <Button variant="outline" className="border-red-400/30 bg-red-500/10 text-red-100 hover:bg-red-500/20" onClick={() => approvalMutation.mutate({ approvalId: approval.id, decision: 'reject' })}><XCircle className="mr-2 h-4 w-4" />Reject</Button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {activeSection === 'activity' ? (
            <Card className="border-white/10 bg-slate-950/50 text-white">
              <CardHeader><CardTitle>Immutable Activity Log</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {activity.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
                    <div>
                      <p className="font-medium">{item.action.replaceAll('_', ' ')}</p>
                      <p className="text-slate-400">{new Date(item.timestamp).toLocaleString()}</p>
                    </div>
                    <Badge className="bg-white/10 text-white">NO EDIT / NO DELETE</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {activeSection === 'ai' ? (
            <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
              <Card className="border-white/10 bg-slate-950/50 text-white">
                <CardHeader><CardTitle>AI Control System</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-200">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Best franchise suggestion, lead optimization, revenue growth plan, and staff insights stay in suggestion-only mode.</div>
                  <Button className="bg-sky-600 hover:bg-sky-700" onClick={() => managerAiMutation.mutate()}><Bot className="mr-2 h-4 w-4" />Run Franchise Manager AI</Button>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-slate-950/50 text-white">
                <CardHeader><CardTitle>AI Suggestions</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {aiPlan.map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">{item}</div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ) : null}

          {activeSection === 'report' ? (
            <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
              <Card className="border-white/10 bg-slate-950/50 text-white">
                <CardHeader><CardTitle>Report System</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {(reportsQuery.data?.revenue || []).map((item) => (
                    <div key={item.franchise_name} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
                      <div className="flex items-center justify-between"><span>{item.franchise_name}</span><span>{currency(item.revenue)}</span></div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-slate-950/50 text-white">
                <CardHeader><CardTitle>Final Output</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-200">
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">FRANCHISE MANAGER = FRANCHISE OWNER (UNIFIED ROLE)</div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">FULL CONTROL • HIGH TRAFFIC • REAL REVENUE • ZERO CONFUSION</div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {(reportsQuery.data?.performance || []).map((item) => (
                      <div key={item.franchise_name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="font-medium">{item.franchise_name}</p>
                        <p className="mt-2 text-sm text-slate-400">Active staff {item.active_staff}</p>
                        <p className="text-sm text-slate-400">Avg performance {item.avg_performance.toFixed(1)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}

          {overviewQuery.data?.highlight_alert ? <div className="text-sm text-amber-300">At least one franchise is on hold. Alert highlighting is active.</div> : null}
          {system.isRefreshing ? <div className="text-sm text-slate-400">Refreshing unified franchise manager state...</div> : null}
          {roleQuery.data?.resolved_role ? <div className="text-sm text-slate-400">Role resolve: franchise_manager {'->'} {roleQuery.data.resolved_role}</div> : null}
          {approvalMutation.isPending || holdMutation.isPending || managerAiMutation.isPending ? <div className="text-sm text-slate-400">Processing manager action...</div> : null}
        </main>
      </div>
    </div>
  );
};

export default FranchiseDashboardPage;
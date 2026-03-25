import React, { useState, useCallback, memo, useEffect } from "react";
import { 
  Crown, Shield, Lock, Users, Globe2, Activity, Server,
  Database, CreditCard, Brain, TrendingUp, Building2,
  DollarSign, Wallet, BarChart3, ShieldAlert, FileText,
  Scale, Cpu, Clock, ArrowLeft, Eye, Edit3, RefreshCw,
  Play, StopCircle, Pause, CheckCircle, XCircle, UserPlus,
  Megaphone, Store, Loader2, Bell, Bot, Sparkles, Briefcase, PauseCircle
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useActionLogger } from "@/hooks/useActionLogger";
import { ServerModuleContainer } from "@/components/server-module/ServerModuleContainer";
import { ProductDemoModuleContainer } from "@/components/product-demo-module/ProductDemoModuleContainer";
import { LeadModuleContainer } from "@/components/lead-module/LeadModuleContainer";
import { MarketingModuleContainer } from "@/components/marketing-module/MarketingModuleContainer";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BossLiveStatsRow } from "@/components/boss-panel/BossLiveStatsRow";
import { BossOperationalRow } from "@/components/boss-panel/BossOperationalRow";
import { BossActivityAlertsRow } from "@/components/boss-panel/BossActivityAlertsRow";

// ===== BOX TYPES =====
type BoxType = 'data' | 'process' | 'ai' | 'approval' | 'live';
type BoxStatus = 'active' | 'pending' | 'suspended' | 'stopped' | 'error';

const STATUS_COLORS: Record<BoxStatus, string> = {
  active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
  suspended: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  stopped: 'bg-slate-500/20 text-slate-400 border-slate-500/50',
  error: 'bg-red-500/20 text-red-400 border-red-500/50',
};

// ===== THEME: Dark + Software Vala Logo Colors (Blue Primary + Red Accent) =====
const T = {
  bg: '#0a0f1a',
  card: '#111827',
  border: '#1f2937',
  primary: '#2563eb',
  primaryLight: '#3b82f6',
  accent: '#dc2626',
  text: '#ffffff',
  muted: '#9ca3af',
  dim: '#6b7280',
  green: '#22c55e',
};

// ===== CHART =====
const Chart = memo(({ type = 'bar' }: { type?: 'bar' | 'line' }) => (
  <div className="flex items-end justify-around gap-1 p-3 rounded" style={{ height: 80, background: 'rgba(37,99,235,0.05)' }}>
    {type === 'bar' ? (
      [35, 60, 40, 75, 50, 65, 85, 55, 70, 80, 45, 90].map((h, i) => (
        <div key={i} style={{ width: '100%', height: `${h}%`, background: i === 11 ? T.primary : 'rgba(37,99,235,0.25)', borderRadius: '2px 2px 0 0' }} />
      ))
    ) : (
      <svg width="100%" height="100%" viewBox="0 0 200 50" preserveAspectRatio="none">
        <defs><linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.primary} stopOpacity="0.3"/><stop offset="100%" stopColor={T.primary} stopOpacity="0"/></linearGradient></defs>
        <path d="M0,40 20,35 40,25 60,30 80,18 100,22 120,12 140,28 160,8 180,18 200,5 200,50 0,50Z" fill="url(#chartGrad)"/>
        <polyline points="0,40 20,35 40,25 60,30 80,18 100,22 120,12 140,28 160,8 180,18 200,5" fill="none" stroke={T.primary} strokeWidth="2"/>
      </svg>
    )}
  </div>
));

// ===== ACTION BUTTON COMPONENT =====
const ActionBtn = memo(({ icon: Icon, label, onClick, variant = 'default', loading = false }: {
  icon: React.ElementType; label: string; onClick: () => void; variant?: 'default' | 'destructive' | 'outline'; loading?: boolean;
}) => (
  <Button
    size="sm"
    variant={variant}
    className={cn(
      "h-7 px-2 text-xs gap-1 font-medium",
      variant === 'destructive' && "bg-red-600 hover:bg-red-700"
    )}
    onClick={onClick}
    disabled={loading}
  >
    <Icon className={cn("w-3 h-3", loading && "animate-spin")} />
    {label}
  </Button>
));

interface Props { activeNav?: string; }

const BossOwnerDashboard = ({ activeNav }: Props) => {
  const [showLock, setShowLock] = useState(false);
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const { user } = useAuth();
  
  // === APPROVAL QUEUE STATE ===
  const [approvals, setApprovals] = useState<{
    resellers: any[];
    franchises: any[];
    influencers: any[];
    jobApplications: any[];
  }>({ resellers: [], franchises: [], influencers: [], jobApplications: [] });
  const [loadingApprovals, setLoadingApprovals] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // === FETCH ALL PENDING APPROVALS (paid OR 7+ days old auto-approve) ===
  const isAutoApproveEligible = (createdAt: string) => {
    const daysSinceCreation = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreation >= 7;
  };

  useEffect(() => {
    const fetchApprovals = async () => {
      setLoadingApprovals(true);
      try {
        // Fetch ALL pending applications (paid or waiting 7+ days = auto eligible)
        const resellerQuery = supabase
          .from('reseller_applications')
          .select('*')
          .eq('status', 'pending')
          .limit(50);
        
        const franchiseQuery = supabase
          .from('franchise_accounts')
          .select('*')
          .eq('status', 'pending')
          .limit(50);
        
        const influencerQuery = supabase
          .from('influencer_accounts')
          .select('*')
          .eq('status', 'pending')
          .limit(50);

        const jobQuery = (supabase as any)
          .from('job_applications')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
          .limit(50);

        const [resellerRes, franchiseRes, influencerRes, jobRes] = await Promise.all([
          resellerQuery,
          franchiseQuery,
          influencerQuery,
          jobQuery,
        ]);
        
        // Add auto_approve_eligible flag to each application
        const processApprovals = (data: any[]) => data.map(item => ({
          ...item,
          auto_approve_eligible: item.payment_status === 'paid' || isAutoApproveEligible(item.created_at)
        }));
        
        console.log('All pending approvals fetched:', {
          resellers: resellerRes.data?.length || 0,
          franchises: franchiseRes.data?.length || 0,
          influencers: influencerRes.data?.length || 0,
          jobApplications: jobRes.data?.length || 0,
        });
        
        setApprovals({
          resellers: processApprovals((resellerRes.data as any[]) || []),
          franchises: processApprovals((franchiseRes.data as any[]) || []),
          influencers: processApprovals((influencerRes.data as any[]) || []),
          jobApplications: (jobRes.data as any[]) || [],
        });
      } catch (e) {
        console.error('Error fetching approvals:', e);
      } finally {
        setLoadingApprovals(false);
      }
    };
    fetchApprovals();
  }, []);

  // === REALTIME NOTIFICATIONS FOR NEW APPLICATIONS ===
  useEffect(() => {
    console.log('Setting up realtime subscriptions for new applications...');
    
    const channel = supabase
      .channel('boss-approval-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reseller_applications' },
        (payload) => {
          console.log('New reseller application:', payload);
          const newApp = payload.new as any;
          toast.success(`🆕 New Reseller Application!`, {
            description: `${newApp.full_name || newApp.business_name || 'New Reseller'} - ${newApp.email}`,
            duration: 10000,
          });
          // Refresh approvals list
          setApprovals(prev => ({
            ...prev,
            resellers: [{ ...newApp, auto_approve_eligible: newApp.payment_status === 'paid' }, ...prev.resellers]
          }));
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'franchise_accounts' },
        (payload) => {
          console.log('New franchise application:', payload);
          const newApp = payload.new as any;
          toast.success(`🆕 New Franchise Application!`, {
            description: `${newApp.company_name || newApp.franchise_name || 'New Franchise'} - ${newApp.country || 'Unknown'}`,
            duration: 10000,
          });
          setApprovals(prev => ({
            ...prev,
            franchises: [{ ...newApp, auto_approve_eligible: newApp.payment_status === 'paid' }, ...prev.franchises]
          }));
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'influencer_accounts' },
        (payload) => {
          console.log('New influencer application:', payload);
          const newApp = payload.new as any;
          toast.success(`🆕 New Influencer Application!`, {
            description: `${newApp.name || newApp.influencer_name || 'New Influencer'} - ${newApp.platform || 'Unknown'}`,
            duration: 10000,
          });
          setApprovals(prev => ({
            ...prev,
            influencers: [{ ...newApp, auto_approve_eligible: newApp.payment_status === 'paid' }, ...prev.influencers]
          }));
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'job_applications' },
        (payload) => {
          console.log('New job application:', payload);
          const newApp = payload.new as any;
          toast.success(`🆕 New ${(newApp.application_type || 'Job').toUpperCase()} Application!`, {
            description: `${newApp.name || 'Applicant'} - ${newApp.email || ''}`,
            duration: 10000,
          });
          setApprovals(prev => ({
            ...prev,
            jobApplications: [newApp, ...prev.jobApplications]
          }));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'system_events',
          filter: 'status=eq.PENDING',
        },
        (payload) => {
          const event = payload.new as any;
          const trackedEvents = new Set([
            'reseller_request',
            'franchise_request',
            'developer_request',
            'job_apply',
            'support_request',
            'enquiry',
            'marketplace_order_placed',
          ]);

          if (!trackedEvents.has(String(event?.event_type || ''))) return;

          const meta = (event?.payload && typeof event.payload === 'object') ? event.payload : {};
          const label = String((meta as any).request_label || (meta as any).product_name || event.event_type || 'New request');

          toast.success('🔔 Marketplace / Apply action received', {
            description: label,
            duration: 10000,
          });
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      console.log('Cleaning up realtime subscriptions...');
      supabase.removeChannel(channel);
    };
  }, []);

  // Module routing
  // NOTE: Sidebar may set activeNav to either the parent id ("vala-ai") OR a sub-category id ("ai-overview", etc.)
  // All VALA AI related nav ids must resolve to the same isolated AI-only module.
  const modules: Record<string, 'server' | 'vala-ai' | 'product-demo' | 'leads' | 'marketing'> = {
    'server-control': 'server',

    // VALA AI (parent + sub-items)
    'vala-ai': 'vala-ai',
    'ai-overview': 'vala-ai',
    'ai-requests': 'vala-ai',
    'ai-models': 'vala-ai',

    'product-demo': 'product-demo',
    'leads': 'leads',
    'marketing': 'marketing'
  };

  const goBack = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete('nav');
    window.history.pushState({}, '', url.toString());
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, []);

  const logAction = async (action: string, target: string, meta?: Record<string, any>) => {
    try {
      await supabase.from('audit_logs').insert({ user_id: user?.id, role: 'boss_owner' as any, module: 'boss-dashboard', action, meta_json: { target, timestamp: new Date().toISOString(), ...meta } });
    } catch (e) { console.error(e); }
  };

  // === APPROVAL ACTIONS ===
  const handleApproval = async (type: 'reseller' | 'franchise' | 'influencer' | 'job', id: string, action: 'approve' | 'reject' | 'hold') => {
    setProcessingId(id);
    try {
      const tableMap: Record<string, string> = {
        reseller: 'reseller_applications',
        franchise: 'franchise_accounts',
        influencer: 'influencer_accounts',
        job: 'job_applications',
      };
      const table = tableMap[type];
      const statusMap: Record<string, string> = { approve: 'approved', reject: 'rejected', hold: 'on_hold' };
      const newStatus = statusMap[action];
      
      const { error } = await (supabase as any).from(table).update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      
      await logAction(`${action}_${type}`, id, { status: newStatus });
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} ${action === 'hold' ? 'put on hold' : action + 'd'} successfully`);
      
      // Remove from local state
      const stateKey = type === 'job' ? 'jobApplications' : type + 's';
      setApprovals(prev => ({
        ...prev,
        [stateKey]: (prev as any)[stateKey].filter((item: any) => item.id !== id)
      }));
    } catch (e) {
      console.error(e);
      toast.error(`Failed to ${action} ${type}`);
    } finally {
      setProcessingId(null);
    }
  };

  // === BOX ACTION HANDLER - CONNECTED TO action_logs ===
  const { logAction: logToActionLogs } = useActionLogger();
  
  const handleBoxAction = useCallback(async (actionType: string, entityId: string) => {
    const startTime = performance.now();
    
    try {
      // Log to audit_logs (existing behavior)
      await logAction(actionType, entityId);
      
      // Log to action_logs with response time
      const responseTimeMs = Math.round(performance.now() - startTime);
      await logToActionLogs({
        buttonId: `boss-${entityId}-${actionType}`,
        moduleName: 'boss-dashboard',
        actionType: actionType.toUpperCase() as 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'PROCESS' | 'NAVIGATE',
        actionResult: 'success',
        responseTimeMs,
        metadata: { entityId, actionType }
      });
      
      toast.success(`${actionType.charAt(0).toUpperCase() + actionType.slice(1)} action executed for ${entityId}`);
    } catch (error) {
      const responseTimeMs = Math.round(performance.now() - startTime);
      await logToActionLogs({
        buttonId: `boss-${entityId}-${actionType}`,
        moduleName: 'boss-dashboard',
        actionType: actionType.toUpperCase() as 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'PROCESS' | 'NAVIGATE',
        actionResult: 'failure',
        responseTimeMs,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
      toast.error(`Failed to execute ${actionType} for ${entityId}`);
    }
  }, [user, logToActionLogs]);

  const lockdown = async () => {
    if (!confirmed) return toast.error("2FA required");
    if (reason.length < 20) return toast.error("Reason: min 20 chars");
    await logAction('emergency_lockdown', 'SYSTEM', { reason });
    toast.success("🔒 LOCKDOWN ACTIVATED");
    setShowLock(false); setReason(""); setConfirmed(false);
  };

  const totalPendingApprovals = approvals.resellers.length + approvals.franchises.length + approvals.influencers.length + approvals.jobApplications.length;

  // If module is selected, show module container with back button
  if (activeNav && activeNav in modules) {
    switch (modules[activeNav]) {
      case 'server':
        return <ServerModuleContainer onBack={goBack} />;
      case 'vala-ai':
        // CRITICAL NAV RULE:
        // VALA AI must be its own isolated module with a full UI reload and its OWN sidebar.
        // So when Boss selects VALA AI from the Boss dashboard, we hard-navigate to the VALA AI role route.
        window.location.assign('/super-admin-system/role-switch?role=vala_ai_management');
        return null;
      case 'product-demo':
        return <ProductDemoModuleContainer onBack={goBack} />;
      case 'leads':
        return <LeadModuleContainer onBack={goBack} />;
      case 'marketing':
        return <MarketingModuleContainer onBack={goBack} />;
    }
  }

  return (
    <div className="min-h-screen p-6" style={{ fontFamily: "'Outfit', sans-serif", background: T.bg }}>
      
      {/* ===== ROW 1: AUTHORITY CONTEXT (FULL WIDTH HEADER) ===== */}
      <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: `1px solid ${T.border}` }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${T.primary}, ${T.primaryLight})`, boxShadow: `0 8px 24px rgba(37,99,235,0.3)` }}>
            <Crown size={24} style={{ color: T.text }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: T.text, fontFamily: "'Space Grotesk', sans-serif" }}>BOSS / OWNER DASHBOARD</h1>
            <p className="text-xs tracking-wider" style={{ color: T.primary }}>FINAL AUTHORITY • APPROVE / LOCK / ARCHIVE</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* TEST VALA AI BUTTON */}
          <button 
            onClick={() => {
              // Find and click the floating chatbot button
              const chatBtn = document.querySelector('[class*="fixed bottom-6 right-6"]') as HTMLElement;
              if (chatBtn) {
                chatBtn.click();
              } else {
                toast.info('Opening VALA AI Chat...', { description: 'Look for the green bot button at bottom-right' });
              }
            }}
            className="px-4 py-2 rounded-lg flex items-center gap-2 font-semibold cursor-pointer transition-all hover:scale-105 text-sm animate-pulse"
            style={{ 
              background: 'linear-gradient(135deg, #10b981, #059669)', 
              color: '#fff',
              boxShadow: '0 4px 20px rgba(16,185,129,0.4)'
            }}
          >
            <Sparkles size={14} /> 
            Test VALA AI
          </button>
          
          <div className="px-3 py-1.5 rounded-lg flex items-center gap-2" style={{ background: 'rgba(37,99,235,0.15)', border: `1px solid ${T.primary}` }}>
            <Crown size={12} style={{ color: T.primary }} />
            <span className="text-xs font-semibold" style={{ color: T.primary }}>SUPREME AUTHORITY</span>
          </div>
          <Dialog open={showLock} onOpenChange={setShowLock}>
            <DialogTrigger asChild>
              <button className="px-4 py-2 rounded-lg flex items-center gap-2 font-semibold cursor-pointer transition-all hover:opacity-90 text-sm" style={{ background: T.accent, color: T.text }}>
                <Lock size={14} /> Emergency Lockdown
              </button>
            </DialogTrigger>
            <DialogContent style={{ background: T.card, border: `1px solid ${T.border}` }}>
              <DialogHeader>
                <DialogTitle style={{ color: T.text }}>Emergency Lockdown</DialogTitle>
                <DialogDescription style={{ color: T.muted }}>Suspend all operations immediately.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea placeholder="Reason (min 20 chars)..." value={reason} onChange={e => setReason(e.target.value)} style={{ background: T.bg, border: `1px solid ${T.border}`, color: T.text }} />
                <div className="flex items-center gap-2">
                  <Switch checked={confirmed} onCheckedChange={setConfirmed} />
                  <span className="text-sm" style={{ color: T.muted }}>Confirm 2FA</span>
                </div>
                <Button onClick={lockdown} className="w-full" style={{ background: T.accent }}>Activate Lockdown</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ===== CRITICAL: PENDING APPROVALS - MOST VISIBLE SECTION ===== */}
      {totalPendingApprovals > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 rounded-xl overflow-hidden"
          style={{ 
            background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', 
            border: '2px solid #ef4444',
            boxShadow: '0 0 30px rgba(239, 68, 68, 0.4)'
          }}
        >
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center animate-pulse" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <Bell size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-wide">⚠️ PENDING APPROVALS — ACTION REQUIRED</h2>
                <p className="text-xs text-red-200">These applications are waiting for your decision</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-white text-red-600 font-bold text-sm px-3 py-1">
                {totalPendingApprovals} WAITING
              </Badge>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 text-xs border-white/50 text-white hover:bg-white/10"
                onClick={() => window.location.reload()}
              >
                <RefreshCw size={12} className="mr-1" /> Refresh
              </Button>
            </div>
          </div>
          
          <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* RESELLER PENDING */}
            <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <Store size={14} className="text-white" />
                <span className="text-xs font-semibold text-white">RESELLER</span>
                <Badge className="ml-auto text-[10px] bg-white/20 text-white">{approvals.resellers.length}</Badge>
              </div>
              <ScrollArea className="h-[200px]">
                {approvals.resellers.length === 0 ? (
                  <p className="text-xs text-center py-4 text-red-200">No resellers waiting</p>
                ) : (
                  <div className="space-y-2">
                    {approvals.resellers.map((item: any) => (
                      <div key={item.id} className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <p className="text-sm font-semibold text-white">{item.full_name || item.business_name || 'Reseller'}</p>
                        <p className="text-[10px] text-red-200">{item.country} • {new Date(item.created_at).toLocaleDateString()}</p>
                        <div className="flex gap-1 mt-2">
                          <Button size="sm" className="h-6 px-2 text-[10px] bg-emerald-600 hover:bg-emerald-700 flex-1" onClick={() => handleApproval('reseller', item.id, 'approve')} disabled={processingId === item.id}>
                            {processingId === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Approve'}
                          </Button>
                          <Button size="sm" variant="destructive" className="h-6 px-2 text-[10px]" onClick={() => handleApproval('reseller', item.id, 'reject')} disabled={processingId === item.id}>
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* FRANCHISE PENDING */}
            <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <Building2 size={14} className="text-white" />
                <span className="text-xs font-semibold text-white">FRANCHISE</span>
                <Badge className="ml-auto text-[10px] bg-white/20 text-white">{approvals.franchises.length}</Badge>
              </div>
              <ScrollArea className="h-[200px]">
                {approvals.franchises.length === 0 ? (
                  <p className="text-xs text-center py-4 text-red-200">No franchises waiting</p>
                ) : (
                  <div className="space-y-2">
                    {approvals.franchises.map((item: any) => (
                      <div key={item.id} className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <p className="text-sm font-semibold text-white">{item.company_name || item.franchise_name || 'Franchise'}</p>
                        <p className="text-[10px] text-red-200">{item.country || item.region} • {new Date(item.created_at).toLocaleDateString()}</p>
                        <div className="flex gap-1 mt-2">
                          <Button size="sm" className="h-6 px-2 text-[10px] bg-emerald-600 hover:bg-emerald-700 flex-1" onClick={() => handleApproval('franchise', item.id, 'approve')} disabled={processingId === item.id}>
                            {processingId === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Approve'}
                          </Button>
                          <Button size="sm" variant="destructive" className="h-6 px-2 text-[10px]" onClick={() => handleApproval('franchise', item.id, 'reject')} disabled={processingId === item.id}>
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* INFLUENCER PENDING */}
            <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <Megaphone size={14} className="text-white" />
                <span className="text-xs font-semibold text-white">INFLUENCER</span>
                <Badge className="ml-auto text-[10px] bg-white/20 text-white">{approvals.influencers.length}</Badge>
              </div>
              <ScrollArea className="h-[200px]">
                {approvals.influencers.length === 0 ? (
                  <p className="text-xs text-center py-4 text-red-200">No influencers waiting</p>
                ) : (
                  <div className="space-y-2">
                    {approvals.influencers.map((item: any) => (
                      <div key={item.id} className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <p className="text-sm font-semibold text-white">{item.name || item.influencer_name || 'Influencer'}</p>
                        <p className="text-[10px] text-red-200">{item.platform} • {new Date(item.created_at).toLocaleDateString()}</p>
                        <div className="flex gap-1 mt-2">
                          <Button size="sm" className="h-6 px-2 text-[10px] bg-emerald-600 hover:bg-emerald-700 flex-1" onClick={() => handleApproval('influencer', item.id, 'approve')} disabled={processingId === item.id}>
                            {processingId === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Approve'}
                          </Button>
                          <Button size="sm" variant="destructive" className="h-6 px-2 text-[10px]" onClick={() => handleApproval('influencer', item.id, 'reject')} disabled={processingId === item.id}>
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* JOB / CAREER PENDING */}
            <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <Briefcase size={14} className="text-white" />
                <span className="text-xs font-semibold text-white">JOB / CAREER</span>
                <Badge className="ml-auto text-[10px] bg-white/20 text-white">{approvals.jobApplications.length}</Badge>
              </div>
              <ScrollArea className="h-[200px]">
                {approvals.jobApplications.length === 0 ? (
                  <p className="text-xs text-center py-4 text-red-200">No job applications waiting</p>
                ) : (
                  <div className="space-y-2">
                    {approvals.jobApplications.map((item: any) => (
                      <div key={item.id} className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <p className="text-sm font-semibold text-white">{item.name || 'Applicant'}</p>
                        <p className="text-[10px] text-red-200">{item.application_type?.toUpperCase()} • {item.email}</p>
                        <p className="text-[9px] text-red-300">{item.experience || 'No experience listed'} • {new Date(item.created_at).toLocaleDateString()}</p>
                        <div className="flex gap-1 mt-2">
                          <Button size="sm" className="h-6 px-2 text-[10px] bg-emerald-600 hover:bg-emerald-700 flex-1" onClick={() => handleApproval('job', item.id, 'approve')} disabled={processingId === item.id}>
                            {processingId === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Approve'}
                          </Button>
                          <Button size="sm" className="h-6 px-2 text-[10px] bg-amber-600 hover:bg-amber-700" onClick={() => handleApproval('job', item.id, 'hold')} disabled={processingId === item.id}>
                            Hold
                          </Button>
                          <Button size="sm" variant="destructive" className="h-6 px-2 text-[10px]" onClick={() => handleApproval('job', item.id, 'reject')} disabled={processingId === item.id}>
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </motion.div>
      )}

      {/* ===== ROW 2: KEY STATS — 4 EQUAL LARGE CARDS WITH ACTIONS (DB-DRIVEN) ===== */}
      <BossLiveStatsRow handleBoxAction={handleBoxAction} />

      {/* ===== ROW 3: OPERATIONAL AUTHORITY (DB-DRIVEN) ===== */}
      <BossOperationalRow handleBoxAction={handleBoxAction} />

      {/* ===== ROW 4: ACTIVITY & ALERTS (DB-DRIVEN) ===== */}
      <BossActivityAlertsRow handleBoxAction={handleBoxAction} />

      {/* ===== ROW 5: APPROVAL QUEUE — RESELLER / FRANCHISE / INFLUENCER ===== */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="mt-6"
        style={{ background: 'linear-gradient(180deg, #0d1a2d 0%, #0a1628 100%)', border: '1px solid rgba(37, 99, 235, 0.2)', borderRadius: 8, overflow: 'hidden' }}
      >
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(34, 197, 94, 0.2)' }}>
          <div className="flex items-center gap-2">
            <Clock size={16} style={{ color: '#22c55e' }} />
            <span className="text-sm font-semibold tracking-wider" style={{ color: '#22c55e' }}>PENDING APPROVALS (Paid OR 7+ Days)</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={totalPendingApprovals > 0 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : STATUS_COLORS['active']}>
              ⏰ {totalPendingApprovals} Waiting
            </Badge>
            <Button size="sm" variant="outline" className="h-7 text-xs border-emerald-500/30 hover:bg-emerald-500/10" onClick={() => window.location.reload()}>
              <RefreshCw size={12} className="mr-1" /> Refresh
            </Button>
          </div>
        </div>

        {loadingApprovals ? (
          <div className="p-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
          </div>
        ) : totalPendingApprovals === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
            <p className="text-sm font-medium" style={{ color: T.text }}>All approvals cleared</p>
            <p className="text-xs" style={{ color: T.muted }}>No pending reseller, franchise, influencer, or job applications</p>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* RESELLER APPROVALS */}
            <div className="rounded-lg p-3" style={{ background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
              <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Store size={14} style={{ color: '#22c55e' }} />
                <span className="text-xs font-semibold" style={{ color: '#22c55e' }}>RESELLER APPLICATIONS</span>
                <Badge className="ml-auto text-[10px] bg-emerald-500/20 text-emerald-400">{approvals.resellers.length}</Badge>
              </div>
              <ScrollArea className="h-[280px]">
                {approvals.resellers.length === 0 ? (
                  <p className="text-xs text-center py-4" style={{ color: T.muted }}>No resellers waiting</p>
                ) : (
                  <div className="space-y-2">
                    {approvals.resellers.map((item: any) => (
                      <div key={item.id} className="p-3 rounded-lg" style={{ 
                        background: item.payment_status === 'paid' ? 'rgba(34, 197, 94, 0.08)' : 'rgba(251, 191, 36, 0.08)', 
                        border: item.payment_status === 'paid' ? '1px solid rgba(34, 197, 94, 0.15)' : '1px solid rgba(251, 191, 36, 0.15)' 
                      }}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold" style={{ color: T.text }}>{item.full_name || item.business_name || 'Reseller'}</p>
                            <p className="text-[11px]" style={{ color: T.muted }}>{item.email}</p>
                            <p className="text-[10px]" style={{ color: T.dim }}>{item.phone} • {item.country}</p>
                          </div>
                          {item.payment_status === 'paid' ? (
                            <Badge className="bg-emerald-500/30 text-emerald-300 text-[10px]">
                              <DollarSign className="w-3 h-3 mr-0.5" />
                              {item.payment_amount ? `₹${item.payment_amount.toLocaleString()}` : 'PAID'}
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-500/30 text-amber-300 text-[10px]">
                              <Clock className="w-3 h-3 mr-0.5" />
                              7+ Days
                            </Badge>
                          )}
                        </div>
                        <p className="text-[9px] mt-1" style={{ color: T.dim }}>
                          {item.payment_status === 'paid' 
                            ? `Paid: ${item.payment_date ? new Date(item.payment_date).toLocaleString() : 'Recently'}`
                            : `Applied: ${new Date(item.created_at).toLocaleDateString()} (Auto-eligible)`
                          }
                        </p>
                        <div className="flex gap-1 mt-2">
                          <Button size="sm" className="h-7 px-3 text-[11px] bg-emerald-600 hover:bg-emerald-700 flex-1" onClick={() => handleApproval('reseller', item.id, 'approve')} disabled={processingId === item.id}>
                            {processingId === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><CheckCircle className="w-3 h-3 mr-1" /> Approve</>}
                          </Button>
                          <Button size="sm" className="h-7 px-2 text-[11px] bg-amber-600 hover:bg-amber-700" onClick={() => handleApproval('reseller', item.id, 'hold')} disabled={processingId === item.id}>
                            <PauseCircle className="w-3 h-3 mr-1" /> Hold
                          </Button>
                          <Button size="sm" variant="destructive" className="h-7 px-3 text-[11px]" onClick={() => handleApproval('reseller', item.id, 'reject')} disabled={processingId === item.id}>
                            <XCircle className="w-3 h-3 mr-1" /> Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* FRANCHISE APPROVALS */}
            <div className="rounded-lg p-3" style={{ background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
              <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Building2 size={14} style={{ color: '#22c55e' }} />
                <span className="text-xs font-semibold" style={{ color: '#22c55e' }}>FRANCHISE APPLICATIONS</span>
                <Badge className="ml-auto text-[10px] bg-emerald-500/20 text-emerald-400">{approvals.franchises.length}</Badge>
              </div>
              <ScrollArea className="h-[280px]">
                {approvals.franchises.length === 0 ? (
                  <p className="text-xs text-center py-4" style={{ color: T.muted }}>No franchises waiting</p>
                ) : (
                  <div className="space-y-2">
                    {approvals.franchises.map((item: any) => (
                      <div key={item.id} className="p-3 rounded-lg" style={{ 
                        background: item.payment_status === 'paid' ? 'rgba(34, 197, 94, 0.08)' : 'rgba(251, 191, 36, 0.08)', 
                        border: item.payment_status === 'paid' ? '1px solid rgba(34, 197, 94, 0.15)' : '1px solid rgba(251, 191, 36, 0.15)' 
                      }}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold" style={{ color: T.text }}>{item.company_name || item.franchise_name || 'Franchise'}</p>
                            <p className="text-[11px]" style={{ color: T.muted }}>{item.country || item.region || 'Unknown location'}</p>
                          </div>
                          {item.payment_status === 'paid' ? (
                            <Badge className="bg-emerald-500/30 text-emerald-300 text-[10px]">
                              <DollarSign className="w-3 h-3 mr-0.5" />
                              {item.payment_amount ? `₹${item.payment_amount.toLocaleString()}` : 'PAID'}
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-500/30 text-amber-300 text-[10px]">
                              <Clock className="w-3 h-3 mr-0.5" />
                              7+ Days
                            </Badge>
                          )}
                        </div>
                        <p className="text-[9px] mt-1" style={{ color: T.dim }}>
                          {item.payment_status === 'paid' 
                            ? `Paid: ${item.payment_date ? new Date(item.payment_date).toLocaleString() : 'Recently'}`
                            : `Applied: ${new Date(item.created_at).toLocaleDateString()} (Auto-eligible)`
                          }
                        </p>
                        <div className="flex gap-1 mt-2">
                          <Button size="sm" className="h-7 px-3 text-[11px] bg-emerald-600 hover:bg-emerald-700 flex-1" onClick={() => handleApproval('franchise', item.id, 'approve')} disabled={processingId === item.id}>
                            {processingId === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><CheckCircle className="w-3 h-3 mr-1" /> Approve</>}
                          </Button>
                          <Button size="sm" className="h-7 px-2 text-[11px] bg-amber-600 hover:bg-amber-700" onClick={() => handleApproval('franchise', item.id, 'hold')} disabled={processingId === item.id}>
                            <PauseCircle className="w-3 h-3 mr-1" /> Hold
                          </Button>
                          <Button size="sm" variant="destructive" className="h-7 px-3 text-[11px]" onClick={() => handleApproval('franchise', item.id, 'reject')} disabled={processingId === item.id}>
                            <XCircle className="w-3 h-3 mr-1" /> Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* INFLUENCER APPROVALS */}
            <div className="rounded-lg p-3" style={{ background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
              <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Megaphone size={14} style={{ color: '#22c55e' }} />
                <span className="text-xs font-semibold" style={{ color: '#22c55e' }}>INFLUENCER APPLICATIONS</span>
                <Badge className="ml-auto text-[10px] bg-emerald-500/20 text-emerald-400">{approvals.influencers.length}</Badge>
              </div>
              <ScrollArea className="h-[280px]">
                {approvals.influencers.length === 0 ? (
                  <p className="text-xs text-center py-4" style={{ color: T.muted }}>No influencers waiting</p>
                ) : (
                  <div className="space-y-2">
                    {approvals.influencers.map((item: any) => (
                      <div key={item.id} className="p-3 rounded-lg" style={{ 
                        background: item.payment_status === 'paid' ? 'rgba(34, 197, 94, 0.08)' : 'rgba(251, 191, 36, 0.08)', 
                        border: item.payment_status === 'paid' ? '1px solid rgba(34, 197, 94, 0.15)' : '1px solid rgba(251, 191, 36, 0.15)' 
                      }}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold" style={{ color: T.text }}>{item.name || item.influencer_name || 'Influencer'}</p>
                            <p className="text-[11px]" style={{ color: T.muted }}>{item.platform || 'Unknown platform'} • {item.followers || '0'} followers</p>
                          </div>
                          {item.payment_status === 'paid' ? (
                            <Badge className="bg-emerald-500/30 text-emerald-300 text-[10px]">
                              <DollarSign className="w-3 h-3 mr-0.5" />
                              {item.payment_amount ? `₹${item.payment_amount.toLocaleString()}` : 'PAID'}
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-500/30 text-amber-300 text-[10px]">
                              <Clock className="w-3 h-3 mr-0.5" />
                              7+ Days
                            </Badge>
                          )}
                        </div>
                        <p className="text-[9px] mt-1" style={{ color: T.dim }}>
                          {item.payment_status === 'paid' 
                            ? `Paid: ${item.payment_date ? new Date(item.payment_date).toLocaleString() : 'Recently'}`
                            : `Applied: ${new Date(item.created_at).toLocaleDateString()} (Auto-eligible)`
                          }
                        </p>
                        <div className="flex gap-1 mt-2">
                          <Button size="sm" className="h-7 px-3 text-[11px] bg-emerald-600 hover:bg-emerald-700 flex-1" onClick={() => handleApproval('influencer', item.id, 'approve')} disabled={processingId === item.id}>
                            {processingId === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><CheckCircle className="w-3 h-3 mr-1" /> Approve</>}
                          </Button>
                          <Button size="sm" className="h-7 px-2 text-[11px] bg-amber-600 hover:bg-amber-700" onClick={() => handleApproval('influencer', item.id, 'hold')} disabled={processingId === item.id}>
                            <PauseCircle className="w-3 h-3 mr-1" /> Hold
                          </Button>
                          <Button size="sm" variant="destructive" className="h-7 px-3 text-[11px]" onClick={() => handleApproval('influencer', item.id, 'reject')} disabled={processingId === item.id}>
                            <XCircle className="w-3 h-3 mr-1" /> Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* JOB / CAREER APPROVALS */}
            <div className="rounded-lg p-3" style={{ background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
              <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Briefcase size={14} style={{ color: '#22c55e' }} />
                <span className="text-xs font-semibold" style={{ color: '#22c55e' }}>JOB / CAREER APPLICATIONS</span>
                <Badge className="ml-auto text-[10px] bg-emerald-500/20 text-emerald-400">{approvals.jobApplications.length}</Badge>
              </div>
              <ScrollArea className="h-[280px]">
                {approvals.jobApplications.length === 0 ? (
                  <p className="text-xs text-center py-4" style={{ color: T.muted }}>No job applications waiting</p>
                ) : (
                  <div className="space-y-2">
                    {approvals.jobApplications.map((item: any) => (
                      <div key={item.id} className="p-3 rounded-lg" style={{ 
                        background: 'rgba(59, 130, 246, 0.08)', 
                        border: '1px solid rgba(59, 130, 246, 0.15)' 
                      }}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold" style={{ color: T.text }}>{item.name || 'Applicant'}</p>
                            <p className="text-[11px]" style={{ color: T.muted }}>{item.email}</p>
                            <p className="text-[10px]" style={{ color: T.dim }}>{item.phone || 'No phone'} • {item.application_type?.toUpperCase()}</p>
                          </div>
                          <Badge className="bg-blue-500/30 text-blue-300 text-[10px]">
                            <Briefcase className="w-3 h-3 mr-0.5" />
                            {item.application_type?.toUpperCase() || 'JOB'}
                          </Badge>
                        </div>
                        <p className="text-[9px] mt-1" style={{ color: T.dim }}>
                          Exp: {item.experience || 'Not specified'} • Applied: {new Date(item.created_at).toLocaleDateString()}
                        </p>
                        {item.message && (
                          <p className="text-[9px] mt-1 italic" style={{ color: T.dim }}>"{item.message.substring(0, 80)}{item.message.length > 80 ? '...' : ''}"</p>
                        )}
                        <div className="flex gap-1 mt-2">
                          <Button size="sm" className="h-7 px-3 text-[11px] bg-emerald-600 hover:bg-emerald-700 flex-1" onClick={() => handleApproval('job', item.id, 'approve')} disabled={processingId === item.id}>
                            {processingId === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><CheckCircle className="w-3 h-3 mr-1" /> Approve</>}
                          </Button>
                          <Button size="sm" className="h-7 px-2 text-[11px] bg-amber-600 hover:bg-amber-700" onClick={() => handleApproval('job', item.id, 'hold')} disabled={processingId === item.id}>
                            <PauseCircle className="w-3 h-3 mr-1" /> Hold
                          </Button>
                          <Button size="sm" variant="destructive" className="h-7 px-3 text-[11px]" onClick={() => handleApproval('job', item.id, 'reject')} disabled={processingId === item.id}>
                            <XCircle className="w-3 h-3 mr-1" /> Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BossOwnerDashboard;

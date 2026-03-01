import React, { useState, useCallback, memo, useEffect } from "react";
import { 
  Crown, Shield, Lock, Users, Globe2, Activity, Server,
  Database, CreditCard, Brain, TrendingUp, Building2,
  DollarSign, Wallet, BarChart3, ShieldAlert, FileText,
  Scale, Cpu, Clock, ArrowLeft, Eye, Edit3, RefreshCw,
  Play, StopCircle, Pause, CheckCircle, XCircle, UserPlus,
  Megaphone, Store, Loader2, Bell, Bot, Sparkles
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
import { LeadModuleContainer } from "@/components/lead-module/LeadModuleContainer";
import { MarketingModuleContainer } from "@/components/marketing-module/MarketingModuleContainer";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  }>({ resellers: [], franchises: [], influencers: [] });
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

        const [resellerRes, franchiseRes, influencerRes] = await Promise.all([
          resellerQuery,
          franchiseQuery,
          influencerQuery,
        ]);
        
        // Add auto_approve_eligible flag to each application
        const processApprovals = (data: any[]) => data.map(item => ({
          ...item,
          auto_approve_eligible: item.payment_status === 'paid' || isAutoApproveEligible(item.created_at)
        }));
        
        console.log('All pending approvals fetched:', {
          resellers: resellerRes.data?.length || 0,
          franchises: franchiseRes.data?.length || 0,
          influencers: influencerRes.data?.length || 0
        });
        
        setApprovals({
          resellers: processApprovals((resellerRes.data as any[]) || []),
          franchises: processApprovals((franchiseRes.data as any[]) || []),
          influencers: processApprovals((influencerRes.data as any[]) || []),
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
  const handleApproval = async (type: 'reseller' | 'franchise' | 'influencer', id: string, action: 'approve' | 'reject') => {
    setProcessingId(id);
    try {
      const table = type === 'reseller' ? 'reseller_applications' : type === 'franchise' ? 'franchise_accounts' : 'influencer_accounts';
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      
      const { error } = await supabase.from(table).update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      
      await logAction(`${action}_${type}`, id, { status: newStatus });
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} ${action}d successfully`);
      
      // Remove from local state
      setApprovals(prev => ({
        ...prev,
        [type + 's']: prev[type + 's' as keyof typeof prev].filter((item: any) => item.id !== id)
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

  const totalPendingApprovals = approvals.resellers.length + approvals.franchises.length + approvals.influencers.length;

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
        return <div className="p-8 text-center text-muted-foreground">Product Demo module has been removed.</div>;
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
          
          <div className="p-4 grid grid-cols-3 gap-4">
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
          </div>
        </motion.div>
      )}

      {/* ===== ROW 2: KEY STATS — 4 EQUAL LARGE CARDS WITH ACTIONS ===== */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {/* REVENUE */}
        <motion.div whileHover={{ y: -2 }} style={{ background: 'linear-gradient(180deg, #0d1a2d 0%, #0a1628 100%)', border: '1px solid rgba(37, 99, 235, 0.2)', borderRadius: 8, overflow: 'hidden' }}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <DollarSign size={18} style={{ color: '#60a5fa' }} />
                <span className="text-xs font-semibold tracking-wider" style={{ color: '#60a5fa' }}>REVENUE</span>
              </div>
              <Badge className={STATUS_COLORS['active']}>Active</Badge>
            </div>
            <p className="text-2xl font-bold mb-1" style={{ color: '#e2e8f0' }}>$2.4M</p>
            <p className="text-xs" style={{ color: '#22c55e' }}>+24% from last month</p>
            <Chart type="bar" />
          </div>
          <div className="px-4 py-2 flex gap-2 border-t border-blue-500/10">
            <ActionBtn icon={Eye} label="View" onClick={() => handleBoxAction('view', 'revenue')} />
            <ActionBtn icon={Edit3} label="Edit" onClick={() => handleBoxAction('edit', 'revenue')} />
            <ActionBtn icon={RefreshCw} label="Update" onClick={() => handleBoxAction('update', 'revenue')} />
          </div>
        </motion.div>

        {/* USERS */}
        <motion.div whileHover={{ y: -2 }} style={{ background: 'linear-gradient(180deg, #0d1a2d 0%, #0a1628 100%)', border: '1px solid rgba(37, 99, 235, 0.2)', borderRadius: 8, overflow: 'hidden' }}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users size={18} style={{ color: '#60a5fa' }} />
                <span className="text-xs font-semibold tracking-wider" style={{ color: '#60a5fa' }}>USERS</span>
              </div>
              <Badge className={STATUS_COLORS['active']}>Active</Badge>
            </div>
            <p className="text-2xl font-bold mb-1" style={{ color: '#e2e8f0' }}>12.5K</p>
            <p className="text-xs" style={{ color: '#22c55e' }}>+2,847 new this week</p>
            <Chart type="line" />
          </div>
          <div className="px-4 py-2 flex gap-2 border-t border-blue-500/10">
            <ActionBtn icon={Eye} label="View" onClick={() => handleBoxAction('view', 'users')} />
            <ActionBtn icon={Edit3} label="Edit" onClick={() => handleBoxAction('edit', 'users')} />
            <ActionBtn icon={RefreshCw} label="Update" onClick={() => handleBoxAction('update', 'users')} />
          </div>
        </motion.div>

        {/* FRANCHISES */}
        <motion.div whileHover={{ y: -2 }} style={{ background: 'linear-gradient(180deg, #0d1a2d 0%, #0a1628 100%)', border: '1px solid rgba(37, 99, 235, 0.2)', borderRadius: 8, overflow: 'hidden' }}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Building2 size={18} style={{ color: '#60a5fa' }} />
                <span className="text-xs font-semibold tracking-wider" style={{ color: '#60a5fa' }}>FRANCHISES</span>
              </div>
              <Badge className={STATUS_COLORS['active']}>Active</Badge>
            </div>
            <p className="text-2xl font-bold mb-1" style={{ color: '#e2e8f0' }}>128</p>
            <p className="text-xs" style={{ color: '#60a5fa' }}>45 countries active</p>
            <Chart type="bar" />
          </div>
          <div className="px-4 py-2 flex gap-2 border-t border-blue-500/10">
            <ActionBtn icon={Eye} label="View" onClick={() => handleBoxAction('view', 'franchises')} />
            <ActionBtn icon={Edit3} label="Edit" onClick={() => handleBoxAction('edit', 'franchises')} />
            <ActionBtn icon={RefreshCw} label="Update" onClick={() => handleBoxAction('update', 'franchises')} />
          </div>
        </motion.div>

        {/* SYSTEM */}
        <motion.div whileHover={{ y: -2 }} style={{ background: 'linear-gradient(180deg, #0d1a2d 0%, #0a1628 100%)', border: '1px solid rgba(37, 99, 235, 0.2)', borderRadius: 8, overflow: 'hidden' }}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Server size={18} style={{ color: '#60a5fa' }} />
                <span className="text-xs font-semibold tracking-wider" style={{ color: '#60a5fa' }}>SYSTEM</span>
              </div>
              <Badge className={STATUS_COLORS['active']}>Active</Badge>
            </div>
            <p className="text-2xl font-bold mb-1" style={{ color: '#22c55e' }}>99.9%</p>
            <p className="text-xs" style={{ color: '#e2e8f0' }}>Uptime • 124ms response</p>
            <Chart type="line" />
          </div>
          <div className="px-4 py-2 flex gap-2 border-t border-blue-500/10">
            <ActionBtn icon={Eye} label="View" onClick={() => handleBoxAction('view', 'system')} />
            <ActionBtn icon={Play} label="Start" onClick={() => handleBoxAction('start', 'system')} />
            <ActionBtn icon={StopCircle} label="Stop" onClick={() => handleBoxAction('stop', 'system')} variant="destructive" />
          </div>
        </motion.div>
      </div>

      {/* ===== ROW 3: OPERATIONAL AUTHORITY — 6 MEDIUM CARDS WITH ACTIONS ===== */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* CEO */}
        <motion.div whileHover={{ y: -2 }} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Crown size={16} style={{ color: T.primary }} />
                <span className="text-sm font-semibold" style={{ color: T.text }}>CEO</span>
              </div>
              <Badge className={STATUS_COLORS['active']}>Active</Badge>
            </div>
            <p className="text-lg font-bold" style={{ color: T.text }}>12 Tasks</p>
            <p className="text-xs" style={{ color: T.muted }}>3 pending approval</p>
          </div>
          <div className="px-3 py-2 flex gap-2 border-t border-white/5">
            <ActionBtn icon={Eye} label="View" onClick={() => handleBoxAction('view', 'ceo')} />
            <ActionBtn icon={Edit3} label="Edit" onClick={() => handleBoxAction('edit', 'ceo')} />
          </div>
        </motion.div>

        {/* VALA AI */}
        <motion.div whileHover={{ y: -2 }} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Brain size={16} style={{ color: T.primary }} />
                <span className="text-sm font-semibold" style={{ color: T.text }}>VALA AI</span>
              </div>
              <Badge className={STATUS_COLORS['active']}>Running</Badge>
            </div>
            <p className="text-lg font-bold" style={{ color: T.text }}>847 Requests</p>
            <p className="text-xs" style={{ color: T.muted }}>AI processing active</p>
          </div>
          <div className="px-3 py-2 flex gap-2 border-t border-white/5">
            <ActionBtn icon={Eye} label="View" onClick={() => handleBoxAction('view', 'vala-ai')} />
            <ActionBtn icon={Play} label="Start AI" onClick={() => handleBoxAction('startAi', 'vala-ai')} />
            <ActionBtn icon={StopCircle} label="Stop AI" onClick={() => handleBoxAction('stopAi', 'vala-ai')} variant="destructive" />
          </div>
        </motion.div>

        {/* SERVER */}
        <motion.div whileHover={{ y: -2 }} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Cpu size={16} style={{ color: T.primary }} />
                <span className="text-sm font-semibold" style={{ color: T.text }}>SERVER</span>
              </div>
              <Badge className={STATUS_COLORS['active']}>Healthy</Badge>
            </div>
            <p className="text-lg font-bold" style={{ color: '#22c55e' }}>42%</p>
            <p className="text-xs" style={{ color: T.muted }}>CPU Load • 8GB RAM used</p>
          </div>
          <div className="px-3 py-2 flex gap-2 border-t border-white/5">
            <ActionBtn icon={Eye} label="View" onClick={() => handleBoxAction('view', 'server')} />
            <ActionBtn icon={Play} label="Start" onClick={() => handleBoxAction('start', 'server')} />
            <ActionBtn icon={StopCircle} label="Stop" onClick={() => handleBoxAction('stop', 'server')} variant="destructive" />
          </div>
        </motion.div>

        {/* SALES & SUPPORT */}
        <motion.div whileHover={{ y: -2 }} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CreditCard size={16} style={{ color: T.primary }} />
                <span className="text-sm font-semibold" style={{ color: T.text }}>SALES & SUPPORT</span>
              </div>
              <Badge className={STATUS_COLORS['pending']}>24 Open</Badge>
            </div>
            <p className="text-lg font-bold" style={{ color: T.text }}>$1.2M</p>
            <p className="text-xs" style={{ color: T.muted }}>Today's transactions</p>
          </div>
          <div className="px-3 py-2 flex gap-2 border-t border-white/5">
            <ActionBtn icon={Eye} label="View" onClick={() => handleBoxAction('view', 'sales')} />
            <ActionBtn icon={Edit3} label="Edit" onClick={() => handleBoxAction('edit', 'sales')} />
          </div>
        </motion.div>

        {/* FRANCHISE OPS */}
        <motion.div whileHover={{ y: -2 }} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Globe2 size={16} style={{ color: T.primary }} />
                <span className="text-sm font-semibold" style={{ color: T.text }}>FRANCHISE OPS</span>
              </div>
              <Badge className={STATUS_COLORS['active']}>128</Badge>
            </div>
            <p className="text-lg font-bold" style={{ color: T.text }}>Mumbai</p>
            <p className="text-xs" style={{ color: T.muted }}>Top performer • $18.7K avg</p>
          </div>
          <div className="px-3 py-2 flex gap-2 border-t border-white/5">
            <ActionBtn icon={Eye} label="View" onClick={() => handleBoxAction('view', 'franchise-ops')} />
            <ActionBtn icon={Edit3} label="Edit" onClick={() => handleBoxAction('edit', 'franchise-ops')} />
          </div>
        </motion.div>

        {/* SYSTEM HEALTH */}
        <motion.div whileHover={{ y: -2 }} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} style={{ color: T.primary }} />
                <span className="text-sm font-semibold" style={{ color: T.text }}>SYSTEM HEALTH</span>
              </div>
              <Badge className={STATUS_COLORS['error']}>3 Alerts</Badge>
            </div>
            <p className="text-lg font-bold" style={{ color: '#22c55e' }}>47</p>
            <p className="text-xs" style={{ color: T.muted }}>Issues resolved today</p>
          </div>
          <div className="px-3 py-2 flex gap-2 border-t border-white/5">
            <ActionBtn icon={Eye} label="View" onClick={() => handleBoxAction('view', 'system-health')} />
            <ActionBtn icon={Pause} label="Pause" onClick={() => handleBoxAction('pause', 'system-health')} />
          </div>
        </motion.div>
      </div>

      {/* ===== ROW 4: ACTIVITY & ALERTS — FULL WIDTH PANEL WITH ACTIONS ===== */}
      <motion.div whileHover={{ y: -2 }} style={{ background: 'linear-gradient(180deg, #0d1a2d 0%, #0a1628 100%)', border: '1px solid rgba(37, 99, 235, 0.2)', borderRadius: 8, overflow: 'hidden' }}>
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(37, 99, 235, 0.15)' }}>
          <div className="flex items-center gap-2">
            <Activity size={16} style={{ color: '#60a5fa' }} />
            <span className="text-sm font-semibold tracking-wider" style={{ color: '#60a5fa' }}>ACTIVITY & ALERTS</span>
          </div>
          <div className="flex items-center gap-4">
            <Badge className={STATUS_COLORS['active']}>AI: Online</Badge>
            <Badge className={STATUS_COLORS['pending']}>5 Pending</Badge>
            <Badge className={STATUS_COLORS['error']}>3 Alerts</Badge>
          </div>
        </div>
        <div className="p-4 grid grid-cols-4 gap-4">
          {/* AI Status */}
          <motion.div whileHover={{ scale: 1.02 }} className="p-3 rounded" style={{ background: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.1)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Brain size={14} style={{ color: '#60a5fa' }} />
              <span className="text-xs font-medium" style={{ color: '#60a5fa' }}>AI STATUS</span>
            </div>
            <p className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>Processing 12 requests</p>
            <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>Avg response: 1.2s</p>
            <div className="mt-3 flex gap-1">
              <ActionBtn icon={Eye} label="View" onClick={() => handleBoxAction('view', 'ai-status')} />
              <ActionBtn icon={FileText} label="Logs" onClick={() => handleBoxAction('viewLogs', 'ai-status')} />
            </div>
          </motion.div>

          {/* Pending Actions */}
          <motion.div whileHover={{ scale: 1.02 }} className="p-3 rounded" style={{ background: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.1)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Clock size={14} style={{ color: '#60a5fa' }} />
              <span className="text-xs font-medium" style={{ color: '#60a5fa' }}>PENDING ACTIONS</span>
            </div>
            <p className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>5 items need review</p>
            <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>3 high priority</p>
            <div className="mt-3 flex gap-1">
              <ActionBtn icon={Eye} label="View" onClick={() => handleBoxAction('view', 'pending-actions')} />
            </div>
          </motion.div>

          {/* Alerts */}
          <motion.div whileHover={{ scale: 1.02 }} className="p-3 rounded" style={{ background: 'rgba(220, 38, 38, 0.05)', border: '1px solid rgba(220, 38, 38, 0.1)' }}>
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert size={14} style={{ color: '#dc2626' }} />
              <span className="text-xs font-medium" style={{ color: '#dc2626' }}>ALERTS</span>
            </div>
            <p className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>3 security alerts</p>
            <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>1 critical • 2 warnings</p>
            <div className="mt-3 flex gap-1">
              <ActionBtn icon={Eye} label="View" onClick={() => handleBoxAction('view', 'alerts')} />
              <ActionBtn icon={Pause} label="Pause" onClick={() => handleBoxAction('pause', 'alerts')} />
            </div>
          </motion.div>

          {/* Logs */}
          <motion.div whileHover={{ scale: 1.02 }} className="p-3 rounded" style={{ background: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.1)' }}>
            <div className="flex items-center gap-2 mb-2">
              <FileText size={14} style={{ color: '#60a5fa' }} />
              <span className="text-xs font-medium" style={{ color: '#60a5fa' }}>LOGS</span>
            </div>
            <p className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>1,247 entries today</p>
            <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>Last: 2 mins ago</p>
            <div className="mt-3 flex gap-1">
              <ActionBtn icon={Eye} label="View" onClick={() => handleBoxAction('view', 'logs')} />
              <ActionBtn icon={RefreshCw} label="Refresh" onClick={() => handleBoxAction('update', 'logs')} />
            </div>
          </motion.div>
        </div>
      </motion.div>

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
            <p className="text-xs" style={{ color: T.muted }}>No pending reseller, franchise, or influencer applications</p>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-3 gap-4">
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
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BossOwnerDashboard;

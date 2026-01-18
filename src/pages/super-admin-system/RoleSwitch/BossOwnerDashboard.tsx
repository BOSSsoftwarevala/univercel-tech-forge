import React, { useState, useCallback, memo } from "react";
import { 
  Crown, Shield, Lock, Users, Globe2, Activity, Server,
  Database, CreditCard, Brain, TrendingUp, Building2,
  DollarSign, Wallet, BarChart3, ShieldAlert, FileText,
  Scale, Cpu, Clock, ArrowLeft
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ServerModuleContainer } from "@/components/server-module/ServerModuleContainer";
import { ValaAIModuleContainer } from "@/components/vala-ai-module/ValaAIModuleContainer";
import { ProductDemoModuleContainer } from "@/components/product-demo-module/ProductDemoModuleContainer";
import { LeadModuleContainer } from "@/components/lead-module/LeadModuleContainer";
import { MarketingModuleContainer } from "@/components/marketing-module/MarketingModuleContainer";

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

// ===== DATA CARD =====
const DataCard = memo(({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
    <div className="flex items-center gap-2 px-4 py-3" style={{ background: T.primary }}>
      <span style={{ color: T.text }}>{icon}</span>
      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: T.text }}>{title}</span>
    </div>
    <div className="p-4">{children}</div>
  </div>
));

// ===== CHART =====
const Chart = memo(({ type = 'bar' }: { type?: 'bar' | 'line' }) => (
  <div className="flex items-end justify-around gap-1 p-3 rounded" style={{ height: 120, background: 'rgba(37,99,235,0.05)' }}>
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

// ===== STAT ROW =====
const StatRow = ({ l1, v1, l2, v2, c1 = T.primary, c2 = T.text }: { l1: string; v1: string; l2: string; v2: string; c1?: string; c2?: string }) => (
  <div className="grid grid-cols-2 gap-3 mt-3">
    <div><span className="text-[10px] block" style={{ color: T.dim }}>{l1}</span><span className="text-lg font-bold" style={{ color: c1 }}>{v1}</span></div>
    <div><span className="text-[10px] block" style={{ color: T.dim }}>{l2}</span><span className="text-lg font-bold" style={{ color: c2 }}>{v2}</span></div>
  </div>
);

interface Props { activeNav?: string; }

const BossOwnerDashboard = ({ activeNav }: Props) => {
  const [showLock, setShowLock] = useState(false);
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const { user } = useAuth();

  // Module routing
  const modules: Record<string, 'server' | 'vala-ai' | 'product-demo' | 'leads' | 'marketing'> = {
    'server-control': 'server', 'vala-ai': 'vala-ai', 'product-demo': 'product-demo', 'leads': 'leads', 'marketing': 'marketing'
  };

  const goBack = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete('nav');
    window.history.pushState({}, '', url.toString());
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, []);

  // If module is selected, show module container with back button
  if (activeNav && activeNav in modules) {
    switch (modules[activeNav]) {
      case 'server': return <ServerModuleContainer onBack={goBack} />;
      case 'vala-ai': return <ValaAIModuleContainer onBack={goBack} />;
      case 'product-demo': return <ProductDemoModuleContainer onBack={goBack} />;
      case 'leads': return <LeadModuleContainer onBack={goBack} />;
      case 'marketing': return <MarketingModuleContainer onBack={goBack} />;
    }
  }

  const logAction = async (action: string, target: string, meta?: Record<string, any>) => {
    try {
      await supabase.from('audit_logs').insert({ user_id: user?.id, role: 'boss_owner' as any, module: 'boss-dashboard', action, meta_json: { target, timestamp: new Date().toISOString(), ...meta } });
    } catch (e) { console.error(e); }
  };

  const lockdown = async () => {
    if (!confirmed) return toast.error("2FA required");
    if (reason.length < 20) return toast.error("Reason: min 20 chars");
    await logAction('emergency_lockdown', 'SYSTEM', { reason });
    toast.success("🔒 LOCKDOWN ACTIVATED");
    setShowLock(false); setReason(""); setConfirmed(false);
  };

  return (
    <div className="min-h-screen p-6" style={{ background: T.bg, fontFamily: "'Outfit', sans-serif" }}>
      {/* HEADER */}
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

      {/* MAIN LAYOUT: KEY STATS Sidebar + 2-Column Cards Grid */}
      <div className="flex gap-5">
        {/* KEY STATS Sidebar */}
        <div className="w-56 flex-shrink-0">
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
            <div className="px-4 py-3 text-center font-bold text-sm tracking-wider" style={{ background: T.primary, color: T.text }}>KEY STATS</div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${T.border}` }}>
                <div className="flex items-center gap-2"><BarChart3 size={14} style={{ color: T.dim }} /><span className="text-xs" style={{ color: T.muted }}>TOTAL REVENUE</span></div>
                <span className="font-bold" style={{ color: T.primary }}>$2.4M</span>
              </div>
              <div className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${T.border}` }}>
                <div className="flex items-center gap-2"><TrendingUp size={14} style={{ color: T.dim }} /><span className="text-xs" style={{ color: T.muted }}>GROWTH</span></div>
                <span className="font-bold" style={{ color: T.green }}>+24%</span>
              </div>
              <div className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${T.border}` }}>
                <div className="flex items-center gap-2"><Users size={14} style={{ color: T.dim }} /><span className="text-xs" style={{ color: T.muted }}>ACTIVE USERS</span></div>
                <span className="font-bold" style={{ color: T.text }}>12.5K</span>
              </div>
              <div className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${T.border}` }}>
                <div className="flex items-center gap-2"><Globe2 size={14} style={{ color: T.dim }} /><span className="text-xs" style={{ color: T.muted }}>COUNTRIES</span></div>
                <span className="font-bold" style={{ color: T.text }}>45</span>
              </div>
              <div className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${T.border}` }}>
                <div className="flex items-center gap-2"><Building2 size={14} style={{ color: T.dim }} /><span className="text-xs" style={{ color: T.muted }}>FRANCHISES</span></div>
                <span className="font-bold" style={{ color: T.text }}>128</span>
              </div>
              <div className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${T.border}` }}>
                <div className="flex items-center gap-2"><Wallet size={14} style={{ color: T.dim }} /><span className="text-xs" style={{ color: T.muted }}>WALLET</span></div>
                <span className="font-bold" style={{ color: T.primary }}>$456K</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2"><Activity size={14} style={{ color: T.dim }} /><span className="text-xs" style={{ color: T.muted }}>UPTIME</span></div>
                <span className="font-bold" style={{ color: T.green }}>99.9%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Grid - 2 Columns */}
        <div className="flex-1 grid grid-cols-2 gap-5">
          <DataCard title="REVENUE" icon={<DollarSign size={14} />}><Chart type="bar" /><StatRow l1="THIS MONTH" v1="$847K" l2="LAST MONTH" v2="$692K" /></DataCard>
          <DataCard title="USERS" icon={<Users size={14} />}><Chart type="line" /><StatRow l1="NEW USERS" v1="+2,847" l2="ACTIVE TODAY" v2="8,421" /></DataCard>
          <DataCard title="FRANCHISES" icon={<Building2 size={14} />}><Chart type="bar" /><StatRow l1="TOP" v1="Mumbai" l2="AVG REV" v2="$18.7K" /></DataCard>
          <DataCard title="SYSTEM" icon={<Server size={14} />}><Chart type="line" /><StatRow l1="LOAD" v1="42%" l2="RESPONSE" v2="124ms" c1={T.green} /></DataCard>
          <DataCard title="SECURITY" icon={<ShieldAlert size={14} />}><Chart type="bar" /><StatRow l1="CRITICAL" v1="3" l2="RESOLVED" v2="47" c1={T.accent} c2={T.green} /></DataCard>
          <DataCard title="TRANSACTIONS" icon={<CreditCard size={14} />}><Chart type="line" /><StatRow l1="TODAY" v1="$1.2M" l2="PENDING" v2="$89K" c2={T.primary} /></DataCard>
        </div>
      </div>
    </div>
  );
};

export default BossOwnerDashboard;

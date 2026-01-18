import React, { useState, useEffect, useCallback, memo } from "react";
import { 
  Crown, Shield, Lock, Archive, AlertTriangle, Users, Globe2,
  Key, Activity, FileText, Settings, Gavel, Eye, Trash2, Power,
  CheckCircle2, XCircle, Clock, RotateCcw, Database, Server,
  Fingerprint, ShieldCheck, Ban, History, Download, Upload,
  Play, Pause, Square, RefreshCw, AlertOctagon, CreditCard,
  CalendarClock, Zap, Bug, Rocket, ShieldAlert, Scale,
  Cpu, Radio, MoreHorizontal, Send, Brain, Lightbulb, Building2,
  TrendingUp, TrendingDown, DollarSign, Wallet, BarChart3, PieChart
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCEOSuggestions } from "@/hooks/useCEOSuggestions";
import { useDashboardContext } from "@/hooks/useDashboardContext";
import { FranchiseIntelligenceCenter } from "@/components/franchise-intelligence";
import { GlobalNetworkMap } from "@/components/boss-panel/sections/GlobalNetworkMap";
import { cn } from "@/lib/utils";
import { ServerModuleContainer } from "@/components/server-module/ServerModuleContainer";
import { ValaAIModuleContainer } from "@/components/vala-ai-module/ValaAIModuleContainer";
import { ProductDemoModuleContainer } from "@/components/product-demo-module/ProductDemoModuleContainer";
import { LeadModuleContainer } from "@/components/lead-module/LeadModuleContainer";
import { MarketingModuleContainer } from "@/components/marketing-module/MarketingModuleContainer";
import { ComingSoonScreen } from "@/components/shared/RouteLoadingFallback";

// ===== BOSS THEME: Dark + Orange (Reference Design) =====
const THEME = {
  bg: '#0d0d0d',
  bgCard: '#1a1a1a',
  bgCardHover: '#222222',
  border: '#333333',
  borderAccent: '#f7931a',
  accent: '#f7931a',
  accentLight: '#ffb347',
  text: '#ffffff',
  textSecondary: '#999999',
  textMuted: '#666666',
  success: '#22c55e',
  danger: '#ef4444',
  warning: '#f7931a',
};

// ===== STAT BOX COMPONENT =====
interface StatBoxProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  accentColor?: string;
}

const StatBox = memo(({ icon, label, value, subValue, trend, trendValue, accentColor = THEME.accent }: StatBoxProps) => (
  <div
    style={{
      background: THEME.bgCard,
      border: `1px solid ${THEME.border}`,
      borderLeft: `4px solid ${accentColor}`,
      borderRadius: '8px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      minHeight: '140px',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ color: accentColor }}>{icon}</div>
      <span style={{ 
        color: THEME.textSecondary, 
        fontSize: '12px', 
        fontWeight: 600, 
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {label}
      </span>
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
      <span style={{ 
        color: accentColor, 
        fontSize: '32px', 
        fontWeight: 700, 
        fontFamily: "'Space Grotesk', sans-serif",
        lineHeight: 1
      }}>
        {value}
      </span>
      {subValue && (
        <span style={{ color: THEME.textMuted, fontSize: '14px' }}>{subValue}</span>
      )}
    </div>
    {trend && trendValue && (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'auto' }}>
        {trend === 'up' ? (
          <TrendingUp size={14} style={{ color: THEME.success }} />
        ) : trend === 'down' ? (
          <TrendingDown size={14} style={{ color: THEME.danger }} />
        ) : null}
        <span style={{ 
          color: trend === 'up' ? THEME.success : trend === 'down' ? THEME.danger : THEME.textMuted,
          fontSize: '12px',
          fontWeight: 500
        }}>
          {trendValue}
        </span>
      </div>
    )}
  </div>
));
StatBox.displayName = 'StatBox';

// ===== DATA CARD COMPONENT =====
interface DataCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
}

const DataCard = memo(({ title, children, icon, headerAction }: DataCardProps) => (
  <div
    style={{
      background: THEME.bgCard,
      border: `1px solid ${THEME.border}`,
      borderRadius: '8px',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        background: THEME.accent,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {icon && <span style={{ color: THEME.bg }}>{icon}</span>}
        <span style={{ 
          color: THEME.bg, 
          fontSize: '14px', 
          fontWeight: 700, 
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          {title}
        </span>
      </div>
      {headerAction}
    </div>
    <div style={{ padding: '16px' }}>
      {children}
    </div>
  </div>
));
DataCard.displayName = 'DataCard';

// ===== CHART PLACEHOLDER =====
const ChartPlaceholder = memo(({ height = 150, type = 'line' }: { height?: number; type?: 'line' | 'bar' }) => (
  <div style={{ 
    height, 
    background: 'rgba(247, 147, 26, 0.05)', 
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    padding: '16px',
    gap: '4px'
  }}>
    {type === 'bar' ? (
      [40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
        <div
          key={i}
          style={{
            width: '100%',
            height: `${h}%`,
            background: i === 11 ? THEME.accent : 'rgba(247, 147, 26, 0.3)',
            borderRadius: '2px 2px 0 0',
            transition: 'all 0.3s ease'
          }}
        />
      ))
    ) : (
      <svg width="100%" height="100%" viewBox="0 0 200 60" preserveAspectRatio="none">
        <polyline
          points="0,50 20,45 40,35 60,40 80,25 100,30 120,20 140,35 160,15 180,25 200,10"
          fill="none"
          stroke={THEME.accent}
          strokeWidth="2"
        />
        <polyline
          points="0,50 20,45 40,35 60,40 80,25 100,30 120,20 140,35 160,15 180,25 200,10"
          fill="url(#gradient)"
          stroke="none"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={THEME.accent} stopOpacity="0.3" />
            <stop offset="100%" stopColor={THEME.accent} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    )}
  </div>
));
ChartPlaceholder.displayName = 'ChartPlaceholder';

// ===== MINI STAT ROW =====
interface MiniStatProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const MiniStat = memo(({ icon, label, value }: MiniStatProps) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px',
    padding: '8px 0',
    borderBottom: `1px solid ${THEME.border}`
  }}>
    <div style={{ color: THEME.accent }}>{icon}</div>
    <span style={{ color: THEME.textSecondary, fontSize: '12px', flex: 1 }}>{label}</span>
    <span style={{ color: THEME.accent, fontSize: '16px', fontWeight: 700 }}>{value}</span>
  </div>
));
MiniStat.displayName = 'MiniStat';

interface BossOwnerDashboardProps {
  activeNav?: string;
}

const BossOwnerDashboard = ({ activeNav }: BossOwnerDashboardProps) => {
  const [showLockDialog, setShowLockDialog] = useState(false);
  const [lockReason, setLockReason] = useState("");
  const [twoFactorConfirmed, setTwoFactorConfirmed] = useState(false);
  const { user } = useAuth();
  const { suggestions, acknowledgeSuggestion } = useCEOSuggestions();
  const { selectedCard, setSelectedCard, clearSelection } = useDashboardContext();

  // Module routing
  const moduleRoutes: Record<string, 'server' | 'vala-ai' | 'product-demo' | 'leads' | 'marketing'> = {
    'server-control': 'server',
    'vala-ai': 'vala-ai',
    'product-demo': 'product-demo',
    'leads': 'leads',
    'marketing': 'marketing',
  };

  const isModuleView = activeNav && activeNav in moduleRoutes;

  const handleModuleBack = useCallback(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('nav');
      window.history.pushState({}, '', url.toString());
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, []);

  // Module views
  if (isModuleView && activeNav) {
    const moduleType = moduleRoutes[activeNav];
    switch (moduleType) {
      case 'server':
        return <ServerModuleContainer onBack={handleModuleBack} />;
      case 'vala-ai':
        return <ValaAIModuleContainer onBack={handleModuleBack} />;
      case 'product-demo':
        return <ProductDemoModuleContainer onBack={handleModuleBack} />;
      case 'leads':
        return <LeadModuleContainer onBack={handleModuleBack} />;
      case 'marketing':
        return <MarketingModuleContainer onBack={handleModuleBack} />;
    }
  }

  // Action handlers
  const logAction = useCallback(async (action: string, target: string, meta?: Record<string, any>) => {
    try {
      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        role: 'boss_owner' as any,
        module: 'boss-dashboard',
        action,
        meta_json: { target, timestamp: new Date().toISOString(), ...meta }
      });
    } catch (error) {
      console.error('Audit log error:', error);
    }
  }, [user?.id]);

  const handleEmergencyLockdown = async () => {
    if (!twoFactorConfirmed) {
      toast.error("2FA verification required for emergency lockdown");
      return;
    }
    if (lockReason.length < 20) {
      toast.error("Reason must be at least 20 characters");
      return;
    }
    await logAction('emergency_lockdown', 'SYSTEM', { reason: lockReason });
    toast.success("🔒 EMERGENCY LOCKDOWN ACTIVATED", {
      description: "All operations suspended. Only Boss can unlock.",
    });
    setShowLockDialog(false);
    setLockReason("");
    setTwoFactorConfirmed(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: THEME.bg, 
      padding: '24px',
      fontFamily: "'Outfit', sans-serif"
    }}>
      {/* HEADER */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '32px',
        paddingBottom: '20px',
        borderBottom: `1px solid ${THEME.border}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${THEME.accent}, ${THEME.accentLight})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 8px 24px rgba(247, 147, 26, 0.3)`
          }}>
            <Crown size={28} style={{ color: THEME.bg }} />
          </div>
          <div>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: 700, 
              color: THEME.text,
              fontFamily: "'Space Grotesk', sans-serif",
              margin: 0
            }}>
              BOSS / OWNER DASHBOARD
            </h1>
            <p style={{ 
              fontSize: '12px', 
              color: THEME.accent,
              letterSpacing: '1px',
              margin: 0,
              marginTop: '4px'
            }}>
              FINAL AUTHORITY • APPROVE / LOCK / ARCHIVE
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            padding: '8px 16px',
            background: 'rgba(247, 147, 26, 0.15)',
            border: `1px solid ${THEME.accent}`,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Crown size={16} style={{ color: THEME.accent }} />
            <span style={{ color: THEME.accent, fontSize: '12px', fontWeight: 600 }}>
              SUPREME AUTHORITY
            </span>
          </div>

          <Dialog open={showLockDialog} onOpenChange={setShowLockDialog}>
            <DialogTrigger asChild>
              <button style={{
                padding: '10px 20px',
                background: THEME.danger,
                border: 'none',
                borderRadius: '8px',
                color: THEME.text,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Lock size={16} />
                Emergency Lockdown
              </button>
            </DialogTrigger>
            <DialogContent style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}` }}>
              <DialogHeader>
                <DialogTitle style={{ color: THEME.text }}>Emergency Lockdown</DialogTitle>
                <DialogDescription style={{ color: THEME.textSecondary }}>
                  This will immediately suspend all system operations.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Reason for lockdown (min 20 chars)..."
                  value={lockReason}
                  onChange={(e) => setLockReason(e.target.value)}
                  style={{ background: THEME.bg, border: `1px solid ${THEME.border}`, color: THEME.text }}
                />
                <div className="flex items-center gap-2">
                  <Switch checked={twoFactorConfirmed} onCheckedChange={setTwoFactorConfirmed} />
                  <span style={{ color: THEME.textSecondary, fontSize: '14px' }}>
                    I confirm 2FA verification
                  </span>
                </div>
                <Button 
                  onClick={handleEmergencyLockdown}
                  className="w-full"
                  style={{ background: THEME.danger }}
                >
                  Activate Lockdown
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KEY STATS - LEFT SIDEBAR */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '24px'
      }}>
        {/* LEFT: Key Stats Panel */}
        <div style={{
          background: THEME.bgCard,
          border: `1px solid ${THEME.border}`,
          borderRadius: '8px',
          padding: '16px'
        }}>
          <div style={{
            background: THEME.accent,
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            <span style={{ 
              color: THEME.bg, 
              fontSize: '12px', 
              fontWeight: 700,
              letterSpacing: '1px'
            }}>
              KEY STATS
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <MiniStat icon={<BarChart3 size={16} />} label="TOTAL REVENUE" value="$2.4M" />
            <MiniStat icon={<TrendingUp size={16} />} label="GROWTH" value="+24%" />
            <MiniStat icon={<Users size={16} />} label="ACTIVE USERS" value="12.5K" />
            <MiniStat icon={<Globe2 size={16} />} label="COUNTRIES" value="45" />
            <MiniStat icon={<Building2 size={16} />} label="FRANCHISES" value="128" />
            <MiniStat icon={<Wallet size={16} />} label="WALLET BALANCE" value="$456K" />
            <MiniStat icon={<Activity size={16} />} label="UPTIME" value="99.9%" />
            <MiniStat icon={<Shield size={16} />} label="SECURITY SCORE" value="A+" />
          </div>

          {/* QR Code Placeholder */}
          <div style={{ 
            marginTop: '20px', 
            padding: '16px',
            background: THEME.bg,
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              margin: '0 auto 12px',
              background: THEME.text,
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: THEME.bg, fontSize: '10px' }}>QR CODE</span>
            </div>
            <span style={{ color: THEME.textSecondary, fontSize: '10px' }}>
              SCAN FOR MOBILE ACCESS
            </span>
          </div>
        </div>

        {/* RIGHT: Main Content - 2 Cards Per Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px'
        }}>
          {/* Card 1: Revenue Overview */}
          <DataCard title="REVENUE OVERVIEW" icon={<DollarSign size={16} />}>
            <div style={{ marginBottom: '16px' }}>
              <ChartPlaceholder height={140} type="bar" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <span style={{ color: THEME.textMuted, fontSize: '11px' }}>THIS MONTH</span>
                <div style={{ color: THEME.accent, fontSize: '20px', fontWeight: 700 }}>$847K</div>
              </div>
              <div>
                <span style={{ color: THEME.textMuted, fontSize: '11px' }}>LAST MONTH</span>
                <div style={{ color: THEME.text, fontSize: '20px', fontWeight: 700 }}>$692K</div>
              </div>
            </div>
          </DataCard>

          {/* Card 2: User Analytics */}
          <DataCard title="USER ANALYTICS" icon={<Users size={16} />}>
            <div style={{ marginBottom: '16px' }}>
              <ChartPlaceholder height={140} type="line" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <span style={{ color: THEME.textMuted, fontSize: '11px' }}>NEW USERS</span>
                <div style={{ color: THEME.accent, fontSize: '20px', fontWeight: 700 }}>+2,847</div>
              </div>
              <div>
                <span style={{ color: THEME.textMuted, fontSize: '11px' }}>ACTIVE TODAY</span>
                <div style={{ color: THEME.text, fontSize: '20px', fontWeight: 700 }}>8,421</div>
              </div>
            </div>
          </DataCard>

          {/* Card 3: Franchise Performance */}
          <DataCard title="FRANCHISE PERFORMANCE" icon={<Building2 size={16} />}>
            <div style={{ marginBottom: '16px' }}>
              <ChartPlaceholder height={140} type="bar" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <span style={{ color: THEME.textMuted, fontSize: '11px' }}>TOP PERFORMER</span>
                <div style={{ color: THEME.accent, fontSize: '16px', fontWeight: 700 }}>Mumbai HQ</div>
              </div>
              <div>
                <span style={{ color: THEME.textMuted, fontSize: '11px' }}>AVG REVENUE</span>
                <div style={{ color: THEME.text, fontSize: '20px', fontWeight: 700 }}>$18.7K</div>
              </div>
            </div>
          </DataCard>

          {/* Card 4: System Status */}
          <DataCard title="SYSTEM STATUS" icon={<Server size={16} />}>
            <div style={{ marginBottom: '16px' }}>
              <ChartPlaceholder height={140} type="line" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <span style={{ color: THEME.textMuted, fontSize: '11px' }}>SERVER LOAD</span>
                <div style={{ color: THEME.success, fontSize: '20px', fontWeight: 700 }}>42%</div>
              </div>
              <div>
                <span style={{ color: THEME.textMuted, fontSize: '11px' }}>RESPONSE TIME</span>
                <div style={{ color: THEME.text, fontSize: '20px', fontWeight: 700 }}>124ms</div>
              </div>
            </div>
          </DataCard>

          {/* Card 5: Security Alerts */}
          <DataCard title="SECURITY ALERTS" icon={<ShieldAlert size={16} />}>
            <div style={{ marginBottom: '16px' }}>
              <ChartPlaceholder height={140} type="bar" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <span style={{ color: THEME.textMuted, fontSize: '11px' }}>CRITICAL</span>
                <div style={{ color: THEME.danger, fontSize: '20px', fontWeight: 700 }}>3</div>
              </div>
              <div>
                <span style={{ color: THEME.textMuted, fontSize: '11px' }}>RESOLVED TODAY</span>
                <div style={{ color: THEME.success, fontSize: '20px', fontWeight: 700 }}>47</div>
              </div>
            </div>
          </DataCard>

          {/* Card 6: Transaction Volume */}
          <DataCard title="TRANSACTION VOLUME" icon={<CreditCard size={16} />}>
            <div style={{ marginBottom: '16px' }}>
              <ChartPlaceholder height={140} type="line" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <span style={{ color: THEME.textMuted, fontSize: '11px' }}>TODAY</span>
                <div style={{ color: THEME.accent, fontSize: '20px', fontWeight: 700 }}>$1.2M</div>
              </div>
              <div>
                <span style={{ color: THEME.textMuted, fontSize: '11px' }}>PENDING</span>
                <div style={{ color: THEME.warning, fontSize: '20px', fontWeight: 700 }}>$89K</div>
              </div>
            </div>
          </DataCard>

          {/* Card 7: AI Insights */}
          <DataCard title="AI INSIGHTS" icon={<Brain size={16} />}>
            <div style={{ marginBottom: '16px' }}>
              <ChartPlaceholder height={140} type="bar" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <span style={{ color: THEME.textMuted, fontSize: '11px' }}>PREDICTIONS</span>
                <div style={{ color: THEME.accent, fontSize: '20px', fontWeight: 700 }}>156</div>
              </div>
              <div>
                <span style={{ color: THEME.textMuted, fontSize: '11px' }}>ACCURACY</span>
                <div style={{ color: THEME.success, fontSize: '20px', fontWeight: 700 }}>94.2%</div>
              </div>
            </div>
          </DataCard>

          {/* Card 8: Marketing ROI */}
          <DataCard title="MARKETING ROI" icon={<TrendingUp size={16} />}>
            <div style={{ marginBottom: '16px' }}>
              <ChartPlaceholder height={140} type="line" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <span style={{ color: THEME.textMuted, fontSize: '11px' }}>SPEND</span>
                <div style={{ color: THEME.text, fontSize: '20px', fontWeight: 700 }}>$45K</div>
              </div>
              <div>
                <span style={{ color: THEME.textMuted, fontSize: '11px' }}>RETURN</span>
                <div style={{ color: THEME.accent, fontSize: '20px', fontWeight: 700 }}>$312K</div>
              </div>
            </div>
          </DataCard>

          {/* Card 9: Pending Approvals */}
          <DataCard title="PENDING APPROVALS" icon={<Clock size={16} />}>
            <div style={{ marginBottom: '16px' }}>
              <ChartPlaceholder height={140} type="bar" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <span style={{ color: THEME.textMuted, fontSize: '11px' }}>WAITING</span>
                <div style={{ color: THEME.warning, fontSize: '20px', fontWeight: 700 }}>23</div>
              </div>
              <div>
                <span style={{ color: THEME.textMuted, fontSize: '11px' }}>URGENT</span>
                <div style={{ color: THEME.danger, fontSize: '20px', fontWeight: 700 }}>5</div>
              </div>
            </div>
          </DataCard>

          {/* Card 10: Global Reach */}
          <DataCard title="GLOBAL REACH" icon={<Globe2 size={16} />}>
            <div style={{ marginBottom: '16px' }}>
              <ChartPlaceholder height={140} type="line" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <span style={{ color: THEME.textMuted, fontSize: '11px' }}>COUNTRIES</span>
                <div style={{ color: THEME.accent, fontSize: '20px', fontWeight: 700 }}>45</div>
              </div>
              <div>
                <span style={{ color: THEME.textMuted, fontSize: '11px' }}>NEW MARKETS</span>
                <div style={{ color: THEME.success, fontSize: '20px', fontWeight: 700 }}>+7</div>
              </div>
            </div>
          </DataCard>

          {/* Card 11: Support Tickets */}
          <DataCard title="SUPPORT TICKETS" icon={<FileText size={16} />}>
            <div style={{ marginBottom: '16px' }}>
              <ChartPlaceholder height={140} type="bar" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <span style={{ color: THEME.textMuted, fontSize: '11px' }}>OPEN</span>
                <div style={{ color: THEME.warning, fontSize: '20px', fontWeight: 700 }}>89</div>
              </div>
              <div>
                <span style={{ color: THEME.textMuted, fontSize: '11px' }}>AVG RESPONSE</span>
                <div style={{ color: THEME.text, fontSize: '20px', fontWeight: 700 }}>2.4h</div>
              </div>
            </div>
          </DataCard>

          {/* Card 12: Compliance Status */}
          <DataCard title="COMPLIANCE STATUS" icon={<Scale size={16} />}>
            <div style={{ marginBottom: '16px' }}>
              <ChartPlaceholder height={140} type="line" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <span style={{ color: THEME.textMuted, fontSize: '11px' }}>SCORE</span>
                <div style={{ color: THEME.success, fontSize: '20px', fontWeight: 700 }}>98%</div>
              </div>
              <div>
                <span style={{ color: THEME.textMuted, fontSize: '11px' }}>AUDITS PASSED</span>
                <div style={{ color: THEME.text, fontSize: '20px', fontWeight: 700 }}>24/24</div>
              </div>
            </div>
          </DataCard>

          {/* Card 13: Developer Activity */}
          <DataCard title="DEVELOPER ACTIVITY" icon={<Cpu size={16} />}>
            <div style={{ marginBottom: '16px' }}>
              <ChartPlaceholder height={140} type="bar" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <span style={{ color: THEME.textMuted, fontSize: '11px' }}>COMMITS TODAY</span>
                <div style={{ color: THEME.accent, fontSize: '20px', fontWeight: 700 }}>47</div>
              </div>
              <div>
                <span style={{ color: THEME.textMuted, fontSize: '11px' }}>DEPLOYMENTS</span>
                <div style={{ color: THEME.success, fontSize: '20px', fontWeight: 700 }}>12</div>
              </div>
            </div>
          </DataCard>

          {/* Card 14: Infrastructure */}
          <DataCard title="INFRASTRUCTURE" icon={<Database size={16} />}>
            <div style={{ marginBottom: '16px' }}>
              <ChartPlaceholder height={140} type="line" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <span style={{ color: THEME.textMuted, fontSize: '11px' }}>STORAGE USED</span>
                <div style={{ color: THEME.text, fontSize: '20px', fontWeight: 700 }}>2.4TB</div>
              </div>
              <div>
                <span style={{ color: THEME.textMuted, fontSize: '11px' }}>BANDWIDTH</span>
                <div style={{ color: THEME.accent, fontSize: '20px', fontWeight: 700 }}>847GB</div>
              </div>
            </div>
          </DataCard>
        </div>
      </div>
    </div>
  );
};

export default BossOwnerDashboard;

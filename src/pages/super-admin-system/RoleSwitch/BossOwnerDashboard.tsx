import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Crown, Shield, Lock, Archive, AlertTriangle, Users, Globe2,
  Key, Activity, FileText, Settings, Gavel, Eye, Trash2, Power,
  CheckCircle2, XCircle, Clock, RotateCcw, Database, Server,
  Fingerprint, ShieldCheck, Ban, History, Download, Upload,
  Play, Pause, Square, RefreshCw, AlertOctagon, CreditCard,
  CalendarClock, Zap, Bug, Rocket, ShieldAlert, Scale,
  Cpu, Radio, MoreHorizontal, Send, Brain, Lightbulb
} from "lucide-react";
import { PendingRequestsBanner } from "@/components/shared/PendingRequestsBanner";
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
// LOCKED: Color System
const COLORS = {
  background: '#0B0F1A',
  backgroundSecondary: '#111827',
  surface: '#0F172A',
  border: '#1F2937',
  textPrimary: '#FFFFFF',
  textSecondary: '#BFC7D5',
  textMuted: '#6B7280',
  brand: '#2563EB',
  danger: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
};

// LOCKED: Box Style
const boxStyle: React.CSSProperties = {
  background: COLORS.surface,
  border: `1px solid ${COLORS.border}`,
  borderRadius: '14px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
};

// Mock Super Admins
const mockSuperAdmins = [
  { id: "SA-001", name: "James Wilson", status: "active", continents: ["Europe", "Asia"], created: "2024-01-15", lastActive: "2 min ago" },
  { id: "SA-002", name: "Maria Santos", status: "active", continents: ["Americas"], created: "2024-02-20", lastActive: "15 min ago" },
  { id: "SA-003", name: "Chen Wei", status: "locked", continents: ["Asia-Pacific"], created: "2024-03-10", lastActive: "2 hours ago" },
  { id: "SA-004", name: "Ahmed Hassan", status: "archived", continents: ["Middle East"], created: "2024-04-05", lastActive: "30 days ago" },
];

// System modules
const systemModules = [
  { id: "auth", name: "Authentication", status: "active", locked: false, lastModified: "2 hours ago" },
  { id: "finance", name: "Finance & Wallet", status: "active", locked: true, lastModified: "1 day ago" },
  { id: "support", name: "Support System", status: "active", locked: false, lastModified: "3 hours ago" },
  { id: "legal", name: "Legal & Compliance", status: "maintenance", locked: true, lastModified: "5 days ago" },
  { id: "marketing", name: "Marketing", status: "active", locked: false, lastModified: "12 hours ago" },
  { id: "developer", name: "Developer Portal", status: "active", locked: false, lastModified: "1 hour ago" },
];

// Blackbox entries (immutable audit)
const blackboxEntries = [
  { id: 1, action: "SYSTEM_LOCK", actor: "Boss", target: "Finance Module", timestamp: "2024-01-15 14:32:00", severity: "critical", hash: "0x7f8a..." },
  { id: 2, action: "ROLE_ARCHIVE", actor: "Boss", target: "SA-004", timestamp: "2024-01-14 09:15:00", severity: "high", hash: "0x3b2c..." },
  { id: 3, action: "PERMISSION_OVERRIDE", actor: "Boss", target: "Global Policies", timestamp: "2024-01-13 16:45:00", severity: "critical", hash: "0x9d4e..." },
  { id: 4, action: "EMERGENCY_SHUTDOWN", actor: "Boss", target: "API Gateway", timestamp: "2024-01-10 02:30:00", severity: "critical", hash: "0x1a5f..." },
];

// Pending final overrides
const pendingOverrides = [
  { id: 1, type: "Role Escalation", requestedBy: "Super Admin", target: "Country Admin Brazil", reason: "Emergency access needed", daysAgo: 1 },
  { id: 2, type: "Module Unlock", requestedBy: "Finance Manager", target: "Wallet System", reason: "Critical bug fix", daysAgo: 2 },
  { id: 3, type: "Archive Request", requestedBy: "Legal Manager", target: "User Data - ID#45678", reason: "GDPR compliance", daysAgo: 3 },
];

interface BossOwnerDashboardProps {
  activeNav?: string;
}

const BossOwnerDashboard = ({ activeNav }: BossOwnerDashboardProps) => {
  const [showLockDialog, setShowLockDialog] = useState(false);
  const [lockReason, setLockReason] = useState("");
  const [twoFactorConfirmed, setTwoFactorConfirmed] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedKpiForReject, setSelectedKpiForReject] = useState<string | null>(null);
  const { user } = useAuth();
  const { suggestions, acknowledgeSuggestion } = useCEOSuggestions();
  
  // Map sidebar navigation to internal tabs
  const getTabFromNav = (nav?: string): string => {
    const navToTabMap: Record<string, string> = {
      'dashboard': 'overview',
      'super-admins': 'super-admins',
      'roles': 'permissions',
      'modules': 'modules',
      'audit': 'blackbox',
      'security': 'security',
      'settings': 'overview',
    };
    return navToTabMap[nav || 'dashboard'] || 'overview';
  };
  
  const [activeTab, setActiveTab] = useState(getTabFromNav(activeNav));
  
  useEffect(() => {
    if (activeNav) {
      const mappedTab = getTabFromNav(activeNav);
      setActiveTab(mappedTab);
    }
  }, [activeNav]);

  // ===== ACTION HANDLERS WITH AUDIT LOGGING =====
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

  // KPI Action: Approve
  const handleKpiApprove = useCallback(async (label: string) => {
    await logAction('kpi_approve', label);
    toast.success(`✓ Approved: ${label}`, { description: 'Action logged to audit' });
  }, [logAction]);

  // KPI Action: Reject (requires reason)
  const handleKpiReject = useCallback(async (label: string, reason: string) => {
    if (!reason || reason.length < 5) {
      toast.error('Rejection reason required (min 5 chars)');
      return false;
    }
    await logAction('kpi_reject', label, { reason });
    toast.error(`✕ Rejected: ${label}`, { description: reason });
    return true;
  }, [logAction]);

  // KPI Action: Suspend
  const handleKpiSuspend = useCallback(async (label: string) => {
    await logAction('kpi_suspend', label);
    toast.warning(`⏸ Suspended: ${label}`, { description: 'Temporary hold applied' });
  }, [logAction]);

  // KPI Action: Review (opens detail)
  const handleKpiReview = useCallback(async (label: string, source: string) => {
    await logAction('kpi_review', label);
    toast.info(`👁 Review: ${label}`, { 
      description: `Source: ${source} | AI confidence: 82%`,
      duration: 5000
    });
  }, [logAction]);

  // KPI Action: Send Back
  const handleKpiSendBack = useCallback(async (label: string) => {
    await logAction('kpi_send_back', label, { note: 'Needs more data' });
    toast.info(`↩ Sent Back: ${label}`, { description: 'Returned to originator' });
  }, [logAction]);

  // Quick Control: Run/Resume
  const handleQuickRun = useCallback(async (label: string) => {
    await logAction('quick_run', label);
    toast.success(`▶ Running: ${label}`);
  }, [logAction]);

  // Quick Control: Pause
  const handleQuickPause = useCallback(async (label: string) => {
    await logAction('quick_pause', label);
    toast.warning(`⏸ Paused: ${label}`, { description: 'State preserved' });
  }, [logAction]);

  // Quick Control: Stop
  const handleQuickStop = useCallback(async (label: string) => {
    await logAction('quick_stop', label);
    toast.error(`⏹ Stopped: ${label}`, { description: 'Safe-state triggered' });
  }, [logAction]);

  // Quick Control: Restart
  const handleQuickRestart = useCallback(async (label: string) => {
    await logAction('quick_restart', label);
    toast.success(`🔁 Restarting: ${label}`, { description: 'Dependency check passed' });
  }, [logAction]);

  // Quick Control: Force Review
  const handleForceReview = useCallback(async (label: string) => {
    await logAction('force_review', label);
    toast.warning(`⚠ Force Review: ${label}`, { description: 'Sent to Approval Center' });
  }, [logAction]);

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

  const handleModuleLock = async (moduleId: string) => {
    await logAction('module_lock_toggle', moduleId);
    toast.success(`Module ${moduleId} lock toggled`);
  };

  const handleFreezeSystem = async () => {
    await logAction('system_freeze', 'SYSTEM');
    toast.error("⛔ SYSTEM FROZEN", {
      description: "All operations halted. Emergency protocol activated.",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return { background: 'rgba(239, 68, 68, 0.15)', color: COLORS.danger, border: 'rgba(239, 68, 68, 0.5)' };
      case "high": return { background: 'rgba(245, 158, 11, 0.15)', color: COLORS.warning, border: 'rgba(245, 158, 11, 0.5)' };
      case "medium": return { background: 'rgba(37, 99, 235, 0.15)', color: COLORS.brand, border: 'rgba(37, 99, 235, 0.5)' };
      default: return { background: 'rgba(107, 114, 128, 0.15)', color: COLORS.textMuted, border: 'rgba(107, 114, 128, 0.5)' };
    }
  };

  return (
    <div 
      className="min-h-full w-full overflow-auto"
      style={{ background: COLORS.background }}
    >
      {/* Pending Requests Banner - TOP PRIORITY */}
      <PendingRequestsBanner />
      
      <div className="p-6">
        {/* LOCKED: Premium Boss Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="flex items-center justify-center"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: `linear-gradient(135deg, ${COLORS.brand}, #1D4ED8)`,
                  boxShadow: `0 8px 24px rgba(37, 99, 235, 0.3)`
                }}
              >
                <Crown style={{ width: '32px', height: '32px', color: COLORS.textPrimary }} />
              </div>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 700, color: COLORS.textPrimary }}>
                  Boss / Owner
                </h1>
                <p style={{ fontSize: '14px', color: COLORS.brand }}>
                  Final Authority • Approve / Lock / Archive
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div 
                className="flex items-center gap-2 px-4 py-2"
                style={{
                  background: 'rgba(37, 99, 235, 0.15)',
                  border: `1px solid rgba(37, 99, 235, 0.5)`,
                  borderRadius: '8px'
                }}
              >
                <Crown style={{ width: '16px', height: '16px', color: COLORS.brand }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: COLORS.brand }}>
                  SUPREME AUTHORITY
                </span>
              </div>
              
              {/* Emergency Lockdown - LOCKED */}
              <Dialog open={showLockDialog} onOpenChange={setShowLockDialog}>
                <DialogTrigger asChild>
                  <Button 
                    className="gap-2"
                    style={{ 
                      background: COLORS.danger, 
                      color: COLORS.textPrimary,
                      height: '44px',
                      borderRadius: '12px'
                    }}
                  >
                    <Lock style={{ width: '16px', height: '16px' }} />
                    Emergency Lockdown
                  </Button>
                </DialogTrigger>
                <DialogContent style={{ background: COLORS.background, border: `1px solid ${COLORS.danger}30` }}>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2" style={{ color: COLORS.danger }}>
                      <AlertTriangle style={{ width: '20px', height: '20px' }} />
                      Activate Emergency Lockdown
                    </DialogTitle>
                    <DialogDescription style={{ color: COLORS.textSecondary }}>
                      This will suspend ALL system operations immediately.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div 
                      className="p-4 rounded-lg"
                      style={{ 
                        background: 'rgba(239, 68, 68, 0.1)', 
                        border: `1px solid rgba(239, 68, 68, 0.3)` 
                      }}
                    >
                      <p style={{ fontSize: '14px', color: COLORS.danger }}>
                        ⚠️ CRITICAL: Only Boss/Owner can unlock the system after activation.
                      </p>
                    </div>
                    <Textarea
                      placeholder="Enter detailed reason for lockdown (min 20 characters)..."
                      value={lockReason}
                      onChange={(e) => setLockReason(e.target.value)}
                      style={{ 
                        background: COLORS.backgroundSecondary, 
                        border: `1px solid ${COLORS.border}`,
                        color: COLORS.textPrimary
                      }}
                      rows={4}
                    />
                    <div 
                      className="flex items-center gap-3 p-3 rounded-lg"
                      style={{ background: COLORS.backgroundSecondary }}
                    >
                      <Fingerprint style={{ width: '20px', height: '20px', color: COLORS.brand }} />
                      <span style={{ fontSize: '14px', color: COLORS.textSecondary }}>2FA Verification Required</span>
                      <Switch
                        checked={twoFactorConfirmed}
                        onCheckedChange={setTwoFactorConfirmed}
                      />
                    </div>
                    <Button 
                      onClick={handleEmergencyLockdown}
                      className="w-full"
                      style={{ 
                        background: COLORS.danger, 
                        color: COLORS.textPrimary,
                        height: '44px',
                        borderRadius: '12px'
                      }}
                      disabled={lockReason.length < 20 || !twoFactorConfirmed}
                    >
                      <Lock style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                      Confirm Emergency Lockdown
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Freeze System - LOCKED */}
              <Button 
                onClick={handleFreezeSystem}
                className="gap-2"
                style={{
                  background: 'transparent',
                  border: `1px solid rgba(239, 68, 68, 0.5)`,
                  color: COLORS.danger,
                  height: '44px',
                  borderRadius: '12px'
                }}
              >
                <Power style={{ width: '16px', height: '16px' }} />
                Freeze System
              </Button>
            </div>
          </div>
        </motion.div>

        {/* LOCKED: ACTION-FOCUSED KPI GRID - 12 BOXES (4→3→2→1 columns) - HEIGHT 150px FIXED */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'SYSTEM HEALTH', value: '99.2%', status: 'ok', icon: Shield, iconBg: '#22C55E20', iconColor: '#22C55E', source: 'System', urgency: 'low' },
            { label: 'SERVER LOAD', value: '78%', status: 'warning', icon: Server, iconBg: '#F59E0B20', iconColor: '#F59E0B', source: 'AI-CORE', urgency: 'medium' },
            { label: 'CRITICAL ALERTS', value: '3', status: 'critical', icon: AlertOctagon, iconBg: '#EF444420', iconColor: '#EF4444', source: 'System', urgency: 'critical' },
            { label: 'PENDING APPROVALS', value: '7', status: 'action', icon: Gavel, iconBg: '#2563EB20', iconColor: '#2563EB', source: 'Multi', urgency: 'high' },
            { label: 'FAILED BUILDS', value: '2', status: 'critical', icon: Bug, iconBg: '#EF444420', iconColor: '#EF4444', source: 'CI/CD', urgency: 'high' },
            { label: 'DEPLOY WAITING', value: '4', status: 'action', icon: Rocket, iconBg: '#8B5CF620', iconColor: '#8B5CF6', source: 'DevOps', urgency: 'medium' },
            { label: 'PAYMENT PENDING', value: '₹2.4L', status: 'action', icon: CreditCard, iconBg: '#F59E0B20', iconColor: '#F59E0B', source: 'Finance', urgency: 'high' },
            { label: 'EXPIRY DUE', value: '5', status: 'warning', icon: CalendarClock, iconBg: '#F9731620', iconColor: '#F97316', source: 'System', urgency: 'medium' },
            { label: 'AI COST SPIKE', value: '+32%', status: 'warning', icon: Zap, iconBg: '#EAB30820', iconColor: '#EAB308', source: 'AI-CORE', urgency: 'medium' },
            { label: 'OPEN ISSUES', value: '12', status: 'action', icon: AlertTriangle, iconBg: '#F59E0B20', iconColor: '#F59E0B', source: 'Support', urgency: 'medium' },
            { label: 'SECURITY ALERTS', value: '1', status: 'critical', icon: ShieldAlert, iconBg: '#EF444420', iconColor: '#EF4444', source: 'Security', urgency: 'critical' },
            { label: 'SLA BREACH', value: '0', status: 'ok', icon: Scale, iconBg: '#22C55E20', iconColor: '#22C55E', source: 'Compliance', urgency: 'low' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            const urgencyColors: Record<string, string> = {
              critical: '#EF4444',
              high: '#F97316',
              medium: '#EAB308',
              low: '#22C55E'
            };
            return (
              <div 
                key={idx} 
                style={{
                  height: '150px',
                  minHeight: '150px',
                  maxHeight: '150px',
                  padding: '16px',
                  background: '#FFFFFF',
                  border: `1px solid ${stat.status === 'critical' ? '#FCA5A520' : '#E5E7EB'}`,
                  borderRadius: '14px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Top Row: Label + Icon */}
                <div className="flex items-start justify-between">
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <p style={{ 
                      fontSize: '10px', 
                      color: '#6B7280', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em', 
                      fontWeight: 500, 
                      lineHeight: '1',
                    }}>
                      {stat.label}
                    </p>
                    <p style={{ 
                      fontSize: '28px', 
                      fontWeight: 700, 
                      color: '#111827', 
                      marginTop: '4px', 
                      lineHeight: '1',
                    }}>
                      {stat.value}
                    </p>
                    <p style={{ fontSize: '9px', color: '#9CA3AF', marginTop: '4px' }}>
                      {stat.source} • <span style={{ color: urgencyColors[stat.urgency] }}>{stat.urgency.toUpperCase()}</span>
                    </p>
                  </div>
                  <div 
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: stat.iconBg
                    }}
                  >
                    <Icon style={{ width: '20px', height: '20px', color: stat.iconColor }} />
                  </div>
                </div>
                
                {/* Bottom Row: Action Buttons - FULL CONTROL SET */}
                <div className="flex items-center gap-1 mt-auto" style={{ height: '28px', overflow: 'hidden' }}>
                  {stat.status === 'action' || stat.status === 'critical' ? (
                    <>
                      {/* Approve */}
                      <button 
                        onClick={() => handleKpiApprove(stat.label)}
                        title="Approve"
                        style={{ 
                          height: '24px', 
                          padding: '0 6px', 
                          fontSize: '9px', 
                          fontWeight: 600,
                          background: '#22C55E15', 
                          color: '#22C55E', 
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        ✓
                      </button>
                      {/* Reject */}
                      <button 
                        onClick={() => {
                          setSelectedKpiForReject(stat.label);
                          setShowRejectDialog(true);
                        }}
                        title="Reject"
                        style={{ 
                          height: '24px', 
                          padding: '0 6px', 
                          fontSize: '9px', 
                          fontWeight: 600,
                          background: '#EF444415', 
                          color: '#EF4444', 
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        ✕
                      </button>
                      {/* Suspend */}
                      <button 
                        onClick={() => handleKpiSuspend(stat.label)}
                        title="Suspend"
                        style={{ 
                          height: '24px', 
                          padding: '0 6px', 
                          fontSize: '9px', 
                          fontWeight: 600,
                          background: '#F59E0B15', 
                          color: '#F59E0B', 
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        ⏸
                      </button>
                      {/* Review */}
                      <button 
                        onClick={() => handleKpiReview(stat.label, stat.source)}
                        title="Review Details"
                        style={{ 
                          height: '24px', 
                          padding: '0 6px', 
                          fontSize: '9px', 
                          fontWeight: 600,
                          background: '#2563EB15', 
                          color: '#2563EB', 
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        👁
                      </button>
                      {/* Send Back */}
                      <button 
                        onClick={() => handleKpiSendBack(stat.label)}
                        title="Send Back"
                        style={{ 
                          height: '24px', 
                          padding: '0 6px', 
                          fontSize: '9px', 
                          fontWeight: 600,
                          background: '#6B728015', 
                          color: '#6B7280', 
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        ↩
                      </button>
                    </>
                  ) : stat.status === 'warning' ? (
                    <>
                      {/* Run/Resume */}
                      <button 
                        onClick={() => handleQuickRun(stat.label)}
                        title="Run/Resume"
                        style={{ 
                          height: '24px', 
                          padding: '0 6px', 
                          fontSize: '9px', 
                          fontWeight: 600,
                          background: '#22C55E15', 
                          color: '#22C55E', 
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        ▶
                      </button>
                      {/* Pause */}
                      <button 
                        onClick={() => handleQuickPause(stat.label)}
                        title="Pause"
                        style={{ 
                          height: '24px', 
                          padding: '0 6px', 
                          fontSize: '9px', 
                          fontWeight: 600,
                          background: '#F59E0B15', 
                          color: '#F59E0B', 
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        ⏸
                      </button>
                      {/* Stop */}
                      <button 
                        onClick={() => handleQuickStop(stat.label)}
                        title="Stop"
                        style={{ 
                          height: '24px', 
                          padding: '0 6px', 
                          fontSize: '9px', 
                          fontWeight: 600,
                          background: '#EF444415', 
                          color: '#EF4444', 
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        ⏹
                      </button>
                      {/* Restart */}
                      <button 
                        onClick={() => handleQuickRestart(stat.label)}
                        title="Restart"
                        style={{ 
                          height: '24px', 
                          padding: '0 6px', 
                          fontSize: '9px', 
                          fontWeight: 600,
                          background: '#2563EB15', 
                          color: '#2563EB', 
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        🔁
                      </button>
                      {/* Force Review */}
                      <button 
                        onClick={() => handleForceReview(stat.label)}
                        title="Force Review"
                        style={{ 
                          height: '24px', 
                          padding: '0 6px', 
                          fontSize: '9px', 
                          fontWeight: 600,
                          background: '#8B5CF615', 
                          color: '#8B5CF6', 
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        ⚠
                      </button>
                    </>
                  ) : (
                    <span style={{ fontSize: '9px', color: '#22C55E', fontWeight: 500 }}>● OK</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* LOCKED: Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList 
            className="p-1"
            style={{ 
              background: COLORS.backgroundSecondary, 
              border: `1px solid ${COLORS.border}` 
            }}
          >
            {[
              { value: 'overview', label: 'Dashboard' },
              { value: 'super-admins', label: 'Super Admins' },
              { value: 'permissions', label: 'Roles & Permission Lock' },
              { value: 'modules', label: 'System Modules' },
              { value: 'blackbox', label: 'Audit & Blackbox' },
              { value: 'security', label: 'Security & Legal' },
            ].map(tab => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value}
                style={{ 
                  color: activeTab === tab.value ? COLORS.brand : COLORS.textSecondary,
                  background: activeTab === tab.value ? `${COLORS.brand}20` : 'transparent'
                }}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pending Overrides */}
              <div style={boxStyle}>
                <div className="p-4 flex items-center gap-2" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <Gavel style={{ width: '20px', height: '20px', color: COLORS.brand }} />
                  <span style={{ fontSize: '16px', fontWeight: 600, color: COLORS.textPrimary }}>
                    Final Override Queue
                  </span>
                </div>
                <ScrollArea className="h-64 p-4">
                  <div className="space-y-3">
                    {pendingOverrides.map((override) => (
                      <div 
                        key={override.id} 
                        className="p-3 rounded-lg"
                        style={{ background: COLORS.backgroundSecondary, border: `1px solid ${COLORS.brand}30` }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span 
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{ background: `${COLORS.brand}20`, color: COLORS.brand }}
                          >
                            {override.type}
                          </span>
                          <span style={{ fontSize: '12px', color: COLORS.textMuted }}>{override.daysAgo} days ago</span>
                        </div>
                        <p style={{ fontSize: '14px', color: COLORS.textPrimary, marginBottom: '4px' }}>
                          Target: {override.target}
                        </p>
                        <p style={{ fontSize: '12px', color: COLORS.textMuted }}>By: {override.requestedBy}</p>
                        <p style={{ fontSize: '12px', color: COLORS.textMuted, marginTop: '8px' }}>{override.reason}</p>
                        <div className="flex gap-2 mt-3">
                          <Button 
                            size="sm" 
                            style={{ 
                              background: COLORS.success, 
                              color: COLORS.textPrimary,
                              height: '32px',
                              borderRadius: '8px'
                            }}
                          >
                            <CheckCircle2 style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                            Approve
                          </Button>
                          <Button 
                            size="sm"
                            style={{ 
                              background: COLORS.danger, 
                              color: COLORS.textPrimary,
                              height: '32px',
                              borderRadius: '8px'
                            }}
                          >
                            <XCircle style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* CEO AI Recommendations */}
              <div style={boxStyle}>
                <div className="p-4 flex items-center gap-2" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <Brain style={{ width: '20px', height: '20px', color: '#8B5CF6' }} />
                  <span style={{ fontSize: '16px', fontWeight: 600, color: COLORS.textPrimary }}>
                    CEO AI Recommendations
                  </span>
                  <Badge style={{ marginLeft: 'auto', background: '#8B5CF620', color: '#8B5CF6' }}>
                    {suggestions.filter(s => s.status === 'pending').length} Pending
                  </Badge>
                </div>
                <ScrollArea className="h-64 p-4">
                  <div className="space-y-3">
                    {suggestions.filter(s => s.status === 'pending').slice(0, 4).map((suggestion) => (
                      <div 
                        key={suggestion.id} 
                        className="p-3 rounded-lg"
                        style={{ background: COLORS.backgroundSecondary, border: `1px solid #8B5CF630` }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge style={{ 
                            background: suggestion.impact === 'high' ? '#EF444420' : '#F59E0B20',
                            color: suggestion.impact === 'high' ? '#EF4444' : '#F59E0B'
                          }}>
                            {suggestion.impact} impact
                          </Badge>
                          <span style={{ fontSize: '11px', color: COLORS.textMuted }}>
                            {suggestion.confidence}% confidence
                          </span>
                        </div>
                        <p style={{ fontSize: '14px', color: COLORS.textPrimary, marginBottom: '4px', fontWeight: 500 }}>
                          {suggestion.title}
                        </p>
                        <p style={{ fontSize: '12px', color: COLORS.textMuted, marginBottom: '8px' }}>
                          {suggestion.description.slice(0, 80)}...
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => {
                              acknowledgeSuggestion(suggestion.id, 'approved');
                            }}
                            style={{ 
                              background: COLORS.success, 
                              color: COLORS.textPrimary,
                              height: '28px',
                              borderRadius: '6px',
                              fontSize: '11px'
                            }}
                          >
                            <CheckCircle2 style={{ width: '12px', height: '12px', marginRight: '4px' }} />
                            Approve
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => {
                              acknowledgeSuggestion(suggestion.id, 'rejected');
                            }}
                            style={{ 
                              background: 'transparent',
                              border: `1px solid ${COLORS.danger}50`,
                              color: COLORS.danger,
                              height: '28px',
                              borderRadius: '6px',
                              fontSize: '11px'
                            }}
                          >
                            <XCircle style={{ width: '12px', height: '12px', marginRight: '4px' }} />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                    {suggestions.filter(s => s.status === 'pending').length === 0 && (
                      <div className="text-center py-8">
                        <Lightbulb style={{ width: '32px', height: '32px', color: COLORS.textMuted, margin: '0 auto 8px' }} />
                        <p style={{ fontSize: '14px', color: COLORS.textMuted }}>No pending CEO recommendations</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Boss Powers */}
              <div style={boxStyle}>
                <div className="p-4 flex items-center gap-2" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <Crown style={{ width: '20px', height: '20px', color: COLORS.brand }} />
                  <span style={{ fontSize: '16px', fontWeight: 600, color: COLORS.textPrimary }}>
                    Boss Authority Powers
                  </span>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Users, label: "Super Admin Registry", desc: "Full control" },
                      { icon: Lock, label: "Role & Permission Lock", desc: "Final authority" },
                      { icon: Settings, label: "System Modules", desc: "Enable/disable" },
                      { icon: Database, label: "Audit & Blackbox", desc: "Full access" },
                      { icon: Shield, label: "Security Control", desc: "Emergency actions" },
                      { icon: Gavel, label: "Legal Control", desc: "Compliance" },
                      { icon: Power, label: "Emergency Lockdown", desc: "System freeze" },
                      { icon: RotateCcw, label: "Final Override", desc: "Logged + 2FA" },
                    ].map((power, i) => (
                      <div 
                        key={i} 
                        className="p-3 rounded-lg"
                        style={{ background: COLORS.backgroundSecondary, border: `1px solid ${COLORS.brand}30` }}
                      >
                        <power.icon style={{ width: '20px', height: '20px', color: COLORS.brand, marginBottom: '8px' }} />
                        <p style={{ fontSize: '14px', fontWeight: 500, color: COLORS.textPrimary }}>{power.label}</p>
                        <p style={{ fontSize: '12px', color: COLORS.textMuted }}>{power.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Super Admins Tab */}
          <TabsContent value="super-admins" className="space-y-6">
            <div style={boxStyle}>
              <div className="p-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ fontSize: '16px', fontWeight: 600, color: COLORS.textPrimary }}>Super Admin Registry</span>
                <Button 
                  style={{ 
                    background: COLORS.brand, 
                    color: COLORS.textPrimary,
                    height: '40px',
                    borderRadius: '10px'
                  }}
                >
                  <Users style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                  Create Super Admin
                </Button>
              </div>
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-3">
                  {mockSuperAdmins.map((admin) => (
                    <div 
                      key={admin.id} 
                      className="p-4 rounded-lg"
                      style={{ 
                        background: admin.status === "archived" ? `${COLORS.backgroundSecondary}80` : COLORS.backgroundSecondary,
                        border: `1px solid ${admin.status === "locked" ? `${COLORS.warning}50` : COLORS.border}`,
                        opacity: admin.status === "archived" ? 0.6 : 1
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div 
                            className="flex items-center justify-center"
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '50%',
                              background: `linear-gradient(135deg, ${COLORS.brand}, #7C3AED)`
                            }}
                          >
                            <span style={{ color: COLORS.textPrimary, fontWeight: 700 }}>
                              {admin.name.split(" ").map(n => n[0]).join("")}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 style={{ fontWeight: 500, color: COLORS.textPrimary }}>{admin.name}</h4>
                              <span 
                                className="px-2 py-1 rounded text-xs"
                                style={{
                                  background: admin.status === "active" ? `${COLORS.success}20` : 
                                             admin.status === "locked" ? `${COLORS.warning}20` : `${COLORS.textMuted}20`,
                                  color: admin.status === "active" ? COLORS.success : 
                                         admin.status === "locked" ? COLORS.warning : COLORS.textMuted
                                }}
                              >
                                {admin.status}
                              </span>
                            </div>
                            <p style={{ fontSize: '14px', color: COLORS.textMuted }}>{admin.id}</p>
                            <div className="flex gap-1 mt-1">
                              {admin.continents.map((c, i) => (
                                <span 
                                  key={i} 
                                  className="px-2 py-0.5 rounded text-xs"
                                  style={{ border: `1px solid ${COLORS.border}`, color: COLORS.textMuted }}
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {admin.status !== "archived" && (
                            <>
                              <Button size="sm" variant="ghost" style={{ color: COLORS.warning }}>
                                <Lock style={{ width: '16px', height: '16px' }} />
                              </Button>
                              <Button size="sm" variant="ghost" style={{ color: COLORS.textMuted }}>
                                <Archive style={{ width: '16px', height: '16px' }} />
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="ghost" style={{ color: COLORS.brand }}>
                            <Eye style={{ width: '16px', height: '16px' }} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-6">
            <div style={boxStyle}>
              <div className="p-4 flex items-center gap-2" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <Server style={{ width: '20px', height: '20px', color: COLORS.brand }} />
                <span style={{ fontSize: '16px', fontWeight: 600, color: COLORS.textPrimary }}>
                  System Modules Control
                </span>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {systemModules.map((module) => (
                    <div 
                      key={module.id} 
                      className="p-4 rounded-lg"
                      style={{ 
                        background: module.locked ? `${COLORS.warning}08` : COLORS.backgroundSecondary,
                        border: `1px solid ${module.locked ? `${COLORS.warning}50` : COLORS.border}`
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 style={{ fontWeight: 500, color: COLORS.textPrimary }}>{module.name}</h4>
                        {module.locked && <Lock style={{ width: '16px', height: '16px', color: COLORS.warning }} />}
                      </div>
                      <span 
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          background: module.status === "active" ? `${COLORS.success}20` : `${COLORS.warning}20`,
                          color: module.status === "active" ? COLORS.success : COLORS.warning
                        }}
                      >
                        {module.status}
                      </span>
                      <p style={{ fontSize: '12px', color: COLORS.textMuted, marginTop: '8px' }}>
                        Modified: {module.lastModified}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button 
                          size="sm"
                          onClick={() => handleModuleLock(module.id)}
                          style={{
                            background: module.locked ? COLORS.warning : 'transparent',
                            border: module.locked ? 'none' : `1px solid ${COLORS.border}`,
                            color: module.locked ? '#000' : COLORS.textPrimary,
                            height: '32px',
                            borderRadius: '8px'
                          }}
                        >
                          {module.locked ? "Unlock" : "Lock"}
                        </Button>
                        <Button 
                          size="sm"
                          disabled={!module.locked}
                          style={{
                            background: COLORS.danger,
                            color: COLORS.textPrimary,
                            height: '32px',
                            borderRadius: '8px',
                            opacity: module.locked ? 1 : 0.5
                          }}
                        >
                          Disable
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Blackbox Tab */}
          <TabsContent value="blackbox" className="space-y-6">
            <div style={boxStyle}>
              <div className="p-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <div className="flex items-center gap-2">
                  <Database style={{ width: '20px', height: '20px', color: '#A855F7' }} />
                  <span style={{ fontSize: '16px', fontWeight: 600, color: COLORS.textPrimary }}>
                    Immutable Blackbox Audit Log
                  </span>
                </div>
                <Button 
                  style={{
                    background: 'transparent',
                    border: `1px solid rgba(168, 85, 247, 0.5)`,
                    color: '#A855F7',
                    height: '40px',
                    borderRadius: '10px'
                  }}
                >
                  <Download style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                  Export Full Log
                </Button>
              </div>
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-3">
                  {blackboxEntries.map((entry) => {
                    const severityStyle = getSeverityColor(entry.severity);
                    return (
                      <div 
                        key={entry.id} 
                        className="p-4 rounded-lg font-mono"
                        style={{ background: COLORS.backgroundSecondary, border: `1px solid rgba(168, 85, 247, 0.3)` }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span 
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{ 
                              background: severityStyle.background, 
                              color: severityStyle.color,
                              border: `1px solid ${severityStyle.border}`
                            }}
                          >
                            {entry.severity.toUpperCase()}
                          </span>
                          <span style={{ fontSize: '12px', color: COLORS.textMuted }}>{entry.timestamp}</span>
                        </div>
                        <p style={{ fontSize: '14px', color: COLORS.textPrimary, marginBottom: '4px' }}>{entry.action}</p>
                        <p style={{ fontSize: '12px', color: COLORS.textMuted }}>Actor: {entry.actor} | Target: {entry.target}</p>
                        <p style={{ fontSize: '12px', color: '#A855F7', marginTop: '8px' }}>Hash: {entry.hash}</p>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-6">
            <div style={boxStyle}>
              <div className="p-4 flex items-center gap-2" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <Key style={{ width: '20px', height: '20px', color: COLORS.brand }} />
                <span style={{ fontSize: '16px', fontWeight: 600, color: COLORS.textPrimary }}>
                  Role & Permission Lock Matrix
                </span>
              </div>
              <div className="p-8 text-center">
                <Lock style={{ width: '64px', height: '64px', color: COLORS.brand, margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: COLORS.textPrimary, marginBottom: '8px' }}>
                  Permission Lock System
                </h3>
                <p style={{ fontSize: '14px', color: COLORS.textMuted, marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
                  Lock specific roles and permissions to prevent changes by Super Admins.
                  Only Boss/Owner can modify locked permissions.
                </p>
                <Button 
                  style={{
                    background: COLORS.brand,
                    color: COLORS.textPrimary,
                    height: '44px',
                    borderRadius: '12px'
                  }}
                >
                  <Lock style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                  Open Permission Matrix
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div style={boxStyle}>
                <div className="p-4 flex items-center gap-2" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <Shield style={{ width: '20px', height: '20px', color: COLORS.success }} />
                  <span style={{ fontSize: '16px', fontWeight: 600, color: COLORS.textPrimary }}>
                    Security Control Panel
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { label: "Two-Factor Authentication", status: true },
                    { label: "Biometric Login Required", status: true },
                    { label: "IP Whitelist Active", status: true },
                    { label: "Session Timeout (15 min)", status: true },
                    { label: "Audit Trail Encryption", status: true },
                  ].map((setting, i) => (
                    <div 
                      key={i} 
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ background: COLORS.backgroundSecondary }}
                    >
                      <span style={{ color: COLORS.textPrimary }}>{setting.label}</span>
                      <span 
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          background: setting.status ? `${COLORS.success}20` : `${COLORS.danger}20`,
                          color: setting.status ? COLORS.success : COLORS.danger
                        }}
                      >
                        {setting.status ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={boxStyle}>
                <div className="p-4 flex items-center gap-2" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <Gavel style={{ width: '20px', height: '20px', color: '#F43F5E' }} />
                  <span style={{ fontSize: '16px', fontWeight: 600, color: COLORS.textPrimary }}>
                    Legal Control
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { icon: FileText, label: "Terms of Service Management" },
                    { icon: FileText, label: "Privacy Policy Control" },
                    { icon: FileText, label: "Compliance Documents" },
                    { icon: Ban, label: "GDPR Data Requests" },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <Button 
                        key={i}
                        className="w-full justify-start"
                        style={{
                          background: COLORS.backgroundSecondary,
                          color: COLORS.textPrimary,
                          height: '44px',
                          borderRadius: '10px',
                          border: 'none'
                        }}
                      >
                        <Icon style={{ width: '16px', height: '16px', marginRight: '8px', color: COLORS.textMuted }} />
                        {item.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* LOCKED: Boss Authority Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <div 
            className="p-6 rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${COLORS.brand}15, ${COLORS.brand}08)`,
              border: `1px solid ${COLORS.brand}30`
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              <Crown style={{ width: '32px', height: '32px', color: COLORS.brand }} />
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: COLORS.textPrimary }}>Boss / Owner Authority</h3>
                <p style={{ fontSize: '14px', color: COLORS.brand }}>Final Authority Level</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Approve Everything",
                "Lock Any Module",
                "Archive Anything",
                "Emergency Lockdown",
                "Full Blackbox Access",
                "Override with 2FA",
                "Freeze System",
              ].map((power, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 style={{ width: '16px', height: '16px', color: COLORS.success }} />
                  <span style={{ fontSize: '14px', color: COLORS.textSecondary }}>{power}</span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <AlertTriangle style={{ width: '16px', height: '16px', color: COLORS.warning }} />
                <span style={{ fontSize: '14px', color: COLORS.warning }}>All Actions Logged</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reject Dialog - Mandatory Reason */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent style={{ background: COLORS.background, border: `1px solid ${COLORS.danger}30` }}>
            <DialogHeader>
              <DialogTitle style={{ color: COLORS.danger }}>
                ✕ Reject: {selectedKpiForReject}
              </DialogTitle>
              <DialogDescription style={{ color: COLORS.textSecondary }}>
                Provide a reason for rejection (min 5 characters). This action is logged.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter rejection reason..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                style={{ 
                  background: COLORS.backgroundSecondary, 
                  border: `1px solid ${COLORS.border}`,
                  color: COLORS.textPrimary
                }}
                rows={3}
              />
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    setShowRejectDialog(false);
                    setRejectReason("");
                    setSelectedKpiForReject(null);
                  }}
                  style={{ 
                    background: COLORS.backgroundSecondary, 
                    color: COLORS.textSecondary,
                    border: `1px solid ${COLORS.border}`,
                    flex: 1
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={async () => {
                    if (selectedKpiForReject) {
                      const success = await handleKpiReject(selectedKpiForReject, rejectReason);
                      if (success) {
                        setShowRejectDialog(false);
                        setRejectReason("");
                        setSelectedKpiForReject(null);
                      }
                    }
                  }}
                  disabled={rejectReason.length < 5}
                  style={{ 
                    background: COLORS.danger, 
                    color: COLORS.textPrimary,
                    flex: 1
                  }}
                >
                  Confirm Reject
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BossOwnerDashboard;

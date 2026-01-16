import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, AlertTriangle, Shield, Bell, Globe, 
  ChevronDown, Power, Loader2, Radio
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CommandBarProps {
  criticalAlerts: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  onScopeChange: (scope: string) => void;
  currentScope: string;
  onAlertsClick: () => void;
}

const scopes = [
  { id: 'global', label: 'Global', icon: Globe },
  { id: 'continent', label: 'Continent' },
  { id: 'country', label: 'Country' },
  { id: 'franchise', label: 'Franchise' },
];

export function CommandBar({ 
  criticalAlerts, 
  riskLevel, 
  onScopeChange, 
  currentScope,
  onAlertsClick 
}: CommandBarProps) {
  const [showLockdownDialog, setShowLockdownDialog] = useState(false);
  const [showFreezeDialog, setShowFreezeDialog] = useState(false);
  const [lockdownReason, setLockdownReason] = useState('');
  const [twoFactorConfirmed, setTwoFactorConfirmed] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [freezeTarget, setFreezeTarget] = useState<'full' | 'role' | 'module'>('full');

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'critical': return 'bg-red-600 text-white animate-pulse';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
    }
  };

  const handleEmergencyLockdown = async () => {
    if (!twoFactorConfirmed || lockdownReason.length < 10) return;

    setIsLocking(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('system_modules').update({ status: 'locked' }).neq('status', 'locked');
      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'emergency_lockdown',
        module: 'command-center',
        role: 'boss_owner' as any,
        meta_json: { reason: lockdownReason }
      });

      toast.success('🔒 EMERGENCY LOCKDOWN ACTIVATED');
      setShowLockdownDialog(false);
      setLockdownReason('');
      setTwoFactorConfirmed(false);
    } catch (error) {
      toast.error('Failed to activate lockdown');
    } finally {
      setIsLocking(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0a0a0f] border-b border-zinc-800/80"
      >
        <div className="h-full flex items-center justify-between px-4 max-w-[1920px] mx-auto">
          {/* Left: Emergency Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="destructive"
              size="sm"
              className="gap-1.5 bg-red-600 hover:bg-red-700 font-semibold"
              onClick={() => setShowLockdownDialog(true)}
            >
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Emergency Lockdown</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 border-red-500/50 text-red-400 hover:bg-red-500/10">
                  <Power className="w-4 h-4" />
                  <span className="hidden sm:inline">Freeze</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-900 border-zinc-700">
                <DropdownMenuItem className="text-red-400 cursor-pointer" onClick={() => { setFreezeTarget('full'); setShowFreezeDialog(true); }}>
                  <Power className="w-4 h-4 mr-2" /> Full System
                </DropdownMenuItem>
                <DropdownMenuItem className="text-amber-400 cursor-pointer" onClick={() => { setFreezeTarget('role'); setShowFreezeDialog(true); }}>
                  <Shield className="w-4 h-4 mr-2" /> Role-wise
                </DropdownMenuItem>
                <DropdownMenuItem className="text-blue-400 cursor-pointer" onClick={() => { setFreezeTarget('module'); setShowFreezeDialog(true); }}>
                  <Radio className="w-4 h-4 mr-2" /> Module-wise
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Center: Risk & Alerts */}
          <div className="flex items-center gap-4">
            <Badge className={`${getRiskColor()} px-3 py-1 text-xs font-bold uppercase`}>
              <AlertTriangle className="w-3 h-3 mr-1.5" />
              Risk: {riskLevel}
            </Badge>

            <Button variant="ghost" size="sm" className="gap-2 text-zinc-300 relative" onClick={onAlertsClick}>
              <Bell className="w-4 h-4" />
              <span className="font-mono">{criticalAlerts}</span>
              {criticalAlerts > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />}
            </Button>
          </div>

          {/* Right: Scope */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 border-zinc-700 text-zinc-300 min-w-[100px]">
                  <Globe className="w-4 h-4" />
                  {scopes.find(s => s.id === currentScope)?.label || 'Global'}
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-900 border-zinc-700">
                {scopes.map(scope => (
                  <DropdownMenuItem key={scope.id} className="cursor-pointer" onClick={() => onScopeChange(scope.id)}>
                    {scope.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/30">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs text-emerald-400 font-mono">LIVE</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Lockdown Dialog */}
      <Dialog open={showLockdownDialog} onOpenChange={setShowLockdownDialog}>
        <DialogContent className="bg-zinc-900 border-red-500/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              EMERGENCY LOCKDOWN
            </DialogTitle>
            <DialogDescription className="text-zinc-400">All system operations will be suspended.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea placeholder="Enter reason..." value={lockdownReason} onChange={(e) => setLockdownReason(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white" />
            <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
              <span className="text-sm text-zinc-300">2FA Verification</span>
              <Switch checked={twoFactorConfirmed} onCheckedChange={setTwoFactorConfirmed} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowLockdownDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleEmergencyLockdown} disabled={lockdownReason.length < 10 || !twoFactorConfirmed || isLocking}>
              {isLocking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Freeze Dialog */}
      <Dialog open={showFreezeDialog} onOpenChange={setShowFreezeDialog}>
        <DialogContent className="bg-zinc-900 border-amber-500/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">FREEZE: {freezeTarget.toUpperCase()}</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowFreezeDialog(false)}>Cancel</Button>
            <Button className="bg-amber-600 hover:bg-amber-700" onClick={() => { toast.error(`⛔ ${freezeTarget.toUpperCase()} FROZEN`); setShowFreezeDialog(false); }}>
              <Power className="w-4 h-4 mr-2" /> Freeze
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

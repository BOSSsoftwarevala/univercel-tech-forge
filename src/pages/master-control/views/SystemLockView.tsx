import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, Shield, AlertTriangle, Fingerprint, MapPin, Smartphone, Eye, Ban, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';

const SystemLockView = () => {
  const [systemLocked, setSystemLocked] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [readOnlyMode, setReadOnlyMode] = useState(false);
  const [zeroTrustMode, setZeroTrustMode] = useState(true);
  const [approvalRequired, setApprovalRequired] = useState(true);
  const [intrusionBlocking, setIntrusionBlocking] = useState(true);
  const [deviceBindingRequired, setDeviceBindingRequired] = useState(true);
  const [ipWhitelisting, setIpWhitelisting] = useState(false);
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [lockReason, setLockReason] = useState('');
  const [locking, setLocking] = useState(false);
  const [securityScore, setSecurityScore] = useState(0);

  useEffect(() => {
    let score = 0;
    if (zeroTrustMode) score += 20;
    if (approvalRequired) score += 20;
    if (intrusionBlocking) score += 15;
    if (deviceBindingRequired) score += 15;
    if (ipWhitelisting) score += 15;
    if (mfaEnforced) score += 15;
    setSecurityScore(score);
  }, [zeroTrustMode, approvalRequired, intrusionBlocking, deviceBindingRequired, ipWhitelisting, mfaEnforced]);

  const handleSystemLock = async () => {
    if (!systemLocked && lockReason.length < 20) {
      toast.error('Please provide a detailed reason (minimum 20 characters)');
      return;
    }
    setLocking(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('blackbox_events').insert({
        event_type: systemLocked ? 'system_unlocked' : 'system_locked',
        module_name: 'master_control',
        user_id: user?.id,
        is_sealed: true,
        risk_score: 100,
        metadata: { reason: lockReason, previous_state: systemLocked },
      });
      setSystemLocked(!systemLocked);
      setLockReason('');
      toast.success(systemLocked ? 'System unlocked' : 'SYSTEM LOCKED - Only Master Admin has access');
    } catch (err) {
      toast.error('Failed to change system lock state');
    } finally {
      setLocking(false);
    }
  };

  const getScoreColor = () => {
    if (securityScore >= 80) return 'text-emerald-400';
    if (securityScore >= 60) return 'text-green-400';
    if (securityScore >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Fortress Security Control</h2>
          <p className="text-sm text-gray-500">Impenetrable protection - No access without approval</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <Shield className={`w-5 h-5 ${getScoreColor()}`} />
          <div className={`text-lg font-bold ${getScoreColor()}`}>{securityScore}%</div>
        </div>
      </div>

      <Card className="p-6 bg-[#1a1a2e] border-gray-800/50">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${systemLocked ? 'bg-red-500/15 animate-pulse' : 'bg-green-500/15'}`}>
              {systemLocked ? <Ban className="w-8 h-8 text-red-400" /> : <CheckCircle2 className="w-8 h-8 text-green-400" />}
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">Status: {systemLocked ? 'FORTRESS LOCKED' : 'OPERATIONAL'}</h3>
              <p className="text-sm text-gray-500">{systemLocked ? 'All access blocked.' : 'Security enforced.'}</p>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className={systemLocked ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} disabled={locking}>
                {locking ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : systemLocked ? <Unlock className="w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                {systemLocked ? 'Unlock' : 'Lock System'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#12121a] border-gray-800">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">{systemLocked ? 'Unlock System' : 'Activate Fortress Lock'}</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">{systemLocked ? 'Restore normal operations.' : 'Lock entire system. All users will be logged out.'}</AlertDialogDescription>
              </AlertDialogHeader>
              {!systemLocked && (
                <div className="py-4">
                  <Label className="text-slate-300">Reason *</Label>
                  <Textarea value={lockReason} onChange={(e) => setLockReason(e.target.value)} placeholder="Reason for lockdown..." className="mt-2 bg-slate-800 border-slate-700" />
                </div>
              )}
              <AlertDialogFooter>
                <AlertDialogCancel className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSystemLock} className={systemLocked ? 'bg-green-500' : 'bg-red-500'} disabled={!systemLocked && lockReason.length < 20}>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>

      <Card className="p-6 bg-[#1a1a2e] border-gray-800/50">
        <h3 className="font-medium text-white mb-4">Security Level</h3>
        <Progress value={securityScore} className="h-3 mb-2" />
        <p className="text-xs text-slate-400">Enable all features for maximum protection.</p>
      </Card>

      <Card className="p-6 bg-[#1a1a2e] border-gray-800/50">
        <h3 className="font-medium text-white mb-4">Zero Trust Security</h3>
        <div className="space-y-4">
          {[
            { icon: Eye, label: 'Zero Trust Mode', desc: 'Verify every request', state: zeroTrustMode, setState: setZeroTrustMode },
            { icon: Lock, label: 'Approval Required', desc: 'Admin approval for actions', state: approvalRequired, setState: setApprovalRequired },
            { icon: Ban, label: 'Intrusion Blocking', desc: 'Block bots & hacking', state: intrusionBlocking, setState: setIntrusionBlocking },
            { icon: Fingerprint, label: 'Device Binding', desc: 'Approve devices', state: deviceBindingRequired, setState: setDeviceBindingRequired },
            { icon: MapPin, label: 'IP Whitelisting', desc: 'Approved IPs only', state: ipWhitelisting, setState: setIpWhitelisting },
            { icon: Smartphone, label: 'MFA Enforced', desc: 'Require 2FA', state: mfaEnforced, setState: setMfaEnforced },
          ].map(({ icon: Icon, label, desc, state, setState }) => (
            <div key={label} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-blue-400" />
                <div><Label className="text-white">{label}</Label><p className="text-xs text-gray-500">{desc}</p></div>
              </div>
              <Switch checked={state} onCheckedChange={(c) => { setState(c); toast.success(c ? `${label} enabled` : `${label} disabled`); }} />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-[#1a1a2e] border-gray-800/50">
        <h3 className="font-medium text-white mb-4">System Modes</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
            <div className="flex items-center gap-3"><Shield className="w-5 h-5 text-gray-400" /><div><Label className="text-white">Maintenance Mode</Label></div></div>
            <Switch checked={maintenanceMode} onCheckedChange={(c) => { setMaintenanceMode(c); toast.success(c ? 'Enabled' : 'Disabled'); }} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
            <div className="flex items-center gap-3"><AlertTriangle className="w-5 h-5 text-gray-400" /><div><Label className="text-white">Read-Only Mode</Label></div></div>
            <Switch checked={readOnlyMode} onCheckedChange={(c) => { setReadOnlyMode(c); toast.success(c ? 'Enabled' : 'Disabled'); }} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SystemLockView;

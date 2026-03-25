import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, Globe2, Users, Lock, Power, AlertTriangle,
  Shield, Radio, Pause
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const EmergencyActionsView = () => {
  const { user } = useAuth();
  const [globalFreezeActive, setGlobalFreezeActive] = useState(false);
  const [takeoverMode, setTakeoverMode] = useState(false);
  const [selectedContinent, setSelectedContinent] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: string;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ open: false, action: '', title: '', description: '', onConfirm: () => {} });

  const handleGlobalFreeze = async () => {
    setGlobalFreezeActive(!globalFreezeActive);
    
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      role: 'master',
      module: 'emergency-actions',
      action: globalFreezeActive ? 'global_unfreeze' : 'global_freeze',
      meta_json: {
        continent: selectedContinent,
        role: selectedRole,
        timestamp: new Date().toISOString()
      }
    });

    toast.success(globalFreezeActive ? 'Global freeze lifted' : 'Global freeze activated');
  };

  const handleRevokeAllSessions = async () => {
    const { data, error } = await supabase
      .from('user_roles')
      .update({ force_logged_out_at: new Date().toISOString(), force_logged_out_by: user?.id })
      .neq('role', 'master')
      .select();
    
    const count = data?.length || 0;

    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      role: 'master',
      module: 'emergency-actions',
      action: 'revoke_all_sessions',
      meta_json: { sessions_revoked: count }
    });

    toast.success(`All active sessions revoked (${count || 0} sessions)`);
  };

  const handleEmergencyTakeover = async () => {
    setTakeoverMode(!takeoverMode);
    
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      role: 'master',
      module: 'emergency-actions',
      action: takeoverMode ? 'takeover_end' : 'takeover_start',
      meta_json: { timestamp: new Date().toISOString() }
    });

    toast.success(takeoverMode ? 'Emergency takeover ended' : 'Emergency takeover mode activated');
  };

  const showConfirmation = (action: string, title: string, description: string, onConfirm: () => void) => {
    setConfirmDialog({ open: true, action, title, description, onConfirm });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Zap className="w-7 h-7 text-red-400" />
            Emergency & Instant Actions
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Global freeze, session revoke, emergency takeover mode
          </p>
        </div>
        <div className="flex items-center gap-2">
          {globalFreezeActive && (
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse gap-2">
              <Pause className="w-3 h-3" />
              FREEZE ACTIVE
            </Badge>
          )}
          {takeoverMode && (
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse gap-2">
              <Radio className="w-3 h-3" />
              TAKEOVER MODE
            </Badge>
          )}
        </div>
      </div>

      {/* Status Panel */}
      <Card className="p-6 bg-gradient-to-r from-red-500/10 via-[#0a0a12] to-amber-500/10 border-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
              globalFreezeActive ? 'bg-red-500/20' : takeoverMode ? 'bg-amber-500/20' : 'bg-green-500/20'
            }`}>
              {globalFreezeActive ? (
                <Lock className="w-8 h-8 text-red-400" />
              ) : takeoverMode ? (
                <Shield className="w-8 h-8 text-amber-400" />
              ) : (
                <Power className="w-8 h-8 text-green-400" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {globalFreezeActive ? 'SYSTEM FROZEN' : takeoverMode ? 'TAKEOVER ACTIVE' : 'SYSTEM OPERATIONAL'}
              </h3>
              <p className="text-sm text-gray-500">
                {globalFreezeActive ? 'All operations paused. Only Master Admin has control.' :
                 takeoverMode ? 'Emergency takeover mode. System-only control active.' :
                 'All systems running normally.'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Scope Selection */}
      <Card className="p-4 bg-[#0a0a12] border-gray-800/50">
        <h3 className="font-semibold text-white mb-4">Action Scope</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Continent</label>
            <Select value={selectedContinent} onValueChange={setSelectedContinent}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700">
                <SelectValue placeholder="Select continent" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Continents</SelectItem>
                <SelectItem value="asia">Asia</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="north_america">North America</SelectItem>
                <SelectItem value="south_america">South America</SelectItem>
                <SelectItem value="africa">Africa</SelectItem>
                <SelectItem value="oceania">Oceania</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Role</label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="franchise">Franchise</SelectItem>
                <SelectItem value="reseller">Reseller</SelectItem>
                <SelectItem value="support">Support</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Emergency Actions */}
      <div className="grid grid-cols-3 gap-4">
        {/* Global Freeze */}
        <Card className={`p-6 border-2 transition-all ${
          globalFreezeActive ? 'bg-red-500/10 border-red-500/50' : 'bg-[#0a0a12] border-gray-800/50 hover:border-red-500/30'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              globalFreezeActive ? 'bg-red-500/30' : 'bg-red-500/20'
            }`}>
              <Globe2 className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Global Freeze</h3>
              <p className="text-xs text-gray-500">Freeze by scope</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Instantly freeze all operations in selected scope. Users cannot perform any actions.
          </p>
          <Button
            onClick={() => showConfirmation(
              'freeze',
              globalFreezeActive ? 'Lift Global Freeze?' : 'Activate Global Freeze?',
              globalFreezeActive 
                ? 'This will restore normal operations for all users in the selected scope.'
                : 'This will immediately halt all operations. Only Master Admin will retain control.',
              handleGlobalFreeze
            )}
            className={`w-full gap-2 ${
              globalFreezeActive 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {globalFreezeActive ? (
              <>
                <Power className="w-4 h-4" />
                Unfreeze System
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Freeze Now
              </>
            )}
          </Button>
        </Card>

        {/* Revoke All Sessions */}
        <Card className="p-6 bg-[#0a0a12] border-gray-800/50 hover:border-amber-500/30 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Revoke Sessions</h3>
              <p className="text-xs text-gray-500">One-click logout</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Immediately revoke all active user sessions. Users will need to re-authenticate.
          </p>
          <Button
            onClick={() => showConfirmation(
              'revoke',
              'Revoke All Sessions?',
              'This will force logout all users except Master Admin. All active sessions will be terminated.',
              handleRevokeAllSessions
            )}
            className="w-full bg-amber-600 hover:bg-amber-700 gap-2"
          >
            <Users className="w-4 h-4" />
            Revoke All
          </Button>
        </Card>

        {/* Emergency Takeover */}
        <Card className={`p-6 border-2 transition-all ${
          takeoverMode ? 'bg-amber-500/10 border-amber-500/50' : 'bg-[#0a0a12] border-gray-800/50 hover:border-purple-500/30'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              takeoverMode ? 'bg-amber-500/30' : 'bg-purple-500/20'
            }`}>
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Emergency Takeover</h3>
              <p className="text-xs text-gray-500">System-only control</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Activate emergency takeover mode. All controls become system-only with Master oversight.
          </p>
          <Button
            onClick={() => showConfirmation(
              'takeover',
              takeoverMode ? 'End Takeover Mode?' : 'Activate Takeover Mode?',
              takeoverMode 
                ? 'This will return control to normal role-based access.'
                : 'This will activate emergency takeover mode. All actions will be system-controlled.',
              handleEmergencyTakeover
            )}
            className={`w-full gap-2 ${
              takeoverMode 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {takeoverMode ? (
              <>
                <Power className="w-4 h-4" />
                End Takeover
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Activate Takeover
              </>
            )}
          </Button>
        </Card>
      </div>

      {/* Warning */}
      <Card className="p-4 bg-red-500/5 border-red-500/20">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
          <div>
            <p className="text-sm text-red-400 font-medium">Critical Actions Warning</p>
            <p className="text-xs text-gray-500 mt-1">
              All emergency actions are logged permanently and cannot be undone. Use with extreme caution.
              These actions affect all users in the selected scope immediately.
            </p>
          </div>
        </div>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <AlertDialogContent className="bg-[#0a0a12] border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              {confirmDialog.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              {confirmDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-700 text-gray-400 hover:bg-gray-800 bg-transparent">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDialog.onConfirm}
              className={`${
                confirmDialog.action === 'freeze' ? 'bg-red-600 hover:bg-red-700' :
                confirmDialog.action === 'revoke' ? 'bg-amber-600 hover:bg-amber-700' :
                'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EmergencyActionsView;

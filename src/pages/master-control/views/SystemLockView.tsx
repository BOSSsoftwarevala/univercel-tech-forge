import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const SystemLockView = () => {
  const [systemLocked, setSystemLocked] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [readOnlyMode, setReadOnlyMode] = useState(false);

  const handleSystemLock = () => {
    setSystemLocked(!systemLocked);
    toast.success(systemLocked ? 'System unlocked' : 'System locked');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">System Lock</h2>
        <p className="text-sm text-gray-500">Master-level system controls and lockdown options</p>
      </div>

      <Card className="p-6 bg-[#1a1a2e] border-gray-800/50">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${systemLocked ? 'bg-red-500/15' : 'bg-green-500/15'}`}>
              {systemLocked ? <Lock className="w-8 h-8 text-red-400" /> : <Unlock className="w-8 h-8 text-green-400" />}
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">System Status: {systemLocked ? 'LOCKED' : 'OPERATIONAL'}</h3>
              <p className="text-sm text-gray-500">{systemLocked ? 'Only Master Admin has access.' : 'System is operational.'}</p>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className={systemLocked ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}>
                {systemLocked ? <><Unlock className="w-4 h-4 mr-2" />Unlock</> : <><Lock className="w-4 h-4 mr-2" />Lock</>}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#12121a] border-gray-800">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">{systemLocked ? 'Unlock System' : 'Lock System'}</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">{systemLocked ? 'Restore normal operations.' : 'Lock entire system. Only you will have access.'}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSystemLock} className={systemLocked ? 'bg-green-500' : 'bg-red-500'}>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>

      <Card className="p-6 bg-[#1a1a2e] border-gray-800/50">
        <h3 className="font-medium text-white mb-4">System Modes</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-400" />
              <div><Label className="text-white">Maintenance Mode</Label><p className="text-xs text-gray-500">Show maintenance message</p></div>
            </div>
            <Switch checked={maintenanceMode} onCheckedChange={(c) => { setMaintenanceMode(c); toast.success(c ? 'Enabled' : 'Disabled'); }} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-gray-400" />
              <div><Label className="text-white">Read-Only Mode</Label><p className="text-xs text-gray-500">Disable write operations</p></div>
            </div>
            <Switch checked={readOnlyMode} onCheckedChange={(c) => { setReadOnlyMode(c); toast.success(c ? 'Enabled' : 'Disabled'); }} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SystemLockView;

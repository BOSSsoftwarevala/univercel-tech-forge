import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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
        <h2 className="text-lg font-semibold text-zinc-800">System Lock</h2>
        <p className="text-sm text-zinc-500">Master-level system controls and lockdown options</p>
      </div>

      {/* Current Status */}
      <Card className="p-6 bg-white border-zinc-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded flex items-center justify-center ${
              systemLocked ? 'bg-zinc-800' : 'bg-zinc-100'
            }`}>
              {systemLocked ? (
                <Lock className="w-8 h-8 text-white" />
              ) : (
                <Unlock className="w-8 h-8 text-zinc-600" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-zinc-800 text-lg">
                System Status: {systemLocked ? 'LOCKED' : 'OPERATIONAL'}
              </h3>
              <p className="text-sm text-zinc-500">
                {systemLocked 
                  ? 'Only Master Admin has access. All operations suspended.'
                  : 'System is operational. All users have normal access.'}
              </p>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                className={systemLocked ? 'bg-zinc-600' : 'bg-zinc-800'}
              >
                {systemLocked ? (
                  <>
                    <Unlock className="w-4 h-4 mr-2" />
                    Unlock System
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Lock System
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white border-zinc-300">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-zinc-800">
                  {systemLocked ? 'Unlock System' : 'Lock System'}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-600">
                  {systemLocked 
                    ? 'This will restore normal operations for all users.'
                    : 'This will immediately lock the entire system. Only you will have access.'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-zinc-300">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSystemLock} className="bg-zinc-800">
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>

      {/* Mode Controls */}
      <Card className="p-6 bg-white border-zinc-300">
        <h3 className="font-medium text-zinc-800 mb-4">System Modes</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-zinc-500" />
              <div>
                <Label className="text-zinc-800">Maintenance Mode</Label>
                <p className="text-xs text-zinc-500">
                  Show maintenance message to all non-admin users
                </p>
              </div>
            </div>
            <Switch 
              checked={maintenanceMode}
              onCheckedChange={(checked) => {
                setMaintenanceMode(checked);
                toast.success(checked ? 'Maintenance mode enabled' : 'Maintenance mode disabled');
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-zinc-500" />
              <div>
                <Label className="text-zinc-800">Read-Only Mode</Label>
                <p className="text-xs text-zinc-500">
                  Disable all write operations across the system
                </p>
              </div>
            </div>
            <Switch 
              checked={readOnlyMode}
              onCheckedChange={(checked) => {
                setReadOnlyMode(checked);
                toast.success(checked ? 'Read-only mode enabled' : 'Read-only mode disabled');
              }}
            />
          </div>
        </div>
      </Card>

      {/* Warning */}
      <div className="p-4 bg-zinc-100 border border-zinc-300 rounded">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-zinc-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-zinc-800">Security Notice</p>
            <p className="text-xs text-zinc-600 mt-1">
              All system lock actions are permanently logged and cannot be deleted.
              Use these controls only in emergency situations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemLockView;

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, AlertTriangle, Shield, Snowflake, Lock, LogOut } from 'lucide-react';
import { toast } from 'sonner';
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

const SecurityMonitorView = () => {
  const handleFreezeContinent = () => {
    toast.success('Continent freeze initiated');
  };

  const handleGlobalLock = () => {
    toast.success('Global lock activated');
  };

  const handleEmergencyLogout = () => {
    toast.success('Emergency logout executed for all users');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-800">Security Monitor</h2>
        <p className="text-sm text-zinc-500">Real-time security status and emergency controls</p>
      </div>

      {/* Security Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-6 bg-white border-zinc-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-100 rounded flex items-center justify-center">
              <Users className="w-6 h-6 text-zinc-600" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Active Sessions</p>
              <p className="text-3xl font-bold text-zinc-800">247</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-zinc-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-100 rounded flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-zinc-600" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Failed Login Attempts</p>
              <p className="text-3xl font-bold text-zinc-800">18</p>
              <p className="text-xs text-zinc-500">Last 24 hours</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-zinc-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-100 rounded flex items-center justify-center">
              <Shield className="w-6 h-6 text-zinc-600" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Suspicious Activity</p>
              <p className="text-3xl font-bold text-zinc-800">3</p>
              <p className="text-xs text-zinc-500">Flagged for review</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Emergency Actions */}
      <Card className="p-6 bg-white border-zinc-300">
        <h3 className="font-medium text-zinc-800 mb-4">Emergency Actions</h3>
        <p className="text-sm text-zinc-500 mb-6">
          These actions are critical and will affect all users in the system.
        </p>

        <div className="flex gap-4">
          {/* Freeze Continent */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-zinc-400">
                <Snowflake className="w-4 h-4 mr-2" />
                Freeze Continent
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white border-zinc-300">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-zinc-800">Freeze Continent</AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-600">
                  This will temporarily disable all operations in the selected continent. 
                  Super Admin access will be limited to read-only.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-zinc-300">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleFreezeContinent} className="bg-zinc-800">
                  Confirm Freeze
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Global Lock */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-zinc-400">
                <Lock className="w-4 h-4 mr-2" />
                Global Lock
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white border-zinc-300">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-zinc-800">Global Lock</AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-600">
                  This will lock the entire system. Only Master Admin will have access.
                  All other users will be logged out and prevented from logging in.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-zinc-300">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleGlobalLock} className="bg-zinc-800">
                  Confirm Lock
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Emergency Logout All */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-zinc-400">
                <LogOut className="w-4 h-4 mr-2" />
                Emergency Logout All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white border-zinc-300">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-zinc-800">Emergency Logout All</AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-600">
                  This will immediately terminate all active sessions across the system.
                  All users including Super Admins will be logged out.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-zinc-300">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleEmergencyLogout} className="bg-zinc-800">
                  Confirm Logout All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>
    </div>
  );
};

export default SecurityMonitorView;

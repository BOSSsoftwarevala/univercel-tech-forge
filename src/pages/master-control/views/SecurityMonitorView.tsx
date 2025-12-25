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
        <h2 className="text-lg font-semibold text-white">Security Monitor</h2>
        <p className="text-sm text-gray-500">Real-time security status and emergency controls</p>
      </div>

      {/* Security Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-[#1a1a2e] border-gray-800/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Sessions</p>
              <p className="text-3xl font-bold text-white">247</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[#1a1a2e] border-gray-800/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Failed Login Attempts</p>
              <p className="text-3xl font-bold text-white">18</p>
              <p className="text-xs text-gray-500">Last 24 hours</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[#1a1a2e] border-gray-800/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Suspicious Activity</p>
              <p className="text-3xl font-bold text-white">3</p>
              <p className="text-xs text-gray-500">Flagged for review</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Emergency Actions */}
      <Card className="p-6 bg-[#1a1a2e] border-gray-800/50">
        <h3 className="font-medium text-white mb-4">Emergency Actions</h3>
        <p className="text-sm text-gray-500 mb-6">
          These actions are critical and will affect all users in the system.
        </p>

        <div className="flex flex-wrap gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent">
                <Snowflake className="w-4 h-4 mr-2" />
                Freeze Continent
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#12121a] border-gray-800">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Freeze Continent</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  This will temporarily disable all operations in the selected continent.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleFreezeContinent} className="bg-primary">Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 bg-transparent">
                <Lock className="w-4 h-4 mr-2" />
                Global Lock
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#12121a] border-gray-800">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Global Lock</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  This will lock the entire system. Only Master Admin will have access.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleGlobalLock} className="bg-amber-500 hover:bg-amber-600">Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent">
                <LogOut className="w-4 h-4 mr-2" />
                Emergency Logout All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#12121a] border-gray-800">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Emergency Logout All</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  This will immediately terminate all active sessions across the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleEmergencyLogout} className="bg-red-500 hover:bg-red-600">Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>
    </div>
  );
};

export default SecurityMonitorView;

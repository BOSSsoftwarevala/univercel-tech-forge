import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const GlobalRulesView = () => {
  const [financialLimit, setFinancialLimit] = useState('50000');
  const [escalationLevel, setEscalationLevel] = useState('3');
  const [autoLockFailedLogins, setAutoLockFailedLogins] = useState('5');
  const [autoLockIdleHours, setAutoLockIdleHours] = useState('24');

  const handleSave = () => {
    toast.success('Global rules saved successfully');
  };

  const handleRevert = () => {
    setFinancialLimit('50000');
    setEscalationLevel('3');
    setAutoLockFailedLogins('5');
    setAutoLockIdleHours('24');
    toast.info('Rules reverted to defaults');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-800">Global Rules</h2>
        <p className="text-sm text-zinc-500">Configure system-wide thresholds and policies</p>
      </div>

      {/* Approval Thresholds */}
      <Card className="p-6 bg-white border-zinc-300">
        <h3 className="font-medium text-zinc-800 mb-4">Approval Thresholds</h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-zinc-600">Financial Limit ($)</Label>
            <Input 
              type="number"
              value={financialLimit}
              onChange={(e) => setFinancialLimit(e.target.value)}
              className="bg-zinc-50 border-zinc-300"
            />
            <p className="text-xs text-zinc-500">
              Transactions above this require Master Admin approval
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-600">Escalation Level</Label>
            <Input 
              type="number"
              value={escalationLevel}
              onChange={(e) => setEscalationLevel(e.target.value)}
              className="bg-zinc-50 border-zinc-300"
              min="1"
              max="5"
            />
            <p className="text-xs text-zinc-500">
              Number of approval levels before reaching Master Admin
            </p>
          </div>
        </div>
      </Card>

      {/* Auto-Lock Conditions */}
      <Card className="p-6 bg-white border-zinc-300">
        <h3 className="font-medium text-zinc-800 mb-4">Auto-Lock Conditions</h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-zinc-600">Failed Login Attempts</Label>
            <Input 
              type="number"
              value={autoLockFailedLogins}
              onChange={(e) => setAutoLockFailedLogins(e.target.value)}
              className="bg-zinc-50 border-zinc-300"
              min="3"
              max="10"
            />
            <p className="text-xs text-zinc-500">
              Lock account after this many failed attempts
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-600">Idle Hours Before Lock</Label>
            <Input 
              type="number"
              value={autoLockIdleHours}
              onChange={(e) => setAutoLockIdleHours(e.target.value)}
              className="bg-zinc-50 border-zinc-300"
              min="1"
              max="72"
            />
            <p className="text-xs text-zinc-500">
              Lock session after this many hours of inactivity
            </p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button 
          onClick={handleSave}
          className="bg-zinc-800 text-white hover:bg-zinc-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Rules
        </Button>
        <Button 
          variant="outline"
          onClick={handleRevert}
          className="border-zinc-300"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Revert
        </Button>
      </div>
    </div>
  );
};

export default GlobalRulesView;

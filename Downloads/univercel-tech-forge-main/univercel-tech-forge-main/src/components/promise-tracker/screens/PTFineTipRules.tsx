import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DollarSign, 
  Gift, 
  Settings, 
  Eye, 
  Edit,
  Save,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

const fineRules = [
  { id: 'FR-001', name: 'Delayed Promise Fine', type: 'fixed', amount: '₹500', autoApply: true, status: 'active' },
  { id: 'FR-002', name: 'Broken Promise Penalty', type: 'percentage', amount: '5%', autoApply: true, status: 'active' },
  { id: 'FR-003', name: 'SLA Breach Fine', type: 'fixed', amount: '₹2,000', autoApply: false, status: 'active' },
  { id: 'FR-004', name: 'Critical Deadline Miss', type: 'fixed', amount: '₹5,000', autoApply: true, status: 'inactive' },
];

const tipRules = [
  { id: 'TR-001', name: 'Early Delivery Bonus', type: 'fixed', amount: '₹1,000', autoApply: false, status: 'active' },
  { id: 'TR-002', name: 'Client Satisfaction Tip', type: 'percentage', amount: '2%', autoApply: false, status: 'active' },
  { id: 'TR-003', name: 'Streak Bonus (5 on-time)', type: 'fixed', amount: '₹2,500', autoApply: true, status: 'active' },
];

export default function PTFineTipRules() {
  const [fineEnabled, setFineEnabled] = useState(true);
  const [tipEnabled, setTipEnabled] = useState(true);

  const logAction = (action: string, target: string) => {
    toast.success(`✓ ${action}`, {
      description: `${target} • ${new Date().toLocaleTimeString()}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 rounded-xl">
            <DollarSign className="h-8 w-8 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Fine & Tip Rules</h1>
            <p className="text-slate-400">Configure penalty and reward rules</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">RUNNING</Badge>
          <Button variant="outline" size="sm" onClick={() => logAction('Save All', 'Rules')}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Global Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div>
                <p className="font-medium text-white">Fine System</p>
                <p className="text-xs text-slate-400">Enable/disable all fine rules</p>
              </div>
            </div>
            <Switch checked={fineEnabled} onCheckedChange={setFineEnabled} />
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gift className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="font-medium text-white">Tip / Bonus System</p>
                <p className="text-xs text-slate-400">Enable/disable all tip rules</p>
              </div>
            </div>
            <Switch checked={tipEnabled} onCheckedChange={setTipEnabled} />
          </CardContent>
        </Card>
      </div>

      {/* Fine Rules */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            Fine Rules
            <Badge className="ml-auto bg-red-500/20 text-red-400">{fineRules.filter(r => r.status === 'active').length} Active</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {fineRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm text-slate-400">{rule.id}</span>
                  <div>
                    <p className="font-medium text-white">{rule.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{rule.type}</Badge>
                      <Badge className="bg-amber-500/20 text-amber-400 text-xs">{rule.amount}</Badge>
                      {rule.autoApply && (
                        <Badge className="bg-blue-500/20 text-blue-400 text-xs">Auto Apply</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={rule.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}>
                    {rule.status}
                  </Badge>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => logAction('View', rule.name)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => logAction('Edit', rule.name)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tip Rules */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Gift className="h-5 w-5 text-emerald-400" />
            Tip / Bonus Rules
            <Badge className="ml-auto bg-emerald-500/20 text-emerald-400">{tipRules.filter(r => r.status === 'active').length} Active</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tipRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm text-slate-400">{rule.id}</span>
                  <div>
                    <p className="font-medium text-white">{rule.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{rule.type}</Badge>
                      <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">{rule.amount}</Badge>
                      {rule.autoApply && (
                        <Badge className="bg-blue-500/20 text-blue-400 text-xs">Auto Apply</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={rule.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}>
                    {rule.status}
                  </Badge>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => logAction('View', rule.name)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => logAction('Edit', rule.name)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Badges Legend */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-slate-400">Status Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-amber-500/20 text-amber-400">Fine Applied</Badge>
            <Badge className="bg-emerald-500/20 text-emerald-400">Tip Released</Badge>
            <Badge className="bg-blue-500/20 text-blue-400">Auto Apply</Badge>
            <Badge className="bg-purple-500/20 text-purple-400">Manual Override</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

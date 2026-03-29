import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import type useAssistManagerSystem from '@/hooks/useAssistManagerSystem';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  PlusCircle,
  Save,
  X,
  Brain,
  Shield,
  Clock,
  User,
} from 'lucide-react';

interface AMCreateAssistProps {
  system: ReturnType<typeof useAssistManagerSystem>;
}

const scopeOptions = [
  { id: 'screen_view', label: 'Screen View' },
  { id: 'keyboard', label: 'Keyboard' },
  { id: 'mouse', label: 'Mouse' },
  { id: 'file_transfer', label: 'File Transfer' },
  { id: 'chat', label: 'Chat' },
  { id: 'voice', label: 'Voice' },
];

export function AMCreateAssist({ system }: AMCreateAssistProps) {
  const [aiAssistEnabled, setAiAssistEnabled] = useState(true);
  const [assistType, setAssistType] = useState<'support' | 'dev' | 'sales'>('support');
  const [targetRole, setTargetRole] = useState('client');
  const [targetUserId, setTargetUserId] = useState('');
  const [purpose, setPurpose] = useState('');
  const [permissionScope, setPermissionScope] = useState<string[]>(['screen_view', 'chat']);
  const [duration, setDuration] = useState('30');

  const toggleScope = (scope: string, checked: boolean) => {
    setPermissionScope((current) => checked ? [...new Set([...current, scope])] : current.filter((item) => item !== scope));
  };

  const submit = () => {
    system.createSession.mutate({
      assist_type: assistType,
      target_role: targetRole,
      target_user_id: targetUserId,
      purpose: aiAssistEnabled ? `${purpose}\nAI assist enabled` : purpose,
      permission_scope: permissionScope,
      max_duration_minutes: Number(duration),
    });
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Create New Assist</h1>
          <p className="text-muted-foreground">Initialize a new remote assist session</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                Session Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Assist Type */}
              <div className="space-y-2">
                <Label>Assist Type</Label>
                <Select value={assistType} onValueChange={(value) => setAssistType(value as 'support' | 'dev' | 'sales')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assist type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="dev">Dev</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="franchise">Franchise</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Target Role */}
              <div className="space-y-2">
                <Label>Target Role</Label>
                <Select value={targetRole} onValueChange={setTargetRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="franchise">Franchise</SelectItem>
                    <SelectItem value="reseller">Reseller</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Target User ID */}
              <div className="space-y-2">
                <Label>Target User ID (Masked)</Label>
                <Input placeholder="Paste the real target user UUID" value={targetUserId} onChange={(event) => setTargetUserId(event.target.value)} />
                <p className="text-xs text-muted-foreground">Use the real target user UUID. Logs and dashboards mask it automatically.</p>
              </div>

              {/* Session Purpose */}
              <div className="space-y-2">
                <Label>Session Purpose</Label>
                <Textarea 
                  placeholder="Describe the purpose of this assist session..."
                  rows={3}
                  value={purpose}
                  onChange={(event) => setPurpose(event.target.value)}
                />
              </div>

              {/* Permission Scope */}
              <div className="space-y-2">
                <Label>Permission Scope</Label>
                <div className="grid grid-cols-2 gap-3 rounded-lg border border-border p-4">
                  {scopeOptions.map((scope) => (
                    <label key={scope.id} className="flex items-center gap-2 text-sm">
                      <Checkbox checked={permissionScope.includes(scope.id)} onCheckedChange={(checked) => toggleScope(scope.id, checked === true)} />
                      <span>{scope.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration Limit */}
              <div className="space-y-2">
                <Label>Duration Limit</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 Minutes</SelectItem>
                    <SelectItem value="30">30 Minutes</SelectItem>
                    <SelectItem value="60">1 Hour</SelectItem>
                    <SelectItem value="120">2 Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* AI Assist Toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-medium">AI Assist Layer</p>
                    <p className="text-xs text-muted-foreground">Enable AI monitoring and suggestions</p>
                  </div>
                </div>
                <Switch 
                  checked={aiAssistEnabled}
                  onCheckedChange={setAiAssistEnabled}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button className="flex-1" onClick={submit} disabled={system.createSession.isPending || !targetUserId || !purpose || permissionScope.length === 0}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {system.createSession.isPending ? 'Submitting...' : 'Request Assist'}
                </Button>
                <Button variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button variant="ghost">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Side Panel */}
          <div className="space-y-4">
            {/* Security Notice */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Security Notice</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      All sessions require approval. No permanent access granted. 
                      Auto-disconnect on session end.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Duration Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Session Limits</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Max 2 hours per session. Auto-terminate after timeout. 
                      Extension requires re-approval.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Consent */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">User Consent</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Target user must explicitly consent before session can start. 
                      No silent access allowed.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

export default AMCreateAssist;

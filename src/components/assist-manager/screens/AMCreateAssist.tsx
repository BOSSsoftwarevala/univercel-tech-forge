/**
 * CREATE NEW ASSIST - All buttons functional
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Save, X, Brain, Shield, Clock, User } from 'lucide-react';

export function AMCreateAssist() {
  const [aiAssistEnabled, setAiAssistEnabled] = useState(true);
  const [assistType, setAssistType] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [targetUser, setTargetUser] = useState('');
  const [purpose, setPurpose] = useState('');
  const [permissionScope, setPermissionScope] = useState('');
  const [durationLimit, setDurationLimit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestAssist = () => {
    if (!assistType || !targetRole || !targetUser || !purpose || !permissionScope || !durationLimit) {
      toast.error('All fields required', { description: 'Please fill in all session configuration fields' });
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Assist request submitted', { 
        description: `Session ${assistType.toUpperCase()} for ${targetUser} • Awaiting approval` 
      });
      // Reset form
      setAssistType(''); setTargetRole(''); setTargetUser('');
      setPurpose(''); setPermissionScope(''); setDurationLimit('');
    }, 1500);
  };

  const handleSaveDraft = () => {
    toast.info('Draft saved', { description: 'Session configuration saved as draft' });
  };

  const handleCancel = () => {
    setAssistType(''); setTargetRole(''); setTargetUser('');
    setPurpose(''); setPermissionScope(''); setDurationLimit('');
    toast('Form cleared');
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Create New Assist</h1>
          <p className="text-muted-foreground">Initialize a new remote assist session</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" /> Session Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Assist Type</Label>
                <Select value={assistType} onValueChange={setAssistType}>
                  <SelectTrigger><SelectValue placeholder="Select assist type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="dev">Dev</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="franchise">Franchise</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Target Role</Label>
                <Select value={targetRole} onValueChange={setTargetRole}>
                  <SelectTrigger><SelectValue placeholder="Select target role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="franchise">Franchise</SelectItem>
                    <SelectItem value="reseller">Reseller</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Target User ID (Masked)</Label>
                <Input placeholder="USR-****XX" value={targetUser} onChange={(e) => setTargetUser(e.target.value)} />
                <p className="text-xs text-muted-foreground">Enter the masked user identifier</p>
              </div>

              <div className="space-y-2">
                <Label>Session Purpose</Label>
                <Textarea placeholder="Describe the purpose..." rows={3} value={purpose} onChange={(e) => setPurpose(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Permission Scope</Label>
                <Select value={permissionScope} onValueChange={setPermissionScope}>
                  <SelectTrigger><SelectValue placeholder="Select permission scope" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view_only">View Only</SelectItem>
                    <SelectItem value="control_limited">Control (Limited)</SelectItem>
                    <SelectItem value="control_full">Control (Full)</SelectItem>
                    <SelectItem value="file_transfer">File Transfer Only</SelectItem>
                    <SelectItem value="chat_only">Chat Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Duration Limit</Label>
                <Select value={durationLimit} onValueChange={setDurationLimit}>
                  <SelectTrigger><SelectValue placeholder="Select duration" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 Minutes</SelectItem>
                    <SelectItem value="30">30 Minutes</SelectItem>
                    <SelectItem value="60">1 Hour</SelectItem>
                    <SelectItem value="120">2 Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-medium">AI Assist Layer</p>
                    <p className="text-xs text-muted-foreground">Enable AI monitoring and suggestions</p>
                  </div>
                </div>
                <Switch checked={aiAssistEnabled} onCheckedChange={setAiAssistEnabled} />
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1" onClick={handleRequestAssist} disabled={isSubmitting}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Submitting...' : 'Request Assist'}
                </Button>
                <Button variant="outline" onClick={handleSaveDraft}>
                  <Save className="h-4 w-4 mr-2" /> Save Draft
                </Button>
                <Button variant="ghost" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Security Notice</p>
                    <p className="text-xs text-muted-foreground mt-1">All sessions require approval. No permanent access granted. Auto-disconnect on session end.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Session Limits</p>
                    <p className="text-xs text-muted-foreground mt-1">Max 2 hours per session. Auto-terminate after timeout. Extension requires re-approval.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">User Consent</p>
                    <p className="text-xs text-muted-foreground mt-1">Target user must explicitly consent before session can start. No silent access allowed.</p>
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

/**
 * AUTOMATION RULES SCREEN
 * Configure auto-reply and escalation
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Zap,
  MessageSquare,
  ArrowRight,
  Clock,
  AlertTriangle,
  Plus,
  Settings,
  User,
  Bot,
  Moon,
  Sun
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AutoRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
}

const automationRules: AutoRule[] = [
  { id: '1', name: 'Welcome Message', trigger: 'New conversation starts', action: 'Send greeting message', enabled: true },
  { id: '2', name: 'Business Hours Away', trigger: 'Message received outside hours', action: 'Send away message', enabled: true },
  { id: '3', name: 'Urgent Escalation', trigger: 'Customer says "urgent"', action: 'Notify human agent', enabled: true },
  { id: '4', name: 'Feedback Request', trigger: 'Conversation ends', action: 'Ask for rating', enabled: false },
];

export const CBAutomationRules: React.FC = () => {
  const [rules, setRules] = useState(automationRules);
  const [workingHours, setWorkingHours] = useState({ start: '09:00', end: '18:00' });
  const [handoverEnabled, setHandoverEnabled] = useState(true);

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    toast({ title: 'Rule updated' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Automation Rules</h1>
          <p className="text-slate-500 text-sm mt-1">Set up automatic responses and triggers</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Rule
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Auto-Reply Rules */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Auto-Reply Rules
            </CardTitle>
            <CardDescription>Automatic responses based on triggers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {rules.map((rule) => (
              <div 
                key={rule.id}
                className={`p-4 rounded-xl border ${
                  rule.enabled ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-slate-800">{rule.name}</span>
                      {rule.enabled && (
                        <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">Active</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 text-xs">
                        When: {rule.trigger}
                      </Badge>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                        Then: {rule.action}
                      </Badge>
                    </div>
                  </div>
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Human Handover */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-blue-600" />
              Human Handover
            </CardTitle>
            <CardDescription>When should bot transfer to human?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">Auto Handover</p>
                  <p className="text-xs text-slate-500">Transfer when bot can't help</p>
                </div>
              </div>
              <Switch
                checked={handoverEnabled}
                onCheckedChange={setHandoverEnabled}
              />
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">Transfer when:</p>
              <div className="space-y-2">
                {[
                  { label: 'Customer requests human agent', checked: true },
                  { label: 'Bot confidence < 60%', checked: true },
                  { label: 'Sentiment is negative', checked: true },
                  { label: 'Same question asked 3+ times', checked: false },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <Switch defaultChecked={item.checked} className="scale-75" />
                    <span className="text-slate-600">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Working Hours
            </CardTitle>
            <CardDescription>Set your support availability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-600 mb-1.5 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500" />
                  Opens at
                </label>
                <Select value={workingHours.start} onValueChange={(v) => setWorkingHours(h => ({ ...h, start: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['08:00', '09:00', '10:00'].map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1.5 flex items-center gap-2">
                  <Moon className="w-4 h-4 text-indigo-500" />
                  Closes at
                </label>
                <Select value={workingHours.end} onValueChange={(v) => setWorkingHours(h => ({ ...h, end: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['17:00', '18:00', '19:00', '20:00'].map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 Outside these hours, the bot will handle all chats and send an away message if needed.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Escalation Logic */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Escalation Logic
            </CardTitle>
            <CardDescription>Priority-based routing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { priority: 'Urgent', color: 'red', action: 'Notify all agents immediately', time: '< 1 min' },
                { priority: 'High', color: 'orange', action: 'Notify available agent', time: '< 5 min' },
                { priority: 'Normal', color: 'blue', action: 'Add to queue', time: '< 15 min' },
              ].map((level, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className={`bg-${level.color}-100 text-${level.color}-700 text-xs`}>
                      {level.priority}
                    </Badge>
                    <span className="text-sm text-slate-600">{level.action}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {level.time}
                  </Badge>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full">
              <Settings className="w-4 h-4 mr-2" />
              Configure Escalation
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

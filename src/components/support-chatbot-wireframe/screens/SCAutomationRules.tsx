/**
 * SCREEN 5: AUTOMATION RULES
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Zap, ArrowRight, Clock, User, AlertTriangle, MoreHorizontal, Edit, Trash2, Play, Pause } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const mockRules = [
  { id: '1', name: 'After-hours Auto Reply', trigger: 'time', condition: 'Outside 9AM-6PM', action: 'Send message', active: true },
  { id: '2', name: 'Escalate Angry Users', trigger: 'sentiment', condition: 'Negative sentiment', action: 'Handover to agent', active: true },
  { id: '3', name: 'VIP Customer Priority', trigger: 'keyword', condition: 'Contains "urgent"', action: 'High priority', active: false },
  { id: '4', name: 'No Response Timeout', trigger: 'no_response', condition: '5 min inactivity', action: 'Close chat', active: true },
];

const workingHours = [
  { day: 'Monday', start: '09:00', end: '18:00', active: true },
  { day: 'Tuesday', start: '09:00', end: '18:00', active: true },
  { day: 'Wednesday', start: '09:00', end: '18:00', active: true },
  { day: 'Thursday', start: '09:00', end: '18:00', active: true },
  { day: 'Friday', start: '09:00', end: '17:00', active: true },
  { day: 'Saturday', start: '10:00', end: '14:00', active: false },
  { day: 'Sunday', start: '00:00', end: '00:00', active: false },
];

export const SCAutomationRules: React.FC = () => {
  const [humanHandover, setHumanHandover] = useState(true);
  const [escalationLevel, setEscalationLevel] = useState('medium');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Automation</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure rules & triggers</p>
        </div>
        <Button className="gap-2" onClick={() => toast.success('Rule builder would open')}>
          <Plus className="w-4 h-4" />
          New Rule
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Automation Rules</CardTitle>
              <CardDescription>Trigger → Condition → Action</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockRules.map((rule, index) => (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${rule.active ? 'bg-card' : 'bg-muted/30'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${rule.active ? 'bg-emerald-500/10' : 'bg-muted'}`}>
                        <Zap className={`w-4 h-4 ${rule.active ? 'text-emerald-600' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{rule.name}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-[10px]">{rule.trigger}</Badge>
                          <ArrowRight className="w-3 h-3" />
                          <span>{rule.condition}</span>
                          <ArrowRight className="w-3 h-3" />
                          <span>{rule.action}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={rule.active} />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                          <DropdownMenuItem>
                            {rule.active ? <><Pause className="w-4 h-4 mr-2" />Disable</> : <><Play className="w-4 h-4 mr-2" />Enable</>}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Settings Panel */}
        <div className="space-y-4">
          {/* Human Handover */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4" />
                Human Handover
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Enable handover</span>
                <Switch checked={humanHandover} onCheckedChange={setHumanHandover} />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Escalation Level</label>
                <Select value={escalationLevel} onValueChange={setEscalationLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - After 3 failed responses</SelectItem>
                    <SelectItem value="medium">Medium - After 2 failed responses</SelectItem>
                    <SelectItem value="high">High - Immediate on request</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Working Hours */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Working Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {workingHours.map((day, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Switch checked={day.active} className="scale-75" />
                    <span className={day.active ? '' : 'text-muted-foreground'}>{day.day.slice(0, 3)}</span>
                  </div>
                  <span className={`text-xs ${day.active ? '' : 'text-muted-foreground'}`}>
                    {day.active ? `${day.start} - ${day.end}` : 'Closed'}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Escalation */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Escalation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Timeout (minutes)</label>
                <Input type="number" defaultValue="5" className="h-9" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Max bot retries</label>
                <Input type="number" defaultValue="3" className="h-9" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import type useAssistManagerSystem from '@/hooks/useAssistManagerSystem';
import {
  AlertOctagon,
  Square,
  Zap,
  Shield,
  AlertTriangle,
  Clock,
  User,
} from 'lucide-react';

interface AMEmergencyStopProps {
  system: ReturnType<typeof useAssistManagerSystem>;
}

const maskId = (value: string) => `${value.slice(0, 4)}****${value.slice(-2)}`;

export function AMEmergencyStop({ system }: AMEmergencyStopProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [reason, setReason] = useState('');

  const stopAll = async () => {
    await Promise.all(system.liveSessions.map((session) => system.emergencyStop.mutateAsync({
      session_id: session.session_id,
      reason: reason || 'Emergency stop all triggered from Assist Manager console',
    })));
    setShowConfirm(false);
    setReason('');
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-destructive">Emergency Stop</h1>
            <p className="text-muted-foreground">Critical session termination controls</p>
          </div>
          <Badge variant="destructive" className="gap-1">
            <AlertOctagon className="h-4 w-4" />
            Critical Actions
          </Badge>
        </div>

        {/* Emergency Stop All */}
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="p-6 text-center">
            <AlertOctagon className="h-16 w-16 mx-auto text-destructive mb-4" />
            <h2 className="text-xl font-bold text-destructive mb-2">EMERGENCY STOP ALL SESSIONS</h2>
            <p className="text-sm text-muted-foreground mb-4">
              This will immediately terminate ALL active assist sessions. 
              All connections will be dropped, tokens revoked, and caches cleared.
            </p>
            
            {!showConfirm ? (
              <Button 
                variant="destructive" 
                size="lg"
                onClick={() => setShowConfirm(true)}
              >
                <Square className="h-5 w-5 mr-2" />
                STOP ALL SESSIONS
              </Button>
            ) : (
              <div className="space-y-4">
                <Textarea 
                  placeholder="Enter reason for emergency stop (required)..."
                  className="max-w-md mx-auto"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                />
                <div className="flex gap-3 justify-center">
                  <Button 
                    variant="destructive" 
                    size="lg"
                    disabled={!reason || system.emergencyStop.isPending}
                    onClick={stopAll}
                  >
                    <Zap className="h-5 w-5 mr-2" />
                    CONFIRM STOP ALL
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => setShowConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Individual Session Stops */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Stop Individual Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {system.liveSessions.map((session) => (
                <div 
                  key={session.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    session.ai_risk_score >= 75 ? 'border-amber-500/50 bg-amber-500/5' : 'bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="font-mono text-sm font-medium">{session.session_id}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      {maskId(session.target_user_id)} ↔ {maskId(session.agent_id)}
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3" />
                      {session.max_duration_minutes} min cap
                    </div>
                    <Badge 
                      variant={session.ai_risk_score >= 75 ? 'default' : 'secondary'}
                      className={session.ai_risk_score >= 75 ? 'bg-amber-500' : ''}
                    >
                      {session.ai_risk_score >= 75 ? 'high risk' : 'low risk'}
                    </Badge>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => system.emergencyStop.mutate({ session_id: session.session_id, reason: 'Single-session emergency stop' })}>
                    <Square className="h-4 w-4 mr-1" />
                    Stop
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Emergency Stops */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Recent Emergency Stops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(system.dashboard?.recentAudit || []).filter((entry) => entry.action.includes('emergency') || entry.action.includes('ended')).slice(0, 8).map((stop) => (
                <div 
                  key={stop.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <AlertOctagon className="h-4 w-4 text-destructive" />
                    <div>
                      <p className="font-mono text-xs">{stop.session_id || 'Global'}</p>
                      <p className="text-xs text-muted-foreground">{stop.action.replaceAll('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <p className="text-muted-foreground">{new Date(stop.timestamp).toLocaleString()}</p>
                    <p>by {stop.role || 'system'}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Auto Behaviors */}
        <Card className="border-green-500/50 bg-green-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-green-500" />
              Session End Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Auto Disconnect - Connection terminated immediately
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Auto Clear Cache - All session data cleared
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Auto Revoke Token - Session token invalidated
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Auto Log Summary - Session recorded to audit
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}

export default AMEmergencyStop;

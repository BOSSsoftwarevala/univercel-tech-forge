/**
 * EMERGENCY STOP
 * Critical session termination controls
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertOctagon,
  Square,
  Zap,
  Shield,
  AlertTriangle,
  Clock,
  User,
} from 'lucide-react';

const ACTIVE_SESSIONS_FOR_STOP = [
  { id: 'SVL-A8K2M9', user: 'USR-****42', agent: 'AGT-****15', duration: '12:34', risk: 'low' },
  { id: 'SVL-C9X4L6', user: 'USR-****89', agent: 'AGT-****08', duration: '05:21', risk: 'medium' },
  { id: 'SVL-E7T3R2', user: 'USR-****56', agent: 'AGT-****19', duration: '18:45', risk: 'low' },
];

const RECENT_STOPS = [
  { id: 'STOP-001', sessionId: 'SVL-X2K8M4', reason: 'Security violation detected', time: '2 hours ago', by: 'System' },
  { id: 'STOP-002', sessionId: 'SVL-Y5N3P7', reason: 'Manual termination', time: '5 hours ago', by: 'AGT-****22' },
];

export function AMEmergencyStop() {
  const [showConfirm, setShowConfirm] = useState(false);

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
                />
                <div className="flex gap-3 justify-center">
                  <Button 
                    variant="destructive" 
                    size="lg"
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
              {ACTIVE_SESSIONS_FOR_STOP.map((session) => (
                <div 
                  key={session.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    session.risk === 'medium' ? 'border-amber-500/50 bg-amber-500/5' : 'bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="font-mono text-sm font-medium">{session.id}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      {session.user} ↔ {session.agent}
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3" />
                      {session.duration}
                    </div>
                    <Badge 
                      variant={session.risk === 'medium' ? 'default' : 'secondary'}
                      className={session.risk === 'medium' ? 'bg-amber-500' : ''}
                    >
                      {session.risk} risk
                    </Badge>
                  </div>
                  <Button variant="destructive" size="sm">
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
              {RECENT_STOPS.map((stop) => (
                <div 
                  key={stop.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <AlertOctagon className="h-4 w-4 text-destructive" />
                    <div>
                      <p className="font-mono text-xs">{stop.sessionId}</p>
                      <p className="text-xs text-muted-foreground">{stop.reason}</p>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <p className="text-muted-foreground">{stop.time}</p>
                    <p>by {stop.by}</p>
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

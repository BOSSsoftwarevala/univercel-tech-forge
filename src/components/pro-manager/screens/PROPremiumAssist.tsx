/**
 * PREMIUM ASSIST
 * Live Assist Session • Permission-Based Access • No File Copy • No Screen Capture • Full Session Log
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Handshake, Play, Pause, Square, ArrowUp, Shield } from 'lucide-react';
import { toast } from 'sonner';

const mockSessions = [
  { id: 'ASSIST-001', user: 'PRO-***21', duration: '15 min', mode: 'View Only', status: 'active' },
  { id: 'ASSIST-002', user: 'PRO-***45', duration: '8 min', mode: 'Guided', status: 'paused' },
  { id: 'ASSIST-003', user: 'PRO-***78', duration: '45 min', mode: 'Full Control', status: 'ended' },
];

export const PROPremiumAssist: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Premium Assist</h1>
        <p className="text-muted-foreground">Live support sessions with premium users</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-amber-500/50">
          <CardContent className="p-4 flex items-center gap-3">
            <Shield className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-sm font-medium text-foreground">No File Copy</p>
              <p className="text-xs text-muted-foreground">Disabled for security</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-500/50">
          <CardContent className="p-4 flex items-center gap-3">
            <Shield className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-sm font-medium text-foreground">No Screen Capture</p>
              <p className="text-xs text-muted-foreground">Disabled for security</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-500/50">
          <CardContent className="p-4 flex items-center gap-3">
            <Shield className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm font-medium text-foreground">Full Session Log</p>
              <p className="text-xs text-muted-foreground">All actions recorded</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Active Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockSessions.map((session, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <Handshake className="h-5 w-5 text-primary" />
                  <span className="font-mono text-sm text-foreground">{session.id}</span>
                  <span className="text-sm text-foreground">{session.user}</span>
                  <Badge variant="outline">{session.mode}</Badge>
                  <span className="text-xs text-muted-foreground">{session.duration}</span>
                  <Badge className={
                    session.status === 'active' ? 'bg-green-500/20 text-green-500' :
                    session.status === 'paused' ? 'bg-amber-500/20 text-amber-500' :
                    'bg-gray-500/20 text-gray-500'
                  }>
                    {session.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => toast.success('Session started')}>
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.info('Session paused')}>
                    <Pause className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.info('Session ended')}>
                    <Square className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.warning('Session escalated')}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PROPremiumAssist;

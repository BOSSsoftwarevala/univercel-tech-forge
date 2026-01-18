/**
 * BLOCKED USERS
 * Security violations
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldOff, AlertTriangle, Clock, Ban } from 'lucide-react';

const blockedUsers = [
  { id: 'USER-X1Y2', reason: 'Attempted to share sensitive data', blockedAt: '2 hours ago', severity: 'high' },
  { id: 'USER-Z3A4', reason: 'Spam messages detected', blockedAt: '1 day ago', severity: 'medium' },
  { id: 'USER-B5C6', reason: 'Policy violation - external links', blockedAt: '3 days ago', severity: 'low' },
];

const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case 'high':
      return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />High</Badge>;
    case 'medium':
      return <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">Medium</Badge>;
    case 'low':
      return <Badge variant="secondary">Low</Badge>;
    default:
      return <Badge>{severity}</Badge>;
  }
};

export const ICBBlockedUsers: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Blocked Users</h1>
        <p className="text-muted-foreground">Users blocked due to security violations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldOff className="h-5 w-5 text-red-500" />
            Blocked List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {blockedUsers.map((user) => (
              <div 
                key={user.id}
                className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Ban className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-mono font-medium">{user.id}</p>
                    <p className="text-sm text-muted-foreground">{user.reason}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" />
                      <span>Blocked {user.blockedAt}</span>
                    </div>
                  </div>
                </div>
                {getSeverityBadge(user.severity)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ICBBlockedUsers;

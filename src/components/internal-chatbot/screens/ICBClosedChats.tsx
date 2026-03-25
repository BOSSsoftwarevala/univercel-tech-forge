/**
 * CLOSED CHATS
 * Completed chat history
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { XCircle, Clock, CheckCircle, User } from 'lucide-react';

const closedChats = [
  { id: 'CHAT-001', user: 'USER-A1B2', subject: 'Password reset', duration: '5 min', closedAt: '1 hour ago', resolution: 'resolved' },
  { id: 'CHAT-002', user: 'USER-C3D4', subject: 'Billing query', duration: '12 min', closedAt: '2 hours ago', resolution: 'resolved' },
  { id: 'CHAT-003', user: 'USER-E5F6', subject: 'Feature request', duration: '8 min', closedAt: '3 hours ago', resolution: 'converted' },
  { id: 'CHAT-004', user: 'USER-G7H8', subject: 'Technical issue', duration: '25 min', closedAt: '5 hours ago', resolution: 'escalated' },
  { id: 'CHAT-005', user: 'USER-I9J0', subject: 'General inquiry', duration: '3 min', closedAt: '1 day ago', resolution: 'resolved' },
];

const getResolutionBadge = (resolution: string) => {
  switch (resolution) {
    case 'resolved':
      return <Badge className="bg-green-500/20 text-green-500 border-green-500/30"><CheckCircle className="h-3 w-3 mr-1" />Resolved</Badge>;
    case 'converted':
      return <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">Converted to Ticket</Badge>;
    case 'escalated':
      return <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">Escalated</Badge>;
    default:
      return <Badge variant="secondary">{resolution}</Badge>;
  }
};

export const ICBClosedChats: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Closed Chats</h1>
        <p className="text-muted-foreground">Completed chat sessions history</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <XCircle className="h-5 w-5 text-muted-foreground" />
            Chat History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {closedChats.map((chat) => (
              <div 
                key={chat.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm">{chat.id}</span>
                  <div>
                    <p className="font-medium">{chat.subject}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{chat.user}</span>
                      <span>•</span>
                      <Clock className="h-3 w-3" />
                      <span>{chat.duration}</span>
                      <span>•</span>
                      <span>{chat.closedAt}</span>
                    </div>
                  </div>
                </div>
                {getResolutionBadge(chat.resolution)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ICBClosedChats;

/**
 * APPROVED CHATS
 * Chats ready to start
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const approvedChats = [
  { id: 'CHAT-001', user: 'USER-A1B2', type: 'Support', approvedBy: 'MGR-001', approvedAt: '5 min ago' },
  { id: 'CHAT-002', user: 'USER-C3D4', type: 'Dev', approvedBy: 'MGR-002', approvedAt: '15 min ago' },
  { id: 'CHAT-003', user: 'USER-E5F6', type: 'Sales', approvedBy: 'MGR-001', approvedAt: '30 min ago' },
];

export const ICBApprovedChats: React.FC = () => {
  const handleStartChat = (id: string) => {
    toast.success(`Starting chat session ${id}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Approved Chats</h1>
        <p className="text-muted-foreground">Chats approved and ready to start</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Ready to Start
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {approvedChats.map((chat) => (
              <div 
                key={chat.id}
                className="flex items-center justify-between p-4 bg-green-500/5 border border-green-500/20 rounded-lg"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-sm font-medium">{chat.id}</span>
                    <Badge variant="outline" className="text-green-500 border-green-500">Approved</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{chat.user}</span>
                    <span>•</span>
                    <span>{chat.type}</span>
                    <span>•</span>
                    <Clock className="h-3 w-3" />
                    <span>{chat.approvedAt}</span>
                  </div>
                </div>
                <Button onClick={() => handleStartChat(chat.id)}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start Chat
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ICBApprovedChats;

/**
 * ACTIVE CHATS
 * Live chat sessions
 * Masked User ID • Role Badge • Auto Translation
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  Pause, 
  XCircle, 
  ArrowUpCircle, 
  FileText, 
  Ticket,
  Mic,
  Image
} from 'lucide-react';
import { toast } from 'sonner';

const activeChats = [
  { id: 'CHAT-001', user: 'USER-A1B2', role: 'Support', unread: 2 },
  { id: 'CHAT-002', user: 'USER-C3D4', role: 'Dev', unread: 0 },
  { id: 'CHAT-003', user: 'USER-E5F6', role: 'Sales', unread: 5 },
];

const chatMessages = [
  { id: 1, sender: 'USER-A1B2', text: 'I need help with my account', time: '10:30 AM', isMine: false },
  { id: 2, sender: 'SUPPORT-001', text: 'Sure, I can help you with that. What seems to be the issue?', time: '10:31 AM', isMine: true },
  { id: 3, sender: 'USER-A1B2', text: 'I cannot access my dashboard', time: '10:32 AM', isMine: false },
  { id: 4, sender: 'SUPPORT-001', text: 'Let me check your account status...', time: '10:33 AM', isMine: true },
];

export const ICBActiveChats: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState(activeChats[0]);
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;
    toast.success('Message sent');
    setMessage('');
  };

  const handlePause = () => toast.info('Chat paused');
  const handleEnd = () => toast.warning('Chat ended');
  const handleEscalate = () => toast.info('Chat escalated to next level');
  const handleConvertTask = () => toast.success('Converted to task');
  const handleConvertTicket = () => toast.success('Converted to ticket');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Active Chats</h1>
        <p className="text-muted-foreground">Manage live chat sessions</p>
      </div>

      <div className="grid grid-cols-12 gap-4 h-[600px]">
        {/* Chat List */}
        <Card className="col-span-4">
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Active Sessions ({activeChats.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-2">
              {activeChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedChat.id === chat.id ? 'bg-primary/10 border border-primary/30' : 'bg-muted/50 hover:bg-muted'
                  }`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs">{chat.user}</span>
                    {chat.unread > 0 && (
                      <Badge variant="destructive" className="text-xs h-5 w-5 p-0 flex items-center justify-center rounded-full">
                        {chat.unread}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{chat.role}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="col-span-8 flex flex-col">
          <CardHeader className="py-3 border-b flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-4 w-4 text-green-500" />
              <span className="font-mono text-sm">{selectedChat.user}</span>
              <Badge variant="outline">{selectedChat.role}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handlePause}>
                <Pause className="h-3 w-3 mr-1" />
                Pause
              </Button>
              <Button size="sm" variant="outline" onClick={handleEscalate}>
                <ArrowUpCircle className="h-3 w-3 mr-1" />
                Escalate
              </Button>
              <Button size="sm" variant="outline" onClick={handleConvertTask}>
                <FileText className="h-3 w-3 mr-1" />
                Task
              </Button>
              <Button size="sm" variant="outline" onClick={handleConvertTicket}>
                <Ticket className="h-3 w-3 mr-1" />
                Ticket
              </Button>
              <Button size="sm" variant="destructive" onClick={handleEnd}>
                <XCircle className="h-3 w-3 mr-1" />
                End
              </Button>
            </div>
          </CardHeader>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] p-3 rounded-lg ${
                    msg.isMine ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-3 border-t">
            <div className="flex items-center gap-2">
              <Button size="icon" variant="outline">
                <Mic className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline">
                <Image className="h-4 w-4" />
              </Button>
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ICBActiveChats;

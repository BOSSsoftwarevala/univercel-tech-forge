import React, { useState } from 'react';
import { X, Send, Mic, Globe, ShieldAlert, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface InternalChatDockProps {
  open: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

const mockMessages = [
  { id: 1, sender: 'DEV***042', role: 'developer', message: 'Task #1234 completed. Ready for review.', time: '2 min ago' },
  { id: 2, sender: 'LM***008', role: 'lead_manager', message: 'New hot lead assigned to your region.', time: '5 min ago' },
  { id: 3, sender: 'SA***001', role: 'super_admin', message: 'Monthly review meeting at 3 PM.', time: '15 min ago' },
  { id: 4, sender: 'FR***015', role: 'franchise', message: 'Demo request pending approval.', time: '1 hour ago' },
];

export function InternalChatDock({ open, onClose, theme }: InternalChatDockProps) {
  const [message, setMessage] = useState('');
  const isDark = theme === 'dark';

  if (!open) return null;

  return (
    <aside className={`fixed right-0 top-16 bottom-0 w-80 border-l z-40 flex flex-col ${
      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${
        isDark ? 'border-slate-800' : 'border-gray-200'
      }`}>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Internal Chat</h3>
          <Badge variant="outline" className="text-[10px]">
            <ShieldAlert className="h-3 w-3 mr-1" />
            Secure
          </Badge>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* No Screenshot Warning */}
      <div className={`px-4 py-2 text-xs flex items-center gap-2 ${
        isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'
      }`}>
        <ShieldAlert className="h-3 w-3" />
        Screenshots disabled • No edit/delete
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {mockMessages.map((msg) => (
            <div key={msg.id} className={`p-3 rounded-lg ${
              isDark ? 'bg-slate-800' : 'bg-gray-100'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                    <User className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-xs font-medium">{msg.sender}</span>
                  <Badge variant="outline" className="text-[9px] px-1">
                    {msg.role.replace('_', ' ')}
                  </Badge>
                </div>
                <span className="text-[10px] text-muted-foreground">{msg.time}</span>
              </div>
              <p className="text-sm">{msg.message}</p>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className={`p-4 border-t ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <Globe className="h-4 w-4" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message..."
            className="flex-1"
          />
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <Mic className="h-4 w-4" />
          </Button>
          <Button size="icon" className="flex-shrink-0 bg-gradient-to-r from-cyan-500 to-purple-500">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}

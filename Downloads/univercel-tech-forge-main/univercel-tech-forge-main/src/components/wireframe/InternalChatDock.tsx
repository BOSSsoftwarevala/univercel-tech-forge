import React, { useState } from 'react';
import { X, Send, Mic, Globe, ShieldAlert, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InternalChatDockProps {
  open: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

interface ChatMessage {
  id: number;
  sender: string;
  role: string;
  message: string;
  time: string;
  isOwn?: boolean;
}

const initialMessages: ChatMessage[] = [
  { id: 1, sender: 'DEV***042', role: 'developer', message: 'Task #1234 completed. Ready for review.', time: '2 min ago' },
  { id: 2, sender: 'LM***008', role: 'lead_manager', message: 'New hot lead assigned to your region.', time: '5 min ago' },
  { id: 3, sender: 'SA***001', role: 'super_admin', message: 'Monthly review meeting at 3 PM.', time: '15 min ago' },
  { id: 4, sender: 'FR***015', role: 'franchise', message: 'Demo request pending approval.', time: '1 hour ago' },
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'mr', name: 'Marathi' },
];

export function InternalChatDock({ open, onClose, theme }: InternalChatDockProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const isDark = theme === 'dark';

  if (!open) return null;

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setIsSending(true);
    const newMessage: ChatMessage = {
      id: Date.now(),
      sender: 'SA***001',
      role: 'super_admin',
      message: message.trim(),
      time: 'Just now',
      isOwn: true,
    };

    setTimeout(() => {
      setMessages(prev => [newMessage, ...prev]);
      setMessage('');
      setIsSending(false);
      toast.success('Message sent');
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      toast.info('Voice recording stopped');
      // Simulate transcription
      setTimeout(() => {
        setMessage('Voice message transcription would appear here...');
      }, 500);
    } else {
      setIsRecording(true);
      toast.info('Recording... Click again to stop');
    }
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    const langName = languages.find(l => l.code === lang)?.name || lang;
    toast.success(`Language changed to ${langName}`);
  };

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
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`p-3 rounded-lg ${
                msg.isOwn
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 ml-4'
                  : isDark ? 'bg-slate-800' : 'bg-gray-100'
              }`}
            >
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
          {/* Language Selector */}
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-10 h-9 p-0 flex items-center justify-center">
              <Globe className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type message..."
            className="flex-1"
            disabled={isSending}
          />

          {/* Voice Recording */}
          <Button 
            variant="ghost" 
            size="icon" 
            className={`flex-shrink-0 ${isRecording ? 'text-red-500 animate-pulse' : ''}`}
            onClick={handleVoiceRecord}
          >
            <Mic className="h-4 w-4" />
          </Button>

          {/* Send Button */}
          <Button 
            size="icon" 
            className="flex-shrink-0 bg-gradient-to-r from-cyan-500 to-purple-500"
            onClick={handleSendMessage}
            disabled={isSending}
          >
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </aside>
  );
}

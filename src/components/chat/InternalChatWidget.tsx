import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  Shield, 
  Globe, 
  AlertTriangle,
  User,
  Crown,
  Code2,
  Building2,
  Camera,
  CameraOff,
  Lock,
  Flag,
  Minimize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  lowDataMode: boolean;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderRole: string;
  senderMaskedName: string;
  message: string;
  timestamp: string;
  isSystem?: boolean;
}

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    senderId: 'sys',
    senderRole: 'system',
    senderMaskedName: 'System',
    message: '🔒 This is a secure internal channel. All messages are encrypted and identities are masked.',
    timestamp: '10:00 AM',
    isSystem: true
  },
  {
    id: '2',
    senderId: 'sa-001',
    senderRole: 'super_admin',
    senderMaskedName: 'SA-****-7842',
    message: 'Team, we have a high-priority lead waiting. Who can handle it?',
    timestamp: '10:05 AM'
  },
  {
    id: '3',
    senderId: 'dev-042',
    senderRole: 'developer',
    senderMaskedName: 'DEV-****-3921',
    message: 'I\'m currently on a task. Will be free in 2 hours.',
    timestamp: '10:06 AM'
  },
  {
    id: '4',
    senderId: 'lm-015',
    senderRole: 'lead_manager',
    senderMaskedName: 'LM-****-8845',
    message: 'I can take it. Assigning to myself now.',
    timestamp: '10:07 AM'
  },
];

const InternalChatWidget = ({ isOpen, onClose, lowDataMode }: ChatWidgetProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [minimized, setMinimized] = useState(false);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return <Crown className="h-3 w-3 text-yellow-400" />;
      case 'developer': return <Code2 className="h-3 w-3 text-cyan-400" />;
      case 'lead_manager': return <Building2 className="h-3 w-3 text-blue-400" />;
      default: return <User className="h-3 w-3 text-gray-400" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'developer': return 'border-cyan-500/30 bg-cyan-500/10';
      case 'lead_manager': return 'border-blue-500/30 bg-blue-500/10';
      case 'system': return 'border-gray-500/30 bg-gray-500/10';
      default: return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const msg: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'you',
      senderRole: 'super_admin',
      senderMaskedName: 'SA-****-7842',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className={cn(
            "fixed right-0 top-0 h-screen w-80 z-50 flex flex-col",
            lowDataMode 
              ? "bg-background border-l border-border" 
              : "bg-[#0d1025]/95 backdrop-blur-xl border-l border-white/5"
          )}
        >
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-400" />
              <span className="font-semibold text-sm">Secure Channel</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMinimized(!minimized)}>
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Security Indicators */}
          <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <CameraOff className="h-3 w-3 text-red-400" />
              <span className="text-red-400">No Screenshot</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Lock className="h-3 w-3 text-green-400" />
              <span className="text-green-400">E2E Encrypted</span>
            </div>
          </div>

          {/* Translation Toggle */}
          <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Globe className="h-3 w-3" />
              <span>Auto Translate</span>
            </div>
            <Switch 
              checked={autoTranslate} 
              onCheckedChange={setAutoTranslate}
              className="scale-75"
            />
          </div>

          {/* Messages */}
          {!minimized && (
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "p-3 rounded-lg border",
                      msg.isSystem 
                        ? "bg-muted/20 border-muted text-center" 
                        : getRoleColor(msg.senderRole)
                    )}
                  >
                    {!msg.isSystem && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {getRoleIcon(msg.senderRole)}
                          <span className="text-xs font-mono text-muted-foreground">
                            {msg.senderMaskedName}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground ml-auto">
                          {msg.timestamp}
                        </span>
                      </div>
                    )}
                    <p className={cn(
                      "text-sm",
                      msg.isSystem ? "text-muted-foreground text-xs" : ""
                    )}>
                      {msg.message}
                    </p>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* No Edit/Delete Notice */}
          <div className="px-4 py-2 border-t border-white/5">
            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
              <AlertTriangle className="h-3 w-3 text-yellow-500" />
              <span>Messages cannot be edited or deleted</span>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className={cn(
                  "flex-1 h-9 px-3 rounded-lg text-sm",
                  lowDataMode 
                    ? "bg-muted border border-border"
                    : "bg-white/5 border border-white/10 focus:border-cyan-500/50"
                )}
              />
              <Button size="icon" className="h-9 w-9" onClick={handleSend}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Escalation Button */}
            <Button variant="ghost" size="sm" className="w-full mt-2 text-xs gap-2 text-orange-400">
              <Flag className="h-3 w-3" />
              Escalate Issue
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InternalChatWidget;

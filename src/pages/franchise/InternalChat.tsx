import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, Send, Shield, Users, Search, 
  Phone, Video, MoreVertical, Check, CheckCheck, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ChatMessage {
  id: string;
  sender: string;
  senderMasked: string;
  message: string;
  timestamp: string;
  isOwn: boolean;
  isRead: boolean;
  originalLanguage?: string;
  translated?: boolean;
}

interface ChatContact {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'offline' | 'away';
  lastMessage: string;
  unread: number;
  avatar: string;
}

const FranchiseInternalChat = () => {
  const [selectedContact, setSelectedContact] = useState<string>('1');
  const [messageInput, setMessageInput] = useState('');

  const contacts: ChatContact[] = [
    { id: '1', name: 'Support Team', role: 'Support', status: 'online', lastMessage: 'Your query has been resolved', unread: 0, avatar: 'ST' },
    { id: '2', name: 'Lead Manager', role: 'Manager', status: 'online', lastMessage: 'New leads assigned to you', unread: 2, avatar: 'LM' },
    { id: '3', name: 'Tech Support', role: 'Technical', status: 'away', lastMessage: 'Demo is now active', unread: 0, avatar: 'TS' },
    { id: '4', name: 'Finance Team', role: 'Finance', status: 'offline', lastMessage: 'Commission credited', unread: 1, avatar: 'FT' },
  ];

  const messages: ChatMessage[] = [
    { id: '1', sender: 'Support Agent', senderMasked: 'Agent-S***', message: 'Hello! How can I assist you today?', timestamp: '10:30 AM', isOwn: false, isRead: true },
    { id: '2', sender: 'You', senderMasked: 'Franchise-M***', message: 'I have a question about lead assignment process', timestamp: '10:32 AM', isOwn: true, isRead: true },
    { id: '3', sender: 'Support Agent', senderMasked: 'Agent-S***', message: 'Sure! I can help you with that. The lead assignment is based on your territory and availability.', timestamp: '10:33 AM', isOwn: false, isRead: true },
    { id: '4', sender: 'Support Agent', senderMasked: 'Agent-S***', message: 'आप लीड्स को अपने रीसेलर्स को भी असाइन कर सकते हैं।', timestamp: '10:34 AM', isOwn: false, isRead: true, originalLanguage: 'Hindi', translated: true },
    { id: '5', sender: 'You', senderMasked: 'Franchise-M***', message: 'That makes sense. Can I prioritize certain leads?', timestamp: '10:35 AM', isOwn: true, isRead: true },
    { id: '6', sender: 'Support Agent', senderMasked: 'Agent-S***', message: 'Yes, absolutely! You can star important leads and they will appear at the top of your list.', timestamp: '10:36 AM', isOwn: false, isRead: false },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-emerald-400';
      case 'away': return 'bg-amber-400';
      case 'offline': return 'bg-slate-400';
      default: return 'bg-slate-400';
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    // In real app, this would send the message
    setMessageInput('');
  };

  return (
    <div className="space-y-4">
      {/* Security Notice */}
      <Alert className="bg-indigo-500/10 border-indigo-500/30">
        <Shield className="w-4 h-4 text-indigo-400" />
        <AlertDescription className="text-slate-300">
          <strong className="text-indigo-400">Secure Chat:</strong> All identities are masked. Messages are monitored for compliance. No edit or delete allowed.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-220px)]">
        {/* Contacts Sidebar */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <div className="p-4 border-b border-slate-700/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search contacts..." 
                className="pl-10 bg-slate-900/50 border-slate-700/50 text-white"
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(100%-60px)]">
            <div className="p-2 space-y-1">
              {contacts.map((contact) => (
                <motion.div
                  key={contact.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedContact(contact.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedContact === contact.id 
                      ? 'bg-indigo-500/20 border border-indigo-500/30' 
                      : 'hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                        <span className="text-indigo-400 font-semibold text-sm">{contact.avatar}</span>
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-800 ${getStatusColor(contact.status)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-white truncate text-sm">{contact.name}</p>
                        {contact.unread > 0 && (
                          <Badge className="bg-indigo-500 text-white text-xs h-5 w-5 p-0 flex items-center justify-center">
                            {contact.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate">{contact.lastMessage}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-3 bg-slate-800/50 border-slate-700/50 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <span className="text-indigo-400 font-semibold">ST</span>
                </div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-800 bg-emerald-400`} />
              </div>
              <div>
                <p className="font-medium text-white">Support Team</p>
                <p className="text-xs text-emerald-400">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <Phone className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <Video className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${message.isOwn ? 'order-2' : ''}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-500">{message.senderMasked}</span>
                      {message.translated && (
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs py-0">
                          <Globe className="w-3 h-3 mr-1" />
                          Auto-translated from {message.originalLanguage}
                        </Badge>
                      )}
                    </div>
                    <div className={`p-3 rounded-xl ${
                      message.isOwn 
                        ? 'bg-indigo-500 text-white rounded-br-sm' 
                        : 'bg-slate-700 text-white rounded-bl-sm'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                    </div>
                    <div className={`flex items-center gap-1 mt-1 ${message.isOwn ? 'justify-end' : ''}`}>
                      <span className="text-xs text-slate-500">{message.timestamp}</span>
                      {message.isOwn && (
                        message.isRead 
                          ? <CheckCheck className="w-3 h-3 text-indigo-400" />
                          : <Check className="w-3 h-3 text-slate-400" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-slate-700/50">
            <div className="flex items-center gap-3">
              <Input 
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message..." 
                className="flex-1 bg-slate-900/50 border-slate-700/50 text-white"
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button 
                className="bg-indigo-500 hover:bg-indigo-600 text-white"
                onClick={handleSendMessage}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              <Shield className="w-3 h-3 inline mr-1" />
              Messages are encrypted and monitored. No file sharing or screenshot allowed.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FranchiseInternalChat;

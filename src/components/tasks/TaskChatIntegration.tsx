import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Send, Paperclip, Image, Globe, 
  Lock, User, Clock, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface ChatMessage {
  id: string;
  sender: string;
  senderRole: string;
  message: string;
  timestamp: string;
  isSystem?: boolean;
  translated?: boolean;
  originalLang?: string;
}

interface TaskChat {
  taskId: string;
  taskTitle: string;
  messages: ChatMessage[];
}

const mockChat: TaskChat = {
  taskId: 'T001',
  taskTitle: 'POS Module Multi-Currency Support',
  messages: [
    { id: '1', sender: 'vala(sales)***', senderRole: 'Sales', message: 'Client needs this feature urgently for their African expansion.', timestamp: '10:30 AM', },
    { id: '2', sender: 'vala(dev)***', senderRole: 'Developer', message: 'Understanding. I\'ll need the list of currencies to support.', timestamp: '10:35 AM', },
    { id: '3', sender: 'vala(sales)***', senderRole: 'Sales', message: 'KES, UGX, TZS, and ZAR as primary. NGN as secondary.', timestamp: '10:38 AM', },
    { id: '4', sender: 'System', senderRole: 'System', message: 'Task timer started. Expected delivery: 6 hours.', timestamp: '10:45 AM', isSystem: true },
    { id: '5', sender: 'vala(dev)***', senderRole: 'Developer', message: 'नमस्ते! मैं मुद्रा रूपांतरण API पर काम कर रहा हूं।', timestamp: '11:00 AM', translated: true, originalLang: 'Hindi' },
    { id: '6', sender: 'vala(qa)***', senderRole: 'QA', message: 'I\'ll prepare test cases for all currency conversions.', timestamp: '11:15 AM', },
  ]
};

const TaskChatIntegration = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<TaskChat>(mockChat);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'vala(you)***',
      senderRole: 'You',
      message: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setChat(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));
    setMessage('');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Sales': return 'blue';
      case 'Developer': return 'violet';
      case 'QA': return 'emerald';
      case 'System': return 'slate';
      default: return 'pink';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Internal Task Chat</h2>
          <p className="text-slate-400 mt-1">Task-specific chat with auto translation & masked identity</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-emerald-400">End-to-end encrypted</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoTranslate(!autoTranslate)}
            className={autoTranslate ? 'border-violet-500/50 text-violet-400' : ''}
          >
            <Globe className="w-4 h-4 mr-2" />
            Auto-Translate {autoTranslate ? 'On' : 'Off'}
          </Button>
        </div>
      </div>

      {/* Chat Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-slate-800/50 border border-violet-500/20 overflow-hidden"
      >
        {/* Chat Header */}
        <div className="p-4 bg-slate-900/50 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-white">{chat.taskTitle}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{chat.taskId}</span>
                <span>•</span>
                <span>{chat.messages.length} messages</span>
              </div>
            </div>
          </div>
          <Badge className="bg-slate-700 text-slate-300">
            <Lock className="w-3 h-3 mr-1" />
            Permanent record
          </Badge>
        </div>

        {/* Messages */}
        <div className="h-[400px] overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {chat.messages.map((msg, index) => {
              const roleColor = getRoleColor(msg.senderRole);
              const isOwn = msg.senderRole === 'You';
              
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.isSystem ? (
                    <div className="w-full flex justify-center">
                      <div className="px-4 py-2 rounded-lg bg-slate-700/50 text-xs text-slate-400 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {msg.message}
                      </div>
                    </div>
                  ) : (
                    <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
                      {/* Sender Info */}
                      <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'justify-end' : ''}`}>
                        <div className={`w-6 h-6 rounded-full bg-${roleColor}-500/20 flex items-center justify-center`}>
                          <User className={`w-3 h-3 text-${roleColor}-400`} />
                        </div>
                        <span className="text-xs text-slate-400">{msg.sender}</span>
                        <Badge className={`bg-${roleColor}-500/20 text-${roleColor}-400 text-xs`}>
                          {msg.senderRole}
                        </Badge>
                        <span className="text-xs text-slate-500">{msg.timestamp}</span>
                      </div>
                      
                      {/* Message Bubble */}
                      <div className={`p-3 rounded-xl ${
                        isOwn 
                          ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30'
                          : 'bg-slate-900/50 border border-slate-700/50'
                      }`}>
                        <p className="text-sm text-white">{msg.message}</p>
                        {msg.translated && (
                          <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center gap-1 text-xs text-slate-400">
                            <Globe className="w-3 h-3" />
                            <span>Translated from {msg.originalLang}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900/50 border-t border-slate-700/50">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-slate-400">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400">
              <Image className="w-4 h-4" />
            </Button>
            <Input
              placeholder="Type a message... (messages are permanent)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-slate-800/50 border-slate-600"
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-violet-500 to-purple-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Messages cannot be deleted and are stored permanently for audit purposes
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskChatIntegration;

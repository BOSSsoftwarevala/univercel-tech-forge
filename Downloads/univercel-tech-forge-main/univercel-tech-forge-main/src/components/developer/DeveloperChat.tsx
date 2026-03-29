import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Paperclip, Image, FileCode, AlertTriangle,
  Bot, User, Clock, Lock, Languages, Check, CheckCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  sender: 'developer' | 'client' | 'system' | 'ai';
  content: string;
  timestamp: Date;
  isTranslated?: boolean;
  originalLanguage?: string;
  attachments?: { name: string; type: string; url: string }[];
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'system',
    content: 'Task TSK-2846 chat started. All messages are logged and cannot be deleted.',
    timestamp: new Date(Date.now() - 3600000),
    status: 'read'
  },
  {
    id: '2',
    sender: 'client',
    content: 'Please ensure the payment gateway integration supports multiple currencies.',
    timestamp: new Date(Date.now() - 3000000),
    isTranslated: true,
    originalLanguage: 'Hindi',
    status: 'read'
  },
  {
    id: '3',
    sender: 'developer',
    content: 'Yes, I\'ll implement support for INR, USD, and EUR. Should I also add GBP?',
    timestamp: new Date(Date.now() - 2700000),
    status: 'read'
  },
  {
    id: '4',
    sender: 'ai',
    content: '💡 Suggestion: Consider using Stripe\'s multi-currency API. Documentation link available in resources.',
    timestamp: new Date(Date.now() - 2400000),
    status: 'read'
  },
  {
    id: '5',
    sender: 'client',
    content: 'Yes, please add GBP as well. Also, make sure to handle currency conversion rates.',
    timestamp: new Date(Date.now() - 1800000),
    isTranslated: true,
    originalLanguage: 'Hindi',
    status: 'read'
  },
  {
    id: '6',
    sender: 'developer',
    content: 'Understood. I\'ll use real-time exchange rates from a reliable API. Expected completion in 45 minutes.',
    timestamp: new Date(Date.now() - 1200000),
    status: 'delivered'
  }
];

const DeveloperChat = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'developer',
      content: inputValue,
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Simulate message being sent
    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.id === newMessage.id ? { ...m, status: 'sent' } : m
      ));
    }, 500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sending': return <Clock className="w-3 h-3 text-slate-500" />;
      case 'sent': return <Check className="w-3 h-3 text-slate-400" />;
      case 'delivered': return <CheckCheck className="w-3 h-3 text-slate-400" />;
      case 'read': return <CheckCheck className="w-3 h-3 text-cyan-400" />;
      default: return null;
    }
  };

  const getSenderAvatar = (sender: string) => {
    switch (sender) {
      case 'developer':
        return (
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <User className="w-4 h-4 text-cyan-400" />
          </div>
        );
      case 'client':
        return (
          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Lock className="w-4 h-4 text-purple-400" />
          </div>
        );
      case 'ai':
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-emerald-400" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Task Chat</h1>
          <p className="text-slate-400 text-sm mt-1">Masked communication - TSK-2846</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-slate-800 text-slate-400 border border-slate-700">
            <Lock className="w-3 h-3 mr-1" />
            Contact Hidden
          </Badge>
          <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Languages className="w-3 h-3 mr-1" />
            Auto-Translate
          </Badge>
        </div>
      </div>

      {/* Chat Area */}
      <Card className="flex-1 bg-slate-900/50 border-cyan-500/20 flex flex-col overflow-hidden">
        {/* Warning Banner */}
        <div className="px-4 py-2 bg-yellow-500/10 border-b border-yellow-500/20 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400" />
          <span className="text-xs text-yellow-400">
            All messages are permanently logged. No editing or deleting allowed.
          </span>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex gap-3 ${
                    message.sender === 'developer' ? 'flex-row-reverse' : ''
                  } ${message.sender === 'system' ? 'justify-center' : ''}`}
                >
                  {message.sender === 'system' ? (
                    <div className="px-4 py-2 bg-slate-800/50 rounded-xl text-xs text-slate-400 text-center">
                      {message.content}
                    </div>
                  ) : (
                    <>
                      {getSenderAvatar(message.sender)}
                      <div className={`max-w-[70%] ${
                        message.sender === 'developer' ? 'items-end' : 'items-start'
                      }`}>
                        <div className={`px-4 py-3 rounded-2xl ${
                          message.sender === 'developer'
                            ? 'bg-cyan-500/20 border border-cyan-500/30'
                            : message.sender === 'ai'
                            ? 'bg-emerald-500/10 border border-emerald-500/30'
                            : 'bg-slate-800 border border-slate-700'
                        }`}>
                          {message.sender === 'ai' && (
                            <div className="flex items-center gap-1 mb-1 text-xs text-emerald-400">
                              <Bot className="w-3 h-3" />
                              AI Assistant
                            </div>
                          )}
                          <p className="text-sm text-white">{message.content}</p>
                          {message.isTranslated && (
                            <div className="mt-2 pt-2 border-t border-slate-700 flex items-center gap-1 text-xs text-purple-400">
                              <Languages className="w-3 h-3" />
                              Translated from {message.originalLanguage}
                            </div>
                          )}
                        </div>
                        <div className={`flex items-center gap-2 mt-1 text-xs text-slate-500 ${
                          message.sender === 'developer' ? 'justify-end' : ''
                        }`}>
                          <span>{message.timestamp.toLocaleTimeString()}</span>
                          {message.sender === 'developer' && getStatusIcon(message.status)}
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-slate-400 text-sm"
              >
                <div className="flex gap-1">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-slate-500 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                    className="w-2 h-2 bg-slate-500 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-slate-500 rounded-full"
                  />
                </div>
                <span>Client is typing...</span>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-cyan-500/20">
          <div className="flex items-end gap-2">
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-cyan-400">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-cyan-400">
                <FileCode className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type your message..."
                className="w-full px-4 py-3 bg-slate-800 border border-cyan-500/20 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 resize-none min-h-[48px] max-h-[120px]"
                rows={1}
              />
            </div>
            <Button 
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="bg-cyan-500 hover:bg-cyan-600 text-white h-12 px-4"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Media spam is not allowed. Technical attachments only.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default DeveloperChat;

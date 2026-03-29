import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, Shield, AlertTriangle, Bot, User, 
  Paperclip, Clock, CheckCheck, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  sender: 'developer' | 'manager' | 'system' | 'ai';
  senderName: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  attachments?: string[];
}

const DevInternalChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'system',
      senderName: 'System',
      content: '🔒 This is a secure, masked chat. No personal contact information is shared.',
      timestamp: new Date(Date.now() - 3600000),
      isRead: true,
    },
    {
      id: '2',
      sender: 'manager',
      senderName: 'Task Manager',
      content: 'Hi! I have assigned you the Payment Gateway Integration task. Please review and accept.',
      timestamp: new Date(Date.now() - 1800000),
      isRead: true,
    },
    {
      id: '3',
      sender: 'developer',
      senderName: 'You',
      content: 'Thank you! I have reviewed the requirements. Starting now.',
      timestamp: new Date(Date.now() - 1500000),
      isRead: true,
    },
    {
      id: '4',
      sender: 'ai',
      senderName: 'AI Assistant',
      content: '💡 Tip: For Razorpay integration, ensure you handle both success and failure webhooks. I can help with the callback implementation.',
      timestamp: new Date(Date.now() - 900000),
      isRead: true,
    },
    {
      id: '5',
      sender: 'manager',
      senderName: 'Task Manager',
      content: 'Great progress! The client [MASKED] is happy with the initial demo. Keep it up!',
      timestamp: new Date(Date.now() - 300000),
      isRead: true,
    },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'developer',
      senderName: 'You',
      content: newMessage,
      timestamp: new Date(),
      isRead: false,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        senderName: 'AI Assistant',
        content: 'I\'ve noted your message. Let me know if you need any technical assistance with the current task.',
        timestamp: new Date(),
        isRead: false,
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const getSenderStyle = (sender: string) => {
    switch (sender) {
      case 'developer':
        return 'bg-cyan-500/20 border-cyan-500/50 ml-auto';
      case 'manager':
        return 'bg-purple-500/20 border-purple-500/50';
      case 'ai':
        return 'bg-amber-500/20 border-amber-500/50';
      case 'system':
        return 'bg-slate-700/50 border-slate-600/50 text-center mx-auto';
      default:
        return 'bg-slate-700/50 border-slate-600/50';
    }
  };

  const getSenderIcon = (sender: string) => {
    switch (sender) {
      case 'developer':
        return <User className="w-4 h-4 text-cyan-400" />;
      case 'manager':
        return <Shield className="w-4 h-4 text-purple-400" />;
      case 'ai':
        return <Bot className="w-4 h-4 text-amber-400" />;
      default:
        return <Lock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Internal Chat</h1>
            <p className="text-slate-400 text-sm">Secure, masked communication channel</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-lg">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">Encrypted</span>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="p-3 bg-amber-500/10 border-b border-amber-500/30">
        <div className="flex items-center gap-2 text-amber-400 text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>All communication is logged. Client information is masked. No external contact allowed.</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`max-w-[80%] ${message.sender === 'developer' ? 'ml-auto' : ''} ${message.sender === 'system' ? 'max-w-full' : ''}`}
          >
            <div className={`p-4 rounded-xl border ${getSenderStyle(message.sender)}`}>
              {message.sender !== 'system' && (
                <div className="flex items-center gap-2 mb-2">
                  {getSenderIcon(message.sender)}
                  <span className="text-sm font-medium text-white">{message.senderName}</span>
                  <span className="text-xs text-slate-500">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
              <p className={`text-sm ${message.sender === 'system' ? 'text-slate-400' : 'text-slate-200'}`}>
                {message.content}
              </p>
              {message.sender === 'developer' && (
                <div className="flex justify-end mt-1">
                  <CheckCheck className={`w-4 h-4 ${message.isRead ? 'text-cyan-400' : 'text-slate-500'}`} />
                </div>
              )}
            </div>
          </motion.div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
        <div className="flex gap-3">
          <Button variant="outline" size="icon" className="shrink-0">
            <Paperclip className="w-4 h-4" />
          </Button>
          <Input
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-slate-800 border-slate-700"
          />
          <Button onClick={handleSend} className="bg-cyan-500 hover:bg-cyan-600">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
          <Lock className="w-3 h-3" />
          Messages are permanently logged and cannot be deleted
        </p>
      </div>
    </div>
  );
};

export default DevInternalChat;

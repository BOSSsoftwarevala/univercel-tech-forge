import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Image as ImageIcon,
  Mic,
  User,
  Bot,
  Clock,
  CheckCheck
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  type?: 'text' | 'image' | 'file';
}

const initialMessages: Message[] = [
  {
    id: '1',
    sender: 'bot',
    content: 'Hello! Welcome to Software Vala Support. How can I help you today?',
    timestamp: '10:00 AM',
    status: 'read'
  },
  {
    id: '2',
    sender: 'user',
    content: 'I have a question about my CRM Pro order',
    timestamp: '10:01 AM',
    status: 'read'
  },
  {
    id: '3',
    sender: 'bot',
    content: 'Of course! I can see you have an active order for CRM Pro Suite (ORD-2024-001). It\'s currently in development with 65% progress. What would you like to know?',
    timestamp: '10:02 AM',
    status: 'read'
  },
];

export function MMSupportScreen() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const mountedRef = useRef<boolean>(true);
  const timeoutsRef = useRef<number[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      // clear any pending timeouts to avoid state updates after unmount
      timeoutsRef.current.forEach((id) => {
        try {
          clearTimeout(id);
        } catch {
          // ignore
        }
      });
      timeoutsRef.current = [];
    };
  }, []);

  const simulateBotResponse = (userMessage: string) => {
    if (!mountedRef.current) return;
    setIsTyping(true);

    // Simulate human-like delay (2-4 seconds)
    const delay = 2000 + Math.random() * 2000;

    const timeoutId = window.setTimeout(() => {
      if (!mountedRef.current) return;

      let response = '';

      const lower = (userMessage || '').toLowerCase();
      if (lower.includes('status') || lower.includes('order')) {
        response = 'Let me check that for you... Your order ORD-2024-001 is progressing well. The development team has completed the core modules and is now working on the custom fields you requested. Expected completion is by January 30th.';
      } else if (lower.includes('price') || lower.includes('cost')) {
        response = 'As a franchise partner, you receive an automatic 30% discount on all products. The pricing you see in the marketplace already reflects your discounted rate.';
      } else if (lower.includes('wallet') || lower.includes('payment')) {
        response = 'Your current wallet balance is ₹45,230 with ₹5,000 locked for pending orders. You can add more funds anytime through UPI or bank transfer. Would you like me to guide you through the process?';
      } else if (lower.includes('help') || lower.includes('support')) {
        response = 'I\'m here to help! I can assist you with:\n• Order status and tracking\n• Product information\n• Wallet and payments\n• Technical issues\n• Feature requests\n\nWhat would you like to know more about?';
      } else {
        response = 'Thank you for your message. I understand you need assistance. Could you please provide more details so I can help you better? If this is urgent, I can connect you with our support team.';
      }

      const botMessage: Message = {
        id: Date.now().toString(),
        sender: 'bot',
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered'
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, delay);

    timeoutsRef.current.push(timeoutId);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const text = inputValue;
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    simulateBotResponse(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 bg-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>
            <div>
              <h2 className="font-semibold">Support Assistant</h2>
              <p className="text-xs text-emerald-400">Online</p>
            </div>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            <Clock className="h-3 w-3 mr-1" />
            Avg. response: 2 min
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                ${message.sender === 'user' 
                  ? 'bg-purple-500' 
                  : 'bg-gradient-to-br from-purple-500 to-pink-500'
                }
              `}>
                {message.sender === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>
              <div>
                <div className={`
                  p-3 rounded-2xl whitespace-pre-wrap
                  ${message.sender === 'user'
                    ? 'bg-purple-500 text-white rounded-tr-sm'
                    : 'bg-slate-800 border border-slate-700 rounded-tl-sm'
                  }
                `}>
                  {message.content}
                </div>
                <div className={`flex items-center gap-1 mt-1 text-xs text-slate-500 ${
                  message.sender === 'user' ? 'justify-end' : ''
                }`}>
                  <span>{message.timestamp}</span>
                  {message.sender === 'user' && message.status === 'read' && (
                    <CheckCheck className="h-3 w-3 text-blue-400" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-2 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 rounded-tl-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-t border-slate-700 bg-slate-900">
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
          {['Order Status', 'Wallet Balance', 'Product Info', 'Report Issue'].map(action => (
            <Button
              key={action}
              variant="outline"
              size="sm"
              className="border-slate-600 whitespace-nowrap"
              onClick={() => setInputValue(action)}
            >
              {action}
            </Button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="border-slate-600">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="border-slate-600">
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-slate-800 border-slate-700"
          />
          <Button variant="outline" size="icon" className="border-slate-600">
            <Mic className="h-4 w-4" />
          </Button>
          <Button 
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="bg-purple-500 hover:bg-purple-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

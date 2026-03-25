import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, MessageCircle, Phone, Send as WhatsApp, 
  MessageSquare, Search, Filter, RefreshCw, Star,
  Clock, User, ArrowRight, Paperclip, Send, Smile
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useSystemActions } from '@/hooks/useSystemActions';

type Channel = 'all' | 'email' | 'chat' | 'whatsapp' | 'call' | 'in_app';

interface Message {
  id: string;
  channel: Channel;
  customer: string;
  customerId: string;
  preview: string;
  time: string;
  unread: boolean;
  priority: 'low' | 'medium' | 'high';
  status: 'new' | 'replied' | 'waiting';
}

const messages: Message[] = [
  { id: 'MSG-001', channel: 'email', customer: 'Tech Solutions Ltd', customerId: 'C001', preview: 'Regarding invoice #12345, we need clarification on...', time: '2 min ago', unread: true, priority: 'high', status: 'new' },
  { id: 'MSG-002', channel: 'chat', customer: 'Healthcare Plus', customerId: 'C002', preview: 'Hello, I need help with the dashboard login...', time: '5 min ago', unread: true, priority: 'medium', status: 'new' },
  { id: 'MSG-003', channel: 'whatsapp', customer: 'EduLearn Academy', customerId: 'C003', preview: 'Can you please check the attached screenshot?', time: '12 min ago', unread: false, priority: 'low', status: 'replied' },
  { id: 'MSG-004', channel: 'call', customer: 'Retail Mart', customerId: 'C004', preview: 'Missed call - Callback requested', time: '25 min ago', unread: true, priority: 'high', status: 'waiting' },
  { id: 'MSG-005', channel: 'in_app', customer: 'Global Logistics', customerId: 'C005', preview: 'Feature request: Export to PDF functionality', time: '1 hour ago', unread: false, priority: 'low', status: 'replied' },
  { id: 'MSG-006', channel: 'email', customer: 'FinTech Corp', customerId: 'C006', preview: 'Urgent: Payment processing error on production', time: '1 hour ago', unread: true, priority: 'high', status: 'new' },
];

const conversationHistory = [
  { sender: 'customer', message: 'Hi, I need help with my invoice #12345', time: '2:30 PM' },
  { sender: 'agent', message: 'Hello! I\'d be happy to help. Let me look up that invoice for you.', time: '2:31 PM' },
  { sender: 'customer', message: 'There seems to be a discrepancy in the amount charged', time: '2:32 PM' },
  { sender: 'agent', message: 'I see. Can you please specify what amount you were expecting?', time: '2:33 PM' },
  { sender: 'customer', message: 'The invoice shows $2,500 but our agreement was for $2,000', time: '2:34 PM' },
];

const OmniChannelInbox = () => {
  const { executeAction } = useSystemActions();
  const [activeChannel, setActiveChannel] = useState<Channel>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');

  const getChannelIcon = (channel: Channel) => {
    switch (channel) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'chat': return <MessageCircle className="w-4 h-4" />;
      case 'whatsapp': return <WhatsApp className="w-4 h-4" />;
      case 'call': return <Phone className="w-4 h-4" />;
      case 'in_app': return <MessageSquare className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getChannelColor = (channel: Channel) => {
    switch (channel) {
      case 'email': return 'text-blue-400 bg-blue-500/20';
      case 'chat': return 'text-emerald-400 bg-emerald-500/20';
      case 'whatsapp': return 'text-green-400 bg-green-500/20';
      case 'call': return 'text-amber-400 bg-amber-500/20';
      case 'in_app': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300';
      case 'medium': return 'bg-amber-500/20 text-amber-300';
      default: return 'bg-slate-500/20 text-slate-300';
    }
  };

  const handleSendReply = useCallback(async () => {
    if (!replyText.trim() || !selectedMessage) return;
    
    await executeAction({
      module: 'customer_support',
      action: 'create',
      entityType: 'reply',
      entityId: selectedMessage.id,
      data: { message: replyText, channel: selectedMessage.channel },
      successMessage: 'Reply sent successfully'
    });
    setReplyText('');
  }, [replyText, selectedMessage, executeAction]);

  const handleRefresh = useCallback(async () => {
    await executeAction({
      module: 'customer_support',
      action: 'refresh',
      entityType: 'inbox',
      successMessage: 'Inbox refreshed'
    });
  }, [executeAction]);

  const handleMarkRead = useCallback(async (messageId: string) => {
    await executeAction({
      module: 'customer_support',
      action: 'update',
      entityType: 'message',
      entityId: messageId,
      data: { unread: false },
      successMessage: 'Marked as read'
    });
  }, [executeAction]);

  const filteredMessages = messages.filter(msg => {
    if (activeChannel !== 'all' && msg.channel !== activeChannel) return false;
    if (searchQuery && !msg.customer.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !msg.preview.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const channelCounts = {
    all: messages.length,
    email: messages.filter(m => m.channel === 'email').length,
    chat: messages.filter(m => m.channel === 'chat').length,
    whatsapp: messages.filter(m => m.channel === 'whatsapp').length,
    call: messages.filter(m => m.channel === 'call').length,
    in_app: messages.filter(m => m.channel === 'in_app').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-teal-400" />
            Omni-Channel Inbox
          </h2>
          <p className="text-slate-400 mt-1">Unified messaging across all channels</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-red-500/20 text-red-300">
            {messages.filter(m => m.unread).length} Unread
          </Badge>
          <Button onClick={handleRefresh} variant="outline" className="border-slate-600">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Channel Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-900/50 rounded-lg border border-slate-700/50">
        {(['all', 'email', 'chat', 'whatsapp', 'call', 'in_app'] as Channel[]).map((channel) => (
          <Button
            key={channel}
            variant={activeChannel === channel ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveChannel(channel)}
            className={activeChannel === channel ? 'bg-teal-500' : ''}
          >
            {channel !== 'all' && (
              <span className={`mr-1 ${getChannelColor(channel).split(' ')[0]}`}>
                {getChannelIcon(channel)}
              </span>
            )}
            <span className="capitalize">{channel === 'in_app' ? 'In-App' : channel}</span>
            <Badge variant="outline" className="ml-1 text-xs">{channelCounts[channel]}</Badge>
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Message List */}
        <Card className="bg-slate-900/50 border-teal-500/20">
          <CardHeader className="border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search messages..."
                  className="pl-10 bg-slate-800/50 border-slate-700"
                />
              </div>
              <Button variant="outline" size="icon" className="border-slate-600">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="divide-y divide-slate-700/30">
                {filteredMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedMessage?.id === msg.id 
                        ? 'bg-teal-900/30' 
                        : 'hover:bg-slate-800/50'
                    } ${msg.unread ? 'border-l-2 border-teal-500' : ''}`}
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (msg.unread) handleMarkRead(msg.id);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getChannelColor(msg.channel)}`}>
                        {getChannelIcon(msg.channel)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-medium ${msg.unread ? 'text-white' : 'text-slate-300'}`}>
                            {msg.customer}
                          </span>
                          <span className="text-xs text-slate-400">{msg.time}</span>
                        </div>
                        <p className={`text-sm truncate ${msg.unread ? 'text-slate-200' : 'text-slate-400'}`}>
                          {msg.preview}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getPriorityColor(msg.priority)} variant="outline">
                            {msg.priority}
                          </Badge>
                          <Badge variant="outline" className="text-slate-400 capitalize">
                            {msg.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Conversation View */}
        <Card className="bg-slate-900/50 border-teal-500/20">
          {selectedMessage ? (
            <>
              <CardHeader className="border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getChannelColor(selectedMessage.channel)}`}>
                      {getChannelIcon(selectedMessage.channel)}
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{selectedMessage.customer}</h3>
                      <p className="text-xs text-slate-400">via {selectedMessage.channel} • {selectedMessage.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="border-slate-600">
                      <User className="w-4 h-4 mr-1" />
                      View Profile
                    </Button>
                    <Button variant="outline" size="sm" className="border-slate-600">
                      <Star className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex flex-col h-[440px]">
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {conversationHistory.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] p-3 rounded-2xl ${
                          msg.sender === 'agent' 
                            ? 'bg-teal-500/20 text-teal-100 rounded-br-sm' 
                            : 'bg-slate-800 text-slate-200 rounded-bl-sm'
                        }`}>
                          <p className="text-sm">{msg.message}</p>
                          <p className="text-xs text-slate-400 mt-1">{msg.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Reply Box */}
                <div className="p-4 border-t border-slate-700/50">
                  <div className="flex items-end gap-2">
                    <div className="flex-1 relative">
                      <Textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply..."
                        className="bg-slate-800/50 border-slate-700 min-h-[60px] resize-none pr-20"
                      />
                      <div className="absolute bottom-2 right-2 flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Paperclip className="w-4 h-4 text-slate-400" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Smile className="w-4 h-4 text-slate-400" />
                        </Button>
                      </div>
                    </div>
                    <Button 
                      onClick={handleSendReply} 
                      className="bg-teal-500 hover:bg-teal-600 h-[60px] px-6"
                      disabled={!replyText.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="h-[500px] flex items-center justify-center">
              <div className="text-center text-slate-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select a message to view conversation</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default OmniChannelInbox;

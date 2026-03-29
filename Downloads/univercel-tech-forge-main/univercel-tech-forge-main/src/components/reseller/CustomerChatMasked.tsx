import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, AlertTriangle, Languages, Clock, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const conversations = [
  { id: 1, client: 'R*** S***', lastMessage: 'When can I see the demo?', time: '2 min ago', unread: 2, category: 'POS System' },
  { id: 2, client: 'A*** K***', lastMessage: 'What is the pricing?', time: '1 hour ago', unread: 0, category: 'School ERP' },
  { id: 3, client: 'P*** M***', lastMessage: 'Thank you for the information', time: '3 hours ago', unread: 0, category: 'Restaurant' },
];

const cannedResponses = [
  'Thank you for your interest! I will schedule a demo for you.',
  'Our pricing is competitive and flexible. Let me share the details.',
  'I will connect you with our support team for further assistance.',
  'Is there a convenient time for a quick call?',
];

const chatMessages = [
  { id: 1, sender: 'client', message: 'Hello, I am interested in POS System', time: '10:30 AM', translated: false },
  { id: 2, sender: 'user', message: 'Thank you for reaching out! Our POS system is perfect for retail businesses.', time: '10:32 AM', translated: false },
  { id: 3, sender: 'client', message: 'कितना price है?', time: '10:33 AM', translated: true, original: 'कितना price है?', translatedText: 'What is the price?' },
];

export const CustomerChatMasked = () => {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [selectedCanned, setSelectedCanned] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-mono font-bold text-foreground">Customer Chat (Masked)</h2>
          <p className="text-sm text-muted-foreground">Auto-translation with identity protection</p>
        </div>
        <Badge variant="outline" className="border-neon-green/30 text-neon-green">
          <Lock className="w-3 h-3 mr-1" />
          Identity Protected
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversation List */}
        <Card className="glass-panel border-border/30">
          <CardHeader>
            <CardTitle className="text-foreground">Conversations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 overflow-y-auto">
            {conversations.map((conv) => (
              <motion.div
                key={conv.id}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedConversation === conv.id 
                    ? 'bg-neon-blue/10 border border-neon-blue/30' 
                    : 'bg-secondary/20 hover:bg-secondary/40'
                }`}
                onClick={() => setSelectedConversation(conv.id)}
                whileHover={{ x: 3 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-medium text-foreground">{conv.client}</span>
                  {conv.unread > 0 && (
                    <Badge className="bg-neon-blue text-background">{conv.unread}</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="outline" className="text-xs">{conv.category}</Badge>
                  <span className="text-xs text-muted-foreground">{conv.time}</span>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2 glass-panel border-border/30 flex flex-col">
          <CardHeader className="border-b border-border/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue/50 to-primary/50 flex items-center justify-center text-foreground font-bold">
                  RS
                </div>
                <div>
                  <CardTitle className="text-foreground">R*** S***</CardTitle>
                  <p className="text-xs text-muted-foreground">POS System Inquiry</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-neon-green/30">
                  <Languages className="w-3 h-3 mr-1" />
                  Auto-Translate ON
                </Badge>
                <Button variant="outline" size="sm" className="border-neon-orange/30 text-neon-orange">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Escalate
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] p-3 rounded-xl ${
                  msg.sender === 'user' 
                    ? 'bg-neon-blue/20 text-foreground' 
                    : 'bg-secondary/50 text-foreground'
                }`}>
                  {msg.translated && (
                    <div className="mb-2 p-2 rounded bg-neon-purple/10 border border-neon-purple/30">
                      <p className="text-xs text-neon-purple flex items-center gap-1">
                        <Languages className="w-3 h-3" /> Translated
                      </p>
                      <p className="text-sm text-foreground">{msg.translatedText}</p>
                    </div>
                  )}
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {msg.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </CardContent>

          <div className="p-4 border-t border-border/30 space-y-3">
            {/* Canned Responses */}
            <div className="flex gap-2">
              <Select value={selectedCanned} onValueChange={(val) => { setSelectedCanned(val); setNewMessage(val); }}>
                <SelectTrigger className="flex-1 bg-secondary/30 border-border/30">
                  <SelectValue placeholder="Quick replies..." />
                </SelectTrigger>
                <SelectContent>
                  {cannedResponses.map((response, i) => (
                    <SelectItem key={i} value={response}>{response.slice(0, 50)}...</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="bg-secondary/30 border-border/30"
              />
              <Button className="bg-neon-blue text-background">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              <Lock className="w-3 h-3 inline mr-1" />
              Messages cannot be edited or deleted • Identity masked
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

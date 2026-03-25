/**
 * SCREEN 3: LIVE CHAT INBOX
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Send, User, Globe, Smartphone, Clock, MessageSquare, Bot, MoreHorizontal, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const mockConversations = [
  { id: '1', name: 'John Doe', lastMessage: 'How do I reset my password?', time: '2m ago', unread: 2, status: 'active' },
  { id: '2', name: 'Guest #4521', lastMessage: 'Thanks for your help!', time: '5m ago', unread: 0, status: 'resolved' },
  { id: '3', name: 'Sarah Miller', lastMessage: 'I need to speak to an agent', time: '8m ago', unread: 1, status: 'escalated' },
  { id: '4', name: 'Mike Chen', lastMessage: 'What are your pricing plans?', time: '15m ago', unread: 0, status: 'active' },
  { id: '5', name: 'Guest #4520', lastMessage: 'Product is not working', time: '20m ago', unread: 3, status: 'active' },
];

const mockMessages = [
  { id: '1', sender: 'user', content: 'Hi, I need help with my account', time: '10:30 AM' },
  { id: '2', sender: 'bot', content: 'Hello! I\'d be happy to help you with your account. What seems to be the issue?', time: '10:30 AM' },
  { id: '3', sender: 'user', content: 'How do I reset my password?', time: '10:31 AM' },
  { id: '4', sender: 'bot', content: 'To reset your password, please follow these steps:\n\n1. Go to the login page\n2. Click "Forgot Password"\n3. Enter your email address\n4. Check your inbox for the reset link', time: '10:31 AM' },
  { id: '5', sender: 'user', content: 'I didn\'t receive the email', time: '10:32 AM' },
];

const userContext = {
  name: 'John Doe',
  guestId: null,
  country: 'United States',
  language: 'English',
  device: 'Chrome / Windows',
  appVersion: 'Web v2.1.0',
  previousChats: 3,
  joinedAt: 'Jan 15, 2024',
};

export const SCLiveChatInbox: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState('1');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      setMessage('');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Live Chats</h1>
        <p className="text-sm text-muted-foreground mt-1">Active conversations</p>
      </div>

      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-200px)]">
        {/* Left Panel - Conversation List */}
        <Card className="col-span-3 flex flex-col">
          <CardHeader className="p-3 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="pl-9 h-9"
              />
            </div>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {mockConversations.map((conv) => (
                <motion.div
                  key={conv.id}
                  whileHover={{ x: 2 }}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation === conv.id ? 'bg-primary/10' : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs">{conv.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">{conv.name}</p>
                        <span className="text-xs text-muted-foreground">{conv.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                        {conv.unread}
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Center Panel - Chat Window */}
        <Card className="col-span-6 flex flex-col">
          <CardHeader className="p-3 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">John Doe</p>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {mockMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${msg.sender === 'user' ? 'order-2' : ''}`}>
                    <div className={`flex items-end gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      {msg.sender !== 'user' && (
                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                          <Bot className="w-3 h-3 text-emerald-600" />
                        </div>
                      )}
                      <div className={`rounded-lg px-3 py-2 ${
                        msg.sender === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm whitespace-pre-line">{msg.content}</p>
                      </div>
                    </div>
                    <p className={`text-[10px] text-muted-foreground mt-1 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                      {msg.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button onClick={handleSend}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Right Panel - User Context */}
        <Card className="col-span-3">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">User Context</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2 space-y-4">
            <div className="text-center pb-4 border-b">
              <Avatar className="h-16 w-16 mx-auto">
                <AvatarFallback className="text-lg">JD</AvatarFallback>
              </Avatar>
              <p className="font-semibold mt-2">{userContext.name}</p>
              <p className="text-xs text-muted-foreground">Member since {userContext.joinedAt}</p>
            </div>

            <div className="space-y-3">
              {[
                { icon: Globe, label: 'Country', value: userContext.country },
                { icon: MessageSquare, label: 'Language', value: userContext.language },
                { icon: Smartphone, label: 'Device', value: userContext.device },
                { icon: Bot, label: 'App Version', value: userContext.appVersion },
                { icon: Clock, label: 'Previous Chats', value: userContext.previousChats.toString() },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 space-y-2">
              <Button variant="outline" className="w-full gap-2" size="sm">
                <Mail className="w-4 h-4" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full gap-2" size="sm">
                <Clock className="w-4 h-4" />
                View History
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

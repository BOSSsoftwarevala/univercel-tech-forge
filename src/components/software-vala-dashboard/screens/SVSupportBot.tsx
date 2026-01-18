/**
 * SUPPORT BOT MANAGEMENT
 * Integrated chatbot management for Software Vala
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Bot, 
  Users, 
  Clock, 
  Star,
  Upload,
  Brain,
  Settings2,
  Send,
  User,
  Globe,
  Smartphone,
  TrendingUp
} from 'lucide-react';

const bots = [
  { name: 'Sales Assistant', channel: 'Web', model: 'GPT-5', languages: 12, status: 'active', chats: 245 },
  { name: 'Support Bot', channel: 'Android', model: 'Gemini', languages: 8, status: 'active', chats: 189 },
  { name: 'Demo Guide', channel: 'WhatsApp', model: 'GPT-5-mini', languages: 5, status: 'training', chats: 0 },
];

const liveChats = [
  { id: 1, user: 'John D.', country: 'US', message: 'How do I integrate the API?', time: '2m ago', status: 'waiting' },
  { id: 2, user: 'Priya S.', country: 'IN', message: 'Pricing for enterprise plan?', time: '5m ago', status: 'active' },
  { id: 3, user: 'Guest #4521', country: 'UK', message: 'APK download issue', time: '8m ago', status: 'bot' },
];

const chatMessages = [
  { sender: 'user', content: 'Hi, I need help with API integration', time: '10:30 AM' },
  { sender: 'bot', content: 'Hello! I\'d be happy to help you with API integration. Which SDK are you using - Python, JavaScript, or another language?', time: '10:30 AM' },
  { sender: 'user', content: 'I\'m using JavaScript/Node.js', time: '10:31 AM' },
  { sender: 'bot', content: 'Great choice! Here\'s a quick start guide for Node.js integration...', time: '10:31 AM' },
];

export const SVSupportBot: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedChat, setSelectedChat] = useState(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Support Bot</h1>
          <p className="text-slate-500">Manage AI-powered customer support chatbots</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Train Bot
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Bot className="w-4 h-4 mr-2" />
            Create Bot
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Bots</p>
                <p className="text-2xl font-bold text-slate-800">3</p>
              </div>
              <Bot className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Live Chats</p>
                <p className="text-2xl font-bold text-slate-800">24</p>
              </div>
              <MessageSquare className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Open Tickets</p>
                <p className="text-2xl font-bold text-slate-800">8</p>
              </div>
              <Users className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Avg Response</p>
                <p className="text-2xl font-bold text-slate-800">1.2s</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-rose-50 to-white border-rose-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">CSAT</p>
                <p className="text-2xl font-bold text-slate-800">94%</p>
              </div>
              <Star className="w-8 h-8 text-rose-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="live-chat">Live Chat</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Bot List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Bot Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Channel</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Model</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Languages</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Active Chats</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bots.map((bot, i) => (
                      <tr key={i} className="border-b hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Bot className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">{bot.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{bot.channel}</Badge>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{bot.model}</td>
                        <td className="py-3 px-4 text-slate-600">{bot.languages}</td>
                        <td className="py-3 px-4">
                          <Badge className={bot.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                            {bot.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{bot.chats}</td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm">Configure</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="live-chat" className="mt-4">
          <div className="grid grid-cols-12 gap-4 h-[600px]">
            {/* Conversation List */}
            <Card className="col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Conversations</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[520px]">
                  {liveChats.map((chat) => (
                    <div 
                      key={chat.id}
                      onClick={() => setSelectedChat(chat.id)}
                      className={`p-3 border-b cursor-pointer hover:bg-slate-50 ${selectedChat === chat.id ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{chat.user}</span>
                        <span className="text-xs text-slate-400">{chat.time}</span>
                      </div>
                      <p className="text-sm text-slate-600 truncate">{chat.message}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">{chat.country}</Badge>
                        <Badge 
                          className={`text-xs ${
                            chat.status === 'waiting' ? 'bg-amber-100 text-amber-700' :
                            chat.status === 'active' ? 'bg-green-100 text-green-700' :
                            'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {chat.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Window */}
            <Card className="col-span-6">
              <CardHeader className="pb-2 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Chat with Priya S.
                  </CardTitle>
                  <Button size="sm" variant="outline">Take Over</Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex flex-col h-[520px]">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          msg.sender === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <Input placeholder="Type a message..." className="flex-1" />
                    <Button size="sm" className="bg-blue-600">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Context */}
            <Card className="col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">User Context</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Priya S.</p>
                      <p className="text-sm text-slate-500">priya@example.com</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-400" />
                      <span>India (IN)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                      <span>Hindi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-slate-400" />
                      <span>Android v2.4.1</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-xs text-slate-500 mb-2">Previous Chats</p>
                    <div className="space-y-2">
                      <div className="p-2 bg-slate-50 rounded text-xs">
                        <p className="font-medium">API Integration Help</p>
                        <p className="text-slate-400">2 days ago • Resolved</p>
                      </div>
                      <div className="p-2 bg-slate-50 rounded text-xs">
                        <p className="font-medium">Pricing Query</p>
                        <p className="text-slate-400">1 week ago • Resolved</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="training" className="mt-4">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Training Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-600 mb-2">Drag & drop files here</p>
                  <p className="text-sm text-slate-400 mb-4">PDF, DOC, TXT, or URL</p>
                  <Button variant="outline">Browse Files</Button>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm">faq_v2.pdf</span>
                    <Badge className="bg-green-100 text-green-700">Trained</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm">product_docs.pdf</span>
                    <Badge className="bg-amber-100 text-amber-700">Processing</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Intent Editor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">pricing_inquiry</span>
                      <Badge>12 utterances</Badge>
                    </div>
                    <div className="space-y-1 text-sm text-slate-600">
                      <p>"How much does it cost?"</p>
                      <p>"What's the pricing?"</p>
                      <p>"Enterprise plan price?"</p>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">api_help</span>
                      <Badge>8 utterances</Badge>
                    </div>
                    <div className="space-y-1 text-sm text-slate-600">
                      <p>"How to integrate API?"</p>
                      <p>"SDK documentation"</p>
                      <p>"API authentication"</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Settings2 className="w-4 h-4 mr-2" />
                    Add New Intent
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Bot Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                <p className="text-slate-400">Analytics Chart Placeholder</p>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-slate-800">1,245</p>
                  <p className="text-sm text-slate-500">Total Chats</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">89%</p>
                  <p className="text-sm text-slate-500">Bot Resolved</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">11%</p>
                  <p className="text-sm text-slate-500">Human Resolved</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-amber-600">4.7</p>
                  <p className="text-sm text-slate-500">Avg CSAT</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

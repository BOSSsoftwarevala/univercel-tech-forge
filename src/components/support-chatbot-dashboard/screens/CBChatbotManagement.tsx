/**
 * CHATBOT MANAGEMENT SCREEN
 * Manage and configure chatbots
 */

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { 
  Bot,
  Globe,
  Smartphone,
  MessageCircle as WhatsApp,
  Settings,
  GraduationCap,
  MoreVertical,
  Play,
  Pause,
  Trash2,
  Copy,
  BarChart3
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

interface Chatbot {
  id: string;
  name: string;
  description: string;
  channel: 'web' | 'android' | 'whatsapp';
  status: 'live' | 'paused';
  aiModel: string;
  languageCount: number;
  conversations: number;
  resolution: number;
}

const initialBots: Chatbot[] = [
  {
    id: '1',
    name: 'SupportBot',
    description: 'Main customer support bot for website',
    channel: 'web',
    status: 'live',
    aiModel: 'GPT-5',
    languageCount: 8,
    conversations: 12450,
    resolution: 94
  },
  {
    id: '2',
    name: 'MobileHelper',
    description: 'In-app support for Android users',
    channel: 'android',
    status: 'live',
    aiModel: 'GPT-5-mini',
    languageCount: 5,
    conversations: 8320,
    resolution: 91
  },
  {
    id: '3',
    name: 'WhatsApp Sales',
    description: 'Sales and inquiry bot on WhatsApp',
    channel: 'whatsapp',
    status: 'live',
    aiModel: 'GPT-5',
    languageCount: 12,
    conversations: 5670,
    resolution: 88
  },
  {
    id: '4',
    name: 'Beta Bot',
    description: 'Testing new features and responses',
    channel: 'web',
    status: 'paused',
    aiModel: 'Gemini 3',
    languageCount: 3,
    conversations: 890,
    resolution: 76
  },
];

const channelConfig = {
  web: { icon: Globe, label: 'Website', color: 'bg-blue-100 text-blue-700' },
  android: { icon: Smartphone, label: 'Android App', color: 'bg-emerald-100 text-emerald-700' },
  whatsapp: { icon: WhatsApp, label: 'WhatsApp', color: 'bg-green-100 text-green-700' },
};

export const CBChatbotManagement: React.FC = () => {
  const [bots, setBots] = useState<Chatbot[]>(initialBots);

  const handleToggle = (id: string) => {
    setBots(prev => prev.map(b => 
      b.id === id ? { ...b, status: b.status === 'live' ? 'paused' : 'live' } : b
    ));
    toast({ title: 'Bot status updated' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Chatbots</h1>
          <p className="text-slate-500 text-sm mt-1">Create and manage your AI chatbots</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Bot className="w-4 h-4 mr-2" />
          Create New Bot
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="flex items-center gap-4 flex-wrap">
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
          {bots.filter(b => b.status === 'live').length} Live Bots
        </Badge>
        <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 px-3 py-1">
          {bots.filter(b => b.status === 'paused').length} Paused
        </Badge>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
          {bots.reduce((sum, b) => sum + b.conversations, 0).toLocaleString()} Total Conversations
        </Badge>
      </div>

      {/* Bot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bots.map((bot) => {
          const channel = channelConfig[bot.channel];
          const ChannelIcon = channel.icon;

          return (
            <Card 
              key={bot.id} 
              className={`bg-white border-slate-200 shadow-sm hover:shadow-md transition-all rounded-xl ${
                bot.status === 'paused' ? 'opacity-80' : ''
              }`}
            >
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-800">{bot.name}</h3>
                        {bot.status === 'live' && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{bot.description}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Settings className="w-4 h-4 mr-2" /> Settings</DropdownMenuItem>
                      <DropdownMenuItem><BarChart3 className="w-4 h-4 mr-2" /> Analytics</DropdownMenuItem>
                      <DropdownMenuItem><Copy className="w-4 h-4 mr-2" /> Duplicate</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Badges Row */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className={`text-xs ${channel.color}`}>
                    <ChannelIcon className="w-3 h-3 mr-1" />
                    {channel.label}
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-violet-50 text-violet-700 border-violet-200">
                    🤖 {bot.aiModel}
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200">
                    🌐 {bot.languageCount} languages
                  </Badge>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-slate-800">{bot.conversations.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">Conversations</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-emerald-600">{bot.resolution}%</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">Resolution Rate</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={bot.status === 'live'}
                      onCheckedChange={() => handleToggle(bot.id)}
                    />
                    <span className={`text-sm font-medium ${bot.status === 'live' ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {bot.status === 'live' ? 'Live' : 'Paused'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="w-3.5 h-3.5 mr-1.5" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                      <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
                      Train
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

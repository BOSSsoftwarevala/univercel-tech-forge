/**
 * SCREEN 2: CHATBOT LIST
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, MoreHorizontal, Bot, Globe, Play, Pause, Edit, Trash2, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const mockBots = [
  { id: '1', name: 'Support Bot', channel: 'Web', model: 'GPT-4', languages: 5, status: 'active', conversations: 1234 },
  { id: '2', name: 'Sales Assistant', channel: 'WhatsApp', model: 'GPT-3.5', languages: 3, status: 'active', conversations: 567 },
  { id: '3', name: 'Android Helper', channel: 'Android', model: 'Claude', languages: 2, status: 'training', conversations: 89 },
  { id: '4', name: 'FAQ Bot', channel: 'Web', model: 'GPT-4', languages: 8, status: 'paused', conversations: 2345 },
  { id: '5', name: 'Onboarding Guide', channel: 'iOS', model: 'GPT-4', languages: 4, status: 'active', conversations: 456 },
];

const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    active: 'bg-green-500/10 text-green-600 border-green-500/20',
    training: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    paused: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    inactive: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
  };
  return styles[status] || styles.inactive;
};

const getChannelBadge = (channel: string) => {
  const styles: Record<string, string> = {
    Web: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    WhatsApp: 'bg-green-500/10 text-green-600 border-green-500/20',
    Android: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    iOS: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  };
  return styles[channel] || '';
};

export const SCChatbotList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBots = mockBots.filter(bot =>
    bot.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Chatbots</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your support chatbots</p>
        </div>
        <Button className="gap-2" onClick={() => toast.success('Create bot dialog would open')}>
          <Plus className="w-4 h-4" />
          New Chatbot
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chatbots..."
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold">Bot Name</TableHead>
                <TableHead className="font-semibold">Channel</TableHead>
                <TableHead className="font-semibold">Model</TableHead>
                <TableHead className="font-semibold">Languages</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBots.map((bot, index) => (
                <motion.tr
                  key={bot.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium">{bot.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {bot.conversations.toLocaleString()} chats
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getChannelBadge(bot.channel)}>
                      {bot.channel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{bot.model}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span>{bot.languages}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadge(bot.status)}>
                      {bot.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                        <DropdownMenuItem>
                          {bot.status === 'active' ? (
                            <><Pause className="w-4 h-4 mr-2" />Pause</>
                          ) : (
                            <><Play className="w-4 h-4 mr-2" />Activate</>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

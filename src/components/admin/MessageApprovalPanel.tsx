import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Check,
  X,
  Play,
  Pause,
  Clock,
  MessageCircle,
  Mic,
  AlertTriangle,
  Eye,
  Flag,
  Search,
  Filter,
  ChevronDown,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";

interface PendingMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  content: string;
  type: 'text' | 'voice';
  voiceDuration?: number;
  timestamp: Date;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

const MessageApprovalPanel = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<PendingMessage | null>(null);

  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([
    {
      id: "1",
      senderId: "user1",
      senderName: "Rahul Sharma",
      receiverId: "user2",
      receiverName: "Support Team",
      content: "I need help with my subscription renewal. Can you assist?",
      type: "text",
      timestamp: new Date(Date.now() - 120000),
      priority: "normal"
    },
    {
      id: "2",
      senderId: "user3",
      senderName: "Priya Patel",
      receiverId: "user4",
      receiverName: "Sales Manager",
      content: "",
      type: "voice",
      voiceDuration: 45,
      timestamp: new Date(Date.now() - 300000),
      priority: "high"
    },
    {
      id: "3",
      senderId: "user5",
      senderName: "Amit Kumar",
      receiverId: "user6",
      receiverName: "Technical Lead",
      content: "The integration is not working as expected. Getting error codes.",
      type: "text",
      timestamp: new Date(Date.now() - 600000),
      priority: "urgent"
    },
    {
      id: "4",
      senderId: "user7",
      senderName: "Sneha Reddy",
      receiverId: "user8",
      receiverName: "Account Manager",
      content: "Please share the updated pricing for enterprise plan.",
      type: "text",
      timestamp: new Date(Date.now() - 900000),
      priority: "low"
    },
    {
      id: "5",
      senderId: "user9",
      senderName: "Vikram Singh",
      receiverId: "user10",
      receiverName: "Support Team",
      content: "",
      type: "voice",
      voiceDuration: 23,
      timestamp: new Date(Date.now() - 1200000),
      priority: "normal"
    },
  ]);

  const handleApprove = (messageId: string) => {
    setPendingMessages(prev => prev.filter(m => m.id !== messageId));
    toast.success("Message approved and delivered", {
      description: "The recipient can now see this message"
    });
  };

  const handleReject = (messageId: string) => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    
    setPendingMessages(prev => prev.filter(m => m.id !== messageId));
    setRejectReason("");
    setSelectedMessage(null);
    toast.info("Message rejected", {
      description: "The sender will be notified"
    });
  };

  const handleFlag = (messageId: string) => {
    toast.warning("Message flagged for review", {
      description: "This message has been marked for further investigation"
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'normal': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'low': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const filteredMessages = pendingMessages.filter(msg => {
    if (searchQuery && !msg.senderName.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !msg.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedFilter !== 'all' && msg.type !== selectedFilter) {
      return false;
    }
    return true;
  });

  const stats = {
    total: pendingMessages.length,
    text: pendingMessages.filter(m => m.type === 'text').length,
    voice: pendingMessages.filter(m => m.type === 'voice').length,
    urgent: pendingMessages.filter(m => m.priority === 'urgent').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-400" />
            Message Approval Queue
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Review and approve messages before delivery
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 px-3 py-1">
            <Clock className="w-3 h-3 mr-1" />
            {stats.total} Pending
          </Badge>
          {stats.urgent > 0 && (
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 px-3 py-1 animate-pulse">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {stats.urgent} Urgent
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Total Pending</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Text Messages</p>
                <p className="text-2xl font-bold text-white">{stats.text}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Voice Messages</p>
                <p className="text-2xl font-bold text-white">{stats.voice}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Mic className="w-5 h-5 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Urgent</p>
                <p className="text-2xl font-bold text-red-400">{stats.urgent}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by sender or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-600 text-white"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('all')}
            className={selectedFilter === 'all' ? 'bg-emerald-500 text-white' : 'border-slate-600 text-slate-300'}
          >
            All
          </Button>
          <Button
            variant={selectedFilter === 'text' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('text')}
            className={selectedFilter === 'text' ? 'bg-cyan-500 text-white' : 'border-slate-600 text-slate-300'}
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            Text
          </Button>
          <Button
            variant={selectedFilter === 'voice' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('voice')}
            className={selectedFilter === 'voice' ? 'bg-purple-500 text-white' : 'border-slate-600 text-slate-300'}
          >
            <Mic className="w-3 h-3 mr-1" />
            Voice
          </Button>
        </div>
      </div>

      {/* Messages List */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="border-b border-slate-700/50">
          <CardTitle className="text-white text-lg">Pending Messages</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div className="divide-y divide-slate-700/50">
              <AnimatePresence>
                {filteredMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-4 hover:bg-slate-700/20 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <Avatar className="w-10 h-10 border-2 border-slate-600">
                        <AvatarFallback className="bg-slate-700 text-white text-sm">
                          {msg.senderName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-white">{msg.senderName}</p>
                          <span className="text-slate-500">→</span>
                          <p className="text-slate-400">{msg.receiverName}</p>
                          <Badge className={`text-[10px] ${getPriorityColor(msg.priority)}`}>
                            {msg.priority}
                          </Badge>
                        </div>
                        
                        {msg.type === 'voice' ? (
                          <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg max-w-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-10 h-10 rounded-full bg-purple-500/20"
                              onClick={() => setPlayingVoice(playingVoice === msg.id ? null : msg.id)}
                            >
                              {playingVoice === msg.id ? (
                                <Pause className="w-4 h-4 text-purple-400" />
                              ) : (
                                <Play className="w-4 h-4 text-purple-400" />
                              )}
                            </Button>
                            <div className="flex-1">
                              <div className="h-1 bg-slate-600 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-purple-500"
                                  initial={{ width: 0 }}
                                  animate={{ width: playingVoice === msg.id ? '100%' : '0%' }}
                                  transition={{ duration: msg.voiceDuration || 5 }}
                                />
                              </div>
                            </div>
                            <span className="text-xs text-slate-400">
                              {formatDuration(msg.voiceDuration || 0)}
                            </span>
                          </div>
                        ) : (
                          <p className="text-slate-300 text-sm">{msg.content}</p>
                        )}
                        
                        <p className="text-xs text-slate-500 mt-2">
                          {format(msg.timestamp, 'MMM dd, yyyy HH:mm')}
                        </p>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(msg.id)}
                          className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedMessage(msg)}
                              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-900 border-slate-700">
                            <DialogHeader>
                              <DialogTitle className="text-white">Reject Message</DialogTitle>
                              <DialogDescription className="text-slate-400">
                                Please provide a reason for rejecting this message.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                              <Textarea
                                placeholder="Enter rejection reason..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="bg-slate-800 border-slate-700 text-white"
                              />
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setRejectReason("")}
                                  className="border-slate-600 text-slate-300"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => handleReject(msg.id)}
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                >
                                  Confirm Reject
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleFlag(msg.id)}
                          className="text-amber-400 hover:bg-amber-500/10"
                        >
                          <Flag className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredMessages.length === 0 && (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-emerald-400" />
                  </div>
                  <p className="text-white font-medium">All caught up!</p>
                  <p className="text-slate-400 text-sm">No pending messages to review</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageApprovalPanel;

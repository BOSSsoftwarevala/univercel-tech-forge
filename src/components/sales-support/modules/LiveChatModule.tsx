import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, User, Bot, Clock, CheckCircle, UserPlus, ArrowUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ChatSession {
  id: string;
  visitor: string;
  email: string;
  status: "waiting" | "active" | "resolved" | "transferred";
  assignedTo: string | null;
  waitTime: string;
  messageCount: number;
  sentiment: "positive" | "neutral" | "negative";
  lastMessage: string;
  startedAt: string;
}

const LiveChatModule = () => {
  const [chats, setChats] = useState<ChatSession[]>([
    { id: "CHAT-001", visitor: "John D.", email: "john@example.com", status: "active", assignedTo: "Sarah Chen", waitTime: "0:45", messageCount: 12, sentiment: "positive", lastMessage: "Thank you for your help!", startedAt: "5 min ago" },
    { id: "CHAT-002", visitor: "Maria S.", email: "maria@example.com", status: "waiting", assignedTo: null, waitTime: "2:30", messageCount: 3, sentiment: "neutral", lastMessage: "Hello, I need help with my order", startedAt: "3 min ago" },
    { id: "CHAT-003", visitor: "Robert K.", email: "robert@example.com", status: "active", assignedTo: "Mike Johnson", waitTime: "1:15", messageCount: 8, sentiment: "negative", lastMessage: "This is ridiculous! I've been waiting for hours", startedAt: "10 min ago" },
    { id: "CHAT-004", visitor: "Lisa P.", email: "lisa@example.com", status: "resolved", assignedTo: "Lisa Park", waitTime: "-", messageCount: 15, sentiment: "positive", lastMessage: "Great, thanks!", startedAt: "25 min ago" },
    { id: "CHAT-005", visitor: "Anonymous", email: "-", status: "waiting", assignedTo: null, waitTime: "5:00", messageCount: 1, sentiment: "neutral", lastMessage: "Hi", startedAt: "5 min ago" },
  ]);

  const agents = ["Sarah Chen", "Mike Johnson", "Lisa Park", "Emma Davis", "James Wilson"];

  const handleAcceptChat = (chatId: string, agent: string) => {
    toast.loading("Accepting chat...", { id: `accept-${chatId}` });
    setTimeout(() => {
      setChats(chats.map(c => c.id === chatId ? { ...c, assignedTo: agent, status: "active", waitTime: "0:00" } : c));
      toast.success(`Chat accepted by ${agent}`, { id: `accept-${chatId}` });
    }, 500);
  };

  const handleTransfer = (chatId: string, agent: string) => {
    toast.loading("Transferring chat...", { id: `transfer-${chatId}` });
    setTimeout(() => {
      setChats(chats.map(c => c.id === chatId ? { ...c, assignedTo: agent, status: "transferred" } : c));
      toast.success(`Transferred to ${agent}`, { id: `transfer-${chatId}` });
    }, 500);
  };

  const handleResolve = (chatId: string) => {
    toast.loading("Closing chat...", { id: `resolve-${chatId}` });
    setTimeout(() => {
      setChats(chats.map(c => c.id === chatId ? { ...c, status: "resolved" } : c));
      toast.success("Chat resolved", { id: `resolve-${chatId}` });
    }, 500);
  };

  const handleEscalate = (chatId: string) => {
    toast.loading("Escalating chat...", { id: `escalate-${chatId}` });
    setTimeout(() => {
      toast.warning("Chat escalated to supervisor", { id: `escalate-${chatId}` });
    }, 600);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "bg-emerald-500/20 text-emerald-300";
      case "negative": return "bg-red-500/20 text-red-300";
      default: return "bg-slate-500/20 text-slate-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting": return "bg-amber-500/20 text-amber-300";
      case "active": return "bg-emerald-500/20 text-emerald-300";
      case "resolved": return "bg-slate-500/20 text-slate-300";
      case "transferred": return "bg-blue-500/20 text-blue-300";
      default: return "bg-slate-500/20 text-slate-300";
    }
  };

  const waitingCount = chats.filter(c => c.status === "waiting").length;
  const activeCount = chats.filter(c => c.status === "active").length;
  const negativeCount = chats.filter(c => c.sentiment === "negative" && c.status === "active").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-100">Live Chat</h2>
          <p className="text-slate-400">Real-time chat sessions with sentiment analysis</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4 text-center">
            <MessageCircle className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-cyan-100">{chats.length}</div>
            <div className="text-xs text-slate-400">Total Chats</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-100">{waitingCount}</div>
            <div className="text-xs text-slate-400">Waiting</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-100">{activeCount}</div>
            <div className="text-xs text-slate-400">Active</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-red-500/20">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-100">{negativeCount}</div>
            <div className="text-xs text-slate-400">Negative Sentiment</div>
          </CardContent>
        </Card>
      </div>

      {/* Chats List */}
      <Card className="bg-slate-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-100">Active Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {chats.map((chat, index) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors ${chat.status === "waiting" ? "border-l-4 border-amber-500" : ""} ${chat.sentiment === "negative" ? "border-l-4 border-red-500" : ""}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-cyan-500/20 text-cyan-300">{chat.visitor.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-cyan-400 text-sm">{chat.id}</span>
                        <span className="font-medium text-slate-100">{chat.visitor}</span>
                        <Badge className={getStatusColor(chat.status)}>{chat.status}</Badge>
                        <Badge className={getSentimentColor(chat.sentiment)}>{chat.sentiment}</Badge>
                      </div>
                      <p className="text-sm text-slate-400">{chat.email} • {chat.messageCount} messages • Started {chat.startedAt}</p>
                    </div>
                  </div>
                  {chat.status === "waiting" && (
                    <div className="flex items-center gap-2 text-amber-400">
                      <Clock className="w-4 h-4" />
                      <span>Waiting: {chat.waitTime}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-300 italic">"{chat.lastMessage}"</p>

                  <div className="flex items-center gap-2">
                    {chat.status === "waiting" && (
                      <Select onValueChange={(agent) => handleAcceptChat(chat.id, agent)}>
                        <SelectTrigger className="w-32 bg-slate-700/50 border-slate-600">
                          <SelectValue placeholder="Accept" />
                        </SelectTrigger>
                        <SelectContent>
                          {agents.map(agent => (
                            <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {chat.status === "active" && (
                      <>
                        <Select onValueChange={(agent) => handleTransfer(chat.id, agent)}>
                          <SelectTrigger className="w-32 bg-slate-700/50 border-slate-600">
                            <SelectValue placeholder="Transfer" />
                          </SelectTrigger>
                          <SelectContent>
                            {agents.filter(a => a !== chat.assignedTo).map(agent => (
                              <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Button size="sm" variant="outline" onClick={() => handleEscalate(chat.id)} className="border-red-500/30 text-red-300">
                          <ArrowUp className="w-3 h-3 mr-1" />
                          Escalate
                        </Button>

                        <Button size="sm" onClick={() => handleResolve(chat.id)} className="bg-emerald-500 hover:bg-emerald-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Resolve
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveChatModule;

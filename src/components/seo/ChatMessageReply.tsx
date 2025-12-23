import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MessageSquare, Bot, Users, Clock, Zap, Send,
  Phone, Mail, Globe, TrendingUp, ArrowUpRight,
  Settings, Plus, Search, Filter, CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const ChatMessageReply = () => {
  const [aiAssistEnabled, setAiAssistEnabled] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);

  const chatStats = [
    { label: "Active Chats", value: "24", change: "+5", icon: MessageSquare },
    { label: "Avg Response Time", value: "2.4 min", change: "-30%", icon: Clock },
    { label: "AI Handled", value: "78%", change: "+12%", icon: Bot },
    { label: "Satisfaction", value: "4.8/5", change: "+0.2", icon: TrendingUp },
  ];

  const conversations = [
    { id: 1, name: "Amit Sharma", company: "TechStart India", channel: "website", status: "active", unread: 2, lastMessage: "Can you explain the enterprise pricing?", time: "2 min ago", aiSuggestion: true },
    { id: 2, name: "Priya Patel", company: "Digital Dreams", channel: "whatsapp", status: "active", unread: 0, lastMessage: "Thanks for the demo!", time: "15 min ago", aiSuggestion: false },
    { id: 3, name: "Rahul Verma", company: "Innovation Labs", channel: "email", status: "waiting", unread: 1, lastMessage: "When can we schedule a call?", time: "1 hour ago", aiSuggestion: true },
    { id: 4, name: "Sneha Gupta", company: "CloudWorks", channel: "website", status: "resolved", unread: 0, lastMessage: "Perfect, that answers my question.", time: "2 hours ago", aiSuggestion: false },
  ];

  const messages = [
    { id: 1, sender: "customer", name: "Amit Sharma", message: "Hi, I'm interested in your software solution for my business.", time: "10:45 AM" },
    { id: 2, sender: "agent", name: "AI Assistant", message: "Hello Amit! Thank you for reaching out. I'd be happy to help you explore our solutions. Could you tell me more about your business needs?", time: "10:45 AM", isAi: true },
    { id: 3, sender: "customer", name: "Amit Sharma", message: "We're a mid-size IT company with about 200 employees. Looking for a complete CRM + project management solution.", time: "10:47 AM" },
    { id: 4, sender: "agent", name: "AI Assistant", message: "That's great! For a company of your size, I'd recommend our Enterprise plan which includes both CRM and Project Management modules. It supports up to 500 users and includes dedicated support.", time: "10:47 AM", isAi: true },
    { id: 5, sender: "customer", name: "Amit Sharma", message: "Can you explain the enterprise pricing?", time: "10:50 AM" },
  ];

  const aiSuggestions = [
    "Our Enterprise plan starts at ₹49,999/month with unlimited users. Would you like me to schedule a demo?",
    "I can share our detailed pricing document. What's the best email to send it to?",
    "Let me connect you with our sales team for a custom quote based on your requirements.",
  ];

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "website": return <Globe className="w-4 h-4 text-cyan-400" />;
      case "whatsapp": return <Phone className="w-4 h-4 text-green-400" />;
      case "email": return <Mail className="w-4 h-4 text-blue-400" />;
      default: return <MessageSquare className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400";
      case "waiting": return "bg-yellow-500/20 text-yellow-400";
      case "resolved": return "bg-slate-500/20 text-slate-400";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl border border-green-500/30">
              <MessageSquare className="h-6 w-6 text-green-400" />
            </div>
            Chat & Message Reply
          </h1>
          <p className="text-muted-foreground mt-1">Unified inbox with AI-powered responses</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-green-500/20">
            <Bot className="w-4 h-4 text-green-400" />
            <span className="text-sm text-slate-400">AI Assist</span>
            <Switch checked={aiAssistEnabled} onCheckedChange={setAiAssistEnabled} />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {chatStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-green-500/20 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <stat.icon className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-400">
                    <ArrowUpRight className="w-4 h-4" />
                    {stat.change}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="bg-slate-900/50 border-green-500/20 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-green-300">Conversations</CardTitle>
              <Button variant="ghost" size="sm" className="text-green-400">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
            <Input placeholder="Search conversations..." className="bg-slate-800/50 border-green-500/20 mt-2" />
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[450px]">
              <div className="space-y-1 p-2">
                {conversations.map((conv) => (
                  <motion.div
                    key={conv.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedConversation === conv.id 
                        ? "bg-green-500/20 border border-green-500/30" 
                        : "bg-slate-800/30 hover:bg-slate-800/50"
                    }`}
                    onClick={() => setSelectedConversation(conv.id)}
                    whileHover={{ x: 3 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-green-400">{conv.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-white text-sm">{conv.name}</h4>
                            {conv.unread > 0 && (
                              <Badge className="bg-green-500 text-white text-xs h-5 w-5 flex items-center justify-center p-0 rounded-full">
                                {conv.unread}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{conv.company}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {getChannelIcon(conv.channel)}
                        <span className="text-xs text-muted-foreground">{conv.time}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-1">{conv.lastMessage}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getStatusColor(conv.status)} variant="outline">{conv.status}</Badge>
                      {conv.aiSuggestion && <Badge className="bg-blue-500/20 text-blue-400 text-xs">AI Ready</Badge>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2 bg-slate-900/50 border-green-500/20 backdrop-blur-xl flex flex-col">
          <CardHeader className="border-b border-green-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-full flex items-center justify-center">
                  <span className="font-medium text-green-400">A</span>
                </div>
                <div>
                  <h4 className="font-medium text-white">Amit Sharma</h4>
                  <p className="text-xs text-muted-foreground">TechStart India • Website Chat</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                <Button variant="ghost" size="sm" className="text-green-400">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 p-4 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    className={`flex ${msg.sender === "agent" ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      msg.sender === "agent" 
                        ? "bg-green-500/20 border border-green-500/30" 
                        : "bg-slate-800/50"
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-white">{msg.name}</span>
                        {msg.isAi && <Bot className="w-3 h-3 text-green-400" />}
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                      <p className="text-sm text-slate-300">{msg.message}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            {/* AI Suggestions */}
            {aiAssistEnabled && (
              <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-xs text-blue-400 flex items-center gap-1 mb-2">
                  <Bot className="w-3 h-3" /> AI Suggested Replies:
                </p>
                <div className="space-y-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left text-xs text-slate-300 hover:bg-green-500/10 hover:text-green-400"
                    >
                      <Zap className="w-3 h-3 mr-2 text-yellow-400" />
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="mt-4 flex items-center gap-2">
              <Input 
                placeholder="Type your message..." 
                className="flex-1 bg-slate-800/50 border-green-500/20"
              />
              <Button className="bg-gradient-to-r from-green-500 to-teal-500 text-slate-950">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatMessageReply;

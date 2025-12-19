import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Shield, Globe, Send, User, Clock, FileText, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const CommunicationHub = () => {
  const [message, setMessage] = useState("");

  const conversations = [
    { id: 1, client: "Client #A7X", company: "Tech Solutions", lastMessage: "Thanks for the demo!", time: "5 min ago", unread: 2, status: "active" },
    { id: 2, client: "Client #B3Y", company: "Healthcare Plus", lastMessage: "When can we schedule...", time: "1 hour ago", unread: 0, status: "active" },
    { id: 3, client: "Client #C9Z", company: "EduLearn Academy", lastMessage: "I have a question about pricing", time: "3 hours ago", unread: 1, status: "waiting" },
  ];

  const chatMessages = [
    { id: 1, sender: "Client #A7X", content: "Hi, I watched the demo you sent. Very impressive!", time: "10:30 AM", isClient: true },
    { id: 2, sender: "You", content: "Thank you! I'm glad you found it helpful. Did you have any questions about the features?", time: "10:32 AM", isClient: false },
    { id: 3, sender: "Client #A7X", content: "Yes, I'm wondering about the integration capabilities with our existing CRM.", time: "10:35 AM", isClient: true },
    { id: 4, sender: "You", content: "Great question! Our system supports seamless integration with most major CRMs including Salesforce, HubSpot, and custom APIs.", time: "10:38 AM", isClient: false },
    { id: 5, sender: "System", content: "Auto-translated from Spanish", time: "10:40 AM", isSystem: true },
    { id: 6, sender: "Client #A7X", content: "Thanks for the demo!", time: "10:42 AM", isClient: true },
  ];

  const cannedReplies = [
    "Thank you for your interest! Let me provide more details...",
    "I'd be happy to schedule a follow-up call to discuss further.",
    "Our pricing starts at $X/month. Would you like a custom quote?",
    "I'll send you the documentation right away.",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-100">Communication Hub</h2>
          <p className="text-slate-400">Masked client chat with auto-translation</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Shield className="w-3 h-3 mr-1" />
            Identity Protected
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Globe className="w-3 h-3 mr-1" />
            Auto-Translate ON
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-cyan-100 text-lg">Conversations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="p-2 space-y-2">
                {conversations.map((conv) => (
                  <motion.div
                    key={conv.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      conv.id === 1 
                        ? "bg-cyan-500/20 border border-cyan-500/30" 
                        : "bg-slate-800/50 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center">
                          <User className="w-4 h-4 text-cyan-400" />
                        </div>
                        <span className="font-medium text-cyan-100 text-sm">{conv.client}</span>
                      </div>
                      {conv.unread > 0 && (
                        <span className="w-5 h-5 bg-cyan-500 rounded-full text-[10px] text-white flex items-center justify-center">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate">{conv.lastMessage}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-slate-500">{conv.time}</span>
                      <Badge className={conv.status === "active" ? "bg-emerald-500/20 text-emerald-300 text-xs" : "bg-amber-500/20 text-amber-300 text-xs"}>
                        {conv.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-slate-900/50 border-cyan-500/20 flex flex-col">
          <CardHeader className="border-b border-cyan-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-cyan-100">Client #A7X</CardTitle>
                  <p className="text-xs text-slate-400">Tech Solutions Ltd • Active now</p>
                </div>
              </div>
              <Badge className="bg-slate-700 text-slate-300">
                <Clock className="w-3 h-3 mr-1" />
                Session: 45 min
              </Badge>
            </div>
          </CardHeader>
          
          <ScrollArea className="flex-1 p-4 h-[350px]">
            <div className="space-y-4">
              {chatMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.isClient ? "justify-start" : "justify-end"}`}
                >
                  {msg.isSystem ? (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2 text-xs text-blue-300">
                      <Globe className="w-3 h-3 inline mr-1" />
                      {msg.content}
                    </div>
                  ) : (
                    <div className={`max-w-[70%] ${msg.isClient ? "bg-slate-800 border-slate-700" : "bg-cyan-500/20 border-cyan-500/30"} border rounded-lg p-3`}>
                      <p className={`text-sm ${msg.isClient ? "text-slate-200" : "text-cyan-100"}`}>{msg.content}</p>
                      <span className="text-xs text-slate-500 mt-1 block">{msg.time}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-cyan-500/20">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
              />
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="bg-slate-900/50 border-cyan-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-cyan-100 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Canned Replies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {cannedReplies.map((reply, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left text-xs text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 h-auto py-2"
                  onClick={() => setMessage(reply)}
                >
                  {reply.substring(0, 40)}...
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-cyan-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-cyan-100 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                AI Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs border-cyan-500/30 text-cyan-300">
                  Suggest integration demo
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs border-cyan-500/30 text-cyan-300">
                  Send pricing sheet
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs border-cyan-500/30 text-cyan-300">
                  Schedule follow-up call
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-900/30 to-cyan-900/30 border-emerald-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-300">85%</div>
              <div className="text-xs text-slate-400">Likely to Convert</div>
              <div className="text-xs text-emerald-400 mt-1">High Priority Lead</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunicationHub;

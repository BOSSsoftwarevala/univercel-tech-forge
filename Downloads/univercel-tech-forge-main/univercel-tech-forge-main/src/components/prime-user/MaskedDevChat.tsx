import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Shield, Clock, Send, Lock, Globe, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const MaskedDevChat = () => {
  const [message, setMessage] = useState("");
  
  const sessions = [
    { id: "DEV-A7X", project: "E-Commerce Platform", status: "active", expiresIn: "2h 30m", messages: 12 },
    { id: "DEV-B3Y", project: "Mobile App Backend", status: "active", expiresIn: "4h 15m", messages: 8 },
    { id: "DEV-C9Z", project: "Analytics Dashboard", status: "expired", expiresIn: "Expired", messages: 25 },
  ];

  const chatMessages = [
    { id: 1, sender: "Developer A7X", content: "I've reviewed your requirements. The API integration will be completed by tomorrow.", time: "10:30 AM", isMe: false },
    { id: 2, sender: "You", content: "Great! Can you also add rate limiting to the endpoints?", time: "10:32 AM", isMe: true },
    { id: 3, sender: "Developer A7X", content: "Yes, I'll implement rate limiting with Redis. Should I add IP-based or token-based limiting?", time: "10:35 AM", isMe: false },
    { id: 4, sender: "You", content: "Token-based would be better for our use case.", time: "10:38 AM", isMe: true },
    { id: 5, sender: "System", content: "Message auto-translated from Spanish", time: "10:40 AM", isSystem: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-amber-100">Masked Developer Access</h2>
        <p className="text-stone-400">Secure, session-based communication with assigned developers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-stone-900/50 border-amber-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-emerald-100">Encrypted</div>
              <div className="text-xs text-stone-400">End-to-end secure</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-stone-900/50 border-amber-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-amber-100">Masked</div>
              <div className="text-xs text-stone-400">Identity protected</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-stone-900/50 border-amber-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Globe className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-blue-100">Auto-Translate</div>
              <div className="text-xs text-stone-400">Multi-language support</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-stone-900/50 border-amber-500/20">
          <CardHeader>
            <CardTitle className="text-amber-100 text-lg">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sessions.map((session) => (
              <motion.div
                key={session.id}
                whileHover={{ scale: 1.02 }}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  session.status === "active" 
                    ? "bg-stone-800/50 border-amber-500/30 hover:border-amber-500/50" 
                    : "bg-stone-800/30 border-stone-700/30 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-400" />
                    <span className="font-mono text-amber-300 text-sm">{session.id}</span>
                  </div>
                  <Badge className={session.status === "active" ? "bg-emerald-500/20 text-emerald-300" : "bg-stone-700 text-stone-400"}>
                    {session.status}
                  </Badge>
                </div>
                <p className="text-stone-300 text-sm mb-1">{session.project}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">{session.messages} messages</span>
                  <span className={session.status === "active" ? "text-amber-400" : "text-stone-500"}>
                    <Clock className="w-3 h-3 inline mr-1" />
                    {session.expiresIn}
                  </span>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-stone-900/50 border-amber-500/20 flex flex-col">
          <CardHeader className="border-b border-amber-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-stone-900" />
                </div>
                <div>
                  <CardTitle className="text-amber-100">Developer A7X</CardTitle>
                  <p className="text-xs text-emerald-400">Online • E-Commerce Platform</p>
                </div>
              </div>
              <Badge className="bg-amber-500/20 text-amber-300">
                <Clock className="w-3 h-3 mr-1" />
                2h 30m remaining
              </Badge>
            </div>
          </CardHeader>
          
          <ScrollArea className="flex-1 p-4 h-[300px]">
            <div className="space-y-4">
              {chatMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
                >
                  {msg.isSystem ? (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2 text-xs text-blue-300">
                      <Globe className="w-3 h-3 inline mr-1" />
                      {msg.content}
                    </div>
                  ) : (
                    <div className={`max-w-[70%] ${msg.isMe ? "bg-amber-500/20 border-amber-500/30" : "bg-stone-800 border-stone-700"} border rounded-lg p-3`}>
                      <p className={`text-sm ${msg.isMe ? "text-amber-100" : "text-stone-200"}`}>{msg.content}</p>
                      <span className="text-xs text-stone-500 mt-1 block">{msg.time}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-amber-500/20">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="bg-stone-800 border-stone-700 text-stone-100 placeholder:text-stone-500"
              />
              <Button className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-900">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MaskedDevChat;

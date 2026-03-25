import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Video, 
  Paperclip,
  Crown,
  Shield,
  Clock,
  CheckCheck
} from "lucide-react";

const AccountManagerChat = () => {
  const [message, setMessage] = useState("");
  
  const messages = [
    {
      id: 1,
      sender: "manager",
      name: "Sarah Mitchell",
      text: "Good morning! Your request is our priority. I've reviewed your latest requirements and the development team is already on it.",
      time: "10:30 AM",
      read: true
    },
    {
      id: 2,
      sender: "user",
      text: "Thank you, Sarah. When can I expect the payment gateway integration to be complete?",
      time: "10:32 AM",
      read: true
    },
    {
      id: 3,
      sender: "manager",
      name: "Sarah Mitchell",
      text: "We are preparing your delivery. The payment gateway will be ready by tomorrow evening. I'll send you a preview link once it's deployed to staging.",
      time: "10:35 AM",
      read: true
    },
    {
      id: 4,
      sender: "manager",
      name: "Sarah Mitchell",
      text: "Your assigned developer is live now and working on the final integration. You can track progress in real-time on your dashboard.",
      time: "10:36 AM",
      read: false
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-stone-900/90 to-stone-950/90 border-amber-500/20 backdrop-blur-xl h-[600px] flex flex-col">
      <CardHeader className="border-b border-amber-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-12 h-12 ring-2 ring-amber-500/50">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-gradient-to-br from-amber-400 to-amber-600 text-stone-900 font-bold">
                  SM
                </AvatarFallback>
              </Avatar>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-stone-900"
              />
            </div>
            <div>
              <CardTitle className="text-amber-100 flex items-center gap-2">
                Sarah Mitchell
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-xs">
                  <Crown className="w-3 h-3 mr-1" />
                  Dedicated Manager
                </Badge>
              </CardTitle>
              <p className="text-sm text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Online now
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-stone-800/50 border border-stone-700/50 flex items-center justify-center text-stone-400 hover:text-amber-400 transition-colors"
            >
              <Phone className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-stone-800/50 border border-stone-700/50 flex items-center justify-center text-stone-400 hover:text-amber-400 transition-colors"
            >
              <Video className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
        
        {/* NDA Mode Toggle */}
        <div className="mt-4 p-3 rounded-lg bg-stone-800/30 border border-stone-700/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-stone-400">NDA Protection Mode</span>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40">
            Active
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] ${msg.sender === "user" ? "order-2" : ""}`}>
                {msg.sender === "manager" && (
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-amber-500 text-stone-900 text-xs">SM</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-amber-400">{msg.name}</span>
                  </div>
                )}
                
                <div
                  className={`p-4 rounded-2xl ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-stone-900"
                      : "bg-stone-800/70 border border-stone-700/50 text-stone-200"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
                
                <div className={`flex items-center gap-1 mt-1 ${msg.sender === "user" ? "justify-end" : ""}`}>
                  <Clock className="w-3 h-3 text-stone-600" />
                  <span className="text-xs text-stone-600">{msg.time}</span>
                  {msg.sender === "user" && msg.read && (
                    <CheckCheck className="w-3 h-3 text-amber-400 ml-1" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Typing Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2"
        >
          <Avatar className="w-6 h-6">
            <AvatarFallback className="bg-amber-500 text-stone-900 text-xs">SM</AvatarFallback>
          </Avatar>
          <div className="px-4 py-2 rounded-full bg-stone-800/50 border border-stone-700/50">
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                  className="w-2 h-2 rounded-full bg-amber-400"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </CardContent>
      
      {/* Message Input */}
      <div className="p-4 border-t border-amber-500/10">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl bg-stone-800/50 border border-stone-700/50 flex items-center justify-center text-stone-400 hover:text-amber-400 transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </motion.button>
          
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 h-12 px-4 rounded-xl bg-stone-800/50 border border-stone-700/50 text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center text-stone-900 shadow-lg shadow-amber-500/30"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
        
        <p className="mt-2 text-xs text-center text-stone-600">
          <Shield className="w-3 h-3 inline mr-1" />
          Messages are encrypted and protected under NDA
        </p>
      </div>
    </Card>
  );
};

export default AccountManagerChat;

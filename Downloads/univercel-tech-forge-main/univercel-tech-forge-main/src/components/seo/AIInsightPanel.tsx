import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AIInsightPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIInsightPanel = ({ isOpen, onClose }: AIInsightPanelProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your SEO AI Assistant. I can help you with keyword strategy, content optimization, backlink analysis, and more. What would you like to improve today?"
    }
  ]);

  const suggestions = [
    "Analyze my top keywords",
    "Suggest content improvements",
    "Find ranking opportunities",
    "Check competitor gaps"
  ];

  const handleSend = () => {
    if (!message.trim()) return;
    
    setMessages(prev => [...prev, { role: "user", content: message }]);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I've analyzed your query. Based on your current SEO metrics, I recommend focusing on long-tail keywords in the African market. Your \"pos software nigeria\" keyword shows strong potential with 15% lower competition than similar terms. Would you like me to generate a content strategy for this keyword cluster?"
      }]);
    }, 1000);
    
    setMessage("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[450px] bg-slate-900 border-l border-cyan-500/20 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">SEO AI Assistant</h3>
                  <p className="text-xs text-cyan-400">Powered by AI</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5 text-slate-400" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                    msg.role === "assistant" 
                      ? "bg-cyan-500/20" 
                      : "bg-purple-500/20"
                  }`}>
                    {msg.role === "assistant" ? (
                      <Bot className="w-5 h-5 text-cyan-400" />
                    ) : (
                      <User className="w-5 h-5 text-purple-400" />
                    )}
                  </div>
                  <div className={`p-3 rounded-lg max-w-[80%] ${
                    msg.role === "assistant"
                      ? "bg-slate-800/50 text-slate-300"
                      : "bg-purple-500/20 text-white"
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Suggestions */}
            <div className="p-4 border-t border-slate-700/50">
              <p className="text-xs text-slate-400 mb-2">Quick actions:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setMessage(suggestion)}
                    className="px-3 py-1 bg-slate-800/50 text-slate-300 text-xs rounded-full hover:bg-slate-700 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about SEO strategy..."
                  className="bg-slate-800/50 border-slate-600"
                />
                <Button 
                  onClick={handleSend}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIInsightPanel;

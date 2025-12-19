import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import softwareValaLogo from '@/assets/software-vala-logo.png';

const FloatingAIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: 'Hello! I\'m your AI assistant. How can I help you today?' }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: 'I understand your request. Let me help you with that...' 
      }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="relative">
          {/* Outer glow rings */}
          <div className="absolute inset-0 rounded-full bg-emerald-500 opacity-20 animate-ping" />
          <div className="absolute -inset-2 rounded-full bg-emerald-500 opacity-10 animate-pulse" />
          
          {/* Main button */}
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-500/50 
                          shadow-[0_0_30px_hsl(145_80%_40%/0.4)]
                          group-hover:border-emerald-400 group-hover:shadow-[0_0_50px_hsl(145_80%_40%/0.6)]
                          transition-all duration-300">
            <img 
              src={softwareValaLogo} 
              alt="AI Assistant" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Sparkle indicator */}
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"
          >
            <Sparkles className="w-3 h-3 text-white" />
          </motion.div>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 rounded-lg bg-slate-900 
                       border border-emerald-500/30 text-sm text-emerald-400
                       opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap
                       shadow-[0_0_20px_hsl(145_80%_40%/0.2)]">
          AI Assistant
        </div>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-slate-900/95 backdrop-blur-xl 
                       border border-emerald-500/30 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500/50">
                  <img src={softwareValaLogo} alt="AI" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">AI Assistant</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-emerald-400">Online</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-emerald-500/20 text-emerald-100 rounded-br-md'
                      : 'bg-slate-800 text-slate-200 rounded-bl-md'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
              <div className="flex items-center gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
                />
                <Button
                  onClick={handleSend}
                  size="sm"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingAIChatbot;
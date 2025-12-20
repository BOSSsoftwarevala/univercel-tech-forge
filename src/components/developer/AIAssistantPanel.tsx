import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, X, Send, Lightbulb, Clock, AlertTriangle, 
  CheckCircle2, Sparkles
} from 'lucide-react';

interface AIAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  embedded?: boolean;
}

const suggestions = [
  "Explain the module requirements",
  "Generate boilerplate code",
  "Highlight risk areas",
  "Estimate task time",
  "Suggest improvements"
];

const AIAssistantPanel = ({ isOpen, onClose, embedded = false }: AIAssistantPanelProps) => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: "Hello! I'm your AI development assistant. I can help you understand requirements, generate code, identify risks, and optimize your workflow. How can I assist you today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I understand your request. Let me analyze the codebase and provide recommendations. Based on the current task structure, I suggest implementing a modular approach with lazy loading for optimal performance." 
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const content = (
    <div className={`flex flex-col ${embedded ? 'h-[calc(100vh-200px)]' : 'h-[65vh]'}`}>
      {/* Header */}
      {!embedded && (
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bot className="w-6 h-6 text-cyan-400" />
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full"
              />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Assistant</h3>
              <p className="text-xs text-emerald-400">Online</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      )}

      {embedded && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Bot className="w-7 h-7 text-cyan-400" />
            AI Development Assistant
          </h2>
          <p className="text-slate-400 mt-1">Get intelligent help with your development tasks</p>
        </div>
      )}

      {/* Suggestions */}
      <div className="p-4 border-b border-slate-700/30">
        <p className="text-xs text-slate-500 mb-2">Quick actions:</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setInput(suggestion)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-300 hover:border-cyan-500/30 hover:text-cyan-400 transition-all"
            >
              {suggestion}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-4 rounded-xl ${
              message.role === 'user'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30'
                : 'bg-slate-800/50 border border-slate-700/30'
            }`}>
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-cyan-400 font-medium">AI Assistant</span>
                </div>
              )}
              <p className="text-sm text-slate-200">{message.content}</p>
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-slate-800/50 border border-slate-700/30 p-4 rounded-xl">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 bg-cyan-400 rounded-full"
                />
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-cyan-400 rounded-full"
                />
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 bg-cyan-400 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-700/30">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about your task..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <>
      {/* Backdrop - click to close */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40"
      />
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        className="fixed right-4 top-20 w-[420px] max-h-[70vh] bg-slate-900 backdrop-blur-xl border border-cyan-500/20 rounded-xl shadow-2xl shadow-cyan-500/10 z-50 flex flex-col overflow-hidden"
      >
        {content}
      </motion.div>
    </>
  );
};

export default AIAssistantPanel;

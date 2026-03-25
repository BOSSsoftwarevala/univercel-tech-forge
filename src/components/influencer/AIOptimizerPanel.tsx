import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Sparkles, Send, TrendingUp, Target, 
  Lightbulb, Zap, BarChart3
} from 'lucide-react';

interface AIOptimizerPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const insights = [
  {
    type: 'opportunity',
    icon: TrendingUp,
    title: 'Trending Product',
    message: 'School ERP is trending in your region. Create content now!',
    action: 'Create Campaign',
    color: 'emerald'
  },
  {
    type: 'optimization',
    icon: Target,
    title: 'Best Posting Time',
    message: 'Your audience is most active between 7-9 PM. Schedule posts accordingly.',
    action: 'Schedule Post',
    color: 'cyan'
  },
  {
    type: 'suggestion',
    icon: Lightbulb,
    title: 'Content Idea',
    message: 'Create a comparison video: Manual vs Digital POS. High engagement potential.',
    action: 'Generate Script',
    color: 'violet'
  },
];

const AIOptimizerPanel = ({ isOpen, onClose }: AIOptimizerPanelProps) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AI Performance Optimizer. I analyze your campaigns, content, and leads to help you maximize earnings. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickActions = [
    "Optimize my best campaign",
    "Suggest content ideas",
    "Analyze my conversion rate",
    "Find trending products"
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Based on your current performance data, I recommend focusing on School ERP promotions. Your conversion rate for education products is 3.2% higher than average. I can help you create optimized content for this segment."
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 400 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 400 }}
      className="fixed right-0 top-16 bottom-0 w-[420px] bg-slate-900/95 backdrop-blur-xl border-l border-violet-500/20 z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Sparkles className="w-6 h-6 text-violet-400" />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full"
            />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Optimizer</h3>
            <p className="text-xs text-emerald-400">Analyzing your performance</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* AI Insights */}
      <div className="p-4 border-b border-slate-700/30">
        <p className="text-xs text-slate-500 mb-3">AI Insights for You</p>
        <div className="space-y-2">
          {insights.map((insight, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-3 rounded-lg bg-${insight.color}-500/5 border border-${insight.color}-500/20`}
            >
              <div className="flex items-start gap-3">
                <insight.icon className={`w-4 h-4 text-${insight.color}-400 mt-0.5`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{insight.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{insight.message}</p>
                  <button className={`mt-2 text-xs text-${insight.color}-400 hover:underline`}>
                    {insight.action} →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-slate-700/30">
        <p className="text-xs text-slate-500 mb-2">Quick actions:</p>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => setInput(action)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-300 hover:border-violet-500/30 hover:text-violet-400 transition-all"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-4 rounded-xl ${
              message.role === 'user'
                ? 'bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-violet-500/30'
                : 'bg-slate-800/50 border border-slate-700/30'
            }`}>
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-violet-400" />
                  <span className="text-xs text-violet-400 font-medium">AI Optimizer</span>
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
                  className="w-2 h-2 bg-violet-400 rounded-full"
                />
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-violet-400 rounded-full"
                />
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 bg-violet-400 rounded-full"
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
            placeholder="Ask about your performance..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-lg shadow-violet-500/20"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default AIOptimizerPanel;

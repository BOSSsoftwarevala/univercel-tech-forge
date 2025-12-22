import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, X, Search, MessageCircle, Map, Crown, HelpCircle, Send } from 'lucide-react';

interface AIBrainWidgetProps {
  onSearch?: (query: string) => void;
}

const AIBrainWidget = forwardRef<HTMLDivElement, AIBrainWidgetProps>(({ onSearch }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const quickActions = [
    { icon: Search, label: 'Search Demo', action: 'Show POS demo', color: 'from-blue-500 to-cyan-500' },
    { icon: Map, label: 'Categories', action: 'Real Estate', color: 'from-purple-500 to-pink-500' },
    { icon: MessageCircle, label: 'Support', action: 'Get help', color: 'from-green-500 to-emerald-500' },
    { icon: Crown, label: 'Go Prime', action: 'Upgrade', color: 'from-amber-500 to-yellow-500' },
    { icon: HelpCircle, label: 'Role Advisor', action: 'Which role?', color: 'from-rose-500 to-orange-500' },
  ];

  const handleSubmit = () => {
    if (query.trim() && onSearch) {
      onSearch(query);
      setQuery('');
    }
  };

  return (
    <div ref={ref}>
      {/* Floating Brain Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="relative">
          {/* Outer glow rings */}
          <div className="absolute inset-0 rounded-full bg-[hsl(210,100%,55%)] opacity-20 animate-ping" />
          <div className="absolute -inset-2 rounded-full bg-[hsl(210,100%,55%)] opacity-10 animate-pulse" />
          
          {/* Main button */}
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(220,20%,12%)] to-[hsl(220,25%,8%)]
                          border-2 border-[hsl(210,100%,55%)/0.5] flex items-center justify-center
                          shadow-[0_0_30px_hsl(210_100%_55%/0.4),inset_0_0_20px_hsl(210_100%_55%/0.1)]
                          group-hover:border-[hsl(210,100%,55%)] group-hover:shadow-[0_0_50px_hsl(210_100%_55%/0.6)]
                          transition-all duration-300">
            {/* Rotating inner ring */}
            <div className="absolute inset-2 rounded-full border border-[hsl(210,100%,55%)/0.3] animate-rotate-slow" />
            
            {/* Brain icon with pulse */}
            <Brain className="w-7 h-7 text-[hsl(210,100%,55%)]" 
                   style={{ filter: 'drop-shadow(0 0 10px hsl(210 100% 55% / 0.8))' }} />
            
            {/* Electric sparks */}
            <div className="absolute top-1 right-1 w-2 h-2 bg-[hsl(210,100%,70%)] rounded-full animate-pulse" />
          </div>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 rounded-lg bg-[hsl(220,20%,12%)] 
                       border border-[hsl(210,100%,55%)/0.3] text-sm text-[hsl(210,100%,55%)]
                       opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap
                       shadow-[0_0_20px_hsl(210_100%_55%/0.2)]">
          Ask AI
        </div>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[500px] rounded-2xl
                         bg-gradient-to-b from-[hsl(220,20%,10%)] to-[hsl(220,25%,6%)]
                         border border-[hsl(210,100%,55%)/0.3] overflow-hidden
                         shadow-[0_0_60px_hsl(210_100%_55%/0.2),0_20px_40px_rgba(0,0,0,0.5)]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[hsl(210,100%,55%)/0.2]
                              bg-gradient-to-r from-[hsl(210,100%,55%)/0.1] to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[hsl(210,100%,55%)/0.2] flex items-center justify-center
                                  border border-[hsl(210,100%,55%)/0.5]">
                    <Brain className="w-5 h-5 text-[hsl(210,100%,55%)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">AI Assistant</h3>
                    <p className="text-xs text-slate-400">Ask anything</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="p-4 border-b border-[hsl(210,100%,55%)/0.1]">
                <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Quick Actions</p>
                <div className="grid grid-cols-3 gap-2">
                  {quickActions.map((action, i) => (
                    <motion.button
                      key={action.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => {
                        setQuery(action.action);
                        handleSubmit();
                      }}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl
                                 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20
                                 transition-all duration-200 group"
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.color} 
                                      flex items-center justify-center opacity-80 group-hover:opacity-100
                                      transition-opacity`}>
                        <action.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs text-slate-400 group-hover:text-white transition-colors">
                        {action.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className="p-4 min-h-[120px] flex items-center justify-center text-center">
                <div className="text-slate-500 text-sm">
                  <Brain className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>Ask me to search demos, navigate, or get support guidance.</p>
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-[hsl(210,100%,55%)/0.1]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="Ask anything..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10
                             text-white placeholder-slate-500 focus:outline-none focus:border-[hsl(210,100%,55%)/0.5]
                             focus:ring-1 focus:ring-[hsl(210,100%,55%)/0.3] transition-all"
                  />
                  <button
                    onClick={handleSubmit}
                    className="px-4 rounded-xl bg-gradient-to-r from-[hsl(210,100%,55%)] to-[hsl(187,100%,50%)]
                             text-white font-medium hover:opacity-90 transition-opacity"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});

AIBrainWidget.displayName = 'AIBrainWidget';

export default AIBrainWidget;

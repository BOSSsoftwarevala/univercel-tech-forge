import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Sparkles, Zap, Target, MessageSquare, 
  Flame, CheckCircle, RefreshCw, Send, Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Lead } from "@/pages/LeadManager";

interface AIActionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

const AIActionPanel = ({ isOpen, onClose, lead }: AIActionPanelProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const aiSuggestions = [
    {
      action: "Next Step",
      suggestion: "Schedule a product demo for School Management module",
      confidence: 94,
      icon: Target,
    },
    {
      action: "Auto-Qualify",
      suggestion: "Lead score: HIGH (85/100) — Budget confirmed, timeline: 2 weeks",
      confidence: 88,
      icon: CheckCircle,
    },
    {
      action: "Auto-Assign",
      suggestion: "Recommended: vala(sales)4771 — Specializes in Education sector",
      confidence: 92,
      icon: Zap,
    },
    {
      action: "Reply Template",
      suggestion: "Use 'Education Intro v2' template — 78% open rate",
      confidence: 85,
      icon: MessageSquare,
    },
  ];

  const replyTemplates = [
    { name: "Initial Contact", category: "Introduction", successRate: 72 },
    { name: "Demo Follow-up", category: "Engagement", successRate: 68 },
    { name: "Price Negotiation", category: "Closing", successRate: 54 },
    { name: "Win-back", category: "Recovery", successRate: 34 },
  ];

  const handleAction = (action: string) => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 1500);
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
            className="fixed right-0 top-0 h-full w-[450px] bg-slate-900 border-l border-indigo-500/20 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI Auto-Action Panel</h3>
                  <p className="text-xs text-indigo-400">Intelligent lead automation</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5 text-slate-400" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Urgency Score */}
              {lead && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl border border-red-500/20"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-red-400" />
                      <span className="font-medium text-white">Heat Indicator</span>
                    </div>
                    <span className="text-2xl font-bold text-red-400">{lead.urgencyScore}</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${lead.urgencyScore}%` }}
                      className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    High urgency — Immediate follow-up recommended
                  </p>
                </motion.div>
              )}

              {/* AI Suggestions */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">AI Suggestions</h4>
                <div className="space-y-3">
                  {aiSuggestions.map((item, index) => (
                    <motion.div
                      key={item.action}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-lg">
                          <item.icon className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-white">{item.action}</span>
                            <span className="text-xs text-green-400">{item.confidence}% confidence</span>
                          </div>
                          <p className="text-sm text-slate-400">{item.suggestion}</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full mt-3 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30"
                        onClick={() => handleAction(item.action)}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Zap className="w-4 h-4 mr-2" />
                        )}
                        Apply
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Reply Templates */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">Reply Templates</h4>
                <div className="grid grid-cols-2 gap-2">
                  {replyTemplates.map((template, index) => (
                    <motion.button
                      key={template.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 text-left hover:border-indigo-500/30 transition-all"
                    >
                      <p className="text-sm font-medium text-white">{template.name}</p>
                      <p className="text-xs text-slate-400">{template.category}</p>
                      <p className="text-xs text-green-400 mt-1">{template.successRate}% success</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* AI Chat */}
              <div className="bg-slate-800/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-medium text-white">Ask AI</span>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask about this lead..."
                    className="bg-slate-900/50 border-slate-600"
                  />
                  <Button className="bg-indigo-500 hover:bg-indigo-600 px-3">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIActionPanel;

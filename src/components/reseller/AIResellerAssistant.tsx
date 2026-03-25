import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Send, Sparkles, Zap, Target, TrendingUp,
  Users, Wallet, MessageSquare, Lightbulb, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useResellerAI } from '@/hooks/useResellerAI';

const AIResellerAssistant = () => {
  const { chat, generatePitch, optimizeCommission, loading } = useResellerAI();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([]);
  const [pitchResult, setPitchResult] = useState<any>(null);
  const [commissionResult, setCommissionResult] = useState<any>(null);

  const quickActions = [
    { label: 'Generate sales pitch', icon: Lightbulb, action: 'pitch' },
    { label: 'Optimize my commissions', icon: Wallet, action: 'commission' },
    { label: 'Best follow-up time', icon: Clock, action: 'followup' },
    { label: 'Closing strategies', icon: Target, action: 'closing' },
  ];

  const handleSend = async () => {
    if (!message.trim()) return;
    
    setChatHistory(prev => [...prev, { role: 'user', content: message }]);
    const userMessage = message;
    setMessage('');

    const response = await chat(userMessage);
    if (response) {
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: response.response || JSON.stringify(response) 
      }]);
    }
  };

  const handleQuickAction = async (action: string) => {
    if (action === 'pitch') {
      const result = await generatePitch({
        leadName: 'Tech Solutions',
        industry: 'Technology',
        painPoints: ['Manual processes', 'Scalability issues'],
        budget: '₹5L+',
        timeline: '30 days',
        objections: ['Price concerns']
      });
      if (result) setPitchResult(result);
    } else if (action === 'commission') {
      const result = await optimizeCommission({
        currentEarnings: 45000,
        commissionRate: 15,
        tierLevel: 'Silver',
        activeDeals: 8,
        conversionRate: 32,
        targetToNextTier: 50000
      });
      if (result) setCommissionResult(result);
    } else {
      setChatHistory(prev => [...prev, { role: 'user', content: action }]);
      const response = await chat(action);
      if (response) {
        setChatHistory(prev => [...prev, { 
          role: 'assistant', 
          content: response.response || JSON.stringify(response) 
        }]);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30"
        >
          <Bot className="w-6 h-6 text-emerald-400" />
        </motion.div>
        <div>
          <h2 className="text-xl font-bold text-white">AI Sales Assistant</h2>
          <p className="text-sm text-slate-400">Your intelligent partner for closing more deals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chat Panel */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            AI Chat
          </h3>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mb-4">
            {quickActions.map((action, i) => (
              <Button
                key={i}
                size="sm"
                variant="outline"
                onClick={() => handleQuickAction(action.action)}
                disabled={loading}
                className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
              >
                <action.icon className="w-3.5 h-3.5 mr-1" />
                {action.label}
              </Button>
            ))}
          </div>

          {/* Chat History */}
          <div className="h-64 overflow-y-auto mb-4 space-y-3 p-2">
            <AnimatePresence>
              {chatHistory.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-emerald-500/20 ml-8 border border-emerald-500/30' 
                      : 'bg-slate-700/50 mr-8 border border-slate-600/50'
                  }`}
                >
                  <p className="text-sm text-slate-200">{msg.content}</p>
                </motion.div>
              ))}
            </AnimatePresence>
            {chatHistory.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <Bot className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Ask me anything about sales, leads, or strategies...</p>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your question..."
              className="bg-slate-900/50 border-emerald-500/30"
            />
            <Button onClick={handleSend} disabled={loading || !message.trim()} className="bg-emerald-600">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className="space-y-4">
          {/* Pitch Generator Result */}
          {pitchResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20"
            >
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-violet-400" />
                Generated Sales Pitch
              </h4>
              {pitchResult.opener && (
                <div className="mb-3">
                  <p className="text-xs text-violet-400 mb-1">Opening</p>
                  <p className="text-sm text-slate-300">{pitchResult.opener}</p>
                </div>
              )}
              {pitchResult.valueProposition && (
                <div className="mb-3">
                  <p className="text-xs text-violet-400 mb-1">Value Proposition</p>
                  <p className="text-sm text-slate-300">{pitchResult.valueProposition}</p>
                </div>
              )}
              {pitchResult.closingStatement && (
                <div className="p-3 rounded-lg bg-violet-500/20 border border-violet-500/30">
                  <p className="text-xs text-violet-400 mb-1">Closing</p>
                  <p className="text-sm text-white font-medium">{pitchResult.closingStatement}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Commission Optimizer Result */}
          {commissionResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20"
            >
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-400" />
                Commission Optimization
              </h4>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-slate-900/50">
                  <p className="text-xs text-slate-500">Current</p>
                  <p className="text-lg font-bold text-white">
                    ₹{(commissionResult.currentEarnings || 45000).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/10">
                  <p className="text-xs text-emerald-400">Potential</p>
                  <p className="text-lg font-bold text-emerald-400">
                    ₹{(commissionResult.potentialEarnings || 72000).toLocaleString()}
                  </p>
                </div>
              </div>
              {commissionResult.optimizationTips && (
                <div className="space-y-2">
                  <p className="text-xs text-amber-400">Optimization Tips:</p>
                  {commissionResult.optimizationTips.slice(0, 3).map((tip: any, i: number) => (
                    <div key={i} className="flex items-start gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-400 mt-0.5" />
                      <span className="text-sm text-slate-300">{tip.tip || tip}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Default Insights */}
          {!pitchResult && !commissionResult && (
            <div className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50 text-center">
              <Sparkles className="w-12 h-12 text-emerald-400/30 mx-auto mb-3" />
              <p className="text-slate-400">
                Use quick actions or chat to get AI-powered insights
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIResellerAssistant;

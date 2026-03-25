import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Briefcase, Brain, Flame, 
  MessageSquare, Wallet, Code2, Timer, Target,
  TrendingUp, Zap, CheckCircle2, Clock, AlertTriangle,
  Star, Send, Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useDeveloperAI } from '@/hooks/useDeveloperAI';

const DeveloperCommandCenter = () => {
  const { chat, loading } = useDeveloperAI();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([]);

  const stats = [
    { label: 'Active Tasks', value: '3', icon: Target, color: 'cyan', trend: '+2 today' },
    { label: 'Completed', value: '127', icon: CheckCircle2, color: 'emerald', trend: 'This month' },
    { label: 'Performance', value: '92%', icon: TrendingUp, color: 'blue', trend: '+5%' },
    { label: 'Earnings', value: '₹45.2K', icon: Wallet, color: 'violet', trend: 'This month' },
  ];

  const activeTasks = [
    { id: 1, title: 'API Integration - Payment Gateway', priority: 'urgent', progress: 65, time: '45 min' },
    { id: 2, title: 'Bug Fix - User Dashboard', priority: 'high', progress: 85, time: '1h 20m' },
    { id: 3, title: 'Feature - Report Generator', priority: 'medium', progress: 30, time: '2h' },
  ];

  const quickActions = [
    { label: 'Optimize my schedule', icon: Clock },
    { label: 'Review my code', icon: Code2 },
    { label: 'Boost productivity', icon: Zap },
    { label: 'Career advice', icon: TrendingUp },
  ];

  const handleSend = async () => {
    if (!message.trim()) return;
    
    setChatHistory(prev => [...prev, { role: 'user', content: message }]);
    const userMessage = message;
    setMessage('');

    const response = await chat(userMessage);
    if (response) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: response.response || JSON.stringify(response) }]);
    }
  };

  const handleQuickAction = async (action: string) => {
    setChatHistory(prev => [...prev, { role: 'user', content: action }]);
    const response = await chat(action);
    if (response) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: response.response || JSON.stringify(response) }]);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <LayoutDashboard className="w-7 h-7 text-cyan-400" />
            Developer Command Center
          </h1>
          <p className="text-slate-400 mt-1">AI-powered workspace for maximum productivity</p>
        </div>
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-full"
        >
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-emerald-400 text-sm font-medium">Online</span>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl bg-${stat.color}-500/20`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
              <span className="text-xs text-slate-500">{stat.trend}</span>
            </div>
            <p className="text-2xl font-bold text-white mt-3">{stat.value}</p>
            <p className="text-sm text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Tasks */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            Active Tasks
          </h2>
          <div className="space-y-4">
            {activeTasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-white">{task.title}</h4>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <span className="text-amber-400 text-sm flex items-center gap-1">
                      <Timer className="w-3.5 h-3.5" />
                      {task.time}
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${task.progress}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-cyan-400">{task.progress}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Chat */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Bot className="w-5 h-5 text-violet-400" />
            AI Assistant
          </h2>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mb-4">
            {quickActions.map((action, i) => (
              <Button
                key={i}
                size="sm"
                variant="outline"
                onClick={() => handleQuickAction(action.label)}
                disabled={loading}
                className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10"
              >
                <action.icon className="w-3.5 h-3.5 mr-1" />
                {action.label}
              </Button>
            ))}
          </div>

          {/* Chat History */}
          <div className="h-48 overflow-y-auto mb-4 space-y-3">
            <AnimatePresence>
              {chatHistory.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-cyan-500/20 ml-8' 
                      : 'bg-violet-500/20 mr-8'
                  }`}
                >
                  <p className="text-sm text-slate-300">{msg.content}</p>
                </motion.div>
              ))}
            </AnimatePresence>
            {chatHistory.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Ask me anything about coding, productivity, or career...</p>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask AI..."
              className="bg-slate-900/50 border-violet-500/30"
            />
            <Button
              onClick={handleSend}
              disabled={loading || !message.trim()}
              className="bg-violet-600 hover:bg-violet-500"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <Star className="w-5 h-5 text-amber-400 mb-2" />
          <p className="text-2xl font-bold text-white">4.8<span className="text-sm text-slate-400">/5</span></p>
          <p className="text-sm text-slate-400">Rating</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
          <p className="text-2xl font-bold text-white">95%</p>
          <p className="text-sm text-slate-400">On-Time Rate</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
          <Code2 className="w-5 h-5 text-blue-400 mb-2" />
          <p className="text-2xl font-bold text-white">92%</p>
          <p className="text-sm text-slate-400">Code Quality</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20">
          <AlertTriangle className="w-5 h-5 text-emerald-400 mb-2" />
          <p className="text-2xl font-bold text-white">0</p>
          <p className="text-sm text-slate-400">Penalties</p>
        </div>
      </div>
    </div>
  );
};

export default DeveloperCommandCenter;

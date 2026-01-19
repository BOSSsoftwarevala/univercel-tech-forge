/**
 * DEVELOPER HOME SCREEN
 * Dashboard with today's tasks, builds, SLA, AI suggestions
 * LOCK: No modifications without approval
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  ListTodo,
  Rocket,
  XCircle,
  Clock,
  Sparkles,
  Heart,
  ArrowRight,
  Play,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';

interface DevHomeScreenProps {
  onNavigate: (section: string) => void;
}

export const DevHomeScreen: React.FC<DevHomeScreenProps> = ({ onNavigate }) => {
  const stats = [
    { label: "Today's Tasks", value: '5', icon: ListTodo, color: 'cyan', trend: '2 urgent' },
    { label: 'Active Builds', value: '3', icon: Rocket, color: 'emerald', trend: '1 deploying' },
    { label: 'Failed Builds', value: '1', icon: XCircle, color: 'red', trend: 'Needs attention' },
    { label: 'SLA Countdown', value: '4h 32m', icon: Clock, color: 'amber', trend: '2 deadlines' },
    { label: 'AI Suggestions', value: '7', icon: Sparkles, color: 'violet', trend: '3 critical' },
    { label: 'Health Score', value: '92%', icon: Heart, color: 'emerald', trend: 'Excellent' }
  ];

  const recentTasks = [
    { id: 1, name: 'Fix login timeout issue', priority: 'high', status: 'in-progress', deadline: '2h' },
    { id: 2, name: 'Deploy CRM module v2.3', priority: 'medium', status: 'pending', deadline: '4h' },
    { id: 3, name: 'Review API security patch', priority: 'high', status: 'pending', deadline: '1h' }
  ];

  const aiSuggestions = [
    { id: 1, type: 'performance', message: 'Optimize database queries in OrderService', impact: 'high' },
    { id: 2, type: 'security', message: 'Update authentication tokens expiry', impact: 'critical' },
    { id: 3, type: 'ux', message: 'Reduce bundle size for faster load times', impact: 'medium' }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
      emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
      red: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
      amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
      violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400' }
    };
    return colors[color] || colors.cyan;
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">Developer Home</h1>
        <p className="text-slate-400 text-sm">Welcome back! Here's your daily overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => {
          const colors = getColorClasses(stat.color);
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-xl ${colors.bg} border ${colors.border}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 ${colors.text}`} />
                <span className="text-xs text-slate-400">{stat.label}</span>
              </div>
              <p className={`text-2xl font-bold ${colors.text}`}>{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.trend}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Today's Tasks</h3>
            <button
              onClick={() => onNavigate('tasks-my')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500' : 'bg-amber-500'
                  }`} />
                  <div>
                    <p className="text-sm text-white">{task.name}</p>
                    <p className="text-xs text-slate-400">Due in {task.deadline}</p>
                  </div>
                </div>
                <button className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors">
                  <Play className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <h3 className="font-semibold text-white">AI Suggestions</h3>
            </div>
            <button
              onClick={() => onNavigate('ai-suggestions')}
              className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {aiSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="p-3 rounded-lg bg-violet-500/5 border border-violet-500/20"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        suggestion.impact === 'critical'
                          ? 'bg-red-500/20 text-red-400'
                          : suggestion.impact === 'high'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {suggestion.impact}
                      </span>
                      <span className="text-xs text-slate-400 capitalize">{suggestion.type}</span>
                    </div>
                    <p className="text-sm text-white">{suggestion.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate('tasks-my')}
          className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors flex items-center gap-3"
        >
          <Play className="w-5 h-5" />
          <span className="font-medium">Resume Work</span>
        </button>
        <button
          onClick={() => onNavigate('home')}
          className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors flex items-center gap-3"
        >
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">View Alerts</span>
        </button>
        <button
          onClick={() => onNavigate('projects-active')}
          className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors flex items-center gap-3"
        >
          <FolderOpen className="w-5 h-5" />
          <span className="font-medium">Open Project</span>
        </button>
        <button
          onClick={() => onNavigate('build-queue')}
          className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 hover:bg-violet-500/20 transition-colors flex items-center gap-3"
        >
          <Rocket className="w-5 h-5" />
          <span className="font-medium">Start Build</span>
        </button>
      </div>
    </div>
  );
};

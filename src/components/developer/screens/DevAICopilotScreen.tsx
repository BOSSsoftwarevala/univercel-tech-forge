/**
 * DEVELOPER AI CO-PILOT SCREEN
 * Vala AI: Suggestions, Auto Fix, Code Assist
 * LOCK: No modifications without approval
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Shield,
  Palette,
  CheckCircle,
  XCircle,
  Eye,
  Play,
  Send,
  ArrowRight
} from 'lucide-react';

interface DevAICopilotScreenProps {
  view: 'suggestions' | 'autofix' | 'assist';
}

export const DevAICopilotScreen: React.FC<DevAICopilotScreenProps> = ({ view }) => {
  const suggestions = [
    { id: 1, type: 'performance', title: 'Optimize database queries in OrderService', description: 'Found 3 N+1 queries that can be batched', impact: 'high', file: 'src/services/OrderService.ts', confidence: 94 },
    { id: 2, type: 'security', title: 'Update authentication token expiry', description: 'Current token lifetime exceeds recommended 15 minutes', impact: 'critical', file: 'src/auth/tokenManager.ts', confidence: 98 },
    { id: 3, type: 'ux', title: 'Reduce bundle size for faster load', description: 'Identified 3 unused dependencies that can be removed', impact: 'medium', file: 'package.json', confidence: 87 }
  ];

  const autoFixes = [
    { id: 1, title: 'Memory leak fix in EventHandler', status: 'ready', description: 'Auto-generated patch to clear event listeners on unmount', linesChanged: 12 },
    { id: 2, title: 'SQL injection prevention', status: 'ready', description: 'Parameterized query replacement for search function', linesChanged: 8 },
    { id: 3, title: 'Deprecated API migration', status: 'pending-review', description: 'Updated SDK calls to v3 API format', linesChanged: 45 }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'performance': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'security': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'ux': return 'bg-violet-500/20 text-violet-400 border-violet-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'performance': return <Zap className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'ux': return <Palette className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-500/20 text-red-400';
      case 'high': return 'bg-amber-500/20 text-amber-400';
      case 'medium': return 'bg-emerald-500/20 text-emerald-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {view === 'suggestions' ? 'AI Suggestions' : view === 'autofix' ? 'Auto Fix' : 'Code Assist'}
          </h1>
          <p className="text-slate-400 text-sm">Powered by Vala AI</p>
        </div>
      </div>

      {/* Suggestions View */}
      {view === 'suggestions' && (
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-5 rounded-xl bg-slate-900/50 border border-slate-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getTypeColor(suggestion.type)}`}>
                    {getTypeIcon(suggestion.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{suggestion.title}</h3>
                    <p className="text-sm text-slate-400 mt-1">{suggestion.description}</p>
                    <p className="text-xs text-slate-500 mt-2 font-mono">{suggestion.file}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs rounded-full ${getImpactColor(suggestion.impact)}`}>
                    {suggestion.impact.toUpperCase()}
                  </span>
                  <p className="text-xs text-slate-400 mt-2">{suggestion.confidence}% confidence</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Apply Suggestion
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors text-sm">
                  <XCircle className="w-4 h-4" />
                  Dismiss
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-colors text-sm">
                  <Eye className="w-4 h-4" />
                  Request Review
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Auto Fix View */}
      {view === 'autofix' && (
        <div className="space-y-4">
          {autoFixes.map((fix, index) => (
            <motion.div
              key={fix.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-5 rounded-xl bg-slate-900/50 border border-slate-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{fix.title}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      fix.status === 'ready'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {fix.status === 'ready' ? 'Ready to Apply' : 'Pending Review'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">{fix.description}</p>
                </div>
                <span className="text-xs text-slate-500">{fix.linesChanged} lines changed</span>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-sm">
                  <Play className="w-4 h-4" />
                  Apply Fix
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors text-sm">
                  <Eye className="w-4 h-4" />
                  Preview Changes
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Code Assist View */}
      {view === 'assist' && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/30">
            <h3 className="font-semibold text-white mb-4">Ask Vala AI</h3>
            <div className="relative">
              <textarea
                placeholder="Ask about code optimization, debugging help, best practices..."
                className="w-full h-32 p-4 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 resize-none focus:outline-none focus:border-violet-500/50"
              />
              <button className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500 text-white hover:bg-violet-600 transition-colors text-sm">
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <button className="p-4 rounded-xl bg-slate-900/50 border border-slate-700 hover:border-violet-500/30 transition-colors text-left">
              <Zap className="w-6 h-6 text-cyan-400 mb-2" />
              <h4 className="font-medium text-white mb-1">Performance Tips</h4>
              <p className="text-xs text-slate-400">Get optimization suggestions for your code</p>
            </button>
            <button className="p-4 rounded-xl bg-slate-900/50 border border-slate-700 hover:border-violet-500/30 transition-colors text-left">
              <Shield className="w-6 h-6 text-red-400 mb-2" />
              <h4 className="font-medium text-white mb-1">Security Review</h4>
              <p className="text-xs text-slate-400">Identify potential vulnerabilities</p>
            </button>
            <button className="p-4 rounded-xl bg-slate-900/50 border border-slate-700 hover:border-violet-500/30 transition-colors text-left">
              <Palette className="w-6 h-6 text-violet-400 mb-2" />
              <h4 className="font-medium text-white mb-1">UX Improvements</h4>
              <p className="text-xs text-slate-400">Enhance user experience</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

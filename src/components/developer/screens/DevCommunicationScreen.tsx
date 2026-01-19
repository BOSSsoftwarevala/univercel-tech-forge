/**
 * DEVELOPER COMMUNICATION SCREEN
 * Internal Chat and Issue Threads
 * LOCK: No modifications without approval
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Send,
  User,
  Clock,
  Lock,
  Globe,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface DevCommunicationScreenProps {
  view: 'chat' | 'issues';
}

export const DevCommunicationScreen: React.FC<DevCommunicationScreenProps> = ({ view }) => {
  const [message, setMessage] = useState('');

  const chatMessages = [
    { id: 1, sender: 'DEV-001', message: 'Started working on the authentication fix', time: '14:32', isOwn: true },
    { id: 2, sender: 'DEV-042', message: 'I can help with the database optimization if needed', time: '14:35', isOwn: false },
    { id: 3, sender: 'DEV-001', message: 'Thanks! I\'ll reach out once I complete the current task', time: '14:36', isOwn: true },
    { id: 4, sender: 'LEAD-007', message: 'Good progress everyone. Daily standup in 30 minutes', time: '14:40', isOwn: false },
    { id: 5, sender: 'DEV-023', message: 'The staging deployment is complete', time: '14:45', isOwn: false }
  ];

  const issueThreads = [
    { id: 1, title: 'Login timeout issue', status: 'open', messages: 12, lastUpdate: '10 min ago', priority: 'high' },
    { id: 2, title: 'Payment gateway integration', status: 'in-progress', messages: 8, lastUpdate: '1h ago', priority: 'medium' },
    { id: 3, title: 'Dashboard performance', status: 'resolved', messages: 24, lastUpdate: '3h ago', priority: 'low' },
    { id: 4, title: 'API rate limiting', status: 'open', messages: 5, lastUpdate: '2h ago', priority: 'high' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-500/20 text-red-400';
      case 'in-progress': return 'bg-amber-500/20 text-amber-400';
      case 'resolved': return 'bg-emerald-500/20 text-emerald-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500/30';
      case 'medium': return 'border-amber-500/30';
      case 'low': return 'border-slate-500/30';
      default: return 'border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          {view === 'chat' ? 'Internal Chat' : 'Issue Threads'}
        </h1>
        <p className="text-slate-400 text-sm">
          {view === 'chat' ? 'Masked identity • No copy/delete • Auto-translate' : 'Track and discuss project issues'}
        </p>
      </div>

      {/* Rules Banner */}
      {view === 'chat' && (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <Lock className="w-5 h-5 text-amber-400" />
          <div className="text-sm">
            <span className="text-amber-400 font-medium">Chat Rules: </span>
            <span className="text-slate-300">No copy • No delete • Masked identity • Auto-translate enabled</span>
          </div>
        </div>
      )}

      {/* Chat View */}
      {view === 'chat' && (
        <div className="rounded-xl bg-slate-900/50 border border-slate-700 overflow-hidden">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${msg.isOwn ? 'order-2' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium ${msg.isOwn ? 'text-cyan-400' : 'text-slate-400'}`}>
                      {msg.sender}
                    </span>
                    <span className="text-xs text-slate-500">{msg.time}</span>
                  </div>
                  <div className={`p-3 rounded-xl ${
                    msg.isOwn
                      ? 'bg-cyan-500/20 border border-cyan-500/30 text-white'
                      : 'bg-slate-800 border border-slate-700 text-slate-300'
                  }`}>
                    {msg.message}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-slate-400">EN</span>
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <button className="p-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Issues View */}
      {view === 'issues' && (
        <div className="space-y-4">
          {issueThreads.map((thread, index) => (
            <motion.div
              key={thread.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-xl bg-slate-900/50 border ${getPriorityColor(thread.priority)} hover:bg-slate-800/50 cursor-pointer transition-colors`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{thread.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {thread.messages} messages
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {thread.lastUpdate}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(thread.status)}`}>
                  {thread.status.replace('-', ' ')}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Clock, AlertCircle, Globe, Smile, Frown, 
  Meh, MessageCircle, ArrowUpRight, Zap, Tag
} from 'lucide-react';

const tickets = [
  {
    id: 'TKT-1247',
    userId: 'vala(client)***',
    category: 'POS System',
    urgency: 'high',
    language: 'Hindi',
    sentiment: 'frustrated',
    issue: 'Invoice generation failing after update',
    time: '5 min ago',
  },
  {
    id: 'TKT-1246',
    userId: 'vala(franchise)***',
    category: 'School ERP',
    urgency: 'medium',
    language: 'English',
    sentiment: 'neutral',
    issue: 'Need help with student data import',
    time: '12 min ago',
  },
  {
    id: 'TKT-1245',
    userId: 'vala(reseller)***',
    category: 'Dashboard',
    urgency: 'low',
    language: 'English',
    sentiment: 'positive',
    issue: 'Feature request for export options',
    time: '28 min ago',
  },
  {
    id: 'TKT-1244',
    userId: 'vala(client)***',
    category: 'Hospital CRM',
    urgency: 'high',
    language: 'Marathi',
    sentiment: 'frustrated',
    issue: 'Patient records not syncing properly',
    time: '45 min ago',
  },
];

const cannedResponses = [
  "I understand your concern. Let me help you resolve this.",
  "Thank you for your patience. I'm looking into this now.",
  "I've identified the issue. Here's how we can fix it.",
  "This has been escalated to our technical team.",
];

const TicketInbox = () => {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const getUrgencyConfig = (urgency: string) => {
    const configs: Record<string, { color: string; label: string }> = {
      high: { color: 'rose', label: 'High' },
      medium: { color: 'amber', label: 'Medium' },
      low: { color: 'emerald', label: 'Low' },
    };
    return configs[urgency] || configs.medium;
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Smile className="w-4 h-4 text-emerald-400" />;
      case 'frustrated': return <Frown className="w-4 h-4 text-rose-400" />;
      default: return <Meh className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Ticket Inbox</h2>
          <p className="text-slate-400 mt-1">Manage and respond to support requests</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            2 High Priority
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm">
            12 Open
          </span>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {tickets.map((ticket, index) => {
          const urgencyConfig = getUrgencyConfig(ticket.urgency);
          const isSelected = selectedTicket === ticket.id;

          return (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className={`rounded-2xl bg-slate-900/40 backdrop-blur-xl border transition-all duration-300 ${
                isSelected 
                  ? 'border-teal-500/30 shadow-lg shadow-teal-500/5' 
                  : 'border-slate-700/30 hover:border-slate-600/40'
              }`}
            >
              {/* Ticket Header */}
              <div 
                className="p-5 cursor-pointer"
                onClick={() => setSelectedTicket(isSelected ? null : ticket.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-mono text-slate-400">{ticket.id}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium bg-${urgencyConfig.color}-500/10 text-${urgencyConfig.color}-400 border border-${urgencyConfig.color}-500/20`}>
                        {urgencyConfig.label}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs bg-slate-700/30 text-slate-400">
                        {ticket.category}
                      </span>
                    </div>
                    <p className="text-white font-medium mb-2">{ticket.issue}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        {ticket.userId}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {ticket.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5" />
                        {ticket.language}
                      </span>
                    </div>
                  </div>

                  {/* Sentiment & Quick Actions */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/30">
                      {getSentimentIcon(ticket.sentiment)}
                      <span className="text-xs text-slate-400 capitalize">{ticket.sentiment}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Actions */}
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-5 pb-5 border-t border-slate-700/30"
                >
                  <div className="pt-4 space-y-4">
                    {/* Canned Responses */}
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Quick Responses:</p>
                      <div className="flex flex-wrap gap-2">
                        {cannedResponses.map((response, i) => (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-3 py-2 rounded-lg bg-slate-800/30 border border-slate-700/30 text-xs text-slate-300 hover:border-teal-500/20 hover:text-teal-400 transition-all text-left"
                          >
                            {response}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 hover:bg-teal-500/20 transition-all text-sm font-medium"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Reply
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/30 border border-slate-700/30 text-slate-300 hover:border-amber-500/20 hover:text-amber-400 transition-all text-sm font-medium"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                        Escalate
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/30 border border-slate-700/30 text-slate-300 hover:border-sky-500/20 hover:text-sky-400 transition-all text-sm font-medium"
                      >
                        <Zap className="w-4 h-4" />
                        AI Assist
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TicketInbox;

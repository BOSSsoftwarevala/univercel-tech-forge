import { motion } from 'framer-motion';
import { 
  AlertTriangle, Clock, User, ArrowUpRight, 
  Zap, MessageCircle, Timer
} from 'lucide-react';

const priorityTickets = [
  {
    id: 'TKT-1247',
    userId: 'vala(client)***',
    issue: 'Production system down - Invoice generation failing',
    category: 'POS System',
    waitTime: '8 min',
    slaRemaining: '22 min',
    urgencyLevel: 'critical',
  },
  {
    id: 'TKT-1244',
    userId: 'vala(client)***',
    issue: 'Patient records not syncing - affecting operations',
    category: 'Hospital CRM',
    waitTime: '15 min',
    slaRemaining: '45 min',
    urgencyLevel: 'high',
  },
  {
    id: 'TKT-1240',
    userId: 'vala(franchise)***',
    issue: 'Demo system not loading for client presentation',
    category: 'Demo Engine',
    waitTime: '22 min',
    slaRemaining: '38 min',
    urgencyLevel: 'high',
  },
];

const PriorityQueue = () => {
  const getUrgencyStyles = (level: string) => {
    if (level === 'critical') {
      return {
        border: 'border-rose-500/30',
        bg: 'bg-rose-500/5',
        badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
        pulse: true
      };
    }
    return {
      border: 'border-amber-500/20',
      bg: 'bg-amber-500/5',
      badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      pulse: false
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            Priority Queue
          </h2>
          <p className="text-slate-400 mt-1">Tickets requiring immediate attention</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-2 bg-rose-400 rounded-full"
          />
          <span className="text-sm text-rose-400">{priorityTickets.length} tickets need action</span>
        </div>
      </div>

      {/* SLA Warning */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center gap-4"
      >
        <Timer className="w-5 h-5 text-amber-400" />
        <div className="flex-1">
          <p className="text-sm text-amber-400 font-medium">SLA Reminder</p>
          <p className="text-xs text-slate-400 mt-0.5">High priority tickets should be acknowledged within 15 minutes and resolved within 1 hour.</p>
        </div>
      </motion.div>

      {/* Priority Tickets */}
      <div className="space-y-4">
        {priorityTickets.map((ticket, index) => {
          const styles = getUrgencyStyles(ticket.urgencyLevel);

          return (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-5 rounded-2xl ${styles.bg} border ${styles.border} backdrop-blur-xl relative overflow-hidden`}
            >
              {/* Urgency Indicator */}
              {styles.pulse && (
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}

              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-mono text-slate-400">{ticket.id}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${styles.badge}`}>
                      {ticket.urgencyLevel === 'critical' ? 'CRITICAL' : 'HIGH PRIORITY'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs bg-slate-700/30 text-slate-400">
                      {ticket.category}
                    </span>
                  </div>
                  <p className="text-white font-medium text-lg mb-3">{ticket.issue}</p>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <User className="w-4 h-4" />
                      {ticket.userId}
                    </span>
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <Clock className="w-4 h-4" />
                      Waiting: {ticket.waitTime}
                    </span>
                    <span className={`flex items-center gap-1.5 ${
                      parseInt(ticket.slaRemaining) < 30 ? 'text-rose-400' : 'text-slate-400'
                    }`}>
                      <Timer className="w-4 h-4" />
                      SLA: {ticket.slaRemaining}
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-400 hover:bg-teal-500/30 transition-all text-sm font-medium"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Take Ticket
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/30 border border-slate-700/30 text-slate-300 hover:text-sky-400 hover:border-sky-500/20 transition-all text-sm font-medium"
                  >
                    <Zap className="w-4 h-4" />
                    AI Quick Fix
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/30 border border-slate-700/30 text-slate-300 hover:text-amber-400 hover:border-amber-500/20 transition-all text-sm font-medium"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    Escalate
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Escalation Flow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-5 rounded-2xl bg-slate-900/40 border border-slate-700/30"
      >
        <h3 className="text-sm font-medium text-slate-400 mb-4">Escalation Flow</h3>
        <div className="flex items-center justify-between">
          {['Support', 'Developer', 'R&D', 'Boss'].map((step, i) => (
            <div key={step} className="flex items-center">
              <div className={`px-4 py-2 rounded-lg ${
                i === 0 ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' : 'bg-slate-800/30 text-slate-400'
              }`}>
                {step}
              </div>
              {i < 3 && (
                <ArrowUpRight className="w-4 h-4 text-slate-600 mx-2" />
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-3">All escalations are logged and tracked automatically.</p>
      </motion.div>
    </div>
  );
};

export default PriorityQueue;

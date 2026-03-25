import { motion } from 'framer-motion';
import { FileSearch, User, Clock } from 'lucide-react';

const auditLogs = [
  { id: 1, action: 'Influencer Approved', user: 'Admin_001', role: 'Influencer Manager', target: 'Vik****_123', time: '2 hours ago' },
  { id: 2, action: 'Campaign Assigned', user: 'System', role: 'AI', target: 'India Tech Launch', time: '3 hours ago' },
  { id: 3, action: 'Payout Released', user: 'Admin_002', role: 'Finance Approver', target: '₹45,000 to Vik****', time: '4 hours ago' },
  { id: 4, action: 'Fraud Alert Triggered', user: 'AI System', role: 'Fraud Detection', target: 'Sus****_001', time: '5 hours ago' },
  { id: 5, action: 'Account Suspended', user: 'Admin_001', role: 'Influencer Manager', target: 'Anu****_012', time: '6 hours ago' },
  { id: 6, action: 'Content Approved', user: 'Admin_003', role: 'Content Reviewer', target: 'Post ID: 78945', time: '7 hours ago' },
  { id: 7, action: 'Platform Verified', user: 'AI System', role: 'Verification', target: 'YouTube: Pri****', time: '8 hours ago' },
  { id: 8, action: 'SLA Breach Alert', user: 'System', role: 'SLA Monitor', target: 'Campaign: UK Push', time: '9 hours ago' },
];

const IMAuditLog = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Influencer Audit Log</h1>
        <span className="text-sm text-slate-400">(Immutable • Read-only)</span>
      </div>

      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
        <div className="flex items-center gap-2 text-blue-400 text-sm">
          <FileSearch className="w-4 h-4" />
          <span>Every action is logged • Time + Role Trace • Cannot be modified or deleted</span>
        </div>
      </div>

      <div className="space-y-3">
        {auditLogs.map((log, index) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
                  <FileSearch className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <div className="font-medium text-white">{log.action}</div>
                  <div className="text-sm text-slate-400">
                    Target: {log.target}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-slate-300">
                    <User className="w-3 h-3" />
                    {log.user}
                  </div>
                  <div className="text-xs text-slate-500">{log.role}</div>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  {log.time}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default IMAuditLog;

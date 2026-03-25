import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  History, Search, Filter, Clock, User, 
  CheckCircle, XCircle, Edit, ArrowRight, FileText,
  Download, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface LogEntry {
  id: string;
  taskId: string;
  taskTitle: string;
  action: string;
  actor: string;
  actorRole: string;
  timestamp: string;
  details?: string;
  oldValue?: string;
  newValue?: string;
}

const mockLogs: LogEntry[] = [
  { id: '1', taskId: 'T001', taskTitle: 'POS Module Enhancement', action: 'Task Created', actor: 'vala(sales)4771', actorRole: 'Sales', timestamp: '2024-01-16 09:00:00', details: 'New task created with high priority' },
  { id: '2', taskId: 'T001', taskTitle: 'POS Module Enhancement', action: 'Status Changed', actor: 'vala(dev)4412', actorRole: 'Developer', timestamp: '2024-01-16 09:30:00', oldValue: 'New', newValue: 'In Progress' },
  { id: '3', taskId: 'T001', taskTitle: 'POS Module Enhancement', action: 'Timer Started', actor: 'vala(dev)4412', actorRole: 'Developer', timestamp: '2024-01-16 09:30:00', details: 'Agreed to 6 hour delivery window' },
  { id: '4', taskId: 'T002', taskTitle: 'Hospital Dashboard', action: 'Task Rejected', actor: 'vala(cs)1234', actorRole: 'Client Success', timestamp: '2024-01-16 11:00:00', details: 'UI needs adjustment per client feedback' },
  { id: '5', taskId: 'T002', taskTitle: 'Hospital Dashboard', action: 'Reassigned', actor: 'vala(admin)001', actorRole: 'Admin', timestamp: '2024-01-16 11:15:00', oldValue: 'vala(dev)7823', newValue: 'vala(dev)4412' },
  { id: '6', taskId: 'T003', taskTitle: 'School ERP API', action: 'Subtask Added', actor: 'vala(dev)5567', actorRole: 'Developer', timestamp: '2024-01-16 12:00:00', details: 'Added "Database Migration" subtask' },
  { id: '7', taskId: 'T001', taskTitle: 'POS Module Enhancement', action: 'Comment Added', actor: 'vala(qa)2341', actorRole: 'QA', timestamp: '2024-01-16 14:00:00', details: 'Test cases prepared for review' },
  { id: '8', taskId: 'T001', taskTitle: 'POS Module Enhancement', action: 'Priority Changed', actor: 'vala(admin)001', actorRole: 'Admin', timestamp: '2024-01-16 15:00:00', oldValue: 'High', newValue: 'Critical' },
];

const actionIcons: Record<string, any> = {
  'Task Created': CheckCircle,
  'Status Changed': ArrowRight,
  'Timer Started': Clock,
  'Task Rejected': XCircle,
  'Reassigned': User,
  'Subtask Added': FileText,
  'Comment Added': Edit,
  'Priority Changed': ArrowRight,
};

const actionColors: Record<string, string> = {
  'Task Created': 'emerald',
  'Status Changed': 'blue',
  'Timer Started': 'violet',
  'Task Rejected': 'red',
  'Reassigned': 'orange',
  'Subtask Added': 'cyan',
  'Comment Added': 'slate',
  'Priority Changed': 'yellow',
};

const TaskHistoryLogs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [logs] = useState<LogEntry[]>(mockLogs);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterAction === 'all' || log.action === filterAction;
    return matchesSearch && matchesFilter;
  });

  const uniqueActions = [...new Set(logs.map(l => l.action))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Task History & Audit Logs</h2>
          <p className="text-slate-400 mt-1">Immutable timestamp logs with complete action trail</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by task, user, or action..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-900/50 border-slate-600"
          />
        </div>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600 text-white text-sm"
        >
          <option value="all">All Actions</option>
          {uniqueActions.map((action) => (
            <option key={action} value={action}>{action}</option>
          ))}
        </select>
      </div>

      {/* Logs Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        {filteredLogs.map((log, index) => {
          const ActionIcon = actionIcons[log.action] || History;
          const color = actionColors[log.action] || 'slate';

          return (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="flex gap-4"
            >
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-lg bg-${color}-500/20 flex items-center justify-center`}>
                  <ActionIcon className={`w-5 h-5 text-${color}-400`} />
                </div>
                {index < filteredLogs.length - 1 && (
                  <div className="w-px flex-1 bg-slate-700/50 my-2" />
                )}
              </div>

              {/* Log Content */}
              <div className="flex-1 pb-4">
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={`bg-${color}-500/20 text-${color}-400`}>
                        {log.action}
                      </Badge>
                      <span className="text-xs font-mono text-slate-500">{log.taskId}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {log.timestamp}
                    </div>
                  </div>

                  {/* Task Title */}
                  <h4 className="font-medium text-white mb-2">{log.taskTitle}</h4>

                  {/* Actor */}
                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                    <User className="w-4 h-4" />
                    <span>{log.actor}</span>
                    <Badge variant="outline" className="text-xs">{log.actorRole}</Badge>
                  </div>

                  {/* Details */}
                  {log.details && (
                    <p className="text-sm text-slate-300 p-2 rounded bg-slate-900/50">
                      {log.details}
                    </p>
                  )}

                  {/* Value Change */}
                  {log.oldValue && log.newValue && (
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <span className="px-2 py-1 rounded bg-red-500/10 text-red-400">{log.oldValue}</span>
                      <ArrowRight className="w-4 h-4 text-slate-500" />
                      <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400">{log.newValue}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Empty State */}
      {filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No logs found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default TaskHistoryLogs;

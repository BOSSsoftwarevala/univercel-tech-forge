import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, ChevronLeft, ChevronRight, AlertTriangle, 
  User, Clock, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface GanttTask {
  id: string;
  title: string;
  assignee: string;
  startDay: number;
  duration: number;
  progress: number;
  status: 'on_track' | 'at_risk' | 'delayed' | 'completed';
  dependencies?: string[];
}

const mockTasks: GanttTask[] = [
  { id: 'T001', title: 'Database Schema Design', assignee: 'vala(dev)4412', startDay: 1, duration: 3, progress: 100, status: 'completed' },
  { id: 'T002', title: 'API Development', assignee: 'vala(dev)7823', startDay: 3, duration: 5, progress: 65, status: 'on_track', dependencies: ['T001'] },
  { id: 'T003', title: 'Frontend UI', assignee: 'vala(dev)5567', startDay: 5, duration: 7, progress: 30, status: 'at_risk', dependencies: ['T002'] },
  { id: 'T004', title: 'Testing & QA', assignee: 'vala(qa)2341', startDay: 10, duration: 4, progress: 0, status: 'on_track', dependencies: ['T003'] },
  { id: 'T005', title: 'Payment Integration', assignee: 'vala(dev)4412', startDay: 8, duration: 6, progress: 20, status: 'delayed', dependencies: ['T002'] },
  { id: 'T006', title: 'Documentation', assignee: 'vala(doc)1111', startDay: 12, duration: 3, progress: 0, status: 'on_track', dependencies: ['T004'] },
];

const days = Array.from({ length: 21 }, (_, i) => i + 1);

const TaskGanttView = () => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'emerald';
      case 'on_track': return 'blue';
      case 'at_risk': return 'yellow';
      case 'delayed': return 'red';
      default: return 'slate';
    }
  };

  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'completed': return 'from-emerald-500 to-emerald-400';
      case 'on_track': return 'from-blue-500 to-cyan-400';
      case 'at_risk': return 'from-yellow-500 to-orange-400';
      case 'delayed': return 'from-red-500 to-rose-400';
      default: return 'from-slate-500 to-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Visual Timeline & Gantt View</h2>
          <p className="text-slate-400 mt-1">Cross-team dependency view with timeline flags</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setCurrentWeek(w => Math.max(0, w - 1))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-slate-400 min-w-[100px] text-center">
              Week {currentWeek + 1} - {currentWeek + 3}
            </span>
            <Button size="sm" variant="outline" onClick={() => setCurrentWeek(w => w + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-3">
            {['completed', 'on_track', 'at_risk', 'delayed'].map((status) => (
              <div key={status} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded bg-gradient-to-r ${getStatusGradient(status)}`} />
                <span className="text-xs text-slate-400 capitalize">{status.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gantt Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-slate-800/50 border border-slate-700/50 overflow-hidden"
      >
        {/* Timeline Header */}
        <div className="flex border-b border-slate-700/50">
          <div className="w-64 flex-shrink-0 p-3 bg-slate-900/50 border-r border-slate-700/50">
            <span className="text-sm font-medium text-slate-400">Task</span>
          </div>
          <div className="flex-1 flex">
            {days.map((day) => (
              <div
                key={day}
                className={`flex-1 p-2 text-center border-r border-slate-700/30 ${
                  day === 8 ? 'bg-violet-500/10' : ''
                }`}
              >
                <span className="text-xs text-slate-500">Day {day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Task Rows */}
        {mockTasks.map((task, index) => {
          const color = getStatusColor(task.status);
          const gradient = getStatusGradient(task.status);
          const isHovered = hoveredTask === task.id;

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex border-b border-slate-700/30 ${isHovered ? 'bg-slate-700/20' : ''}`}
              onMouseEnter={() => setHoveredTask(task.id)}
              onMouseLeave={() => setHoveredTask(null)}
            >
              {/* Task Info */}
              <div className="w-64 flex-shrink-0 p-3 bg-slate-900/30 border-r border-slate-700/50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500">{task.id}</span>
                  {task.status === 'delayed' && (
                    <AlertTriangle className="w-3 h-3 text-red-400" />
                  )}
                  {task.status === 'completed' && (
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                  )}
                </div>
                <p className="text-sm text-white font-medium truncate">{task.title}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                  <User className="w-3 h-3" />
                  {task.assignee}
                </div>
              </div>

              {/* Timeline Bar */}
              <div className="flex-1 flex relative py-3">
                {days.map((day) => (
                  <div
                    key={day}
                    className={`flex-1 border-r border-slate-700/30 ${
                      day === 8 ? 'bg-violet-500/5' : ''
                    }`}
                  />
                ))}
                
                {/* Task Bar */}
                <motion.div
                  className="absolute top-3 bottom-3 rounded-lg overflow-hidden cursor-pointer"
                  style={{
                    left: `${((task.startDay - 1) / 21) * 100}%`,
                    width: `${(task.duration / 21) * 100}%`,
                  }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  {/* Background */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-30`} />
                  
                  {/* Progress */}
                  <motion.div
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${gradient}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${task.progress}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                  
                  {/* Border */}
                  <div className={`absolute inset-0 border-2 border-${color}-500/50 rounded-lg`} />
                  
                  {/* Label */}
                  <div className="absolute inset-0 flex items-center px-2">
                    <span className="text-xs font-medium text-white truncate">
                      {task.progress}%
                    </span>
                  </div>
                </motion.div>

                {/* Dependency Lines */}
                {task.dependencies?.map((depId) => {
                  const depTask = mockTasks.find(t => t.id === depId);
                  if (!depTask) return null;
                  
                  const depEnd = depTask.startDay + depTask.duration - 1;
                  const taskStart = task.startDay;
                  
                  return (
                    <svg
                      key={depId}
                      className="absolute inset-0 pointer-events-none"
                      style={{ overflow: 'visible' }}
                    >
                      <motion.line
                        x1={`${(depEnd / 21) * 100}%`}
                        y1="50%"
                        x2={`${((taskStart - 1) / 21) * 100}%`}
                        y2="50%"
                        stroke={`hsl(var(--${color}-400))`}
                        strokeWidth="1"
                        strokeDasharray="4,2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="text-slate-500"
                        style={{ stroke: '#64748b' }}
                      />
                    </svg>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Today Indicator Legend */}
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <div className="w-px h-4 bg-violet-500" />
        <span>Today (Day 8)</span>
        <Clock className="w-4 h-4 ml-4" />
        <span>Total Duration: 15 days</span>
      </div>
    </div>
  );
};

export default TaskGanttView;

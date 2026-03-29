import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, XCircle, Clock, User, MessageSquare, 
  ArrowRight, FileText, AlertTriangle, RotateCcw, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface ReviewStep {
  role: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  reviewer?: string;
  timestamp?: string;
  comment?: string;
}

interface TaskForReview {
  id: string;
  title: string;
  developer: string;
  submittedAt: string;
  currentStep: number;
  reviewSteps: ReviewStep[];
  changeLog: Array<{ version: string; changes: string; date: string }>;
}

const mockTasksForReview: TaskForReview[] = [
  {
    id: 'T001',
    title: 'POS Module Multi-Currency Support',
    developer: 'vala(dev)4412',
    submittedAt: '2024-01-16 14:30',
    currentStep: 1,
    reviewSteps: [
      { role: 'Developer', status: 'approved', reviewer: 'vala(dev)4412', timestamp: '2024-01-16 14:30', comment: 'Code complete' },
      { role: 'Tester', status: 'in_review', reviewer: 'vala(qa)5678' },
      { role: 'Client Success', status: 'pending' },
      { role: 'Final Approval', status: 'pending' },
    ],
    changeLog: [
      { version: 'v1.0', changes: 'Initial implementation', date: '2024-01-15' },
      { version: 'v1.1', changes: 'Bug fixes and optimization', date: '2024-01-16' },
    ]
  },
  {
    id: 'T002',
    title: 'Hospital Dashboard Analytics',
    developer: 'vala(dev)7823',
    submittedAt: '2024-01-15 10:00',
    currentStep: 2,
    reviewSteps: [
      { role: 'Developer', status: 'approved', reviewer: 'vala(dev)7823', timestamp: '2024-01-15 10:00' },
      { role: 'Tester', status: 'approved', reviewer: 'vala(qa)2341', timestamp: '2024-01-15 16:30', comment: 'All tests passed' },
      { role: 'Client Success', status: 'rejected', reviewer: 'vala(cs)1234', timestamp: '2024-01-16 09:00', comment: 'UI needs adjustment per client feedback' },
      { role: 'Final Approval', status: 'pending' },
    ],
    changeLog: [
      { version: 'v1.0', changes: 'Initial implementation', date: '2024-01-14' },
      { version: 'v1.1', changes: 'Test fixes', date: '2024-01-15' },
    ]
  },
];

const TaskApprovalWorkflow = () => {
  const [tasks] = useState<TaskForReview[]>(mockTasksForReview);
  const [selectedTask, setSelectedTask] = useState<TaskForReview | null>(null);
  const [reviewComment, setReviewComment] = useState('');

  const getStepColor = (status: string) => {
    switch (status) {
      case 'approved': return 'emerald';
      case 'rejected': return 'red';
      case 'in_review': return 'blue';
      default: return 'slate';
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      case 'in_review': return Clock;
      default: return Clock;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Approval & Review Workflow</h2>
        <p className="text-slate-400 mt-1">Multi-stage review process with change log versioning</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Task List */}
        <div className="col-span-2 space-y-4">
          {tasks.map((task, index) => {
            const hasRejection = task.reviewSteps.some(s => s.status === 'rejected');
            
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border backdrop-blur-sm cursor-pointer transition-all ${
                  selectedTask?.id === task.id
                    ? 'bg-violet-500/10 border-violet-500/50'
                    : hasRejection
                    ? 'bg-red-500/5 border-red-500/30 hover:border-red-500/50'
                    : 'bg-slate-800/50 border-slate-700/50 hover:border-violet-500/30'
                }`}
                onClick={() => setSelectedTask(task)}
              >
                {/* Task Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500">{task.id}</span>
                      {hasRejection && (
                        <Badge className="bg-red-500/20 text-red-400">
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Needs Fix
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-medium text-white mt-1">{task.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <User className="w-3 h-3" />
                      {task.developer} • Submitted {task.submittedAt}
                    </div>
                  </div>
                </div>

                {/* Review Pipeline */}
                <div className="flex items-center gap-2">
                  {task.reviewSteps.map((step, stepIndex) => {
                    const StepIcon = getStepIcon(step.status);
                    const color = getStepColor(step.status);
                    
                    return (
                      <div key={stepIndex} className="flex items-center">
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-${color}-500/10 border border-${color}-500/30`}>
                          <StepIcon className={`w-4 h-4 text-${color}-400`} />
                          <span className={`text-xs font-medium text-${color}-400`}>{step.role}</span>
                        </div>
                        {stepIndex < task.reviewSteps.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-slate-600 mx-1" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div className="space-y-4">
          {selectedTask ? (
            <>
              {/* Review Steps Detail */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
              >
                <h3 className="text-sm font-medium text-slate-400 mb-4">Review History</h3>
                <div className="space-y-3">
                  {selectedTask.reviewSteps.map((step, index) => {
                    const StepIcon = getStepIcon(step.status);
                    const color = getStepColor(step.status);
                    
                    return (
                      <div key={index} className={`p-3 rounded-lg border bg-${color}-500/5 border-${color}-500/20`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <StepIcon className={`w-4 h-4 text-${color}-400`} />
                            <span className="text-sm font-medium text-white">{step.role}</span>
                          </div>
                          <Badge className={`bg-${color}-500/20 text-${color}-400 text-xs`}>
                            {step.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        {step.reviewer && (
                          <p className="text-xs text-slate-400">
                            By {step.reviewer} {step.timestamp && `• ${step.timestamp}`}
                          </p>
                        )}
                        {step.comment && (
                          <p className="text-xs text-slate-300 mt-2 p-2 bg-slate-900/50 rounded">
                            "{step.comment}"
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Change Log */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
              >
                <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Change Log
                </h3>
                <div className="space-y-2">
                  {selectedTask.changeLog.map((log, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded bg-slate-900/50">
                      <div>
                        <span className="text-xs font-mono text-violet-400">{log.version}</span>
                        <p className="text-sm text-slate-300">{log.changes}</p>
                      </div>
                      <span className="text-xs text-slate-500">{log.date}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/30"
              >
                <h3 className="text-sm font-medium text-white mb-3">Take Action</h3>
                <Textarea
                  placeholder="Add review comment..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="bg-slate-900/50 border-slate-600 mb-3 text-sm"
                />
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button size="sm" className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30">
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
                <Button size="sm" variant="outline" className="w-full mt-2">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Request Fix
                </Button>
              </motion.div>
            </>
          ) : (
            <div className="p-8 text-center">
              <Eye className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">Select a task to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskApprovalWorkflow;

import React, { useState } from 'react';
import { 
  Code2, Clock, Play, Pause, Square, CheckCircle, AlertTriangle,
  FileCode, MessageSquare, Zap, Trophy, Star, Filter, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TimerWidget } from '../components/TimerWidget';
import { WalletChip } from '../components/WalletChip';
import { DataTable } from '../components/DataTable';
import { WireframeModal } from '../components/WireframeModal';
import { toast } from 'sonner';

const mockTasks = [
  { id: 'T-1234', title: 'API Integration for CRM', status: 'in_progress', stack: ['PHP', 'MySQL'], deadline: '2 hours', progress: 65, client: 'CLI***042' },
  { id: 'T-1235', title: 'Bug Fix - Login Module', status: 'pending', stack: ['React', 'Node'], deadline: '4 hours', progress: 0, client: 'CLI***018' },
  { id: 'T-1236', title: 'Dashboard UI Redesign', status: 'review', stack: ['React', 'Tailwind'], deadline: '1 day', progress: 100, client: 'CLI***089' },
  { id: 'T-1237', title: 'Payment Gateway Integration', status: 'pending', stack: ['Node', 'Stripe'], deadline: '6 hours', progress: 0, client: 'CLI***034' },
];

const skillTags = ['PHP', 'Node', 'React', 'Python', 'Java', 'MySQL', 'MongoDB', 'AWS'];

export function DeveloperScreen() {
  const [showPromiseModal, setShowPromiseModal] = useState(false);
  const [activeTask, setActiveTask] = useState(mockTasks[0]);
  const [timerStatus, setTimerStatus] = useState<'running' | 'paused'>('running');
  const isDark = true;

  const handlePause = () => {
    setTimerStatus('paused');
    toast.info('Timer paused');
  };

  const handleStop = () => {
    setTimerStatus('paused');
    toast.success('Task completed!');
  };

  const statusColors = {
    pending: 'bg-amber-500',
    in_progress: 'bg-cyan-500',
    review: 'bg-purple-500',
    completed: 'bg-emerald-500'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Code2 className="h-6 w-6 text-purple-500" />
            Developer Dashboard
          </h1>
          <p className="text-muted-foreground">DEV***042 • Full Stack Developer</p>
        </div>
        <div className="flex items-center gap-3">
          <WalletChip balance={12450} compact isDark={isDark} />
          <Badge className="bg-gradient-to-r from-emerald-500 to-cyan-500">
            <Trophy className="h-3 w-3 mr-1" />
            Score: 94.2
          </Badge>
        </div>
      </div>

      {/* Active Timer (Prominent) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TimerWidget
            taskId={activeTask.id}
            taskTitle={activeTask.title}
            elapsedTime="02:34:12"
            status={timerStatus}
            progress={activeTask.progress}
            deadline={activeTask.deadline}
            onPause={handlePause}
            onStop={handleStop}
            isDark={isDark}
          />
        </div>

        {/* Performance Panel */}
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            Performance Score
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Speed', value: 92, color: 'bg-cyan-500' },
              { label: 'Quality', value: 95, color: 'bg-emerald-500' },
              { label: 'Behavior', value: 88, color: 'bg-purple-500' },
            ].map((metric) => (
              <div key={metric.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>{metric.label}</span>
                  <span className="font-semibold">{metric.value}%</span>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skill Tags */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
        <h3 className="font-semibold mb-3">Skill Tags</h3>
        <div className="flex flex-wrap gap-2">
          {skillTags.map((skill) => (
            <Badge 
              key={skill} 
              variant="outline" 
              className={`cursor-pointer hover:bg-cyan-500/20 ${
                ['PHP', 'React', 'Node'].includes(skill) ? 'bg-cyan-500/20 border-cyan-500' : ''
              }`}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Task List with Code Status */}
      <div className={`rounded-xl border overflow-hidden ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
        <div className={`p-4 border-b ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Task Queue</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search tasks..." className="pl-10 w-60" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-700">
          {mockTasks.map((task) => (
            <div 
              key={task.id}
              className={`p-4 hover:bg-slate-800/50 transition-colors cursor-pointer ${
                activeTask.id === task.id ? 'bg-cyan-500/10 border-l-4 border-l-cyan-500' : ''
              }`}
              onClick={() => setActiveTask(task)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`h-3 w-3 rounded-full ${statusColors[task.status as keyof typeof statusColors]}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{task.id}</Badge>
                      <h4 className="font-medium">{task.title}</h4>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {task.stack.map((s) => (
                        <Badge key={s} variant="outline" className="text-[10px] bg-purple-500/10">
                          {s}
                        </Badge>
                      ))}
                      <span className="text-xs text-muted-foreground">• Client: {task.client}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Deadline</p>
                    <p className="text-sm font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {task.deadline}
                    </p>
                  </div>
                  {task.status === 'pending' ? (
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-cyan-500 to-purple-500"
                      onClick={(e) => { e.stopPropagation(); setShowPromiseModal(true); }}
                    >
                      I Promise
                    </Button>
                  ) : task.status === 'in_progress' ? (
                    <Badge className="bg-cyan-500">In Progress</Badge>
                  ) : (
                    <Badge className="bg-purple-500">Under Review</Badge>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              {task.status !== 'pending' && (
                <div className="mt-3">
                  <Progress value={task.progress} className="h-1" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Code Status Steps */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
        <h3 className="font-semibold mb-4">Code Status Pipeline</h3>
        <div className="flex items-center justify-between">
          {['To-Do', 'Building', 'Testing', 'Review', 'Delivered'].map((step, idx) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  idx <= 2 ? 'bg-cyan-500' : 'bg-slate-700'
                }`}>
                  {idx <= 2 ? <CheckCircle className="h-5 w-5 text-white" /> : <span className="text-sm">{idx + 1}</span>}
                </div>
                <span className="text-xs mt-2">{step}</span>
              </div>
              {idx < 4 && (
                <div className={`flex-1 h-1 mx-2 ${idx < 2 ? 'bg-cyan-500' : 'bg-slate-700'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Masked Chat Dock */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-cyan-500" />
            Task Chat (Masked)
          </h3>
          <Badge variant="outline" className="text-[10px]">
            CLI***042
          </Badge>
        </div>
        <div className={`h-32 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
          <p className="text-muted-foreground text-sm">Chat messages with masked identity</p>
        </div>
      </div>

      {/* Promise Modal */}
      <WireframeModal
        open={showPromiseModal}
        onClose={() => setShowPromiseModal(false)}
        title="Task Promise Agreement"
        subtitle="Please read and acknowledge before starting"
        isDark={isDark}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowPromiseModal(false)}>Cancel</Button>
            <Button className="bg-gradient-to-r from-cyan-500 to-purple-500">
              I Agree & Start Task
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${isDark ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-500">Promise Terms</h4>
                <ul className="text-sm mt-2 space-y-1 text-muted-foreground">
                  <li>• I will complete this task within the deadline</li>
                  <li>• I will maintain quality standards</li>
                  <li>• I will communicate any blockers immediately</li>
                  <li>• Failure may result in wallet penalties</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </WireframeModal>
    </div>
  );
}

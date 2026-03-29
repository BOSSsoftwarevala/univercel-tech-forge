import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  Brain,
  Bot,
  CheckCircle2,
  Clock3,
  Cpu,
  GitBranch,
  LogOut,
  Plus,
  RefreshCw,
  Shield,
  Sparkles,
  UserRound,
  Wand2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import TaskCreationPanel from '@/components/tasks/TaskCreationPanel';
import { useAuth } from '@/hooks/useAuth';
import { CreateDeveloperTaskInput } from '@/hooks/useDeveloperTaskSystem';
import useDeveloperWorkflowCenter from '@/hooks/useDeveloperWorkflowCenter';
import useTaskManagerGodMode from '@/hooks/useTaskManagerGodMode';

const FILTERS = ['all', 'active', 'completed', 'rejected', 'delayed'] as const;

const METRIC_CARDS = [
  { key: 'total', label: 'Total Tasks', icon: Cpu, accent: 'text-cyan-300', border: 'border-cyan-500/30' },
  { key: 'active', label: 'Active', icon: Activity, accent: 'text-violet-300', border: 'border-violet-500/30' },
  { key: 'aiTasks', label: 'AI Tasks', icon: Bot, accent: 'text-emerald-300', border: 'border-emerald-500/30' },
  { key: 'humanTasks', label: 'Human Tasks', icon: UserRound, accent: 'text-amber-300', border: 'border-amber-500/30' },
  { key: 'completed', label: 'Completed', icon: CheckCircle2, accent: 'text-green-300', border: 'border-green-500/30' },
  { key: 'delayed', label: 'Delayed', icon: AlertTriangle, accent: 'text-red-300', border: 'border-red-500/30' },
] as const;

const TaskManager = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const workflow = useDeveloperWorkflowCenter();
  const godMode = useTaskManagerGodMode(workflow);

  const [showCreateTask, setShowCreateTask] = useState(false);
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>('all');
  const [taskAssignments, setTaskAssignments] = useState<Record<string, string>>({});
  const [taskNotes, setTaskNotes] = useState<Record<string, string>>({});
  const [accessReasons, setAccessReasons] = useState<Record<string, string>>({});
  const [tempAccessExpiries, setTempAccessExpiries] = useState<Record<string, string>>({});
  const [godModeNote, setGodModeNote] = useState('');
  const [newSprint, setNewSprint] = useState({ title: '', description: '', startDate: '', endDate: '' });
  const [newBug, setNewBug] = useState({ title: '', description: '', severity: 'medium' });

  const filteredTasks = useMemo(() => {
    if (activeFilter === 'all') {
      return workflow.tasks;
    }

    if (activeFilter === 'active') {
      return workflow.tasks.filter((task) => ['assigned', 'accepted', 'in_progress', 'paused', 'testing', 'qa_queue', 'review', 'escalated'].includes(task.status));
    }

    if (activeFilter === 'completed') {
      return workflow.tasks.filter((task) => task.status === 'completed');
    }

    if (activeFilter === 'rejected') {
      return workflow.tasks.filter((task) => task.status === 'rejected' || task.qualityStatus === 'rejected');
    }

    return workflow.tasks.filter((task) => task.deadlineBreached && task.status !== 'completed');
  }, [activeFilter, workflow.tasks]);

  const latestPenalties = useMemo(() => {
    return [...workflow.tasks]
      .filter((task) => task.penaltyAmount > 0)
      .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
      .slice(0, 5);
  }, [workflow.tasks]);

  const pendingSubmissions = useMemo(() => {
    return workflow.submissions.filter((submission: any) => submission.review_status === 'pending').slice(0, 6);
  }, [workflow.submissions]);

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleCreateTask = async (payload: CreateDeveloperTaskInput) => {
    await workflow.createTask.mutateAsync(payload);
    setShowCreateTask(false);
  };

  const handleTaskAssignment = async (taskId: string, alreadyAssigned: boolean) => {
    const developerId = taskAssignments[taskId] || workflow.tasks.find((task) => task.id === taskId)?.developerId || '';
    if (!developerId) {
      toast.error('Select a developer first.');
      return;
    }

    if (alreadyAssigned) {
      await workflow.reassignTask.mutateAsync({ taskId, developerId });
      return;
    }

    await workflow.assignTask.mutateAsync({ taskId, developerId });
  };

  const handleCreateSprint = async () => {
    if (!newSprint.title.trim()) {
      toast.error('Sprint title is required.');
      return;
    }

    await workflow.createSprint.mutateAsync(newSprint);
    setNewSprint({ title: '', description: '', startDate: '', endDate: '' });
  };

  const handleReportBug = async () => {
    if (!newBug.title.trim() || !newBug.description.trim()) {
      toast.error('Bug title and description are required.');
      return;
    }

    await workflow.reportBug.mutateAsync(newBug);
    setNewBug({ title: '', description: '', severity: 'medium' });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_35%),linear-gradient(160deg,#020617,#0f172a_45%,#111827)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl backdrop-blur"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-emerald-300/80">
                <Shield className="h-4 w-4" />
                Developer + AI Command Grid
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight">Task, QA, Bug, Alert, Security</h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-300">
                Real manager workflow for assignment, reassignment, build control, QA review, bug handling, access lock, alerts, and system toggles.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.2em] text-emerald-200/80">Signed In</div>
                <div className="mt-1 text-sm font-medium text-white">{user?.email || 'Task Manager'}</div>
              </div>
              <Button onClick={() => setShowCreateTask(true)} className="bg-emerald-500 text-slate-950 hover:bg-emerald-400">
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
              <Button variant="outline" className="border-white/20 bg-white/5" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            {METRIC_CARDS.map((card) => {
              const Icon = card.icon;
              const value = workflow.metrics[card.key];

              return (
                <div key={card.key} className={`rounded-2xl border ${card.border} bg-white/5 p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{card.label}</div>
                    <Icon className={`h-4 w-4 ${card.accent}`} />
                  </div>
                  <div className={`mt-4 text-3xl font-semibold ${card.accent}`}>{value}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-red-200/80">Penalty Exposure</div>
              <div className="mt-3 text-2xl font-semibold text-red-200">₹{workflow.metrics.penalties.toFixed(0)}</div>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-emerald-200/80">Reward Pool</div>
              <div className="mt-3 text-2xl font-semibold text-emerald-200">₹{workflow.metrics.rewards.toFixed(0)}</div>
            </div>
            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-violet-200/80">Workforce Mix</div>
              <div className="mt-3 text-sm text-slate-200">
                {workflow.humanDevelopers.length} human developers + {workflow.aiAgents.length} AI agents available
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Brain className="h-4 w-4 text-cyan-200" />
                  Task Manager God Mode
                </div>
                <p className="mt-2 max-w-3xl text-sm text-slate-200">
                  Predictive routing, self-heal retries, SLA shields, reusable templates, and optional zero-click orchestration on the live task tables.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-white/15 bg-slate-950/50 p-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">High Risk</div>
                  <div className="mt-2 text-2xl font-semibold text-red-200">{godMode.summary.highRiskTasks}</div>
                </div>
                <div className="rounded-2xl border border-white/15 bg-slate-950/50 p-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Open Failures</div>
                  <div className="mt-2 text-2xl font-semibold text-amber-200">{godMode.summary.openFailures}</div>
                </div>
                <div className="rounded-2xl border border-white/15 bg-slate-950/50 p-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Automation Coverage</div>
                  <div className="mt-2 text-2xl font-semibold text-emerald-200">{godMode.summary.automationCoverage}%</div>
                </div>
                <div className="rounded-2xl border border-white/15 bg-slate-950/50 p-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Zero Click</div>
                  <div className="mt-2 text-lg font-semibold text-white">{godMode.summary.zeroClickEnabled ? 'ACTIVE' : 'MANUAL'}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Execution Board</h2>
                <p className="mt-1 text-sm text-slate-400">Assignment, pause, escalation, close, build control, and QA entry points.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {FILTERS.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-full px-4 py-2 text-sm capitalize transition ${
                      activeFilter === filter
                        ? 'bg-emerald-500 text-slate-950'
                        : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {workflow.isLoading && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
                  Loading task orchestration system...
                </div>
              )}

              {!workflow.isLoading && filteredTasks.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
                  No tasks matched the selected filter.
                </div>
              )}

              {filteredTasks.map((task) => (
                <div key={task.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  {(() => {
                    const prediction = godMode.predictionsByTaskId[task.id];

                    return (
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="border-white/20 bg-white/5 text-slate-200">{task.module}</Badge>
                        <Badge className={task.assignedToType === 'ai' ? 'bg-emerald-500/20 text-emerald-200' : 'bg-amber-500/20 text-amber-200'}>
                          {task.assignedToType === 'ai' ? 'AI' : 'Human'}
                        </Badge>
                        <Badge className="bg-cyan-500/15 text-cyan-100">{task.complexityLabel}</Badge>
                        <Badge className={task.qualityStatus === 'rejected' ? 'bg-red-500/20 text-red-200' : 'bg-violet-500/20 text-violet-200'}>
                          {task.qualityStatus}
                        </Badge>
                        {prediction && (
                          <Badge className={prediction.risk_level === 'critical' ? 'bg-red-500/20 text-red-200' : prediction.risk_level === 'high' ? 'bg-amber-500/20 text-amber-200' : 'bg-cyan-500/20 text-cyan-200'}>
                            risk {prediction.delay_risk_score}
                          </Badge>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                        <p className="mt-1 max-w-3xl text-sm text-slate-300">{task.description}</p>
                      </div>

                      <div className="grid gap-2 text-sm text-slate-300 md:grid-cols-2 xl:grid-cols-4">
                        <div>Assigned: <span className="text-white">{task.assignedToName}</span></div>
                        <div>Priority: <span className="text-white capitalize">{task.priority}</span></div>
                        <div>Confidence: <span className="text-white">{task.assignmentConfidence}%</span></div>
                        <div>Status: <span className="text-white capitalize">{task.status.replace('_', ' ')}</span></div>
                      </div>

                      {prediction && (
                        <div className="grid gap-2 text-sm text-slate-300 md:grid-cols-2 xl:grid-cols-4">
                          <div>Predicted Success: <span className="text-white">{prediction.success_score}%</span></div>
                          <div>Projected Cost: <span className="text-white">{prediction.cost_score}</span></div>
                          <div>Recommendation: <span className="text-white capitalize">{prediction.recommended_owner_type}</span></div>
                          <div>Next Action: <span className="text-white capitalize">{prediction.next_best_action.replace(/_/g, ' ')}</span></div>
                        </div>
                      )}

                      <div className="grid gap-3 md:grid-cols-2">
                        <select
                          value={taskAssignments[task.id] || task.developerId || ''}
                          onChange={(event) => setTaskAssignments((current) => ({ ...current, [task.id]: event.target.value }))}
                          className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white"
                        >
                          <option value="">Select developer</option>
                          {workflow.humanDevelopers.map((developer) => (
                            <option key={developer.id} value={developer.id}>{developer.fullName}</option>
                          ))}
                        </select>
                        <input
                          value={taskNotes[task.id] || ''}
                          onChange={(event) => setTaskNotes((current) => ({ ...current, [task.id]: event.target.value }))}
                          placeholder="Reason, rejection note, QA note"
                          className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                        />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {task.requiredSkills.map((skill) => (
                          <span key={`${task.id}-${skill}`} className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-200">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                        <Button onClick={() => handleTaskAssignment(task.id, Boolean(task.developerId))} className="bg-cyan-500 text-slate-950 hover:bg-cyan-400">
                          {task.developerId ? 'Reassign' : 'Assign'}
                        </Button>
                        <Button variant="outline" className="border-amber-500/30 bg-amber-500/10" onClick={() => workflow.pauseTask.mutateAsync({ taskId: task.id, reason: taskNotes[task.id] || 'Paused by manager' })}>
                          Pause
                        </Button>
                        <Button variant="outline" className="border-red-500/30 bg-red-500/10" onClick={() => workflow.escalateTask.mutateAsync({ taskId: task.id, reason: taskNotes[task.id] || 'Escalated by manager' })}>
                          Escalate
                        </Button>
                        <Button variant="outline" className="border-white/20 bg-white/5" onClick={() => workflow.closeTask.mutateAsync({ taskId: task.id, reason: taskNotes[task.id] || 'Closed by manager' })}>
                          Close
                        </Button>
                        <Button variant="outline" className="border-red-500/30 bg-red-500/10" onClick={() => workflow.rejectTask.mutateAsync({ taskId: task.id, reason: taskNotes[task.id] || 'Rejected by manager' })}>
                          Reject
                        </Button>
                        <Button variant="outline" className="border-emerald-500/30 bg-emerald-500/10" onClick={() => workflow.startBuild.mutateAsync(task.id)}>
                          Start Build
                        </Button>
                        <Button variant="outline" className="border-white/20 bg-white/5" onClick={() => workflow.stopBuild.mutateAsync({ taskId: task.id, errorMessage: taskNotes[task.id] || undefined })}>
                          Stop Build
                        </Button>
                        <Button variant="outline" className="border-violet-500/30 bg-violet-500/10" onClick={() => workflow.sendBuildToQa.mutateAsync(task.id)}>
                          Send To QA
                        </Button>
                        <Button variant="outline" className="border-orange-500/30 bg-orange-500/10" onClick={() => workflow.retryBuild.mutateAsync({ taskId: task.id, errorMessage: taskNotes[task.id] || undefined })}>
                          Retry Build
                        </Button>
                        <Button variant="outline" className="border-emerald-500/30 bg-emerald-500/10" onClick={() => godMode.createTemplateFromTask.mutateAsync({ taskId: task.id, name: `${task.title} Template` })}>
                          Save Template
                        </Button>
                      </div>
                    </div>

                    <div className="min-w-[260px] rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Deadline</span>
                        <span className={task.deadlineBreached ? 'text-red-200' : 'text-white'}>
                          {task.deadline ? new Date(task.deadline).toLocaleString() : 'No deadline'}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-slate-400">Quality Score</span>
                        <span className="text-white">{task.qualityScore ?? '--'}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-slate-400">Actual Time</span>
                        <span className="text-white">{task.actualMinutes} min</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-slate-400">Penalty</span>
                        <span className="text-red-200">₹{task.penaltyAmount.toFixed(0)}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-slate-400">Reward</span>
                        <span className="text-emerald-200">₹{task.rewardAmount.toFixed(0)}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-slate-400">Auto Deploy</span>
                        <span className="text-white capitalize">{task.autoDeployStatus.replace('_', ' ')}</span>
                      </div>

                      {task.qualityFeedback && (
                        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-300">
                          {task.qualityFeedback}
                        </div>
                      )}

                      {prediction?.rationale && (
                        <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-xs text-cyan-100">
                          {prediction.rationale}
                        </div>
                      )}

                      {task.qualityStatus === 'rejected' && (
                        <Button onClick={() => workflow.overrideApproval.mutateAsync(task.id)} className="mt-4 w-full bg-amber-400 text-slate-950 hover:bg-amber-300">
                          Manual Override
                        </Button>
                      )}
                    </div>
                  </div>
                    );
                  })()}
                </div>
              ))}
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-3xl border border-cyan-500/20 bg-slate-950/60 p-5 backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Brain className="h-4 w-4 text-cyan-300" />
                God Mode Command Center
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Average Delay Risk</div>
                  <div className="mt-2 text-2xl font-semibold text-red-200">{godMode.summary.averageDelayRisk}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Average Success Score</div>
                  <div className="mt-2 text-2xl font-semibold text-emerald-200">{godMode.summary.averageSuccessScore}</div>
                </div>
              </div>

              <input
                value={godModeNote}
                onChange={(event) => setGodModeNote(event.target.value)}
                placeholder="Operator note for the next autonomous cycle"
                className="mt-4 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500"
              />

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button
                  onClick={() => godMode.saveSettings.mutateAsync({ zero_click_enabled: !godMode.godModeSettings.zero_click_enabled })}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-white"
                >
                  <span>Zero Click Mode</span>
                  <Badge className={godMode.godModeSettings.zero_click_enabled ? 'bg-emerald-500/20 text-emerald-200' : 'bg-slate-700 text-slate-200'}>
                    {godMode.godModeSettings.zero_click_enabled ? 'ON' : 'OFF'}
                  </Badge>
                </button>
                <button
                  onClick={() => godMode.saveSettings.mutateAsync({ auto_assign_enabled: !godMode.godModeSettings.auto_assign_enabled })}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-white"
                >
                  <span>Auto Assign</span>
                  <Badge className={godMode.godModeSettings.auto_assign_enabled ? 'bg-emerald-500/20 text-emerald-200' : 'bg-slate-700 text-slate-200'}>
                    {godMode.godModeSettings.auto_assign_enabled ? 'ON' : 'OFF'}
                  </Badge>
                </button>
                <button
                  onClick={() => godMode.saveSettings.mutateAsync({ auto_heal_enabled: !godMode.godModeSettings.auto_heal_enabled })}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-white"
                >
                  <span>Self Heal</span>
                  <Badge className={godMode.godModeSettings.auto_heal_enabled ? 'bg-emerald-500/20 text-emerald-200' : 'bg-slate-700 text-slate-200'}>
                    {godMode.godModeSettings.auto_heal_enabled ? 'ON' : 'OFF'}
                  </Badge>
                </button>
                <button
                  onClick={() => godMode.saveSettings.mutateAsync({ sla_guard_enabled: !godMode.godModeSettings.sla_guard_enabled })}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-white"
                >
                  <span>SLA Shield</span>
                  <Badge className={godMode.godModeSettings.sla_guard_enabled ? 'bg-emerald-500/20 text-emerald-200' : 'bg-slate-700 text-slate-200'}>
                    {godMode.godModeSettings.sla_guard_enabled ? 'ON' : 'OFF'}
                  </Badge>
                </button>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <Button onClick={() => godMode.runCommand.mutateAsync({ commandKey: 'full_cycle', note: godModeNote || 'Manual full God Mode cycle.' })} className="bg-cyan-500 text-slate-950 hover:bg-cyan-400">
                  <Brain className="mr-2 h-4 w-4" />
                  Full Cycle
                </Button>
                <Button variant="outline" className="border-white/20 bg-white/5" onClick={() => godMode.runCommand.mutateAsync({ commandKey: 'refresh_predictions', note: godModeNote || 'Refresh prediction matrix.' })}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Predictions
                </Button>
                <Button variant="outline" className="border-emerald-500/30 bg-emerald-500/10" onClick={() => godMode.runCommand.mutateAsync({ commandKey: 'auto_assign', note: godModeNote || 'Auto assign ready tasks.' })}>
                  <Bot className="mr-2 h-4 w-4" />
                  Auto Assign
                </Button>
                <Button variant="outline" className="border-red-500/30 bg-red-500/10" onClick={() => godMode.runCommand.mutateAsync({ commandKey: 'self_heal', note: godModeNote || 'Run self-heal cycle.' })}>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Self Heal
                </Button>
                <Button variant="outline" className="border-amber-500/30 bg-amber-500/10" onClick={() => godMode.runCommand.mutateAsync({ commandKey: 'sla_shield', note: godModeNote || 'Run SLA shield.' })}>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  SLA Shield
                </Button>
                <Button variant="outline" className="border-violet-500/30 bg-violet-500/10" onClick={() => godMode.runCommand.mutateAsync({ commandKey: 'rebalance', note: godModeNote || 'Rebalance human queues.' })}>
                  <Cpu className="mr-2 h-4 w-4" />
                  Rebalance
                </Button>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Sparkles className="h-4 w-4 text-cyan-300" />
                Predictive Queue
              </div>
              <div className="mt-4 space-y-3">
                {godMode.predictiveQueue.length === 0 && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                    Predictions will appear after the first God Mode refresh.
                  </div>
                )}
                {godMode.predictiveQueue.map((prediction) => {
                  const task = workflow.tasks.find((item) => item.id === prediction.task_id);
                  if (!task) {
                    return null;
                  }

                  return (
                    <div key={prediction.task_id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-medium text-white">{task.title}</div>
                          <div className="mt-1 text-xs text-slate-400">{task.module} • {prediction.next_best_action.replace(/_/g, ' ')}</div>
                        </div>
                        <Badge className={prediction.risk_level === 'critical' ? 'bg-red-500/20 text-red-200' : prediction.risk_level === 'high' ? 'bg-amber-500/20 text-amber-200' : 'bg-cyan-500/20 text-cyan-200'}>
                          {prediction.delay_risk_score}
                        </Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-300">
                        <div>Success: {prediction.success_score}%</div>
                        <div>Cost: {prediction.cost_score}</div>
                        <div>Owner: {prediction.recommended_owner_type}</div>
                      </div>
                      {prediction.rationale && (
                        <div className="mt-3 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-xs text-cyan-100">
                          {prediction.rationale}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <AlertTriangle className="h-4 w-4 text-amber-300" />
                Failure Memory + Command Log
              </div>
              <div className="mt-4 space-y-3">
                {godMode.failureMemory.slice(0, 4).map((item) => (
                  <div key={item.id} className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium text-white">{item.failure_type.replace(/_/g, ' ')}</div>
                      <Badge className={item.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-200' : 'bg-red-500/20 text-red-200'}>
                        {item.status}
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs text-slate-200">{item.root_cause}</div>
                    {item.fix_strategy && <div className="mt-2 text-xs text-slate-300">Fix: {item.fix_strategy}</div>}
                  </div>
                ))}

                {godMode.commandRuns.slice(0, 4).map((run) => (
                  <div key={run.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium text-white">{run.command_key.replace(/_/g, ' ')}</div>
                      <Badge className={run.status === 'completed' ? 'bg-emerald-500/20 text-emerald-200' : run.status === 'failed' ? 'bg-red-500/20 text-red-200' : 'bg-cyan-500/20 text-cyan-200'}>
                        {run.status}
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs text-slate-300">{run.summary || 'No summary recorded.'}</div>
                    <div className="mt-2 text-xs text-slate-400">{run.succeeded_actions} success • {run.failed_actions} failed</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <GitBranch className="h-4 w-4 text-emerald-300" />
                Task Templates
              </div>
              <div className="mt-4 space-y-3">
                {godMode.templates.length === 0 && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                    Save a live task as a template to clone repeatable work.
                  </div>
                )}
                {godMode.templates.slice(0, 5).map((template) => (
                  <div key={template.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="font-medium text-white">{template.name}</div>
                        <div className="mt-1 text-xs text-slate-400">{template.module} • {template.assignment_target}</div>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-200">{template.usage_count} launches</Badge>
                    </div>
                    <div className="mt-2 text-xs text-slate-300">{template.description || 'Reusable workflow template.'}</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {template.default_skills.map((skill) => (
                        <span key={`${template.id}-${skill}`} className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <Button size="sm" className="mt-3 bg-emerald-500 text-slate-950 hover:bg-emerald-400" onClick={() => godMode.runTemplate.mutateAsync({ templateId: template.id })}>
                      Launch Template
                    </Button>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Sparkles className="h-4 w-4 text-emerald-300" />
                Human Leaderboard
              </div>
              <div className="mt-4 space-y-3">
                {workflow.leaderboard.length === 0 && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                    Leaderboard will populate after approved human deliveries.
                  </div>
                )}
                {workflow.leaderboard.map((entry, index) => (
                  <div key={entry.developerId} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Rank {index + 1}</div>
                        <div className="mt-1 font-medium text-white">{entry.name}</div>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-200">{entry.completedTasks} done</Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-300">
                      <div>Quality: {entry.averageQuality}</div>
                      <div>On time: {entry.onTimeRate}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <GitBranch className="h-4 w-4 text-cyan-300" />
                Sprint Control
              </div>
              <div className="mt-4 space-y-3">
                <input
                  value={newSprint.title}
                  onChange={(event) => setNewSprint((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Sprint title"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                />
                <input
                  value={newSprint.description}
                  onChange={(event) => setNewSprint((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Sprint goal"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="datetime-local"
                    value={newSprint.startDate}
                    onChange={(event) => setNewSprint((current) => ({ ...current, startDate: event.target.value }))}
                    className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white"
                  />
                  <input
                    type="datetime-local"
                    value={newSprint.endDate}
                    onChange={(event) => setNewSprint((current) => ({ ...current, endDate: event.target.value }))}
                    className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white"
                  />
                </div>
                <Button onClick={handleCreateSprint} className="w-full bg-cyan-500 text-slate-950 hover:bg-cyan-400">Create Sprint</Button>
                {workflow.sprints.slice(0, 4).map((sprint) => (
                  <div key={sprint.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="font-medium text-white">{sprint.title}</div>
                        <div className="text-xs text-slate-400">{sprint.description || 'No description'}</div>
                      </div>
                      <select
                        value={sprint.status}
                        onChange={(event) => workflow.updateSprintStatus.mutateAsync({ sprintId: sprint.id, status: event.target.value })}
                        className="rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-xs text-white"
                      >
                        <option value="planned">planned</option>
                        <option value="active">active</option>
                        <option value="completed">completed</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Clock3 className="h-4 w-4 text-amber-300" />
                QA Queue
              </div>
              <div className="mt-4 space-y-3">
                {pendingSubmissions.length === 0 && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                    No pending submissions right now.
                  </div>
                )}
                {pendingSubmissions.map((submission: any) => (
                  <div key={submission.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="font-medium text-white">Submission {submission.id.slice(0, 8)}</div>
                    <div className="mt-1 text-xs text-slate-400">Task: {submission.task_id}</div>
                    <div className="mt-2 text-xs text-slate-300">{submission.notes || 'No notes provided'}</div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" className="bg-emerald-500 text-slate-950 hover:bg-emerald-400" onClick={() => workflow.reviewSubmission.mutateAsync({ submissionId: submission.id, taskId: submission.task_id, status: 'approved', notes: taskNotes[submission.task_id] || 'Approved by QA', score: 92 })}>
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-500/30 bg-red-500/10" onClick={() => workflow.reviewSubmission.mutateAsync({ submissionId: submission.id, taskId: submission.task_id, status: 'rejected', notes: taskNotes[submission.task_id] || 'Rejected by QA', score: 60 })}>
                        Reject
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/20 bg-white/5" onClick={() => workflow.reviewSubmission.mutateAsync({ submissionId: submission.id, taskId: submission.task_id, status: 'locked', notes: taskNotes[submission.task_id] || 'Locked by manager' })}>
                        Lock
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <AlertTriangle className="h-4 w-4 text-red-300" />
                Bugs, Alerts, Security
              </div>
              <div className="mt-4 space-y-3">
                <input
                  value={newBug.title}
                  onChange={(event) => setNewBug((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Bug title"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                />
                <textarea
                  value={newBug.description}
                  onChange={(event) => setNewBug((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Bug description"
                  className="min-h-24 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                />
                <div className="flex gap-2">
                  <select
                    value={newBug.severity}
                    onChange={(event) => setNewBug((current) => ({ ...current, severity: event.target.value }))}
                    className="flex-1 rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white"
                  >
                    <option value="low">low</option>
                    <option value="medium">medium</option>
                    <option value="high">high</option>
                    <option value="critical">critical</option>
                  </select>
                  <Button onClick={handleReportBug} className="bg-red-500 text-white hover:bg-red-400">Report Bug</Button>
                </div>

                {workflow.bugs.slice(0, 4).map((bug) => (
                  <div key={bug.id} className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                    <div className="font-medium text-white">{bug.title}</div>
                    <div className="mt-1 text-xs text-slate-200">{bug.status} • {bug.severity}</div>
                    <div className="mt-2 text-xs text-slate-300">{bug.description}</div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" className="border-white/20 bg-white/5" onClick={() => workflow.fixBug.mutateAsync({ bugId: bug.id, fixNotes: 'Fixed from manager workflow.' })}>Fix</Button>
                      <Button size="sm" variant="outline" className="border-emerald-500/30 bg-emerald-500/10" onClick={() => workflow.verifyBug.mutateAsync(bug.id)}>Verify</Button>
                      <Button size="sm" variant="outline" className="border-white/20 bg-white/5" onClick={() => workflow.closeBug.mutateAsync(bug.id)}>Close</Button>
                    </div>
                  </div>
                ))}

                {workflow.alerts.slice(0, 4).map((alert) => (
                  <div key={alert.id} className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                    <div className="font-medium text-white">{alert.title}</div>
                    <div className="mt-1 text-xs text-slate-200">{alert.alert_type} • {alert.severity}</div>
                    <div className="mt-2 text-xs text-slate-300">{alert.message}</div>
                    {alert.status !== 'resolved' && (
                      <Button size="sm" className="mt-3 bg-amber-400 text-slate-950 hover:bg-amber-300" onClick={() => workflow.resolveAlert.mutateAsync(alert.id)}>
                        Resolve Alert
                      </Button>
                    )}
                  </div>
                ))}

                {latestPenalties.map((task) => (
                  <div key={task.id} className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                    <div className="font-medium text-white">{task.title}</div>
                    <div className="mt-2 text-xs text-slate-200">₹{task.penaltyAmount.toFixed(0)} • {task.assignedToName}</div>
                    {task.qualityFeedback && <div className="mt-2 text-xs text-slate-300">{task.qualityFeedback}</div>}
                  </div>
                ))}

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold text-white">Access Control</div>
                  <div className="mt-3 space-y-3">
                    {workflow.humanDevelopers.slice(0, 4).map((developer) => (
                      <div key={developer.id} className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
                        <div className="text-sm font-medium text-white">{developer.fullName}</div>
                        <div className="mt-1 text-xs text-slate-400">
                          {workflow.accessControlByUserId[developer.userId]?.access_status || 'active'} • {workflow.accessControlByUserId[developer.userId]?.violation_count || 0} violations
                        </div>
                        <input
                          value={accessReasons[developer.userId] || ''}
                          onChange={(event) => setAccessReasons((current) => ({ ...current, [developer.userId]: event.target.value }))}
                          placeholder="Lock reason or compliance note"
                          className="mt-3 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-500"
                        />
                        <input
                          type="datetime-local"
                          value={tempAccessExpiries[developer.userId] || ''}
                          onChange={(event) => setTempAccessExpiries((current) => ({ ...current, [developer.userId]: event.target.value }))}
                          className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white"
                        />
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" variant="outline" className="border-red-500/30 bg-red-500/10" onClick={() => workflow.lockAccess.mutateAsync({ userId: developer.userId, reason: accessReasons[developer.userId] || 'Locked by manager' })}>
                            Lock
                          </Button>
                          <Button size="sm" variant="outline" className="border-emerald-500/30 bg-emerald-500/10" onClick={() => workflow.tempGrantAccess.mutateAsync({ userId: developer.userId, expiresAt: tempAccessExpiries[developer.userId] || new Date(Date.now() + 60 * 60 * 1000).toISOString() })}>
                            Temp Grant
                          </Button>
                          <Button size="sm" variant="outline" className="border-amber-500/30 bg-amber-500/10" onClick={() => workflow.recordViolation.mutateAsync({ developerId: developer.id, violationType: 'nda_compliance', severity: 'high', description: accessReasons[developer.userId] || 'Compliance issue recorded', penaltyAmount: 50 })}>
                            Violation
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold text-white">Developer Settings</div>
                  <div className="mt-3 space-y-2">
                    {workflow.settings.map((setting: any) => {
                      const enabled = String(setting.setting_value).toLowerCase() === 'true';
                      return (
                        <button
                          key={setting.id}
                          onClick={() => workflow.saveSetting.mutateAsync({ settingKey: setting.setting_key, settingValue: String(!enabled) })}
                          className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-left text-sm text-white"
                        >
                          <span>{setting.setting_key.replace('developer.', '')}</span>
                          <Badge className={enabled ? 'bg-emerald-500/20 text-emerald-200' : 'bg-slate-700 text-slate-200'}>
                            {enabled ? 'ON' : 'OFF'}
                          </Badge>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <TaskCreationPanel
        isOpen={showCreateTask}
        onClose={() => setShowCreateTask(false)}
        onCreateTask={handleCreateTask}
      />
    </div>
  );
};

export default TaskManager;

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, FileText, Code, Bug, Zap, Wrench, 
  Upload, Calendar, Clock, User, AlertTriangle,
  X, Sparkles, Cpu, Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { CreateDeveloperTaskInput } from '@/hooks/useDeveloperTaskSystem';

interface TaskCreationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (task: CreateDeveloperTaskInput) => void;
}

const taskTypes = [
  { id: 'development', label: 'Development', icon: Code, color: 'violet' },
  { id: 'support', label: 'Support', icon: Wrench, color: 'blue' },
  { id: 'bug', label: 'Bug Fix', icon: Bug, color: 'red' },
  { id: 'hotfix', label: 'Hotfix', icon: Zap, color: 'orange' },
  { id: 'custom', label: 'Custom', icon: FileText, color: 'slate' },
];

const priorities = [
  { id: 'low', label: 'Low', color: 'green' },
  { id: 'medium', label: 'Medium', color: 'cyan' },
  { id: 'high', label: 'High', color: 'orange' },
];

const moduleOptions = [
  'server',
  'marketplace',
  'auth',
  'billing',
  'dashboard',
  'developer',
  'support',
  'security',
];

const complexityOptions = ['simple', 'moderate', 'complex', 'critical'] as const;

const skillTags = ['PHP', 'Node.js', 'Java', 'Python', 'React', 'Flutter', 'DevOps', 'Database', 'API'];

const TaskCreationPanel = ({ isOpen, onClose, onCreateTask }: TaskCreationPanelProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    module: 'server',
    priority: 'medium',
    expectedHours: '',
    deadline: '',
    complexityMode: 'auto' as 'auto' | 'manual',
    manualComplexity: 'moderate' as CreateDeveloperTaskInput['manualComplexity'],
    skills: [] as string[],
    autoDeployAllowed: false,
    attachments: [] as File[],
  });
  const [aiSuggesting, setAiSuggesting] = useState(false);

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleAISuggest = async () => {
    setAiSuggesting(true);
    // Simulate AI suggestion
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        expectedHours: prev.module === 'auth' ? '6' : '4',
        skills: prev.module === 'server'
          ? ['Node.js', 'Database', 'API']
          : prev.module === 'auth'
            ? ['React', 'Node.js', 'API']
            : ['React', 'API'],
      }));
      setAiSuggesting(false);
      toast.success('AI suggested module-fit effort and skills');
    }, 1500);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.deadline) {
      toast.error('Title, description, and deadline are required');
      return;
    }

    onCreateTask({
      title: formData.title,
      description: formData.description,
      module: formData.module,
      priority: formData.priority as CreateDeveloperTaskInput['priority'],
      deadline: formData.deadline,
      complexityMode: formData.complexityMode,
      manualComplexity: formData.complexityMode === 'manual' ? formData.manualComplexity : undefined,
      expectedHours: formData.expectedHours ? Number(formData.expectedHours) : null,
      skills: formData.skills,
      autoDeployAllowed: formData.autoDeployAllowed,
    });

    toast.success('Task submitted to auto-assign engine');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-2xl border border-violet-500/30 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 p-4 border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-sm flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create New Task</h2>
              <p className="text-xs text-slate-400">Fill in the task details</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Task Type */}
          <div>
            <label className="text-sm text-slate-400 mb-3 block">Task Type</label>
            <div className="flex gap-2 flex-wrap">
              {taskTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFormData(prev => ({ ...prev, module: type.id === 'bug' ? 'support' : prev.module }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    (type.id === 'bug' && formData.module === 'support') || (type.id !== 'bug' && formData.module !== 'support')
                      ? `bg-${type.color}-500/20 border-${type.color}-500/50 text-${type.color}-400`
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <type.icon className="w-4 h-4" />
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title & Description */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Task Title *</label>
              <Input
                placeholder="Enter task title..."
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-slate-800/50 border-slate-600"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Description *</label>
              <Textarea
                placeholder="Describe the task in detail..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-slate-800/50 border-slate-600 min-h-[100px]"
              />
            </div>
          </div>

          {/* AI Suggestion */}
          <Button
            variant="outline"
            onClick={handleAISuggest}
            disabled={aiSuggesting || !formData.description}
            className="border-violet-500/30 text-violet-400"
          >
            <Sparkles className={`w-4 h-4 mr-2 ${aiSuggesting ? 'animate-spin' : ''}`} />
            {aiSuggesting ? 'AI Analyzing...' : 'AI Suggest Complexity + Skills'}
          </Button>

          {/* Module + Complexity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400 mb-2 block flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                Module
              </label>
              <select
                value={formData.module}
                onChange={(e) => setFormData(prev => ({ ...prev, module: e.target.value }))}
                className="w-full p-2 rounded-lg bg-slate-800/50 border border-slate-600 text-white"
              >
                {moduleOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-2 block flex items-center gap-2">
                <Bot className="w-4 h-4" />
                Complexity Source
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFormData(prev => ({ ...prev, complexityMode: 'auto' }))}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
                    formData.complexityMode === 'auto'
                      ? 'border-violet-500/50 bg-violet-500/20 text-violet-300'
                      : 'border-slate-700 bg-slate-800/50 text-slate-400'
                  }`}
                >
                  Auto Detect
                </button>
                <button
                  onClick={() => setFormData(prev => ({ ...prev, complexityMode: 'manual' }))}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
                    formData.complexityMode === 'manual'
                      ? 'border-violet-500/50 bg-violet-500/20 text-violet-300'
                      : 'border-slate-700 bg-slate-800/50 text-slate-400'
                  }`}
                >
                  Manual
                </button>
              </div>
            </div>
          </div>

          {formData.complexityMode === 'manual' && (
            <div>
              <label className="text-sm text-slate-400 mb-3 block">Manual Complexity</label>
              <div className="flex gap-2 flex-wrap">
                {complexityOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setFormData(prev => ({ ...prev, manualComplexity: option }))}
                    className={`rounded-lg border px-3 py-2 text-sm capitalize ${
                      formData.manualComplexity === option
                        ? 'border-violet-500/50 bg-violet-500/20 text-violet-300'
                        : 'border-slate-700 bg-slate-800/50 text-slate-400'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Priority */}
          <div>
            <label className="text-sm text-slate-400 mb-3 block">Priority</label>
            <div className="flex gap-2 flex-wrap">
              {priorities.map((priority) => (
                <button
                  key={priority.id}
                  onClick={() => setFormData(prev => ({ ...prev, priority: priority.id }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    formData.priority === priority.id
                      ? `bg-${priority.color}-500/20 border-${priority.color}-500/50 text-${priority.color}-400`
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {priority.id === 'high' && <AlertTriangle className="w-4 h-4" />}
                  {priority.label}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400 mb-2 block flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Expected Hours
              </label>
              <Input
                type="number"
                placeholder="e.g., 8"
                value={formData.expectedHours}
                onChange={(e) => setFormData(prev => ({ ...prev, expectedHours: e.target.value }))}
                className="bg-slate-800/50 border-slate-600"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-2 block flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Deadline
              </label>
              <Input
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                className="bg-slate-800/50 border-slate-600"
              />
            </div>
          </div>

          {/* Skill Tags */}
          <div>
            <label className="text-sm text-slate-400 mb-3 block">Required Skills (for auto-assignment)</label>
            <div className="flex gap-2 flex-wrap">
              {skillTags.map((skill) => (
                <button
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    formData.skills.includes(skill)
                      ? 'bg-violet-500/20 border border-violet-500/50 text-violet-400'
                      : 'bg-slate-800/50 border border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-emerald-300">Auto Deploy Permission</h3>
                <p className="text-xs text-slate-400 mt-1">
                  If AI quality score is high enough, approved AI tasks can move straight to deployment.
                </p>
              </div>
              <button
                onClick={() => setFormData(prev => ({ ...prev, autoDeployAllowed: !prev.autoDeployAllowed }))}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  formData.autoDeployAllowed
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300 border border-slate-600'
                }`}
              >
                {formData.autoDeployAllowed ? 'Allowed' : 'Blocked'}
              </button>
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className="text-sm text-slate-400 mb-3 block">Attachments</label>
            <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-violet-500/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Drop files here or click to upload</p>
              <p className="text-xs text-slate-500 mt-1">Max 10MB per file</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-4 border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-sm flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            className="bg-gradient-to-r from-violet-500 to-purple-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TaskCreationPanel;

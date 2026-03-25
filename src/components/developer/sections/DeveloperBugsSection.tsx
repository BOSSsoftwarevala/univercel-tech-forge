import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bug, AlertTriangle, CheckCircle2, Clock, Link, Image, FileText,
  Play, Eye, RotateCcw, Bot, Sparkles, Filter, Search, Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface BugItem {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'fixed' | 'closed';
  linkedTaskId?: string;
  reproductionSteps: string[];
  screenshots: string[];
  logs: string;
  reportedAt: string;
  aiSuggestion?: string;
}

const mockBugs: BugItem[] = [
  {
    id: 'BUG-001',
    title: 'Payment fails on mobile devices',
    description: 'Users on iOS Safari experience payment failures during checkout',
    severity: 'critical',
    status: 'open',
    linkedTaskId: 'TASK-042',
    reproductionSteps: ['Open checkout on iOS', 'Enter payment details', 'Click Pay Now', 'Error appears'],
    screenshots: [],
    logs: 'TypeError: Cannot read property "token" of undefined',
    reportedAt: '2 hours ago',
    aiSuggestion: 'Check Safari compatibility with the payment SDK. Consider using polyfill for Promise.allSettled.',
  },
  {
    id: 'BUG-002',
    title: 'Dashboard charts not loading',
    description: 'Analytics charts show infinite loading state',
    severity: 'high',
    status: 'in_progress',
    linkedTaskId: 'TASK-039',
    reproductionSteps: ['Navigate to Analytics', 'Wait for charts', 'Loading never completes'],
    screenshots: [],
    logs: 'API timeout after 30s',
    reportedAt: '5 hours ago',
    aiSuggestion: 'Implement request caching and add loading timeout handler. Consider lazy loading charts.',
  },
  {
    id: 'BUG-003',
    title: 'Filter dropdown overlaps content',
    description: 'On smaller screens, the filter dropdown covers the table headers',
    severity: 'medium',
    status: 'open',
    reproductionSteps: ['Resize window to 768px', 'Click filter button', 'Dropdown overlaps table'],
    screenshots: [],
    logs: '',
    reportedAt: '1 day ago',
    aiSuggestion: 'Add z-index adjustment and consider using a modal for mobile filter views.',
  },
  {
    id: 'BUG-004',
    title: 'Memory leak in real-time updates',
    description: 'WebSocket connections not properly closed on unmount',
    severity: 'low',
    status: 'fixed',
    reproductionSteps: ['Open dashboard', 'Navigate away', 'Check network tab', 'Connection still active'],
    screenshots: [],
    logs: 'Warning: Can\'t perform state update on unmounted component',
    reportedAt: '3 days ago',
    aiSuggestion: 'Add cleanup in useEffect return function to close WebSocket connection.',
  },
];

const DeveloperBugsSection = () => {
  const [bugs, setBugs] = useState<BugItem[]>(mockBugs);
  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'fixed' | 'closed'>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBug, setSelectedBug] = useState<BugItem | null>(null);
  const [showReproSteps, setShowReproSteps] = useState<string | null>(null);

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'critical': return { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: AlertTriangle };
      case 'high': return { color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: AlertTriangle };
      case 'medium': return { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Bug };
      case 'low': return { color: 'bg-slate-500/20 text-slate-400 border-slate-500/30', icon: Bug };
      default: return { color: 'bg-slate-500/20 text-slate-400', icon: Bug };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'open': return { color: 'bg-red-500/20 text-red-400', label: 'Open' };
      case 'in_progress': return { color: 'bg-amber-500/20 text-amber-400', label: 'In Progress' };
      case 'fixed': return { color: 'bg-emerald-500/20 text-emerald-400', label: 'Fixed' };
      case 'closed': return { color: 'bg-blue-500/20 text-blue-400', label: 'Closed' };
      default: return { color: 'bg-slate-500/20 text-slate-400', label: status };
    }
  };

  const handleAssignToSelf = (bugId: string) => {
    setBugs(prev => prev.map(bug => 
      bug.id === bugId ? { ...bug, status: 'in_progress' as const } : bug
    ));
    toast.success('Bug assigned to you');
  };

  const handleMarkFixed = (bugId: string) => {
    setBugs(prev => prev.map(bug => 
      bug.id === bugId ? { ...bug, status: 'fixed' as const } : bug
    ));
    toast.success('Bug marked as fixed - Awaiting QA review');
  };

  const handleReopenBug = (bugId: string) => {
    setBugs(prev => prev.map(bug => 
      bug.id === bugId ? { ...bug, status: 'open' as const } : bug
    ));
    toast.info('Bug reopened');
  };

  const handleRequestQAReview = (bugId: string) => {
    toast.success('QA review requested');
  };

  const filteredBugs = bugs
    .filter(bug => filter === 'all' || bug.status === filter)
    .filter(bug => severityFilter === 'all' || bug.severity === severityFilter)
    .filter(bug => 
      searchQuery === '' || 
      bug.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bug.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const bugCounts = {
    all: bugs.length,
    open: bugs.filter(b => b.status === 'open').length,
    in_progress: bugs.filter(b => b.status === 'in_progress').length,
    fixed: bugs.filter(b => b.status === 'fixed').length,
    closed: bugs.filter(b => b.status === 'closed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Bug className="w-7 h-7 text-red-400" />
            Bugs & Issues
          </h1>
          <p className="text-slate-400 mt-1">Track, fix, and manage software bugs</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            {bugCounts.open} Open
          </Badge>
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
            {bugCounts.in_progress} In Progress
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bugs..."
            className="pl-10 bg-slate-800/50 border-slate-700"
          />
        </div>
        
        {/* Status Filter */}
        <div className="flex gap-1 bg-slate-800/50 rounded-lg p-1">
          {(['all', 'open', 'in_progress', 'fixed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                filter === status
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} ({bugCounts[status]})
            </button>
          ))}
        </div>

        {/* Severity Filter */}
        <div className="flex gap-1 bg-slate-800/50 rounded-lg p-1">
          {(['all', 'critical', 'high', 'medium', 'low'] as const).map((severity) => (
            <button
              key={severity}
              onClick={() => setSeverityFilter(severity)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                severityFilter === severity
                  ? severity === 'critical' ? 'bg-red-500/20 text-red-400'
                    : severity === 'high' ? 'bg-orange-500/20 text-orange-400'
                    : severity === 'medium' ? 'bg-amber-500/20 text-amber-400'
                    : severity === 'low' ? 'bg-slate-500/20 text-slate-300'
                    : 'bg-cyan-500/20 text-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {severity.charAt(0).toUpperCase() + severity.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Bug List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredBugs.map((bug, index) => {
            const severityConfig = getSeverityConfig(bug.severity);
            const statusConfig = getStatusConfig(bug.status);
            const SeverityIcon = severityConfig.icon;

            return (
              <motion.div
                key={bug.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-red-500/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${severityConfig.color}`}>
                      <SeverityIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-slate-500">{bug.id}</span>
                        <Badge className={severityConfig.color}>
                          {bug.severity.toUpperCase()}
                        </Badge>
                        <Badge className={statusConfig.color}>
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-white">{bug.title}</h3>
                      <p className="text-sm text-slate-400 mt-1">{bug.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {bug.reportedAt}
                  </div>
                </div>

                {/* Linked Task */}
                {bug.linkedTaskId && (
                  <div className="flex items-center gap-2 mb-3 text-sm">
                    <Link className="w-4 h-4 text-cyan-400" />
                    <span className="text-slate-400">Linked to:</span>
                    <span className="text-cyan-400 font-mono">{bug.linkedTaskId}</span>
                  </div>
                )}

                {/* Reproduction Steps Toggle */}
                {bug.reproductionSteps.length > 0 && (
                  <div className="mb-3">
                    <button
                      onClick={() => setShowReproSteps(showReproSteps === bug.id ? null : bug.id)}
                      className="text-sm text-slate-400 hover:text-white flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      {showReproSteps === bug.id ? 'Hide' : 'Show'} Reproduction Steps ({bug.reproductionSteps.length})
                    </button>
                    <AnimatePresence>
                      {showReproSteps === bug.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-2 pl-4 border-l-2 border-slate-700"
                        >
                          <ol className="space-y-1 text-sm text-slate-300">
                            {bug.reproductionSteps.map((step, i) => (
                              <li key={i}>{i + 1}. {step}</li>
                            ))}
                          </ol>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Logs Preview */}
                {bug.logs && (
                  <div className="mb-3 p-2 bg-slate-900/50 rounded-lg">
                    <code className="text-xs text-red-400 font-mono">{bug.logs}</code>
                  </div>
                )}

                {/* AI Suggestion */}
                {bug.aiSuggestion && (
                  <div className="mb-4 p-3 rounded-lg bg-violet-500/10 border border-violet-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-4 h-4 text-violet-400" />
                      <span className="text-xs font-semibold text-violet-400">AI Suggestion</span>
                      <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                    </div>
                    <p className="text-sm text-slate-300">{bug.aiSuggestion}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {bug.status === 'open' && (
                    <Button
                      size="sm"
                      onClick={() => handleAssignToSelf(bug.id)}
                      className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/30"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Assign to Self
                    </Button>
                  )}
                  {bug.status === 'in_progress' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleMarkFixed(bug.id)}
                        className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Mark Fixed
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRequestQAReview(bug.id)}
                        className="border-slate-600 text-slate-300"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Request QA
                      </Button>
                    </>
                  )}
                  {(bug.status === 'fixed' || bug.status === 'closed') && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReopenBug(bug.id)}
                      className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reopen Bug
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-600 text-slate-300"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Add Screenshot
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredBugs.length === 0 && (
          <div className="text-center py-12">
            <Bug className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Bugs Found</h3>
            <p className="text-slate-400">
              {searchQuery ? 'Try adjusting your search or filters' : 'No bugs match the current filters'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperBugsSection;

import { motion } from 'framer-motion';
import { Code2, GitCommit, ExternalLink, FileText, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';

interface CodeSubmissionCardProps {
  taskId: string | null;
  repoLink: string;
  canSubmit: boolean;
  onSubmit: (commitHash: string, notes: string) => void;
}

const CodeSubmissionCard = ({ taskId, repoLink, canSubmit, onSubmit }: CodeSubmissionCardProps) => {
  const [commitHash, setCommitHash] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!commitHash.trim()) {
      toast.error('Commit hash is required');
      return;
    }
    if (!canSubmit) {
      toast.error('Timer must meet SLA requirements before submission');
      return;
    }
    onSubmit(commitHash, notes);
    // Play submission sound
    const audio = new Audio('/sounds/submit.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  if (!taskId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/30 p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-slate-700/50">
            <Code2 className="w-5 h-5 text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-500">Code Submission</h3>
        </div>
        <div className="text-center py-8 text-slate-500">
          <Code2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No active task to submit</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-cyan-500/20">
          <Code2 className="w-5 h-5 text-cyan-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Code Submission</h3>
      </div>

      {/* Repo Link (Read-only) */}
      <div className="mb-4">
        <label className="text-sm text-slate-400 mb-2 block">Repository Link</label>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <ExternalLink className="w-4 h-4 text-slate-400" />
          <span className="text-slate-300 text-sm flex-1 truncate">{repoLink || 'Not assigned'}</span>
        </div>
      </div>

      {/* Commit Hash */}
      <div className="mb-4">
        <label className="text-sm text-slate-400 mb-2 block">Commit Hash</label>
        <div className="relative">
          <GitCommit className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={commitHash}
            onChange={(e) => setCommitHash(e.target.value)}
            placeholder="e.g., a1b2c3d4e5f6..."
            className="pl-10 bg-slate-800/50 border-slate-700/50 text-white"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="text-sm text-slate-400 mb-2 block">Submission Notes</label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe what was implemented or fixed..."
            className="pl-10 bg-slate-800/50 border-slate-700/50 text-white min-h-[100px]"
          />
        </div>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full ${
          canSubmit 
            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white' 
            : 'bg-slate-700 text-slate-400 cursor-not-allowed'
        }`}
      >
        <Send className="w-4 h-4 mr-2" />
        Submit for Review
      </Button>

      {!canSubmit && (
        <p className="text-xs text-red-400 text-center mt-2">
          Timer must meet SLA requirements before submission
        </p>
      )}

      {/* State Flow */}
      <div className="mt-6 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
        <p className="text-xs text-slate-400 text-center">
          Assigned → Accepted → In Progress → Review → Approved / Rejected
        </p>
      </div>
    </motion.div>
  );
};

export default CodeSubmissionCard;

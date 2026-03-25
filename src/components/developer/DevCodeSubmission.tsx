import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, FileCode, CheckCircle2, AlertTriangle,
  Github, GitBranch, Eye, Send, Code2, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const DevCodeSubmission = () => {
  const [submissionType, setSubmissionType] = useState<'file' | 'link'>('link');
  const [repoLink, setRepoLink] = useState('');
  const [branchName, setBranchName] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = () => {
    if (submissionType === 'link' && !repoLink) {
      toast({
        title: "Repository Link Required",
        description: "Please provide the repository link.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Code Submitted!",
      description: "Your submission is now under review.",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const recentSubmissions = [
    { id: 1, task: 'Login Module Update', status: 'approved', submittedAt: '2 hours ago', score: 95 },
    { id: 2, task: 'API Integration', status: 'reviewing', submittedAt: '5 hours ago', score: null },
    { id: 3, task: 'Dashboard Charts', status: 'revision', submittedAt: '1 day ago', score: 78 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Code Submission</h1>
        <p className="text-slate-400">Submit your completed work for review</p>
      </div>

      {/* Current Task */}
      <div className="p-6 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
        <div className="flex items-center gap-3 mb-4">
          <Code2 className="w-6 h-6 text-cyan-400" />
          <div>
            <h3 className="font-semibold text-white">Current Task: Payment Gateway Integration</h3>
            <p className="text-sm text-slate-400">Submit your code for this task</p>
          </div>
        </div>
      </div>

      {/* Submission Type Toggle */}
      <div className="flex gap-4">
        <button
          onClick={() => setSubmissionType('link')}
          className={`flex-1 p-4 rounded-xl border transition-all ${
            submissionType === 'link'
              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
              : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600'
          }`}
        >
          <Github className="w-6 h-6 mx-auto mb-2" />
          <p className="text-sm font-medium">Repository Link</p>
        </button>
        <button
          onClick={() => setSubmissionType('file')}
          className={`flex-1 p-4 rounded-xl border transition-all ${
            submissionType === 'file'
              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
              : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600'
          }`}
        >
          <Upload className="w-6 h-6 mx-auto mb-2" />
          <p className="text-sm font-medium">Upload Files</p>
        </button>
      </div>

      {/* Submission Form */}
      <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
        {submissionType === 'link' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <Github className="w-4 h-4 inline mr-2" />
                Repository URL
              </label>
              <Input
                value={repoLink}
                onChange={e => setRepoLink(e.target.value)}
                placeholder="https://github.com/username/repo"
                className="bg-slate-900 border-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <GitBranch className="w-4 h-4 inline mr-2" />
                Branch Name
              </label>
              <Input
                value={branchName}
                onChange={e => setBranchName(e.target.value)}
                placeholder="feature/payment-integration"
                className="bg-slate-900 border-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Commit Message
              </label>
              <Input
                value={commitMessage}
                onChange={e => setCommitMessage(e.target.value)}
                placeholder="feat: implement payment gateway integration"
                className="bg-slate-900 border-slate-700"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              <Upload className="w-4 h-4 inline mr-2" />
              Upload Files
            </label>
            <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-cyan-500/50 transition-colors cursor-pointer">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <FileCode className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">Drag & drop files or click to browse</p>
                <p className="text-xs text-slate-500 mt-2">Supported: .zip, .tar.gz, .js, .ts, .py, .java</p>
              </label>
            </div>
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-slate-900/50 rounded-lg">
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-slate-300">{file.name}</span>
                    <span className="text-xs text-slate-500 ml-auto">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-white mb-2">
            Submission Notes (Optional)
          </label>
          <Textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Any additional notes, known issues, or special instructions..."
            className="bg-slate-900 border-slate-700"
            rows={4}
          />
        </div>

        {/* Checklist */}
        <div className="mt-6 p-4 bg-slate-900/50 rounded-lg">
          <h4 className="text-sm font-medium text-white mb-3">Pre-Submission Checklist</h4>
          <div className="space-y-2">
            {[
              'Code is tested and working',
              'No sensitive data or credentials exposed',
              'Comments added where necessary',
              'Follows coding standards',
            ].map((item, index) => (
              <label key={index} className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer hover:text-slate-300">
                <input type="checkbox" className="rounded border-slate-600" />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSubmit} className="flex-1 bg-emerald-500 hover:bg-emerald-600">
            <Send className="w-4 h-4 mr-2" />
            Submit for Review
          </Button>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Submissions</h3>
        <div className="space-y-3">
          {recentSubmissions.map((submission, index) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  submission.status === 'approved' ? 'bg-emerald-400' :
                  submission.status === 'reviewing' ? 'bg-amber-400' : 'bg-red-400'
                }`} />
                <div>
                  <p className="text-sm font-medium text-white">{submission.task}</p>
                  <p className="text-xs text-slate-400">{submission.submittedAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs ${
                  submission.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                  submission.status === 'reviewing' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {submission.status}
                </span>
                {submission.score && (
                  <span className="text-sm font-medium text-cyan-400">{submission.score}%</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DevCodeSubmission;

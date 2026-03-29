import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, FileCode, GitBranch, CheckCircle, AlertTriangle,
  Eye, Download, Trash2, Plus, Bot, Star, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

interface Submission {
  id: string;
  taskId: string;
  type: 'draft' | 'review' | 'final';
  files: { name: string; size: string; type: string }[];
  commitMessage: string;
  timestamp: Date;
  aiScore?: number;
  aiFeedback?: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision_needed';
}

const mockSubmissions: Submission[] = [
  {
    id: 'SUB-001',
    taskId: 'TSK-2846',
    type: 'draft',
    files: [
      { name: 'payment-gateway.ts', size: '12.4 KB', type: 'typescript' },
      { name: 'stripe-service.ts', size: '8.2 KB', type: 'typescript' },
    ],
    commitMessage: 'Initial payment gateway implementation with Stripe integration',
    timestamp: new Date(Date.now() - 3600000),
    aiScore: 78,
    aiFeedback: 'Good structure. Consider adding more error handling for edge cases.',
    status: 'revision_needed'
  },
  {
    id: 'SUB-002',
    taskId: 'TSK-2846',
    type: 'review',
    files: [
      { name: 'payment-gateway.ts', size: '14.1 KB', type: 'typescript' },
      { name: 'stripe-service.ts', size: '9.5 KB', type: 'typescript' },
      { name: 'currency-converter.ts', size: '3.2 KB', type: 'typescript' },
    ],
    commitMessage: 'Added error handling and multi-currency support',
    timestamp: new Date(Date.now() - 1800000),
    aiScore: 92,
    aiFeedback: 'Excellent improvements! Code quality is high. Ready for final review.',
    status: 'pending'
  }
];

const CodeSubmission = () => {
  const [submissions] = useState<Submission[]>(mockSubmissions);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [commitMessage, setCommitMessage] = useState('');
  const [submissionType, setSubmissionType] = useState<'draft' | 'review' | 'final'>('draft');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-emerald-500/20 text-emerald-400">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-400">Rejected</Badge>;
      case 'revision_needed':
        return <Badge className="bg-yellow-500/20 text-yellow-400">Revision Needed</Badge>;
      default:
        return <Badge className="bg-slate-500/20 text-slate-400">Pending Review</Badge>;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Code Submission</h1>
          <p className="text-slate-400 text-sm mt-1">Upload and deliver your code for TSK-2846</p>
        </div>
        <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
          <Clock className="w-3 h-3 mr-1" />
          SLA: 45m remaining
        </Badge>
      </div>

      {/* Upload Section */}
      <Card className="p-6 bg-slate-900/50 border-cyan-500/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-cyan-400" />
          New Submission
        </h3>

        {/* Submission Type */}
        <div className="flex gap-2 mb-4">
          {['draft', 'review', 'final'].map((type) => (
            <Button
              key={type}
              variant={submissionType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSubmissionType(type as typeof submissionType)}
              className={submissionType === type 
                ? 'bg-cyan-500 text-white' 
                : 'border-cyan-500/30 text-cyan-400'
              }
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>

        {/* File Upload Area */}
        <div 
          className="border-2 border-dashed border-cyan-500/30 rounded-xl p-8 text-center hover:border-cyan-500/50 transition-colors cursor-pointer mb-4"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
            accept=".js,.ts,.jsx,.tsx,.py,.java,.php,.html,.css,.json,.md"
          />
          <FileCode className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
          <p className="text-white font-medium">Drop files here or click to upload</p>
          <p className="text-slate-400 text-sm mt-1">
            Supported: .js, .ts, .jsx, .tsx, .py, .java, .php, .html, .css, .json, .md
          </p>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2 mb-4">
            {uploadedFiles.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-cyan-500/20"
              >
                <div className="flex items-center gap-3">
                  <FileCode className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-sm text-white">{file.name}</p>
                    <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Commit Message */}
        <div className="mb-4">
          <label className="text-sm text-slate-400 mb-2 block">Commit Message</label>
          <Textarea
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="Describe your changes..."
            className="bg-slate-800 border-cyan-500/20 text-white min-h-[80px]"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" className="border-slate-600 text-slate-400">
            Save as Draft
          </Button>
          <Button 
            className="bg-cyan-500 hover:bg-cyan-600 text-white gap-2"
            disabled={uploadedFiles.length === 0 || !commitMessage}
          >
            <GitBranch className="w-4 h-4" />
            Submit for {submissionType === 'final' ? 'Delivery' : 'Review'}
          </Button>
        </div>
      </Card>

      {/* Previous Submissions */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Submission History</h3>
        <div className="space-y-4">
          {submissions.map((submission, index) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 bg-slate-900/50 border-cyan-500/20">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Submission Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-slate-400">{submission.id}</span>
                      <Badge className={`capitalize ${
                        submission.type === 'final' 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : submission.type === 'review'
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        {submission.type}
                      </Badge>
                      {getStatusBadge(submission.status)}
                    </div>
                    
                    <p className="text-white font-medium mb-2">{submission.commitMessage}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {submission.files.map((file, i) => (
                        <span 
                          key={i}
                          className="px-2 py-1 bg-slate-800 text-cyan-400 text-xs rounded flex items-center gap-1"
                        >
                          <FileCode className="w-3 h-3" />
                          {file.name}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-xs text-slate-500">
                      Submitted {submission.timestamp.toLocaleString()}
                    </p>
                  </div>

                  {/* AI Review Score */}
                  {submission.aiScore && (
                    <div className="lg:w-64 p-4 bg-slate-800/50 rounded-xl border border-emerald-500/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Bot className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm font-medium text-emerald-400">AI Code Review</span>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl font-bold text-white">{submission.aiScore}</div>
                        <div className="flex-1">
                          <Progress value={submission.aiScore} className="h-2" />
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star}
                              className={`w-4 h-4 ${
                                star <= Math.round(submission.aiScore / 20) 
                                  ? 'text-yellow-400 fill-yellow-400' 
                                  : 'text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-xs text-slate-300">{submission.aiFeedback}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2">
                    <Button variant="ghost" size="sm" className="text-cyan-400">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-slate-400">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeSubmission;

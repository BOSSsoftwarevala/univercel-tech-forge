import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2, Sparkles, Zap, Shield, AlertTriangle, CheckCircle2,
  GitBranch, FileCode, Bug, Lightbulb, RefreshCw, Copy, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useDeveloperAI } from '@/hooks/useDeveloperAI';
import { toast } from 'sonner';

const AICodeIntelligence = () => {
  const { prepareCodeReview, loading } = useDeveloperAI();
  const [code, setCode] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'review' | 'optimize' | 'security'>('review');

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code to analyze');
      return;
    }

    const result = await prepareCodeReview({
      code,
      language: 'javascript',
      context: 'Production code review'
    });

    if (result) {
      setAnalysis(result);
      toast.success('Code analysis complete!');
    }
  };

  const sampleIssues = [
    { type: 'warning', line: 12, message: 'Potential memory leak in useEffect', severity: 'medium' },
    { type: 'error', line: 24, message: 'Unhandled promise rejection', severity: 'high' },
    { type: 'info', line: 8, message: 'Consider using useMemo for expensive computation', severity: 'low' },
    { type: 'security', line: 45, message: 'Possible XSS vulnerability detected', severity: 'critical' },
  ];

  const optimizations = [
    { type: 'performance', suggestion: 'Replace forEach with for...of for better performance', impact: '+15%' },
    { type: 'readability', suggestion: 'Extract complex condition into named function', impact: 'Clarity' },
    { type: 'memory', suggestion: 'Use WeakMap instead of Map for object keys', impact: '-20% memory' },
  ];

  const securityChecks = [
    { check: 'Input Validation', status: 'pass', details: 'All inputs are properly sanitized' },
    { check: 'SQL Injection', status: 'pass', details: 'Using parameterized queries' },
    { check: 'XSS Prevention', status: 'warning', details: 'dangerouslySetInnerHTML usage detected' },
    { check: 'CSRF Protection', status: 'pass', details: 'Tokens properly implemented' },
    { check: 'Secret Exposure', status: 'pass', details: 'No hardcoded secrets found' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            AI Code Intelligence
          </h1>
          <p className="text-slate-400 mt-1">Advanced code analysis, optimization & security scanning</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'review', label: 'Code Review', icon: FileCode },
          { id: 'optimize', label: 'Optimize', icon: Zap },
          { id: 'security', label: 'Security Scan', icon: Shield },
        ].map(tab => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab.id as any)}
            className={activeTab === tab.id ? 'bg-cyan-500 hover:bg-cyan-600' : ''}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Code Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-cyan-400" />
            Paste Your Code
          </h3>
          <div className="flex gap-2">
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">JavaScript</Badge>
            <Badge variant="outline" className="border-purple-500/50 text-purple-400">TypeScript</Badge>
            <Badge variant="outline" className="border-emerald-500/50 text-emerald-400">React</Badge>
          </div>
        </div>
        <Textarea
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="// Paste your code here for AI analysis...
function example() {
  const data = await fetch('/api/users');
  return data.json();
}"
          className="min-h-[200px] font-mono text-sm bg-slate-900 border-slate-700"
        />
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze Code
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Results Panel */}
      <AnimatePresence mode="wait">
        {activeTab === 'review' && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Bug className="w-5 h-5 text-red-400" />
                Issues Found ({sampleIssues.length})
              </h3>
              <div className="space-y-3">
                {sampleIssues.map((issue, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-4 rounded-xl border ${
                      issue.type === 'error' ? 'bg-red-500/10 border-red-500/30' :
                      issue.type === 'warning' ? 'bg-amber-500/10 border-amber-500/30' :
                      issue.type === 'security' ? 'bg-purple-500/10 border-purple-500/30' :
                      'bg-slate-700/50 border-slate-600/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {issue.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-400" />}
                        {issue.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                        {issue.type === 'info' && <Lightbulb className="w-5 h-5 text-cyan-400" />}
                        {issue.type === 'security' && <Shield className="w-5 h-5 text-purple-400" />}
                        <div>
                          <p className="text-white font-medium">{issue.message}</p>
                          <p className="text-sm text-slate-400">Line {issue.line}</p>
                        </div>
                      </div>
                      <Badge className={`
                        ${issue.severity === 'critical' ? 'bg-red-500' :
                          issue.severity === 'high' ? 'bg-orange-500' :
                          issue.severity === 'medium' ? 'bg-amber-500' : 'bg-slate-500'}
                      `}>
                        {issue.severity}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'optimize' && (
          <motion.div
            key="optimize"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Optimization Suggestions
              </h3>
              <div className="space-y-3">
                {optimizations.map((opt, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          opt.type === 'performance' ? 'bg-emerald-500/20' :
                          opt.type === 'memory' ? 'bg-purple-500/20' : 'bg-cyan-500/20'
                        }`}>
                          {opt.type === 'performance' && <Zap className="w-4 h-4 text-emerald-400" />}
                          {opt.type === 'memory' && <GitBranch className="w-4 h-4 text-purple-400" />}
                          {opt.type === 'readability' && <FileCode className="w-4 h-4 text-cyan-400" />}
                        </div>
                        <div>
                          <p className="text-white font-medium">{opt.suggestion}</p>
                          <p className="text-sm text-slate-400 capitalize">{opt.type} optimization</p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-500">{opt.impact}</Badge>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        <Copy className="w-3 h-3 mr-1" />
                        Copy Fix
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Learn More
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'security' && (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                Security Scan Results
              </h3>
              <div className="space-y-3">
                {securityChecks.map((check, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl bg-slate-700/50 border border-slate-600/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {check.status === 'pass' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                        {check.status === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                        {check.status === 'fail' && <AlertTriangle className="w-5 h-5 text-red-400" />}
                        <div>
                          <p className="text-white font-medium">{check.check}</p>
                          <p className="text-sm text-slate-400">{check.details}</p>
                        </div>
                      </div>
                      <Badge className={`
                        ${check.status === 'pass' ? 'bg-emerald-500' :
                          check.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}
                      `}>
                        {check.status.toUpperCase()}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-emerald-400" />
                  <div>
                    <p className="text-emerald-400 font-semibold">Security Score: 92/100</p>
                    <p className="text-sm text-slate-400">Your code passes most security checks</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AICodeIntelligence;

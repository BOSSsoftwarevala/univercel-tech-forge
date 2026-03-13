/**
 * VALA AI CODE QUALITY & MANAGER PANEL
 * AI monitors developer code quality, runs tests, security scans
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, CheckCircle, AlertTriangle, XCircle, Code2, 
  Brain, Zap, FileText, BarChart3, Bug, Lock,
  RefreshCw, Loader2, Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const DevCodeQualityPanel: React.FC = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [reviewResult, setReviewResult] = useState<any>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [activeTab, setActiveTab] = useState<'review' | 'security' | 'tests' | 'stats'>('stats');

  const runAction = async (action: string) => {
    if (!code.trim() && action !== 'stats') {
      toast.error('Pehle code paste karo');
      return;
    }
    setIsReviewing(true);
    try {
      const { data, error } = await supabase.functions.invoke('dev-code-review', {
        body: { action, code, language }
      });
      if (error) throw error;
      if (data?.success) {
        try {
          setReviewResult(JSON.parse(data.result));
        } catch {
          setReviewResult({ raw: data.result });
        }
        toast.success('Analysis complete!');
      } else {
        toast.error(data?.error || 'Analysis failed');
      }
    } catch (e) {
      console.error(e);
      toast.error('AI service se connect nahi ho paya');
    } finally {
      setIsReviewing(false);
    }
  };

  const severityColor = (s: string) => {
    if (s === 'critical') return 'text-red-400 bg-red-500/10';
    if (s === 'warning') return 'text-amber-400 bg-amber-500/10';
    return 'text-blue-400 bg-blue-500/10';
  };

  const gradeColor = (g: string) => {
    if (g === 'A') return 'text-emerald-400';
    if (g === 'B') return 'text-cyan-400';
    if (g === 'C') return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Brain className="w-7 h-7 text-cyan-400" />
          Vala AI — Code Quality Manager
        </h1>
        <p className="text-slate-400 mt-1">AI tumhare code ko check karega — quality, security, performance sab</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'stats', label: 'My Stats', icon: BarChart3 },
          { id: 'review', label: 'Code Review', icon: Code2 },
          { id: 'security', label: 'Security Scan', icon: Shield },
          { id: 'tests', label: 'Generate Tests', icon: FileText },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <Button key={tab.id} variant={activeTab === tab.id ? 'default' : 'outline'} size="sm"
              onClick={() => setActiveTab(tab.id as any)}
              className={activeTab === tab.id ? 'bg-cyan-600' : 'border-slate-700 text-slate-400'}>
              <Icon className="w-4 h-4 mr-1.5" /> {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Developer Stats */}
      {activeTab === 'stats' && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Code Quality Score', value: '87/100', grade: 'B+', icon: CheckCircle, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
              { label: 'Security Score', value: '92/100', grade: 'A', icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { label: 'Bugs Found Today', value: '3', grade: '', icon: Bug, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              { label: 'Tests Passed', value: '94%', grade: '', icon: Zap, color: 'text-violet-400', bg: 'bg-violet-500/10' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="bg-slate-900/50 border-slate-700/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        {stat.grade && (
                          <span className={`text-2xl font-bold ${gradeColor(stat.grade)}`}>{stat.grade}</span>
                        )}
                      </div>
                      <p className="text-xl font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-slate-400">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Recent Reviews by AI */}
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader><CardTitle className="text-base text-white flex items-center gap-2"><Eye className="w-5 h-5 text-cyan-400" /> Recent AI Reviews</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[
                { file: 'PaymentGateway.tsx', score: 92, issues: 1, time: '10 min ago' },
                { file: 'UserAuth.ts', score: 78, issues: 3, time: '1 hour ago' },
                { file: 'DataFetcher.ts', score: 95, issues: 0, time: '2 hours ago' },
                { file: 'FormValidator.tsx', score: 65, issues: 5, time: '3 hours ago' },
              ].map((review, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                  <div className="flex items-center gap-3">
                    <Code2 className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-white font-medium">{review.file}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Progress value={review.score} className="w-16 h-1.5" />
                      <span className={`text-xs font-medium ${review.score >= 90 ? 'text-emerald-400' : review.score >= 70 ? 'text-cyan-400' : 'text-amber-400'}`}>{review.score}%</span>
                    </div>
                    {review.issues > 0 ? (
                      <Badge variant="outline" className="text-amber-400 bg-amber-500/10 border-none text-[10px]">
                        {review.issues} issues
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-emerald-400 bg-emerald-500/10 border-none text-[10px]">Clean</Badge>
                    )}
                    <span className="text-[10px] text-slate-500">{review.time}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Code Input Area for review/security/tests */}
      {(activeTab === 'review' || activeTab === 'security' || activeTab === 'tests') && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-40 bg-slate-900/50 border-slate-700"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
                <SelectItem value="sql">SQL</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => runAction(activeTab === 'review' ? 'review' : activeTab === 'security' ? 'security_scan' : 'test_generate')}
              disabled={isReviewing || !code.trim()}
              className="bg-cyan-600 hover:bg-cyan-500">
              {isReviewing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</> : <><Brain className="w-4 h-4 mr-2" /> Run AI {activeTab === 'review' ? 'Review' : activeTab === 'security' ? 'Scan' : 'Test Gen'}</>}
            </Button>
          </div>

          <Textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Apna code yahan paste karo..."
            className="min-h-[200px] bg-slate-900/50 border-slate-700 font-mono text-sm"
          />

          {/* Results */}
          {reviewResult && (
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" /> Analysis Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reviewResult.score !== undefined && (
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-center">
                      <p className={`text-4xl font-bold ${reviewResult.score >= 80 ? 'text-emerald-400' : reviewResult.score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>{reviewResult.score}</p>
                      <p className="text-xs text-slate-400">Score</p>
                    </div>
                    {reviewResult.grade && (
                      <div className="text-center">
                        <p className={`text-4xl font-bold ${gradeColor(reviewResult.grade)}`}>{reviewResult.grade}</p>
                        <p className="text-xs text-slate-400">Grade</p>
                      </div>
                    )}
                    {reviewResult.summary && (
                      <p className="text-sm text-slate-300 flex-1">{reviewResult.summary}</p>
                    )}
                  </div>
                )}

                {reviewResult.issues?.length > 0 && (
                  <div className="space-y-2">
                    {reviewResult.issues.map((issue: any, i: number) => (
                      <div key={i} className={`p-3 rounded-lg border ${severityColor(issue.severity)} bg-opacity-5 border-opacity-20`}>
                        <div className="flex items-center gap-2 mb-1">
                          {issue.severity === 'critical' ? <XCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                          <span className="text-xs font-medium uppercase">{issue.severity}</span>
                          {issue.line && <span className="text-[10px] text-slate-500">Line ~{issue.line}</span>}
                        </div>
                        <p className="text-sm text-slate-300">{issue.message}</p>
                        {issue.fix && <p className="text-xs text-slate-400 mt-1">💡 Fix: {issue.fix}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {reviewResult.raw && (
                  <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">{reviewResult.raw}</pre>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default DevCodeQualityPanel;

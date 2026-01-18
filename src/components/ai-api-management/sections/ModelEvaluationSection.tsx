/**
 * MODEL EVALUATION SECTION
 * Accuracy score, hallucination rate, benchmark tests, A/B testing
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, AlertCircle, FlaskConical, GitCompare, Play, Eye } from "lucide-react";
import { toast } from "sonner";

const evaluations = [
  { model: 'GPT-4 Turbo', accuracy: 94.2, hallucination: 2.1, benchmark: 'MMLU', score: 86.4, status: 'passed' },
  { model: 'Claude 3 Opus', accuracy: 92.8, hallucination: 1.8, benchmark: 'HumanEval', score: 84.9, status: 'passed' },
  { model: 'Gemini Pro', accuracy: 91.5, hallucination: 2.4, benchmark: 'GSM8K', score: 92.0, status: 'passed' },
  { model: 'Llama 3', accuracy: 88.3, hallucination: 3.2, benchmark: 'MATH', score: 78.5, status: 'warning' },
];

const abTests = [
  { name: 'Prompt v2 vs v3', models: ['GPT-4', 'Claude 3'], status: 'running', progress: 67, winner: null },
  { name: 'Temperature 0.7 vs 0.9', models: ['GPT-4'], status: 'completed', progress: 100, winner: '0.7' },
  { name: 'System Prompt Test', models: ['Gemini Pro'], status: 'pending', progress: 0, winner: null },
];

export const ModelEvaluationSection = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Target className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">91.7%</p>
            <p className="text-xs text-muted-foreground">Avg Accuracy</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <AlertCircle className="w-5 h-5 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">2.4%</p>
            <p className="text-xs text-muted-foreground">Hallucination Rate</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <FlaskConical className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">24</p>
            <p className="text-xs text-muted-foreground">Tests Run</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <GitCompare className="w-5 h-5 text-violet-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">3</p>
            <p className="text-xs text-muted-foreground">Active A/B Tests</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Benchmark Results</CardTitle>
          <Button size="sm" variant="outline" onClick={() => toast.success('Running new benchmark')}>
            <FlaskConical className="w-3 h-3 mr-2" />
            Run Benchmark
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {evaluations.map((eval_, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium text-white text-sm">{eval_.model}</p>
                    <p className="text-xs text-muted-foreground">{eval_.benchmark}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-emerald-400 font-medium">{eval_.accuracy}%</p>
                    <p className="text-[10px] text-muted-foreground">Accuracy</p>
                  </div>
                  <div className="text-center">
                    <p className="text-amber-400 font-medium">{eval_.hallucination}%</p>
                    <p className="text-[10px] text-muted-foreground">Halluc.</p>
                  </div>
                  <div className="text-center">
                    <p className="text-blue-400 font-medium">{eval_.score}</p>
                    <p className="text-[10px] text-muted-foreground">Score</p>
                  </div>
                  <Badge className={eval_.status === 'passed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}>
                    {eval_.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm">A/B Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {abTests.map((test, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-white text-sm">{test.name}</p>
                    <p className="text-xs text-muted-foreground">{test.models.join(', ')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {test.winner && (
                      <Badge className="bg-emerald-500/20 text-emerald-400">Winner: {test.winner}</Badge>
                    )}
                    <Badge className={
                      test.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                      test.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-slate-500/20 text-slate-400'
                    }>
                      {test.status}
                    </Badge>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => toast.info('Viewing test details')}>
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <Progress value={test.progress} className="h-1.5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

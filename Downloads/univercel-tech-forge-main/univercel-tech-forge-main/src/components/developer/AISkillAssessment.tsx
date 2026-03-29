import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, Target, TrendingUp, BookOpen, Zap, 
  ChevronRight, Award, AlertCircle, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useDeveloperAI } from '@/hooks/useDeveloperAI';
import { toast } from 'sonner';

const AISkillAssessment = () => {
  const { assessSkills, loading } = useDeveloperAI();
  const [assessment, setAssessment] = useState<any>(null);

  const mockData = {
    taskHistory: [
      { type: 'API', completed: 45 },
      { type: 'Frontend', completed: 32 },
      { type: 'Bug Fix', completed: 28 },
    ],
    qualityScore: 92,
    onTimeRate: 95,
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    bugRate: 3
  };

  const handleAssess = async () => {
    const result = await assessSkills(mockData);
    if (result) {
      setAssessment(result);
      toast.success('Assessment complete!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
            <Brain className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Skill Assessment</h2>
            <p className="text-sm text-slate-400">Analyze your skills and get growth recommendations</p>
          </div>
        </div>
        <Button
          onClick={handleAssess}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-cyan-600"
        >
          {loading ? 'Analyzing...' : 'Run Assessment'}
        </Button>
      </div>

      {/* Current Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Quality Score', value: mockData.qualityScore, color: 'emerald' },
          { label: 'On-Time Rate', value: mockData.onTimeRate, color: 'blue' },
          { label: 'Bug Rate', value: mockData.bugRate, color: 'amber', suffix: '%' },
          { label: 'Tasks Done', value: 105, color: 'violet' },
        ].map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
          >
            <p className="text-sm text-slate-400">{metric.label}</p>
            <div className="flex items-end gap-1 mt-1">
              <span className={`text-2xl font-bold text-${metric.color}-400`}>
                {metric.value}
              </span>
              <span className="text-slate-500 mb-1">{metric.suffix || '%'}</span>
            </div>
            <Progress 
              value={metric.value} 
              className="mt-2 h-1.5"
            />
          </motion.div>
        ))}
      </div>

      {/* Assessment Results */}
      {assessment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Level & Career Path */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-violet-400" />
                <h4 className="font-semibold text-white">Current Level</h4>
              </div>
              <p className="text-2xl font-bold text-violet-400">{assessment.currentLevel || "Senior Developer"}</p>
              <p className="text-sm text-slate-400 mt-2">{assessment.estimatedGrowth}</p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-cyan-400" />
                <h4 className="font-semibold text-white">Career Path</h4>
              </div>
              <p className="text-lg text-cyan-400">{assessment.careerPath || "Full Stack Lead"}</p>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 rounded-xl bg-slate-800/50 border border-emerald-500/20">
              <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Strengths
              </h4>
              <div className="space-y-2">
                {(assessment.strengths || ['Code Quality', 'Time Management', 'Problem Solving']).map((strength: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300">{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl bg-slate-800/50 border border-amber-500/20">
              <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                Areas to Improve
              </h4>
              <div className="space-y-2">
                {(assessment.improvements || ['System Design', 'Documentation']).map((area: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10">
                    <ChevronRight className="w-4 h-4 text-amber-400" />
                    <span className="text-slate-300">{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Learning */}
          {assessment.recommendedLearning && (
            <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                Recommended Learning Path
              </h4>
              <div className="space-y-3">
                {assessment.recommendedLearning.map((item: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        item.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-medium text-white">{item.topic}</p>
                        <p className="text-sm text-slate-400">{item.reason}</p>
                      </div>
                    </div>
                    <Badge className={
                      item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      item.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-slate-500/20 text-slate-400'
                    }>
                      {item.priority}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AISkillAssessment;

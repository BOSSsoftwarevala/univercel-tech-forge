import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Target, Clock, Coffee, Brain, 
  TrendingUp, CheckCircle2, Flame, Battery
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useDeveloperAI } from '@/hooks/useDeveloperAI';
import { toast } from 'sonner';

const AIProductivityCoach = () => {
  const { getProductivityTips, loading } = useDeveloperAI();
  const [tips, setTips] = useState<any>(null);

  const coachData = {
    workHours: 8,
    peakTime: '10 AM - 12 PM',
    distractions: ['Social media', 'Notifications', 'Meetings'],
    productivityScore: 78,
    goal: 'Complete 2 more tasks daily'
  };

  const handleGetTips = async () => {
    const result = await getProductivityTips(coachData);
    if (result) {
      setTips(result);
      toast.success('Productivity insights ready!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30"
          >
            <Flame className="w-6 h-6 text-orange-400" />
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Productivity Coach</h2>
            <p className="text-sm text-slate-400">Personalized tips to boost your performance</p>
          </div>
        </div>
        <Button
          onClick={handleGetTips}
          disabled={loading}
          className="bg-gradient-to-r from-orange-600 to-red-600"
        >
          {loading ? 'Analyzing...' : 'Get Insights'}
        </Button>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <Battery className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-slate-400">Productivity</span>
          </div>
          <p className="text-2xl font-bold text-white">{coachData.productivityScore}%</p>
          <Progress value={coachData.productivityScore} className="mt-2 h-1.5" />
        </div>
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-slate-400">Peak Time</span>
          </div>
          <p className="text-lg font-bold text-cyan-400">{coachData.peakTime}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-slate-400">Daily Goal</span>
          </div>
          <p className="text-lg font-medium text-slate-300">{coachData.goal}</p>
        </div>
      </div>

      {/* Tips Results */}
      {tips && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Daily Tips */}
          {tips.dailyTips && (
            <div className="p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20">
              <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-400" />
                Today's Tips
              </h4>
              <div className="space-y-3">
                {tips.dailyTips.map((tip: string, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50"
                  >
                    <CheckCircle2 className="w-5 h-5 text-orange-400 mt-0.5" />
                    <p className="text-slate-300">{tip}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Focus Strategies */}
          {tips.focusStrategies && (
            <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-violet-400" />
                Focus Strategies
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {tips.focusStrategies.map((strategy: any, i: number) => (
                  <div key={i} className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
                    <h5 className="font-medium text-violet-400">{strategy.name}</h5>
                    <p className="text-sm text-slate-400 mt-1">{strategy.description}</p>
                    <Badge className="mt-2 bg-violet-500/20 text-violet-300">
                      {strategy.duration}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Break Schedule */}
          {tips.breakSchedule && (
            <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Coffee className="w-5 h-5 text-amber-400" />
                Optimal Break Schedule
              </h4>
              <div className="flex flex-wrap gap-3">
                {tips.breakSchedule.map((brk: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <span className="text-amber-400 font-mono">{brk.time}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-300">{brk.activity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weekly Goals */}
          {tips.weeklyGoals && (
            <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
              <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Weekly Goals
              </h4>
              <div className="space-y-2">
                {tips.weeklyGoals.map((goal: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm font-bold">
                      {i + 1}
                    </span>
                    <span className="text-slate-300">{goal}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Energy Optimization */}
          {tips.energyOptimization && (
            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <p className="text-cyan-400 italic">💡 {tips.energyOptimization}</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AIProductivityCoach;

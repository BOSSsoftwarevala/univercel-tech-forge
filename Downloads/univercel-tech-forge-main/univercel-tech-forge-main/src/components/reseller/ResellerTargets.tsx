import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Award,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const ResellerTargets = () => {
  const monthlyTargets = [
    { 
      metric: 'Total Sales', 
      current: 720000, 
      target: 1000000, 
      unit: '₹',
      deadline: '31 Jan',
      bonus: 15000
    },
    { 
      metric: 'New Conversions', 
      current: 18, 
      target: 25, 
      unit: '',
      deadline: '31 Jan',
      bonus: 5000
    },
    { 
      metric: 'Demo Sessions', 
      current: 42, 
      target: 50, 
      unit: '',
      deadline: '31 Jan',
      bonus: 2500
    },
    { 
      metric: 'Lead Follow-ups', 
      current: 156, 
      target: 180, 
      unit: '',
      deadline: '31 Jan',
      bonus: 1500
    },
  ];

  const milestones = [
    { amount: 500000, label: '₹5L', achieved: true, bonus: 2500 },
    { amount: 750000, label: '₹7.5L', achieved: false, bonus: 5000, current: true },
    { amount: 1000000, label: '₹10L', achieved: false, bonus: 15000 },
    { amount: 1500000, label: '₹15L', achieved: false, bonus: 30000 },
  ];

  const weeklyProgress = [
    { week: 'Week 1', target: 250000, achieved: 280000, status: 'exceeded' },
    { week: 'Week 2', target: 250000, achieved: 220000, status: 'missed' },
    { week: 'Week 3', target: 250000, achieved: 220000, status: 'in_progress' },
    { week: 'Week 4', target: 250000, achieved: 0, status: 'upcoming' },
  ];

  const formatCurrency = (value: number) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-400" />
            Targets & Goals
          </h1>
          <p className="text-slate-400">Track your monthly targets and bonuses</p>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2">
          <Calendar className="w-4 h-4 mr-2" />
          January 2024
        </Badge>
      </div>

      {/* Monthly Targets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {monthlyTargets.map((item, index) => {
          const progress = (item.current / item.target) * 100;
          const isCompleted = progress >= 100;
          
          return (
            <motion.div
              key={item.metric}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-slate-900/50 border-emerald-500/20 ${isCompleted ? 'ring-2 ring-emerald-500/30' : ''}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold">{item.metric}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span className="text-slate-500 text-xs">Deadline: {item.deadline}</span>
                      </div>
                    </div>
                    {isCompleted ? (
                      <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Achieved
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <Award className="w-3 h-3 mr-1" /> +₹{item.bonus.toLocaleString()}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-3xl font-bold text-white">
                      {item.unit === '₹' ? formatCurrency(item.current) : item.current}
                    </span>
                    <span className="text-slate-400">
                      / {item.unit === '₹' ? formatCurrency(item.target) : item.target}
                    </span>
                  </div>
                  
                  <Progress 
                    value={Math.min(progress, 100)} 
                    className={`h-3 bg-slate-700 ${isCompleted ? '[&>div]:bg-green-500' : ''}`} 
                  />
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-sm font-medium ${isCompleted ? 'text-green-400' : 'text-emerald-400'}`}>
                      {progress.toFixed(0)}% complete
                    </span>
                    <span className="text-slate-500 text-sm">
                      {item.unit === '₹' 
                        ? formatCurrency(Math.max(0, item.target - item.current)) 
                        : Math.max(0, item.target - item.current)
                      } to go
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Milestone Tracker */}
      <Card className="bg-slate-900/50 border-emerald-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Sales Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-slate-700 rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '40%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
              />
            </div>
            
            {/* Milestones */}
            <div className="flex justify-between relative">
              {milestones.map((milestone, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                    milestone.achieved 
                      ? 'bg-emerald-500 text-white' 
                      : milestone.current
                        ? 'bg-emerald-500/30 border-2 border-emerald-400 text-emerald-400'
                        : 'bg-slate-700 text-slate-400'
                  }`}>
                    {milestone.achieved ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Target className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`mt-3 font-bold ${
                    milestone.achieved ? 'text-emerald-400' : milestone.current ? 'text-white' : 'text-slate-500'
                  }`}>
                    {milestone.label}
                  </span>
                  <span className={`text-xs mt-1 ${
                    milestone.achieved ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    +₹{milestone.bonus.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <ArrowRight className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-emerald-300 font-medium">Next Milestone: ₹7.5L</p>
                <p className="text-emerald-200/70 text-sm">₹30,000 more to unlock ₹5,000 bonus</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress */}
      <Card className="bg-slate-900/50 border-emerald-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            Weekly Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyProgress.map((week, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-20 text-slate-400 text-sm">{week.week}</div>
                <div className="flex-1">
                  <div className="h-8 bg-slate-700 rounded-lg overflow-hidden flex items-center">
                    {week.status !== 'upcoming' && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(week.achieved / week.target) * 100}%` }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className={`h-full rounded-lg ${
                          week.status === 'exceeded' ? 'bg-emerald-500' :
                          week.status === 'missed' ? 'bg-red-500' :
                          'bg-amber-500'
                        }`}
                      />
                    )}
                  </div>
                </div>
                <div className="w-24 text-right">
                  <p className={`font-bold ${
                    week.status === 'exceeded' ? 'text-emerald-400' :
                    week.status === 'missed' ? 'text-red-400' :
                    week.status === 'upcoming' ? 'text-slate-500' :
                    'text-amber-400'
                  }`}>
                    {formatCurrency(week.achieved)}
                  </p>
                  <p className="text-slate-500 text-xs">/ {formatCurrency(week.target)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResellerTargets;

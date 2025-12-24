import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Compass, TrendingUp, Target, Award, BookOpen, Briefcase,
  Star, Zap, Users, DollarSign, Brain, Rocket, ArrowRight,
  CheckCircle2, Clock, Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useDeveloperAI } from '@/hooks/useDeveloperAI';
import { toast } from 'sonner';

const AICareerAdvisor = () => {
  const { prepareInterview, loading } = useDeveloperAI();
  const [advice, setAdvice] = useState<any>(null);

  const handleGetAdvice = async () => {
    const result = await prepareInterview({
      currentRole: 'Junior Developer',
      targetRole: 'Senior Developer',
      skills: ['React', 'TypeScript', 'Node.js'],
      experience: 2,
    });
    if (result) {
      setAdvice(result);
      toast.success('Career advice generated!');
    }
  };

  const careerPath = [
    { level: 'Junior Developer', status: 'completed', earnings: '₹15K-25K', skills: 3 },
    { level: 'Mid Developer', status: 'current', earnings: '₹25K-45K', skills: 6 },
    { level: 'Senior Developer', status: 'next', earnings: '₹45K-75K', skills: 10 },
    { level: 'Lead Developer', status: 'future', earnings: '₹75K-120K', skills: 15 },
    { level: 'Architect', status: 'future', earnings: '₹120K+', skills: 20 },
  ];

  const skills = [
    { name: 'React', level: 85, trend: '+12%', hot: true },
    { name: 'TypeScript', level: 78, trend: '+18%', hot: true },
    { name: 'Node.js', level: 72, trend: '+8%', hot: false },
    { name: 'System Design', level: 45, trend: '+25%', hot: true },
    { name: 'AWS', level: 35, trend: '+22%', hot: true },
    { name: 'GraphQL', level: 28, trend: '+15%', hot: false },
  ];

  const opportunities = [
    { type: 'High-Value Project', match: 95, earnings: '₹8,000', time: '4h', urgency: 'hot' },
    { type: 'Skill Building Task', match: 88, earnings: '₹3,500', time: '2h', urgency: 'normal' },
    { type: 'Leadership Task', match: 72, earnings: '₹12,000', time: '8h', urgency: 'hot' },
  ];

  const marketInsights = [
    { skill: 'AI/ML Integration', demand: '+340%', avgRate: '₹2,500/hr' },
    { skill: 'React Native', demand: '+180%', avgRate: '₹1,800/hr' },
    { skill: 'Web3/Blockchain', demand: '+220%', avgRate: '₹3,000/hr' },
    { skill: 'DevOps', demand: '+150%', avgRate: '₹2,000/hr' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
              <Compass className="w-6 h-6 text-white" />
            </div>
            AI Career Advisor
          </h1>
          <p className="text-slate-400 mt-1">Personalized career path & growth recommendations</p>
        </div>
        <Button
          onClick={handleGetAdvice}
          disabled={loading}
          className="bg-gradient-to-r from-amber-500 to-orange-500"
        >
          <Brain className="w-4 h-4 mr-2" />
          Get AI Advice
        </Button>
      </div>

      {/* Career Path Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30"
      >
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Rocket className="w-5 h-5 text-amber-400" />
          Your Career Trajectory
        </h3>
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-6 left-8 right-8 h-1 bg-slate-700 rounded">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded"
              initial={{ width: 0 }}
              animate={{ width: '35%' }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          {/* Career Nodes */}
          <div className="flex justify-between relative z-10">
            {careerPath.map((node, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${
                  node.status === 'completed' ? 'bg-emerald-500' :
                  node.status === 'current' ? 'bg-gradient-to-br from-amber-500 to-orange-500 ring-4 ring-amber-500/30' :
                  'bg-slate-700'
                }`}>
                  {node.status === 'completed' ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : node.status === 'current' ? (
                    <Star className="w-6 h-6 text-white" />
                  ) : (
                    <span className="text-slate-400 text-sm">{i + 1}</span>
                  )}
                </div>
                <p className={`mt-3 text-sm font-medium ${
                  node.status === 'current' ? 'text-amber-400' : 'text-slate-400'
                }`}>{node.level}</p>
                <p className="text-xs text-slate-500">{node.earnings}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Skills & Market Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Radar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            Skill Analysis
          </h3>
          <div className="space-y-4">
            {skills.map((skill, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white">{skill.name}</span>
                    {skill.hot && (
                      <Badge className="bg-red-500/20 text-red-400 text-xs px-1.5 py-0">
                        <Flame className="w-3 h-3 mr-1" />
                        HOT
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-400">{skill.trend}</span>
                    <span className="text-sm text-cyan-400">{skill.level}%</span>
                  </div>
                </div>
                <Progress value={skill.level} className="h-2" />
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <p className="text-sm text-cyan-400">
              <Zap className="w-4 h-4 inline mr-1" />
              Focus on System Design & AWS to unlock Senior roles
            </p>
          </div>
        </motion.div>

        {/* Market Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Market Insights
          </h3>
          <div className="space-y-3">
            {marketInsights.map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{insight.skill}</span>
                  <Badge className="bg-emerald-500">{insight.demand}</Badge>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-400">Average Rate</span>
                  <span className="text-sm text-amber-400">{insight.avgRate}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recommended Opportunities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-purple-400" />
          AI-Recommended Opportunities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {opportunities.map((opp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-5 rounded-xl border ${
                opp.urgency === 'hot' 
                  ? 'bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30'
                  : 'bg-slate-700/50 border-slate-600/50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Badge className={opp.urgency === 'hot' ? 'bg-red-500' : 'bg-slate-600'}>
                  {opp.match}% Match
                </Badge>
                {opp.urgency === 'hot' && <Flame className="w-4 h-4 text-orange-400" />}
              </div>
              <h4 className="text-white font-medium mb-2">{opp.type}</h4>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-emerald-400">
                  <DollarSign className="w-4 h-4" />
                  {opp.earnings}
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-4 h-4" />
                  {opp.time}
                </div>
              </div>
              <Button size="sm" className="w-full mt-4 bg-cyan-500 hover:bg-cyan-600">
                View Task
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Learning Path */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          Recommended Learning Path
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: 'System Design Basics', duration: '2 weeks', priority: 'High' },
            { title: 'AWS Fundamentals', duration: '3 weeks', priority: 'High' },
            { title: 'Advanced TypeScript', duration: '1 week', priority: 'Medium' },
            { title: 'GraphQL Mastery', duration: '2 weeks', priority: 'Low' },
          ].map((course, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-2">
                <Badge className={`text-xs ${
                  course.priority === 'High' ? 'bg-red-500' :
                  course.priority === 'Medium' ? 'bg-amber-500' : 'bg-slate-600'
                }`}>{course.priority}</Badge>
              </div>
              <h4 className="text-white font-medium">{course.title}</h4>
              <p className="text-xs text-slate-400 mt-1">{course.duration}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AICareerAdvisor;

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, Play, CheckCircle2, Clock, Award,
  BookOpen, Target, Zap, MessageSquare, Star, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface TrainingModule {
  id: string;
  title: string;
  type: 'sales' | 'product' | 'compliance' | 'ai_coaching';
  duration: string;
  progress: number;
  score?: number;
  locked: boolean;
  description: string;
}

const FranchiseAITraining = () => {
  const [modules] = useState<TrainingModule[]>([
    { id: '1', title: 'Sales Fundamentals', type: 'sales', duration: '45 min', progress: 100, score: 92, locked: false, description: 'Master the basics of consultative selling' },
    { id: '2', title: 'Product Knowledge - E-Commerce', type: 'product', duration: '30 min', progress: 100, score: 88, locked: false, description: 'Deep dive into e-commerce platform features' },
    { id: '3', title: 'Objection Handling', type: 'sales', duration: '25 min', progress: 65, locked: false, description: 'Learn to overcome common objections' },
    { id: '4', title: 'Compliance & Ethics', type: 'compliance', duration: '20 min', progress: 40, locked: false, description: 'Understanding regulatory requirements' },
    { id: '5', title: 'AI Sales Coach - Live', type: 'ai_coaching', duration: 'Interactive', progress: 0, locked: false, description: 'Practice with AI-powered role-play' },
    { id: '6', title: 'Advanced Negotiation', type: 'sales', duration: '40 min', progress: 0, locked: true, description: 'Advanced techniques for closing deals' },
  ]);

  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [showAICoach, setShowAICoach] = useState(false);

  const overallProgress = Math.round(modules.reduce((acc, m) => acc + m.progress, 0) / modules.length);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sales': return 'text-indigo-400 bg-indigo-500/20';
      case 'product': return 'text-emerald-400 bg-emerald-500/20';
      case 'compliance': return 'text-amber-400 bg-amber-500/20';
      case 'ai_coaching': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const salesScripts = [
    { category: 'E-Commerce', script: 'Focus on ROI and ease of integration. Highlight 24/7 support and scalability.' },
    { category: 'Healthcare', script: 'Emphasize compliance (HIPAA), data security, and patient management features.' },
    { category: 'Education', script: 'Showcase student engagement tools, parent portal, and reporting capabilities.' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Training Center</h1>
          <p className="text-slate-400">Enhance your sales skills with AI-powered coaching</p>
        </div>
        <Button onClick={() => setShowAICoach(true)} className="bg-purple-500 hover:bg-purple-600">
          <MessageSquare className="w-4 h-4 mr-2" />
          AI Sales Coach
        </Button>
      </div>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Overall Progress</p>
              <p className="text-2xl font-bold text-white">{overallProgress}%</p>
            </div>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Completed</p>
              <p className="text-2xl font-bold text-white">{modules.filter(m => m.progress === 100).length} / {modules.length}</p>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Average Score</p>
              <p className="text-2xl font-bold text-white">
                {Math.round(modules.filter(m => m.score).reduce((acc, m) => acc + (m.score || 0), 0) / modules.filter(m => m.score).length)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Training Modules */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Training Modules</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-5 rounded-xl border transition-all ${
                module.locked 
                  ? 'bg-slate-900/50 border-slate-800/50 opacity-60' 
                  : 'bg-slate-800/50 border-slate-700/50 hover:border-indigo-500/30'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    module.progress === 100 ? 'bg-emerald-500/20' : 'bg-slate-700/50'
                  }`}>
                    {module.locked ? (
                      <Lock className="w-5 h-5 text-slate-500" />
                    ) : module.progress === 100 ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <BookOpen className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{module.title}</h3>
                    <p className="text-xs text-slate-400">{module.description}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${getTypeColor(module.type)}`}>
                  {module.type.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-400 mb-3">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{module.duration}</span>
                </div>
                {module.score && (
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4" />
                    <span>Score: {module.score}%</span>
                  </div>
                )}
              </div>

              <Progress value={module.progress} className="h-2 mb-3" />

              {!module.locked && (
                <Button 
                  className={`w-full ${module.progress === 100 ? 'bg-slate-700' : 'bg-indigo-500 hover:bg-indigo-600'}`}
                  disabled={module.progress === 100}
                >
                  {module.progress === 100 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Completed
                    </>
                  ) : module.progress > 0 ? (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Continue
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </>
                  )}
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Sales Scripts */}
      <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">AI-Generated Sales Scripts</h2>
        </div>
        <div className="space-y-3">
          {salesScripts.map((script, index) => (
            <motion.div
              key={script.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-slate-900/50 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">{script.category}</span>
              </div>
              <p className="text-sm text-slate-300">{script.script}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Coach Modal */}
      {showAICoach && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAICoach(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="w-full max-w-2xl p-6 bg-slate-900 border border-purple-500/30 rounded-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">AI Sales Coach</h2>
                <p className="text-slate-400 text-sm">Practice your pitch with AI-powered role-play</p>
              </div>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg mb-4">
              <p className="text-sm text-slate-300 mb-3">
                <strong className="text-purple-400">AI Coach:</strong> "Hello! I'm interested in learning about your e-commerce solution. We're a mid-size retail business looking to expand online. What can you tell me about your platform?"
              </p>
              <p className="text-xs text-slate-500">Practice responding to this customer inquiry...</p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowAICoach(false)}>
                End Session
              </Button>
              <Button className="flex-1 bg-purple-500 hover:bg-purple-600">
                <MessageSquare className="w-4 h-4 mr-2" />
                Respond
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default FranchiseAITraining;

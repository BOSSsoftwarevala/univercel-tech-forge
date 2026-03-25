import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Briefcase, Code2, Award, Rocket, 
  Download, Share2, RefreshCw, CheckCircle2, Star,
  TrendingUp, Zap, Target, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDeveloperAI } from '@/hooks/useDeveloperAI';
import { toast } from 'sonner';

const AIPortfolioBuilder = () => {
  const { buildPortfolio, loading } = useDeveloperAI();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [generating, setGenerating] = useState(false);

  // Mock developer data
  const developerData = {
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'AWS'],
    experience: '3 years',
    projectCount: 127,
    technologies: ['React', 'Next.js', 'Tailwind', 'Supabase', 'Docker'],
    rating: 4.8,
    specialization: 'Full Stack Development'
  };

  const handleGenerate = async () => {
    setGenerating(true);
    const result = await buildPortfolio(developerData);
    if (result) {
      setPortfolio(result);
      toast.success('Portfolio generated successfully!');
    }
    setGenerating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30"
          >
            <Sparkles className="w-6 h-6 text-violet-400" />
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Portfolio Builder</h2>
            <p className="text-sm text-slate-400">Create a compelling professional portfolio</p>
          </div>
        </div>
        <Button
          onClick={handleGenerate}
          disabled={loading || generating}
          className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500"
        >
          {generating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Rocket className="w-4 h-4 mr-2" />
              Generate Portfolio
            </>
          )}
        </Button>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Projects', value: '127', icon: Briefcase, color: 'cyan' },
          { label: 'Rating', value: '4.8★', icon: Star, color: 'amber' },
          { label: 'Experience', value: '3 Years', icon: TrendingUp, color: 'emerald' },
          { label: 'Technologies', value: '12+', icon: Code2, color: 'violet' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/20`}
          >
            <stat.icon className={`w-5 h-5 text-${stat.color}-400 mb-2`} />
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Generated Portfolio */}
      <AnimatePresence>
        {portfolio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Headline & Summary */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-violet-500/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {portfolio.headline || "Full Stack Developer"}
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {portfolio.summary || "Experienced developer with a passion for building scalable applications."}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-violet-500/30 text-violet-400">
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                  <Button size="sm" variant="outline" className="border-cyan-500/30 text-cyan-400">
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Key Skills */}
              <div className="flex flex-wrap gap-2 mt-4">
                {(portfolio.keySkills || developerData.skills).map((skill: string, i: number) => (
                  <Badge key={i} className="bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Achievements */}
            {portfolio.achievements && (
              <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  Key Achievements
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {portfolio.achievements.map((achievement: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 rounded-lg bg-slate-900/50 border border-amber-500/20"
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-amber-400 mt-0.5" />
                        <div>
                          <h5 className="font-medium text-white">{achievement.title}</h5>
                          <p className="text-sm text-slate-400 mt-1">{achievement.description}</p>
                          {achievement.impact && (
                            <Badge className="mt-2 bg-emerald-500/20 text-emerald-400 border-0">
                              Impact: {achievement.impact}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Project Showcase */}
            {portfolio.projectShowcase && (
              <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  Project Showcase
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {portfolio.projectShowcase.map((project: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-all group"
                    >
                      <h5 className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                        {project.name}
                      </h5>
                      <p className="text-sm text-slate-400 mt-2 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {project.technologies?.slice(0, 3).map((tech: string, j: number) => (
                          <Badge key={j} variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      {project.metrics && (
                        <div className="mt-3 pt-3 border-t border-slate-700/50">
                          <span className="text-xs text-emerald-400">{project.metrics}</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!portfolio && !generating && (
        <div className="text-center py-12">
          <Sparkles className="w-16 h-16 text-violet-400/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-400">
            Click "Generate Portfolio" to create your AI-powered professional portfolio
          </h3>
          <p className="text-sm text-slate-500 mt-2">
            Based on your work history, skills, and achievements
          </p>
        </div>
      )}
    </div>
  );
};

export default AIPortfolioBuilder;

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Target, Zap, TrendingUp, Brain, 
  Flame, Snowflake, ThermometerSun, RefreshCw,
  ArrowRight, Star, Clock, DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useResellerAI } from '@/hooks/useResellerAI';
import { toast } from 'sonner';

const AILeadScoring = () => {
  const { scoreLead, loading } = useResellerAI();
  const [scores, setScores] = useState<any[]>([]);

  const mockLeads = [
    { id: 1, name: 'Tech Solutions Pvt', industry: 'Technology', size: '50-100', budget: '₹5L+', source: 'Website' },
    { id: 2, name: 'Global Enterprises', industry: 'Manufacturing', size: '100-500', budget: '₹10L+', source: 'Referral' },
    { id: 3, name: 'StartUp India Co', industry: 'Fintech', size: '10-50', budget: '₹2-5L', source: 'LinkedIn' },
    { id: 4, name: 'Digital First Ltd', industry: 'E-commerce', size: '50-100', budget: '₹5L+', source: 'Demo Request' },
  ];

  const handleScoreAll = async () => {
    const results = [];
    for (const lead of mockLeads) {
      const result = await scoreLead({
        companyName: lead.name,
        industry: lead.industry,
        companySize: lead.size,
        budget: lead.budget,
        source: lead.source,
        engagement: { demoViews: Math.floor(Math.random() * 5), emailOpens: Math.floor(Math.random() * 10) },
        lastContact: '2 days ago'
      });
      if (result) {
        results.push({ ...lead, ...result });
      }
    }
    setScores(results);
    toast.success('All leads scored successfully!');
  };

  const getTierIcon = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'hot': return <Flame className="w-5 h-5 text-red-400" />;
      case 'warm': return <ThermometerSun className="w-5 h-5 text-amber-400" />;
      case 'cold': return <Snowflake className="w-5 h-5 text-blue-400" />;
      default: return <Target className="w-5 h-5 text-slate-400" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'hot': return 'from-red-500/20 to-orange-500/20 border-red-500/30';
      case 'warm': return 'from-amber-500/20 to-yellow-500/20 border-amber-500/30';
      case 'cold': return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
      default: return 'from-slate-500/20 to-slate-600/20 border-slate-500/30';
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
            className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30"
          >
            <Brain className="w-6 h-6 text-violet-400" />
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Lead Scoring</h2>
            <p className="text-sm text-slate-400">Predictive scoring with conversion probability</p>
          </div>
        </div>
        <Button onClick={handleScoreAll} disabled={loading} className="bg-violet-600 hover:bg-violet-500">
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Scoring...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Score All Leads
            </>
          )}
        </Button>
      </div>

      {/* Lead Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(scores.length > 0 ? scores : mockLeads).map((lead, i) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-5 rounded-xl bg-gradient-to-br ${
              lead.tier ? getTierColor(lead.tier) : 'from-slate-800/50 to-slate-900/50 border-slate-700/50'
            } border`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center">
                  <span className="text-lg font-bold text-emerald-400">{lead.name.charAt(0)}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">{lead.name}</h4>
                  <p className="text-sm text-slate-400">{lead.industry}</p>
                </div>
              </div>
              {lead.tier && getTierIcon(lead.tier)}
            </div>

            {lead.score !== undefined ? (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-400">Score</span>
                      <span className="text-sm font-bold text-emerald-400">{lead.score}/100</span>
                    </div>
                    <Progress value={lead.score} className="h-2" />
                  </div>
                  <Badge className={`${
                    lead.tier === 'hot' ? 'bg-red-500/20 text-red-400' :
                    lead.tier === 'warm' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {lead.tier?.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-slate-900/50">
                    <p className="text-xs text-slate-500">Conversion</p>
                    <p className="text-sm font-bold text-emerald-400">{lead.conversionProbability || '65%'}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/50">
                    <p className="text-xs text-slate-500">Best Time</p>
                    <p className="text-sm font-bold text-cyan-400">{lead.idealContactTime || '10-11 AM'}</p>
                  </div>
                </div>

                {lead.bestApproach && (
                  <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                    <p className="text-xs text-violet-400 mb-1">Recommended Approach</p>
                    <p className="text-sm text-slate-300">{lead.bestApproach}</p>
                  </div>
                )}

                {lead.recommendedActions && (
                  <div className="mt-3 space-y-2">
                    {lead.recommendedActions.slice(0, 2).map((action: any, j: number) => (
                      <div key={j} className="flex items-center gap-2 text-sm">
                        <ArrowRight className="w-3 h-3 text-emerald-400" />
                        <span className="text-slate-300">{action.action || action}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {lead.size}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {lead.budget}
                  </span>
                </div>
                <Badge variant="outline" className="text-slate-400 border-slate-600">
                  Pending Score
                </Badge>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Scoring Legend */}
      <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
        <h4 className="text-sm font-semibold text-slate-400 mb-3">Score Legend</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-400" />
            <span className="text-sm text-slate-300">Hot (80-100): Immediate action</span>
          </div>
          <div className="flex items-center gap-2">
            <ThermometerSun className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-slate-300">Warm (50-79): Nurture required</span>
          </div>
          <div className="flex items-center gap-2">
            <Snowflake className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-slate-300">Cold (0-49): Long-term follow-up</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AILeadScoring;

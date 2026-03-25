import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  TrendingUp, 
  TrendingDown,
  Target,
  Info,
  Plus
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { SEOManagerSystem } from "@/hooks/useSEOManagerSystem";

interface SEOKeywordPerformanceProps {
  system: SEOManagerSystem;
}

const SEOKeywordPerformance = ({ system }: SEOKeywordPerformanceProps) => {
  const keywords = system.dashboard?.keywords || [];

  const getDifficultyColor = (difficultyScore: number) => {
    if (difficultyScore < 35) return "bg-emerald-500/20 text-emerald-400";
    if (difficultyScore < 65) return "bg-amber-500/20 text-amber-400";
    if (difficultyScore >= 65) return "bg-red-500/20 text-red-400";
    switch (difficultyScore) {
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case "informational":
      case "info": return "bg-blue-500/20 text-blue-400";
      case "transactional":
      case "buy": return "bg-purple-500/20 text-purple-400";
      case "navigational": return "bg-cyan-500/20 text-cyan-400";
      case "commercial": return "bg-pink-500/20 text-pink-400";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  const handleAddKeyword = () => {
    system.generateKeywordsMutation.mutate({ niche: "software automation", country: "IN", language: "en" }, {
      onSuccess: (rows) => {
        toast({
          title: "Keyword Research Complete",
          description: `${rows.length} keyword opportunities generated and clustered.`,
        });
      },
      onError: (error) => {
        toast({ title: "Keyword Research Failed", description: error.message, variant: "destructive" });
      },
    });
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-100">
            <Search className="h-5 w-5 text-purple-400" />
            Keyword Performance
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={handleAddKeyword}
          >
            <Plus className="h-3 w-3 mr-1" />
            Run Auto Research
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {keywords.map((kw, index) => (
          <motion.div
            key={kw.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-slate-100">{kw.keyword}</h4>
                </div>
                <p className="text-xs text-slate-400">{kw.cluster_name || kw.country_code || "tracked keyword"}</p>
                <div className="flex items-center gap-2">
                  <Badge className={getDifficultyColor(kw.difficulty_score)}>
                    difficulty {kw.difficulty_score}
                  </Badge>
                  <Badge className={getIntentColor(kw.intent)}>
                    <Target className="h-3 w-3 mr-1" />
                    {kw.intent}
                  </Badge>
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-2xl font-bold text-slate-100">#{kw.current_rank ?? 100}</span>
                  {(kw.current_rank ?? 100) <= 10 ? (
                    <span className="flex items-center text-xs text-emerald-400">
                      <TrendingUp className="h-3 w-3 mr-0.5" />
                      top 10
                    </span>
                  ) : (kw.current_rank ?? 100) > 20 ? (
                    <span className="flex items-center text-xs text-red-400">
                      <TrendingDown className="h-3 w-3 mr-0.5" />
                      needs lift
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">—</span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  Vol: {kw.search_volume.toLocaleString()}/mo
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* AI Suggestion Notice */}
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-start gap-2">
          <Info className="h-4 w-4 text-blue-400 mt-0.5" />
          <p className="text-xs text-blue-400">
            AI suggests keywords based on search intent & difficulty.
            Manual adds require documented reasoning.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SEOKeywordPerformance;

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Lightbulb, 
  Link2,
  AlertTriangle,
  TrendingUp,
  Eye,
  CheckCircle,
  XCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { SEOManagerSystem } from "@/hooks/useSEOManagerSystem";

interface SEOAISuggestionsProps {
  system: SEOManagerSystem;
}

const SEOAISuggestions = ({ system }: SEOAISuggestionsProps) => {
  const [showReasoning, setShowReasoning] = useState<string | null>(null);
  const suggestions = system.dashboard?.aiSuggestions || [];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "keyword": return <Lightbulb className="h-4 w-4 text-amber-400" />;
      case "internal_link": return <Link2 className="h-4 w-4 text-cyan-400" />;
      case "cannibalization": return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case "ranking": return <TrendingUp className="h-4 w-4 text-emerald-400" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "high": return <Badge className="bg-red-500/20 text-red-400">High Impact</Badge>;
      case "medium": return <Badge className="bg-amber-500/20 text-amber-400">Medium Impact</Badge>;
      case "low": return <Badge className="bg-slate-500/20 text-slate-400">Low Impact</Badge>;
      default: return null;
    }
  };

  const handleReview = (id: string) => {
    system.updateSuggestionStatusMutation.mutate({ suggestionId: id, status: "reviewed" }, {
      onSuccess: () => {
        toast({
          title: "Suggestion Reviewed",
          description: `AI suggestion ${id} marked as reviewed.`,
        });
      },
      onError: (error) => {
        toast({ title: "Suggestion Update Failed", description: error.message, variant: "destructive" });
      },
    });
  };

  const handleDismiss = (id: string) => {
    system.updateSuggestionStatusMutation.mutate({ suggestionId: id, status: "dismissed" }, {
      onSuccess: () => {
        toast({
          title: "Suggestion Dismissed",
          description: "Dismissal reason will be logged.",
        });
      },
      onError: (error) => {
        toast({ title: "Suggestion Update Failed", description: error.message, variant: "destructive" });
      },
    });
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-100">
            <Brain className="h-5 w-5 text-pink-400" />
            AI SEO Suggestions
          </CardTitle>
          <Badge variant="outline" className="bg-pink-500/20 text-pink-400 border-pink-500/30">
            {suggestions.filter(s => s.status === "new").length} New
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Critical Warning */}
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-xs text-red-400 font-medium">
            ⚠️ AI AUTO-APPLY IS BLOCKED. All suggestions require manual review.
            AI reasoning is visible for transparency.
          </p>
        </div>

        {suggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${
              suggestion.status === "dismissed" 
                ? "bg-slate-800/30 border-slate-700/30 opacity-60" 
                : "bg-slate-800/50 border-slate-700/50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-slate-900/50">
                {getTypeIcon(suggestion.type)}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-slate-100">{suggestion.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    {getImpactBadge(suggestion.impact)}
                    <Badge className="bg-slate-700/50 text-slate-300">
                      {suggestion.confidence}% confident
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-slate-200">{suggestion.suggestion}</p>

                {/* AI Reasoning */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 text-xs text-blue-400 hover:text-blue-300 p-0"
                  onClick={() => setShowReasoning(showReasoning === suggestion.id ? null : suggestion.id)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  {showReasoning === suggestion.id ? "Hide" : "View"} AI Reasoning
                </Button>

                {showReasoning === suggestion.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3 rounded bg-slate-900/50 text-xs text-slate-400"
                  >
                    <p className="font-medium text-slate-300 mb-1">AI Reasoning:</p>
                    <p>{suggestion.reasoning}</p>
                  </motion.div>
                )}

                {/* Actions */}
                {suggestion.status === "new" && (
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs text-emerald-400 hover:text-emerald-300"
                      onClick={() => handleReview(suggestion.id)}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Mark Reviewed
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs text-red-400 hover:text-red-300"
                      onClick={() => handleDismiss(suggestion.id)}
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      Dismiss
                    </Button>
                  </div>
                )}

                {suggestion.status === "reviewed" && (
                  <Badge className="bg-emerald-500/20 text-emerald-400">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Reviewed
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SEOAISuggestions;

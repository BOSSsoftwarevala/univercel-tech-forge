import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, FileText, AlertTriangle, GitCompare, Globe, Lightbulb, Eye, Edit, Lock, CheckCircle, History, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface LMAILegalIntelligenceProps {
  activeSubSection: string;
}

const aiFeatures = [
  { id: "1", name: "Auto Draft Agreements", type: "Generation", status: "active", accuracy: "98%", uses: 1245 },
  { id: "2", name: "Auto Risk Detection", type: "Analysis", status: "active", accuracy: "95%", uses: 892 },
  { id: "3", name: "Clause Conflict Detection", type: "Validation", status: "active", accuracy: "97%", uses: 567 },
  { id: "4", name: "Country Law Mismatch Alerts", type: "Compliance", status: "active", accuracy: "99%", uses: 234 },
  { id: "5", name: "Auto Update Suggestions", type: "Recommendation", status: "active", accuracy: "94%", uses: 456 },
];

const LMAILegalIntelligence = ({ activeSubSection }: LMAILegalIntelligenceProps) => {
  const handleAction = (action: string, item: string) => {
    const toastMap: Record<string, () => void> = {
      view: () => toast.info(`Viewing: ${item}`),
      edit: () => toast.info(`Editing: ${item}`),
      run: () => toast.success(`Running AI: ${item}`),
      train: () => toast.info(`Training AI: ${item}`),
      history: () => toast.info(`Viewing history: ${item}`),
    };
    toastMap[action]?.();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-600 to-pink-800 flex items-center justify-center shadow-lg">
          <Brain className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Legal Intelligence</h1>
          <p className="text-muted-foreground">AI-powered legal analysis and automation</p>
        </div>
        <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/50 ml-auto">AI MODE: 99%</Badge>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { icon: FileText, label: "Auto Draft", onClick: () => handleAction("run", "Auto Draft Agreements") },
          { icon: AlertTriangle, label: "Risk Detection", onClick: () => handleAction("run", "Auto Risk Detection") },
          { icon: GitCompare, label: "Clause Conflict", onClick: () => handleAction("run", "Clause Conflict Detection") },
          { icon: Globe, label: "Law Mismatch", onClick: () => handleAction("run", "Country Law Mismatch") },
          { icon: Lightbulb, label: "Suggestions", onClick: () => handleAction("run", "Auto Update Suggestions") },
        ].map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="cursor-pointer hover:scale-105 transition-transform bg-pink-500/10 border-pink-500/30"
              onClick={action.onClick}
            >
              <CardContent className="p-4 text-center">
                <action.icon className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">{action.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* AI Features */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-400" />
            AI Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {aiFeatures.map((feature) => (
              <motion.div
                key={feature.id}
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-pink-600/20 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{feature.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{feature.type}</Badge>
                      <span className="text-xs text-pink-400">Accuracy: {feature.accuracy}</span>
                      <span className="text-xs text-muted-foreground">{feature.uses} uses</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500/20 text-emerald-400">{feature.status}</Badge>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("view", feature.name)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("run", feature.name)}>
                      <Sparkles className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("edit", feature.name)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("history", feature.name)}>
                      <History className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LMAILegalIntelligence;

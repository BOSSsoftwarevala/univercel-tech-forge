import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Wand2, Globe, Users, Package, Languages, GitBranch, Eye, Edit, Lock, CheckCircle, History } from "lucide-react";
import { toast } from "sonner";

interface LMAgreementEngineProps {
  activeSubSection: string;
}

const aiGenerators = [
  { id: "1", name: "Standard Agreement Generator", status: "active", type: "General", aiScore: 98 },
  { id: "2", name: "Product Agreement AI", status: "active", type: "Product", aiScore: 95 },
  { id: "3", name: "Role-Based Generator", status: "active", type: "Role", aiScore: 97 },
  { id: "4", name: "Country Compliance AI", status: "processing", type: "Country", aiScore: 92 },
  { id: "5", name: "Language Detection Engine", status: "active", type: "Language", aiScore: 99 },
];

const LMAgreementEngine = ({ activeSubSection }: LMAgreementEngineProps) => {
  const handleAction = (action: string, item: string) => {
    const messages: Record<string, string> = {
      view: `Viewing: ${item}`,
      edit: `Editing: ${item}`,
      lock: `Locking: ${item}`,
      publish: `Published: ${item}`,
      generate: `AI Generating: ${item}`,
      history: `Viewing history: ${item}`,
    };
    toast.success(messages[action] || `Action: ${action} on ${item}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-lg">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agreement Engine (AI)</h1>
          <p className="text-muted-foreground">AI-powered agreement generation system</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { icon: Wand2, label: "Auto Generator", onClick: () => handleAction("generate", "Auto Agreement") },
          { icon: Package, label: "Product-Based", onClick: () => handleAction("view", "Product Agreements") },
          { icon: Users, label: "Role-Based", onClick: () => handleAction("view", "Role Agreements") },
          { icon: Globe, label: "Country-Based", onClick: () => handleAction("view", "Country Agreements") },
          { icon: Languages, label: "Language Detection", onClick: () => handleAction("view", "Language Settings") },
          { icon: GitBranch, label: "Version Control", onClick: () => handleAction("view", "Version History") },
        ].map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="cursor-pointer hover:scale-105 transition-transform bg-purple-500/10 border-purple-500/30"
              onClick={action.onClick}
            >
              <CardContent className="p-4 text-center">
                <action.icon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">{action.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* AI Generators List */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            AI Agreement Generators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {aiGenerators.map((generator) => (
              <motion.div
                key={generator.id}
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center">
                    <Wand2 className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{generator.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{generator.type}</Badge>
                      <span className="text-xs text-purple-400">AI Score: {generator.aiScore}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={generator.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-yellow-500/20 text-yellow-400"}>
                    {generator.status}
                  </Badge>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("view", generator.name)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("edit", generator.name)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("lock", generator.name)}>
                      <Lock className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("publish", generator.name)}>
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("history", generator.name)}>
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

export default LMAgreementEngine;

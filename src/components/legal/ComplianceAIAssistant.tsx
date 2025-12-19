import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  MessageSquare,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Send,
  Lightbulb,
  Scale,
  Shield
} from "lucide-react";

const ComplianceAIAssistant = () => {
  const [query, setQuery] = useState("");

  const suggestions = [
    { id: 1, type: "clause", text: "Add GDPR data portability clause to EU contracts", priority: "high" },
    { id: 2, type: "risk", text: "Chennai franchise showing declining compliance - review required", priority: "medium" },
    { id: 3, type: "action", text: "3 NDAs expiring this week - schedule renewal", priority: "high" },
    { id: 4, type: "checklist", text: "Q4 compliance audit checklist ready for review", priority: "low" },
  ];

  const capabilities = [
    { icon: FileText, title: "Suggest Legal Clauses", description: "AI recommends appropriate clauses based on jurisdiction" },
    { icon: AlertTriangle, title: "Explain Risk Levels", description: "Get detailed breakdown of risk factors and impacts" },
    { icon: Lightbulb, title: "Recommend Actions", description: "AI-powered action steps for compliance issues" },
    { icon: CheckCircle2, title: "Generate Checklists", description: "Auto-generate compliance checklists by region" },
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/40">High</Badge>;
      case "medium":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40">Medium</Badge>;
      case "low":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40">Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Compliance AI Assistant</h2>
          <p className="text-stone-500">AI-powered legal guidance and compliance automation</p>
        </div>
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/40">
          <Sparkles className="w-3 h-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      {/* AI Chat Interface */}
      <Card className="bg-stone-900/80 border-stone-800/50">
        <CardHeader className="border-b border-stone-800/50">
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Ask AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Scale className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-purple-300 font-medium">AI Legal Assistant</p>
                <p className="text-stone-400 text-sm mt-1">
                  Hello! I can help you with legal clauses, compliance requirements, risk assessments, and action recommendations. What would you like to know?
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about compliance, contracts, or legal requirements..."
              className="flex-1 h-12 px-4 rounded-xl bg-stone-800/50 border border-stone-700/50 text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-purple-500/50"
            />
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6">
              <Send className="w-4 h-4 mr-2" />
              Ask
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {["GDPR requirements", "Contract clauses for UAE", "NDA breach response", "Tax compliance India"].map((quick) => (
              <Button 
                key={quick}
                size="sm" 
                variant="outline" 
                className="border-stone-700 text-stone-400 hover:bg-stone-800 hover:text-purple-400"
                onClick={() => setQuery(quick)}
              >
                {quick}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Capabilities */}
      <div className="grid grid-cols-4 gap-4">
        {capabilities.map((cap, index) => (
          <motion.div
            key={cap.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-stone-900/80 border-stone-800/50 hover:border-purple-500/30 transition-colors cursor-pointer h-full">
              <CardContent className="p-4 text-center">
                <cap.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h3 className="text-white font-medium mb-1">{cap.title}</h3>
                <p className="text-sm text-stone-500">{cap.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* AI Suggestions */}
      <Card className="bg-stone-900/80 border-stone-800/50">
        <CardHeader className="border-b border-stone-800/50">
          <CardTitle className="text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-stone-800/30">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 flex items-center justify-between hover:bg-stone-800/30 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    suggestion.type === "clause" ? "bg-blue-500/20" :
                    suggestion.type === "risk" ? "bg-amber-500/20" :
                    suggestion.type === "action" ? "bg-purple-500/20" :
                    "bg-emerald-500/20"
                  }`}>
                    {suggestion.type === "clause" ? <FileText className="w-5 h-5 text-blue-400" /> :
                     suggestion.type === "risk" ? <AlertTriangle className="w-5 h-5 text-amber-400" /> :
                     suggestion.type === "action" ? <Shield className="w-5 h-5 text-purple-400" /> :
                     <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  </div>
                  <div>
                    <p className="text-stone-200">{suggestion.text}</p>
                    <Badge className="mt-1 bg-stone-800/50 text-stone-400 border-stone-700/50 text-xs capitalize">
                      {suggestion.type}
                    </Badge>
                  </div>
                </div>
                {getPriorityBadge(suggestion.priority)}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceAIAssistant;

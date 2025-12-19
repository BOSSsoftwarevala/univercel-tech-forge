import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Shield, 
  Lock, 
  Send, 
  CheckCircle2, 
  Key,
  Sparkles,
  MessageSquare,
  AlertTriangle,
  Zap
} from "lucide-react";

const LegalQuickActions = () => {
  const quickActions = [
    { label: "Generate Agreement", icon: FileText, color: "bg-cyan-600 hover:bg-cyan-700" },
    { label: "Assign NDA", icon: Shield, color: "bg-blue-600 hover:bg-blue-700" },
    { label: "Freeze Access", icon: Lock, color: "bg-red-600 hover:bg-red-700" },
    { label: "Send Legal Notice", icon: Send, color: "bg-purple-600 hover:bg-purple-700" },
    { label: "Verify Documents", icon: CheckCircle2, color: "bg-emerald-600 hover:bg-emerald-700" },
    { label: "Activate License", icon: Key, color: "bg-teal-600 hover:bg-teal-700" },
  ];

  const aiSuggestions = [
    "Review 3 expiring contracts",
    "Update GDPR clauses in 5 templates",
    "Investigate suspicious access pattern",
  ];

  return (
    <motion.aside
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-80 bg-gradient-to-b from-slate-900 to-slate-950 border-l border-cyan-900/30 p-6 flex flex-col"
    >
      {/* Quick Actions */}
      <div className="mb-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          Quick Actions
        </h3>
        <div className="space-y-2">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                className={`w-full justify-start ${action.color} text-white`}
              >
                <action.icon className="w-4 h-4 mr-2" />
                {action.label}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Legal Assistant */}
      <div className="flex-1">
        <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-600/10 to-cyan-700/5 border border-cyan-600/20">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-cyan-300 font-semibold">AI Legal Assist</h3>
          </div>
          
          <div className="space-y-3 mb-4">
            <p className="text-sm text-slate-400">AI-powered suggestions based on current activity:</p>
            {aiSuggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-slate-300 hover:border-cyan-600/30 cursor-pointer transition-colors"
              >
                {suggestion}
              </motion.div>
            ))}
          </div>

          <Button variant="outline" className="w-full border-cyan-600/30 text-cyan-400 hover:bg-cyan-600/10">
            <MessageSquare className="w-4 h-4 mr-2" />
            Ask AI Assistant
          </Button>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="mt-6 space-y-3">
        <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-slate-400">System Status</span>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-xs">
            Operational
          </Badge>
        </div>

        <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-slate-400">Pending Reviews</span>
          </div>
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/40 text-xs">
            5
          </Badge>
        </div>

        <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-slate-400">Compliance Score</span>
          </div>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40 text-xs">
            92%
          </Badge>
        </div>
      </div>
    </motion.aside>
  );
};

export default LegalQuickActions;
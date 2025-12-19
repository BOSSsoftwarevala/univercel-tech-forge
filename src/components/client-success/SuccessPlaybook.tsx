import { motion } from "framer-motion";
import { 
  PlayCircle, 
  FileText, 
  Phone, 
  MapPin, 
  Crown,
  Sparkles,
  ArrowRight,
  CheckCircle,
  BookOpen,
  Video
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const playbookActions = [
  {
    id: "1",
    action: "Video Walkthrough",
    description: "Step-by-step video guides for common features",
    icon: Video,
    usage: 156,
    effectiveness: 92,
    color: "violet",
  },
  {
    id: "2",
    action: "Tutorial Series",
    description: "Comprehensive documentation and tutorials",
    icon: BookOpen,
    usage: 234,
    effectiveness: 88,
    color: "teal",
  },
  {
    id: "3",
    action: "Guided Setup Call",
    description: "1-on-1 onboarding call with success manager",
    icon: Phone,
    usage: 89,
    effectiveness: 95,
    color: "emerald",
  },
  {
    id: "4",
    action: "Local Franchise Help",
    description: "Connect with regional franchise support",
    icon: MapPin,
    usage: 45,
    effectiveness: 87,
    color: "amber",
  },
  {
    id: "5",
    action: "VIP Upgrade",
    description: "Premium support and dedicated success manager",
    icon: Crown,
    usage: 23,
    effectiveness: 98,
    color: "rose",
  },
];

const aiRecommendations = [
  {
    id: "1",
    client: "StartupX",
    issue: "Struggling with advanced reporting features",
    recommendation: "Video Walkthrough",
    confidence: 94,
    reason: "Client has shown preference for visual learning based on support history.",
  },
  {
    id: "2",
    client: "GlobalRetail Inc",
    issue: "Slow adoption of new dashboard",
    recommendation: "Guided Setup Call",
    confidence: 89,
    reason: "Large team deployment benefits from personalized onboarding.",
  },
  {
    id: "3",
    client: "TechCorp Solutions",
    issue: "Interest in advanced API features",
    recommendation: "Tutorial Series",
    confidence: 91,
    reason: "Technical team prefers self-paced documentation.",
  },
];

export const SuccessPlaybook = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Success Playbook</h2>
        <p className="text-slate-500 text-sm mt-1">AI-recommended actions for client success</p>
      </div>

      {/* Playbook Actions */}
      <div className="grid grid-cols-5 gap-4">
        {playbookActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-4 bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg hover:shadow-xl transition-all cursor-pointer group h-full`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-${action.color}-100 to-${action.color}-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 text-${action.color}-600`} />
                </div>
                <h3 className="font-semibold text-slate-800 text-sm mb-1">{action.action}</h3>
                <p className="text-xs text-slate-500 mb-3">{action.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{action.usage} uses</span>
                  <span className="text-emerald-600 font-medium">{action.effectiveness}% effective</span>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* AI Recommendations */}
      <Card className="p-5 bg-gradient-to-r from-teal-50/50 to-amber-50/50 border-teal-200/50 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-teal-600" />
          <h3 className="font-semibold text-slate-700">AI-Powered Recommendations</h3>
        </div>
        
        <div className="space-y-4">
          {aiRecommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              className="p-4 rounded-xl bg-white/80 border border-teal-100 shadow-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-800">{rec.client}</span>
                    <Badge className="bg-teal-100 text-teal-700">
                      {rec.confidence}% confident
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">{rec.issue}</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  {rec.recommendation}
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-600">
                  <span className="font-medium text-teal-600">AI Reasoning:</span> {rec.reason}
                </p>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-white text-xs">
                  Apply Recommendation
                </Button>
                <Button size="sm" variant="outline" className="text-xs border-teal-300 text-teal-700">
                  View Alternatives
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-5 bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
        <h3 className="font-semibold text-slate-700 mb-4">Quick Deploy Actions</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { action: "Send Tutorial Pack", desc: "Email curated tutorials", icon: FileText },
            { action: "Schedule Check-in", desc: "Book follow-up call", icon: Phone },
            { action: "Deploy Training", desc: "Assign training modules", icon: PlayCircle },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={i}
                className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-teal-50 hover:border-teal-200 transition-all group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-2 rounded-lg bg-white shadow-sm group-hover:bg-teal-100 transition-colors">
                  <Icon className="w-5 h-5 text-slate-600 group-hover:text-teal-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-800 text-sm">{item.action}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 ml-auto group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
              </motion.button>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

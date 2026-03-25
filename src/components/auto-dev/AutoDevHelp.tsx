import { motion } from "framer-motion";
import { 
  HelpCircle, Mic, Image, Video, FileText, 
  MessageSquare, Lightbulb, Sparkles, CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const AutoDevHelp = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "Type Anything",
      description: "Describe what you want in plain language",
      color: "text-blue-400 bg-blue-500/20"
    },
    {
      icon: Mic,
      title: "Voice Commands",
      description: "Click the mic and speak naturally",
      color: "text-red-400 bg-red-500/20"
    },
    {
      icon: Image,
      title: "Upload Images",
      description: "Share UI screenshots or designs",
      color: "text-green-400 bg-green-500/20"
    },
    {
      icon: Video,
      title: "Video Reference",
      description: "Upload demo videos for context",
      color: "text-purple-400 bg-purple-500/20"
    },
    {
      icon: FileText,
      title: "Documents",
      description: "PDF, DOC, TXT requirements",
      color: "text-amber-400 bg-amber-500/20"
    },
    {
      icon: Sparkles,
      title: "AI Understands",
      description: "I convert everything to requirements",
      color: "text-violet-400 bg-violet-500/20"
    },
  ];

  const exampleCommands = [
    "Create a restaurant POS system",
    "Build a school management app",
    "Make this look like the uploaded design",
    "Fix this bug (with screenshot)",
    "Add payment gateway to my app",
    "Deploy my software to production",
  ];

  return (
    <Card className="bg-gradient-to-br from-slate-900/50 to-violet-900/20 border-violet-500/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 text-white">
          <HelpCircle className="w-4 h-4 text-violet-400" />
          How to Use
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Methods */}
        <div className="grid grid-cols-2 gap-2">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              whileHover={{ scale: 1.02 }}
              className="p-3 rounded-lg bg-slate-800/50 border border-border/30"
            >
              <div className="flex items-start gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${feature.color}`}>
                  <feature.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Example Commands */}
        <div>
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-400" />
            Try saying:
          </p>
          <div className="space-y-1">
            {exampleCommands.map((cmd, index) => (
              <div 
                key={index}
                className="text-xs text-violet-300 flex items-center gap-2"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                "{cmd}"
              </div>
            ))}
          </div>
        </div>

        {/* Pro Tip */}
        <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/30">
          <p className="text-xs text-violet-300">
            <strong>Pro Tip:</strong> You can combine methods! Upload a design image and describe what changes you want using voice.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

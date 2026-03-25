import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Mic, MicOff, FileText, Image, Video, Upload, 
  Zap, CheckCircle2, AlertTriangle, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const COMMAND_EXAMPLES = [
  { text: "Create demo for HR Software", type: "demo" },
  { text: "Fix demo error now", type: "fix" },
  { text: "Deploy version live", type: "deploy" },
  { text: "Stop unpaid API", type: "control" },
  { text: "Generate APK", type: "build" },
  { text: "Run SEO audit", type: "seo" },
];

const RECENT_COMMANDS = [
  { id: 1, command: "Generate demo for CRM product", status: "completed", time: "2 mins ago" },
  { id: 2, command: "Fix payment API error", status: "running", time: "5 mins ago" },
  { id: 3, command: "Deploy v2.1.0 to production", status: "completed", time: "1 hour ago" },
  { id: 4, command: "Stop inactive SEO crawlers", status: "completed", time: "2 hours ago" },
];

export const UnifiedVoiceCommand = () => {
  const [isListening, setIsListening] = useState(false);
  const [textCommand, setTextCommand] = useState("");

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
  };

  const handleExecuteCommand = () => {
    if (textCommand.trim()) {
      console.log("Executing command:", textCommand);
      setTextCommand("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Voice & Command Center</h2>
          <p className="text-muted-foreground">Control everything with voice or text commands</p>
        </div>
        <Badge variant="outline" className="border-violet-500/50 text-violet-400">
          AI Powered
        </Badge>
      </div>

      {/* Voice Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/30"
      >
        <div className="flex flex-col items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleVoiceToggle}
            className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center transition-all",
              isListening
                ? "bg-red-500 shadow-lg shadow-red-500/50 animate-pulse"
                : "bg-violet-500 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50"
            )}
          >
            {isListening ? (
              <MicOff className="w-10 h-10 text-white" />
            ) : (
              <Mic className="w-10 h-10 text-white" />
            )}
          </motion.button>
          <p className="text-sm text-muted-foreground">
            {isListening ? "Listening... Click to stop" : "Click to start voice command"}
          </p>
        </div>
      </motion.div>

      {/* Text Command Input */}
      <div className="p-4 rounded-xl bg-muted/20 border border-border/50">
        <label className="text-sm font-medium text-white mb-2 block">Text Command</label>
        <div className="flex gap-2">
          <Textarea
            value={textCommand}
            onChange={(e) => setTextCommand(e.target.value)}
            placeholder="Type your command here... e.g., 'Create demo for HR Software'"
            className="min-h-[80px] bg-background/50"
          />
        </div>
        <div className="flex justify-end mt-2">
          <Button 
            onClick={handleExecuteCommand}
            className="bg-violet-500 hover:bg-violet-600"
          >
            <Zap className="w-4 h-4 mr-2" />
            Execute Command
          </Button>
        </div>
      </div>

      {/* File Instruction Upload */}
      <div className="p-4 rounded-xl bg-muted/20 border border-border/50">
        <label className="text-sm font-medium text-white mb-3 block">File Instruction</label>
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: FileText, label: "PDF/DOC", color: "blue" },
            { icon: Image, label: "Image", color: "green" },
            { icon: Video, label: "Video", color: "red" },
            { icon: Upload, label: "Any File", color: "orange" },
          ].map((item) => (
            <motion.button
              key={item.label}
              whileHover={{ scale: 1.02 }}
              className={cn(
                "p-4 rounded-lg border border-dashed flex flex-col items-center gap-2 transition-all",
                `border-${item.color}-500/30 hover:border-${item.color}-500/50 hover:bg-${item.color}-500/10`
              )}
            >
              <item.icon className={`w-6 h-6 text-${item.color}-400`} />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Command Examples */}
      <div className="p-4 rounded-xl bg-muted/20 border border-border/50">
        <label className="text-sm font-medium text-white mb-3 block">Quick Commands</label>
        <div className="flex flex-wrap gap-2">
          {COMMAND_EXAMPLES.map((cmd, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              onClick={() => setTextCommand(cmd.text)}
              className="text-xs hover:bg-violet-500/20 hover:border-violet-500/50"
            >
              {cmd.text}
            </Button>
          ))}
        </div>
      </div>

      {/* Recent Commands */}
      <div className="p-4 rounded-xl bg-muted/20 border border-border/50">
        <label className="text-sm font-medium text-white mb-3 block">Recent Commands</label>
        <div className="space-y-2">
          {RECENT_COMMANDS.map((cmd) => (
            <div
              key={cmd.id}
              className="flex items-center justify-between p-3 rounded-lg bg-background/30"
            >
              <div className="flex items-center gap-3">
                {cmd.status === "completed" ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : cmd.status === "running" ? (
                  <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                )}
                <span className="text-sm text-white">{cmd.command}</span>
              </div>
              <span className="text-xs text-muted-foreground">{cmd.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

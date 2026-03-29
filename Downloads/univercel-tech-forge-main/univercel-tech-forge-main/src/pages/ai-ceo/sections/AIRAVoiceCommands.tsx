import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Mic, MicOff, Volume2, Phone, PhoneOff, Radio,
  Waves, Globe, Clock, CheckCircle2, AlertTriangle,
  Play, Pause, Settings, User
} from "lucide-react";

interface VoiceLog {
  id: string;
  command: string;
  response: string;
  status: "executed" | "pending" | "failed";
  timestamp: string;
  confidence: number;
}

const VOICE_PRESETS = [
  { id: "george", name: "George", role: "Professional Male", active: true },
  { id: "sarah", name: "Sarah", role: "Professional Female", active: false },
  { id: "roger", name: "Roger", role: "Executive Male", active: false },
  { id: "alice", name: "Alice", role: "Assistant Female", active: false },
];

const MOCK_LOGS: VoiceLog[] = [
  { id: "1", command: "Show server status", response: "All 12 servers running. 99.8% uptime.", status: "executed", timestamp: "2 min ago", confidence: 97 },
  { id: "2", command: "Generate daily report", response: "Report generated and sent to Boss Panel.", status: "executed", timestamp: "15 min ago", confidence: 94 },
  { id: "3", command: "Check API costs today", response: "Total spend: ₹2,340. Within budget limits.", status: "executed", timestamp: "32 min ago", confidence: 91 },
  { id: "4", command: "Deploy marketing update", response: "Awaiting Boss approval for deployment.", status: "pending", timestamp: "1 hr ago", confidence: 88 },
  { id: "5", command: "Run security scan", response: "Scan failed — retry in 5 minutes.", status: "failed", timestamp: "2 hr ago", confidence: 72 },
];

const AIRAVoiceCommands = () => {
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const statusColor = (s: string) => {
    if (s === "executed") return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (s === "pending") return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 flex items-center justify-center shadow-xl shadow-violet-500/20">
            <Mic className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Voice Command Center</h1>
            <p className="text-violet-400/80">ElevenLabs + Whisper • Real-time Voice Control</p>
          </div>
        </div>
        <Badge className={`px-4 py-2 ${isConnected ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}>
          <Radio className={`w-3 h-3 mr-2 ${isConnected ? "animate-pulse" : ""}`} />
          {isConnected ? "CONNECTED" : "DISCONNECTED"}
        </Badge>
      </div>

      {/* Voice Control Panel */}
      <div className="grid grid-cols-3 gap-6">
        {/* Main Voice Interface */}
        <Card className="col-span-2 bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-6">
              {/* Visualizer */}
              <div className="relative w-40 h-40">
                <motion.div
                  className={`absolute inset-0 rounded-full ${isListening ? "bg-violet-500/20" : "bg-slate-800/50"} border-2 ${isListening ? "border-violet-400/60" : "border-slate-600/30"}`}
                  animate={isListening ? { scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
                <motion.div
                  className={`absolute inset-4 rounded-full ${isListening ? "bg-violet-500/30" : "bg-slate-800/30"} border ${isListening ? "border-violet-400/40" : "border-slate-700/30"}`}
                  animate={isListening ? { scale: [1, 1.12, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
                />
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-2xl shadow-violet-500/40">
                  {isListening ? (
                    <Waves className="w-10 h-10 text-white animate-pulse" />
                  ) : (
                    <Mic className="w-10 h-10 text-white" />
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-400">
                {isListening ? "Listening... Speak your command" : "Click to start voice input"}
              </p>

              <div className="flex items-center gap-4">
                <Button
                  onClick={() => { setIsListening(!isListening); if (!isConnected) setIsConnected(true); }}
                  className={`px-8 py-3 rounded-full ${isListening ? "bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30" : "bg-violet-500/20 text-violet-400 border border-violet-500/40 hover:bg-violet-500/30"}`}
                >
                  {isListening ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                  {isListening ? "Stop Listening" : "Start Voice"}
                </Button>
                <Button variant="ghost" className="text-slate-400 hover:text-white">
                  <Volume2 className="w-4 h-4 mr-2" />
                  Test Output
                </Button>
              </div>

              {/* Pipeline */}
              <div className="w-full mt-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/20">
                <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Voice Pipeline</p>
                <div className="flex items-center justify-between">
                  {["Voice Input", "Speech-to-Text", "AIRA Reasoning", "System Execution", "Voice Response"].map((step, i) => (
                    <div key={step} className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= 1 && isListening ? "bg-violet-500/30 text-violet-300 border border-violet-400/40" : "bg-slate-700/50 text-slate-500 border border-slate-600/30"}`}>
                        {i + 1}
                      </div>
                      <span className="text-xs text-slate-400 hidden xl:block">{step}</span>
                      {i < 4 && <span className="text-slate-600 mx-1">→</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voice Presets */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <User className="w-4 h-4 text-violet-400" />
              Voice Presets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {VOICE_PRESETS.map((preset) => (
                <motion.div
                  key={preset.id}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${preset.active ? "bg-violet-500/10 border-violet-500/40" : "bg-slate-800/30 border-slate-700/20 hover:border-slate-600/40"}`}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${preset.active ? "text-violet-300" : "text-white"}`}>{preset.name}</p>
                      <p className="text-xs text-slate-500">{preset.role}</p>
                    </div>
                    {preset.active && (
                      <Badge className="bg-violet-500/20 text-violet-400 text-xs">Active</Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-3 rounded-lg bg-slate-800/30 border border-slate-700/20">
              <p className="text-xs text-slate-500 mb-2">Supported Engines</p>
              <div className="flex flex-wrap gap-2">
                {["ElevenLabs", "Whisper", "OpenAI Voice"].map(e => (
                  <Badge key={e} className="bg-slate-700/50 text-slate-300 text-xs">{e}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Voice Command History */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2 text-base">
            <Clock className="w-4 h-4 text-cyan-400" />
            Command History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[240px]">
            <div className="space-y-2">
              {MOCK_LOGS.map((log, i) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/20"
                >
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">"{log.command}"</p>
                    <p className="text-xs text-slate-400 mt-1">{log.response}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <Progress value={log.confidence} className="h-1 w-12" />
                    <span className="text-xs text-cyan-400">{log.confidence}%</span>
                    <Badge className={`${statusColor(log.status)} text-xs`}>{log.status}</Badge>
                    <span className="text-xs text-slate-500 whitespace-nowrap">{log.timestamp}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIRAVoiceCommands;

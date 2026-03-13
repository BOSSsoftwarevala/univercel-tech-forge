import { Bot, Radio, Bell, Shield, Activity, Search, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AICEOHeaderProps {
  streamingOn: boolean;
  onStreamingToggle: () => void;
}

const AICEOHeader = ({ streamingOn, onStreamingToggle }: AICEOHeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-[#0d0d14] via-[#12121a] to-[#0d0d14] backdrop-blur-xl border-b border-cyan-500/20 z-50 flex items-center justify-between px-6">
      {/* Left - Logo & System Name */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-cyan-400">AIRA v3.0</h1>
            <p className="text-[10px] text-cyan-500/60 uppercase tracking-widest">Autonomous Intelligent Response Agent</p>
          </div>
        </div>
        
        {/* AI Status Badge */}
        <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
          <Activity className="w-3 h-3 mr-1" />
          24/7 ACTIVE
        </Badge>
      </div>

      {/* Center - Global Search */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/50" />
          <Input 
            placeholder="Search actions, decisions, insights..."
            className="w-full bg-slate-900/50 border-cyan-500/20 text-white pl-10 focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Right - Controls */}
      <div className="flex items-center gap-4">
        <motion.button
          onClick={onStreamingToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
            streamingOn 
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
              : 'bg-red-500/20 border-red-500/50 text-red-400'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Radio className={`w-4 h-4 ${streamingOn ? 'animate-pulse' : ''}`} />
          <span className="text-sm font-medium">
            {streamingOn ? 'MONITORING' : 'PAUSED'}
          </span>
        </motion.button>

        <Button variant="ghost" size="icon" className="text-cyan-400 hover:bg-cyan-500/10">
          <Bell className="w-5 h-5" />
        </Button>

        <Button variant="ghost" size="icon" className="text-cyan-400 hover:bg-cyan-500/10">
          <Shield className="w-5 h-5" />
        </Button>

        <Button variant="ghost" size="icon" className="text-cyan-400 hover:bg-cyan-500/10">
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};

export default AICEOHeader;

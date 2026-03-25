import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Code, Zap, CheckCircle2, Play, User } from "lucide-react";

const LiveTaskTimer = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTasks = [
    { id: 1, name: "Payment Gateway Integration", progress: 78, status: "active", developer: "Dev-A7X" },
    { id: 2, name: "User Dashboard UI", progress: 95, status: "review", developer: "Dev-K2M" },
    { id: 3, name: "API Optimization", progress: 45, status: "active", developer: "Dev-P9R" },
  ];

  return (
    <Card className="bg-gradient-to-br from-stone-900/90 to-stone-950/90 border-amber-500/20 backdrop-blur-xl">
      <CardHeader className="border-b border-amber-500/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-amber-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            Live Development Progress
          </CardTitle>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30"
          >
            <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
            <span className="text-sm text-emerald-400 font-mono">{formatTime(elapsedTime)}</span>
          </motion.div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Zomato-style Timeline */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-stone-400">Overall Project Progress</span>
            <span className="text-lg font-bold text-amber-300">67%</span>
          </div>
          
          <div className="relative">
            <div className="h-3 bg-stone-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "67%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full relative"
              >
                <motion.div
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-300 shadow-lg shadow-amber-500/50"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
            </div>
            
            {/* Milestone Markers */}
            <div className="flex justify-between mt-2">
              {["Started", "Design", "Development", "Testing", "Launch"].map((phase, i) => (
                <div key={phase} className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${i <= 2 ? "bg-amber-400" : "bg-stone-700"}`} />
                  <span className={`text-xs mt-1 ${i <= 2 ? "text-amber-400" : "text-stone-600"}`}>{phase}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Tasks */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-stone-400 uppercase tracking-wide">Active Tasks</h4>
          
          {currentTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-stone-800/50 border border-stone-700/50 hover:border-amber-500/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    task.status === "active" ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"
                  }`}>
                    {task.status === "active" ? <Code className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <h5 className="text-stone-200 font-medium group-hover:text-amber-200 transition-colors">{task.name}</h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <User className="w-3 h-3 text-stone-500" />
                      <span className="text-xs text-stone-500">{task.developer}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {task.status === "active" && (
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Zap className="w-4 h-4 text-amber-400" />
                    </motion.div>
                  )}
                  <span className={`text-sm font-bold ${
                    task.progress >= 90 ? "text-emerald-400" : "text-amber-300"
                  }`}>
                    {task.progress}%
                  </span>
                </div>
              </div>
              
              <Progress 
                value={task.progress} 
                className="h-1.5 bg-stone-700"
              />
            </motion.div>
          ))}
        </div>

        {/* ETA Display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-500/70">Estimated Completion</p>
              <p className="text-lg font-semibold text-amber-200">December 25, 2024</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-amber-500/70">Days Remaining</p>
              <p className="text-2xl font-bold text-amber-300">6</p>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default LiveTaskTimer;

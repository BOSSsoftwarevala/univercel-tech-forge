import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, TrendingUp, Zap, Star } from "lucide-react";

const PriorityQueuePosition = () => {
  const queuePosition = 1;
  const totalInQueue = 47;

  return (
    <Card className="bg-gradient-to-br from-stone-900/90 to-stone-950/90 border-amber-500/20 backdrop-blur-xl h-full">
      <CardHeader className="border-b border-amber-500/10">
        <CardTitle className="text-amber-100 flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-400" />
          Priority Queue
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Position Display */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative inline-block"
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/10 flex items-center justify-center border-4 border-amber-500/30">
              <motion.div
                animate={{ 
                  boxShadow: ["0 0 30px rgba(251,191,36,0.3)", "0 0 60px rgba(251,191,36,0.5)", "0 0 30px rgba(251,191,36,0.3)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center"
              >
                <span className="text-4xl font-bold text-stone-900">#{queuePosition}</span>
              </motion.div>
            </div>
            
            {/* Crown Badge */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -top-2 -right-2"
            >
              <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/50">
                <Star className="w-5 h-5 text-stone-900 fill-stone-900" />
              </div>
            </motion.div>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-lg text-amber-200 font-medium"
          >
            Top Priority
          </motion.p>
          <p className="text-sm text-stone-500">Out of {totalInQueue} active projects</p>
        </div>

        {/* Benefits List */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-stone-500 uppercase tracking-wide">Your Priority Benefits</h4>
          
          {[
            { icon: Zap, text: "Fastest response time", highlight: "<5 minutes" },
            { icon: TrendingUp, text: "Priority developer pool", highlight: "3 assigned" },
            { icon: Crown, text: "Direct manager access", highlight: "24/7" },
          ].map((benefit, index) => (
            <motion.div
              key={benefit.text}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-stone-800/30 border border-stone-700/30"
            >
              <div className="flex items-center gap-3">
                <benefit.icon className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-stone-300">{benefit.text}</span>
              </div>
              <span className="text-xs font-medium text-amber-300">{benefit.highlight}</span>
            </motion.div>
          ))}
        </div>

        {/* Status Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center"
        >
          <div className="flex items-center justify-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-emerald-400"
            />
            <span className="text-sm text-emerald-400 font-medium">Your request is our priority</span>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default PriorityQueuePosition;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  CheckCircle2, 
  Clock, 
  Lock, 
  ChevronRight,
  Sparkles,
  FileCheck,
  ThumbsUp
} from "lucide-react";

const ProjectMilestones = () => {
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null);

  const milestones = [
    {
      id: 1,
      title: "Project Kickoff & Requirements",
      status: "completed",
      date: "Dec 1, 2024",
      tasks: ["Requirement gathering", "Scope documentation", "Timeline approval"],
      approved: true
    },
    {
      id: 2,
      title: "UI/UX Design & Prototyping",
      status: "completed",
      date: "Dec 8, 2024",
      tasks: ["Wireframe creation", "Design mockups", "Prototype review"],
      approved: true
    },
    {
      id: 3,
      title: "Core Development Phase",
      status: "in-progress",
      date: "Dec 18, 2024",
      tasks: ["Backend architecture", "API development", "Database setup"],
      approved: false,
      progress: 78
    },
    {
      id: 4,
      title: "Integration & Testing",
      status: "upcoming",
      date: "Dec 22, 2024",
      tasks: ["API integration", "Unit testing", "QA review"],
      approved: false
    },
    {
      id: 5,
      title: "Final Delivery & Launch",
      status: "locked",
      date: "Dec 25, 2024",
      tasks: ["Deployment", "Documentation", "Handover"],
      approved: false
    }
  ];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "completed":
        return { bg: "bg-emerald-500/20", border: "border-emerald-500/40", icon: CheckCircle2, color: "text-emerald-400" };
      case "in-progress":
        return { bg: "bg-amber-500/20", border: "border-amber-500/40", icon: Clock, color: "text-amber-400" };
      case "upcoming":
        return { bg: "bg-blue-500/20", border: "border-blue-500/40", icon: Target, color: "text-blue-400" };
      case "locked":
        return { bg: "bg-stone-700/50", border: "border-stone-600/40", icon: Lock, color: "text-stone-500" };
      default:
        return { bg: "bg-stone-700/50", border: "border-stone-600/40", icon: Target, color: "text-stone-400" };
    }
  };

  return (
    <Card className="bg-gradient-to-br from-stone-900/90 to-stone-950/90 border-amber-500/20 backdrop-blur-xl">
      <CardHeader className="border-b border-amber-500/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-amber-100 flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            Project Milestones
          </CardTitle>
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40">
            <Sparkles className="w-3 h-3 mr-1" />
            3 of 5 Complete
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Timeline View */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-amber-500 to-stone-700" />
          
          <div className="space-y-6">
            {milestones.map((milestone, index) => {
              const styles = getStatusStyles(milestone.status);
              const Icon = styles.icon;
              
              return (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Status Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`absolute left-0 w-12 h-12 rounded-xl ${styles.bg} ${styles.border} border flex items-center justify-center z-10`}
                  >
                    {milestone.status === "completed" ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                      >
                        <Icon className={`w-6 h-6 ${styles.color}`} />
                      </motion.div>
                    ) : milestone.status === "in-progress" ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        <Icon className={`w-6 h-6 ${styles.color}`} />
                      </motion.div>
                    ) : (
                      <Icon className={`w-6 h-6 ${styles.color}`} />
                    )}
                  </motion.div>

                  {/* Content Card */}
                  <motion.div
                    className={`ml-16 p-4 rounded-xl ${styles.bg} ${styles.border} border cursor-pointer transition-all hover:scale-[1.01]`}
                    onClick={() => setSelectedMilestone(selectedMilestone === milestone.id ? null : milestone.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-medium ${milestone.status === "locked" ? "text-stone-500" : "text-stone-200"}`}>
                          {milestone.title}
                        </h4>
                        <p className={`text-sm ${milestone.status === "locked" ? "text-stone-600" : "text-stone-500"}`}>
                          {milestone.date}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {milestone.approved && (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            Approved
                          </Badge>
                        )}
                        
                        {milestone.progress && (
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-stone-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${milestone.progress}%` }}
                                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                              />
                            </div>
                            <span className="text-sm font-medium text-amber-300">{milestone.progress}%</span>
                          </div>
                        )}
                        
                        <motion.div
                          animate={{ rotate: selectedMilestone === milestone.id ? 90 : 0 }}
                        >
                          <ChevronRight className={`w-5 h-5 ${styles.color}`} />
                        </motion.div>
                      </div>
                    </div>

                    {/* Expanded Tasks */}
                    <AnimatePresence>
                      {selectedMilestone === milestone.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-stone-700/50 space-y-2">
                            {milestone.tasks.map((task, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <FileCheck className={`w-4 h-4 ${
                                  milestone.status === "completed" ? "text-emerald-400" : "text-stone-500"
                                }`} />
                                <span className={`text-sm ${
                                  milestone.status === "completed" ? "text-stone-300" : "text-stone-500"
                                }`}>
                                  {task}
                                </span>
                              </div>
                            ))}
                            
                            {milestone.status === "in-progress" && !milestone.approved && (
                              <Button
                                size="sm"
                                className="mt-3 bg-amber-500 hover:bg-amber-600 text-stone-900"
                              >
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                Approve Milestone
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectMilestones;

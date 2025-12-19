import { motion } from "framer-motion";
import { GraduationCap, Play, CheckCircle, Clock, Star, BookOpen, Video, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const TrainingHub = () => {
  const courses = [
    { id: 1, title: "Getting Started with Prime", type: "onboarding", duration: "15 min", progress: 100, completed: true },
    { id: 2, title: "Advanced Dashboard Features", type: "tutorial", duration: "25 min", progress: 60, completed: false },
    { id: 3, title: "API Integration Masterclass", type: "advanced", duration: "45 min", progress: 0, completed: false },
    { id: 4, title: "Automation Workflows", type: "tutorial", duration: "30 min", progress: 30, completed: false },
    { id: 5, title: "Security Best Practices", type: "essential", duration: "20 min", progress: 0, completed: false },
  ];

  const wizards = [
    { name: "Project Setup Wizard", description: "Step-by-step project configuration", icon: Sparkles },
    { name: "Integration Helper", description: "Connect external services easily", icon: BookOpen },
    { name: "Automation Builder", description: "Create custom workflows", icon: Video },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "onboarding": return "bg-emerald-500/20 text-emerald-300";
      case "tutorial": return "bg-blue-500/20 text-blue-300";
      case "advanced": return "bg-purple-500/20 text-purple-300";
      case "essential": return "bg-amber-500/20 text-amber-300";
      default: return "bg-stone-700 text-stone-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-amber-100">Training & Tutorial Hub</h2>
          <p className="text-stone-400">Premium onboarding and advanced learning resources</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          <span className="text-amber-300 font-medium">VIP Learning Path</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-stone-900/50 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <GraduationCap className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-100">5</div>
            <div className="text-xs text-stone-400">Courses Available</div>
          </CardContent>
        </Card>
        <Card className="bg-stone-900/50 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-100">1</div>
            <div className="text-xs text-stone-400">Completed</div>
          </CardContent>
        </Card>
        <Card className="bg-stone-900/50 border-blue-500/20">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-100">2h 15m</div>
            <div className="text-xs text-stone-400">Total Duration</div>
          </CardContent>
        </Card>
        <Card className="bg-stone-900/50 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-100">38%</div>
            <div className="text-xs text-stone-400">Overall Progress</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-amber-100">Learning Path</h3>
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-stone-900/50 border-amber-500/20 ${course.completed ? "opacity-75" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {course.completed ? (
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                          <Play className="w-5 h-5 text-amber-400" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-amber-100">{course.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getTypeColor(course.type)}>{course.type}</Badge>
                          <span className="text-xs text-stone-400">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {course.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={course.completed ? "outline" : "default"}
                      size="sm"
                      className={course.completed 
                        ? "border-stone-600 text-stone-400" 
                        : "bg-gradient-to-r from-amber-500 to-amber-600 text-stone-900"
                      }
                    >
                      {course.completed ? "Review" : course.progress > 0 ? "Continue" : "Start"}
                    </Button>
                  </div>
                  {!course.completed && (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-stone-400">Progress</span>
                        <span className="text-amber-300">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2 bg-stone-800" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-amber-100">Guided Wizards</h3>
          {wizards.map((wizard, index) => {
            const Icon = wizard.icon;
            return (
              <motion.div
                key={wizard.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-stone-900/50 border-amber-500/20 hover:border-amber-500/40 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-purple-500/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-amber-100">{wizard.name}</h4>
                        <p className="text-xs text-stone-400">{wizard.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          <Card className="bg-gradient-to-br from-purple-900/30 to-amber-900/30 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h4 className="font-medium text-purple-100 mb-1">Premium Resources</h4>
              <p className="text-xs text-stone-400 mb-3">Access exclusive advanced tutorials</p>
              <Button size="sm" className="bg-purple-500 hover:bg-purple-600 text-white">
                Unlock All
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrainingHub;

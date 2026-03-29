import { motion } from "framer-motion";
import { GraduationCap, Play, CheckCircle, Clock, Star, BookOpen, Video, Award, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const TrainingAcademy = () => {
  const courses = [
    { id: 1, title: "Getting Started as an Affiliate", type: "beginner", duration: "20 min", progress: 100, completed: true },
    { id: 2, title: "Creating Viral Content", type: "intermediate", duration: "35 min", progress: 60, completed: false },
    { id: 3, title: "Advanced Conversion Tactics", type: "advanced", duration: "45 min", progress: 0, completed: false },
    { id: 4, title: "AI Content Optimization", type: "masterclass", duration: "1 hour", progress: 25, completed: false },
  ];

  const caseStudies = [
    { name: "How Sarah earned $10K in one month", views: 2450, rating: 4.9 },
    { name: "Viral TikTok strategy breakdown", views: 3120, rating: 4.8 },
    { name: "Instagram Reels that convert", views: 1890, rating: 4.7 },
  ];

  const tips = [
    { tip: "Post during peak hours (6-9 PM)", impact: "High" },
    { tip: "Use trending sounds in reels", impact: "Medium" },
    { tip: "Include CTA in first 3 seconds", impact: "High" },
    { tip: "Respond to comments within 1 hour", impact: "Medium" },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "beginner": return "bg-emerald-500/20 text-emerald-300";
      case "intermediate": return "bg-blue-500/20 text-blue-300";
      case "advanced": return "bg-purple-500/20 text-purple-300";
      case "masterclass": return "bg-amber-500/20 text-amber-300";
      default: return "bg-slate-500/20 text-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-violet-100">Training Academy</h2>
          <p className="text-slate-400">Tutorials, case studies, and AI optimization tips</p>
        </div>
        <Badge className="bg-violet-500/20 text-violet-300 border border-violet-500/30 px-4 py-2">
          <Award className="w-4 h-4 mr-2" />
          1 Course Completed
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-violet-500/20">
          <CardContent className="p-4 text-center">
            <GraduationCap className="w-8 h-8 text-violet-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-violet-100">4</div>
            <div className="text-xs text-slate-400">Courses Available</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-100">1</div>
            <div className="text-xs text-slate-400">Completed</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-cyan-100">2h 40m</div>
            <div className="text-xs text-slate-400">Total Duration</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-100">46%</div>
            <div className="text-xs text-slate-400">Overall Progress</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-violet-100">Learning Path</h3>
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-slate-900/50 border-violet-500/20 ${course.completed ? "opacity-75" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {course.completed ? (
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                          <Play className="w-5 h-5 text-violet-400" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-violet-100">{course.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getTypeColor(course.type)}>{course.type}</Badge>
                          <span className="text-xs text-slate-400">
                            <Clock className="w-3 h-3 inline mr-1" />{course.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={course.completed ? "outline" : "default"}
                      size="sm"
                      onClick={() => {
                        if (course.completed) {
                          toast.info(`Reviewing "${course.title}"...`);
                        } else if (course.progress > 0) {
                          toast.success(`Continuing "${course.title}"...`);
                        } else {
                          toast.success(`Starting "${course.title}"...`);
                        }
                      }}
                      className={course.completed 
                        ? "border-slate-600 text-slate-400" 
                        : "bg-gradient-to-r from-violet-500 to-cyan-500 text-white"
                      }
                    >
                      {course.completed ? "Review" : course.progress > 0 ? "Continue" : "Start"}
                    </Button>
                  </div>
                  {!course.completed && (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-violet-300">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2 bg-slate-800" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-violet-500/20">
            <CardHeader>
              <CardTitle className="text-violet-100 text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-violet-400" />
                Case Studies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {caseStudies.map((study, index) => (
                <motion.div
                  key={study.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => toast.info(`Opening case study: "${study.name}"`)}
                  className="p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <h4 className="font-medium text-violet-100 text-sm mb-1">{study.name}</h4>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">{study.views.toLocaleString()} views</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-amber-300">{study.rating}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-violet-500/20">
            <CardHeader>
              <CardTitle className="text-violet-100 text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-400" />
                AI Optimization Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {tips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-2 hover:bg-slate-800/50 rounded-lg"
                >
                  <span className="text-slate-300 text-sm">{tip.tip}</span>
                  <Badge className={tip.impact === "High" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}>
                    {tip.impact}
                  </Badge>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrainingAcademy;

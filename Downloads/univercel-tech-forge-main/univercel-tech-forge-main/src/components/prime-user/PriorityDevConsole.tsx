import { motion } from "framer-motion";
import { Rocket, Upload, Clock, CheckCircle, FileText, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const PriorityDevConsole = () => {
  const projects = [
    { id: "PRJ-001", name: "E-Commerce Platform", stage: "development", progress: 65, eta: "3 days", fastTrack: true },
    { id: "PRJ-002", name: "Mobile App Backend", stage: "review", progress: 90, eta: "1 day", fastTrack: true },
    { id: "PRJ-003", name: "Analytics Dashboard", stage: "planning", progress: 20, eta: "5 days", fastTrack: false },
  ];

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "development": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "review": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "planning": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      default: return "bg-stone-700 text-stone-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-amber-100">Priority Development Console</h2>
          <p className="text-stone-400">Fast-track project submissions with premium workflow</p>
        </div>
        <Button className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-900 hover:from-amber-400 hover:to-amber-500">
          <Rocket className="w-4 h-4 mr-2" />
          Fast-Track Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-stone-900/50 border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Rocket className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-amber-100">3</div>
                <div className="text-xs text-stone-400">Active Projects</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-stone-900/50 border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-emerald-100">12</div>
                <div className="text-xs text-stone-400">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-stone-900/50 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-blue-100">2.5 days</div>
                <div className="text-xs text-stone-400">Avg. Delivery</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-stone-900/50 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-purple-100">2</div>
                <div className="text-xs text-stone-400">Fast-Tracked</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-stone-900/50 border-amber-500/20">
        <CardHeader>
          <CardTitle className="text-amber-100 flex items-center gap-2">
            <Upload className="w-5 h-5 text-amber-400" />
            1-Click Requirements Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-amber-500/30 rounded-xl p-8 text-center hover:border-amber-500/50 transition-colors cursor-pointer">
            <FileText className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <p className="text-amber-100 font-medium mb-1">Drop files here or click to upload</p>
            <p className="text-stone-400 text-sm">Support for PDF, DOC, TXT, Images</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-amber-100">Active Projects</h3>
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-stone-900/50 border-amber-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-amber-400 font-mono text-sm">{project.id}</span>
                    <h4 className="font-semibold text-amber-100">{project.name}</h4>
                    {project.fastTrack && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                        <Zap className="w-3 h-3 mr-1" />
                        FAST-TRACK
                      </Badge>
                    )}
                  </div>
                  <Badge className={getStageColor(project.stage)}>
                    {project.stage.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-stone-400 text-sm">Progress</span>
                  <span className="text-amber-300 text-sm">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2 bg-stone-800 mb-3" />
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-400">Estimated Delivery</span>
                  <span className="text-emerald-400 font-medium">{project.eta}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PriorityDevConsole;

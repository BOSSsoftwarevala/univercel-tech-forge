import { motion } from "framer-motion";
import { Lightbulb, ThumbsUp, Clock, CheckCircle, ArrowUp, Plus, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const FeatureRequestBoard = () => {
  const requests = [
    { id: "FR-001", title: "AI-Powered Report Generation", votes: 127, status: "approved", timeline: "Q1 2025", myVote: true, category: "AI/ML" },
    { id: "FR-002", title: "Multi-Currency Support", votes: 89, status: "review", timeline: "Under Review", myVote: true, category: "Finance" },
    { id: "FR-003", title: "Advanced Analytics Dashboard", votes: 156, status: "in-development", timeline: "2 weeks", myVote: false, category: "Analytics" },
    { id: "FR-004", title: "Mobile App Integration", votes: 203, status: "planned", timeline: "Q2 2025", myVote: true, category: "Mobile" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "review": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "in-development": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "planned": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      default: return "bg-stone-700 text-stone-300";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "AI/ML": return "bg-pink-500/20 text-pink-300";
      case "Finance": return "bg-green-500/20 text-green-300";
      case "Analytics": return "bg-cyan-500/20 text-cyan-300";
      case "Mobile": return "bg-orange-500/20 text-orange-300";
      default: return "bg-stone-700 text-stone-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-amber-100">Feature Request Board</h2>
          <p className="text-stone-400">Exclusive VIP feature submissions with R&D direct review</p>
        </div>
        <Button className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-900 hover:from-amber-400 hover:to-amber-500">
          <Plus className="w-4 h-4 mr-2" />
          Submit Request
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-stone-900/50 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <Lightbulb className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-100">12</div>
            <div className="text-xs text-stone-400">My Requests</div>
          </CardContent>
        </Card>
        <Card className="bg-stone-900/50 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-100">8</div>
            <div className="text-xs text-stone-400">Implemented</div>
          </CardContent>
        </Card>
        <Card className="bg-stone-900/50 border-blue-500/20">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-100">3</div>
            <div className="text-xs text-stone-400">In Development</div>
          </CardContent>
        </Card>
        <Card className="bg-stone-900/50 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <ThumbsUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-100">45</div>
            <div className="text-xs text-stone-400">Total Votes Cast</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {requests.map((request, index) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-stone-900/50 border-amber-500/20 hover:border-amber-500/40 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-amber-400 text-sm">{request.id}</span>
                      <Badge className={getCategoryColor(request.category)}>{request.category}</Badge>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.replace("-", " ").toUpperCase()}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-amber-100 mb-2">{request.title}</h3>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-stone-400">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {request.timeline}
                      </span>
                      <span className="text-stone-400">
                        <MessageSquare className="w-4 h-4 inline mr-1" />
                        12 comments
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`flex flex-col items-center p-3 h-auto ${
                        request.myVote 
                          ? "bg-amber-500/20 border-amber-500/50 text-amber-300" 
                          : "border-stone-600 text-stone-400 hover:border-amber-500/50 hover:text-amber-300"
                      }`}
                    >
                      <ArrowUp className={`w-5 h-5 ${request.myVote ? "text-amber-400" : ""}`} />
                      <span className="text-lg font-bold">{request.votes}</span>
                    </Button>
                    {request.myVote && (
                      <span className="text-xs text-amber-400">Voted</span>
                    )}
                  </div>
                </div>

                {request.status === "in-development" && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-stone-400">Development Progress</span>
                      <span className="text-blue-300">65%</span>
                    </div>
                    <Progress value={65} className="h-2 bg-stone-800" />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeatureRequestBoard;

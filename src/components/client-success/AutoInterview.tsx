import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Mic,
  Video,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  User,
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  Send,
  Bot,
  ChevronRight,
  Loader2,
  Target,
  TrendingUp
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClientSuccessAI } from "@/hooks/useClientSuccessAI";
import { toast } from "sonner";

const scheduledInterviews = [
  {
    id: "int-001",
    clientName: "TechCorp Industries",
    type: "Quarterly Review",
    scheduledFor: "Today, 3:00 PM",
    status: "upcoming",
    duration: "30 min",
    accountManager: "Sarah M."
  },
  {
    id: "int-002",
    clientName: "StartupX",
    type: "Onboarding Check-in",
    scheduledFor: "Tomorrow, 10:00 AM",
    status: "scheduled",
    duration: "20 min",
    accountManager: "Mike R."
  },
  {
    id: "int-003",
    clientName: "GlobalRetail Inc",
    type: "Satisfaction Survey",
    scheduledFor: "Yesterday",
    status: "completed",
    duration: "25 min",
    accountManager: "Lisa K."
  }
];

const interviewTemplates = [
  { id: "satisfaction", name: "Satisfaction Check", questions: 5 },
  { id: "onboarding", name: "Onboarding Review", questions: 7 },
  { id: "quarterly", name: "Quarterly Business Review", questions: 10 },
  { id: "churn_risk", name: "Churn Prevention", questions: 6 },
  { id: "expansion", name: "Expansion Discussion", questions: 8 }
];

export const AutoInterview = () => {
  const [clientName, setClientName] = useState("");
  const [interviewType, setInterviewType] = useState("");
  const [accountType, setAccountType] = useState("");
  const [duration, setDuration] = useState("");
  const [generatedQuestions, setGeneratedQuestions] = useState("");
  const [interviewResponses, setInterviewResponses] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [activeTab, setActiveTab] = useState("generate");
  
  const { isLoading, generateInterviewQuestions, analyzeInterviewResponses } = useClientSuccessAI();

  const handleGenerateQuestions = async () => {
    if (!clientName.trim()) {
      toast.error('Please enter a client name');
      return;
    }
    const result = await generateInterviewQuestions(
      clientName,
      accountType || 'Standard',
      duration || '6 months',
      interviewType || 'General satisfaction check'
    );
    if (result) {
      setGeneratedQuestions(result);
      toast.success('Interview questions generated!');
    }
  };

  const handleAnalyzeResponses = async () => {
    if (!clientName.trim() || !interviewResponses.trim()) {
      toast.error('Please enter client name and interview responses');
      return;
    }
    const result = await analyzeInterviewResponses(clientName, interviewType || 'Satisfaction', interviewResponses);
    if (result) {
      setAnalysisResult(result);
      toast.success('Analysis complete!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Bot className="w-6 h-6 text-teal-600" />
            AI Auto Interview System
          </h2>
          <p className="text-slate-500 text-sm mt-1">Intelligent client interviews with AI-powered analysis</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700 gap-2">
          <Calendar className="w-4 h-4" />
          Schedule Interview
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Interviews", value: "156", icon: MessageSquare, color: "teal", change: "+12 this week" },
          { label: "Avg Satisfaction", value: "4.6/5", icon: Target, color: "emerald", change: "+0.3 vs last month" },
          { label: "Insights Generated", value: "89", icon: Sparkles, color: "violet", change: "This quarter" },
          { label: "Action Items", value: "23", icon: CheckCircle, color: "amber", change: "Pending" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-4 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{stat.change}</p>
                </div>
                <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Panel */}
        <div className="col-span-8">
          <Card className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="generate">Generate Questions</TabsTrigger>
                <TabsTrigger value="analyze">Analyze Responses</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>

              <TabsContent value="generate" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Client Name</label>
                    <Input
                      placeholder="Enter client name..."
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Interview Purpose</label>
                    <Select value={interviewType} onValueChange={setInterviewType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="satisfaction">Satisfaction Review</SelectItem>
                        <SelectItem value="onboarding">Onboarding Check</SelectItem>
                        <SelectItem value="quarterly">Quarterly Review</SelectItem>
                        <SelectItem value="churn">Churn Prevention</SelectItem>
                        <SelectItem value="expansion">Expansion Discussion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Account Type</label>
                    <Select value={accountType} onValueChange={setAccountType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="startup">Startup</SelectItem>
                        <SelectItem value="smb">SMB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Relationship Duration</label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New (0-3 months)</SelectItem>
                        <SelectItem value="established">Established (3-12 months)</SelectItem>
                        <SelectItem value="mature">Mature (1-2 years)</SelectItem>
                        <SelectItem value="veteran">Veteran (2+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleGenerateQuestions}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate AI Interview Questions
                    </>
                  )}
                </Button>

                {generatedQuestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-gradient-to-r from-teal-50 to-amber-50 border border-teal-200"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-teal-600" />
                      <span className="font-semibold text-slate-800">AI Generated Questions</span>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-slate-700 whitespace-pre-wrap">{generatedQuestions}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(generatedQuestions)}>
                        Copy Questions
                      </Button>
                      <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                        Use in Interview
                      </Button>
                    </div>
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="analyze" className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Client Name</label>
                  <Input
                    placeholder="Enter client name..."
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Interview Responses</label>
                  <textarea
                    value={interviewResponses}
                    onChange={(e) => setInterviewResponses(e.target.value)}
                    placeholder="Paste interview responses or notes here..."
                    className="w-full h-40 p-3 rounded-lg border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 resize-none"
                  />
                </div>

                <Button 
                  onClick={handleAnalyzeResponses}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing Responses...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4" />
                      Analyze with AI
                    </>
                  )}
                </Button>

                {analysisResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-violet-600" />
                      <span className="font-semibold text-slate-800">AI Analysis Results</span>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-slate-700 whitespace-pre-wrap">{analysisResult}</p>
                    </div>
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="templates" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {interviewTemplates.map((template) => (
                    <Card key={template.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-slate-800">{template.name}</h4>
                          <p className="text-sm text-slate-500">{template.questions} questions</p>
                        </div>
                        <Button size="sm" variant="ghost">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Scheduled Interviews */}
        <div className="col-span-4 space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              Scheduled Interviews
            </h3>
            <div className="space-y-3">
              {scheduledInterviews.map((interview, i) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-slate-800">{interview.clientName}</p>
                      <p className="text-sm text-slate-500">{interview.type}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-500">{interview.scheduledFor}</span>
                      </div>
                    </div>
                    <Badge variant={interview.status === 'completed' ? 'default' : 'outline'} className={
                      interview.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      interview.status === 'upcoming' ? 'bg-amber-100 text-amber-700' : ''
                    }>
                      {interview.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-teal-50 to-amber-50">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <h3 className="font-semibold text-slate-800">AI Interview Tips</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                Start with open-ended questions
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                Listen actively and follow up
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                Note emotional cues and patterns
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                End with actionable next steps
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

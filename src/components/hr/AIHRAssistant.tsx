import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Sparkles, 
  Send,
  FileText,
  Users,
  GraduationCap,
  ClipboardCheck,
  MessageSquare,
  Loader2,
  Copy,
  Bot,
  User,
  Briefcase,
  UserPlus,
  FileQuestion,
  TrendingUp,
  Shield
} from "lucide-react";
import { useHRAI } from "@/hooks/useHRAI";
import { toast } from "sonner";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIHRAssistant = () => {
  const [query, setQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [activeTab, setActiveTab] = useState("chat");
  const [aiResult, setAiResult] = useState<string | null>(null);
  
  // Form states
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("engineering");
  const [level, setLevel] = useState("mid");
  const [employeeName, setEmployeeName] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const { 
    isLoading, 
    chat, 
    screenResume,
    generateJobDescription,
    createOnboardingPlan,
    generateInterviewQuestions,
    recommendTraining,
    draftPolicy,
    analyzeEmployeeFeedback
  } = useHRAI();

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: query,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMessage]);
    setQuery("");

    const response = await chat(query);
    if (response) {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }]);
    }
  };

  const handleGenerateJD = async () => {
    if (!position) {
      toast.error("Please enter a position title");
      return;
    }
    const result = await generateJobDescription({
      position,
      department,
      level,
      skills: additionalInfo.split(',').map(s => s.trim()).filter(Boolean),
    });
    if (result) {
      setAiResult(result);
      toast.success("Job description generated");
    }
  };

  const handleScreenResume = async () => {
    if (!position || !additionalInfo) {
      toast.error("Please fill in position and resume summary");
      return;
    }
    const result = await screenResume({
      position,
      resumeSummary: additionalInfo,
      candidateExperience: "3+ years",
      requiredSkills: ["Communication", "Teamwork"]
    });
    if (result) {
      setAiResult(result);
      toast.success("Resume screened");
    }
  };

  const handleOnboardingPlan = async () => {
    if (!employeeName || !position) {
      toast.error("Please fill in employee name and position");
      return;
    }
    const result = await createOnboardingPlan({
      name: employeeName,
      position,
      department,
      startDate: new Date().toISOString().split('T')[0],
      notes: additionalInfo
    });
    if (result) {
      setAiResult(result);
      toast.success("Onboarding plan created");
    }
  };

  const handleInterviewQuestions = async () => {
    if (!position) {
      toast.error("Please enter a position");
      return;
    }
    const result = await generateInterviewQuestions({
      position,
      department,
      level,
      skills: additionalInfo.split(',').map(s => s.trim()).filter(Boolean)
    });
    if (result) {
      setAiResult(result);
      toast.success("Interview questions generated");
    }
  };

  const handleTrainingRecommend = async () => {
    if (!employeeName) {
      toast.error("Please enter employee name");
      return;
    }
    const result = await recommendTraining({
      name: employeeName,
      role: position || "General",
      currentSkills: additionalInfo.split(',').map(s => s.trim()).filter(Boolean),
      performanceAreas: "General development"
    });
    if (result) {
      setAiResult(result);
      toast.success("Training recommendations ready");
    }
  };

  const handleDraftPolicy = async () => {
    if (!additionalInfo) {
      toast.error("Please describe the policy type");
      return;
    }
    const result = await draftPolicy({
      policyType: additionalInfo,
      audience: "All Employees"
    });
    if (result) {
      setAiResult(result);
      toast.success("Policy drafted");
    }
  };

  const handleFeedbackAnalysis = async () => {
    if (!additionalInfo) {
      toast.error("Please enter feedback summary");
      return;
    }
    const result = await analyzeEmployeeFeedback({
      department,
      feedbackSummary: additionalInfo,
      period: "Last Quarter"
    });
    if (result) {
      setAiResult(result);
      toast.success("Feedback analyzed");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const quickPrompts = [
    "How to handle employee conflict?",
    "Best onboarding practices",
    "Remote work policy tips",
    "Performance review templates",
    "Diversity hiring strategies"
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            AI HR Assistant
          </h2>
          <p className="text-slate-400 text-sm mt-1">Recruitment, training, and HR automation</p>
        </div>
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/40">
          <Sparkles className="w-3 h-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-900/80 border border-slate-700/50 flex-wrap h-auto p-1">
          <TabsTrigger value="chat" className="data-[state=active]:bg-violet-600">
            <Bot className="w-4 h-4 mr-2" />
            HR Chat
          </TabsTrigger>
          <TabsTrigger value="jd" className="data-[state=active]:bg-violet-600">
            <FileText className="w-4 h-4 mr-2" />
            Job Description
          </TabsTrigger>
          <TabsTrigger value="screen" className="data-[state=active]:bg-violet-600">
            <UserPlus className="w-4 h-4 mr-2" />
            Resume Screen
          </TabsTrigger>
          <TabsTrigger value="onboard" className="data-[state=active]:bg-violet-600">
            <ClipboardCheck className="w-4 h-4 mr-2" />
            Onboarding
          </TabsTrigger>
          <TabsTrigger value="interview" className="data-[state=active]:bg-violet-600">
            <FileQuestion className="w-4 h-4 mr-2" />
            Interview Prep
          </TabsTrigger>
          <TabsTrigger value="training" className="data-[state=active]:bg-violet-600">
            <GraduationCap className="w-4 h-4 mr-2" />
            Training
          </TabsTrigger>
          <TabsTrigger value="policy" className="data-[state=active]:bg-violet-600">
            <Shield className="w-4 h-4 mr-2" />
            Policy Draft
          </TabsTrigger>
          <TabsTrigger value="feedback" className="data-[state=active]:bg-violet-600">
            <TrendingUp className="w-4 h-4 mr-2" />
            Feedback Analysis
          </TabsTrigger>
        </TabsList>

        {/* AI Chat Tab */}
        <TabsContent value="chat">
          <Card className="bg-slate-900/50 backdrop-blur-xl border-violet-500/20">
            <CardHeader className="border-b border-slate-700/50">
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                HR Assistant Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-80 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="text-center py-12">
                    <Sparkles className="w-12 h-12 text-violet-400/50 mx-auto mb-4" />
                    <p className="text-slate-400">Ask your AI HR Assistant anything</p>
                    <p className="text-slate-500 text-sm mt-2">Get help with recruitment, policies, training, and more</p>
                  </div>
                )}
                <AnimatePresence>
                  {chatMessages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-violet-400" />
                        </div>
                      )}
                      <div className={`max-w-[80%] p-4 rounded-xl ${
                        msg.role === 'user' 
                          ? 'bg-violet-600 text-white' 
                          : 'bg-slate-800/50 text-slate-200 border border-slate-700/50'
                      }`}>
                        <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-purple-400" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="px-4 pb-3 flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <Button
                    key={prompt}
                    size="sm"
                    variant="outline"
                    className="border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-violet-400 text-xs"
                    onClick={() => setQuery(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>

              <div className="p-4 border-t border-slate-700/50 flex gap-3">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about HR policies, recruitment, training..."
                  className="flex-1 bg-slate-800/50 border-slate-700/50 text-slate-200"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={isLoading || !query.trim()}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Job Description Tab */}
        <TabsContent value="jd">
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-violet-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-violet-400" />
                  Generate Job Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Position Title</label>
                  <Input
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g., Senior Frontend Developer"
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Department</label>
                    <Select value={department} onValueChange={setDepartment}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="hr">Human Resources</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Level</label>
                    <Select value={level} onValueChange={setLevel}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="junior">Junior</SelectItem>
                        <SelectItem value="mid">Mid-Level</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                        <SelectItem value="lead">Lead</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Key Skills (comma separated)</label>
                  <Textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="React, TypeScript, Node.js..."
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                    rows={3}
                  />
                </div>
                <Button 
                  onClick={handleGenerateJD}
                  disabled={isLoading}
                  className="w-full bg-violet-600 hover:bg-violet-700"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                  Generate JD
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-xl border-violet-500/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">AI Result</CardTitle>
                {aiResult && (
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(aiResult)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="h-72 overflow-y-auto bg-slate-800/30 rounded-lg p-4 text-slate-300 text-sm whitespace-pre-wrap">
                  {aiResult || "AI results will appear here..."}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Resume Screening Tab */}
        <TabsContent value="screen">
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-violet-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-violet-400" />
                  AI Resume Screening
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Position Applied For</label>
                  <Input
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g., Full Stack Developer"
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Resume Summary / Key Points</label>
                  <Textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Paste resume summary or key qualifications..."
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                    rows={6}
                  />
                </div>
                <Button 
                  onClick={handleScreenResume}
                  disabled={isLoading}
                  className="w-full bg-violet-600 hover:bg-violet-700"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
                  Screen Resume
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-xl border-violet-500/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Screening Result</CardTitle>
                {aiResult && (
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(aiResult)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="h-72 overflow-y-auto bg-slate-800/30 rounded-lg p-4 text-slate-300 text-sm whitespace-pre-wrap">
                  {aiResult || "Screening results will appear here..."}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onboarding Tab */}
        <TabsContent value="onboard">
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-violet-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-violet-400" />
                  Create Onboarding Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">New Hire Name</label>
                  <Input
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    placeholder="e.g., Priya Sharma"
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Position</label>
                  <Input
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g., Software Engineer"
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Department</label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Special Notes</label>
                  <Textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Any special requirements or notes..."
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                    rows={3}
                  />
                </div>
                <Button 
                  onClick={handleOnboardingPlan}
                  disabled={isLoading}
                  className="w-full bg-violet-600 hover:bg-violet-700"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ClipboardCheck className="w-4 h-4 mr-2" />}
                  Create Plan
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-xl border-violet-500/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Onboarding Plan</CardTitle>
                {aiResult && (
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(aiResult)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="h-72 overflow-y-auto bg-slate-800/30 rounded-lg p-4 text-slate-300 text-sm whitespace-pre-wrap">
                  {aiResult || "Onboarding plan will appear here..."}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Interview Prep Tab */}
        <TabsContent value="interview">
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-violet-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileQuestion className="w-5 h-5 text-violet-400" />
                  Interview Question Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Position</label>
                  <Input
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g., Product Manager"
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Department</label>
                    <Select value={department} onValueChange={setDepartment}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Level</label>
                    <Select value={level} onValueChange={setLevel}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="junior">Junior</SelectItem>
                        <SelectItem value="mid">Mid-Level</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                        <SelectItem value="lead">Lead</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Key Skills to Test</label>
                  <Textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Communication, Problem-solving, Technical skills..."
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                    rows={3}
                  />
                </div>
                <Button 
                  onClick={handleInterviewQuestions}
                  disabled={isLoading}
                  className="w-full bg-violet-600 hover:bg-violet-700"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileQuestion className="w-4 h-4 mr-2" />}
                  Generate Questions
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-xl border-violet-500/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Interview Questions</CardTitle>
                {aiResult && (
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(aiResult)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="h-72 overflow-y-auto bg-slate-800/30 rounded-lg p-4 text-slate-300 text-sm whitespace-pre-wrap">
                  {aiResult || "Interview questions will appear here..."}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Training Tab */}
        <TabsContent value="training">
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-violet-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-violet-400" />
                  Training Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Employee Name</label>
                  <Input
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    placeholder="e.g., Amit Kumar"
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Current Role</label>
                  <Input
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g., Junior Developer"
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Current Skills (comma separated)</label>
                  <Textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="JavaScript, HTML, CSS..."
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                    rows={3}
                  />
                </div>
                <Button 
                  onClick={handleTrainingRecommend}
                  disabled={isLoading}
                  className="w-full bg-violet-600 hover:bg-violet-700"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <GraduationCap className="w-4 h-4 mr-2" />}
                  Get Recommendations
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-xl border-violet-500/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Training Plan</CardTitle>
                {aiResult && (
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(aiResult)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="h-72 overflow-y-auto bg-slate-800/30 rounded-lg p-4 text-slate-300 text-sm whitespace-pre-wrap">
                  {aiResult || "Training recommendations will appear here..."}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Policy Tab */}
        <TabsContent value="policy">
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-violet-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-violet-400" />
                  HR Policy Drafter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Policy Type / Description</label>
                  <Textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="e.g., Remote Work Policy, Leave Policy, Code of Conduct..."
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                    rows={6}
                  />
                </div>
                <Button 
                  onClick={handleDraftPolicy}
                  disabled={isLoading}
                  className="w-full bg-violet-600 hover:bg-violet-700"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
                  Draft Policy
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-xl border-violet-500/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Policy Document</CardTitle>
                {aiResult && (
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(aiResult)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="h-72 overflow-y-auto bg-slate-800/30 rounded-lg p-4 text-slate-300 text-sm whitespace-pre-wrap">
                  {aiResult || "Policy document will appear here..."}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Feedback Analysis Tab */}
        <TabsContent value="feedback">
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-violet-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-violet-400" />
                  Employee Feedback Analyzer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Department</label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Feedback Summary</label>
                  <Textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Paste consolidated feedback or survey responses..."
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                    rows={6}
                  />
                </div>
                <Button 
                  onClick={handleFeedbackAnalysis}
                  disabled={isLoading}
                  className="w-full bg-violet-600 hover:bg-violet-700"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <TrendingUp className="w-4 h-4 mr-2" />}
                  Analyze Feedback
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-xl border-violet-500/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Analysis Results</CardTitle>
                {aiResult && (
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(aiResult)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="h-72 overflow-y-auto bg-slate-800/30 rounded-lg p-4 text-slate-300 text-sm whitespace-pre-wrap">
                  {aiResult || "Analysis results will appear here..."}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIHRAssistant;

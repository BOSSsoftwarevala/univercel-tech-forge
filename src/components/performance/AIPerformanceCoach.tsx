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
  Target,
  TrendingUp,
  Users,
  Award,
  AlertTriangle,
  BarChart3,
  FileText,
  Loader2,
  Copy,
  Bot,
  User,
  Zap,
  Calendar,
  Trophy
} from "lucide-react";
import { usePerformanceAI } from "@/hooks/usePerformanceAI";
import { toast } from "sonner";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AIPerformanceCoach = () => {
  const [query, setQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [activeTab, setActiveTab] = useState("chat");
  const [aiResult, setAiResult] = useState<string | null>(null);
  
  // Form states
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedRole, setSelectedRole] = useState("developer");
  const [currentScore, setCurrentScore] = useState("85");
  const [issueDescription, setIssueDescription] = useState("");

  const { 
    isLoading, 
    chat, 
    analyzeIndividual, 
    analyzeTeam,
    generateGoals,
    createCoachingPlan,
    predictRisk,
    recommendIncentive,
    generateWeeklyReport
  } = usePerformanceAI();

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

  const handleAnalyzeIndividual = async () => {
    if (!selectedMember) {
      toast.error("Please enter a team member name");
      return;
    }
    const result = await analyzeIndividual({
      name: selectedMember,
      role: selectedRole,
      score: parseInt(currentScore),
      metrics: {
        speed: 85,
        quality: 88,
        communication: 82,
        delivery: 90,
        teamwork: 87
      }
    });
    if (result) {
      setAiResult(result);
      toast.success("Analysis complete");
    }
  };

  const handleAnalyzeTeam = async () => {
    const result = await analyzeTeam({
      teamSize: 12,
      avgScore: 84,
      members: [
        { name: "vala(dev)4412", role: "Developer", score: 92 },
        { name: "vala(sales)4771", role: "Sales", score: 87 },
        { name: "vala(support)2341", role: "Support", score: 78 },
        { name: "vala(reseller)8821", role: "Reseller", score: 84 }
      ],
      trends: "Improving overall, support needs attention"
    });
    if (result) {
      setAiResult(result);
      toast.success("Team analysis complete");
    }
  };

  const handleGenerateGoals = async () => {
    if (!selectedMember) {
      toast.error("Please enter a team member name");
      return;
    }
    const result = await generateGoals({
      name: selectedMember,
      role: selectedRole,
      metrics: {
        currentScore: parseInt(currentScore),
        deliveryRate: 92,
        qualityScore: 88,
        communicationScore: 85
      },
      focusAreas: issueDescription || "General performance improvement"
    });
    if (result) {
      setAiResult(result);
      toast.success("Goals generated");
    }
  };

  const handleCreateCoachingPlan = async () => {
    if (!selectedMember || !issueDescription) {
      toast.error("Please fill in member name and issues");
      return;
    }
    const result = await createCoachingPlan({
      name: selectedMember,
      role: selectedRole,
      issues: issueDescription,
      score: parseInt(currentScore),
      goal: "Achieve 90+ performance score"
    });
    if (result) {
      setAiResult(result);
      toast.success("Coaching plan created");
    }
  };

  const handlePredictRisk = async () => {
    if (!selectedMember) {
      toast.error("Please enter a team member name");
      return;
    }
    const result = await predictRisk({
      name: selectedMember,
      role: selectedRole,
      scoreTrend: "Declining from 88 to 78 over 2 weeks",
      flags: ["Delayed responses", "Missed deadlines"],
      attendance: "3 late arrivals this week",
      recentChanges: issueDescription || "None reported"
    });
    if (result) {
      setAiResult(result);
      toast.success("Risk prediction complete");
    }
  };

  const handleRecommendIncentive = async () => {
    if (!selectedMember) {
      toast.error("Please enter a team member name");
      return;
    }
    const result = await recommendIncentive({
      name: selectedMember,
      role: selectedRole,
      achievement: issueDescription || "Exceeded monthly targets by 20%",
      score: parseInt(currentScore),
      pastRewards: "Performance bonus 3 months ago"
    });
    if (result) {
      setAiResult(result);
      toast.success("Incentive recommendation ready");
    }
  };

  const handleGenerateReport = async () => {
    const result = await generateWeeklyReport({
      teamData: [
        { name: "vala(dev)4412", role: "Developer", score: 92 },
        { name: "vala(sales)4771", role: "Sales", score: 87 },
        { name: "vala(support)2341", role: "Support", score: 78 },
        { name: "vala(reseller)8821", role: "Reseller", score: 84 }
      ],
      period: "This Week",
      prevScore: 82
    });
    if (result) {
      setAiResult(result);
      toast.success("Weekly report generated");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const quickPrompts = [
    "How to improve team productivity?",
    "Best practices for 1-on-1 reviews",
    "Handle underperformer diplomatically",
    "Set effective KPIs for developers",
    "Motivate remote team members"
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            AI Performance Coach
          </h2>
          <p className="text-slate-400 text-sm mt-1">Real-time performance insights & coaching</p>
        </div>
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/40">
          <Sparkles className="w-3 h-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-900/80 border border-slate-700/50 flex-wrap h-auto p-1">
          <TabsTrigger value="chat" className="data-[state=active]:bg-cyan-600">
            <Bot className="w-4 h-4 mr-2" />
            AI Coach
          </TabsTrigger>
          <TabsTrigger value="individual" className="data-[state=active]:bg-cyan-600">
            <User className="w-4 h-4 mr-2" />
            Analyze Individual
          </TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-cyan-600">
            <Users className="w-4 h-4 mr-2" />
            Team Analysis
          </TabsTrigger>
          <TabsTrigger value="goals" className="data-[state=active]:bg-cyan-600">
            <Target className="w-4 h-4 mr-2" />
            Goal Generator
          </TabsTrigger>
          <TabsTrigger value="coaching" className="data-[state=active]:bg-cyan-600">
            <Zap className="w-4 h-4 mr-2" />
            Coaching Plan
          </TabsTrigger>
          <TabsTrigger value="risk" className="data-[state=active]:bg-cyan-600">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Risk Predictor
          </TabsTrigger>
          <TabsTrigger value="incentive" className="data-[state=active]:bg-cyan-600">
            <Trophy className="w-4 h-4 mr-2" />
            Incentives
          </TabsTrigger>
          <TabsTrigger value="report" className="data-[state=active]:bg-cyan-600">
            <FileText className="w-4 h-4 mr-2" />
            Weekly Report
          </TabsTrigger>
        </TabsList>

        {/* AI Chat Tab */}
        <TabsContent value="chat">
          <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
            <CardHeader className="border-b border-slate-700/50">
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                Performance Coach Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-80 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="text-center py-12">
                    <Sparkles className="w-12 h-12 text-cyan-400/50 mx-auto mb-4" />
                    <p className="text-slate-400">Ask your AI Performance Coach anything</p>
                    <p className="text-slate-500 text-sm mt-2">Get insights on team performance, coaching strategies, and more</p>
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
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-cyan-400" />
                        </div>
                      )}
                      <div className={`max-w-[80%] p-4 rounded-xl ${
                        msg.role === 'user' 
                          ? 'bg-cyan-600 text-white' 
                          : 'bg-slate-800/50 text-slate-200 border border-slate-700/50'
                      }`}>
                        <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-emerald-400" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
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
                    className="border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-cyan-400 text-xs"
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
                  placeholder="Ask about performance strategies, coaching tips..."
                  className="flex-1 bg-slate-800/50 border-slate-700/50 text-slate-200"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={isLoading || !query.trim()}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Individual Analysis Tab */}
        <TabsContent value="individual">
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-cyan-400" />
                  Individual Performance Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Team Member Name/ID</label>
                  <Input
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    placeholder="e.g., vala(dev)4412"
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Role</label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="developer">Developer</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="reseller">Reseller</SelectItem>
                        <SelectItem value="franchise">Franchise</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Current Score</label>
                    <Input
                      type="number"
                      value={currentScore}
                      onChange={(e) => setCurrentScore(e.target.value)}
                      className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleAnalyzeIndividual}
                  disabled={isLoading}
                  className="w-full bg-cyan-600 hover:bg-cyan-700"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BarChart3 className="w-4 h-4 mr-2" />}
                  Analyze Performance
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">AI Analysis Result</CardTitle>
                {aiResult && (
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(aiResult)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="h-72 overflow-y-auto bg-slate-800/30 rounded-lg p-4 text-slate-300 text-sm whitespace-pre-wrap">
                  {aiResult || "AI analysis results will appear here..."}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Team Analysis Tab */}
        <TabsContent value="team">
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  Team Performance Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-400 text-sm">
                  Analyze your entire team's performance, identify top performers, at-risk members, and get strategic recommendations.
                </p>
                <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                  <p className="text-sm text-slate-300 mb-2">Current Team Overview:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                    <div>• 12 Team Members</div>
                    <div>• Avg Score: 84</div>
                    <div>• 3 High Performers</div>
                    <div>• 2 At-Risk</div>
                  </div>
                </div>
                <Button 
                  onClick={handleAnalyzeTeam}
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Users className="w-4 h-4 mr-2" />}
                  Analyze Full Team
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Team Analysis</CardTitle>
                {aiResult && (
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(aiResult)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="h-72 overflow-y-auto bg-slate-800/30 rounded-lg p-4 text-slate-300 text-sm whitespace-pre-wrap">
                  {aiResult || "Team analysis will appear here..."}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Goal Generator Tab */}
        <TabsContent value="goals">
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-400" />
                  AI Goal Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Team Member</label>
                  <Input
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    placeholder="Enter name/ID"
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Focus Areas (Optional)</label>
                  <Textarea
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    placeholder="e.g., Communication skills, Delivery speed, Client handling..."
                    className="h-24 bg-slate-800/50 border-slate-700/50 text-slate-200"
                  />
                </div>
                <Button 
                  onClick={handleGenerateGoals}
                  disabled={isLoading}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Target className="w-4 h-4 mr-2" />}
                  Generate SMART Goals
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white">Generated Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72 overflow-y-auto bg-slate-800/30 rounded-lg p-4 text-slate-300 text-sm whitespace-pre-wrap">
                  {aiResult || "AI-generated goals will appear here..."}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Coaching Plan Tab */}
        <TabsContent value="coaching">
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-violet-400" />
                  AI Coaching Plan Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Team Member</label>
                    <Input
                      value={selectedMember}
                      onChange={(e) => setSelectedMember(e.target.value)}
                      placeholder="Name/ID"
                      className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Current Score</label>
                    <Input
                      type="number"
                      value={currentScore}
                      onChange={(e) => setCurrentScore(e.target.value)}
                      className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Performance Issues *</label>
                  <Textarea
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    placeholder="Describe the issues... e.g., Delayed deliveries, poor communication with clients, missing deadlines..."
                    className="h-24 bg-slate-800/50 border-slate-700/50 text-slate-200"
                  />
                </div>
                <Button 
                  onClick={handleCreateCoachingPlan}
                  disabled={isLoading}
                  className="w-full bg-violet-600 hover:bg-violet-700"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
                  Create 30-Day Coaching Plan
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white">Coaching Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72 overflow-y-auto bg-slate-800/30 rounded-lg p-4 text-slate-300 text-sm whitespace-pre-wrap">
                  {aiResult || "AI coaching plan will appear here..."}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Risk Predictor Tab */}
        <TabsContent value="risk">
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  AI Risk Predictor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Team Member</label>
                  <Input
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    placeholder="Enter name/ID"
                    className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Recent Changes/Observations</label>
                  <Textarea
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    placeholder="Any recent changes in behavior, attendance, or performance..."
                    className="h-24 bg-slate-800/50 border-slate-700/50 text-slate-200"
                  />
                </div>
                <Button 
                  onClick={handlePredictRisk}
                  disabled={isLoading}
                  className="w-full bg-rose-600 hover:bg-rose-700"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <AlertTriangle className="w-4 h-4 mr-2" />}
                  Predict Performance Risk
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white">Risk Prediction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72 overflow-y-auto bg-slate-800/30 rounded-lg p-4 text-slate-300 text-sm whitespace-pre-wrap">
                  {aiResult || "Risk prediction will appear here..."}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Incentive Tab */}
        <TabsContent value="incentive">
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  AI Incentive Recommender
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Team Member</label>
                    <Input
                      value={selectedMember}
                      onChange={(e) => setSelectedMember(e.target.value)}
                      placeholder="Name/ID"
                      className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Score</label>
                    <Input
                      type="number"
                      value={currentScore}
                      onChange={(e) => setCurrentScore(e.target.value)}
                      className="bg-slate-800/50 border-slate-700/50 text-slate-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Achievement Description</label>
                  <Textarea
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    placeholder="Describe the achievement... e.g., Exceeded targets by 30%, perfect attendance, client appreciation..."
                    className="h-24 bg-slate-800/50 border-slate-700/50 text-slate-200"
                  />
                </div>
                <Button 
                  onClick={handleRecommendIncentive}
                  disabled={isLoading}
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trophy className="w-4 h-4 mr-2" />}
                  Recommend Incentive
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white">Incentive Recommendation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72 overflow-y-auto bg-slate-800/30 rounded-lg p-4 text-slate-300 text-sm whitespace-pre-wrap">
                  {aiResult || "Incentive recommendations will appear here..."}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Weekly Report Tab */}
        <TabsContent value="report">
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  AI Weekly Report Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-400 text-sm">
                  Generate a comprehensive weekly performance report with AI-powered insights, highlights, and action items.
                </p>
                <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                  <p className="text-sm text-slate-300 mb-2">Report will include:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                    <div>✓ Executive Summary</div>
                    <div>✓ Key Highlights</div>
                    <div>✓ Areas of Concern</div>
                    <div>✓ Top Performers</div>
                    <div>✓ Trends Analysis</div>
                    <div>✓ Action Items</div>
                  </div>
                </div>
                <Button 
                  onClick={handleGenerateReport}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                  Generate Weekly Report
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Weekly Report</CardTitle>
                {aiResult && (
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(aiResult)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="h-72 overflow-y-auto bg-slate-800/30 rounded-lg p-4 text-slate-300 text-sm whitespace-pre-wrap">
                  {aiResult || "Weekly report will appear here..."}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIPerformanceCoach;

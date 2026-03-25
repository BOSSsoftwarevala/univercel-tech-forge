import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRnDAI } from "@/hooks/useRnDAI";
import {
  Brain,
  Send,
  Lightbulb,
  TrendingUp,
  Target,
  Users,
  Code,
  FileSearch,
  Sparkles,
  Shield,
  Settings2,
  FileText,
  Radar,
  FlaskConical,
  Loader2,
  Bot,
  Zap,
  MessageSquare
} from "lucide-react";

export const AIRnDAssistant = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  
  // Form states
  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaDescription, setIdeaDescription] = useState("");
  const [ideaCategory, setIdeaCategory] = useState("");
  const [trendInput, setTrendInput] = useState("");
  const [projectInput, setProjectInput] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [problemSpace, setProblemSpace] = useState("");
  const [opportunityInput, setOpportunityInput] = useState("");
  const [hypothesisInput, setHypothesisInput] = useState("");

  const { 
    isLoading, 
    chat, 
    evaluateIdea, 
    analyzeTrend, 
    createPrototypePlan,
    brainstormInnovation,
    autoGenerateProposal,
    createTechnologyRadar,
    designExperiment,
    developRiskMitigation
  } = useRnDAI();

  const handleChat = async () => {
    if (!inputMessage.trim()) return;
    
    setChatMessages(prev => [...prev, { role: "user", content: inputMessage }]);
    const response = await chat(inputMessage, "R&D Assistant");
    if (response) {
      setChatMessages(prev => [...prev, { role: "assistant", content: response }]);
    }
    setInputMessage("");
  };

  const handleEvaluateIdea = async () => {
    if (!ideaTitle || !ideaDescription) return;
    const response = await evaluateIdea(ideaTitle, ideaDescription, ideaCategory || "General");
    setAiResponse(response);
  };

  const handleAnalyzeTrend = async () => {
    if (!trendInput) return;
    const response = await analyzeTrend(trendInput);
    setAiResponse(response);
  };

  const handlePrototypePlan = async () => {
    if (!projectInput || !goalInput) return;
    const response = await createPrototypePlan(projectInput, goalInput);
    setAiResponse(response);
  };

  const handleBrainstorm = async () => {
    if (!problemSpace) return;
    const response = await brainstormInnovation(problemSpace);
    setAiResponse(response);
  };

  const handleAutoProposal = async () => {
    if (!opportunityInput) return;
    const response = await autoGenerateProposal(opportunityInput);
    setAiResponse(response);
  };

  const handleTechRadar = async () => {
    const response = await createTechnologyRadar("Software Development", "2 years");
    setAiResponse(response);
  };

  const handleExperiment = async () => {
    if (!hypothesisInput) return;
    const response = await designExperiment(hypothesisInput);
    setAiResponse(response);
  };

  const handleRiskMitigation = async () => {
    if (!projectInput) return;
    const response = await developRiskMitigation(projectInput);
    setAiResponse(response);
  };

  const aiCapabilities = [
    { id: "chat", label: "AI Chat", icon: MessageSquare },
    { id: "evaluate", label: "Idea Evaluator", icon: Lightbulb },
    { id: "trends", label: "Trend Analysis", icon: TrendingUp },
    { id: "prototype", label: "Prototype Planner", icon: Code },
    { id: "brainstorm", label: "Innovation Lab", icon: Sparkles },
    { id: "proposal", label: "Auto Proposal", icon: FileText },
    { id: "radar", label: "Tech Radar", icon: Radar },
    { id: "experiment", label: "Experiment Design", icon: FlaskConical },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-600/30 to-cyan-600/30 border border-violet-500/30">
            <Brain className="w-8 h-8 text-violet-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              AI R&D Command Center
            </h2>
            <p className="text-slate-400 text-sm">15 AI-Powered Capabilities for Innovation</p>
          </div>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          <Zap className="w-3 h-3 mr-1" />
          Neural Engine Active
        </Badge>
      </motion.div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel - AI Capabilities */}
        <div className="col-span-4">
          <Card className="bg-slate-900/50 border-violet-500/20 p-4">
            <h3 className="text-sm font-semibold text-violet-300 mb-4 flex items-center gap-2">
              <Bot className="w-4 h-4" />
              AI Capabilities
            </h3>
            <div className="space-y-2">
              {aiCapabilities.map((cap, index) => (
                <motion.button
                  key={cap.id}
                  onClick={() => setActiveTab(cap.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                    activeTab === cap.id
                      ? "bg-gradient-to-r from-violet-600/30 to-cyan-600/30 text-white border border-violet-500/50"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  <cap.icon className={`w-4 h-4 ${activeTab === cap.id ? "text-violet-400" : ""}`} />
                  <span>{cap.label}</span>
                  {activeTab === cap.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-2 h-2 rounded-full bg-violet-400"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Panel - Active Capability */}
        <div className="col-span-8">
          <Card className="bg-slate-900/50 border-violet-500/20 p-6 min-h-[600px]">
            <AnimatePresence mode="wait">
              {/* Chat Tab */}
              {activeTab === "chat" && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full flex flex-col"
                >
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-violet-400" />
                    R&D AI Assistant
                  </h3>
                  
                  <ScrollArea className="flex-1 mb-4 pr-4" style={{ height: "400px" }}>
                    <div className="space-y-4">
                      {chatMessages.length === 0 && (
                        <div className="text-center text-slate-500 py-8">
                          <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>Ask me anything about R&D strategy, innovation, or technology trends!</p>
                        </div>
                      )}
                      {chatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-xl ${
                            msg.role === "user"
                              ? "bg-violet-600/20 border border-violet-500/30 ml-8"
                              : "bg-slate-800/50 border border-slate-700/50 mr-8"
                          }`}
                        >
                          <p className="text-xs text-slate-500 mb-1">
                            {msg.role === "user" ? "You" : "AI Assistant"}
                          </p>
                          <p className="text-sm text-slate-200 whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex items-center gap-2 text-slate-400">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Thinking...</span>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleChat()}
                      placeholder="Ask about innovation, trends, technology..."
                      className="bg-slate-800/50 border-slate-700"
                    />
                    <Button
                      onClick={handleChat}
                      disabled={isLoading || !inputMessage.trim()}
                      className="bg-gradient-to-r from-violet-600 to-cyan-600"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Idea Evaluator */}
              {activeTab === "evaluate" && (
                <motion.div
                  key="evaluate"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    AI Idea Evaluator
                  </h3>
                  <p className="text-slate-400 text-sm">Get comprehensive AI analysis of your R&D ideas</p>
                  
                  <div className="space-y-4">
                    <Input
                      value={ideaTitle}
                      onChange={(e) => setIdeaTitle(e.target.value)}
                      placeholder="Idea Title"
                      className="bg-slate-800/50 border-slate-700"
                    />
                    <Textarea
                      value={ideaDescription}
                      onChange={(e) => setIdeaDescription(e.target.value)}
                      placeholder="Describe your idea in detail..."
                      className="bg-slate-800/50 border-slate-700 min-h-[100px]"
                    />
                    <Input
                      value={ideaCategory}
                      onChange={(e) => setIdeaCategory(e.target.value)}
                      placeholder="Category (e.g., AI, UX, DevTools)"
                      className="bg-slate-800/50 border-slate-700"
                    />
                    <Button
                      onClick={handleEvaluateIdea}
                      disabled={isLoading || !ideaTitle || !ideaDescription}
                      className="w-full bg-gradient-to-r from-violet-600 to-cyan-600"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                      Evaluate Idea
                    </Button>
                  </div>

                  {aiResponse && (
                    <ScrollArea className="h-[300px] mt-4">
                      <Card className="bg-slate-800/50 border-slate-700 p-4">
                        <p className="text-sm text-slate-200 whitespace-pre-wrap">{aiResponse}</p>
                      </Card>
                    </ScrollArea>
                  )}
                </motion.div>
              )}

              {/* Trend Analysis */}
              {activeTab === "trends" && (
                <motion.div
                  key="trends"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    AI Trend Analyzer
                  </h3>
                  <p className="text-slate-400 text-sm">Deep-dive into market and technology trends</p>
                  
                  <Textarea
                    value={trendInput}
                    onChange={(e) => setTrendInput(e.target.value)}
                    placeholder="Enter a trend to analyze (e.g., 'AI-powered code generation', 'Low-code platforms')"
                    className="bg-slate-800/50 border-slate-700 min-h-[100px]"
                  />
                  <Button
                    onClick={handleAnalyzeTrend}
                    disabled={isLoading || !trendInput}
                    className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <TrendingUp className="w-4 h-4 mr-2" />}
                    Analyze Trend
                  </Button>

                  {aiResponse && (
                    <ScrollArea className="h-[350px] mt-4">
                      <Card className="bg-slate-800/50 border-slate-700 p-4">
                        <p className="text-sm text-slate-200 whitespace-pre-wrap">{aiResponse}</p>
                      </Card>
                    </ScrollArea>
                  )}
                </motion.div>
              )}

              {/* Prototype Planner */}
              {activeTab === "prototype" && (
                <motion.div
                  key="prototype"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Code className="w-5 h-5 text-blue-400" />
                    AI Prototype Planner
                  </h3>
                  <p className="text-slate-400 text-sm">Generate detailed prototype development plans</p>
                  
                  <div className="space-y-4">
                    <Input
                      value={projectInput}
                      onChange={(e) => setProjectInput(e.target.value)}
                      placeholder="Project Name"
                      className="bg-slate-800/50 border-slate-700"
                    />
                    <Textarea
                      value={goalInput}
                      onChange={(e) => setGoalInput(e.target.value)}
                      placeholder="Project Goal - What are you trying to achieve?"
                      className="bg-slate-800/50 border-slate-700 min-h-[100px]"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handlePrototypePlan}
                        disabled={isLoading || !projectInput || !goalInput}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600"
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Code className="w-4 h-4 mr-2" />}
                        Generate Plan
                      </Button>
                      <Button
                        onClick={handleRiskMitigation}
                        disabled={isLoading || !projectInput}
                        variant="outline"
                        className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Risk Analysis
                      </Button>
                    </div>
                  </div>

                  {aiResponse && (
                    <ScrollArea className="h-[300px] mt-4">
                      <Card className="bg-slate-800/50 border-slate-700 p-4">
                        <p className="text-sm text-slate-200 whitespace-pre-wrap">{aiResponse}</p>
                      </Card>
                    </ScrollArea>
                  )}
                </motion.div>
              )}

              {/* Innovation Lab */}
              {activeTab === "brainstorm" && (
                <motion.div
                  key="brainstorm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    AI Innovation Lab
                  </h3>
                  <p className="text-slate-400 text-sm">Generate innovative ideas through AI brainstorming</p>
                  
                  <Textarea
                    value={problemSpace}
                    onChange={(e) => setProblemSpace(e.target.value)}
                    placeholder="Describe the problem space or area you want to innovate in..."
                    className="bg-slate-800/50 border-slate-700 min-h-[120px]"
                  />
                  <Button
                    onClick={handleBrainstorm}
                    disabled={isLoading || !problemSpace}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    Generate Innovation Ideas
                  </Button>

                  {aiResponse && (
                    <ScrollArea className="h-[320px] mt-4">
                      <Card className="bg-slate-800/50 border-slate-700 p-4">
                        <p className="text-sm text-slate-200 whitespace-pre-wrap">{aiResponse}</p>
                      </Card>
                    </ScrollArea>
                  )}
                </motion.div>
              )}

              {/* Auto Proposal */}
              {activeTab === "proposal" && (
                <motion.div
                  key="proposal"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-400" />
                    AI Proposal Generator
                  </h3>
                  <p className="text-slate-400 text-sm">Auto-generate complete R&D proposals</p>
                  
                  <Textarea
                    value={opportunityInput}
                    onChange={(e) => setOpportunityInput(e.target.value)}
                    placeholder="Describe the market opportunity or problem to address..."
                    className="bg-slate-800/50 border-slate-700 min-h-[120px]"
                  />
                  <Button
                    onClick={handleAutoProposal}
                    disabled={isLoading || !opportunityInput}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
                    Generate Full Proposal
                  </Button>

                  {aiResponse && (
                    <ScrollArea className="h-[320px] mt-4">
                      <Card className="bg-slate-800/50 border-slate-700 p-4">
                        <p className="text-sm text-slate-200 whitespace-pre-wrap">{aiResponse}</p>
                      </Card>
                    </ScrollArea>
                  )}
                </motion.div>
              )}

              {/* Tech Radar */}
              {activeTab === "radar" && (
                <motion.div
                  key="radar"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Radar className="w-5 h-5 text-cyan-400" />
                    AI Technology Radar
                  </h3>
                  <p className="text-slate-400 text-sm">Generate technology radar for strategic planning</p>
                  
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <Card className="bg-emerald-500/10 border-emerald-500/30 p-3 text-center">
                      <p className="text-emerald-400 font-semibold">ADOPT</p>
                      <p className="text-xs text-slate-400">Production Ready</p>
                    </Card>
                    <Card className="bg-blue-500/10 border-blue-500/30 p-3 text-center">
                      <p className="text-blue-400 font-semibold">TRIAL</p>
                      <p className="text-xs text-slate-400">Worth Piloting</p>
                    </Card>
                    <Card className="bg-amber-500/10 border-amber-500/30 p-3 text-center">
                      <p className="text-amber-400 font-semibold">ASSESS</p>
                      <p className="text-xs text-slate-400">Worth Exploring</p>
                    </Card>
                    <Card className="bg-red-500/10 border-red-500/30 p-3 text-center">
                      <p className="text-red-400 font-semibold">HOLD</p>
                      <p className="text-xs text-slate-400">Proceed with Caution</p>
                    </Card>
                  </div>

                  <Button
                    onClick={handleTechRadar}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Radar className="w-4 h-4 mr-2" />}
                    Generate Technology Radar
                  </Button>

                  {aiResponse && (
                    <ScrollArea className="h-[300px] mt-4">
                      <Card className="bg-slate-800/50 border-slate-700 p-4">
                        <p className="text-sm text-slate-200 whitespace-pre-wrap">{aiResponse}</p>
                      </Card>
                    </ScrollArea>
                  )}
                </motion.div>
              )}

              {/* Experiment Design */}
              {activeTab === "experiment" && (
                <motion.div
                  key="experiment"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-pink-400" />
                    AI Experiment Designer
                  </h3>
                  <p className="text-slate-400 text-sm">Design controlled experiments for R&D validation</p>
                  
                  <Textarea
                    value={hypothesisInput}
                    onChange={(e) => setHypothesisInput(e.target.value)}
                    placeholder="Enter your hypothesis to test (e.g., 'Using AI code completion will reduce development time by 30%')"
                    className="bg-slate-800/50 border-slate-700 min-h-[120px]"
                  />
                  <Button
                    onClick={handleExperiment}
                    disabled={isLoading || !hypothesisInput}
                    className="w-full bg-gradient-to-r from-pink-600 to-rose-600"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FlaskConical className="w-4 h-4 mr-2" />}
                    Design Experiment
                  </Button>

                  {aiResponse && (
                    <ScrollArea className="h-[300px] mt-4">
                      <Card className="bg-slate-800/50 border-slate-700 p-4">
                        <p className="text-sm text-slate-200 whitespace-pre-wrap">{aiResponse}</p>
                      </Card>
                    </ScrollArea>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </div>
  );
};

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Sparkles, 
  Send,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Scale,
  Shield,
  Gavel,
  FileSignature,
  Loader2,
  Copy,
  Download,
  Bot,
  User
} from "lucide-react";
import { useLegalAI } from "@/hooks/useLegalAI";
import { toast } from "sonner";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ComplianceAIAssistant = () => {
  const [query, setQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [activeTab, setActiveTab] = useState("chat");
  
  // Tool states
  const [contractDesc, setContractDesc] = useState("");
  const [jurisdiction, setJurisdiction] = useState("Global");
  const [contractType, setContractType] = useState("General Agreement");
  const [complianceInput, setComplianceInput] = useState("");
  const [riskInput, setRiskInput] = useState("");
  const [clauseInput, setClauseInput] = useState("");
  const [ndaInput, setNdaInput] = useState("");
  const [toolResult, setToolResult] = useState<string | null>(null);

  const { 
    isLoading, 
    legalChat, 
    draftContract, 
    checkCompliance, 
    analyzeRisk, 
    suggestClauses,
    reviewNDA
  } = useLegalAI();

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

    const response = await legalChat(query);
    if (response) {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }]);
    }
  };

  const handleDraftContract = async () => {
    if (!contractDesc.trim()) return;
    const result = await draftContract(contractDesc, jurisdiction, contractType);
    if (result) {
      setToolResult(result);
      toast.success("Contract drafted successfully");
    }
  };

  const handleComplianceCheck = async () => {
    if (!complianceInput.trim()) return;
    const result = await checkCompliance(complianceInput);
    if (result) {
      setToolResult(result);
      toast.success("Compliance check complete");
    }
  };

  const handleRiskAnalysis = async () => {
    if (!riskInput.trim()) return;
    const result = await analyzeRisk(riskInput);
    if (result) {
      setToolResult(result);
      toast.success("Risk analysis complete");
    }
  };

  const handleClauseSuggest = async () => {
    if (!clauseInput.trim()) return;
    const result = await suggestClauses(clauseInput);
    if (result) {
      setToolResult(result);
      toast.success("Clause suggestions ready");
    }
  };

  const handleNDAReview = async () => {
    if (!ndaInput.trim()) return;
    const result = await reviewNDA(ndaInput);
    if (result) {
      setToolResult(result);
      toast.success("NDA review complete");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const quickPrompts = [
    "GDPR compliance requirements",
    "Contract termination clauses",
    "Data breach response plan",
    "Force majeure clause",
    "NDA best practices"
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">AI Legal & Compliance Assistant</h2>
          <p className="text-stone-500">Real-time legal guidance</p>
        </div>
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/40">
          <Sparkles className="w-3 h-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-stone-900/80 border border-stone-800/50">
          <TabsTrigger value="chat" className="data-[state=active]:bg-purple-600">
            <Bot className="w-4 h-4 mr-2" />
            AI Chat
          </TabsTrigger>
          <TabsTrigger value="contract" className="data-[state=active]:bg-purple-600">
            <FileSignature className="w-4 h-4 mr-2" />
            Draft Contract
          </TabsTrigger>
          <TabsTrigger value="compliance" className="data-[state=active]:bg-purple-600">
            <Shield className="w-4 h-4 mr-2" />
            Compliance Check
          </TabsTrigger>
          <TabsTrigger value="risk" className="data-[state=active]:bg-purple-600">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Risk Analysis
          </TabsTrigger>
          <TabsTrigger value="clauses" className="data-[state=active]:bg-purple-600">
            <FileText className="w-4 h-4 mr-2" />
            Clause Suggest
          </TabsTrigger>
          <TabsTrigger value="nda" className="data-[state=active]:bg-purple-600">
            <Gavel className="w-4 h-4 mr-2" />
            NDA Review
          </TabsTrigger>
        </TabsList>

        {/* AI Chat Tab */}
        <TabsContent value="chat">
          <Card className="bg-stone-900/80 border-stone-800/50">
            <CardHeader className="border-b border-stone-800/50">
              <CardTitle className="text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-400" />
                Legal AI Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="text-center py-12">
                    <Scale className="w-12 h-12 text-purple-400/50 mx-auto mb-4" />
                    <p className="text-stone-400">Start a conversation with your AI Legal Assistant</p>
                    <p className="text-stone-500 text-sm mt-2">Ask about compliance, contracts, or legal matters</p>
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
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-purple-400" />
                        </div>
                      )}
                      <div className={`max-w-[80%] p-4 rounded-xl ${
                        msg.role === 'user' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-stone-800/50 text-stone-200 border border-stone-700/50'
                      }`}>
                        <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                        {msg.role === 'assistant' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(msg.content)}
                            className="mt-2 h-7 text-xs text-stone-400 hover:text-purple-400"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                        )}
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-blue-400" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                    </div>
                    <div className="bg-stone-800/50 rounded-xl p-4 border border-stone-700/50">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Prompts */}
              <div className="px-4 pb-3 flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <Button
                    key={prompt}
                    size="sm"
                    variant="outline"
                    className="border-stone-700 text-stone-400 hover:bg-stone-800 hover:text-purple-400"
                    onClick={() => setQuery(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-stone-800/50 flex gap-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about compliance, contracts, regulations..."
                  className="flex-1 h-12 px-4 rounded-xl bg-stone-800/50 border border-stone-700/50 text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-purple-500/50"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={isLoading || !query.trim()}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contract Draft Tab */}
        <TabsContent value="contract">
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-stone-900/80 border-stone-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileSignature className="w-5 h-5 text-purple-400" />
                  AI Contract Drafting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-stone-400 mb-2 block">Jurisdiction</label>
                    <Select value={jurisdiction} onValueChange={setJurisdiction}>
                      <SelectTrigger className="bg-stone-800/50 border-stone-700/50 text-stone-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Global">Global</SelectItem>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="USA">USA</SelectItem>
                        <SelectItem value="EU">European Union</SelectItem>
                        <SelectItem value="UAE">UAE</SelectItem>
                        <SelectItem value="Singapore">Singapore</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-stone-400 mb-2 block">Contract Type</label>
                    <Select value={contractType} onValueChange={setContractType}>
                      <SelectTrigger className="bg-stone-800/50 border-stone-700/50 text-stone-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General Agreement">General Agreement</SelectItem>
                        <SelectItem value="NDA">NDA</SelectItem>
                        <SelectItem value="Franchise Agreement">Franchise Agreement</SelectItem>
                        <SelectItem value="Reseller Contract">Reseller Contract</SelectItem>
                        <SelectItem value="Client Agreement">Client Agreement</SelectItem>
                        <SelectItem value="Employment Contract">Employment Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Textarea
                  value={contractDesc}
                  onChange={(e) => setContractDesc(e.target.value)}
                  placeholder="Describe the contract you need... e.g., 'A 2-year franchise agreement for a retail store in Mumbai with revenue sharing terms'"
                  className="h-40 bg-stone-800/50 border-stone-700/50 text-stone-200"
                />
                <Button 
                  onClick={handleDraftContract}
                  disabled={isLoading || !contractDesc.trim()}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                  Generate Contract
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-stone-900/80 border-stone-800/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Generated Contract</CardTitle>
                {toolResult && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(toolResult)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="h-80 overflow-y-auto bg-stone-800/30 rounded-lg p-4 text-stone-300 text-sm whitespace-pre-wrap">
                  {toolResult || "Your AI-generated contract will appear here..."}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance Check Tab */}
        <TabsContent value="compliance">
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-stone-900/80 border-stone-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  AI Compliance Checker
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={complianceInput}
                  onChange={(e) => setComplianceInput(e.target.value)}
                  placeholder="Describe your business process, data handling, or system for compliance review... e.g., 'Customer data collection via web forms stored in cloud database'"
                  className="h-60 bg-stone-800/50 border-stone-700/50 text-stone-200"
                />
                <Button 
                  onClick={handleComplianceCheck}
                  disabled={isLoading || !complianceInput.trim()}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                  Run Compliance Check
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-stone-900/80 border-stone-800/50">
              <CardHeader>
                <CardTitle className="text-white">Compliance Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 overflow-y-auto bg-stone-800/30 rounded-lg p-4 text-stone-300 text-sm whitespace-pre-wrap">
                  {toolResult || "Your compliance report will appear here..."}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Risk Analysis Tab */}
        <TabsContent value="risk">
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-stone-900/80 border-stone-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  AI Risk Analyzer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={riskInput}
                  onChange={(e) => setRiskInput(e.target.value)}
                  placeholder="Describe the situation for risk analysis... e.g., 'New vendor contract with 3-year commitment and exclusive territory rights'"
                  className="h-60 bg-stone-800/50 border-stone-700/50 text-stone-200"
                />
                <Button 
                  onClick={handleRiskAnalysis}
                  disabled={isLoading || !riskInput.trim()}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <AlertTriangle className="w-4 h-4 mr-2" />}
                  Analyze Risks
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-stone-900/80 border-stone-800/50">
              <CardHeader>
                <CardTitle className="text-white">Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 overflow-y-auto bg-stone-800/30 rounded-lg p-4 text-stone-300 text-sm whitespace-pre-wrap">
                  {toolResult || "Your risk assessment will appear here..."}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Clause Suggest Tab */}
        <TabsContent value="clauses">
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-stone-900/80 border-stone-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-blue-400" />
                  AI Clause Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={clauseInput}
                  onChange={(e) => setClauseInput(e.target.value)}
                  placeholder="Describe what you need clauses for... e.g., 'Intellectual property protection for software development contract'"
                  className="h-60 bg-stone-800/50 border-stone-700/50 text-stone-200"
                />
                <Button 
                  onClick={handleClauseSuggest}
                  disabled={isLoading || !clauseInput.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lightbulb className="w-4 h-4 mr-2" />}
                  Get Clause Suggestions
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-stone-900/80 border-stone-800/50">
              <CardHeader>
                <CardTitle className="text-white">Suggested Clauses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 overflow-y-auto bg-stone-800/30 rounded-lg p-4 text-stone-300 text-sm whitespace-pre-wrap">
                  {toolResult || "AI clause suggestions will appear here..."}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* NDA Review Tab */}
        <TabsContent value="nda">
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-stone-900/80 border-stone-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-cyan-400" />
                  AI NDA Review
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={ndaInput}
                  onChange={(e) => setNdaInput(e.target.value)}
                  placeholder="Paste NDA text here for AI review..."
                  className="h-60 bg-stone-800/50 border-stone-700/50 text-stone-200"
                />
                <Button 
                  onClick={handleNDAReview}
                  disabled={isLoading || !ndaInput.trim()}
                  className="w-full bg-cyan-600 hover:bg-cyan-700"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Gavel className="w-4 h-4 mr-2" />}
                  Review NDA
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-stone-900/80 border-stone-800/50">
              <CardHeader>
                <CardTitle className="text-white">NDA Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 overflow-y-auto bg-stone-800/30 rounded-lg p-4 text-stone-300 text-sm whitespace-pre-wrap">
                  {toolResult || "NDA review results will appear here..."}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplianceAIAssistant;

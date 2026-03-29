import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Send,
  MessageSquare,
  Target,
  TrendingUp,
  Shield,
  FileText,
  Heart,
  AlertTriangle,
  RefreshCw,
  Copy,
  Loader2,
  Bot,
  User,
  Calendar,
  DollarSign,
  Users
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClientSuccessAI } from "@/hooks/useClientSuccessAI";
import { toast } from "sonner";

const quickActions = [
  { id: "health", label: "Calculate Health Score", icon: Heart, color: "emerald" },
  { id: "churn", label: "Predict Churn Risk", icon: AlertTriangle, color: "rose" },
  { id: "upsell", label: "Find Upsell Opportunities", icon: TrendingUp, color: "violet" },
  { id: "response", label: "Craft Client Response", icon: MessageSquare, color: "teal" },
  { id: "plan", label: "Create Success Plan", icon: Target, color: "blue" },
  { id: "sentiment", label: "Deep Sentiment Analysis", icon: Sparkles, color: "amber" },
  { id: "escalation", label: "Escalation Guidance", icon: Shield, color: "rose" },
  { id: "renewal", label: "Renewal Strategy", icon: RefreshCw, color: "emerald" }
];

export const AIClientAssistant = () => {
  const [activeAction, setActiveAction] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]);
  const [clientName, setClientName] = useState("");
  const [inputData, setInputData] = useState("");
  const [aiResult, setAiResult] = useState("");

  const { 
    isLoading, 
    chat, 
    calculateHealthScore, 
    predictChurn, 
    identifyUpsell, 
    craftResponse, 
    createSuccessPlan,
    deepSentimentAnalysis,
    getEscalationGuide,
    createRenewalStrategy
  } = useClientSuccessAI();

  const handleChat = async () => {
    if (!chatMessage.trim()) return;
    
    const userMessage = { role: 'user', content: chatMessage };
    setChatHistory(prev => [...prev, userMessage]);
    setChatMessage("");

    const response = await chat(chatMessage);
    if (response) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
    }
  };

  const handleQuickAction = async (actionId: string) => {
    setActiveAction(actionId);
    setAiResult("");

    if (!clientName.trim() && actionId !== 'response') {
      toast.error('Please enter a client name');
      return;
    }

    let result = null;

    switch (actionId) {
      case 'health':
        result = await calculateHealthScore(clientName, 'High', 'Low', 'Good', 'On-time', 'Regular');
        break;
      case 'churn':
        result = await predictChurn(clientName, inputData || 'Normal activity', 'Stable', 'None', '6 months');
        break;
      case 'upsell':
        result = await identifyUpsell(clientName, 'Standard', inputData || 'Regular usage', 'Growing team', 'Technology');
        break;
      case 'response':
        if (!inputData.trim()) {
          toast.error('Please enter the client message to respond to');
          return;
        }
        result = await craftResponse(inputData, 'Support inquiry', 'Professional and empathetic', 'Normal');
        break;
      case 'plan':
        result = await createSuccessPlan(clientName, 'Business', inputData || 'In progress', 'Full adoption', '90 days');
        break;
      case 'sentiment':
        result = await deepSentimentAnalysis(clientName, inputData || 'Recent communications', 'Active account', 'Active');
        break;
      case 'escalation':
        result = await getEscalationGuide(inputData || 'General escalation', clientName, 'Medium', 'Open', 'None');
        break;
      case 'renewal':
        result = await createRenewalStrategy(clientName, '3 months', 'Good', inputData || 'None identified', 'Moderate');
        break;
    }

    if (result) {
      setAiResult(result);
      toast.success('AI analysis complete!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Bot className="w-6 h-6 text-teal-600" />
          AI Client Success Assistant
        </h2>
        <p className="text-slate-500 text-sm mt-1">Your intelligent partner for client success management</p>
      </div>

      <Tabs defaultValue="actions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="actions">
          <div className="grid grid-cols-12 gap-6">
            {/* Quick Actions Grid */}
            <div className="col-span-5 space-y-4">
              <Card className="p-4">
                <h3 className="font-semibold text-slate-800 mb-4">AI-Powered Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action) => (
                    <motion.button
                      key={action.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveAction(action.id)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        activeAction === action.id 
                          ? `bg-${action.color}-50 border-${action.color}-300 ring-2 ring-${action.color}-200` 
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <action.icon className={`w-5 h-5 text-${action.color}-600 mb-2`} />
                      <p className="text-sm font-medium text-slate-800">{action.label}</p>
                    </motion.button>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold text-slate-800 mb-3">Input Parameters</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-slate-600 mb-1 block">Client Name</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Enter client name..."
                      className="w-full p-2 rounded-lg border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600 mb-1 block">Additional Context</label>
                    <textarea
                      value={inputData}
                      onChange={(e) => setInputData(e.target.value)}
                      placeholder="Enter relevant details, client message, or context..."
                      className="w-full h-24 p-2 rounded-lg border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 resize-none"
                    />
                  </div>
                  <Button 
                    onClick={() => handleQuickAction(activeAction)}
                    disabled={isLoading || !activeAction}
                    className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Run AI Analysis
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="col-span-7">
              <Card className="p-6 min-h-[500px] bg-gradient-to-br from-slate-50 to-teal-50/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-teal-600" />
                    <h3 className="font-semibold text-slate-800">AI Results</h3>
                  </div>
                  {aiResult && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(aiResult);
                        toast.success('Copied to clipboard!');
                      }}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                  )}
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center h-80">
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 animate-spin text-teal-600 mx-auto mb-4" />
                      <p className="text-slate-500">AI is analyzing...</p>
                    </div>
                  </div>
                ) : aiResult ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose prose-sm max-w-none"
                  >
                    <div className="p-4 rounded-lg bg-white/70 border border-teal-100">
                      <p className="text-slate-700 whitespace-pre-wrap">{aiResult}</p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-center h-80">
                    <div className="text-center">
                      <Bot className="w-16 h-16 text-teal-200 mx-auto mb-4" />
                      <p className="text-slate-500">Select an action and run AI analysis</p>
                      <p className="text-sm text-slate-400 mt-1">Results will appear here</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="chat">
          <Card className="p-6">
            <div className="h-[500px] flex flex-col">
              {/* Chat Messages */}
              <div className="flex-1 overflow-auto space-y-4 mb-4">
                {chatHistory.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MessageSquare className="w-16 h-16 text-teal-200 mx-auto mb-4" />
                      <p className="text-slate-500">Start a conversation with the AI assistant</p>
                      <p className="text-sm text-slate-400 mt-1">Ask about client success strategies, best practices, or specific client situations</p>
                    </div>
                  </div>
                ) : (
                  chatHistory.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-teal-600" />
                        </div>
                      )}
                      <div className={`max-w-[70%] p-3 rounded-lg ${
                        msg.role === 'user' 
                          ? 'bg-teal-600 text-white' 
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-600" />
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-teal-600" />
                    </div>
                    <div className="bg-slate-100 p-3 rounded-lg">
                      <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                  placeholder="Ask about client success strategies..."
                  className="flex-1 p-3 rounded-lg border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                />
                <Button 
                  onClick={handleChat}
                  disabled={isLoading || !chatMessage.trim()}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Handshake, TrendingUp, DollarSign, Users, Target,
  MessageSquare, Zap, Shield, Star, Award,
  FileText, Send, ThumbsUp, ThumbsDown, BarChart3,
  Lightbulb, ArrowUp, CheckCircle2
} from "lucide-react";

interface Deal {
  id: string;
  client: string;
  product: string;
  value: string;
  stage: "prospecting" | "negotiation" | "proposal" | "closing" | "won" | "lost";
  confidence: number;
  aiAdvice: string;
  lastActivity: string;
}

const DEALS: Deal[] = [
  { id: "1", client: "TechCorp Japan", product: "Enterprise Suite", value: "₹24,50,000", stage: "negotiation", confidence: 78, aiAdvice: "Offer 15% volume discount to close faster. Client is price-sensitive.", lastActivity: "2 hr ago" },
  { id: "2", client: "StartupHub Berlin", product: "Pro License", value: "₹8,40,000", stage: "proposal", confidence: 85, aiAdvice: "Client needs demo of API integration. Schedule within 48 hours.", lastActivity: "4 hr ago" },
  { id: "3", client: "GovTech India", product: "Custom Deployment", value: "₹45,00,000", stage: "closing", confidence: 92, aiAdvice: "All terms agreed. Send final contract with 2% early payment discount.", lastActivity: "1 hr ago" },
  { id: "4", client: "RetailMax Brazil", product: "SaaS Bundle", value: "₹12,60,000", stage: "prospecting", confidence: 45, aiAdvice: "Lead is cold. Send case study of similar retail implementation.", lastActivity: "1 day ago" },
  { id: "5", client: "FinServ Dubai", product: "Security Suite", value: "₹18,90,000", stage: "won", confidence: 100, aiAdvice: "Deal closed successfully. Upsell monitoring addon in 30 days.", lastActivity: "3 hr ago" },
];

const OBJECTION_TEMPLATES = [
  { id: "1", objection: "Your price is too high", response: "I understand budget considerations. Our ROI analysis shows clients recover the investment within 4 months. May I share a case study?", confidence: 94, category: "Pricing" },
  { id: "2", objection: "We're already using a competitor", response: "That's great that you have a solution in place. Many of our clients switched because of our 40% faster deployment and dedicated support. Would a side-by-side comparison be helpful?", confidence: 89, category: "Competition" },
  { id: "3", objection: "We need to think about it", response: "Of course, this is an important decision. To help your evaluation, I can send a detailed proposal with specific ROI projections for your team. When would be a good time to follow up?", confidence: 91, category: "Stalling" },
  { id: "4", objection: "We don't have budget right now", response: "I appreciate your transparency. We offer flexible payment plans and quarterly billing. Also, our starter plan requires significantly lower upfront investment. Shall I outline the options?", confidence: 86, category: "Budget" },
];

const SALES_SCRIPTS = [
  { id: "1", title: "Cold Outreach — Enterprise", tone: "Professional", words: 250, use: "Email/LinkedIn" },
  { id: "2", title: "Demo Follow-up", tone: "Warm", words: 180, use: "Email" },
  { id: "3", title: "Price Negotiation Close", tone: "Confident", words: 120, use: "Call Script" },
  { id: "4", title: "Upsell — Existing Client", tone: "Friendly", words: 200, use: "Email" },
  { id: "5", title: "Re-engagement — Lost Deal", tone: "Empathetic", words: 160, use: "Email" },
];

const AIRASalesIntelligence = () => {
  const totalPipeline = DEALS.filter(d => d.stage !== "won" && d.stage !== "lost")
    .reduce((s, d) => s + parseInt(d.value.replace(/[₹,]/g, "")), 0);
  const wonDeals = DEALS.filter(d => d.stage === "won").length;

  const stageStyle = (s: string) => {
    const styles: Record<string, string> = {
      prospecting: "bg-slate-500/20 text-slate-400 border-slate-500/30",
      negotiation: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      proposal: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      closing: "bg-violet-500/20 text-violet-400 border-violet-500/30",
      won: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      lost: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return styles[s] || styles.prospecting;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 flex items-center justify-center shadow-xl shadow-amber-500/20">
            <Handshake className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Sales Intelligence</h1>
            <p className="text-amber-400/80">AI Negotiation • Deal Pipeline • Objection Handling • Scripts</p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Active Pipeline", value: `₹${(totalPipeline / 100000).toFixed(1)}L`, icon: DollarSign, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Deals Won", value: wonDeals, icon: Award, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Avg Confidence", value: `${Math.round(DEALS.reduce((s, d) => s + d.confidence, 0) / DEALS.length)}%`, icon: Target, color: "text-cyan-400", bg: "bg-cyan-500/10" },
          { label: "AI Recommendations", value: DEALS.length, icon: Lightbulb, color: "text-violet-400", bg: "bg-violet-500/10" },
        ].map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${m.bg} flex items-center justify-center`}>
                  <m.icon className={`w-5 h-5 ${m.color}`} />
                </div>
                <div>
                  <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
                  <p className="text-xs text-slate-400">{m.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="pipeline" className="w-full">
        <TabsList className="bg-slate-800/50 border border-slate-700/30">
          <TabsTrigger value="pipeline" className="text-xs">Deal Pipeline</TabsTrigger>
          <TabsTrigger value="objections" className="text-xs">Objection Handling</TabsTrigger>
          <TabsTrigger value="scripts" className="text-xs">Sales Scripts</TabsTrigger>
        </TabsList>

        {/* Pipeline */}
        <TabsContent value="pipeline">
          <ScrollArea className="h-[420px]">
            <div className="space-y-3">
              {DEALS.map((deal, i) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="bg-slate-900/50 border-slate-700/50 hover:border-amber-500/20 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-sm font-semibold text-white">{deal.client}</h4>
                          <p className="text-xs text-slate-400">{deal.product}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-amber-400">{deal.value}</span>
                          <Badge className={stageStyle(deal.stage)}>{deal.stage}</Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <Progress value={deal.confidence} className="h-1.5 flex-1" />
                        <span className="text-xs font-medium text-cyan-400">{deal.confidence}% confidence</span>
                        <span className="text-xs text-slate-500">{deal.lastActivity}</span>
                      </div>

                      {/* AI Advice */}
                      <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-amber-300">{deal.aiAdvice}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Objection Handling */}
        <TabsContent value="objections">
          <ScrollArea className="h-[420px]">
            <div className="space-y-4">
              {OBJECTION_TEMPLATES.map((obj, i) => (
                <motion.div
                  key={obj.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="bg-slate-900/50 border-slate-700/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-red-500/20 text-red-400 text-xs">{obj.category}</Badge>
                        <div className="flex items-center gap-2">
                          <Progress value={obj.confidence} className="h-1 w-16" />
                          <span className="text-xs text-cyan-400">{obj.confidence}%</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                          <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Customer Objection</p>
                          <p className="text-sm text-red-300 font-medium">"{obj.objection}"</p>
                        </div>
                        <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                          <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">AIRA Recommended Response</p>
                          <p className="text-sm text-emerald-300">"{obj.response}"</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <Button size="sm" variant="ghost" className="h-7 px-3 text-xs text-emerald-400 hover:bg-emerald-500/10">
                          <ThumbsUp className="w-3 h-3 mr-1" /> Use This
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 px-3 text-xs text-cyan-400 hover:bg-cyan-500/10">
                          <Send className="w-3 h-3 mr-1" /> Copy
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Sales Scripts */}
        <TabsContent value="scripts">
          <div className="space-y-3">
            {SALES_SCRIPTS.map((script, i) => (
              <motion.div
                key={script.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700/20 hover:border-amber-500/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{script.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-slate-700/50 text-slate-300 text-[10px]">{script.tone}</Badge>
                      <span className="text-xs text-slate-500">{script.words} words</span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-slate-500">{script.use}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" className="h-7 px-3 text-xs text-amber-400 hover:bg-amber-500/10">
                    <Zap className="w-3 h-3 mr-1" /> Generate
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 px-3 text-xs text-cyan-400 hover:bg-cyan-500/10">
                    <Send className="w-3 h-3 mr-1" /> Use
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Sales Notice */}
      <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <div className="flex items-center gap-3">
          <Handshake className="w-5 h-5 text-amber-400" />
          <p className="text-sm text-amber-400/80">
            <strong>AIRA Sales:</strong> All negotiation advice follows professional and respectful communication standards. Responses are confident, polite, and persuasive — never aggressive or misleading.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIRASalesIntelligence;

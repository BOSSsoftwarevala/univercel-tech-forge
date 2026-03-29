import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, PenLine, DollarSign, TrendingUp, Loader2, Copy, Check, RefreshCw, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Campaign {
  name: string;
  budget: number;
  spent: number;
  leads: number;
  ctr: number;
  region: string;
  channel: string;
}

const AICampaignOptimizer = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ad-copy");
  const [copied, setCopied] = useState(false);
  
  // Ad Copy State
  const [product, setProduct] = useState("Software Vala Premium Suite");
  const [targetAudience, setTargetAudience] = useState("Business owners and entrepreneurs");
  const [tone, setTone] = useState("Professional and engaging");
  const [adCopyResult, setAdCopyResult] = useState<any>(null);
  
  // Budget Suggestion State
  const [selectedCampaign] = useState<Campaign>({
    name: "Summer Product Launch",
    budget: 50000,
    spent: 32400,
    leads: 428,
    ctr: 5.2,
    region: "India",
    channel: "Social Media"
  });
  const [budgetResult, setBudgetResult] = useState<any>(null);
  
  // Conversion Prediction State
  const [conversionResult, setConversionResult] = useState<any>(null);

  const handleGenerate = async (type: 'ad_copy' | 'budget_suggestion' | 'conversion_prediction') => {
    setIsLoading(true);
    
    try {
      const payload: any = { type };
      
      if (type === 'ad_copy') {
        payload.product = product;
        payload.targetAudience = targetAudience;
        payload.tone = tone;
        payload.campaign = selectedCampaign;
      } else {
        payload.campaign = selectedCampaign;
      }

      const { data, error } = await supabase.functions.invoke('campaign-optimizer', {
        body: payload
      });

      if (error) throw error;

      if (type === 'ad_copy') {
        setAdCopyResult(data.result);
      } else if (type === 'budget_suggestion') {
        setBudgetResult(data.result);
      } else {
        setConversionResult(data.result);
      }

      toast({
        title: "AI Analysis Complete",
        description: `${type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} generated successfully!`,
      });
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate AI insights. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied to clipboard!" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-teal-100 flex items-center gap-2">
          <Brain className="w-6 h-6 text-teal-400" />
          AI Campaign Optimizer
        </h2>
        <Badge className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-300 border-teal-500/40">
          <Sparkles className="w-3 h-3 mr-1" />
          Powered by AI
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-800/50 border border-slate-700/50 grid grid-cols-3">
          <TabsTrigger value="ad-copy" className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-300">
            <PenLine className="w-4 h-4 mr-2" />
            Ad Copy
          </TabsTrigger>
          <TabsTrigger value="budget" className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-300">
            <DollarSign className="w-4 h-4 mr-2" />
            Budget AI
          </TabsTrigger>
          <TabsTrigger value="conversion" className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-300">
            <TrendingUp className="w-4 h-4 mr-2" />
            Predictions
          </TabsTrigger>
        </TabsList>

        {/* Ad Copy Generator */}
        <TabsContent value="ad-copy" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 border-teal-500/20">
              <CardHeader>
                <CardTitle className="text-teal-100 text-lg">Generate Ad Copy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Product/Service</label>
                  <Input
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-slate-200"
                    placeholder="Enter product name..."
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Target Audience</label>
                  <Input
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-slate-200"
                    placeholder="Who is this for..."
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Tone</label>
                  <Input
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-slate-200"
                    placeholder="Professional, casual, urgent..."
                  />
                </div>
                <Button 
                  onClick={() => handleGenerate('ad_copy')}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-600"
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
                  ) : (
                    <><Sparkles className="w-4 h-4 mr-2" /> Generate Ad Copy</>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-teal-500/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-teal-100 text-lg">Generated Copy</CardTitle>
                {adCopyResult && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => copyToClipboard(JSON.stringify(adCopyResult, null, 2))}
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {adCopyResult ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="p-4 rounded-lg bg-gradient-to-r from-teal-500/10 to-cyan-500/5 border border-teal-500/20">
                        <p className="text-xs text-slate-500 mb-1">Headline</p>
                        <p className="text-lg font-bold text-teal-200">{adCopyResult.headline}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        <p className="text-xs text-slate-500 mb-1">Description</p>
                        <p className="text-slate-200">{adCopyResult.description}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <p className="text-xs text-slate-500 mb-1">Call to Action</p>
                        <p className="text-emerald-400 font-semibold">{adCopyResult.callToAction}</p>
                      </div>
                      {adCopyResult.variations && (
                        <div className="space-y-2">
                          <p className="text-xs text-slate-500">Alternative Headlines</p>
                          {adCopyResult.variations.map((v: string, i: number) => (
                            <Badge key={i} variant="outline" className="mr-2 text-slate-300 border-slate-600">
                              {v}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-slate-500">
                      <div className="text-center">
                        <PenLine className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <p>Generated copy will appear here</p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Budget Suggestion */}
        <TabsContent value="budget" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 border-teal-500/20">
              <CardHeader>
                <CardTitle className="text-teal-100 text-lg">Campaign Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <h4 className="font-semibold text-slate-200 mb-3">{selectedCampaign.name}</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-slate-500">Budget</p>
                      <p className="text-white font-medium">₹{selectedCampaign.budget.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Spent</p>
                      <p className="text-amber-400 font-medium">₹{selectedCampaign.spent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Leads</p>
                      <p className="text-emerald-400 font-medium">{selectedCampaign.leads}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">CTR</p>
                      <p className="text-cyan-400 font-medium">{selectedCampaign.ctr}%</p>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleGenerate('budget_suggestion')}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-600"
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
                  ) : (
                    <><Zap className="w-4 h-4 mr-2" /> Get AI Budget Recommendation</>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-teal-500/20">
              <CardHeader>
                <CardTitle className="text-teal-100 text-lg">AI Recommendation</CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {budgetResult ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/20">
                        <p className="text-xs text-slate-500 mb-1">Recommended Budget</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-emerald-400">
                            ₹{budgetResult.recommendedBudget?.toLocaleString() || 'N/A'}
                          </span>
                          <Badge className="bg-emerald-500/20 text-emerald-400">
                            {budgetResult.change || '+0%'}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        <p className="text-sm text-slate-200">{budgetResult.reasoning}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-center">
                          <p className="text-2xl font-bold text-cyan-400">{budgetResult.expectedLeads}</p>
                          <p className="text-xs text-slate-500">Expected Leads</p>
                        </div>
                        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                          <p className="text-2xl font-bold text-amber-400">{budgetResult.expectedROI}%</p>
                          <p className="text-xs text-slate-500">Expected ROI</p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-slate-500">
                      <div className="text-center">
                        <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <p>Budget recommendation will appear here</p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Conversion Prediction */}
        <TabsContent value="conversion" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 border-teal-500/20">
              <CardHeader>
                <CardTitle className="text-teal-100 text-lg">Predict Conversions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <h4 className="font-semibold text-slate-200 mb-2">{selectedCampaign.name}</h4>
                  <p className="text-sm text-slate-400">
                    Analyze current performance metrics to predict future conversion rates and identify optimization opportunities.
                  </p>
                </div>
                <Button 
                  onClick={() => handleGenerate('conversion_prediction')}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-600"
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Predicting...</>
                  ) : (
                    <><TrendingUp className="w-4 h-4 mr-2" /> Predict Conversions</>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-teal-500/20">
              <CardHeader>
                <CardTitle className="text-teal-100 text-lg">AI Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {conversionResult ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 rounded-lg bg-gradient-to-r from-teal-500/10 to-cyan-500/5 border border-teal-500/20 text-center">
                          <p className="text-3xl font-bold text-teal-400">{conversionResult.predictedConversionRate}</p>
                          <p className="text-xs text-slate-500">Predicted CVR</p>
                        </div>
                        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                          <p className="text-3xl font-bold text-emerald-400">{conversionResult.predictedLeads}</p>
                          <p className="text-xs text-slate-500">Leads (7 days)</p>
                        </div>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        <p className="text-xs text-slate-500 mb-2">Optimization Tips</p>
                        <ul className="space-y-1">
                          {conversionResult.optimizationTips?.map((tip: string, i: number) => (
                            <li key={i} className="text-sm text-slate-200 flex items-start gap-2">
                              <Sparkles className="w-3 h-3 text-teal-400 mt-1 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {conversionResult.riskFactors && (
                        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                          <p className="text-xs text-slate-500 mb-2">Risk Factors</p>
                          <ul className="space-y-1">
                            {conversionResult.riskFactors.map((risk: string, i: number) => (
                              <li key={i} className="text-sm text-amber-300">{risk}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-slate-500">
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <p>Predictions will appear here</p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AICampaignOptimizer;

import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Sparkles, FileText, CheckCircle, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const AIRequirementInterpreter = () => {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleInterpret = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setResult({
        features: [
          { name: "User Authentication System", complexity: "medium", time: "3 days" },
          { name: "Dashboard Analytics Module", complexity: "high", time: "5 days" },
          { name: "Real-time Notifications", complexity: "medium", time: "2 days" },
          { name: "API Integration Layer", complexity: "high", time: "4 days" },
        ],
        risks: [
          "Third-party API dependency may affect timeline",
          "Real-time features require additional infrastructure",
        ],
        totalEstimate: "14 days",
        confidence: 85,
      });
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-amber-100">AI Requirement Interpreter</h2>
        <p className="text-stone-400">Convert plain language into technical specifications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-stone-900/50 border-amber-500/20">
          <CardHeader>
            <CardTitle className="text-amber-100 flex items-center gap-2">
              <Brain className="w-5 h-5 text-amber-400" />
              Describe Your Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe what you want to build in plain language...

Example: 'I need a web application where users can sign up, create projects, and collaborate with team members in real-time. It should have a dashboard showing analytics and send email notifications for important updates.'"
              className="min-h-[200px] bg-stone-800 border-stone-700 text-stone-100 placeholder:text-stone-500"
            />
            <Button
              onClick={handleInterpret}
              disabled={!input || isProcessing}
              className="w-full mt-4 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-900 hover:from-amber-400 hover:to-amber-500"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Interpret Requirements
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-stone-900/50 border-amber-500/20">
          <CardHeader>
            <CardTitle className="text-amber-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              Technical Specification
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <span className="text-amber-300">AI Confidence</span>
                  <span className="text-amber-100 font-bold">{result.confidence}%</span>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-stone-400 mb-2">Identified Features</h4>
                  <div className="space-y-2">
                    {result.features.map((feature: any, index: number) => (
                      <motion.div
                        key={feature.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-stone-800/50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span className="text-amber-100">{feature.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            feature.complexity === "high" 
                              ? "bg-red-500/20 text-red-300" 
                              : "bg-amber-500/20 text-amber-300"
                          }>
                            {feature.complexity}
                          </Badge>
                          <span className="text-stone-400 text-sm">{feature.time}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-stone-400 mb-2">Risk Factors</h4>
                  {result.risks.map((risk: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 p-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
                      <span className="text-stone-300">{risk}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-amber-500/10 border border-emerald-500/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-300">Total Estimated Time</span>
                    <span className="text-2xl font-bold text-emerald-400">{result.totalEstimate}</span>
                  </div>
                </div>

                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Create Project from Spec
                </Button>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-stone-500">
                <Brain className="w-12 h-12 mb-4 opacity-50" />
                <p>Enter your requirements to generate specifications</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIRequirementInterpreter;

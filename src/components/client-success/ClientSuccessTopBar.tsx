import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Heart, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  MessageSquare, 
  FileText, 
  Search,
  Sparkles,
  Users,
  Activity,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { ROLES } from "@/config/roles";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

interface ClientSuccessTopBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userName?: string;
}

export const ClientSuccessTopBar = ({ activeTab, onTabChange, userName = "Manager" }: ClientSuccessTopBarProps) => {
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAILoading, setIsAILoading] = useState(false);

  const tabs = [
    { id: "health", label: "Health", icon: Heart },
    { id: "kyc", label: "KYC", icon: FileText },
    { id: "interview", label: "Auto Interview", icon: Users },
    { id: "ai-assistant", label: "AI Assistant", icon: Sparkles },
    { id: "insights", label: "Insights", icon: Activity },
    { id: "onboarding", label: "Onboarding", icon: Users },
    { id: "sentiment", label: "Sentiment", icon: Activity },
    { id: "escalation", label: "Escalation", icon: AlertTriangle },
    { id: "churn", label: "Churn", icon: TrendingUp },
    { id: "nps", label: "NPS", icon: Sparkles },
  ];

  const handleAIEmpathyEngine = async () => {
    if (!aiQuery.trim()) {
      toast.error('Please enter a message to analyze');
      return;
    }

    setIsAILoading(true);
    setAiResponse("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-empathy-engine`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            message: aiQuery,
            context: 'client_success'
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          toast.error('Rate limit exceeded. Please try again later.');
          return;
        }
        if (response.status === 402) {
          toast.error('AI credits exhausted. Please add more credits.');
          return;
        }
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      setAiResponse(data.response || data.message || 'No response generated');
      toast.success('AI response generated!');
    } catch (error) {
      console.error('AI Empathy Engine error:', error);
      toast.error('Failed to generate empathetic response. Please try again.');
    } finally {
      setIsAILoading(false);
    }
  };

  return (
    <>
      <div className="border-b border-teal-200/50 bg-white/70 backdrop-blur-xl">
        {/* Main Top Bar */}
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Left: Welcome & Stats */}
          <div className="flex items-center gap-4">
            {/* Welcome Message */}
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="w-6 h-6 text-teal-600" />
              </motion.div>
              <div>
                <p className="text-sm text-slate-600">Welcome back,</p>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-800">{userName}</p>
                  <RoleBadge role={ROLES.CLIENT_SUCCESS_MANAGER} size="sm" />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 ml-6 pl-6 border-l border-teal-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-teal-700">94%</p>
                <p className="text-xs text-slate-500">Onboarding Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">$2.4M</p>
                <p className="text-xs text-slate-500">Client LTV</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-rose-500">3</p>
                <p className="text-xs text-slate-500">At-Risk Clients</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/50">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-amber-700 font-medium">SLA: 2h 15m avg</span>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search clients, feedback..."
                className="pl-10 w-64 bg-white border-teal-200/50 focus:border-teal-400 text-slate-700 shadow-sm"
              />
            </div>

            <Button 
              onClick={() => setShowAIPanel(true)}
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white gap-2 shadow-lg shadow-teal-500/20"
            >
              <Sparkles className="w-4 h-4" />
              AI Empathy Engine
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 flex items-center gap-2 pb-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isActive 
                    ? "bg-gradient-to-r from-teal-500/10 to-amber-500/10 text-teal-700 border border-teal-300/50" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-amber-500"
                    layoutId="activeTab"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* AI Empathy Engine Dialog */}
      <Dialog open={showAIPanel} onOpenChange={setShowAIPanel}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              AI Empathy Engine
            </DialogTitle>
            <DialogDescription>
              Enter a client message to generate an empathetic, professional response
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Client Message</label>
              <textarea
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Paste the client's message here..."
                className="w-full h-32 p-3 rounded-lg border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 resize-none text-slate-700"
              />
            </div>

            <Button
              onClick={handleAIEmpathyEngine}
              disabled={isAILoading || !aiQuery.trim()}
              className="w-full bg-gradient-to-r from-teal-500 to-amber-500 hover:from-teal-400 hover:to-amber-400"
            >
              {isAILoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Generating Response...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Empathetic Response
                </>
              )}
            </Button>

            {aiResponse && (
              <div className="p-4 rounded-lg bg-gradient-to-r from-teal-50 to-amber-50 border border-teal-200">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span className="text-sm font-semibold text-teal-700">AI Suggested Response</span>
                </div>
                <p className="text-slate-700 whitespace-pre-wrap">{aiResponse}</p>
                <div className="flex gap-2 mt-4">
                  <Button 
                    size="sm" 
                    onClick={() => {
                      navigator.clipboard.writeText(aiResponse);
                      toast.success('Response copied to clipboard!');
                    }}
                    className="bg-teal-500 hover:bg-teal-600"
                  >
                    Copy Response
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowAIPanel(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HeartHandshake, Users, TrendingUp, Brain, MessageSquare,
  Star, AlertTriangle, CheckCircle2, Clock, Heart,
  Smile, Frown, Meh, Sparkles, Zap
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock data for AI-operated Client Success
const clientHealth = [
  { id: 'C001', name: 'TechCorp Industries', health: 92, sentiment: 'positive', riskLevel: 'low', lastContact: '2 hours ago', nps: 9 },
  { id: 'C002', name: 'Global Finance Ltd', health: 67, sentiment: 'neutral', riskLevel: 'medium', lastContact: '1 day ago', nps: 7 },
  { id: 'C003', name: 'Retail Masters', health: 45, sentiment: 'negative', riskLevel: 'high', lastContact: '3 days ago', nps: 4 },
  { id: 'C004', name: 'HealthPlus Corp', health: 88, sentiment: 'positive', riskLevel: 'low', lastContact: '5 hours ago', nps: 8 },
  { id: 'C005', name: 'EduTech Solutions', health: 55, sentiment: 'neutral', riskLevel: 'medium', lastContact: '2 days ago', nps: 6 },
];

const aiSuggestions = [
  { id: 1, client: 'Retail Masters', action: 'Schedule urgent call - churn risk 78%', priority: 'critical', confidence: 94 },
  { id: 2, client: 'Global Finance Ltd', action: 'Send personalized success story', priority: 'high', confidence: 86 },
  { id: 3, client: 'EduTech Solutions', action: 'Offer premium feature trial', priority: 'medium', confidence: 79 },
  { id: 4, client: 'TechCorp Industries', action: 'Request testimonial - high satisfaction', priority: 'low', confidence: 91 },
];

const metrics = {
  totalClients: 247,
  avgHealth: 78,
  churnRisk: 12,
  npsScore: 72,
  aiInterventions: 34,
};

export function ClientSuccessControlModule() {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const getSentimentIcon = (sentiment: string) => {
    if (sentiment === 'positive') return <Smile className="w-4 h-4 text-green-400" />;
    if (sentiment === 'negative') return <Frown className="w-4 h-4 text-red-400" />;
    return <Meh className="w-4 h-4 text-amber-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
            <HeartHandshake className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Client Success Control</h2>
            <p className="text-sm text-rose-300/70">AI-Operated Customer Relationship Management</p>
          </div>
        </div>
        <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30 text-sm px-4 py-2">
          <Brain className="w-4 h-4 mr-2" />
          AI OPERATED
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Total Clients', value: metrics.totalClients, icon: Users, color: 'blue' },
          { label: 'Avg Health', value: `${metrics.avgHealth}%`, icon: Heart, color: 'rose' },
          { label: 'Churn Risk', value: `${metrics.churnRisk}%`, icon: AlertTriangle, color: 'red' },
          { label: 'NPS Score', value: metrics.npsScore, icon: Star, color: 'amber' },
          { label: 'AI Interventions', value: metrics.aiInterventions, icon: Brain, color: 'violet' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={`p-4 bg-gradient-to-br from-${stat.color}-950/50 to-${stat.color}-900/30 border-${stat.color}-500/20`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/50">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Client Health Monitor */}
        <div className="col-span-7">
          <Card className="p-4 bg-black/40 border-rose-500/20 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-rose-300 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Client Health Monitor
              </h3>
              <Badge className="bg-rose-500/10 text-rose-300">
                {clientHealth.length} Clients Tracked
              </Badge>
            </div>

            <div className="space-y-3">
              {clientHealth.map((client, i) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedClient(client.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedClient === client.id 
                      ? 'bg-rose-500/10 border-rose-500/40' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getSentimentIcon(client.sentiment)}
                      <div>
                        <p className="font-medium text-white">{client.name}</p>
                        <p className="text-xs text-white/50">Last contact: {client.lastContact}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`text-xs ${
                        client.riskLevel === 'high' ? 'bg-red-500/20 text-red-300' :
                        client.riskLevel === 'medium' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {client.riskLevel} risk
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400" />
                        <span className="text-xs text-amber-300">NPS: {client.nps}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/40">Health</span>
                    <Progress 
                      value={client.health} 
                      className={`flex-1 h-2 ${
                        client.health >= 70 ? '[&>div]:bg-green-500' :
                        client.health >= 50 ? '[&>div]:bg-amber-500' : '[&>div]:bg-red-500'
                      }`}
                    />
                    <span className={`text-xs font-bold ${
                      client.health >= 70 ? 'text-green-400' :
                      client.health >= 50 ? 'text-amber-400' : 'text-red-400'
                    }`}>{client.health}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* AI Suggestions */}
        <div className="col-span-5">
          <Card className="p-4 bg-gradient-to-br from-pink-950/50 to-rose-950/50 border-pink-500/20 backdrop-blur-xl h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <h3 className="font-bold text-pink-300">AI SUGGESTIONS</h3>
                <p className="text-[10px] text-pink-400/60">Proactive Interventions</p>
              </div>
            </div>

            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {aiSuggestions.map((suggestion, i) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className={`p-3 rounded-lg border ${
                      suggestion.priority === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                      suggestion.priority === 'high' ? 'bg-amber-500/10 border-amber-500/30' :
                      suggestion.priority === 'medium' ? 'bg-blue-500/10 border-blue-500/30' :
                      'bg-green-500/10 border-green-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`text-[10px] ${
                        suggestion.priority === 'critical' ? 'bg-red-500/20 text-red-300' :
                        suggestion.priority === 'high' ? 'bg-amber-500/20 text-amber-300' :
                        suggestion.priority === 'medium' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {suggestion.priority.toUpperCase()}
                      </Badge>
                      <span className="text-[10px] text-white/40">{suggestion.confidence}% confidence</span>
                    </div>
                    <p className="text-xs text-white/60 mb-1">{suggestion.client}</p>
                    <p className="text-xs text-white/80">{suggestion.action}</p>
                    <Button size="sm" className="w-full mt-2 bg-white/10 hover:bg-white/20 text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      Execute Action
                    </Button>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}
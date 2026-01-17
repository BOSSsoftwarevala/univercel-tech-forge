/**
 * AI LEAD SCORING
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Brain, Flame, Thermometer, Snowflake } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const scoringFactors = [
  { factor: 'Source Quality', weight: 25, description: 'Higher score for direct inquiries vs ads' },
  { factor: 'Country Value', weight: 20, description: 'Premium markets score higher' },
  { factor: 'Product Interest', weight: 30, description: 'High-value product interest boosts score' },
  { factor: 'Interaction Level', weight: 25, description: 'Engagement with emails, calls, demos' },
];

const scoreDistribution = [
  { tag: 'Hot', range: '80-100', count: 34, icon: Flame, color: 'text-orange-500', bgColor: 'bg-orange-500/20' },
  { tag: 'Warm', range: '50-79', count: 89, icon: Thermometer, color: 'text-amber-500', bgColor: 'bg-amber-500/20' },
  { tag: 'Cold', range: '0-49', count: 156, icon: Snowflake, color: 'text-blue-500', bgColor: 'bg-blue-500/20' },
];

export const LeadScoring: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-400" />
          AI Lead Scoring
        </h1>
        <p className="text-sm text-muted-foreground">AI-powered lead qualification and scoring</p>
      </div>

      {/* Score Distribution */}
      <div className="grid grid-cols-3 gap-4">
        {scoreDistribution.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.tag}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="bg-card/80 border-border/50">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 rounded-full ${item.bgColor} flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <h3 className="font-bold text-foreground text-lg">{item.tag}</h3>
                  <p className="text-xs text-muted-foreground mb-2">Score: {item.range}</p>
                  <p className="text-2xl font-bold text-foreground">{item.count}</p>
                  <p className="text-xs text-muted-foreground">leads</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Scoring Factors */}
      <Card className="bg-card/80 border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-foreground">AI Scoring Factors</h3>
          </div>
          <div className="space-y-4">
            {scoringFactors.map((factor, idx) => (
              <motion.div
                key={factor.factor}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{factor.factor}</span>
                  <Badge variant="outline">{factor.weight}% weight</Badge>
                </div>
                <Progress value={factor.weight} className="h-2" />
                <p className="text-xs text-muted-foreground">{factor.description}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

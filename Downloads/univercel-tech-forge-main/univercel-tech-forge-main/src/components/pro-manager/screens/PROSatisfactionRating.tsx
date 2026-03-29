/**
 * SATISFACTION & RATING
 * CSAT Score • Feedback Summary • Risk Prediction (AI)
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

const mockRatings = [
  { user: 'PRO-***21', csat: 92, feedback: 'Excellent support, quick resolution', risk: 'low' },
  { user: 'PRO-***45', csat: 78, feedback: 'Good but could be faster', risk: 'medium' },
  { user: 'PRO-***78', csat: 45, feedback: 'Delayed response, issue unresolved', risk: 'high' },
  { user: 'PRO-***92', csat: 88, feedback: 'Very helpful, great experience', risk: 'low' },
];

export const PROSatisfactionRating: React.FC = () => {
  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low': return <Badge className="bg-green-500/20 text-green-500"><TrendingUp className="h-3 w-3 mr-1" />Low Risk</Badge>;
      case 'medium': return <Badge className="bg-amber-500/20 text-amber-500"><AlertTriangle className="h-3 w-3 mr-1" />Medium Risk</Badge>;
      case 'high': return <Badge className="bg-red-500/20 text-red-500"><TrendingDown className="h-3 w-3 mr-1" />High Risk</Badge>;
      default: return <Badge>{risk}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Satisfaction & Rating</h1>
        <p className="text-muted-foreground">Customer satisfaction scores and AI risk prediction</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-green-500/50">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-foreground">4.2/5</p>
            <p className="text-xs text-muted-foreground">Average CSAT Score</p>
          </CardContent>
        </Card>
        <Card className="border-blue-500/50">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-foreground">156</p>
            <p className="text-xs text-muted-foreground">Total Responses</p>
          </CardContent>
        </Card>
        <Card className="border-amber-500/50">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-foreground">12</p>
            <p className="text-xs text-muted-foreground">At-Risk Users</p>
          </CardContent>
        </Card>
        <Card className="border-purple-500/50">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-foreground">89%</p>
            <p className="text-xs text-muted-foreground">AI Prediction Accuracy</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">User Satisfaction Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRatings.map((rating, idx) => (
              <div key={idx} className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-amber-500" />
                    <span className="font-mono text-sm text-foreground">{rating.user}</span>
                    {getRiskBadge(rating.risk)}
                  </div>
                  <span className="text-lg font-bold text-foreground">{rating.csat}%</span>
                </div>
                <Progress value={rating.csat} className={rating.csat >= 80 ? 'bg-green-500' : rating.csat >= 60 ? 'bg-amber-500' : 'bg-red-500'} />
                <p className="text-sm text-muted-foreground mt-2">"{rating.feedback}"</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PROSatisfactionRating;

import React from 'react';
import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
export const AIUsagePanel: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold flex items-center gap-2"><BarChart3 className="w-6 h-6 text-primary" />AI Usage Today</h1>
    <Card className="bg-card/50 border-border/50"><CardContent className="p-6 text-center"><p className="text-4xl font-bold">89%</p><p className="text-muted-foreground">Daily quota used</p></CardContent></Card>
  </div>
);

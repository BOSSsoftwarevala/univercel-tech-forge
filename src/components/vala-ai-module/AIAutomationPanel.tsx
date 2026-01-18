import React from 'react';
import { Cog } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
export const AIAutomationPanel: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold flex items-center gap-2"><Cog className="w-6 h-6 text-primary" />AI Automation Jobs</h1>
    <Card className="bg-card/50 border-border/50"><CardContent className="p-6 text-center"><p className="text-4xl font-bold">28</p><p className="text-muted-foreground">Active automation jobs</p></CardContent></Card>
  </div>
);

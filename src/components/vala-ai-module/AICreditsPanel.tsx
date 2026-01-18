import React from 'react';
import { Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
export const AICreditsPanel: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold flex items-center gap-2"><Wallet className="w-6 h-6 text-primary" />AI Credits Balance</h1>
    <Card className="bg-card/50 border-border/50"><CardContent className="p-6 text-center"><p className="text-4xl font-bold text-emerald-500">$2,450</p><p className="text-muted-foreground">Available credits</p></CardContent></Card>
  </div>
);

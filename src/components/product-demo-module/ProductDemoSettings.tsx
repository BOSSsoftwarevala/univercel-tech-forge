/**
 * PRODUCT DEMO SETTINGS
 */
import React from 'react';
import { Settings, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const ProductDemoSettings: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-xl font-bold flex items-center gap-2"><Settings className="w-5 h-5 text-violet-400" />Settings</h1>
      <p className="text-sm text-muted-foreground">Product & Demo configuration</p>
    </div>
    <Card className="bg-card/80 border-border/50">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
          <span>Demo source code access</span>
          <Badge variant="outline" className="gap-1"><Lock className="w-3 h-3" />Locked</Badge>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
          <span>Domain restriction</span>
          <Badge className="bg-emerald-500/20 text-emerald-400">Enabled</Badge>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
          <span>License enforcement</span>
          <Badge className="bg-emerald-500/20 text-emerald-400">Enabled</Badge>
        </div>
      </CardContent>
    </Card>
  </div>
);

/**
 * PRICING MANAGEMENT
 */
import React from 'react';
import { DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const PricingManagement: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-xl font-bold flex items-center gap-2"><DollarSign className="w-5 h-5 text-violet-400" />Pricing Management</h1>
      <p className="text-sm text-muted-foreground">Configure product pricing and commissions</p>
    </div>
    <Card className="bg-card/80 border-border/50"><CardContent className="p-6"><p className="text-muted-foreground">Pricing configuration coming soon.</p></CardContent></Card>
  </div>
);

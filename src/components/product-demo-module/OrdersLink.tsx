/**
 * ORDERS LINK
 */
import React from 'react';
import { ShoppingCart, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const OrdersLink: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-xl font-bold flex items-center gap-2"><ShoppingCart className="w-5 h-5 text-violet-400" />Orders Connection</h1>
      <p className="text-sm text-muted-foreground">View orders linked to products</p>
    </div>
    <Card className="bg-card/80 border-border/50">
      <CardContent className="p-6">
        <Button className="gap-2"><ExternalLink className="w-4 h-4" />Open Orders Dashboard</Button>
      </CardContent>
    </Card>
  </div>
);

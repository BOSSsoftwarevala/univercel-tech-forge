import React from 'react';
import { Megaphone, Target, TrendingUp, Sparkles, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function FUMarketingScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-primary" />
            Marketing & SEO
          </h1>
          <p className="text-muted-foreground">AI handles everything. You just see results.</p>
        </div>
        <Badge className="bg-emerald-500 text-lg px-4 py-2">
          <Sparkles className="h-4 w-4 mr-2" />
          AI Active
        </Badge>
      </div>

      {/* One Big Button */}
      <Card className="bg-gradient-to-r from-primary/20 to-purple-500/20 border-primary/30">
        <CardContent className="p-8 text-center">
          <Sparkles className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">AI Marketing is Running</h2>
          <p className="text-muted-foreground mb-6">
            Our AI automatically manages SEO, Meta Ads, and Local Ads for you.
          </p>
          <Button size="lg" className="text-lg px-8 py-6">
            <Play className="h-6 w-6 mr-2" />
            Start Marketing
          </Button>
        </CardContent>
      </Card>

      {/* Simple Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50">
          <CardContent className="p-6 text-center">
            <Target className="h-10 w-10 mx-auto mb-3 text-blue-500" />
            <p className="text-3xl font-bold">48</p>
            <p className="text-sm text-muted-foreground">Leads from Marketing</p>
            <Badge className="mt-2 bg-emerald-500">+12 today</Badge>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-10 w-10 mx-auto mb-3 text-emerald-500" />
            <p className="text-3xl font-bold">#5</p>
            <p className="text-sm text-muted-foreground">Google Ranking</p>
            <Badge className="mt-2 bg-emerald-500">+3 positions</Badge>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-6 text-center">
            <Megaphone className="h-10 w-10 mx-auto mb-3 text-purple-500" />
            <p className="text-3xl font-bold">3</p>
            <p className="text-sm text-muted-foreground">Ads Running</p>
            <Badge className="mt-2 bg-blue-500">AI Optimized</Badge>
          </CardContent>
        </Card>
      </div>

      {/* What AI Does */}
      <Card className="bg-card/50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4">What AI Does For You:</h3>
          <div className="space-y-3">
            {[
              'SEO - Makes your business visible on Google',
              'Meta Ads - Runs ads on Facebook & Instagram',
              'Local Ads - Targets customers in your area',
              'Auto Optimization - Improves ads automatically',
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

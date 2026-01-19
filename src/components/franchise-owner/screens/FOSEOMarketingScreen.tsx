/**
 * SEO & MARKETING SCREEN
 * Campaigns, Local SEO, Keywords, Territory, AI-Managed
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Target,
  MapPin,
  TrendingUp,
  Pause,
  Play,
  Bot,
  DollarSign,
  Eye,
  BarChart3,
} from 'lucide-react';

const campaigns = [
  {
    id: 'C-001',
    name: 'School Software - North Region',
    type: 'SEO',
    status: 'active',
    budget: 500,
    spent: 320,
    leads: 12,
    keywords: ['school management', 'education software'],
  },
  {
    id: 'C-002',
    name: 'CRM Solutions - Local',
    type: 'Local SEO',
    status: 'active',
    budget: 300,
    spent: 180,
    leads: 8,
    keywords: ['crm software', 'business crm'],
  },
  {
    id: 'C-003',
    name: 'ERP Enterprise',
    type: 'SEO',
    status: 'paused',
    budget: 800,
    spent: 450,
    leads: 15,
    keywords: ['erp system', 'enterprise software'],
  },
];

const localSEO = [
  { territory: 'North Region', ranking: 3, visibility: 78, reviews: 45 },
  { territory: 'East Region', ranking: 5, visibility: 65, reviews: 32 },
  { territory: 'West Region', ranking: 2, visibility: 85, reviews: 58 },
];

export function FOSEOMarketingScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SEO & Marketing</h1>
          <p className="text-muted-foreground">AI-managed campaigns and local SEO</p>
        </div>
        <Badge className="gap-1 bg-primary/20 text-primary">
          <Bot className="h-3 w-3" />
          AI Managed
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active Campaigns</p>
              <p className="text-xl font-bold">2</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Leads</p>
              <p className="text-xl font-bold">35</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Spent</p>
              <p className="text-xl font-bold">$950</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Search className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Keywords Tracked</p>
              <p className="text-xl font-bold">24</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="local">Local SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-lg">{campaign.name}</span>
                      <Badge variant="outline">{campaign.type}</Badge>
                      <Badge
                        className={
                          campaign.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {campaign.keywords.map((kw) => (
                        <Badge key={kw} variant="secondary" className="text-xs">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {campaign.status === 'active' ? (
                      <Button variant="outline" size="sm" className="gap-1">
                        <Pause className="h-3 w-3" />
                        Pause
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="gap-1">
                        <Play className="h-3 w-3" />
                        Start
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="gap-1">
                      <BarChart3 className="h-3 w-3" />
                      Stats
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="font-semibold">${campaign.budget}</p>
                    <Progress value={(campaign.spent / campaign.budget) * 100} className="h-1 mt-2" />
                    <p className="text-xs text-muted-foreground mt-1">${campaign.spent} spent</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Leads Generated</p>
                    <p className="font-semibold text-emerald-400">{campaign.leads}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Cost per Lead</p>
                    <p className="font-semibold">${(campaign.spent / campaign.leads).toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="local" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {localSEO.map((area) => (
              <Card key={area.territory} className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{area.territory}</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Local Ranking</span>
                      <Badge className="bg-primary/20 text-primary">#{area.ranking}</Badge>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Visibility</span>
                        <span className="font-medium">{area.visibility}%</span>
                      </div>
                      <Progress value={area.visibility} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Reviews</span>
                      <span className="font-medium">{area.reviews}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FOSEOMarketingScreen;

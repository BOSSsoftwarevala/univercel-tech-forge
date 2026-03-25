import React from 'react';
import { Megaphone, Facebook, Search, MapPin, Star, Play, Square, Sparkles, Wallet, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const adPlatforms = [
  { id: 1, name: 'Meta Ads', icon: Facebook, active: 3, budget: '₹15,000', status: 'Running' },
  { id: 2, name: 'Google Ads', icon: Search, active: 2, budget: '₹12,000', status: 'Running' },
  { id: 3, name: 'Local Ads', icon: MapPin, active: 1, budget: '₹5,000', status: 'Paused' },
  { id: 4, name: 'Influencer Boost', icon: Star, active: 2, budget: '₹8,000', status: 'Running' },
];

const campaigns = [
  { id: 1, name: 'Mumbai Lead Gen', platform: 'Meta', budget: '₹5,000', duration: '7 days', leads: 28, status: 'Active' },
  { id: 2, name: 'Pune Awareness', platform: 'Google', budget: '₹4,000', duration: '14 days', leads: 15, status: 'Active' },
  { id: 3, name: 'Local Business', platform: 'Local', budget: '₹2,000', duration: '30 days', leads: 8, status: 'Paused' },
];

export function FOAdsScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-primary" />
            Ads Manager (AI)
          </h1>
          <p className="text-muted-foreground">Meta + Google + Local + Influencer • AI Handles Targeting</p>
        </div>
        <Badge className="bg-emerald-500">
          <Sparkles className="h-3 w-3 mr-1" />
          AI Optimizing
        </Badge>
      </div>

      {/* Ad Platforms */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {adPlatforms.map((platform) => (
          <Card key={platform.id} className="bg-card/50 hover:border-primary/30 transition-all cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <platform.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">{platform.name}</span>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold">{platform.active} Active</p>
                <p className="text-sm text-muted-foreground">Budget: {platform.budget}</p>
                <Badge variant={platform.status === 'Running' ? 'default' : 'secondary'}>
                  {platform.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campaign Settings */}
      <Card className="bg-card/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Country:</span>
              <Badge variant="outline">India</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Budget:</span>
              <Badge variant="outline">₹40,000</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Duration:</span>
              <Badge variant="outline">This Month</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">Active Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Megaphone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{campaign.name}</p>
                    <p className="text-sm text-muted-foreground">{campaign.platform} • {campaign.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm">{campaign.budget}</span>
                  <span className="text-sm text-emerald-500">{campaign.leads} leads</span>
                  <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>
                    {campaign.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      {campaign.status === 'Active' ? (
                        <><Square className="h-4 w-4 mr-1" /> Stop</>
                      ) : (
                        <><Play className="h-4 w-4 mr-1" /> Start</>
                      )}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Sparkles className="h-4 w-4 mr-1" />
                      Auto Optimize
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button>
          <Play className="h-4 w-4 mr-2" />
          Start Campaign
        </Button>
        <Button variant="outline">
          <Square className="h-4 w-4 mr-2" />
          Stop Campaign
        </Button>
        <Button variant="outline">
          <Sparkles className="h-4 w-4 mr-2" />
          Auto Optimize
        </Button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Image, Calendar, TrendingUp, Target, Share2, Bot, Globe, Play, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const campaigns = [
  { id: 1, name: 'Diwali POS Offer', status: 'active', reach: '45K', clicks: 1234, conversions: 23, budget: '₹15,000' },
  { id: 2, name: 'School ERP Launch', status: 'scheduled', reach: '—', clicks: 0, conversions: 0, budget: '₹25,000' },
  { id: 3, name: 'Restaurant Week', status: 'completed', reach: '32K', clicks: 892, conversions: 15, budget: '₹10,000' },
];

const creatives = [
  { id: 1, name: 'POS Banner Hindi', type: 'image', size: '1080x1080', language: 'Hindi' },
  { id: 2, name: 'School ERP Video', type: 'video', size: '1920x1080', language: 'Marathi' },
  { id: 3, name: 'CRM Poster English', type: 'image', size: '1200x628', language: 'English' },
  { id: 4, name: 'Hospital Reel', type: 'video', size: '1080x1920', language: 'Hindi' },
];

const scheduledPosts = [
  { id: 1, platform: 'Facebook', content: 'New POS features...', time: 'Today 6:00 PM' },
  { id: 2, platform: 'Instagram', content: 'School management made easy...', time: 'Tomorrow 10:00 AM' },
  { id: 3, platform: 'WhatsApp', content: 'Exclusive Diwali offer...', time: 'Tomorrow 2:00 PM' },
];

export const LocalMarketingSuite = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-mono font-bold text-foreground">Local Marketing Suite</h2>
          <p className="text-sm text-muted-foreground">Regional ads and social campaigns</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-neon-teal text-background">
          <Megaphone className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="bg-secondary/30">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="creatives">Creatives</TabsTrigger>
          <TabsTrigger value="scheduler">Scheduler</TabsTrigger>
          <TabsTrigger value="ai-targeting">AI Targeting</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="glass-panel border-border/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Total Reach</span>
                </div>
                <p className="text-2xl font-mono font-bold text-foreground">77K</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-border/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-neon-green" />
                  <span className="text-sm text-muted-foreground">Conversions</span>
                </div>
                <p className="text-2xl font-mono font-bold text-foreground">38</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-border/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-neon-orange" />
                  <span className="text-sm text-muted-foreground">CTR</span>
                </div>
                <p className="text-2xl font-mono font-bold text-foreground">2.8%</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-border/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-neon-purple" />
                  <span className="text-sm text-muted-foreground">Budget Spent</span>
                </div>
                <p className="text-2xl font-mono font-bold text-foreground">₹50K</p>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-panel border-border/30">
            <CardHeader>
              <CardTitle className="text-foreground">Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {campaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-secondary/20 border border-border/30"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">{campaign.name}</span>
                        <Badge variant={
                          campaign.status === 'active' ? 'default' : 
                          campaign.status === 'scheduled' ? 'secondary' : 'outline'
                        }>
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Reach: {campaign.reach}</span>
                        <span>Clicks: {campaign.clicks}</span>
                        <span>Conversions: {campaign.conversions}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-primary">{campaign.budget}</p>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        View Details
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creatives" className="space-y-4">
          <Card className="glass-panel border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Image className="w-5 h-5 text-primary" />
                Localized Promo Creatives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {creatives.map((creative, index) => (
                  <motion.div
                    key={creative.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-secondary/20 border border-border/30 hover:border-primary/30 transition-all cursor-pointer"
                  >
                    <div className="w-full h-32 rounded-lg bg-gradient-to-br from-primary/20 to-neon-teal/20 flex items-center justify-center mb-3">
                      {creative.type === 'video' ? (
                        <Play className="w-8 h-8 text-primary" />
                      ) : (
                        <Image className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    <p className="font-medium text-foreground text-sm mb-1">{creative.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{creative.language}</Badge>
                      <span className="text-xs text-muted-foreground">{creative.size}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduler" className="space-y-4">
          <Card className="glass-panel border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Calendar className="w-5 h-5 text-primary" />
                Social Post Scheduler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {scheduledPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-secondary/20 border border-border/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Share2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{post.platform}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{post.content}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{post.time}</p>
                      <Button variant="ghost" size="sm" className="text-neon-red">Cancel</Button>
                    </div>
                  </div>
                </motion.div>
              ))}
              <Button className="w-full" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule New Post
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-targeting" className="space-y-4">
          <Card className="glass-panel border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Bot className="w-5 h-5 text-primary" />
                AI Trend-Based Targeting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
                <p className="text-sm text-foreground mb-2">
                  <strong>AI Recommendation:</strong> Based on current trends, focus on School ERP campaigns in Pune region. 
                  Education sector searches up 45% this month.
                </p>
                <Button size="sm" className="bg-primary text-background">
                  Apply Recommendation
                </Button>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-secondary/20">
                  <p className="text-sm font-medium text-foreground">Top Trending</p>
                  <p className="text-lg font-mono text-primary">School ERP</p>
                  <p className="text-xs text-neon-green">↑ 45% searches</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/20">
                  <p className="text-sm font-medium text-foreground">Best Time</p>
                  <p className="text-lg font-mono text-primary">6-9 PM</p>
                  <p className="text-xs text-muted-foreground">Peak engagement</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/20">
                  <p className="text-sm font-medium text-foreground">Target Region</p>
                  <p className="text-lg font-mono text-primary">Pune East</p>
                  <p className="text-xs text-muted-foreground">Highest ROI</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

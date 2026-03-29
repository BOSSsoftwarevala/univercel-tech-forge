import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, TrendingUp, DollarSign, Eye, Share2, Heart,
  Link, BarChart3, Calendar, Award, Target, Video
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

// Mock data
const performanceMetrics = [
  { label: 'Total Reach', value: '2.4M', change: '+18%', icon: Eye, color: 'text-blue-500' },
  { label: 'Engagement Rate', value: '4.8%', change: '+0.6%', icon: Heart, color: 'text-pink-500' },
  { label: 'Conversions', value: '1,247', change: '+32%', icon: Target, color: 'text-green-500' },
  { label: 'Earnings', value: '$12,450', change: '+24%', icon: DollarSign, color: 'text-amber-500' },
];

const activeCampaigns = [
  { id: 1, name: 'Summer Collection Launch', brand: 'FashionCo', status: 'active', progress: 65, deadline: '2024-02-15', payout: '$2,500' },
  { id: 2, name: 'Tech Product Review', brand: 'GadgetPro', status: 'pending', progress: 0, deadline: '2024-02-20', payout: '$1,800' },
  { id: 3, name: 'Wellness Campaign', brand: 'HealthyLife', status: 'active', progress: 40, deadline: '2024-02-25', payout: '$3,200' },
  { id: 4, name: 'Food & Recipe Series', brand: 'TastyBites', status: 'completed', progress: 100, deadline: '2024-02-10', payout: '$1,500' },
];

const contentPerformance = [
  { id: 1, title: 'Product Unboxing Video', platform: 'YouTube', views: '125K', engagement: '8.2%', posted: '2 days ago' },
  { id: 2, title: 'Summer Outfit Ideas', platform: 'Instagram', views: '89K', engagement: '5.4%', posted: '3 days ago' },
  { id: 3, title: 'Morning Routine Tips', platform: 'TikTok', views: '342K', engagement: '12.1%', posted: '5 days ago' },
  { id: 4, title: 'Tech Review Thread', platform: 'Twitter', views: '45K', engagement: '3.8%', posted: '1 week ago' },
];

const affiliateLinks = [
  { id: 1, product: 'Wireless Headphones', clicks: 2450, conversions: 186, earnings: '$1,116', rate: '7.6%' },
  { id: 2, product: 'Fitness Tracker', clicks: 1890, conversions: 142, earnings: '$852', rate: '7.5%' },
  { id: 3, product: 'Skincare Set', clicks: 3200, conversions: 256, earnings: '$1,280', rate: '8.0%' },
  { id: 4, product: 'Protein Powder', clicks: 1450, conversions: 98, earnings: '$490', rate: '6.8%' },
];

const upcomingDeadlines = [
  { task: 'Submit draft for FashionCo', date: 'Tomorrow', priority: 'high' },
  { task: 'Record video for GadgetPro', date: 'In 3 days', priority: 'medium' },
  { task: 'Post Instagram Reel', date: 'In 5 days', priority: 'low' },
  { task: 'Monthly analytics report', date: 'In 1 week', priority: 'medium' },
];

export function InfluencerScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Influencer Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your campaigns, content performance, and earnings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Link className="h-4 w-4 mr-2" />
            Generate Link
          </Button>
          <Button>
            <Video className="h-4 w-4 mr-2" />
            New Content
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="text-2xl font-bold mt-1">{metric.value}</p>
                    <Badge variant="secondary" className="mt-2 text-green-600">
                      {metric.change}
                    </Badge>
                  </div>
                  <div className={`p-3 rounded-full bg-muted ${metric.color}`}>
                    <metric.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Campaigns */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Active Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeCampaigns.map((campaign) => (
                <div key={campaign.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{campaign.name}</h4>
                      <p className="text-sm text-muted-foreground">{campaign.brand}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        campaign.status === 'active' ? 'default' :
                        campaign.status === 'completed' ? 'secondary' : 'outline'
                      }>
                        {campaign.status}
                      </Badge>
                      <p className="text-sm font-medium mt-1">{campaign.payout}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{campaign.progress}%</span>
                    </div>
                    <Progress value={campaign.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">Deadline: {campaign.deadline}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    deadline.priority === 'high' ? 'bg-red-500' :
                    deadline.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{deadline.task}</p>
                    <p className="text-xs text-muted-foreground">{deadline.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Content Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contentPerformance.map((content) => (
                <div key={content.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{content.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{content.platform}</Badge>
                      <span className="text-xs text-muted-foreground">{content.posted}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{content.views} views</p>
                    <p className="text-sm text-green-600">{content.engagement} engagement</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Affiliate Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Affiliate Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {affiliateLinks.map((link) => (
                <div key={link.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{link.product}</h4>
                    <Badge variant="secondary">{link.rate} CVR</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-lg font-bold">{link.clicks.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Clicks</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">{link.conversions}</p>
                      <p className="text-xs text-muted-foreground">Sales</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600">{link.earnings}</p>
                      <p className="text-xs text-muted-foreground">Earned</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-500/20">
                <Award className="h-8 w-8 text-purple-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Rising Star Achievement Unlocked!</h3>
                <p className="text-muted-foreground">You've reached 2M total reach. Keep up the great work!</p>
              </div>
              <Button variant="outline">View All Badges</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

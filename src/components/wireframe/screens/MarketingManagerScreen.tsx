import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Megaphone, 
  TrendingUp, 
  Mail, 
  Target, 
  BarChart3,
  Calendar,
  Users,
  DollarSign,
  Eye,
  MousePointer,
  Share2,
  FileText
} from 'lucide-react';

// Mock data
const campaignMetrics = {
  activeCampaigns: 8,
  totalReach: '2.4M',
  avgEngagement: '4.2%',
  monthlyBudget: '$45,000',
  budgetUsed: 67
};

const activeCampaigns = [
  { id: 1, name: 'Summer Sale 2024', type: 'Email + Social', status: 'active', reach: '450K', engagement: '5.2%', budget: '$8,000', spent: '$5,200' },
  { id: 2, name: 'Product Launch - Pro Plan', type: 'Multi-channel', status: 'active', reach: '320K', engagement: '3.8%', budget: '$12,000', spent: '$7,800' },
  { id: 3, name: 'Brand Awareness Q2', type: 'Social Media', status: 'active', reach: '890K', engagement: '4.5%', budget: '$15,000', spent: '$9,100' },
  { id: 4, name: 'Referral Program Push', type: 'Email', status: 'scheduled', reach: '0', engagement: '0%', budget: '$5,000', spent: '$0' },
  { id: 5, name: 'Holiday Prep Campaign', type: 'Display Ads', status: 'draft', reach: '0', engagement: '0%', budget: '$10,000', spent: '$0' }
];

const emailMetrics = [
  { name: 'Newsletter - Dec 2024', sent: 45000, opened: 18500, clicked: 4200, openRate: '41.1%', clickRate: '9.3%' },
  { name: 'Product Update', sent: 38000, opened: 14800, clicked: 3100, openRate: '38.9%', clickRate: '8.2%' },
  { name: 'Welcome Series #1', sent: 5200, opened: 3640, clicked: 1820, openRate: '70.0%', clickRate: '35.0%' },
  { name: 'Re-engagement', sent: 12000, opened: 2400, clicked: 480, openRate: '20.0%', clickRate: '4.0%' }
];

const socialChannels = [
  { platform: 'LinkedIn', followers: '45.2K', growth: '+2.3%', engagement: '4.8%', posts: 24 },
  { platform: 'Twitter/X', followers: '28.1K', growth: '+1.1%', engagement: '2.9%', posts: 89 },
  { platform: 'Instagram', followers: '62.5K', growth: '+4.5%', engagement: '6.2%', posts: 45 },
  { platform: 'Facebook', followers: '38.9K', growth: '-0.2%', engagement: '1.8%', posts: 32 }
];

const contentCalendar = [
  { date: 'Dec 23', type: 'Blog', title: 'Year in Review 2024', status: 'scheduled', channel: 'Website' },
  { date: 'Dec 24', type: 'Social', title: 'Holiday Greetings', status: 'scheduled', channel: 'All Platforms' },
  { date: 'Dec 26', type: 'Email', title: 'Boxing Day Sale', status: 'draft', channel: 'Email List' },
  { date: 'Dec 28', type: 'Video', title: 'Customer Success Story', status: 'in-production', channel: 'YouTube' },
  { date: 'Jan 2', type: 'Blog', title: '2025 Trends Report', status: 'writing', channel: 'Website' }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500/20 text-green-400';
    case 'scheduled': return 'bg-blue-500/20 text-blue-400';
    case 'draft': return 'bg-muted text-muted-foreground';
    case 'in-production': return 'bg-yellow-500/20 text-yellow-400';
    case 'writing': return 'bg-purple-500/20 text-purple-400';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Blog': return 'bg-blue-500/20 text-blue-400';
    case 'Social': return 'bg-pink-500/20 text-pink-400';
    case 'Email': return 'bg-green-500/20 text-green-400';
    case 'Video': return 'bg-red-500/20 text-red-400';
    default: return 'bg-muted text-muted-foreground';
  }
};

export function MarketingManagerScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketing Manager</h1>
          <p className="text-muted-foreground">Campaign management & analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Reports
          </Button>
          <Button>
            <Megaphone className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Megaphone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{campaignMetrics.activeCampaigns}</p>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Eye className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{campaignMetrics.totalReach}</p>
                <p className="text-sm text-muted-foreground">Total Reach</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <MousePointer className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{campaignMetrics.avgEngagement}</p>
                <p className="text-sm text-muted-foreground">Avg Engagement</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{campaignMetrics.monthlyBudget}</p>
                <p className="text-sm text-muted-foreground">Monthly Budget</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Budget Used</span>
                <span className="font-medium">{campaignMetrics.budgetUsed}%</span>
              </div>
              <Progress value={campaignMetrics.budgetUsed} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeCampaigns.map((campaign) => (
                <div key={campaign.id} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-sm text-muted-foreground">{campaign.type}</p>
                    </div>
                    <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Reach</p>
                      <p className="font-medium">{campaign.reach}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Engagement</p>
                      <p className="font-medium">{campaign.engagement}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Budget</p>
                      <p className="font-medium">{campaign.budget}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Spent</p>
                      <p className="font-medium">{campaign.spent}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Email Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emailMetrics.map((email, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg">
                  <p className="font-medium mb-2">{email.name}</p>
                  <div className="grid grid-cols-5 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Sent</p>
                      <p className="font-medium">{email.sent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Opened</p>
                      <p className="font-medium">{email.opened.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Clicked</p>
                      <p className="font-medium">{email.clicked.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Open Rate</p>
                      <p className="font-medium text-green-400">{email.openRate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Click Rate</p>
                      <p className="font-medium text-blue-400">{email.clickRate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Social Media Channels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Social Media Channels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {socialChannels.map((channel, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">{channel.platform}</p>
                    <p className="text-sm text-muted-foreground">{channel.posts} posts this month</p>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-right">
                      <p className="text-muted-foreground">Followers</p>
                      <p className="font-medium">{channel.followers}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Growth</p>
                      <p className={`font-medium ${channel.growth.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                        {channel.growth}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Engagement</p>
                      <p className="font-medium">{channel.engagement}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Content Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contentCalendar.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-center min-w-[50px]">
                      <p className="text-sm font-medium">{item.date}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getTypeColor(item.type)} variant="secondary">
                          {item.type}
                        </Badge>
                        <p className="font-medium">{item.title}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.channel}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

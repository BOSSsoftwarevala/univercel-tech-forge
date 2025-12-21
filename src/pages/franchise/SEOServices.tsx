import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Search, TrendingUp, Globe, BarChart3, Target, 
  FileText, Link2, Share2, Eye, ArrowUp, ArrowDown 
} from 'lucide-react';

const SEOServices = () => {
  const [selectedKeyword, setSelectedKeyword] = useState('');

  const keywords = [
    { keyword: 'software development india', position: 3, change: 2, volume: 12400, difficulty: 45 },
    { keyword: 'custom app development', position: 7, change: -1, volume: 8200, difficulty: 52 },
    { keyword: 'web development company', position: 12, change: 5, volume: 22100, difficulty: 68 },
    { keyword: 'mobile app developers', position: 5, change: 0, volume: 15600, difficulty: 55 },
    { keyword: 'erp software solutions', position: 8, change: 3, volume: 6800, difficulty: 42 },
  ];

  const campaigns = [
    { name: 'Q4 Lead Generation', status: 'active', leads: 156, conversions: 23, budget: '₹45,000' },
    { name: 'Brand Awareness', status: 'active', leads: 89, conversions: 12, budget: '₹30,000' },
    { name: 'Product Launch', status: 'paused', leads: 45, conversions: 8, budget: '₹25,000' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">SEO Services</h1>
          <p className="text-slate-400 mt-1">Manage your search visibility and marketing campaigns</p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500">
          <Target className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-indigo-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Domain Authority</p>
                <p className="text-2xl font-bold text-white">42</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Globe className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-emerald-400 text-sm">
              <ArrowUp className="w-3 h-3" />
              +3 this month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-indigo-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Organic Traffic</p>
                <p className="text-2xl font-bold text-white">24.5K</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-emerald-400 text-sm">
              <ArrowUp className="w-3 h-3" />
              +18% vs last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-indigo-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Keywords Ranking</p>
                <p className="text-2xl font-bold text-white">156</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Search className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-emerald-400 text-sm">
              <ArrowUp className="w-3 h-3" />
              +12 new rankings
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-indigo-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Backlinks</p>
                <p className="text-2xl font-bold text-white">892</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Link2 className="w-5 h-5 text-orange-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-emerald-400 text-sm">
              <ArrowUp className="w-3 h-3" />
              +45 this week
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="keywords" className="space-y-4">
        <TabsList className="bg-slate-800/50 border border-indigo-500/20">
          <TabsTrigger value="keywords">Keyword Rankings</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="keywords">
          <Card className="bg-slate-800/50 border-indigo-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Keyword Rankings</CardTitle>
                  <CardDescription>Track your search engine positions</CardDescription>
                </div>
                <Input 
                  placeholder="Search keywords..." 
                  className="w-64 bg-slate-900/50 border-indigo-500/30"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {keywords.map((kw, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                        #{kw.position}
                      </div>
                      <div>
                        <p className="text-white font-medium">{kw.keyword}</p>
                        <p className="text-slate-400 text-sm">Volume: {kw.volume.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-1 ${kw.change > 0 ? 'text-emerald-400' : kw.change < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                        {kw.change > 0 ? <ArrowUp className="w-3 h-3" /> : kw.change < 0 ? <ArrowDown className="w-3 h-3" /> : null}
                        {kw.change !== 0 && Math.abs(kw.change)}
                      </div>
                      <Badge variant="outline" className="border-indigo-500/30 text-indigo-300">
                        Difficulty: {kw.difficulty}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card className="bg-slate-800/50 border-indigo-500/20">
            <CardHeader>
              <CardTitle className="text-white">Marketing Campaigns</CardTitle>
              <CardDescription>Manage your active marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {campaigns.map((campaign, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-indigo-500/10"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{campaign.name}</p>
                        <p className="text-slate-400 text-sm">Budget: {campaign.budget}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-white font-bold">{campaign.leads}</p>
                        <p className="text-slate-400 text-xs">Leads</p>
                      </div>
                      <div className="text-center">
                        <p className="text-emerald-400 font-bold">{campaign.conversions}</p>
                        <p className="text-slate-400 text-xs">Conversions</p>
                      </div>
                      <Badge className={campaign.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}>
                        {campaign.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card className="bg-slate-800/50 border-indigo-500/20">
            <CardHeader>
              <CardTitle className="text-white">Content Management</CardTitle>
              <CardDescription>Create and manage SEO-optimized content</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <p className="text-slate-400">Content management features coming soon</p>
              <Button variant="outline" className="mt-4 border-indigo-500/30 text-indigo-300">
                Request Early Access
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="bg-slate-800/50 border-indigo-500/20">
            <CardHeader>
              <CardTitle className="text-white">SEO Analytics</CardTitle>
              <CardDescription>Detailed performance analytics</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <p className="text-slate-400">Advanced analytics dashboard coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SEOServices;

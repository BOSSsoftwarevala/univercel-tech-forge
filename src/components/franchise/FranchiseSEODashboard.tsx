import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, TrendingUp, Globe, BarChart3, Target, 
  FileText, Link2, Share2, Eye, ArrowUp, ArrowDown,
  Sparkles, MapPin, Bot, Calendar, Megaphone
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSEOAutomation } from '@/hooks/useSEOAutomation';
import { toast } from 'sonner';

const FranchiseSEODashboard = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [topic, setTopic] = useState('');
  const [region, setRegion] = useState('');
  
  const { generateSocialPost, generateReelsScript, generateMetaTags, generateContentPlan, isLoading } = useSEOAutomation();

  const keywords = [
    { keyword: 'software development pune', position: 3, change: 2, volume: 8400, difficulty: 45 },
    { keyword: 'custom app development mumbai', position: 7, change: -1, volume: 6200, difficulty: 52 },
    { keyword: 'erp software maharashtra', position: 5, change: 3, volume: 4100, difficulty: 38 },
    { keyword: 'pos system ahmedabad', position: 8, change: 5, volume: 3200, difficulty: 42 },
    { keyword: 'school management software india', position: 4, change: 0, volume: 12600, difficulty: 55 },
  ];

  const handleGenerateSocialPost = async () => {
    if (!topic) {
      toast.error('Please enter a topic');
      return;
    }
    setIsGenerating(true);
    const result = await generateSocialPost({
      topic,
      brand: 'Software Vala',
      tone: 'Professional yet engaging',
      audience: 'Business owners',
      cta: 'Book a demo today',
      region: region || 'India'
    });
    if (result) {
      setGeneratedContent({ type: 'social', data: result });
      toast.success('Social posts generated!');
    }
    setIsGenerating(false);
  };

  const handleGenerateReelsScript = async () => {
    if (!topic) {
      toast.error('Please enter a topic');
      return;
    }
    setIsGenerating(true);
    const result = await generateReelsScript({
      topic,
      style: 'Educational with humor',
      duration: '30 seconds',
      brand: 'Software Vala',
      goal: 'Drive engagement and followers',
      platform: 'Instagram Reels'
    });
    if (result) {
      setGeneratedContent({ type: 'reels', data: result });
      toast.success('Reels script generated!');
    }
    setIsGenerating(false);
  };

  const handleGenerateContentPlan = async () => {
    setIsGenerating(true);
    const result = await generateContentPlan({
      business: 'Software Vala Franchise',
      goals: 'Increase local brand awareness and generate leads',
      platforms: ['Instagram', 'Facebook', 'LinkedIn', 'WhatsApp'],
      industry: 'Technology / Software',
      region: region || 'Maharashtra',
      duration: '1 week'
    });
    if (result) {
      setGeneratedContent({ type: 'plan', data: result });
      toast.success('Content plan generated!');
    }
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-mono font-bold text-foreground flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" />
            SEO & Location Promotions
          </h2>
          <p className="text-sm text-muted-foreground">AI-powered local SEO and promotional content</p>
        </div>
        <Badge className="bg-primary/20 text-primary border-primary/30 px-3 py-1">
          <Sparkles className="w-3 h-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Local Rankings', value: '156', icon: Search, color: 'indigo', trend: '+12' },
          { label: 'Organic Traffic', value: '24.5K', icon: TrendingUp, color: 'emerald', trend: '+18%' },
          { label: 'Regional Reach', value: '45K', icon: MapPin, color: 'purple', trend: '+25%' },
          { label: 'Backlinks', value: '892', icon: Link2, color: 'amber', trend: '+45' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass-panel border-border/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                  <span className="text-xs text-neon-green flex items-center">
                    <ArrowUp className="w-3 h-3 mr-0.5" />
                    {stat.trend}
                  </span>
                </div>
                <p className="text-2xl font-mono font-bold text-foreground mt-2">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="keywords" className="space-y-4">
        <TabsList className="bg-secondary/30">
          <TabsTrigger value="keywords">Local Keywords</TabsTrigger>
          <TabsTrigger value="ai-content">AI Content Gen</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Keywords Tab */}
        <TabsContent value="keywords">
          <Card className="glass-panel border-border/30">
            <CardHeader>
              <CardTitle className="text-foreground">Regional Keyword Rankings</CardTitle>
              <CardDescription>Track your local search positions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {keywords.map((kw, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      #{kw.position}
                    </div>
                    <div>
                      <p className="text-foreground font-medium">{kw.keyword}</p>
                      <p className="text-muted-foreground text-xs">Volume: {kw.volume.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center text-sm ${kw.change > 0 ? 'text-neon-green' : kw.change < 0 ? 'text-neon-red' : 'text-muted-foreground'}`}>
                      {kw.change > 0 ? <ArrowUp className="w-3 h-3" /> : kw.change < 0 ? <ArrowDown className="w-3 h-3" /> : null}
                      {kw.change !== 0 && Math.abs(kw.change)}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      Difficulty: {kw.difficulty}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Content Generation Tab */}
        <TabsContent value="ai-content" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="glass-panel border-border/30">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary" />
                  AI Content Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Topic / Product</label>
                  <Input 
                    placeholder="e.g., School ERP software, POS system"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="bg-secondary/30 border-border/50"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Target Region</label>
                  <Input 
                    placeholder="e.g., Pune, Mumbai, Maharashtra"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="bg-secondary/30 border-border/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={handleGenerateSocialPost} 
                    disabled={isLoading || isGenerating}
                    className="bg-gradient-to-r from-pink-500 to-violet-500"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Social Posts
                  </Button>
                  <Button 
                    onClick={handleGenerateReelsScript} 
                    disabled={isLoading || isGenerating}
                    className="bg-gradient-to-r from-orange-500 to-red-500"
                  >
                    <Megaphone className="w-4 h-4 mr-2" />
                    Reels Script
                  </Button>
                </div>
                <Button 
                  onClick={handleGenerateContentPlan} 
                  disabled={isLoading || isGenerating}
                  variant="outline"
                  className="w-full"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Generate Weekly Content Plan
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-panel border-border/30">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Generated Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isGenerating || isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-3 text-muted-foreground">Generating with AI...</span>
                  </div>
                ) : generatedContent ? (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    <Badge className="bg-primary/20 text-primary">
                      {generatedContent.type === 'social' ? 'Social Posts' : 
                       generatedContent.type === 'reels' ? 'Reels Script' : 'Content Plan'}
                    </Badge>
                    <pre className="text-xs text-muted-foreground bg-secondary/30 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(generatedContent.data, null, 2)}
                    </pre>
                    <Button size="sm" variant="outline" onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(generatedContent.data, null, 2));
                      toast.success('Copied to clipboard!');
                    }}>
                      Copy Content
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Bot className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Enter a topic and click generate</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI Recommendations */}
          <Card className="glass-panel border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">AI Recommendation for Your Region</h4>
                  <p className="text-sm text-muted-foreground">
                    Based on local trends, focus on <span className="text-primary font-medium">School ERP</span> campaigns 
                    in your territory. Education sector searches are up <span className="text-neon-green">45%</span> this month. 
                    Best posting time: <span className="text-primary">6-9 PM IST</span>.
                  </p>
                  <Button size="sm" className="mt-3 bg-primary/20 text-primary hover:bg-primary/30">
                    Apply Recommendation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns">
          <Card className="glass-panel border-border/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Regional Campaigns</CardTitle>
                <Button size="sm" className="bg-primary">
                  <Target className="w-4 h-4 mr-2" />
                  New Campaign
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Diwali POS Offer - Pune', status: 'active', reach: '45K', conversions: 23, budget: '₹15,000' },
                { name: 'School ERP - Maharashtra', status: 'active', reach: '32K', conversions: 18, budget: '₹25,000' },
                { name: 'Restaurant Week - Mumbai', status: 'completed', reach: '28K', conversions: 15, budget: '₹10,000' },
              ].map((campaign, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-border/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-neon-teal flex items-center justify-center">
                      <Megaphone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{campaign.name}</p>
                      <p className="text-xs text-muted-foreground">Budget: {campaign.budget}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-foreground font-bold">{campaign.reach}</p>
                      <p className="text-xs text-muted-foreground">Reach</p>
                    </div>
                    <div className="text-center">
                      <p className="text-neon-green font-bold">{campaign.conversions}</p>
                      <p className="text-xs text-muted-foreground">Conversions</p>
                    </div>
                    <Badge className={campaign.status === 'active' ? 'bg-neon-green/20 text-neon-green' : 'bg-muted text-muted-foreground'}>
                      {campaign.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card className="glass-panel border-border/30">
            <CardHeader>
              <CardTitle className="text-foreground">Regional Analytics</CardTitle>
              <CardDescription>Performance insights for your territory</CardDescription>
            </CardHeader>
            <CardContent className="py-12 text-center">
              <BarChart3 className="w-16 h-16 text-primary/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Detailed regional analytics coming soon</p>
              <p className="text-xs text-muted-foreground mt-2">Track engagement, conversions, and ROI by location</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FranchiseSEODashboard;
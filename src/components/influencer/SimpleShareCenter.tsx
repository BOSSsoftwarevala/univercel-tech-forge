import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Link2, Copy, Check, Share2, QrCode, ExternalLink,
  MousePointer, TrendingUp, Users, DollarSign, Eye,
  Send, MessageCircle, Instagram, Twitter, Facebook,
  Smartphone, Globe, Clock, CheckCircle2, Sparkles,
  Youtube, Play, Award, Target, Zap, Star, Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';

interface SharedLink {
  id: string;
  url: string;
  shortUrl: string;
  product: string;
  clicks: number;
  conversions: number;
  earnings: number;
  createdAt: Date;
  lastClickAt: Date | null;
}

// YouTube & Meta Earning Rules
const platformRules = {
  youtube: {
    basic: {
      name: 'YouTube Basic (Fan Funding)',
      subscribers: 500,
      watchHours: 3000,
      shortsViews: 3000000,
      uploads: 3,
      features: ['Channel Memberships', 'Super Chat', 'Super Thanks', 'Shopping']
    },
    full: {
      name: 'YouTube Full (Ad Revenue)',
      subscribers: 1000,
      watchHours: 4000,
      shortsViews: 10000000,
      features: ['All Basic Features', 'Ad Revenue Share', 'YouTube Premium Revenue']
    }
  },
  meta: {
    facebook: {
      name: 'Facebook Content Monetization',
      followers: 10000,
      watchMinutes: 600000,
      activeVideos: 5,
      features: ['In-stream Ads', 'Reels Ads', 'Performance Bonus', 'Stars']
    },
    instagram: {
      name: 'Instagram Creator',
      followers: 500,
      features: ['Reels Ads', 'Gifts', 'Subscriptions', 'Badges']
    }
  }
};

const SimpleShareCenter = () => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'share' | 'rules'>('share');

  // User's current stats (simulated)
  const [userStats] = useState({
    youtubeSubscribers: 750,
    youtubeWatchHours: 2800,
    youtubeShortsViews: 1500000,
    facebookFollowers: 8500,
    facebookWatchMinutes: 450000,
    instagramFollowers: 2500
  });

  // Live click counter
  const [liveClicks, setLiveClicks] = useState(1234);
  const [todayEarnings, setTodayEarnings] = useState(4520);

  // Shared links history
  const [sharedLinks] = useState<SharedLink[]>([
    {
      id: '1',
      url: 'https://softwarevala.com/pos-system',
      shortUrl: 'https://sv.link/abc123',
      product: 'POS System',
      clicks: 456,
      conversions: 23,
      earnings: 3450,
      createdAt: new Date(Date.now() - 86400000),
      lastClickAt: new Date(Date.now() - 300000)
    },
    {
      id: '2',
      url: 'https://softwarevala.com/school-erp',
      shortUrl: 'https://sv.link/def456',
      product: 'School ERP',
      clicks: 289,
      conversions: 15,
      earnings: 2250,
      createdAt: new Date(Date.now() - 172800000),
      lastClickAt: new Date(Date.now() - 600000)
    },
    {
      id: '3',
      url: 'https://softwarevala.com/hospital-crm',
      shortUrl: 'https://sv.link/ghi789',
      product: 'Hospital CRM',
      clicks: 178,
      conversions: 8,
      earnings: 1440,
      createdAt: new Date(Date.now() - 259200000),
      lastClickAt: new Date(Date.now() - 1200000)
    },
  ]);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setLiveClicks(prev => prev + 1);
        toast.success('New click detected!', {
          description: 'Someone clicked your link',
          duration: 2000
        });
      }
      if (Math.random() > 0.9) {
        setTodayEarnings(prev => prev + Math.floor(Math.random() * 150));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerateLink = () => {
    if (!websiteUrl.trim()) {
      toast.error('Please enter a URL first');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const shortCode = Math.random().toString(36).substring(2, 8);
      setGeneratedLink(`https://sv.link/${shortCode}`);
      setIsGenerating(false);
      toast.success('Link created successfully!');
    }, 1000);
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const shareUrl = generatedLink || 'https://sv.link/demo';
    const text = 'Check out this amazing software!';
    
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      instagram: shareUrl,
    };

    if (platform === 'instagram') {
      handleCopyLink(shareUrl);
      toast.info('Link copied! Paste it in Instagram');
    } else {
      window.open(urls[platform], '_blank');
    }
  };

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return 'Never';
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header with Live Stats */}
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500">
              <Share2 className="w-8 h-8 text-white" />
            </div>
            Share & Earn
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Share your link → Users click → You earn money!</p>
        </div>

        {/* Live Stats Ticker */}
        <div className="flex gap-4">
          <motion.div
            animate={{ boxShadow: ['0 0 20px rgba(16, 185, 129, 0.2)', '0 0 40px rgba(16, 185, 129, 0.4)', '0 0 20px rgba(16, 185, 129, 0.2)'] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3"
          >
            <MousePointer className="w-6 h-6 text-emerald-400" />
            <div>
              <p className="text-xs text-emerald-400">Total Clicks</p>
              <motion.p 
                key={liveClicks}
                initial={{ scale: 1.2, color: '#34d399' }}
                animate={{ scale: 1, color: '#ffffff' }}
                className="text-2xl font-bold"
              >
                {liveClicks.toLocaleString()}
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            animate={{ boxShadow: ['0 0 20px rgba(139, 92, 246, 0.2)', '0 0 40px rgba(139, 92, 246, 0.4)', '0 0 20px rgba(139, 92, 246, 0.2)'] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="px-6 py-3 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center gap-3"
          >
            <DollarSign className="w-6 h-6 text-violet-400" />
            <div>
              <p className="text-xs text-violet-400">Today's Earnings</p>
              <motion.p 
                key={todayEarnings}
                initial={{ scale: 1.2, color: '#a78bfa' }}
                animate={{ scale: 1, color: '#ffffff' }}
                className="text-2xl font-bold"
              >
                ₹{todayEarnings.toLocaleString()}
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl w-fit">
        <Button
          variant={activeTab === 'share' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('share')}
          className={activeTab === 'share' ? 'bg-violet-500 text-white' : 'text-slate-400'}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Links
        </Button>
        <Button
          variant={activeTab === 'rules' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('rules')}
          className={activeTab === 'rules' ? 'bg-violet-500 text-white' : 'text-slate-400'}
        >
          <Award className="w-4 h-4 mr-2" />
          Earning Rules
        </Button>
      </div>

      {activeTab === 'rules' ? (
        <div className="space-y-6">
          {/* YouTube Earning Rules */}
          <Card className="bg-gradient-to-r from-red-500/10 to-red-600/5 border-red-500/30">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500">
                  <Youtube className="w-6 h-6 text-white" />
                </div>
                YouTube Partner Program
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Level */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      Level 1: Fan Funding
                    </h3>
                    <p className="text-sm text-slate-400">Access to memberships, Super Chat & Shopping</p>
                  </div>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    {calculateProgress(userStats.youtubeSubscribers, 500) >= 100 ? '✓ Eligible' : 'In Progress'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Subscribers */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Subscribers</span>
                      <span className="text-white">{formatNumber(userStats.youtubeSubscribers)} / 500</span>
                    </div>
                    <Progress 
                      value={calculateProgress(userStats.youtubeSubscribers, 500)} 
                      className="h-2 bg-slate-700"
                    />
                  </div>
                  
                  {/* Watch Hours */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Watch Hours (12 months)</span>
                      <span className="text-white">{formatNumber(userStats.youtubeWatchHours)} / 3,000</span>
                    </div>
                    <Progress 
                      value={calculateProgress(userStats.youtubeWatchHours, 3000)} 
                      className="h-2 bg-slate-700"
                    />
                  </div>

                  {/* Uploads */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Uploads (90 days)</span>
                      <span className="text-white">3+ videos required</span>
                    </div>
                    <Progress value={100} className="h-2 bg-slate-700" />
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-sm text-yellow-400 flex items-start gap-2">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    OR get 3M Shorts views in 90 days (You have: {formatNumber(userStats.youtubeShortsViews)})
                  </p>
                </div>
              </div>

              {/* Full Level */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Zap className="w-5 h-5 text-red-400" />
                      Level 2: Full Monetization
                    </h3>
                    <p className="text-sm text-slate-400">Earn from ads on videos & Shorts</p>
                  </div>
                  <Badge className="bg-slate-700 text-slate-400 border-slate-600">
                    {calculateProgress(userStats.youtubeSubscribers, 1000) >= 100 ? '✓ Eligible' : 'Not Yet'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Subscribers</span>
                      <span className="text-white">{formatNumber(userStats.youtubeSubscribers)} / 1,000</span>
                    </div>
                    <Progress 
                      value={calculateProgress(userStats.youtubeSubscribers, 1000)} 
                      className="h-2 bg-slate-700"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Watch Hours (12 months)</span>
                      <span className="text-white">{formatNumber(userStats.youtubeWatchHours)} / 4,000</span>
                    </div>
                    <Progress 
                      value={calculateProgress(userStats.youtubeWatchHours, 4000)} 
                      className="h-2 bg-slate-700"
                    />
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-400 flex items-start gap-2">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    OR get 10M Shorts views in 90 days for ad revenue on Shorts
                  </p>
                </div>
              </div>

              {/* YouTube Important Rules */}
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-400" />
                  Important YouTube Rules
                </h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    Must have 2-Step Verification enabled
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    No active Community Guidelines strikes
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    Linked AdSense account required
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    Stay active! 6+ months inactive = monetization disabled
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Meta (Facebook & Instagram) Earning Rules */}
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/5 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                  <Facebook className="w-6 h-6 text-white" />
                </div>
                Meta (Facebook & Instagram)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Facebook */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Facebook className="w-5 h-5 text-blue-400" />
                      Facebook Content Monetization
                    </h3>
                    <p className="text-sm text-slate-400">Earn from Reels, Videos, Stories & Posts</p>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {calculateProgress(userStats.facebookFollowers, 10000) >= 100 ? '✓ Eligible' : 'In Progress'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Followers</span>
                      <span className="text-white">{formatNumber(userStats.facebookFollowers)} / 10,000</span>
                    </div>
                    <Progress 
                      value={calculateProgress(userStats.facebookFollowers, 10000)} 
                      className="h-2 bg-slate-700"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Watch Minutes (60 days)</span>
                      <span className="text-white">{formatNumber(userStats.facebookWatchMinutes)} / 600K</span>
                    </div>
                    <Progress 
                      value={calculateProgress(userStats.facebookWatchMinutes, 600000)} 
                      className="h-2 bg-slate-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Active Videos (60 days)</span>
                      <span className="text-white">5+ required</span>
                    </div>
                    <Progress value={100} className="h-2 bg-slate-700" />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['In-stream Ads', 'Reels Ads', 'Performance Bonus', 'Stars'].map((feature) => (
                    <div key={feature} className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
                      <span className="text-xs text-blue-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instagram */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Instagram className="w-5 h-5 text-pink-400" />
                      Instagram Creator Program
                    </h3>
                    <p className="text-sm text-slate-400">Earn from Reels, Gifts & Subscriptions</p>
                  </div>
                  <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30">
                    {calculateProgress(userStats.instagramFollowers, 500) >= 100 ? '✓ Eligible' : 'In Progress'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Followers (for Gifts)</span>
                      <span className="text-white">{formatNumber(userStats.instagramFollowers)} / 500-1,000</span>
                    </div>
                    <Progress 
                      value={calculateProgress(userStats.instagramFollowers, 500)} 
                      className="h-2 bg-slate-700"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Account Type</span>
                      <span className="text-emerald-400">Professional Account Required</span>
                    </div>
                    <Progress value={100} className="h-2 bg-slate-700" />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['Reels Ads', 'Gifts', 'Subscriptions', 'Badges'].map((feature) => (
                    <div key={feature} className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20 text-center">
                      <span className="text-xs text-pink-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meta Important Rules */}
              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  Important Meta Rules
                </h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    Original content only - no reposts or re-edits
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    Follow Partner Monetization Policies
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    No clickbait or misleading content
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    Facebook needs Page or Professional Mode profile
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    Instagram needs Creator or Business account
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Quick Comparison */}
          <Card className="bg-slate-900/60 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Quick Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-400">Platform</th>
                      <th className="text-left py-3 px-4 text-slate-400">Followers/Subs</th>
                      <th className="text-left py-3 px-4 text-slate-400">Watch Time</th>
                      <th className="text-left py-3 px-4 text-slate-400">Main Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-800">
                      <td className="py-3 px-4 text-white flex items-center gap-2">
                        <Youtube className="w-4 h-4 text-red-500" />
                        YouTube (Basic)
                      </td>
                      <td className="py-3 px-4 text-white">500</td>
                      <td className="py-3 px-4 text-white">3,000 hrs / 3M Shorts</td>
                      <td className="py-3 px-4 text-emerald-400">Fan Funding</td>
                    </tr>
                    <tr className="border-b border-slate-800">
                      <td className="py-3 px-4 text-white flex items-center gap-2">
                        <Youtube className="w-4 h-4 text-red-500" />
                        YouTube (Full)
                      </td>
                      <td className="py-3 px-4 text-white">1,000</td>
                      <td className="py-3 px-4 text-white">4,000 hrs / 10M Shorts</td>
                      <td className="py-3 px-4 text-emerald-400">Ad Revenue</td>
                    </tr>
                    <tr className="border-b border-slate-800">
                      <td className="py-3 px-4 text-white flex items-center gap-2">
                        <Facebook className="w-4 h-4 text-blue-500" />
                        Facebook
                      </td>
                      <td className="py-3 px-4 text-white">10,000</td>
                      <td className="py-3 px-4 text-white">600K mins (60 days)</td>
                      <td className="py-3 px-4 text-emerald-400">Ads + Bonus</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-white flex items-center gap-2">
                        <Instagram className="w-4 h-4 text-pink-500" />
                        Instagram
                      </td>
                      <td className="py-3 px-4 text-white">500-1,000</td>
                      <td className="py-3 px-4 text-white">Engagement based</td>
                      <td className="py-3 px-4 text-emerald-400">Reels + Gifts</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          {/* Step by Step Guide */}
          <Card className="bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border-violet-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-8 justify-center flex-wrap">
                {[
                  { step: 1, icon: Link2, text: 'Paste URL' },
                  { step: 2, icon: Sparkles, text: 'Get Short Link' },
                  { step: 3, icon: Share2, text: 'Share Anywhere' },
                  { step: 4, icon: DollarSign, text: 'Earn Money!' },
                ].map((item, i) => (
                  <div key={item.step} className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                        <item.icon className="w-7 h-7 text-white" />
                      </div>
                      <p className="text-white font-medium">{item.text}</p>
                    </div>
                    {i < 3 && (
                      <div className="w-12 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-500 hidden md:block" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Main Share Box */}
          <Card className="bg-slate-900/60 border-violet-500/30">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Link2 className="w-6 h-6 text-violet-400" />
                Create Your Share Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* URL Input */}
              <div className="flex gap-3 flex-col sm:flex-row">
                <div className="flex-1 relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="Paste any website URL here... (e.g., https://softwarevala.com/pos)"
                    className="pl-12 h-14 text-lg bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
                <Button
                  onClick={handleGenerateLink}
                  disabled={isGenerating}
                  className="h-14 px-8 bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white text-lg font-semibold"
                >
                  {isGenerating ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                      <Sparkles className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Create Link
                    </>
                  )}
                </Button>
              </div>

              {/* Generated Link Box */}
              <AnimatePresence>
                {generatedLink && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Your link is ready!</span>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700 flex-col sm:flex-row">
                      <code className="flex-1 text-xl text-cyan-400 font-mono break-all">{generatedLink}</code>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => handleCopyLink(generatedLink)}
                        className="border-slate-600 text-white hover:bg-slate-700"
                      >
                        {copied ? (
                          <Check className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                        <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
                      </Button>
                    </div>

                    {/* Share Buttons */}
                    <div className="mt-6">
                      <p className="text-slate-400 mb-3">Share on:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Button
                          onClick={() => handleShare('whatsapp')}
                          className="h-12 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <MessageCircle className="w-5 h-5 mr-2" />
                          WhatsApp
                        </Button>
                        <Button
                          onClick={() => handleShare('facebook')}
                          className="h-12 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Facebook className="w-5 h-5 mr-2" />
                          Facebook
                        </Button>
                        <Button
                          onClick={() => handleShare('twitter')}
                          className="h-12 bg-sky-500 hover:bg-sky-600 text-white"
                        >
                          <Twitter className="w-5 h-5 mr-2" />
                          Twitter
                        </Button>
                        <Button
                          onClick={() => handleShare('instagram')}
                          className="h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                        >
                          <Instagram className="w-5 h-5 mr-2" />
                          Instagram
                        </Button>
                      </div>
                    </div>

                    {/* QR Code Toggle */}
                    <div className="mt-6 flex justify-center">
                      <Button
                        variant="outline"
                        onClick={() => setShowQR(!showQR)}
                        className="border-slate-600 text-white hover:bg-slate-800"
                      >
                        <QrCode className="w-5 h-5 mr-2" />
                        {showQR ? 'Hide' : 'Show'} QR Code
                      </Button>
                    </div>

                    <AnimatePresence>
                      {showQR && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 flex justify-center"
                        >
                          <div className="p-6 rounded-2xl bg-white">
                            <QRCodeSVG value={generatedLink} size={180} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* My Shared Links */}
          <Card className="bg-slate-900/60 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Eye className="w-6 h-6 text-cyan-400" />
                  My Shared Links
                </span>
                <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30">
                  {sharedLinks.length} Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sharedLinks.map((link, index) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-violet-500/30 transition-all"
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                            {link.product}
                          </Badge>
                          <span className="text-sm text-slate-500">
                            <Clock className="w-3 h-3 inline mr-1" />
                            Last click: {formatTimeAgo(link.lastClickAt)}
                          </span>
                        </div>
                        <code className="text-cyan-400 font-mono">{link.shortUrl}</code>
                        <p className="text-sm text-slate-500 mt-1 truncate">{link.url}</p>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">{link.clicks}</p>
                          <p className="text-xs text-slate-500">Clicks</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-emerald-400">{link.conversions}</p>
                          <p className="text-xs text-slate-500">Sales</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-violet-400">₹{link.earnings}</p>
                          <p className="text-xs text-slate-500">Earned</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyLink(link.shortUrl)}
                          className="border-slate-600 text-slate-300"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Links', value: '24', icon: Link2, color: 'violet', subtext: '3 new today' },
              { label: 'Total Clicks', value: '45.8K', icon: MousePointer, color: 'cyan', subtext: '+12% this week' },
              { label: 'Conversions', value: '234', icon: Users, color: 'emerald', subtext: '5.1% rate' },
              { label: 'Total Earned', value: '₹1,45,280', icon: DollarSign, color: 'amber', subtext: 'Lifetime' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-4 rounded-xl bg-slate-800/50 border border-slate-700/50`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg bg-${stat.color}-500/20`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                  </div>
                  <span className="text-sm text-slate-400">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.subtext}</p>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SimpleShareCenter;

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Link2, Copy, QrCode, Share2, TrendingUp, 
  Plus, ExternalLink, Tag, Globe, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const campaigns = [
  { id: 1, name: 'Summer Sale 2024', code: 'SUMMER24', clicks: 45230, conversions: 2340, active: true },
  { id: 2, name: 'Tech Product Launch', code: 'TECHLAUNCH', clicks: 28900, conversions: 1560, active: true },
  { id: 3, name: 'Festive Offer', code: 'FESTIVE24', clicks: 67800, conversions: 4520, active: false },
];

const recentLinks = [
  { id: 1, influencer: 'Priya S.', url: 'sv.app/p/summer24/priya', clicks: 12340, qr: true },
  { id: 2, influencer: 'Rahul V.', url: 'sv.app/p/tech/rahul', clicks: 8920, qr: true },
  { id: 3, influencer: 'Sneha P.', url: 'sv.app/p/festive/sneha', clicks: 15680, qr: false },
];

const SmartLinkGenerator = () => {
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [influencerId, setInfluencerId] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [showQR, setShowQR] = useState(false);

  const generateLink = () => {
    if (!selectedCampaign || !influencerId) {
      toast.error('Please select a campaign and enter influencer ID');
      return;
    }
    const link = `https://sv.app/p/${selectedCampaign.toLowerCase().replace(/\s/g, '-')}/${influencerId}?utm_source=influencer&utm_medium=social&utm_campaign=${selectedCampaign.toLowerCase()}`;
    setGeneratedLink(link);
    toast.success('Link generated successfully!');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Smart Link Generator</h2>
        <p className="text-slate-400 mt-1">Create unique tracking links with UTM automation and QR support</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Link Generator */}
        <div className="col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-purple-500/20 backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              Generate New Link
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Select Campaign</label>
                <select
                  value={selectedCampaign}
                  onChange={(e) => setSelectedCampaign(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-900/50 border border-slate-600/50 text-white"
                >
                  <option value="">Choose a campaign...</option>
                  {campaigns.filter(c => c.active).map((campaign) => (
                    <option key={campaign.id} value={campaign.name}>{campaign.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">Influencer ID / Username</label>
                <Input
                  placeholder="Enter influencer ID..."
                  value={influencerId}
                  onChange={(e) => setInfluencerId(e.target.value)}
                  className="bg-slate-900/50 border-slate-600/50"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">UTM Source</label>
                  <Input value="influencer" disabled className="bg-slate-900/30 border-slate-600/30" />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">UTM Medium</label>
                  <Input value="social" disabled className="bg-slate-900/30 border-slate-600/30" />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">UTM Campaign</label>
                  <Input value={selectedCampaign.toLowerCase() || 'auto'} disabled className="bg-slate-900/30 border-slate-600/30" />
                </div>
              </div>

              <Button 
                onClick={generateLink}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                <Link2 className="w-4 h-4 mr-2" />
                Generate Tracking Link
              </Button>

              {generatedLink && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <Input 
                      value={generatedLink} 
                      readOnly 
                      className="bg-slate-900/50 border-slate-600/50 text-sm"
                    />
                    <Button size="sm" variant="outline" onClick={copyLink}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setShowQR(!showQR)}>
                      <QrCode className="w-4 h-4 mr-2" />
                      {showQR ? 'Hide' : 'Show'} QR
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                  {showQR && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex justify-center p-4 bg-white rounded-lg"
                    >
                      <div className="w-32 h-32 bg-slate-200 rounded flex items-center justify-center">
                        <QrCode className="w-20 h-20 text-slate-800" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Recent Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Recent Generated Links</h3>
            <div className="space-y-3">
              {recentLinks.map((link, index) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 border border-slate-700/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Link2 className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-sm text-white font-medium">{link.influencer}</div>
                      <div className="text-xs text-slate-400">{link.url}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-white font-medium">{link.clicks.toLocaleString()}</div>
                      <div className="text-xs text-slate-400">clicks</div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Campaign Stats */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-pink-400" />
              Active Campaigns
            </h3>
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className={`p-3 rounded-lg border ${
                    campaign.active 
                      ? 'bg-purple-500/10 border-purple-500/30' 
                      : 'bg-slate-900/30 border-slate-700/30 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{campaign.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      campaign.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {campaign.active ? 'Active' : 'Ended'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400">Clicks:</span>
                      <span className="text-white ml-1">{campaign.clicks.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Conv:</span>
                      <span className="text-white ml-1">{campaign.conversions.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30"
          >
            <Globe className="w-8 h-8 text-purple-400 mb-3" />
            <h4 className="font-semibold text-white mb-2">Global Link Stats</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Links</span>
                <span className="text-white font-medium">12,456</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Clicks</span>
                <span className="text-white font-medium">2.4M</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Avg CTR</span>
                <span className="text-emerald-400 font-medium">4.8%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SmartLinkGenerator;

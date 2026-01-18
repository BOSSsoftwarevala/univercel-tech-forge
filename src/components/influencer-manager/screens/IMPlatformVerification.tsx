import { useState } from 'react';
import { motion } from 'framer-motion';
import { Youtube, Facebook, Video, Globe, CheckCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const verifications = [
  { id: 1, influencer: 'Vik****', platform: 'YouTube', url: 'youtube.com/c/***', engagement: '4.2%', status: 'pending' },
  { id: 2, influencer: 'Raj****', platform: 'Instagram', url: 'instagram.com/***', engagement: '6.8%', status: 'pending' },
  { id: 3, influencer: 'Pri****', platform: 'TikTok', url: 'tiktok.com/@***', engagement: '8.1%', status: 'verified' },
  { id: 4, influencer: 'Anu****', platform: 'Blog', url: '***.wordpress.com', engagement: '2.3%', status: 'flagged' },
];

const IMPlatformVerification = () => {
  const [activeTab, setActiveTab] = useState('youtube');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Platform Verification</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="youtube" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
            <Youtube className="w-4 h-4 mr-2" />
            YouTube
          </TabsTrigger>
          <TabsTrigger value="facebook" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            <Facebook className="w-4 h-4 mr-2" />
            Facebook / Instagram
          </TabsTrigger>
          <TabsTrigger value="tiktok" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <Video className="w-4 h-4 mr-2" />
            TikTok
          </TabsTrigger>
          <TabsTrigger value="blog" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            <Globe className="w-4 h-4 mr-2" />
            Website / Blog
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {verifications.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                      {activeTab === 'youtube' && <Youtube className="w-5 h-5 text-red-400" />}
                      {activeTab === 'facebook' && <Facebook className="w-5 h-5 text-blue-400" />}
                      {activeTab === 'tiktok' && <Video className="w-5 h-5 text-cyan-400" />}
                      {activeTab === 'blog' && <Globe className="w-5 h-5 text-purple-400" />}
                    </div>
                    <div>
                      <div className="font-medium text-white">{item.influencer}</div>
                      <div className="text-sm text-slate-400">{item.url} • Engagement: {item.engagement}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.status === 'verified' ? 'bg-emerald-500/20 text-emerald-400' :
                      item.status === 'flagged' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {item.status}
                    </span>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      <CheckCircle className="w-4 h-4 mr-1" /> Verify
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-600">
                      <RefreshCw className="w-4 h-4 mr-1" /> Recheck
                    </Button>
                    <Button size="sm" variant="outline" className="border-orange-500/50 text-orange-400">
                      <AlertTriangle className="w-4 h-4 mr-1" /> Flag
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IMPlatformVerification;

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, CheckCircle, UserPlus, Pause, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const campaigns = [
  { id: 1, name: 'India Tech Launch', country: 'India', product: 'SaaS Platform', budget: '₹5L', duration: '30 days', status: 'active', influencers: 24 },
  { id: 2, name: 'USA Expansion', country: 'USA', product: 'Franchise Kit', budget: '$10K', duration: '45 days', status: 'active', influencers: 12 },
  { id: 3, name: 'UK Education Push', country: 'UK', product: 'EdTech Course', budget: '£3K', duration: '20 days', status: 'upcoming', influencers: 0 },
  { id: 4, name: 'Global Brand Awareness', country: 'Global', product: 'Brand', budget: '₹15L', duration: '60 days', status: 'closed', influencers: 89 },
];

const IMCampaignManagement = () => {
  const [activeTab, setActiveTab] = useState('active');

  const filteredCampaigns = campaigns.filter(c => c.status === activeTab);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Campaign Management</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="active" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <Play className="w-4 h-4 mr-2" />
            Active Campaigns
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            <Clock className="w-4 h-4 mr-2" />
            Upcoming Campaigns
          </TabsTrigger>
          <TabsTrigger value="closed" className="data-[state=active]:bg-slate-500/20 data-[state=active]:text-slate-400">
            <CheckCircle className="w-4 h-4 mr-2" />
            Closed Campaigns
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredCampaigns.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-bold">
                      {campaign.name[0]}
                    </div>
                    <div>
                      <div className="font-medium text-white">{campaign.name}</div>
                      <div className="text-sm text-slate-400">
                        {campaign.country} • {campaign.product} • {campaign.budget} • {campaign.duration}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-pink-400">{campaign.influencers} influencers</div>
                    <div className="flex items-center gap-2">
                      {campaign.status !== 'closed' && (
                        <Button size="sm" variant="outline" className="border-pink-500/50 text-pink-400">
                          <UserPlus className="w-4 h-4 mr-1" /> Assign
                        </Button>
                      )}
                      {campaign.status === 'active' && (
                        <Button size="sm" variant="outline" className="border-yellow-500/50 text-yellow-400">
                          <Pause className="w-4 h-4 mr-1" /> Pause
                        </Button>
                      )}
                      {campaign.status !== 'closed' && (
                        <Button size="sm" variant="outline" className="border-red-500/50 text-red-400">
                          <XCircle className="w-4 h-4 mr-1" /> Close
                        </Button>
                      )}
                    </div>
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

export default IMCampaignManagement;

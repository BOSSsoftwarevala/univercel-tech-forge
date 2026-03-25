import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, UserX, Eye, Pause, Play, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const profiles = [
  { id: 1, name: 'Vik****_123', country: 'India', platforms: ['YouTube', 'Instagram'], trustScore: 92, status: 'approved' },
  { id: 2, name: 'Raj****_456', country: 'USA', platforms: ['TikTok'], trustScore: 78, status: 'approved' },
  { id: 3, name: 'Pri****_789', country: 'UK', platforms: ['Blog', 'YouTube'], trustScore: 85, status: 'pending' },
  { id: 4, name: 'Anu****_012', country: 'India', platforms: ['Instagram'], trustScore: 45, status: 'suspended' },
];

const IMProfiles = () => {
  const [activeTab, setActiveTab] = useState('approved');

  const filteredProfiles = profiles.filter(p => p.status === activeTab);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Influencer Profiles</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="approved" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <CheckCircle className="w-4 h-4 mr-2" />
            Approved
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
            <Clock className="w-4 h-4 mr-2" />
            Pending
          </TabsTrigger>
          <TabsTrigger value="suspended" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
            <UserX className="w-4 h-4 mr-2" />
            Suspended
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredProfiles.map((profile, index) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-bold">
                      {profile.name[0]}
                    </div>
                    <div>
                      <div className="font-medium text-white">{profile.name}</div>
                      <div className="text-sm text-slate-400">{profile.country} • {profile.platforms.join(', ')}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`text-sm ${profile.trustScore >= 80 ? 'text-emerald-400' : profile.trustScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                      Trust: {profile.trustScore}%
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="border-slate-600">
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>
                      {profile.status === 'approved' && (
                        <Button size="sm" variant="outline" className="border-yellow-500/50 text-yellow-400">
                          <Pause className="w-4 h-4 mr-1" /> Suspend
                        </Button>
                      )}
                      {profile.status === 'suspended' && (
                        <Button size="sm" variant="outline" className="border-emerald-500/50 text-emerald-400">
                          <Play className="w-4 h-4 mr-1" /> Resume
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="border-red-500/50 text-red-400">
                        <AlertTriangle className="w-4 h-4 mr-1" /> Escalate
                      </Button>
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

export default IMProfiles;

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, RefreshCw, Users, Youtube, Facebook, Video, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const applications = [
  { id: 1, name: 'Raj****', type: 'YouTube', country: 'India', category: 'Tech', status: 'pending', date: '2 hours ago' },
  { id: 2, name: 'Pri****', type: 'Instagram', country: 'India', category: 'Education', status: 'pending', date: '4 hours ago' },
  { id: 3, name: 'Vik****', type: 'TikTok', country: 'USA', category: 'Business', status: 'pending', date: '5 hours ago' },
  { id: 4, name: 'Anu****', type: 'Blog', country: 'UK', category: 'Finance', status: 'pending', date: '6 hours ago' },
];

const IMOnboarding = () => {
  const [activeTab, setActiveTab] = useState('new');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Influencer Onboarding</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="new" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-400">
            <UserPlus className="w-4 h-4 mr-2" />
            New Application
          </TabsTrigger>
          <TabsTrigger value="reapply" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-400">
            <RefreshCw className="w-4 h-4 mr-2" />
            Re-Apply
          </TabsTrigger>
          <TabsTrigger value="referral" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-400">
            <Users className="w-4 h-4 mr-2" />
            Referral Application
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="mt-6">
          <div className="space-y-4">
            {applications.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                      {app.type === 'YouTube' && <Youtube className="w-5 h-5 text-red-400" />}
                      {app.type === 'Instagram' && <Facebook className="w-5 h-5 text-pink-400" />}
                      {app.type === 'TikTok' && <Video className="w-5 h-5 text-cyan-400" />}
                      {app.type === 'Blog' && <Globe className="w-5 h-5 text-blue-400" />}
                    </div>
                    <div>
                      <div className="font-medium text-white">{app.name}</div>
                      <div className="text-sm text-slate-400">{app.type} • {app.country} • {app.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{app.date}</span>
                    <Button size="sm" variant="outline" className="border-slate-600">Review</Button>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">Approve</Button>
                    <Button size="sm" variant="outline" className="border-red-500/50 text-red-400">Reject</Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reapply" className="mt-6">
          <div className="text-center py-12 text-slate-400">
            No re-applications pending
          </div>
        </TabsContent>

        <TabsContent value="referral" className="mt-6">
          <div className="text-center py-12 text-slate-400">
            No referral applications pending
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IMOnboarding;

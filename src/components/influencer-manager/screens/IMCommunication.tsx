import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Bot, Megaphone } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const messages = [
  { id: 1, type: 'System', title: 'Profile Approved', message: 'Your influencer profile has been approved. You can now participate in campaigns.', time: '2 hours ago' },
  { id: 2, type: 'AI', title: 'Performance Alert', message: 'Your CTR has dropped by 15% this week. Consider optimizing your content strategy.', time: '5 hours ago' },
  { id: 3, type: 'Campaign', title: 'New Campaign Available', message: 'India Tech Launch campaign is now open for applications. Budget: ₹5L', time: '1 day ago' },
  { id: 4, type: 'System', title: 'Payout Processed', message: 'Your payout of ₹28,500 has been processed successfully.', time: '2 days ago' },
];

const IMCommunication = () => {
  const [activeTab, setActiveTab] = useState('system');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Influencer Communication</h1>
        <span className="text-sm text-slate-400">(Read-only • No Direct Chat)</span>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="system" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            <MessageSquare className="w-4 h-4 mr-2" />
            System Messages
          </TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            <Bot className="w-4 h-4 mr-2" />
            AI Notices
          </TabsTrigger>
          <TabsTrigger value="campaign" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-400">
            <Megaphone className="w-4 h-4 mr-2" />
            Campaign Updates
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    msg.type === 'System' ? 'bg-blue-500/20' :
                    msg.type === 'AI' ? 'bg-purple-500/20' : 'bg-pink-500/20'
                  }`}>
                    {msg.type === 'System' && <MessageSquare className="w-5 h-5 text-blue-400" />}
                    {msg.type === 'AI' && <Bot className="w-5 h-5 text-purple-400" />}
                    {msg.type === 'Campaign' && <Megaphone className="w-5 h-5 text-pink-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-white">{msg.title}</div>
                      <span className="text-xs text-slate-500">{msg.time}</span>
                    </div>
                    <p className="text-sm text-slate-400">{msg.message}</p>
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

export default IMCommunication;

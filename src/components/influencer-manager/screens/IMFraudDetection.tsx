import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Bot, Globe, Repeat, UserX, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const fraudAlerts = [
  { id: 1, influencer: 'Sus****_001', type: 'Fake Traffic', riskScore: 95, confidence: '98%', status: 'active' },
  { id: 2, influencer: 'Bot****_002', type: 'Bot Activity', riskScore: 88, confidence: '92%', status: 'active' },
  { id: 3, influencer: 'Geo****_003', type: 'Geo Mismatch', riskScore: 72, confidence: '85%', status: 'review' },
  { id: 4, influencer: 'Rep****_004', type: 'Repeated IP', riskScore: 65, confidence: '78%', status: 'review' },
];

const IMFraudDetection = () => {
  const [activeTab, setActiveTab] = useState('fake');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Fraud Detection</h1>
        <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium">CRITICAL</span>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="fake" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
            <ShieldAlert className="w-4 h-4 mr-2" />
            Fake Traffic
          </TabsTrigger>
          <TabsTrigger value="bot" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
            <Bot className="w-4 h-4 mr-2" />
            Bot Activity
          </TabsTrigger>
          <TabsTrigger value="geo" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
            <Globe className="w-4 h-4 mr-2" />
            Geo Mismatch
          </TabsTrigger>
          <TabsTrigger value="ip" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            <Repeat className="w-4 h-4 mr-2" />
            Repeated IP
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {fraudAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl bg-slate-800/50 border border-red-500/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <ShieldAlert className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{alert.influencer}</div>
                      <div className="text-sm text-slate-400">{alert.type} • AI Confidence: {alert.confidence}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400">{alert.riskScore}</div>
                      <div className="text-xs text-slate-400">Risk Score</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        <UserX className="w-4 h-4 mr-1" /> Auto Suspend
                      </Button>
                      <Button size="sm" variant="outline" className="border-yellow-500/50 text-yellow-400">
                        <Eye className="w-4 h-4 mr-1" /> Send for Review
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

export default IMFraudDetection;

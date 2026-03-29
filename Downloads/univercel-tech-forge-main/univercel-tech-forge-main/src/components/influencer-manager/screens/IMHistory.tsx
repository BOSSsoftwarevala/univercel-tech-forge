import { useState } from 'react';
import { motion } from 'framer-motion';
import { History, Megaphone, Wallet, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const historyData = {
  campaigns: [
    { id: 1, name: 'India Tech Launch', influencer: 'Vik****', result: 'Success', conversions: 342, date: '15 Jan 2024' },
    { id: 2, name: 'USA Expansion', influencer: 'Raj****', result: 'Partial', conversions: 89, date: '10 Jan 2024' },
    { id: 3, name: 'UK Education Push', influencer: 'Pri****', result: 'Success', conversions: 156, date: '05 Jan 2024' },
  ],
  payments: [
    { id: 1, influencer: 'Vik****', amount: '₹45,000', method: 'Bank Transfer', date: '18 Jan 2024' },
    { id: 2, influencer: 'Raj****', amount: '₹32,000', method: 'UPI', date: '15 Jan 2024' },
    { id: 3, influencer: 'Pri****', amount: '₹28,500', method: 'Bank Transfer', date: '12 Jan 2024' },
  ],
  violations: [
    { id: 1, influencer: 'Anu****', type: 'Fake Traffic', severity: 'High', action: 'Suspended', date: '16 Jan 2024' },
    { id: 2, influencer: 'Sus****', type: 'Policy Violation', severity: 'Medium', action: 'Warning', date: '10 Jan 2024' },
  ],
};

const IMHistory = () => {
  const [activeTab, setActiveTab] = useState('campaigns');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Influencer History</h1>
        <span className="text-sm text-slate-400">(Read-only)</span>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-400">
            <Megaphone className="w-4 h-4 mr-2" />
            Campaign History
          </TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <Wallet className="w-4 h-4 mr-2" />
            Payment History
          </TabsTrigger>
          <TabsTrigger value="violations" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Violation History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="mt-6">
          <div className="space-y-4">
            {historyData.campaigns.map((item, index) => (
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
                      <Megaphone className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{item.name}</div>
                      <div className="text-sm text-slate-400">{item.influencer} • {item.conversions} conversions</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.result === 'Success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {item.result}
                    </span>
                    <span className="text-sm text-slate-500">{item.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <div className="space-y-4">
            {historyData.payments.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{item.influencer}</div>
                      <div className="text-sm text-slate-400">{item.method}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-emerald-400">{item.amount}</span>
                    <span className="text-sm text-slate-500">{item.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="violations" className="mt-6">
          <div className="space-y-4">
            {historyData.violations.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl bg-slate-800/50 border border-red-500/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{item.influencer}</div>
                      <div className="text-sm text-slate-400">{item.type} • Severity: {item.severity}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">
                      {item.action}
                    </span>
                    <span className="text-sm text-slate-500">{item.date}</span>
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

export default IMHistory;

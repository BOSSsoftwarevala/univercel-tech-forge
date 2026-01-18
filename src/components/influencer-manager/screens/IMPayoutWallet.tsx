import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Clock, CheckCircle, Send, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const payouts = [
  { id: 1, influencer: 'Vik****_123', amount: '₹45,000', calculation: 'Auto', penalty: '₹0', bonus: '₹5,000', status: 'pending' },
  { id: 2, influencer: 'Raj****_456', amount: '₹32,000', calculation: 'Auto', penalty: '₹2,000', bonus: '₹0', status: 'pending' },
  { id: 3, influencer: 'Pri****_789', amount: '₹28,500', calculation: 'Auto', penalty: '₹0', bonus: '₹3,500', status: 'paid' },
  { id: 4, influencer: 'Anu****_012', amount: '₹18,000', calculation: 'Auto', penalty: '₹5,000', bonus: '₹0', status: 'pending' },
];

const IMPayoutWallet = () => {
  const [activeTab, setActiveTab] = useState('balance');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Payout & Wallet</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <div className="text-sm text-emerald-400 mb-1">Total Wallet Balance</div>
          <div className="text-2xl font-bold text-white">₹24,56,000</div>
        </div>
        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
          <div className="text-sm text-yellow-400 mb-1">Pending Payout</div>
          <div className="text-2xl font-bold text-white">₹8,45,000</div>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
          <div className="text-sm text-blue-400 mb-1">Paid This Month</div>
          <div className="text-2xl font-bold text-white">₹16,11,000</div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="balance" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <Wallet className="w-4 h-4 mr-2" />
            Wallet Balance
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
            <Clock className="w-4 h-4 mr-2" />
            Pending Payout
          </TabsTrigger>
          <TabsTrigger value="paid" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            <CheckCircle className="w-4 h-4 mr-2" />
            Paid History
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {payouts.map((payout, index) => (
              <motion.div
                key={payout.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{payout.influencer}</div>
                      <div className="text-sm text-slate-400">
                        {payout.calculation} • Penalty: {payout.penalty} • Bonus: {payout.bonus}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-xl font-bold text-emerald-400">{payout.amount}</div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      payout.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {payout.status}
                    </span>
                    {payout.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          <Send className="w-4 h-4 mr-1" /> Release (Approval)
                        </Button>
                        <Button size="sm" variant="outline" className="border-yellow-500/50 text-yellow-400">
                          <Pause className="w-4 h-4 mr-1" /> Hold
                        </Button>
                      </div>
                    )}
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

export default IMPayoutWallet;

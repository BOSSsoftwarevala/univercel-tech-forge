import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, UserX, Ban, CheckCircle, Play, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const accounts = [
  { id: 1, name: 'Vik****_123', reason: 'New application', approvedBy: '-', status: 'pending' },
  { id: 2, name: 'Raj****_456', reason: 'Suspicious activity', approvedBy: 'System', status: 'suspended' },
  { id: 3, name: 'Pri****_789', reason: 'Multiple fraud alerts', approvedBy: 'Admin', status: 'blacklisted' },
  { id: 4, name: 'Anu****_012', reason: 'Policy violation', approvedBy: 'System', status: 'suspended' },
];

const IMApprovalSuspension = () => {
  const [activeTab, setActiveTab] = useState('pending');

  const filteredAccounts = accounts.filter(a => a.status === activeTab);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Approval & Suspension</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="pending" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
            <Clock className="w-4 h-4 mr-2" />
            Pending Approval
          </TabsTrigger>
          <TabsTrigger value="suspended" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
            <UserX className="w-4 h-4 mr-2" />
            Suspended
          </TabsTrigger>
          <TabsTrigger value="blacklisted" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
            <Ban className="w-4 h-4 mr-2" />
            Blacklisted
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredAccounts.map((account, index) => (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      account.status === 'pending' ? 'bg-yellow-500/20' :
                      account.status === 'suspended' ? 'bg-orange-500/20' : 'bg-red-500/20'
                    }`}>
                      {account.status === 'pending' && <Clock className="w-5 h-5 text-yellow-400" />}
                      {account.status === 'suspended' && <UserX className="w-5 h-5 text-orange-400" />}
                      {account.status === 'blacklisted' && <Ban className="w-5 h-5 text-red-400" />}
                    </div>
                    <div>
                      <div className="font-medium text-white">{account.name}</div>
                      <div className="text-sm text-slate-400">Reason: {account.reason} • By: {account.approvedBy}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {account.status === 'pending' && (
                      <>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          <CheckCircle className="w-4 h-4 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="border-orange-500/50 text-orange-400">
                          <UserX className="w-4 h-4 mr-1" /> Suspend
                        </Button>
                      </>
                    )}
                    {account.status === 'suspended' && (
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                        <Play className="w-4 h-4 mr-1" /> Reinstate
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="border-slate-600">
                      <Eye className="w-4 h-4 mr-1" /> View Details
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

export default IMApprovalSuspension;

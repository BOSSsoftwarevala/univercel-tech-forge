import { useState } from 'react';
import { motion } from 'framer-motion';
import { MousePointer, Users, UserCheck, ShoppingCart, Eye, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const leads = [
  { id: 1, source: 'YouTube', country: 'India', time: '2 min ago', type: 'click', value: 245, valid: true },
  { id: 2, source: 'Instagram', country: 'USA', time: '5 min ago', type: 'lead', value: 12, valid: true },
  { id: 3, source: 'TikTok', country: 'UK', time: '8 min ago', type: 'qualified', value: 5, valid: false },
  { id: 4, source: 'Blog', country: 'India', time: '12 min ago', type: 'sale', value: 2, valid: true },
];

const IMLeadTracking = () => {
  const [activeTab, setActiveTab] = useState('clicks');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Lead & Conversion Tracking</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="clicks" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            <MousePointer className="w-4 h-4 mr-2" />
            Clicks
          </TabsTrigger>
          <TabsTrigger value="leads" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            <Users className="w-4 h-4 mr-2" />
            Leads
          </TabsTrigger>
          <TabsTrigger value="qualified" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <UserCheck className="w-4 h-4 mr-2" />
            Qualified Leads
          </TabsTrigger>
          <TabsTrigger value="sales" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-400">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Sales
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {leads.map((lead, index) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                      <MousePointer className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{lead.source}</div>
                      <div className="text-sm text-slate-400">{lead.country} • {lead.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-lg font-bold text-white">{lead.value}</div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      lead.valid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {lead.valid ? 'Valid' : 'Suspicious'}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="border-slate-600">
                        <Eye className="w-4 h-4 mr-1" /> Details
                      </Button>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                        <CheckCircle className="w-4 h-4 mr-1" /> Validate
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-500/50 text-red-400">
                        <AlertTriangle className="w-4 h-4 mr-1" /> Flag Fake
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

export default IMLeadTracking;

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Link, Image, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const submissions = [
  { id: 1, influencer: 'Vik****', type: 'Post', platform: 'YouTube', timestamp: '2 hours ago', status: 'pending' },
  { id: 2, influencer: 'Raj****', type: 'Link', platform: 'Instagram', timestamp: '4 hours ago', status: 'pending' },
  { id: 3, influencer: 'Pri****', type: 'Screenshot', platform: 'TikTok', timestamp: '5 hours ago', status: 'approved' },
  { id: 4, influencer: 'Anu****', type: 'Post', platform: 'Blog', timestamp: '6 hours ago', status: 'rejected' },
];

const IMContentSubmissions = () => {
  const [activeTab, setActiveTab] = useState('post');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Content Submissions</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="post" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-400">
            <FileText className="w-4 h-4 mr-2" />
            Post Submitted
          </TabsTrigger>
          <TabsTrigger value="link" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            <Link className="w-4 h-4 mr-2" />
            Link Submitted
          </TabsTrigger>
          <TabsTrigger value="screenshot" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            <Image className="w-4 h-4 mr-2" />
            Screenshot Submitted
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {submissions.map((item, index) => (
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
                      {item.type === 'Post' && <FileText className="w-5 h-5 text-pink-400" />}
                      {item.type === 'Link' && <Link className="w-5 h-5 text-blue-400" />}
                      {item.type === 'Screenshot' && <Image className="w-5 h-5 text-purple-400" />}
                    </div>
                    <div>
                      <div className="font-medium text-white">{item.influencer}</div>
                      <div className="text-sm text-slate-400">{item.type} • {item.platform} • {item.timestamp}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                      item.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {item.status}
                    </span>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      <CheckCircle className="w-4 h-4 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-500/50 text-red-400">
                      <XCircle className="w-4 h-4 mr-1" /> Reject
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-600">
                      <RefreshCw className="w-4 h-4 mr-1" /> Request Update
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

export default IMContentSubmissions;

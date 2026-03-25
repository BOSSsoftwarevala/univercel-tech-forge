import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  AlertTriangle, ExternalLink, RefreshCw, CheckCircle, 
  Clock, XCircle, Link2, Edit, Eye, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface BrokenDemo {
  id: string;
  title: string;
  category: string;
  url: string;
  maskedUrl: string;
  status: 'down' | 'timeout' | 'error' | 'ssl_expired';
  lastChecked: string;
  downSince: string;
  errorCode: string;
  affectedClicks: number;
}

const mockBrokenDemos: BrokenDemo[] = [
  {
    id: '1',
    title: 'E-Commerce Pro Suite',
    category: 'E-Commerce',
    url: 'https://demo.ecommerce-pro.com',
    maskedUrl: 'https://sv-demo.app/ecom-pro',
    status: 'down',
    lastChecked: '2 mins ago',
    downSince: '45 mins ago',
    errorCode: '503',
    affectedClicks: 234
  },
  {
    id: '2',
    title: 'HR Management System',
    category: 'HR & Payroll',
    url: 'https://hr-demo.softwarevala.com',
    maskedUrl: 'https://sv-demo.app/hr-system',
    status: 'timeout',
    lastChecked: '5 mins ago',
    downSince: '2 hours ago',
    errorCode: 'TIMEOUT',
    affectedClicks: 156
  },
  {
    id: '3',
    title: 'School ERP Demo',
    category: 'Education',
    url: 'https://school.demo-server.com',
    maskedUrl: 'https://sv-demo.app/school-erp',
    status: 'ssl_expired',
    lastChecked: '1 min ago',
    downSince: '1 day ago',
    errorCode: 'SSL_CERT',
    affectedClicks: 89
  }
];

const DemoBrokenAlerts = () => {
  const [brokenDemos, setBrokenDemos] = useState<BrokenDemo[]>(mockBrokenDemos);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [refreshingId, setRefreshingId] = useState<string | null>(null);

  const getStatusBadge = (status: BrokenDemo['status']) => {
    switch (status) {
      case 'down':
        return <Badge className="bg-red-500/20 text-red-400 border border-red-500/30"><XCircle className="w-3 h-3 mr-1" />Server Down</Badge>;
      case 'timeout':
        return <Badge className="bg-orange-500/20 text-orange-400 border border-orange-500/30"><Clock className="w-3 h-3 mr-1" />Timeout</Badge>;
      case 'error':
        return <Badge className="bg-red-500/20 text-red-400 border border-red-500/30"><AlertCircle className="w-3 h-3 mr-1" />Error</Badge>;
      case 'ssl_expired':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"><AlertTriangle className="w-3 h-3 mr-1" />SSL Expired</Badge>;
    }
  };

  const handleRefresh = async (id: string) => {
    setRefreshingId(id);
    // Simulate checking
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshingId(null);
    toast.info('Demo still appears to be down. Please check the URL.');
  };

  const handleFixUrl = async (id: string) => {
    if (!newUrl.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }
    
    // Simulate fixing
    setBrokenDemos(prev => prev.filter(d => d.id !== id));
    setEditingId(null);
    setNewUrl('');
    toast.success('Demo URL updated and demo is back online!');
  };

  const handleMarkResolved = (id: string) => {
    setBrokenDemos(prev => prev.filter(d => d.id !== id));
    toast.success('Demo marked as resolved');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 text-orange-400" />
            Broken Demo Alerts
          </h1>
          <p className="text-slate-400 mt-1">Monitor and fix broken demo links immediately</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 text-lg px-4 py-2">
            {brokenDemos.length} Issues Found
          </Badge>
        </div>
      </div>

      {/* Critical Alert Banner */}
      {brokenDemos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-gradient-to-r from-red-500/20 via-orange-500/10 to-red-500/20 border border-red-500/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="font-semibold text-red-400">Critical: {brokenDemos.length} demos are currently offline</p>
              <p className="text-sm text-slate-400">
                Total affected clicks: {brokenDemos.reduce((acc, d) => acc + d.affectedClicks, 0)} visitors impacted
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Broken Demos List */}
      <div className="space-y-4">
        {brokenDemos.map((demo, index) => (
          <motion.div
            key={demo.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-red-500/30 backdrop-blur-xl">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{demo.title}</h3>
                      {getStatusBadge(demo.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-slate-500">Category:</span>
                        <span className="text-slate-300 ml-2">{demo.category}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Error Code:</span>
                        <span className="text-red-400 ml-2 font-mono">{demo.errorCode}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Down Since:</span>
                        <span className="text-orange-400 ml-2">{demo.downSince}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Affected Clicks:</span>
                        <span className="text-red-400 ml-2">{demo.affectedClicks}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Link2 className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-500">URL:</span>
                        <code className="text-cyan-400 bg-slate-800/50 px-2 py-0.5 rounded">{demo.url}</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-500">Masked:</span>
                        <code className="text-emerald-400 bg-slate-800/50 px-2 py-0.5 rounded">{demo.maskedUrl}</code>
                      </div>
                    </div>

                    {/* Edit URL Section */}
                    {editingId === demo.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 p-4 rounded-lg bg-slate-800/50 border border-cyan-500/30"
                      >
                        <p className="text-sm text-cyan-400 mb-2">Enter new demo URL:</p>
                        <div className="flex gap-2">
                          <Input
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            placeholder="https://new-demo-url.com"
                            className="flex-1 bg-slate-900/50 border-slate-700"
                          />
                          <Button 
                            onClick={() => handleFixUrl(demo.id)}
                            className="bg-emerald-500 hover:bg-emerald-600"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Save & Fix
                          </Button>
                          <Button 
                            variant="ghost" 
                            onClick={() => { setEditingId(null); setNewUrl(''); }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRefresh(demo.id)}
                      disabled={refreshingId === demo.id}
                      className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${refreshingId === demo.id ? 'animate-spin' : ''}`} />
                      Re-check
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingId(demo.id)}
                      className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Fix URL
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(demo.url, '_blank')}
                      className="border-slate-500/30 text-slate-400 hover:bg-slate-500/10"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Test Link
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkResolved(demo.id)}
                      className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Fixed
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {brokenDemos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">All Demos Operational</h3>
            <p className="text-slate-400">No broken demos detected. All systems running smoothly.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DemoBrokenAlerts;

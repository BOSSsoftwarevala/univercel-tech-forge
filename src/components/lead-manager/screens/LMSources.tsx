import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Globe, Search, Share2, Megaphone, Store, Users, FileText, Zap,
  Eye, Edit, TrendingUp, TrendingDown, Loader2, AlertCircle
} from 'lucide-react';
import { useLeadStats, useLeads } from '@/hooks/useLeadData';

const sourceConfig = [
  { key: 'website', name: 'Website Leads', icon: Globe },
  { key: 'demo', name: 'Demo Requests', icon: Search },
  { key: 'social', name: 'Social Media', icon: Share2 },
  { key: 'influencer', name: 'Influencer Leads', icon: Megaphone },
  { key: 'reseller', name: 'Reseller Leads', icon: Store },
  { key: 'referral', name: 'Referral Leads', icon: Users },
  { key: 'direct', name: 'Direct Entry', icon: FileText },
  { key: 'other', name: 'Other Sources', icon: Zap },
];

const LMSources = () => {
  const { data: stats, isLoading } = useLeadStats();

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const sources = sourceConfig.map(s => ({
    ...s,
    count: stats?.bySource?.[s.key] || 0,
  })).filter(s => s.count > 0 || ['website', 'demo', 'social', 'direct'].includes(s.key));

  const totalLeads = stats?.total || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lead Sources</h1>
          <p className="text-muted-foreground">Source-wise lead breakdown with real data</p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
          {sources.length} Active Sources
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((source, index) => {
          const Icon = source.icon;
          const percentage = totalLeads > 0 ? ((source.count / totalLeads) * 100).toFixed(1) : '0';
          return (
            <motion.div key={source.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span className="text-base font-semibold text-foreground">{source.name}</span>
                        <p className="text-xs text-muted-foreground">{source.count} leads</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-primary">{percentage}%</span>
                      <p className="text-xs text-muted-foreground">of total</p>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-accent rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${percentage}%` }} />
                  </div>
                  <div className="flex items-center gap-1 pt-3 mt-3 border-t border-border">
                    <Button size="sm" variant="ghost" className="h-7 text-xs"><Eye className="w-3 h-3 mr-1" /> View</Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs"><Edit className="w-3 h-3 mr-1" /> Edit</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {sources.every(s => s.count === 0) && (
        <Card className="bg-card border-border">
          <CardContent className="p-8 flex flex-col items-center text-muted-foreground">
            <AlertCircle className="w-10 h-10 mb-3" />
            <p className="text-sm font-medium">No lead source data yet</p>
            <p className="text-xs">Leads will appear here once captured from various sources</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LMSources;

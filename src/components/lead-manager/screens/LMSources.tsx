import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Globe, Search, Share2, Megaphone, Store, Users, FileText, Zap,
  Eye, Edit, Pause, Play, Trash2, FileSearch, TrendingUp, TrendingDown
} from 'lucide-react';

const sources = [
  { 
    id: 1, 
    name: 'Website Leads', 
    icon: Globe, 
    leads: 892, 
    conversion: '28.5%', 
    trend: 'up',
    subSources: ['Contact Forms (412)', 'Landing Pages (298)', 'Chat Widget (124)', 'Exit Intent (58)']
  },
  { 
    id: 2, 
    name: 'SEO Leads', 
    icon: Search, 
    leads: 567, 
    conversion: '32.1%', 
    trend: 'up',
    subSources: ['Organic Search (398)', 'Keyword-Based (112)', 'Location SEO (57)']
  },
  { 
    id: 3, 
    name: 'Social Media Leads', 
    icon: Share2, 
    leads: 743, 
    conversion: '19.8%', 
    trend: 'down',
    subSources: ['Facebook (312)', 'Instagram (245)', 'LinkedIn (134)', 'Twitter/X (52)']
  },
  { 
    id: 4, 
    name: 'Ads Leads', 
    icon: Megaphone, 
    leads: 1089, 
    conversion: '24.3%', 
    trend: 'up',
    subSources: ['Google Ads (534)', 'Facebook Ads (312)', 'Instagram Ads (178)', 'YouTube Ads (65)']
  },
  { 
    id: 5, 
    name: 'Marketplace Leads', 
    icon: Store, 
    leads: 234, 
    conversion: '21.7%', 
    trend: 'up',
    subSources: ['Justdial (112)', 'IndiaMart (89)', 'TradeIndia (33)']
  },
  { 
    id: 6, 
    name: 'Referral Leads', 
    icon: Users, 
    leads: 156, 
    conversion: '45.2%', 
    trend: 'up',
    subSources: []
  },
  { 
    id: 7, 
    name: 'Manual Entry', 
    icon: FileText, 
    leads: 89, 
    conversion: '31.4%', 
    trend: 'down',
    subSources: []
  },
  { 
    id: 8, 
    name: 'API Leads', 
    icon: Zap, 
    leads: 47, 
    conversion: '26.8%', 
    trend: 'up',
    subSources: []
  },
];

const LMSources = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lead Sources</h1>
          <p className="text-muted-foreground">Micro to Nano level source breakdown</p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
          8 Active Sources
        </Badge>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((source, index) => {
          const Icon = source.icon;
          return (
            <motion.div
              key={source.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span className="text-base font-semibold">{source.name}</span>
                        <p className="text-xs text-muted-foreground">{source.leads} leads</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${source.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                        {source.conversion}
                      </span>
                      {source.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {source.subSources.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {source.subSources.map((sub) => (
                        <Badge key={sub} variant="secondary" className="text-xs">
                          {sub}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 pt-2 border-t border-border">
                    <Button size="sm" variant="ghost" className="h-7 text-xs">
                      <Eye className="w-3 h-3 mr-1" /> View
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">
                      <Edit className="w-3 h-3 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">
                      <Pause className="w-3 h-3 mr-1" /> Pause
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">
                      <Play className="w-3 h-3 mr-1" /> Resume
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive">
                      <Trash2 className="w-3 h-3 mr-1" /> Delete
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">
                      <FileSearch className="w-3 h-3 mr-1" /> Audit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LMSources;

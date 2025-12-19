import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Link, Copy, CheckCircle, AlertTriangle, Clock, RefreshCw, Eye, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const demoCategories = [
  { id: 'pos', name: 'POS System', uptime: 99.9, status: 'online' },
  { id: 'school', name: 'School ERP', uptime: 99.5, status: 'online' },
  { id: 'hospital', name: 'Hospital Management', uptime: 98.8, status: 'online' },
  { id: 'restaurant', name: 'Restaurant Software', uptime: 99.2, status: 'online' },
  { id: 'crm', name: 'CRM System', uptime: 95.5, status: 'degraded' },
];

const issuedDemos = [
  { id: 1, category: 'POS System', client: 'R*** V***', issued: '2 hours ago', expires: '48h', views: 3 },
  { id: 2, category: 'School ERP', client: 'S*** P***', issued: '1 day ago', expires: '24h', views: 12 },
  { id: 3, category: 'Hospital Management', client: 'A*** K***', issued: '3 days ago', expires: 'Expired', views: 8 },
];

export const DemoDistributionPanel = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [clientId, setClientId] = useState('');

  const generateDemoLink = () => {
    if (!selectedCategory) {
      toast({
        title: "Select Category",
        description: "Please select a demo category first",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Demo Link Generated",
      description: "Link copied to clipboard and sent to client",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-mono font-bold text-foreground">Demo Distribution Panel</h2>
          <p className="text-sm text-muted-foreground">Issue and monitor demo access</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Issue Demo */}
        <Card className="glass-panel border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Send className="w-5 h-5 text-primary" />
              Issue New Demo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Select Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-secondary/30 border-border/30">
                  <SelectValue placeholder="Choose demo type" />
                </SelectTrigger>
                <SelectContent>
                  {demoCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Client ID (Masked)</label>
              <Input 
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Enter client reference"
                className="bg-secondary/30 border-border/30"
              />
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-primary to-neon-teal text-background"
              onClick={generateDemoLink}
            >
              <Link className="w-4 h-4 mr-2" />
              Generate Demo Link
            </Button>
          </CardContent>
        </Card>

        {/* Demo Uptime Monitor */}
        <Card className="lg:col-span-2 glass-panel border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <RefreshCw className="w-5 h-5 text-primary" />
              Demo Uptime Monitor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {demoCategories.map((demo, index) => (
                <motion.div
                  key={demo.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-secondary/20 border border-border/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{demo.name}</span>
                    <Badge variant={demo.status === 'online' ? 'default' : 'destructive'}>
                      {demo.status === 'online' ? (
                        <><CheckCircle className="w-3 h-3 mr-1" /> Online</>
                      ) : (
                        <><AlertTriangle className="w-3 h-3 mr-1" /> Degraded</>
                      )}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Uptime</span>
                    <span className={`text-sm font-mono ${demo.uptime >= 99 ? 'text-neon-green' : 'text-neon-orange'}`}>
                      {demo.uptime}%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${demo.uptime >= 99 ? 'bg-neon-green' : 'bg-neon-orange'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${demo.uptime}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Issued Demos */}
      <Card className="glass-panel border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <PlayCircle className="w-5 h-5 text-primary" />
            Issued Demos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {issuedDemos.map((demo, index) => (
              <motion.div
                key={demo.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl bg-secondary/20 border ${
                  demo.expires === 'Expired' ? 'border-neon-red/30' : 'border-border/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{demo.category}</span>
                      <span className="text-sm text-muted-foreground">→</span>
                      <span className="font-mono text-sm text-primary">{demo.client}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Issued: {demo.issued}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {demo.views} views
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={demo.expires === 'Expired' ? 'destructive' : 'outline'}>
                      <Clock className="w-3 h-3 mr-1" />
                      {demo.expires}
                    </Badge>
                    <Button variant="outline" size="sm" className="border-primary/30">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

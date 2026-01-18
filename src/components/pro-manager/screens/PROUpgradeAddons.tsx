/**
 * UPGRADE & ADD-ONS
 * Feature Add-ons • Capacity Upgrade • AI Credits • Support Tier Upgrade
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpCircle, Sparkles, Database, Bot, HeadphonesIcon } from 'lucide-react';
import { toast } from 'sonner';

const mockUpgrades = [
  { id: 'UPG-001', user: 'PRO-***21', type: 'Feature Add-on', item: 'Advanced Analytics', status: 'pending' },
  { id: 'UPG-002', user: 'PRO-***45', type: 'Capacity', item: '+50GB Storage', status: 'pending' },
  { id: 'UPG-003', user: 'PRO-***78', type: 'AI Credits', item: '10,000 Credits', status: 'approved' },
  { id: 'UPG-004', user: 'PRO-***92', type: 'Support Tier', item: 'Premium → Enterprise', status: 'pending' },
];

export const PROUpgradeAddons: React.FC = () => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Feature Add-on': return <Sparkles className="h-5 w-5 text-purple-500" />;
      case 'Capacity': return <Database className="h-5 w-5 text-blue-500" />;
      case 'AI Credits': return <Bot className="h-5 w-5 text-green-500" />;
      case 'Support Tier': return <HeadphonesIcon className="h-5 w-5 text-amber-500" />;
      default: return <ArrowUpCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Upgrade & Add-ons</h1>
        <p className="text-muted-foreground">Manage upgrade requests and add-ons</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Pending Upgrades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockUpgrades.map((upgrade, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  {getTypeIcon(upgrade.type)}
                  <span className="font-mono text-sm text-foreground">{upgrade.id}</span>
                  <span className="text-sm text-foreground">{upgrade.user}</span>
                  <Badge variant="outline">{upgrade.type}</Badge>
                  <span className="text-sm text-foreground">{upgrade.item}</span>
                  <Badge className={upgrade.status === 'approved' ? 'bg-green-500/20 text-green-500' : 'bg-amber-500/20 text-amber-500'}>
                    {upgrade.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => toast.info('Upgrade recommended')}>
                    Recommend
                  </Button>
                  <Button size="sm" onClick={() => toast.success('Upgrade applied')}>
                    Apply
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => toast.error('Upgrade rejected')}>
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PROUpgradeAddons;

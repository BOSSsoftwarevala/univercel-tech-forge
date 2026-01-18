/**
 * LICENSE & DOMAIN
 * License Type • Domain Bound Status • Expiry Date • Transfer Status
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Key, Globe, RefreshCw, ArrowUpCircle, Lock, Repeat } from 'lucide-react';
import { toast } from 'sonner';

const mockLicenses = [
  { 
    userId: 'PRO-***21', 
    type: 'Lifetime', 
    domain: 'enterprise.com',
    domainStatus: 'bound',
    expiry: 'Never',
    transfer: 'Not Requested'
  },
  { 
    userId: 'PRO-***45', 
    type: 'Annual', 
    domain: 'business-pro.io',
    domainStatus: 'bound',
    expiry: '2024-06-15',
    transfer: 'Pending Approval'
  },
  { 
    userId: 'PRO-***78', 
    type: 'Annual', 
    domain: 'agency-pack.net',
    domainStatus: 'unbound',
    expiry: '2024-03-20',
    transfer: 'Not Requested'
  },
];

export const PROLicenseDomain: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">License & Domain</h1>
        <p className="text-muted-foreground">Manage licenses and domain bindings</p>
      </div>

      <div className="grid gap-4">
        {mockLicenses.map((item, idx) => (
          <Card key={idx}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Key className="h-5 w-5 text-primary" />
                  <CardTitle className="text-foreground">{item.userId}</CardTitle>
                </div>
                <Badge variant={item.type === 'Lifetime' ? 'default' : 'secondary'}>
                  {item.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground">Domain</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{item.domain}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Domain Status</span>
                    <div className="mt-1">
                      <Badge className={item.domainStatus === 'bound' ? 'bg-green-500/20 text-green-500' : 'bg-amber-500/20 text-amber-500'}>
                        {item.domainStatus}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Expiry Date</span>
                    <p className="text-sm text-foreground mt-1">{item.expiry}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Transfer Status</span>
                    <div className="mt-1">
                      <Badge variant="outline">{item.transfer}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button size="sm" onClick={() => toast.success('Renewal initiated')}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Renew
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.success('Upgrade initiated')}>
                    <ArrowUpCircle className="h-4 w-4 mr-2" />
                    Upgrade
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.info('Domain locked')}>
                    <Lock className="h-4 w-4 mr-2" />
                    Lock Domain
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.warning('Rebind requires approval')}>
                    <Repeat className="h-4 w-4 mr-2" />
                    Rebind
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PROLicenseDomain;

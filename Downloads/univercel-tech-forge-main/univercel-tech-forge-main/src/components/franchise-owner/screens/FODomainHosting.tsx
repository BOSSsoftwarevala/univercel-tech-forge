/**
 * FRANCHISE OWNER - DOMAIN & HOSTING MANAGEMENT
 * Domain List, Hosting Plans, Renewals, DNS/SSL Status
 */

import React from 'react';
import { 
  Globe, Server, Shield, Clock, RefreshCw, ArrowUpRight,
  CheckCircle, AlertTriangle, XCircle, Eye, Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const domains = [
  { 
    id: 1, 
    name: 'businesscrm.in', 
    status: 'Active', 
    dnsStatus: 'Configured', 
    sslStatus: 'Valid',
    expiryDate: 'Mar 15, 2025',
    registrar: 'GoDaddy',
    autoRenew: true 
  },
  { 
    id: 2, 
    name: 'ecommercepro.com', 
    status: 'Active', 
    dnsStatus: 'Configured', 
    sslStatus: 'Valid',
    expiryDate: 'Apr 22, 2025',
    registrar: 'Namecheap',
    autoRenew: true 
  },
  { 
    id: 3, 
    name: 'clienthub.io', 
    status: 'Expiring Soon', 
    dnsStatus: 'Configured', 
    sslStatus: 'Expiring',
    expiryDate: 'Feb 05, 2024',
    registrar: 'GoDaddy',
    autoRenew: false 
  },
  { 
    id: 4, 
    name: 'inventory-app.in', 
    status: 'Active', 
    dnsStatus: 'Pending', 
    sslStatus: 'Valid',
    expiryDate: 'Jun 18, 2025',
    registrar: 'BigRock',
    autoRenew: true 
  },
];

const hostingPlans = [
  { 
    id: 1, 
    name: 'businesscrm.in', 
    plan: 'Business Pro',
    status: 'Active',
    storage: '45 GB / 100 GB',
    bandwidth: 'Unlimited',
    uptime: '99.98%',
    expiryDate: 'Mar 15, 2025',
    ssl: 'Active'
  },
  { 
    id: 2, 
    name: 'ecommercepro.com', 
    plan: 'E-Commerce Plus',
    status: 'Active',
    storage: '78 GB / 200 GB',
    bandwidth: 'Unlimited',
    uptime: '99.99%',
    expiryDate: 'Apr 22, 2025',
    ssl: 'Active'
  },
  { 
    id: 3, 
    name: 'clienthub.io', 
    plan: 'Starter',
    status: 'Warning',
    storage: '4.2 GB / 5 GB',
    bandwidth: '50 GB',
    uptime: '99.95%',
    expiryDate: 'Feb 05, 2024',
    ssl: 'Expiring'
  },
];

export function FODomainHosting() {
  const { toast } = useToast();

  const handleRenew = (name: string) => {
    toast({
      title: "Renewal Initiated",
      description: `Renewal process started for ${name}.`,
    });
  };

  const handleUpgrade = (name: string) => {
    toast({
      title: "Upgrade Request",
      description: `Upgrade request submitted for ${name}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            Domain & Hosting Management
          </h1>
          <p className="text-muted-foreground">Domains • Hosting Plans • DNS/SSL • Renewals</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Total Domains</span>
            </div>
            <p className="text-2xl font-bold">48</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Server className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Hosting Plans</span>
            </div>
            <p className="text-2xl font-bold">52</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-muted-foreground">Expiring Soon</span>
            </div>
            <p className="text-2xl font-bold">3</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-muted-foreground">SSL Active</span>
            </div>
            <p className="text-2xl font-bold">95</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="domains" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="domains" className="gap-2">
            <Globe className="h-4 w-4" />
            Domains
          </TabsTrigger>
          <TabsTrigger value="hosting" className="gap-2">
            <Server className="h-4 w-4" />
            Hosting Plans
          </TabsTrigger>
        </TabsList>

        <TabsContent value="domains" className="space-y-4">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Domain List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {domains.map((domain) => (
                  <div key={domain.id} className="p-4 bg-background/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          domain.status === 'Active' ? 'bg-emerald-500/10' : 'bg-amber-500/10'
                        }`}>
                          <Globe className={`h-5 w-5 ${
                            domain.status === 'Active' ? 'text-emerald-500' : 'text-amber-500'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium">{domain.name}</p>
                          <p className="text-sm text-muted-foreground">{domain.registrar}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={domain.status === 'Active' ? 'default' : 'secondary'}>
                          {domain.status}
                        </Badge>
                        {domain.autoRenew && (
                          <Badge variant="outline" className="gap-1">
                            <RefreshCw className="h-3 w-3" />
                            Auto-Renew
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-muted-foreground">DNS Status</p>
                        <div className="flex items-center gap-1">
                          {domain.dnsStatus === 'Configured' ? (
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-amber-500" />
                          )}
                          <span className="font-medium">{domain.dnsStatus}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">SSL Status</p>
                        <div className="flex items-center gap-1">
                          {domain.sslStatus === 'Valid' ? (
                            <Shield className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                          )}
                          <span className="font-medium">{domain.sslStatus}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Expires</p>
                        <p className="font-medium">{domain.expiryDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleRenew(domain.name)}>
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Renew
                      </Button>
                      <Button size="sm" variant="outline">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        Transfer
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Credentials
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hosting" className="space-y-4">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Server className="h-5 w-5" />
                Hosting Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hostingPlans.map((hosting) => (
                  <div key={hosting.id} className="p-4 bg-background/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          hosting.status === 'Active' ? 'bg-purple-500/10' : 'bg-amber-500/10'
                        }`}>
                          <Server className={`h-5 w-5 ${
                            hosting.status === 'Active' ? 'text-purple-500' : 'text-amber-500'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium">{hosting.name}</p>
                          <p className="text-sm text-muted-foreground">{hosting.plan}</p>
                        </div>
                      </div>
                      <Badge variant={hosting.status === 'Active' ? 'default' : 'secondary'}>
                        {hosting.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-muted-foreground">Storage</p>
                        <p className="font-medium">{hosting.storage}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Bandwidth</p>
                        <p className="font-medium">{hosting.bandwidth}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Uptime</p>
                        <p className="font-medium text-emerald-500">{hosting.uptime}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Expires</p>
                        <p className="font-medium">{hosting.expiryDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleRenew(hosting.name)}>
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Renew
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleUpgrade(hosting.name)}>
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        Upgrade
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Credentials
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4 mr-1" />
                        Settings
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

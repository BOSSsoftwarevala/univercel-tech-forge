/**
 * PRO USER REGISTRY
 * All Pro Users • Active • Suspended • Expired • High-Risk
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Eye, HeadphonesIcon, Handshake, Ban } from 'lucide-react';
import { toast } from 'sonner';

const mockUsers = [
  { id: 'PRO-***21', product: 'Enterprise Suite', license: 'Lifetime', region: 'North America', tier: 'Premium', status: 'active' },
  { id: 'PRO-***45', product: 'Business Pro', license: 'Annual', region: 'Europe', tier: 'Standard', status: 'active' },
  { id: 'PRO-***78', product: 'Agency Pack', license: 'Annual', region: 'Asia Pacific', tier: 'Premium', status: 'suspended' },
  { id: 'PRO-***92', product: 'Developer Kit', license: 'Lifetime', region: 'Middle East', tier: 'Basic', status: 'expired' },
  { id: 'PRO-***33', product: 'Enterprise Suite', license: 'Annual', region: 'Europe', tier: 'Premium', status: 'high_risk' },
];

export const PROUserRegistry: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredUsers = mockUsers.filter(user => {
    if (activeTab !== 'all' && user.status !== activeTab) return false;
    return user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.product.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-500/20 text-green-500">Active</Badge>;
      case 'suspended': return <Badge className="bg-red-500/20 text-red-500">Suspended</Badge>;
      case 'expired': return <Badge className="bg-gray-500/20 text-gray-500">Expired</Badge>;
      case 'high_risk': return <Badge className="bg-amber-500/20 text-amber-500">High-Risk</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pro User Registry</h1>
        <p className="text-muted-foreground">Manage premium user accounts</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Pro Users</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="suspended">Suspended</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
          <TabsTrigger value="high_risk">High-Risk</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">User List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredUsers.map((user, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm text-foreground">{user.id}</span>
                      <span className="text-sm text-foreground">{user.product}</span>
                      <Badge variant="outline">{user.license}</Badge>
                      <span className="text-xs text-muted-foreground">{user.region}</span>
                      <Badge variant="secondary">{user.tier}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(user.status)}
                      <Button size="sm" variant="ghost" onClick={() => toast.info('View Profile')}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => toast.info('Open Support')}>
                        <HeadphonesIcon className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => toast.info('Assign Assist')}>
                        <Handshake className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => toast.warning('Suspend Access')}>
                        <Ban className="h-4 w-4" />
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
};

export default PROUserRegistry;

/**
 * PRODUCT OWNERSHIP
 * Product List per User • Version • Enabled Modules • Custom Changes (Read-only)
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Check, X } from 'lucide-react';

const mockProducts = [
  { 
    userId: 'PRO-***21', 
    product: 'Enterprise Suite', 
    version: 'v4.2.1', 
    modules: ['CRM', 'Analytics', 'API', 'White-label'],
    customChanges: 'Custom branding applied'
  },
  { 
    userId: 'PRO-***45', 
    product: 'Business Pro', 
    version: 'v3.8.0', 
    modules: ['CRM', 'Analytics'],
    customChanges: 'None'
  },
  { 
    userId: 'PRO-***78', 
    product: 'Agency Pack', 
    version: 'v4.0.0', 
    modules: ['CRM', 'Analytics', 'Multi-tenant'],
    customChanges: 'Extended API limits'
  },
];

export const PROProductOwnership: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Product Ownership</h1>
        <p className="text-muted-foreground">View product details per user (Read-only)</p>
      </div>

      <div className="grid gap-4">
        {mockProducts.map((item, idx) => (
          <Card key={idx}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-primary" />
                  <CardTitle className="text-foreground">{item.product}</CardTitle>
                </div>
                <Badge variant="outline">{item.version}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">User ID:</span>
                  <span className="font-mono text-sm text-foreground">{item.userId}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Enabled Modules:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.modules.map((mod, i) => (
                      <Badge key={i} className="bg-green-500/20 text-green-500">
                        <Check className="h-3 w-3 mr-1" />
                        {mod}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Custom Changes:</span>
                  <span className="text-sm text-foreground">{item.customChanges}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PROProductOwnership;

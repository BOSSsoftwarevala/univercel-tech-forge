/**
 * COMPLIANCE & POLICY
 * Agreement Accepted • Policy Violations • Legal Flags
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, AlertTriangle, Scale } from 'lucide-react';

const mockCompliance = [
  { user: 'PRO-***21', agreement: true, violations: 0, legalFlags: false },
  { user: 'PRO-***45', agreement: true, violations: 1, legalFlags: false },
  { user: 'PRO-***78', agreement: false, violations: 2, legalFlags: true },
  { user: 'PRO-***92', agreement: true, violations: 0, legalFlags: false },
];

export const PROCompliancePolicy: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Compliance & Policy</h1>
        <p className="text-muted-foreground">Track user compliance and policy adherence</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-500/50">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">98%</p>
              <p className="text-xs text-muted-foreground">Agreement Acceptance</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-500/50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">3</p>
              <p className="text-xs text-muted-foreground">Policy Violations</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-500/50">
          <CardContent className="p-4 flex items-center gap-3">
            <Scale className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">1</p>
              <p className="text-xs text-muted-foreground">Legal Flags</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">User Compliance Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockCompliance.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="font-mono text-sm text-foreground">{item.user}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={item.agreement ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}>
                    {item.agreement ? 'Agreement Accepted' : 'Pending Agreement'}
                  </Badge>
                  <Badge className={item.violations === 0 ? 'bg-green-500/20 text-green-500' : 'bg-amber-500/20 text-amber-500'}>
                    {item.violations} Violations
                  </Badge>
                  {item.legalFlags && (
                    <Badge className="bg-red-500/20 text-red-500">
                      <Scale className="h-3 w-3 mr-1" />
                      Legal Flag
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PROCompliancePolicy;

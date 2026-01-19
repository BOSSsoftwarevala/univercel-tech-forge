/**
 * AGREEMENT & LEGAL SCREEN
 * Franchise Agreement, Trademark Rules, Active/History, View/Accept
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Shield,
  CheckCircle,
  Clock,
  Download,
  Eye,
  AlertTriangle,
} from 'lucide-react';

const activeAgreements = [
  {
    id: 'AGR-2024-001',
    title: 'Franchise Partnership Agreement',
    type: 'franchise',
    status: 'active',
    signedDate: '2024-01-01',
    expiryDate: '2025-01-01',
    version: '2.1',
  },
  {
    id: 'AGR-2024-002',
    title: 'Trademark Usage Guidelines',
    type: 'trademark',
    status: 'active',
    signedDate: '2024-01-01',
    expiryDate: '2025-01-01',
    version: '1.5',
  },
  {
    id: 'AGR-2024-003',
    title: 'Non-Disclosure Agreement',
    type: 'nda',
    status: 'active',
    signedDate: '2024-01-01',
    expiryDate: '2026-01-01',
    version: '1.0',
  },
];

const historicalAgreements = [
  {
    id: 'AGR-2023-001',
    title: 'Franchise Partnership Agreement',
    type: 'franchise',
    status: 'expired',
    signedDate: '2023-01-01',
    expiryDate: '2024-01-01',
    version: '2.0',
  },
];

const trademarkRules = [
  { rule: 'Software Vala logo must be used as provided', status: 'compliant' },
  { rule: 'No modification to brand colors', status: 'compliant' },
  { rule: 'Proper trademark attribution required', status: 'compliant' },
  { rule: 'Co-branding requires approval', status: 'pending_review' },
];

export function FOAgreementLegalScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Agreement & Legal</h1>
        <p className="text-muted-foreground">View and manage your franchise agreements</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active Agreements</p>
              <p className="text-xl font-bold">3</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Trademark Compliant</p>
              <p className="text-xl font-bold">3/4</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending Review</p>
              <p className="text-xl font-bold">1</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="agreements" className="space-y-4">
        <TabsList>
          <TabsTrigger value="agreements">Franchise Agreement</TabsTrigger>
          <TabsTrigger value="trademark">Trademark Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="agreements" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Active Agreements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeAgreements.map((agreement) => (
                <div key={agreement.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{agreement.title}</span>
                        <Badge className="bg-emerald-500/20 text-emerald-400">Active</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Version {agreement.version} • Signed: {agreement.signedDate} • Expires: {agreement.expiryDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Agreement History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {historicalAgreements.map((agreement) => (
                <div key={agreement.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 opacity-70">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{agreement.title}</span>
                        <Badge variant="secondary">Expired</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Version {agreement.version} • {agreement.signedDate} - {agreement.expiryDate}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Eye className="h-3 w-3" />
                    View
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trademark" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Trademark Compliance Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {trademarkRules.map((rule, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    {rule.status === 'compliant' ? (
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    )}
                    <span>{rule.rule}</span>
                  </div>
                  <Badge
                    className={
                      rule.status === 'compliant'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }
                  >
                    {rule.status === 'compliant' ? 'Compliant' : 'Pending Review'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">Brand Usage Guidelines</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Any misuse of Software Vala branding will be automatically flagged by our system.
                    Please ensure all marketing materials follow the trademark guidelines.
                  </p>
                  <Button variant="outline" size="sm" className="mt-3 gap-1">
                    <Eye className="h-3 w-3" />
                    View Full Guidelines
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FOAgreementLegalScreen;

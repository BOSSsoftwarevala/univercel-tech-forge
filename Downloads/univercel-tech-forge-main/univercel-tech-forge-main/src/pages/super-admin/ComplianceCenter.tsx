import { useState } from 'react';
import SuperAdminLayout from '@/components/layouts/SuperAdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, User, CheckCircle, AlertTriangle, Scale } from 'lucide-react';
import { RoleClausesScreen } from '@/components/compliance/RoleClausesScreen';
import { IdentityVerificationScreen } from '@/components/compliance/IdentityVerificationScreen';
import { VerificationStatusScreen } from '@/components/compliance/VerificationStatusScreen';
import { PenaltyHistoryScreen } from '@/components/compliance/PenaltyHistoryScreen';
import { LegalReviewPanel } from '@/components/compliance/LegalReviewPanel';

const ComplianceCenter = () => {
  const [selectedRole] = useState<'developer'>('developer');

  return (
    <SuperAdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Scale className="w-8 h-8" />
            Compliance Center
          </h1>
          <p className="text-muted-foreground">
            Role Clauses, Verification & Penalty System
          </p>
        </div>

        <Tabs defaultValue="clauses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="clauses" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Role Clauses
            </TabsTrigger>
            <TabsTrigger value="identity" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Identity
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Status
            </TabsTrigger>
            <TabsTrigger value="penalties" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Penalties
            </TabsTrigger>
            <TabsTrigger value="legal" className="flex items-center gap-2">
              <Scale className="w-4 h-4" />
              Legal Review
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clauses">
            <RoleClausesScreen role={selectedRole} />
          </TabsContent>
          <TabsContent value="identity">
            <IdentityVerificationScreen />
          </TabsContent>
          <TabsContent value="status">
            <VerificationStatusScreen role={selectedRole} />
          </TabsContent>
          <TabsContent value="penalties">
            <PenaltyHistoryScreen />
          </TabsContent>
          <TabsContent value="legal">
            <LegalReviewPanel />
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayout>
  );
};

export default ComplianceCenter;

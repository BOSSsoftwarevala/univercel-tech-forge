import React, { useState } from 'react';
import { 
  Scale, FileText, Shield, AlertTriangle, CheckCircle, Clock,
  Search, Filter, Download, Eye, Upload, Calendar, Users,
  Lock, Globe, FileCheck, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockDocuments = [
  { id: 'DOC-001', title: 'Privacy Policy v3.2', type: 'policy', status: 'approved', lastReview: '2024-01-10', nextReview: '2024-07-10' },
  { id: 'DOC-002', title: 'Terms of Service', type: 'terms', status: 'pending_review', lastReview: '2023-12-15', nextReview: '2024-01-15' },
  { id: 'DOC-003', title: 'GDPR Compliance Report', type: 'compliance', status: 'approved', lastReview: '2024-01-05', nextReview: '2024-04-05' },
  { id: 'DOC-004', title: 'NDA Template', type: 'contract', status: 'draft', lastReview: null, nextReview: null },
];

const kycRequests = [
  { id: 'KYC-001', user: 'FRA***042', docType: 'Business License', status: 'pending', submitted: '2024-01-14' },
  { id: 'KYC-002', user: 'RES***018', docType: 'ID Verification', status: 'approved', submitted: '2024-01-12' },
  { id: 'KYC-003', user: 'INF***089', docType: 'Tax Certificate', status: 'rejected', submitted: '2024-01-10' },
];

const incidents = [
  { id: 'INC-001', title: 'Data access inquiry', severity: 'medium', status: 'investigating', reported: '2024-01-14' },
  { id: 'INC-002', title: 'Payment dispute', severity: 'low', status: 'resolved', reported: '2024-01-10' },
];

const complianceMetrics = [
  { label: 'GDPR Compliance', value: 98, target: 95 },
  { label: 'Document Reviews', value: 87, target: 100 },
  { label: 'KYC Completion', value: 94, target: 90 },
  { label: 'Incident Resolution', value: 92, target: 85 },
];

export function LegalComplianceScreen() {
  const [activeTab, setActiveTab] = useState('documents');
  const isDark = true;

  const statusColors = {
    approved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    pending_review: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    draft: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    investigating: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    resolved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };

  const severityColors = {
    low: 'bg-slate-500/20 text-slate-400',
    medium: 'bg-amber-500/20 text-amber-400',
    high: 'bg-red-500/20 text-red-400',
  };

  const docTypeIcons = {
    policy: Shield,
    terms: FileText,
    compliance: FileCheck,
    contract: Lock,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Scale className="h-6 w-6 text-stone-500" />
            Legal & Compliance
          </h1>
          <p className="text-muted-foreground">Documents, KYC, and compliance management</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-1 text-amber-500 border-amber-500">
            <Clock className="h-3 w-3" />
            {mockDocuments.filter(d => d.status === 'pending_review').length} Pending Review
          </Badge>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Audit Log
          </Button>
          <Button className="bg-gradient-to-r from-stone-600 to-stone-500">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Compliance Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {complianceMetrics.map((metric) => {
          const isAboveTarget = metric.value >= metric.target;
          return (
            <div 
              key={metric.label}
              className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{metric.label}</span>
                {isAboveTarget ? (
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                )}
              </div>
              <div className="text-2xl font-bold mb-2">{metric.value}%</div>
              <Progress value={metric.value} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">Target: {metric.target}%</p>
            </div>
          );
        })}
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents
            <Badge variant="outline" className="text-[10px]">{mockDocuments.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="kyc" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            KYC Requests
            <Badge variant="outline" className="text-[10px]">{kycRequests.filter(k => k.status === 'pending').length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="incidents" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Incidents
          </TabsTrigger>
          <TabsTrigger value="gdpr" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            GDPR & Privacy
          </TabsTrigger>
        </TabsList>

        {/* Documents View */}
        <TabsContent value="documents" className="mt-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search documents..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter by Type
            </Button>
          </div>

          <div className="space-y-3">
            {mockDocuments.map((doc) => {
              const DocIcon = docTypeIcons[doc.type as keyof typeof docTypeIcons] || FileText;
              return (
                <div 
                  key={doc.id}
                  className={`p-4 rounded-xl border transition-all hover:border-stone-500/50 ${
                    isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                        <DocIcon className="h-5 w-5 text-stone-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{doc.id}</Badge>
                          <h3 className="font-semibold">{doc.title}</h3>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span>Type: {doc.type}</span>
                          {doc.lastReview && <span>Last review: {doc.lastReview}</span>}
                          {doc.nextReview && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Next: {doc.nextReview}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={statusColors[doc.status as keyof typeof statusColors]}>
                        {doc.status.replace('_', ' ')}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" className="bg-gradient-to-r from-stone-600 to-stone-500">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* KYC Requests View */}
        <TabsContent value="kyc" className="mt-4">
          <div className="space-y-3">
            {kycRequests.map((kyc) => (
              <div 
                key={kyc.id}
                className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      kyc.status === 'approved' ? 'bg-emerald-500/20' :
                      kyc.status === 'pending' ? 'bg-amber-500/20' : 'bg-red-500/20'
                    }`}>
                      {kyc.status === 'approved' ? (
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                      ) : kyc.status === 'pending' ? (
                        <Clock className="h-5 w-5 text-amber-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{kyc.id}</Badge>
                        <h3 className="font-semibold">{kyc.user}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {kyc.docType} • Submitted: {kyc.submitted}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={statusColors[kyc.status as keyof typeof statusColors]}>
                      {kyc.status}
                    </Badge>
                    {kyc.status === 'pending' && (
                      <>
                        <Button variant="outline" size="sm" className="border-emerald-500 text-emerald-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button variant="outline" size="sm" className="border-red-500 text-red-500">
                          <XCircle className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Incidents View */}
        <TabsContent value="incidents" className="mt-4">
          <div className="space-y-3">
            {incidents.map((incident) => (
              <div 
                key={incident.id}
                className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <AlertTriangle className={`h-6 w-6 ${
                      incident.severity === 'high' ? 'text-red-500' :
                      incident.severity === 'medium' ? 'text-amber-500' : 'text-slate-400'
                    }`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{incident.id}</Badge>
                        <h3 className="font-semibold">{incident.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">Reported: {incident.reported}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={severityColors[incident.severity as keyof typeof severityColors]}>
                      {incident.severity}
                    </Badge>
                    <Badge className={statusColors[incident.status as keyof typeof statusColors]}>
                      {incident.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* GDPR View */}
        <TabsContent value="gdpr" className="mt-4">
          <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-cyan-500" />
              GDPR & Privacy Dashboard
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                <p className="text-sm text-muted-foreground mb-1">Data Subject Requests</p>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-emerald-400">All processed</p>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                <p className="text-sm text-muted-foreground mb-1">Consent Rate</p>
                <p className="text-2xl font-bold">94%</p>
                <Progress value={94} className="h-1 mt-2" />
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                <p className="text-sm text-muted-foreground mb-1">Data Retention</p>
                <p className="text-2xl font-bold">Compliant</p>
                <p className="text-xs text-emerald-400">Last audit: Jan 2024</p>
              </div>
            </div>
            <div className={`h-32 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
              <div className="text-center">
                <Shield className="h-10 w-10 mx-auto text-cyan-500 mb-2" />
                <p className="text-muted-foreground">Privacy compliance overview</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * FRANCHISE OWNER SUPPORT & ASSIST SCREEN
 * Assist requests + Promise tracker
 * ALL ACTIONS LOGGED TO BOSS PANEL
 */

import React, { useState } from 'react';
import { 
  HeadphonesIcon, Plus, Handshake, Clock, CheckCircle2, 
  AlertTriangle, Upload, Sparkles, Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useFranchiseActionLogger } from '@/hooks/useFranchiseActionLogger';

interface AssistRequest {
  id: string;
  requestId: string;
  subject: string;
  description: string;
  status: 'open' | 'ai_review' | 'pending_approval' | 'resolved';
  slaStatus: 'on_track' | 'at_risk' | 'breached';
  createdAt: string;
}

interface Promise {
  id: string;
  promiseId: string;
  linkedOrderId: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'fulfilled' | 'escalated' | 'overdue';
}

const MOCK_REQUESTS: AssistRequest[] = [
  { id: '1', requestId: 'AST-2024-001', subject: 'Payment gateway integration issue', description: 'Unable to connect Razorpay...', status: 'ai_review', slaStatus: 'on_track', createdAt: '2024-01-20' },
  { id: '2', requestId: 'AST-2024-002', subject: 'Domain DNS configuration', description: 'Need help with DNS setup...', status: 'pending_approval', slaStatus: 'at_risk', createdAt: '2024-01-18' },
  { id: '3', requestId: 'AST-2024-003', subject: 'Mobile app crash on login', description: 'App crashes when...', status: 'resolved', slaStatus: 'on_track', createdAt: '2024-01-15' },
];

const MOCK_PROMISES: Promise[] = [
  { id: '1', promiseId: 'PRM-2024-001', linkedOrderId: 'PRJ-2024-001', description: 'Complete e-commerce setup', dueDate: '2024-01-25', status: 'pending' },
  { id: '2', promiseId: 'PRM-2024-002', linkedOrderId: 'PRJ-2024-002', description: 'Deliver CRM training', dueDate: '2024-01-22', status: 'overdue' },
  { id: '3', promiseId: 'PRM-2024-003', linkedOrderId: 'PRJ-2024-003', description: 'Final UAT sign-off', dueDate: '2024-01-20', status: 'fulfilled' },
  { id: '4', promiseId: 'PRM-2024-004', linkedOrderId: 'PRJ-2024-004', description: 'Payment collection', dueDate: '2024-01-28', status: 'escalated' },
];

export function FOSupportAssistScreen() {
  const [activeTab, setActiveTab] = useState('assist');
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [requestSubject, setRequestSubject] = useState('');
  const { logRaiseSupport } = useFranchiseActionLogger();

  const getStatusBadge = (status: AssistRequest['status']) => {
    switch (status) {
      case 'open': return <Badge className="bg-blue-500/20 text-blue-400">Open</Badge>;
      case 'ai_review': return <Badge className="bg-purple-500/20 text-purple-400"><Sparkles className="h-3 w-3 mr-1" />AI Review</Badge>;
      case 'pending_approval': return <Badge className="bg-amber-500/20 text-amber-400"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'resolved': return <Badge className="bg-emerald-500/20 text-emerald-400"><CheckCircle2 className="h-3 w-3 mr-1" />Resolved</Badge>;
    }
  };

  const getSLABadge = (sla: AssistRequest['slaStatus']) => {
    switch (sla) {
      case 'on_track': return <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">SLA: On Track</Badge>;
      case 'at_risk': return <Badge variant="outline" className="text-amber-400 border-amber-500/30">SLA: At Risk</Badge>;
      case 'breached': return <Badge variant="outline" className="text-destructive border-destructive/30">SLA: Breached</Badge>;
    }
  };

  const getPromiseStatusBadge = (status: Promise['status']) => {
    switch (status) {
      case 'pending': return <Badge className="bg-blue-500/20 text-blue-400"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'fulfilled': return <Badge className="bg-emerald-500/20 text-emerald-400"><CheckCircle2 className="h-3 w-3 mr-1" />Fulfilled</Badge>;
      case 'overdue': return <Badge className="bg-destructive/20 text-destructive"><AlertTriangle className="h-3 w-3 mr-1" />Overdue</Badge>;
      case 'escalated': return <Badge className="bg-amber-500/20 text-amber-400"><AlertTriangle className="h-3 w-3 mr-1" />Escalated</Badge>;
    }
  };

  const handleSubmitRequest = async () => {
    // Log action - THIS WILL APPEAR ON BOSS PANEL
    await logRaiseSupport(requestSubject || 'New Support Request', `AST-${Date.now()}`);
    
    toast.success('Assist request submitted. AI will analyze first.');
    setShowNewRequest(false);
    setRequestSubject('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <HeadphonesIcon className="h-6 w-6 text-primary" />
            Support & Assist
          </h1>
          <p className="text-muted-foreground text-sm">Manage assist requests and track promises</p>
        </div>
        <Dialog open={showNewRequest} onOpenChange={setShowNewRequest}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Raise Assist Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input 
                  placeholder="Brief description of issue" 
                  value={requestSubject}
                  onChange={(e) => setRequestSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Detailed explanation..." rows={4} />
              </div>
              <div className="space-y-2">
                <Label>Attach Files</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag files</p>
                </div>
              </div>
              <Card className="bg-muted/30 p-3">
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>AI will analyze your request first before manual review</span>
                </div>
              </Card>
              <Button className="w-full" onClick={handleSubmitRequest}>Submit Request</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="assist">Assist Requests</TabsTrigger>
          <TabsTrigger value="promises">Promise Tracker</TabsTrigger>
        </TabsList>

        {/* Assist Tab */}
        <TabsContent value="assist" className="mt-4 space-y-3">
          {MOCK_REQUESTS.map((request) => (
            <Card key={request.id} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-primary">{request.requestId}</span>
                      {getStatusBadge(request.status)}
                      {getSLABadge(request.slaStatus)}
                    </div>
                    <h3 className="font-semibold">{request.subject}</h3>
                    <p className="text-sm text-muted-foreground">{request.createdAt}</p>
                  </div>
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Promises Tab */}
        <TabsContent value="promises" className="mt-4 space-y-3">
          {MOCK_PROMISES.map((promise) => (
            <Card key={promise.id} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Handshake className="h-4 w-4 text-primary" />
                      <span className="font-mono text-sm text-primary">{promise.promiseId}</span>
                      {getPromiseStatusBadge(promise.status)}
                    </div>
                    <h3 className="font-semibold">{promise.description}</h3>
                    <p className="text-sm text-muted-foreground">
                      Linked: {promise.linkedOrderId} • Due: {promise.dueDate}
                    </p>
                  </div>
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

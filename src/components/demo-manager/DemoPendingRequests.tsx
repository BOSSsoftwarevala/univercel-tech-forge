import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, CheckCircle, XCircle, Clock, User, 
  Building, Calendar, MessageSquare, Eye
} from 'lucide-react';
import { toast } from 'sonner';

interface DemoRequest {
  id: string;
  requesterName: string;
  requesterRole: 'franchise' | 'reseller';
  demoName: string;
  category: string;
  requestedAt: string;
  reason: string;
  priority: 'high' | 'normal' | 'low';
  status: 'pending';
}

const mockRequests: DemoRequest[] = [
  {
    id: '1',
    requesterName: 'Mumbai Franchise',
    requesterRole: 'franchise',
    demoName: 'Restaurant Billing Software',
    category: 'Food & Beverage',
    requestedAt: '2 hours ago',
    reason: 'Customer wants to see live demo before purchase',
    priority: 'high',
    status: 'pending'
  },
  {
    id: '2',
    requesterName: 'Delhi Reseller',
    requesterRole: 'reseller',
    demoName: 'Gym Management System',
    category: 'Health & Fitness',
    requestedAt: '5 hours ago',
    reason: 'Need demo link for upcoming client meeting',
    priority: 'normal',
    status: 'pending'
  },
  {
    id: '3',
    requesterName: 'Bangalore Franchise',
    requesterRole: 'franchise',
    demoName: 'School ERP with Mobile App',
    category: 'Education',
    requestedAt: '1 day ago',
    reason: 'Requested for school chain demo presentation',
    priority: 'high',
    status: 'pending'
  },
  {
    id: '4',
    requesterName: 'Chennai Reseller',
    requesterRole: 'reseller',
    demoName: 'Hotel Booking System',
    category: 'Hospitality',
    requestedAt: '2 days ago',
    reason: 'Customer comparing with competitors',
    priority: 'low',
    status: 'pending'
  },
  {
    id: '5',
    requesterName: 'Pune Franchise',
    requesterRole: 'franchise',
    demoName: 'Real Estate CRM',
    category: 'Real Estate',
    requestedAt: '3 days ago',
    reason: 'Large builder group interested in bulk purchase',
    priority: 'high',
    status: 'pending'
  }
];

const DemoPendingRequests = () => {
  const [requests, setRequests] = useState<DemoRequest[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    toast.success('Demo request approved! Link has been shared with requester.');
  };

  const handleReject = (id: string) => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    setRequests(prev => prev.filter(r => r.id !== id));
    setSelectedRequest(null);
    setRejectReason('');
    toast.info('Demo request rejected. Requester has been notified.');
  };

  const getPriorityBadge = (priority: DemoRequest['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">High Priority</Badge>;
      case 'normal':
        return <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">Normal</Badge>;
      case 'low':
        return <Badge className="bg-slate-500/20 text-slate-400 border border-slate-500/30">Low</Badge>;
    }
  };

  const getRoleBadge = (role: DemoRequest['requesterRole']) => {
    switch (role) {
      case 'franchise':
        return <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30"><Building className="w-3 h-3 mr-1" />Franchise</Badge>;
      case 'reseller':
        return <Badge className="bg-teal-500/20 text-teal-400 border border-teal-500/30"><User className="w-3 h-3 mr-1" />Reseller</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileText className="w-7 h-7 text-cyan-400" />
            Pending Demo Requests
          </h1>
          <p className="text-slate-400 mt-1">Review and approve demo access requests from franchises and resellers</p>
        </div>
        <Badge className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-lg px-4 py-2">
          {requests.length} Pending
        </Badge>
      </div>

      {/* Requests List */}
      <div className="grid gap-4">
        {requests.map((request, index) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`bg-slate-900/50 backdrop-blur-xl transition-all ${
              request.priority === 'high' 
                ? 'border-red-500/30 hover:border-red-500/50' 
                : 'border-slate-700/50 hover:border-cyan-500/30'
            }`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-white">{request.demoName}</h3>
                      {getPriorityBadge(request.priority)}
                      {getRoleBadge(request.requesterRole)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-400">Requester:</span>
                        <span className="text-white">{request.requesterName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-400">Category:</span>
                        <span className="text-white">{request.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-400">Requested:</span>
                        <span className="text-white">{request.requestedAt}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-400">Status:</span>
                        <span className="text-orange-400">Awaiting Approval</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-slate-500 mt-0.5" />
                        <div>
                          <span className="text-slate-400 text-sm">Reason: </span>
                          <span className="text-slate-300 text-sm">{request.reason}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rejection Form */}
                    {selectedRequest === request.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30"
                      >
                        <p className="text-sm text-red-400 mb-2">Reason for rejection:</p>
                        <Textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Explain why this request is being rejected..."
                          className="bg-slate-900/50 border-slate-700 mb-3"
                        />
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleReject(request.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Confirm Rejection
                          </Button>
                          <Button 
                            variant="ghost" 
                            onClick={() => { setSelectedRequest(null); setRejectReason(''); }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Actions */}
                  {selectedRequest !== request.id && (
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        onClick={() => handleApprove(request.id)}
                        className="bg-emerald-500 hover:bg-emerald-600"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedRequest(request.id)}
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        variant="outline"
                        className="border-slate-500/30 text-slate-400 hover:bg-slate-500/10"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {requests.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">All Caught Up!</h3>
            <p className="text-slate-400">No pending demo requests at the moment.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DemoPendingRequests;

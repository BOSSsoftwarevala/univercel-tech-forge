import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Clock, CheckCircle2, XCircle, Pause, RefreshCw, AlertTriangle,
  User, Calendar, Tag, ChevronRight, Eye, MessageSquare, FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useEnterpriseAudit } from '@/hooks/useEnterpriseAudit';
import { toast } from 'sonner';

interface BuildRequest {
  id: string;
  title: string;
  description: string;
  requestedBy: string;
  requestedByRole: 'franchise' | 'reseller' | 'product_manager' | 'demo_manager';
  requestType: 'new_build' | 'update' | 'repair' | 'demo';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'rejected' | 'on_hold' | 'building';
  aiAnalysis: {
    softwareType: string;
    features: number;
    riskLevel: 'low' | 'medium' | 'high';
    estimatedTime: string;
  };
  createdAt: string;
  attachments: number;
}

const mockRequests: BuildRequest[] = [
  {
    id: 'REQ-001',
    title: 'Restaurant POS with Table Management',
    description: 'Need a complete restaurant management system with table tracking, kitchen display, and inventory...',
    requestedBy: 'John Smith',
    requestedByRole: 'franchise',
    requestType: 'new_build',
    priority: 'high',
    status: 'pending',
    aiAnalysis: { softwareType: 'Restaurant POS', features: 12, riskLevel: 'medium', estimatedTime: '4-6 days' },
    createdAt: '2 hours ago',
    attachments: 3
  },
  {
    id: 'REQ-002',
    title: 'Bug Fix: Login Screen Crash',
    description: 'Login screen crashes when user enters special characters in password field...',
    requestedBy: 'Demo Manager',
    requestedByRole: 'demo_manager',
    requestType: 'repair',
    priority: 'critical',
    status: 'pending',
    aiAnalysis: { softwareType: 'Auth Module', features: 1, riskLevel: 'low', estimatedTime: '1-2 hours' },
    createdAt: '30 min ago',
    attachments: 1
  },
  {
    id: 'REQ-003',
    title: 'Add Multi-Language Support',
    description: 'Add Arabic and French language options to the retail POS system...',
    requestedBy: 'Sarah Chen',
    requestedByRole: 'reseller',
    requestType: 'update',
    priority: 'medium',
    status: 'approved',
    aiAnalysis: { softwareType: 'Retail POS', features: 3, riskLevel: 'low', estimatedTime: '2-3 days' },
    createdAt: '1 day ago',
    attachments: 0
  },
  {
    id: 'REQ-004',
    title: 'Create Demo for Hospital CRM',
    description: 'Generate a demo version of hospital CRM for client presentation...',
    requestedBy: 'Product Manager',
    requestedByRole: 'product_manager',
    requestType: 'demo',
    priority: 'low',
    status: 'building',
    aiAnalysis: { softwareType: 'Hospital CRM', features: 8, riskLevel: 'low', estimatedTime: '1 day' },
    createdAt: '3 hours ago',
    attachments: 2
  },
];

const ValaRequestQueue = () => {
  const { logAction } = useEnterpriseAudit();
  const [requests, setRequests] = useState(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const handleApprove = useCallback(async (requestId: string) => {
    await logAction({
      action: 'approve_build_request',
      module: 'vala_builder',
      severity: 'high',
      target_id: requestId
    });
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'approved' as const } : r));
    toast.success('Request approved - AI will begin building');
  }, [logAction]);

  const handleReject = useCallback(async (requestId: string) => {
    await logAction({
      action: 'reject_build_request',
      module: 'vala_builder',
      severity: 'medium',
      target_id: requestId
    });
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected' as const } : r));
    toast.success('Request rejected');
  }, [logAction]);

  const handleHold = useCallback(async (requestId: string) => {
    await logAction({
      action: 'hold_build_request',
      module: 'vala_builder',
      severity: 'low',
      target_id: requestId
    });
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'on_hold' as const } : r));
    toast.success('Request placed on hold');
  }, [logAction]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending': return { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Clock };
      case 'approved': return { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: CheckCircle2 };
      case 'rejected': return { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle };
      case 'on_hold': return { color: 'bg-slate-500/20 text-slate-400 border-slate-500/30', icon: Pause };
      case 'building': return { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: RefreshCw };
      default: return { color: 'bg-slate-500/20 text-slate-400', icon: Clock };
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'franchise': return 'text-teal-400';
      case 'reseller': return 'text-purple-400';
      case 'product_manager': return 'text-blue-400';
      case 'demo_manager': return 'text-pink-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-400" />
            Request Queue
          </h2>
          <p className="text-slate-400 text-sm">Pending build requests awaiting Boss approval</p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
            {requests.filter(r => r.status === 'pending').length} Pending
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        {requests.map((request, index) => {
          const statusConfig = getStatusConfig(request.status);
          const StatusIcon = statusConfig.icon;

          return (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-slate-900/50 border-slate-700 hover:border-purple-500/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={statusConfig.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {request.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={getPriorityConfig(request.priority)}>
                          {request.priority}
                        </Badge>
                        <Badge variant="outline" className="text-slate-400 border-slate-600">
                          {request.requestType.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-white mb-1">{request.title}</h3>
                      <p className="text-sm text-slate-400 mb-3">{request.description}</p>

                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className={`flex items-center gap-1 ${getRoleColor(request.requestedByRole)}`}>
                          <User className="w-3 h-3" />
                          {request.requestedBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {request.createdAt}
                        </span>
                        {request.attachments > 0 && (
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {request.attachments} files
                          </span>
                        )}
                      </div>
                    </div>

                    {/* AI Analysis */}
                    <div className="ml-6 p-4 rounded-lg bg-slate-800/50 border border-slate-700 min-w-[200px]">
                      <h4 className="text-xs font-medium text-purple-400 mb-2">AI Analysis</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Type:</span>
                          <span className="text-white">{request.aiAnalysis.softwareType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Features:</span>
                          <span className="text-white">{request.aiAnalysis.features}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Risk:</span>
                          <Badge className={
                            request.aiAnalysis.riskLevel === 'low' ? 'bg-emerald-500/20 text-emerald-400' :
                            request.aiAnalysis.riskLevel === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-red-500/20 text-red-400'
                          }>{request.aiAnalysis.riskLevel}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">ETA:</span>
                          <span className="text-white">{request.aiAnalysis.estimatedTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {request.status === 'pending' && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800">
                      <Button
                        onClick={() => handleApprove(request.id)}
                        className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(request.id)}
                        variant="outline"
                        className="text-red-400 border-red-500/30 hover:bg-red-500/20"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleHold(request.id)}
                        variant="outline"
                        className="text-slate-400 border-slate-600 hover:bg-slate-800"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Hold
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-purple-400 hover:bg-purple-500/20 ml-auto"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Send Back
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ValaRequestQueue;

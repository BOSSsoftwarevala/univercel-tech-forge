import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, Bell, Clock, ChevronRight, X, 
  UserPlus, FileCheck, Shield, Loader2, RefreshCw,
  Users, Building2, Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface PendingRequest {
  id: string;
  type: 'reseller_application' | 'approval' | 'action_approval' | 'role_request';
  title: string;
  subtitle: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
  actionUrl?: string;
}

interface PendingCounts {
  resellerApplications: number;
  approvals: number;
  actionApprovals: number;
  total: number;
}

export function PendingRequestsBanner() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [counts, setCounts] = useState<PendingCounts>({
    resellerApplications: 0,
    approvals: 0,
    actionApprovals: 0,
    total: 0
  });
  const navigate = useNavigate();

  const fetchPendingRequests = async () => {
    setIsLoading(true);
    try {
      // Fetch reseller applications
      const { data: resellerApps, error: resellerError } = await supabase
        .from('reseller_applications')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch general approvals
      const { data: approvals, error: approvalsError } = await supabase
        .from('approvals')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch action approval queue
      const { data: actionApprovals, error: actionError } = await supabase
        .from('action_approval_queue')
        .select('*')
        .eq('approval_status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10);

      const requests: PendingRequest[] = [];

      // Process reseller applications
      if (resellerApps && !resellerError) {
        resellerApps.forEach(app => {
          requests.push({
            id: app.id,
            type: 'reseller_application',
            title: `Reseller Application: ${app.full_name || 'Unknown'}`,
            subtitle: app.email || 'New application',
            priority: 'high',
            createdAt: new Date(app.created_at),
            actionUrl: '/super-admin-system/role-switch?role=reseller_manager'
          });
        });
      }

      // Process general approvals
      if (approvals && !approvalsError) {
        approvals.forEach(approval => {
          requests.push({
            id: approval.id,
            type: 'approval',
            title: `${approval.request_type}`,
            subtitle: `Requested by user`,
            priority: approval.risk_score && approval.risk_score > 50 ? 'high' : 'medium',
            createdAt: new Date(approval.created_at || Date.now()),
            actionUrl: '/master-admin'
          });
        });
      }

      // Process action approvals
      if (actionApprovals && !actionError) {
        actionApprovals.forEach(action => {
          requests.push({
            id: action.id,
            type: 'action_approval',
            title: `${action.action_type}: ${action.action_target}`,
            subtitle: `Priority: ${action.priority || 'normal'}`,
            priority: action.priority === 'critical' ? 'high' : action.priority === 'high' ? 'medium' : 'low',
            createdAt: new Date(action.created_at || Date.now()),
            actionUrl: '/master-admin'
          });
        });
      }

      // Sort by date, newest first
      requests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      setPendingRequests(requests);
      setCounts({
        resellerApplications: resellerApps?.length || 0,
        approvals: approvals?.length || 0,
        actionApprovals: actionApprovals?.length || 0,
        total: requests.length
      });

    } catch (error) {
      console.error('Error fetching pending requests:', error);
      toast.error('Failed to load pending requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchPendingRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reseller_application': return <Building2 className="w-4 h-4" />;
      case 'approval': return <FileCheck className="w-4 h-4" />;
      case 'action_approval': return <Shield className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const handleViewRequest = (request: PendingRequest) => {
    if (request.actionUrl) {
      navigate(request.actionUrl);
    }
    setIsExpanded(false);
  };

  if (counts.total === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="relative z-50">
      {/* Main Banner - Always visible when there are pending requests */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-red-600/90 via-orange-600/90 to-amber-600/90 text-white"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <AlertTriangle className="w-6 h-6 text-white" />
              </motion.div>
              
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg">
                  {isLoading ? 'Loading...' : `${counts.total} Pending Requests`}
                </span>
                
                {!isLoading && (
                  <div className="hidden md:flex items-center gap-2">
                    {counts.resellerApplications > 0 && (
                      <Badge variant="secondary" className="bg-white/20 text-white border-none">
                        <Building2 className="w-3 h-3 mr-1" />
                        {counts.resellerApplications} Reseller
                      </Badge>
                    )}
                    {counts.approvals > 0 && (
                      <Badge variant="secondary" className="bg-white/20 text-white border-none">
                        <FileCheck className="w-3 h-3 mr-1" />
                        {counts.approvals} Approvals
                      </Badge>
                    )}
                    {counts.actionApprovals > 0 && (
                      <Badge variant="secondary" className="bg-white/20 text-white border-none">
                        <Shield className="w-3 h-3 mr-1" />
                        {counts.actionApprovals} Actions
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchPendingRequests}
                disabled={isLoading}
                className="text-white hover:bg-white/20"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="bg-white/20 hover:bg-white/30 text-white border-none gap-1"
              >
                {isExpanded ? 'Hide' : 'View All'}
                <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Expanded Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-zinc-900/95 backdrop-blur-lg border-b border-orange-500/30 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <ScrollArea className="max-h-[400px]">
                <div className="space-y-2">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
                    </div>
                  ) : pendingRequests.length === 0 ? (
                    <div className="text-center py-8 text-zinc-400">
                      No pending requests at this time
                    </div>
                  ) : (
                    pendingRequests.map((request) => (
                      <motion.div
                        key={request.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50 hover:border-orange-500/30 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getPriorityColor(request.priority)}`}>
                            {getTypeIcon(request.type)}
                          </div>
                          <div>
                            <p className="text-white font-medium">{request.title}</p>
                            <p className="text-sm text-zinc-400">{request.subtitle}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-xs text-zinc-500">
                            <Clock className="w-3 h-3" />
                            {getTimeAgo(request.createdAt)}
                          </div>
                          <Badge className={getPriorityColor(request.priority)}>
                            {request.priority}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewRequest(request)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
                          >
                            Review
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </ScrollArea>
              
              <div className="mt-4 pt-4 border-t border-zinc-700/50 flex justify-between items-center">
                <p className="text-sm text-zinc-400">
                  Showing {pendingRequests.length} pending requests • Auto-refreshes every 30s
                </p>
                <Button
                  onClick={() => navigate('/master-admin')}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                >
                  Go to Admin Panel
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

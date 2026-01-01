import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Lock, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import softwareValaLogo from '@/assets/software-vala-logo.png';

type RequestStatus = 'none' | 'pending' | 'approved' | 'rejected';

interface ChatRequest {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  reason: string;
  priority: 'normal' | 'urgent' | 'critical';
  status: RequestStatus;
  requestedAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
}

interface FloatingAIChatbotProps {
  userRole?: string;
  userName?: string;
  userId?: string;
}

const FloatingAIChatbot = ({ 
  userRole = 'user', 
  userName = 'User',
  userId = '1'
}: FloatingAIChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [requestReason, setRequestReason] = useState('');
  const [requestPriority, setRequestPriority] = useState<'normal' | 'urgent' | 'critical'>('normal');
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('none');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: 'Hello! I\'m your AI assistant. How can I help you today?' }
  ]);

  // Mock pending requests for super admin view
  const [pendingRequests, setPendingRequests] = useState<ChatRequest[]>([
    {
      id: '1',
      userId: '2',
      userName: 'John (Franchise)',
      userRole: 'franchise',
      reason: 'Need urgent help with lead assignment issue',
      priority: 'urgent',
      status: 'pending',
      requestedAt: new Date(Date.now() - 300000)
    },
    {
      id: '2',
      userId: '3',
      userName: 'Sarah (Reseller)',
      userRole: 'reseller',
      reason: 'Commission calculation query',
      priority: 'normal',
      status: 'pending',
      requestedAt: new Date(Date.now() - 600000)
    }
  ]);

  const isSuperAdmin = userRole === 'super_admin';
  const canChatDirectly = isSuperAdmin || requestStatus === 'approved';

  const handleSend = () => {
    if (!message.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: 'I understand your request. Let me help you with that...' 
      }]);
    }, 1000);
  };

  const handleRequestAccess = () => {
    if (!requestReason.trim()) return;
    
    // Simulate request submission
    setRequestStatus('pending');
    setShowRequestForm(false);
    
    // Simulate auto-approval after 3 seconds for demo
    setTimeout(() => {
      setRequestStatus('approved');
    }, 3000);
  };

  const handleApproveRequest = (requestId: string) => {
    setPendingRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'approved' as RequestStatus, approvedAt: new Date(), approvedBy: userName }
          : req
      )
    );
  };

  const handleRejectRequest = (requestId: string) => {
    setPendingRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'rejected' as RequestStatus }
          : req
      )
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'urgent': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const pendingCount = pendingRequests.filter(r => r.status === 'pending').length;

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="relative">
          {/* Outer glow rings */}
          <div className="absolute inset-0 rounded-full bg-emerald-500 opacity-20 animate-ping" />
          <div className="absolute -inset-2 rounded-full bg-emerald-500 opacity-10 animate-pulse" />
          
          {/* Main button */}
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-500/50 
                          shadow-[0_0_30px_hsl(145_80%_40%/0.4)]
                          group-hover:border-emerald-400 group-hover:shadow-[0_0_50px_hsl(145_80%_40%/0.6)]
                          transition-all duration-300 bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">SV</span>
          </div>
          
          {/* Notification badge for super admin */}
          {isSuperAdmin && pendingCount > 0 && (
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white"
            >
              {pendingCount}
            </motion.div>
          )}
          
          {/* Status indicator for non-admin */}
          {!isSuperAdmin && (
            <motion.div 
              className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${
                requestStatus === 'approved' ? 'bg-emerald-500' :
                requestStatus === 'pending' ? 'bg-amber-500' :
                'bg-slate-600'
              }`}
            >
              {requestStatus === 'approved' ? <CheckCircle className="w-3 h-3 text-white" /> :
               requestStatus === 'pending' ? <Clock className="w-3 h-3 text-white" /> :
               <Lock className="w-3 h-3 text-white" />}
            </motion.div>
          )}
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 rounded-lg bg-slate-900 
                       border border-emerald-500/30 text-sm text-emerald-400
                       opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap
                       shadow-[0_0_20px_hsl(145_80%_40%/0.2)]">
          {isSuperAdmin ? `AI Chat (${pendingCount} pending)` : 
           requestStatus === 'approved' ? 'AI Chat (Approved)' :
           requestStatus === 'pending' ? 'AI Chat (Pending Approval)' :
           'Request AI Chat'}
        </div>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-slate-900/95 backdrop-blur-xl 
                       border border-emerald-500/30 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500/50">
                  <img src={softwareValaLogo} alt="AI" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">AI Assistant</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-emerald-400">
                      {isSuperAdmin ? 'Admin Mode' : canChatDirectly ? 'Approved' : 'Request Access'}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Super Admin: Pending Requests View */}
            {isSuperAdmin && pendingCount > 0 && (
              <div className="p-3 border-b border-slate-700/50 bg-amber-500/10">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-medium text-amber-400">Pending Chat Requests</span>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {pendingRequests.filter(r => r.status === 'pending').map(req => (
                    <div key={req.id} className="bg-slate-800/50 rounded-lg p-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white font-medium">{req.userName}</span>
                        <Badge className={`text-[9px] ${getPriorityColor(req.priority)}`}>
                          {req.priority}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-slate-400 mb-2 line-clamp-1">{req.reason}</p>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          onClick={() => handleApproveRequest(req.id)}
                          className="h-6 text-[10px] bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 flex-1"
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleRejectRequest(req.id)}
                          className="h-6 text-[10px] bg-red-500/20 text-red-400 hover:bg-red-500/30 flex-1"
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Request Access Form (Non-Admin, Not Approved) */}
            {!canChatDirectly && !showRequestForm && requestStatus === 'none' && (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <Lock className="w-12 h-12 text-slate-500 mb-4" />
                <h4 className="text-white font-medium mb-2">Request AI Chat Access</h4>
                <p className="text-xs text-slate-400 mb-4">
                  AI chat requires approval for important queries. Submit a request to get started.
                </p>
                <Button 
                  onClick={() => setShowRequestForm(true)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  Request Access
                </Button>
              </div>
            )}

            {/* Request Form */}
            {!canChatDirectly && showRequestForm && (
              <div className="flex-1 p-4 space-y-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Reason for AI Chat</label>
                  <Textarea
                    value={requestReason}
                    onChange={(e) => setRequestReason(e.target.value)}
                    placeholder="Describe what you need help with..."
                    className="bg-slate-800/50 border-slate-700/50 text-white text-sm min-h-24"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Priority</label>
                  <div className="flex gap-2">
                    {(['normal', 'urgent', 'critical'] as const).map(p => (
                      <Button
                        key={p}
                        size="sm"
                        onClick={() => setRequestPriority(p)}
                        className={`flex-1 text-xs capitalize ${
                          requestPriority === p 
                            ? getPriorityColor(p) 
                            : 'bg-slate-800/50 text-slate-400'
                        }`}
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button 
                  onClick={handleRequestAccess}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                  disabled={!requestReason.trim()}
                >
                  Submit Request
                </Button>
              </div>
            )}

            {/* Pending Status */}
            {!canChatDirectly && requestStatus === 'pending' && (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-12 h-12 border-2 border-amber-500/30 border-t-amber-500 rounded-full mb-4"
                />
                <h4 className="text-white font-medium mb-2">Request Pending</h4>
                <p className="text-xs text-slate-400">
                  Your request is being reviewed by the admin. You'll be notified once approved.
                </p>
              </div>
            )}

            {/* Chat Interface (When Approved or Super Admin) */}
            {canChatDirectly && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                        msg.role === 'user'
                          ? 'bg-emerald-500/20 text-emerald-100 rounded-br-md'
                          : 'bg-slate-800 text-slate-200 rounded-bl-md'
                      }`}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
                  <div className="flex items-center gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask me anything..."
                      className="flex-1 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500"
                    />
                    <Button
                      onClick={handleSend}
                      size="sm"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingAIChatbot;
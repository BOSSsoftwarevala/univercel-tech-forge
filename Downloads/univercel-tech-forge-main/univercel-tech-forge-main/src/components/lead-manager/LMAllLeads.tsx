import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Download, Upload, Plus, MoreHorizontal,
  MapPin, Brain, Clock, Loader2, Eye, Edit, UserPlus, 
  Trash2, AlertTriangle, RefreshCw, Trophy, XCircle, Zap
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useLeadActions, DBLeadStatus, DBLeadSource, DBLeadPriority } from '@/hooks/useLeadActions';

interface DBLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  source: DBLeadSource;
  status: DBLeadStatus;
  priority: DBLeadPriority;
  country: string;
  city: string;
  ai_score: number | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string | null;
}

const LMAllLeads = () => {
  const [leads, setLeads] = useState<DBLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<DBLead | null>(null);
  
  const {
    state,
    isLoading: actionLoading,
    pendingConfirmation,
    createLead,
    updateLead,
    deleteLead,
    assignLead,
    changeStatus,
    markAsSpam,
    convertLead,
    triggerAIScoring,
    exportLeads,
    bulkAction,
    confirmPending,
    cancelPending,
  } = useLeadActions();

  // Form state for create modal
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'direct' as DBLeadSource,
    priority: 'warm' as DBLeadPriority,
    country: '',
    city: '',
  });

  // Fetch leads from DB
  const fetchLeads = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as DBLeadStatus);
      }
      if (sourceFilter !== 'all') {
        query = query.eq('source', sourceFilter as DBLeadSource);
      }
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setLeads((data || []) as DBLead[]);
    } catch (e) {
      console.error('Failed to fetch leads:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, sourceFilter, searchQuery]);

  // Refresh after state changes
  useEffect(() => {
    if (state === 'success') {
      fetchLeads();
    }
  }, [state]);

  const handleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(l => l.id));
    }
  };

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleCreate = async () => {
    const result = await createLead(newLeadForm);
    if (result.success) {
      setShowCreateModal(false);
      setNewLeadForm({
        name: '', email: '', phone: '', company: '',
        source: 'direct', priority: 'warm', country: '', city: ''
      });
    }
  };

  const handleAssign = async (assigneeId: string, role: string) => {
    if (selectedLead) {
      await assignLead(selectedLead.id, assigneeId, role);
      setShowAssignModal(false);
      setSelectedLead(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      assigned: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      contacted: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      follow_up: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      qualified: 'bg-green-500/20 text-green-400 border-green-500/30',
      negotiation: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      closed_won: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      closed_lost: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[status] || colors.new;
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      hot: 'bg-red-500/20 text-red-400 border-red-500/30',
      warm: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      cold: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[priority] || colors.warm;
  };

  return (
    <div className="space-y-4">
      {/* Confirmation Dialog */}
      <Dialog open={!!pendingConfirmation} onOpenChange={() => cancelPending()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              {pendingConfirmation?.action === 'delete' && 
                `Are you sure you want to delete "${pendingConfirmation?.leadName || 'this lead'}"?`}
              {pendingConfirmation?.action === 'spam' && 
                'Are you sure you want to mark this lead as spam?'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelPending}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={confirmPending}
              disabled={actionLoading}
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Lead Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Name *"
              value={newLeadForm.name}
              onChange={(e) => setNewLeadForm({...newLeadForm, name: e.target.value})}
            />
            <Input
              placeholder="Email *"
              type="email"
              value={newLeadForm.email}
              onChange={(e) => setNewLeadForm({...newLeadForm, email: e.target.value})}
            />
            <Input
              placeholder="Phone"
              value={newLeadForm.phone}
              onChange={(e) => setNewLeadForm({...newLeadForm, phone: e.target.value})}
            />
            <Input
              placeholder="Company"
              value={newLeadForm.company}
              onChange={(e) => setNewLeadForm({...newLeadForm, company: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-2">
              <Select 
                value={newLeadForm.source} 
                onValueChange={(v) => setNewLeadForm({...newLeadForm, source: v as DBLeadSource})}
              >
                <SelectTrigger><SelectValue placeholder="Source" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="direct">Direct</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="influencer">Influencer</SelectItem>
                  <SelectItem value="reseller">Reseller</SelectItem>
                </SelectContent>
              </Select>
              <Select 
                value={newLeadForm.priority} 
                onValueChange={(v) => setNewLeadForm({...newLeadForm, priority: v as DBLeadPriority})}
              >
                <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Country"
                value={newLeadForm.country}
                onChange={(e) => setNewLeadForm({...newLeadForm, country: e.target.value})}
              />
              <Input
                placeholder="City"
                value={newLeadForm.city}
                onChange={(e) => setNewLeadForm({...newLeadForm, city: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={actionLoading || !newLeadForm.name || !newLeadForm.email}>
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
              Create Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Modal */}
      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Lead: {selectedLead?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button className="w-full justify-start" variant="outline" onClick={() => handleAssign('user_1', 'sales')}>
              <UserPlus className="w-4 h-4 mr-2" />
              Assign to Sales Team
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => handleAssign('user_2', 'account_manager')}>
              <UserPlus className="w-4 h-4 mr-2" />
              Assign to Account Manager
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => handleAssign('user_3', 'support')}>
              <UserPlus className="w-4 h-4 mr-2" />
              Assign to Support
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="negotiation">Negotiation</SelectItem>
              <SelectItem value="closed_won">Won</SelectItem>
              <SelectItem value="closed_lost">Lost</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="direct">Direct</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="social">Social</SelectItem>
              <SelectItem value="influencer">Influencer</SelectItem>
              <SelectItem value="reseller">Reseller</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={fetchLeads} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => exportLeads([])}>
            <Download className="w-4 h-4 mr-1" />
            Export All
          </Button>
          <Button size="sm" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedLeads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/30 rounded-lg"
          >
            <span className="text-sm text-foreground font-medium">
              {selectedLeads.length} selected
            </span>
            <div className="flex-1" />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => bulkAction('assign', selectedLeads, { assigneeId: 'team_1', assigneeRole: 'sales' })}
            >
              <UserPlus className="w-4 h-4 mr-1" />
              Assign
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => bulkAction('export', selectedLeads)}
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => {
                bulkAction('delete', selectedLeads);
                setSelectedLeads([]);
              }}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leads Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
              <AlertTriangle className="w-12 h-12 mb-4" />
              <p className="text-lg font-medium">No leads found</p>
              <p className="text-sm">Try adjusting your filters or create a new lead</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-accent/50 border-b border-border">
                  <tr>
                    <th className="p-3 text-left">
                      <Checkbox
                        checked={selectedLeads.length === leads.length && leads.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">Lead</th>
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">Source</th>
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">AI Score</th>
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">Location</th>
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">Created</th>
                    <th className="p-3 text-left text-xs font-medium text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, index) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-border hover:bg-accent/30 transition-colors"
                    >
                      <td className="p-3">
                        <Checkbox
                          checked={selectedLeads.includes(lead.id)}
                          onCheckedChange={() => handleSelectLead(lead.id)}
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                            {lead.name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{lead.name}</p>
                            <p className="text-xs text-muted-foreground">{lead.email}</p>
                            {lead.company && <p className="text-xs text-muted-foreground">{lead.company}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="secondary" className="capitalize">{lead.source}</Badge>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          <Badge className={getStatusBadge(lead.status)}>
                            {lead.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={getPriorityBadge(lead.priority)}>
                            {lead.priority}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Brain className="w-4 h-4 text-primary" />
                          <span className={`font-medium ${
                            (lead.ai_score || 0) >= 80 ? 'text-green-500' :
                            (lead.ai_score || 0) >= 50 ? 'text-yellow-500' : 'text-muted-foreground'
                          }`}>
                            {lead.ai_score || '--'}%
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span>{lead.city || 'N/A'}, {lead.country || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {new Date(lead.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedLead(lead);
                              setShowAssignModal(true);
                            }}>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Assign
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => triggerAIScoring(lead.id)}>
                              <Zap className="w-4 h-4 mr-2" />
                              AI Score
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => changeStatus(lead.id, 'contacted')}>
                              <Eye className="w-4 h-4 mr-2" />
                              Mark Contacted
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => convertLead(lead.id)}>
                              <Trophy className="w-4 h-4 mr-2" />
                              Convert (Won)
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => markAsSpam(lead.id, 'Manual spam report')}>
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Mark Spam
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => deleteLead(lead.id, lead.name)}
                              className="text-red-500"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing {leads.length} leads</span>
        <span>Last refreshed: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default LMAllLeads;

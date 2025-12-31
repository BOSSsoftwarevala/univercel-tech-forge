import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, RefreshCw, Eye, UserPlus, 
  Phone, Building2, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface LocalLeadsOverviewProps {
  franchiseId: string;
  canAssign: boolean;
}

interface LocalLead {
  id: string;
  lead_name: string;
  status: string;
  region: string;
  created_at: string;
  assigned_to: string | null;
}

export function LocalLeadsOverview({ franchiseId, canAssign }: LocalLeadsOverviewProps) {
  const [leads, setLeads] = useState<LocalLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<LocalLead | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('franchise_leads')
        .select('id, lead_name, status, region, created_at')
        .eq('franchise_id', franchiseId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setLeads((data || []).map(d => ({ ...d, assigned_to: null })));
    } catch (err) {
      console.error('Error fetching leads:', err);
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (franchiseId) {
      fetchLeads();
    }
  }, [franchiseId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-blue-500/20 text-blue-400';
      case 'contacted': return 'bg-cyan-500/20 text-cyan-400';
      case 'demo_scheduled': return 'bg-purple-500/20 text-purple-400';
      case 'closed': return 'bg-emerald-500/20 text-emerald-400';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const handleAssignClick = (lead: LocalLead) => {
    if (!canAssign) {
      toast.error('You cannot assign leads in your current status');
      return;
    }
    setSelectedLead(lead);
  };

  const handleAssignToPartner = async (type: 'sales' | 'reseller') => {
    if (!selectedLead) return;

    toast.success(`Lead assigned to ${type}`, {
      description: `${selectedLead.lead_name} has been assigned successfully.`
    });
    
    // Log the action
    await supabase.from('audit_logs').insert({
      action: 'lead_assigned',
      module: 'franchise_leads',
      role: 'franchise',
      meta_json: { 
        lead_id: selectedLead.id, 
        assigned_type: type 
      }
    });

    setSelectedLead(null);
    fetchLeads();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-white">Local Leads</h3>
            <Badge variant="outline" className="ml-2">
              {leads.length} leads
            </Badge>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchLeads}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {!canAssign && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-4">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <p className="text-xs text-amber-400">
              Lead assignment is disabled while your account is not active.
            </p>
          </div>
        )}

        {leads.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No leads in your territory yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {leads.map((lead, index) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <span className="text-indigo-400 text-sm font-medium">
                      {lead.lead_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{lead.lead_name}</p>
                    <p className="text-xs text-slate-400">{lead.region || 'No region'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status.replace('_', ' ')}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAssignClick(lead)}
                    disabled={!canAssign || lead.status === 'closed'}
                    className="h-7"
                  >
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <p className="text-xs text-slate-500 mt-3 text-center">
          View only • Cannot edit or bulk upload leads
        </p>
      </motion.div>

      {/* Assign Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle>Assign Lead</DialogTitle>
            <DialogDescription>
              Assign {selectedLead?.lead_name} to a partner
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={() => handleAssignToPartner('sales')}
            >
              <Phone className="w-4 h-4 text-blue-400" />
              Assign to Sales Team
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={() => handleAssignToPartner('reseller')}
            >
              <Building2 className="w-4 h-4 text-purple-400" />
              Assign to Reseller
            </Button>
          </div>

          <p className="text-xs text-slate-500 text-center">
            You cannot edit lead status after assignment
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}

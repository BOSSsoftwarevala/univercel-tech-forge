import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Inbox, Search, Filter, Eye, Edit, Phone, Mail,
  MessageCircle, UserCog, Loader2, AlertCircle, Star, Clock
} from 'lucide-react';
import { useLeads, useUpdateLead, type LeadStatusType, type LeadSourceType, type LeadPriority } from '@/hooks/useLeadData';
import { formatDistanceToNow } from 'date-fns';

interface LMLeadInboxProps {
  onSelectLead?: (leadId: string) => void;
}

const LMLeadInbox = ({ onSelectLead }: LMLeadInboxProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatusType | undefined>();
  const { data: leads, isLoading } = useLeads({ status: statusFilter });

  const filtered = (leads || []).filter(l =>
    !searchTerm || l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.company && l.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const statusFilters: { label: string; value: LeadStatusType | undefined }[] = [
    { label: 'All', value: undefined },
    { label: 'New', value: 'new' },
    { label: 'Contacted', value: 'contacted' },
    { label: 'Qualified', value: 'qualified' },
    { label: 'Follow-Up', value: 'follow_up' },
    { label: 'Negotiation', value: 'negotiation' },
  ];

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case 'hot': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warm': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'cold': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lead Inbox</h1>
          <p className="text-muted-foreground">All incoming leads in one unified view</p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
          {isLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
          {filtered.length} Leads
        </Badge>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search leads by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>
        <div className="flex items-center gap-1">
          {statusFilters.map(sf => (
            <Button
              key={sf.label}
              size="sm"
              variant={statusFilter === sf.value ? 'default' : 'outline'}
              className="text-xs h-8"
              onClick={() => setStatusFilter(sf.value)}
            >
              {sf.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Leads List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center text-muted-foreground">
            <Inbox className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No leads found</p>
            <p className="text-xs mt-1">Adjust your filters or wait for new leads</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((lead, index) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card
                className="bg-card border-border hover:border-primary/30 transition-all cursor-pointer group"
                onClick={() => onSelectLead?.(lead.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Priority Indicator */}
                      <div className={`w-1.5 h-12 rounded-full ${lead.priority === 'hot' ? 'bg-red-500' : lead.priority === 'warm' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                      
                      {/* Lead Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground truncate">{lead.name}</span>
                          {lead.ai_score && lead.ai_score >= 80 && <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          {lead.company && <span className="text-xs text-muted-foreground">{lead.company}</span>}
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{lead.masked_email || lead.email}</span>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{lead.source}</Badge>
                        <Badge className={`text-xs ${getPriorityColor(lead.priority)}`}>{lead.priority || 'unset'}</Badge>
                        <Badge variant="secondary" className="text-xs">{lead.status.replace('_', ' ')}</Badge>
                      </div>

                      {/* Score */}
                      {lead.ai_score != null && (
                        <div className="text-center w-12">
                          <p className={`text-sm font-bold ${lead.ai_score >= 80 ? 'text-green-500' : lead.ai_score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {lead.ai_score}
                          </p>
                          <p className="text-[10px] text-muted-foreground">AI</p>
                        </div>
                      )}

                      {/* Time */}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground w-24 justify-end">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-1 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="ghost" className="h-7 w-7"><Eye className="w-3.5 h-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7"><Phone className="w-3.5 h-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7"><Mail className="w-3.5 h-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7"><MessageCircle className="w-3.5 h-3.5" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LMLeadInbox;

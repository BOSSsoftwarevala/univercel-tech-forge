import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  User, Building, Phone, Mail, Globe, Calendar, Star,
  TrendingUp, Activity, MessageSquare, Edit, Loader2,
  AlertCircle, Clock, Target, FileText, Send
} from 'lucide-react';
import { useLeads, useLeadActivities, useCreateLeadActivity, useUpdateLead } from '@/hooks/useLeadData';
import { formatDistanceToNow, format } from 'date-fns';

interface LMLeadDetailsProps {
  leadId?: string;
  onBack?: () => void;
}

const LMLeadDetails = ({ leadId, onBack }: LMLeadDetailsProps) => {
  const { data: leads, isLoading: leadsLoading } = useLeads();
  const lead = leadId ? (leads || []).find(l => l.id === leadId) : null;
  const { data: activities, isLoading: actLoading } = useLeadActivities(leadId);
  const createActivity = useCreateLeadActivity();
  const updateLead = useUpdateLead();
  const [noteText, setNoteText] = useState('');

  const handleAddNote = () => {
    if (!noteText.trim() || !leadId) return;
    createActivity.mutate({
      lead_id: leadId,
      activity_type: 'note',
      description: noteText,
      performed_by_role: 'lead_manager',
    });
    setNoteText('');
  };

  if (!leadId) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <User className="w-12 h-12 mb-3 opacity-30" />
        <p className="font-medium">Select a lead to view details</p>
        <p className="text-xs mt-1">Click on a lead from the Inbox or Pipeline</p>
      </div>
    );
  }

  if (leadsLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <AlertCircle className="w-10 h-10 mb-2" />
        <p>Lead not found</p>
      </div>
    );
  }

  const scoreColor = (lead.ai_score || 0) >= 80 ? 'text-green-500' : (lead.ai_score || 0) >= 60 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>← Back</Button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground">{lead.name}</h1>
            <p className="text-muted-foreground">{lead.company || 'No company'} • {lead.masked_email || lead.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`${lead.priority === 'hot' ? 'bg-red-500/20 text-red-400' : lead.priority === 'warm' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
            {lead.priority || 'unset'}
          </Badge>
          <Badge variant="secondary">{lead.status.replace('_', ' ')}</Badge>
          <Button size="sm"><Edit className="w-3.5 h-3.5 mr-1" /> Edit</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'AI Score', value: lead.ai_score ?? '—', icon: Star, color: scoreColor },
          { label: 'Conversion %', value: lead.conversion_probability ? `${lead.conversion_probability}%` : '—', icon: TrendingUp, color: 'text-green-500' },
          { label: 'Source', value: lead.source, icon: Globe, color: 'text-cyan-500' },
          { label: 'Created', value: formatDistanceToNow(new Date(lead.created_at), { addSuffix: true }), icon: Calendar, color: 'text-purple-500' },
          { label: 'Activities', value: (activities || []).length, icon: Activity, color: 'text-orange-500' },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div key={m.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="bg-card border-border">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-3.5 h-3.5 ${m.color}`} />
                    <span className="text-xs text-muted-foreground">{m.label}</span>
                  </div>
                  <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="activity">Activity ({(activities || []).length})</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: User, label: 'Name', value: lead.name },
                  { icon: Mail, label: 'Email', value: lead.masked_email || lead.email },
                  { icon: Phone, label: 'Phone', value: lead.masked_phone || lead.phone },
                  { icon: Building, label: 'Company', value: lead.company || '—' },
                  { icon: Globe, label: 'Country', value: lead.country || '—' },
                  { icon: Globe, label: 'City', value: lead.city || '—' },
                  { icon: Target, label: 'Industry', value: lead.industry || '—' },
                  { icon: FileText, label: 'Budget', value: lead.budget_range || '—' },
                  { icon: Calendar, label: 'Last Contact', value: lead.last_contact_at ? format(new Date(lead.last_contact_at), 'PPp') : '—' },
                  { icon: Calendar, label: 'Next Follow-Up', value: lead.next_follow_up ? format(new Date(lead.next_follow_up), 'PPp') : '—' },
                ].map((field) => {
                  const Icon = field.icon;
                  return (
                    <div key={field.label} className="flex items-center gap-3 p-3 rounded-lg bg-accent/30 border border-border">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">{field.label}</p>
                        <p className="text-sm font-medium text-foreground">{field.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {lead.requirements && (
                <div className="mt-4 p-3 rounded-lg bg-accent/30 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Requirements</p>
                  <p className="text-sm text-foreground">{lead.requirements}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              {actLoading ? (
                <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
              ) : (activities || []).length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No activity recorded</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(activities || []).map((act: any) => (
                    <div key={act.id} className="flex items-start gap-3 p-3 rounded-lg bg-accent/20 border border-border">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">{act.activity_type}</Badge>
                          <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(act.created_at), { addSuffix: true })}</span>
                        </div>
                        <p className="text-sm text-foreground mt-1">{act.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-4">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Add a note about this lead..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="bg-accent/30 border-border min-h-[80px]"
                />
              </div>
              <Button onClick={handleAddNote} disabled={!noteText.trim() || createActivity.isPending} size="sm">
                <Send className="w-3.5 h-3.5 mr-1" />
                {createActivity.isPending ? 'Saving...' : 'Add Note'}
              </Button>

              <div className="space-y-3 mt-4">
                {(activities || []).filter((a: any) => a.activity_type === 'note').map((note: any) => (
                  <div key={note.id} className="p-3 rounded-lg bg-accent/20 border border-border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">{note.performed_by_role || 'System'}</span>
                      <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}</span>
                    </div>
                    <p className="text-sm text-foreground">{note.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LMLeadDetails;

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Bell, CheckCircle, XCircle, Clock, AlertTriangle, Eye, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Lead {
  id: number;
  maskedName: string;
  maskedPhone: string;
  category: string;
  urgency: 'high' | 'medium' | 'low';
  source: string;
  time: string;
  followUp: string | null;
  status?: 'pending' | 'accepted' | 'rejected';
}

const initialLeads: Lead[] = [
  { 
    id: 1, 
    maskedName: 'R*** S***', 
    maskedPhone: '98***45',
    category: 'POS System', 
    urgency: 'high', 
    source: 'Website', 
    time: '2 min ago',
    followUp: 'Tomorrow 10 AM'
  },
  { 
    id: 2, 
    maskedName: 'A*** K***', 
    maskedPhone: '87***23',
    category: 'School ERP', 
    urgency: 'medium', 
    source: 'Referral', 
    time: '30 min ago',
    followUp: 'Today 4 PM'
  },
  { 
    id: 3, 
    maskedName: 'P*** M***', 
    maskedPhone: '91***67',
    category: 'Restaurant Software', 
    urgency: 'low', 
    source: 'Social Media', 
    time: '2 hours ago',
    followUp: null
  },
];

export const LeadInboxReseller = () => {
  const [buzzerEnabled, setBuzzerEnabled] = useState(true);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);

  const handleAcceptLead = (leadId: number) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, status: 'accepted' } : lead
    ));
    toast.success('Lead accepted! Full contact details are now visible.');
  };

  const handleRejectLead = (leadId: number) => {
    setLeads(prev => prev.filter(lead => lead.id !== leadId));
    toast.info('Lead rejected and returned to pool.');
  };

  const activeLeads = leads.filter(l => l.status !== 'rejected');
  const urgentCount = activeLeads.filter(l => l.urgency === 'high').length;
  const followUpCount = activeLeads.filter(l => l.followUp).length;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-mono font-bold text-foreground">Lead Inbox</h2>
          <p className="text-sm text-muted-foreground">Masked client data with buzzer alerts</p>
        </div>
        <motion.button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
            buzzerEnabled 
              ? 'bg-neon-green/10 border-neon-green/30 text-neon-green' 
              : 'bg-secondary/30 border-border/30 text-muted-foreground'
          }`}
          onClick={() => setBuzzerEnabled(!buzzerEnabled)}
          animate={buzzerEnabled ? {
            boxShadow: [
              '0 0 5px hsla(142, 71%, 45%, 0.2)',
              '0 0 15px hsla(142, 71%, 45%, 0.4)',
              '0 0 5px hsla(142, 71%, 45%, 0.2)'
            ]
          } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Bell className={`w-4 h-4 ${buzzerEnabled ? 'animate-pulse' : ''}`} />
          <span className="text-sm font-medium">Buzzer {buzzerEnabled ? 'ON' : 'OFF'}</span>
        </motion.button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="glass-panel border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-neon-blue/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-neon-blue" />
              </div>
              <div>
                <p className="text-2xl font-mono font-bold text-foreground">{activeLeads.length}</p>
                <p className="text-xs text-muted-foreground">Active Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-neon-red/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-neon-red" />
              </div>
              <div>
                <p className="text-2xl font-mono font-bold text-foreground">{urgentCount}</p>
                <p className="text-xs text-muted-foreground">Urgent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-neon-orange/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-neon-orange" />
              </div>
              <div>
                <p className="text-2xl font-mono font-bold text-foreground">{followUpCount}</p>
                <p className="text-xs text-muted-foreground">Follow-ups Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {activeLeads.map((lead, index) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`glass-panel border-border/30 hover:border-neon-blue/30 transition-all ${
                lead.urgency === 'high' ? 'border-l-4 border-l-neon-red' : 
                lead.urgency === 'medium' ? 'border-l-4 border-l-neon-orange' : ''
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {lead.urgency === 'high' && buzzerEnabled && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        >
                          <AlertTriangle className="w-5 h-5 text-neon-red" />
                        </motion.div>
                      )}
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-medium text-foreground">{lead.maskedName}</span>
                          <span className="text-xs text-muted-foreground">({lead.maskedPhone})</span>
                          <Badge variant={lead.urgency === 'high' ? 'destructive' : lead.urgency === 'medium' ? 'default' : 'secondary'}>
                            {lead.urgency}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{lead.category}</span>
                          <span>•</span>
                          <span>{lead.source}</span>
                          {lead.followUp && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-neon-orange">
                                <Calendar className="w-3 h-3" />
                                {lead.followUp}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{lead.time}</span>
                      {lead.status === 'accepted' ? (
                        <Badge className="bg-neon-green/20 text-neon-green">Accepted</Badge>
                      ) : (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
                            onClick={() => handleAcceptLead(lead.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-neon-red/30 text-neon-red hover:bg-neon-red/10"
                            onClick={() => handleRejectLead(lead.id)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

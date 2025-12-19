import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Bell, CheckCircle, XCircle, Clock, Filter, ChevronDown, Eye, UserPlus, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const leads = [
  { 
    id: 1, 
    maskedName: 'R*** V***', 
    category: 'POS System', 
    urgency: 'high', 
    source: 'Website', 
    time: '2 min ago',
    qualified: true,
    budget: '₹50K-1L'
  },
  { 
    id: 2, 
    maskedName: 'S*** P***', 
    category: 'School ERP', 
    urgency: 'medium', 
    source: 'Referral', 
    time: '15 min ago',
    qualified: true,
    budget: '₹1L-2L'
  },
  { 
    id: 3, 
    maskedName: 'A*** K***', 
    category: 'Hospital Management', 
    urgency: 'high', 
    source: 'Cold Call', 
    time: '30 min ago',
    qualified: false,
    budget: 'Not confirmed'
  },
  { 
    id: 4, 
    maskedName: 'M*** S***', 
    category: 'Restaurant Software', 
    urgency: 'low', 
    source: 'Social Media', 
    time: '1 hour ago',
    qualified: true,
    budget: '₹25K-50K'
  },
];

export const LeadIntakeBoard = () => {
  const [buzzerEnabled, setBuzzerEnabled] = useState(true);
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');

  const filteredLeads = selectedUrgency === 'all' 
    ? leads 
    : leads.filter(lead => lead.urgency === selectedUrgency);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-mono font-bold text-foreground">Lead Intake Board</h2>
          <p className="text-sm text-muted-foreground">Masked lead details with buzzer alerts</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Buzzer Toggle */}
          <motion.button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
              buzzerEnabled 
                ? 'bg-neon-red/10 border-neon-red/30 text-neon-red' 
                : 'bg-secondary/30 border-border/30 text-muted-foreground'
            }`}
            onClick={() => setBuzzerEnabled(!buzzerEnabled)}
            animate={buzzerEnabled ? {
              boxShadow: [
                '0 0 5px hsla(0, 100%, 50%, 0.2)',
                '0 0 15px hsla(0, 100%, 50%, 0.4)',
                '0 0 5px hsla(0, 100%, 50%, 0.2)'
              ]
            } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Bell className={`w-4 h-4 ${buzzerEnabled ? 'animate-pulse' : ''}`} />
            <span className="text-sm font-medium">Buzzer {buzzerEnabled ? 'ON' : 'OFF'}</span>
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <Card className="glass-panel border-border/30">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filter:</span>
            </div>
            <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
              <SelectTrigger className="w-40 bg-secondary/30 border-border/30">
                <SelectValue placeholder="Urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Urgency</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="outline" className="border-primary/30">
              {filteredLeads.length} Leads
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Lead Queue */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredLeads.map((lead, index) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`glass-panel border-border/30 hover:border-primary/30 transition-all ${
                lead.urgency === 'high' ? 'border-l-4 border-l-neon-red' : 
                lead.urgency === 'medium' ? 'border-l-4 border-l-neon-orange' : ''
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Urgency Indicator */}
                      {lead.urgency === 'high' && buzzerEnabled && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        >
                          <AlertTriangle className="w-5 h-5 text-neon-red" />
                        </motion.div>
                      )}
                      
                      {/* Lead Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-medium text-foreground">{lead.maskedName}</span>
                          <Badge variant={lead.urgency === 'high' ? 'destructive' : lead.urgency === 'medium' ? 'default' : 'secondary'}>
                            {lead.urgency}
                          </Badge>
                          {lead.qualified && (
                            <Badge variant="outline" className="border-neon-green/30 text-neon-green">
                              Qualified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{lead.category}</span>
                          <span>•</span>
                          <span>{lead.source}</span>
                          <span>•</span>
                          <span>{lead.budget}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{lead.time}</span>
                      <Button variant="outline" size="sm" className="border-neon-green/30 text-neon-green hover:bg-neon-green/10">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button variant="outline" size="sm" className="border-neon-red/30 text-neon-red hover:bg-neon-red/10">
                        <XCircle className="w-4 h-4 mr-1" />
                        Decline
                      </Button>
                      <Button variant="outline" size="sm" className="border-primary/30">
                        <UserPlus className="w-4 h-4 mr-1" />
                        Assign
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Auto-Assign Rules */}
      <Card className="glass-panel border-border/30">
        <CardHeader>
          <CardTitle className="text-sm text-foreground">Auto-Assign Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-secondary/20 border border-border/30">
              <p className="text-sm font-medium text-foreground">POS System Leads</p>
              <p className="text-xs text-muted-foreground">→ Mumbai Cluster</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/20 border border-border/30">
              <p className="text-sm font-medium text-foreground">School ERP Leads</p>
              <p className="text-xs text-muted-foreground">→ Pune Cluster</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/20 border border-border/30">
              <p className="text-sm font-medium text-foreground">High Urgency</p>
              <p className="text-xs text-muted-foreground">→ Top Performer</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

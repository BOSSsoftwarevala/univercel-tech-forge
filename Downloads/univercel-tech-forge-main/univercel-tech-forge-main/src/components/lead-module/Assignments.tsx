/**
 * LEAD ASSIGNMENTS
 * Auto-assign by country/role, manual override
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCheck, Globe, Briefcase, RefreshCw, Settings2, 
  Check, Users, ArrowRight 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface AssignmentRule {
  id: string;
  name: string;
  type: 'country' | 'role';
  condition: string;
  assignTo: string;
  enabled: boolean;
  leadsAssigned: number;
}

const assignmentRules: AssignmentRule[] = [
  { id: '1', name: 'India Leads', type: 'country', condition: 'Country = India', assignTo: 'Franchise Team India', enabled: true, leadsAssigned: 847 },
  { id: '2', name: 'US Leads', type: 'country', condition: 'Country = USA', assignTo: 'Sales Team US', enabled: true, leadsAssigned: 523 },
  { id: '3', name: 'Franchise Interest', type: 'role', condition: 'Interest = Franchise', assignTo: 'Franchise Sales', enabled: true, leadsAssigned: 312 },
  { id: '4', name: 'Reseller Interest', type: 'role', condition: 'Interest = Reseller', assignTo: 'Partner Team', enabled: true, leadsAssigned: 198 },
  { id: '5', name: 'Job Applicants', type: 'role', condition: 'Interest = Job', assignTo: 'HR Team', enabled: false, leadsAssigned: 156 },
  { id: '6', name: 'UK Leads', type: 'country', condition: 'Country = UK', assignTo: 'Sales Team UK', enabled: true, leadsAssigned: 312 },
];

const pendingAssignments = [
  { id: '1', leadName: 'John Smith', country: 'Canada', interest: 'Product', source: 'Google Ads' },
  { id: '2', leadName: 'Maria Garcia', country: 'Spain', interest: 'Franchise', source: 'Website' },
  { id: '3', leadName: 'Ahmed Hassan', country: 'Egypt', interest: 'Reseller', source: 'WhatsApp' },
];

export const Assignments: React.FC = () => {
  const [rules, setRules] = useState(assignmentRules);

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    toast.success('Assignment rule updated');
  };

  const handleManualAssign = (leadId: string) => {
    toast.success('Lead assigned manually');
  };

  const handleRunAutoAssign = () => {
    toast.success('Running auto-assignment...', { description: '23 leads assigned' });
  };

  const activeRules = rules.filter(r => r.enabled).length;
  const totalAssigned = rules.reduce((sum, r) => sum + r.leadsAssigned, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            Lead Assignments
          </h1>
          <p className="text-sm text-muted-foreground">Auto-assign by country & role with manual override</p>
        </div>
        <Button onClick={handleRunAutoAssign} className="bg-emerald-600 hover:bg-emerald-700">
          <RefreshCw className="w-4 h-4 mr-2" />
          Run Auto-Assign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-emerald-500/10 border-emerald-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Settings2 className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-2xl font-bold text-emerald-400">{activeRules}</p>
                <p className="text-xs text-muted-foreground">Active Rules</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-blue-400">{totalAssigned.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Leads Assigned</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Globe className="w-8 h-8 text-amber-400" />
              <div>
                <p className="text-2xl font-bold text-amber-400">{pendingAssignments.length}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignment Rules */}
      <Card className="bg-card/80 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Assignment Rules</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {rules.map((rule, idx) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${rule.type === 'country' ? 'bg-blue-500/20' : 'bg-violet-500/20'} flex items-center justify-center`}>
                      {rule.type === 'country' ? <Globe className="w-5 h-5 text-blue-400" /> : <Briefcase className="w-5 h-5 text-violet-400" />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{rule.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{rule.condition}</Badge>
                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{rule.assignTo}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{rule.leadsAssigned} leads</span>
                    <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Manual Assignments */}
      <Card className="bg-card/80 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Badge variant="outline" className="bg-amber-500/20 text-amber-400">{pendingAssignments.length}</Badge>
            Pending Manual Assignment
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {pendingAssignments.map((lead, idx) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">{lead.leadName}</p>
                  <p className="text-xs text-muted-foreground">{lead.country} • {lead.interest} • {lead.source}</p>
                </div>
                <Button size="sm" onClick={() => handleManualAssign(lead.id)}>
                  <UserCheck className="w-4 h-4 mr-1" />
                  Assign
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

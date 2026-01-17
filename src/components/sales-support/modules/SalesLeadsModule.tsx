import { useState } from "react";
import { motion } from "framer-motion";
import { Inbox, UserPlus, ArrowRight, Flame, Sun, Snowflake, Target, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type LeadStage = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";

interface SalesLead {
  id: string;
  company: string;
  contact: string;
  email: string;
  value: number;
  urgency: "hot" | "warm" | "cold";
  stage: LeadStage;
  assignedTo: string | null;
  aiWinProbability: number;
  source: string;
  createdAt: string;
}

const SalesLeadsModule = () => {
  const [leads, setLeads] = useState<SalesLead[]>([
    { id: "LD-001", company: "Tech Solutions Ltd", contact: "John Davidson", email: "john@techsol.com", value: 25000, urgency: "hot", stage: "proposal", assignedTo: "Alex Thompson", aiWinProbability: 78, source: "Website", createdAt: "2 days ago" },
    { id: "LD-002", company: "Healthcare Plus", contact: "Maria Santos", email: "maria@hcplus.com", value: 45000, urgency: "hot", stage: "qualified", assignedTo: "Maria Garcia", aiWinProbability: 85, source: "Referral", createdAt: "3 days ago" },
    { id: "LD-003", company: "Retail Mart", contact: "Lisa Patterson", email: "lisa@retailmart.com", value: 12000, urgency: "warm", stage: "contacted", assignedTo: "David Lee", aiWinProbability: 45, source: "SEO", createdAt: "5 days ago" },
    { id: "LD-004", company: "EduLearn Academy", contact: "Robert Kim", email: "robert@edulearn.com", value: 35000, urgency: "warm", stage: "new", assignedTo: null, aiWinProbability: 32, source: "Demo Request", createdAt: "1 day ago" },
    { id: "LD-005", company: "Global Logistics", contact: "James Turner", email: "james@globallog.com", value: 80000, urgency: "cold", stage: "new", assignedTo: null, aiWinProbability: 22, source: "Cold Email", createdAt: "Today" },
  ]);

  const salesReps = ["Alex Thompson", "Maria Garcia", "David Lee", "Sarah Miller", "John Brown"];

  const handleAssignRep = (leadId: string, rep: string) => {
    toast.loading("Assigning rep...", { id: `assign-${leadId}` });
    setTimeout(() => {
      setLeads(leads.map(l => l.id === leadId ? { ...l, assignedTo: rep, stage: l.stage === "new" ? "contacted" : l.stage } : l));
      toast.success(`Assigned to ${rep}`, { id: `assign-${leadId}` });
    }, 500);
  };

  const handleChangeStage = (leadId: string, newStage: LeadStage) => {
    toast.loading("Updating stage...", { id: `stage-${leadId}` });
    setTimeout(() => {
      setLeads(leads.map(l => l.id === leadId ? { ...l, stage: newStage } : l));
      toast.success(`Stage updated to ${newStage}`, { id: `stage-${leadId}` });
    }, 500);
  };

  const handleConvertToCustomer = (leadId: string) => {
    toast.loading("Converting to customer...", { id: `convert-${leadId}` });
    setTimeout(() => {
      setLeads(leads.map(l => l.id === leadId ? { ...l, stage: "won" } : l));
      toast.success("Lead converted to customer!", { id: `convert-${leadId}` });
    }, 800);
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "hot": return { icon: Flame, color: "bg-red-500/20 text-red-300", label: "HOT" };
      case "warm": return { icon: Sun, color: "bg-amber-500/20 text-amber-300", label: "WARM" };
      default: return { icon: Snowflake, color: "bg-blue-500/20 text-blue-300", label: "COLD" };
    }
  };

  const getStageColor = (stage: LeadStage) => {
    switch (stage) {
      case "new": return "bg-purple-500/20 text-purple-300";
      case "contacted": return "bg-blue-500/20 text-blue-300";
      case "qualified": return "bg-cyan-500/20 text-cyan-300";
      case "proposal": return "bg-amber-500/20 text-amber-300";
      case "won": return "bg-emerald-500/20 text-emerald-300";
      case "lost": return "bg-red-500/20 text-red-300";
      default: return "bg-slate-500/20 text-slate-300";
    }
  };

  const totalPipeline = leads.filter(l => !["won", "lost"].includes(l.stage)).reduce((sum, l) => sum + l.value, 0);
  const hotLeads = leads.filter(l => l.urgency === "hot" && !["won", "lost"].includes(l.stage)).length;
  const avgWinProb = Math.round(leads.filter(l => !["won", "lost"].includes(l.stage)).reduce((sum, l) => sum + l.aiWinProbability, 0) / leads.filter(l => !["won", "lost"].includes(l.stage)).length);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-100">Sales Leads Pipeline</h2>
          <p className="text-slate-400">Track leads through stages with AI win probability</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4 text-center">
            <Inbox className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-cyan-100">{leads.filter(l => !["won", "lost"].includes(l.stage)).length}</div>
            <div className="text-xs text-slate-400">Active Leads</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-red-500/20">
          <CardContent className="p-4 text-center">
            <Flame className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-100">{hotLeads}</div>
            <div className="text-xs text-slate-400">Hot Leads</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-100">${(totalPipeline / 1000).toFixed(0)}K</div>
            <div className="text-xs text-slate-400">Pipeline Value</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-100">{avgWinProb}%</div>
            <div className="text-xs text-slate-400">Avg Win Prob</div>
          </CardContent>
        </Card>
      </div>

      {/* Leads List */}
      <Card className="bg-slate-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-100">Lead Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leads.map((lead, index) => {
              const urgency = getUrgencyBadge(lead.urgency);
              const UrgencyIcon = urgency.icon;
              return (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-cyan-400 text-sm">{lead.id}</span>
                      <Badge className={urgency.color}>
                        <UrgencyIcon className="w-3 h-3 mr-1" />
                        {urgency.label}
                      </Badge>
                      <Badge className={getStageColor(lead.stage)}>{lead.stage}</Badge>
                      <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
                        AI: {lead.aiWinProbability}% win
                      </Badge>
                    </div>
                    <div className="text-lg font-bold text-emerald-300">${lead.value.toLocaleString()}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-100">{lead.company}</h4>
                      <p className="text-sm text-slate-400">{lead.contact} • {lead.email} • {lead.source} • {lead.createdAt}</p>
                      {lead.assignedTo && <p className="text-sm text-cyan-400">Assigned: {lead.assignedTo}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                      {!lead.assignedTo && (
                        <Select onValueChange={(rep) => handleAssignRep(lead.id, rep)}>
                          <SelectTrigger className="w-36 bg-slate-700/50 border-slate-600">
                            <SelectValue placeholder="Assign rep..." />
                          </SelectTrigger>
                          <SelectContent>
                            {salesReps.map(rep => (
                              <SelectItem key={rep} value={rep}>{rep}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {!["won", "lost"].includes(lead.stage) && (
                        <Select value={lead.stage} onValueChange={(stage) => handleChangeStage(lead.id, stage as LeadStage)}>
                          <SelectTrigger className="w-32 bg-slate-700/50 border-slate-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="qualified">Qualified</SelectItem>
                            <SelectItem value="proposal">Proposal</SelectItem>
                            <SelectItem value="won">Won</SelectItem>
                            <SelectItem value="lost">Lost</SelectItem>
                          </SelectContent>
                        </Select>
                      )}

                      {lead.stage === "proposal" && (
                        <Button size="sm" onClick={() => handleConvertToCustomer(lead.id)} className="bg-emerald-500 hover:bg-emerald-600">
                          <ArrowRight className="w-3 h-3 mr-1" />
                          Convert
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesLeadsModule;

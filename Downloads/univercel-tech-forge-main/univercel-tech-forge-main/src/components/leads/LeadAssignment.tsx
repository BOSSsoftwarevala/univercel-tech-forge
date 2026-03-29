import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  UserPlus, 
  Users, 
  Search, 
  Sparkles, 
  MapPin,
  Target,
  TrendingUp,
  Star,
  ArrowRight,
  CheckCircle,
  Building,
  Clock
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Lead {
  id: string;
  name: string;
  company: string;
  region: string;
  priority: string;
  aiScore: number;
  industry: string;
  status: string;
}

interface Assignee {
  id: string;
  name: string;
  role: string;
  region: string;
  activeLeads: number;
  conversionRate: number;
  aiMatchScore: number;
  availability: string;
}

const LeadAssignment = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const unassignedLeads: Lead[] = [
    { id: "1", name: "Rajesh Kumar", company: "TechCorp", region: "Mumbai", priority: "hot", aiScore: 92, industry: "Technology", status: "new" },
    { id: "2", name: "Priya Sharma", company: "HealthPlus", region: "Delhi", priority: "hot", aiScore: 87, industry: "Healthcare", status: "new" },
    { id: "3", name: "Amit Patel", company: "RetailMax", region: "Ahmedabad", priority: "warm", aiScore: 78, industry: "Retail", status: "new" },
    { id: "4", name: "Sneha Reddy", company: "EduTech", region: "Bangalore", priority: "warm", aiScore: 75, industry: "Education", status: "new" },
    { id: "5", name: "Vikram Singh", company: "LogiFlow", region: "Jaipur", priority: "cold", aiScore: 65, industry: "Logistics", status: "new" },
  ];

  const assignees: Assignee[] = [
    { id: "1", name: "Sales Team Alpha", role: "sales", region: "Mumbai", activeLeads: 12, conversionRate: 28, aiMatchScore: 95, availability: "available" },
    { id: "2", name: "Franchise Partner Delhi", role: "franchise", region: "Delhi", activeLeads: 8, conversionRate: 32, aiMatchScore: 88, availability: "available" },
    { id: "3", name: "Reseller West", role: "reseller", region: "Ahmedabad", activeLeads: 15, conversionRate: 24, aiMatchScore: 82, availability: "busy" },
    { id: "4", name: "Sales Team Beta", role: "sales", region: "Bangalore", activeLeads: 10, conversionRate: 30, aiMatchScore: 78, availability: "available" },
    { id: "5", name: "Franchise Partner North", role: "franchise", region: "Jaipur", activeLeads: 6, conversionRate: 35, aiMatchScore: 72, availability: "available" },
  ];

  const handleAssign = (lead: Lead, assignee: Assignee) => {
    toast({
      title: "Lead Assigned",
      description: `${lead.name} has been assigned to ${assignee.name}`,
    });
    setIsDialogOpen(false);
    setSelectedLead(null);
  };

  const handleAutoAssign = (lead: Lead) => {
    const bestMatch = assignees
      .filter(a => a.availability === "available")
      .sort((a, b) => b.aiMatchScore - a.aiMatchScore)[0];
    
    if (bestMatch) {
      toast({
        title: "AI Auto-Assignment",
        description: `${lead.name} auto-assigned to ${bestMatch.name} (${bestMatch.aiMatchScore}% match)`,
      });
    }
  };

  const filteredAssignees = assignees.filter(a => 
    filterRole === "all" || a.role === filterRole
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "hot": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "warm": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "cold": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "";
    }
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "available": return "bg-neon-green/20 text-neon-green";
      case "busy": return "bg-orange-500/20 text-orange-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lead Assignment</h1>
          <p className="text-muted-foreground">Assign leads to sales, franchises, or resellers</p>
        </div>
        <Button className="bg-neon-teal hover:bg-neon-teal/90 text-background">
          <Sparkles className="w-4 h-4 mr-2" />
          AI Auto-Assign All
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{unassignedLeads.length}</p>
            <p className="text-xs text-muted-foreground">Unassigned</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-neon-green">{assignees.filter(a => a.availability === "available").length}</p>
            <p className="text-xs text-muted-foreground">Available Agents</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">28%</p>
            <p className="text-xs text-muted-foreground">Avg Conversion</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-neon-teal">87%</p>
            <p className="text-xs text-muted-foreground">AI Match Rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unassigned Leads */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Unassigned Leads
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {unassignedLeads.map((lead, index) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-background/30 hover:bg-background/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{lead.name}</p>
                      <Badge className={getPriorityColor(lead.priority)}>{lead.priority}</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {lead.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {lead.region}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-primary">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {lead.aiScore}%
                    </Badge>
                    <Button 
                      size="sm" 
                      onClick={() => { setSelectedLead(lead); setIsDialogOpen(true); }}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <UserPlus className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAutoAssign(lead)}
                      className="border-neon-teal text-neon-teal hover:bg-neon-teal/10"
                    >
                      <Sparkles className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Available Assignees */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Available Assignees
              </CardTitle>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-[120px] h-8 text-xs bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="franchise">Franchise</SelectItem>
                  <SelectItem value="reseller">Reseller</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredAssignees.map((assignee, index) => (
              <motion.div
                key={assignee.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-background/30 hover:bg-background/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{assignee.name}</p>
                      <Badge className={getAvailabilityColor(assignee.availability)}>
                        {assignee.availability}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">{assignee.role}</Badge>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {assignee.region}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {assignee.activeLeads} leads
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-neon-green">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {assignee.conversionRate}%
                      </Badge>
                      <Badge className="bg-neon-teal/20 text-neon-teal">
                        <Star className="w-3 h-3 mr-1" />
                        {assignee.aiMatchScore}
                      </Badge>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Assignment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Assign Lead
            </DialogTitle>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-4 py-4">
              <div className="p-4 rounded-lg bg-background/50 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-medium text-foreground">{selectedLead.name}</p>
                  <Badge className={getPriorityColor(selectedLead.priority)}>{selectedLead.priority}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{selectedLead.company} • {selectedLead.region}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">AI Recommended Assignees</p>
                {filteredAssignees
                  .filter(a => a.availability === "available")
                  .sort((a, b) => b.aiMatchScore - a.aiMatchScore)
                  .slice(0, 3)
                  .map((assignee, index) => (
                    <motion.div
                      key={assignee.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-colors cursor-pointer"
                      onClick={() => handleAssign(selectedLead, assignee)}
                    >
                      <div className="flex items-center gap-3">
                        {index === 0 && <Sparkles className="w-4 h-4 text-neon-teal" />}
                        <div>
                          <p className="text-sm font-medium text-foreground">{assignee.name}</p>
                          <p className="text-xs text-muted-foreground">{assignee.role} • {assignee.region}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-neon-teal/20 text-neon-teal">{assignee.aiMatchScore}% match</Badge>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadAssignment;

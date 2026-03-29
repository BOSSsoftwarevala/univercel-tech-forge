import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  BellRing, 
  User, 
  Building, 
  Phone, 
  Mail, 
  MapPin,
  Flame,
  ThermometerSun,
  Snowflake,
  Check,
  X,
  Clock,
  Volume2,
  VolumeX,
  Sparkles,
  Globe,
  Target
} from "lucide-react";

interface IncomingLead {
  id: string;
  name: string;
  company: string;
  maskedEmail: string;
  maskedPhone: string;
  source: string;
  region: string;
  priority: string;
  aiScore: number;
  industry: string;
  requirements: string;
  receivedAt: string;
  idleMinutes: number;
}

const LeadIncoming = () => {
  const { toast } = useToast();
  const [buzzerActive, setBuzzerActive] = useState(true);
  const [leads, setLeads] = useState<IncomingLead[]>([
    { id: "1", name: "Rajesh Kumar", company: "TechCorp India", maskedEmail: "ra****@techcorp.com", maskedPhone: "+91 98****23", source: "Website", region: "Mumbai", priority: "hot", aiScore: 92, industry: "Technology", requirements: "CRM solution for 500+ users", receivedAt: "Just now", idleMinutes: 0 },
    { id: "2", name: "Priya Sharma", company: "HealthPlus Pvt", maskedEmail: "pr****@health.com", maskedPhone: "+91 87****45", source: "Demo Request", region: "Delhi", priority: "hot", aiScore: 87, industry: "Healthcare", requirements: "Patient management system", receivedAt: "2 min ago", idleMinutes: 2 },
    { id: "3", name: "Amit Patel", company: "RetailMax", maskedEmail: "am****@retail.com", maskedPhone: "+91 99****67", source: "Influencer", region: "Ahmedabad", priority: "warm", aiScore: 78, industry: "Retail", requirements: "Inventory management", receivedAt: "5 min ago", idleMinutes: 5 },
    { id: "4", name: "Sneha Reddy", company: "EduTech Solutions", maskedEmail: "sn****@edutech.com", maskedPhone: "+91 88****12", source: "Reseller", region: "Bangalore", priority: "warm", aiScore: 75, industry: "Education", requirements: "Learning management system", receivedAt: "8 min ago", idleMinutes: 8 },
  ]);

  const newLeadsCount = leads.filter(l => l.idleMinutes < 3).length;

  useEffect(() => {
    if (newLeadsCount > 0 && buzzerActive) {
      // Buzzer effect
    }
  }, [newLeadsCount, buzzerActive]);

  const handleAccept = (lead: IncomingLead) => {
    toast({
      title: "Lead Accepted",
      description: `${lead.name} from ${lead.company} has been assigned to you.`,
    });
    setLeads(prev => prev.filter(l => l.id !== lead.id));
  };

  const handleReject = (lead: IncomingLead) => {
    toast({
      title: "Lead Rejected",
      description: `${lead.name} will be reassigned to another team member.`,
      variant: "destructive",
    });
    setLeads(prev => prev.filter(l => l.id !== lead.id));
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "hot": return <Flame className="w-5 h-5 text-red-400" />;
      case "warm": return <ThermometerSun className="w-5 h-5 text-orange-400" />;
      case "cold": return <Snowflake className="w-5 h-5 text-blue-400" />;
      default: return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "hot": return "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse";
      case "warm": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "cold": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Buzzer Alert Banner */}
      <AnimatePresence>
        {newLeadsCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg border-2 ${buzzerActive ? 'border-neon-green bg-neon-green/10 animate-pulse' : 'border-neon-green/50 bg-neon-green/5'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BellRing className={`w-6 h-6 text-neon-green ${buzzerActive ? 'animate-bounce' : ''}`} />
                <div>
                  <p className="font-bold text-neon-green">NEW LEADS INCOMING!</p>
                  <p className="text-sm text-neon-green/80">{newLeadsCount} new lead(s) require immediate attention</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setBuzzerActive(!buzzerActive)}
                  className="border-neon-green/50 text-neon-green hover:bg-neon-green/20"
                >
                  {buzzerActive ? <Volume2 className="w-4 h-4 mr-1" /> : <VolumeX className="w-4 h-4 mr-1" />}
                  {buzzerActive ? "Mute" : "Unmute"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Incoming Leads</h1>
          <p className="text-muted-foreground">Accept or route new leads with AI-powered scoring</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-primary/20 text-primary border border-primary/30">
            <Clock className="w-3 h-3 mr-1" />
            {leads.length} pending
          </Badge>
        </div>
      </div>

      {/* Lead Cards */}
      <div className="grid gap-4">
        {leads.map((lead, index) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Card className={`glass-card border-2 transition-all ${
              lead.idleMinutes < 3 
                ? 'border-neon-green/50 shadow-lg shadow-neon-green/10' 
                : lead.idleMinutes > 5 
                ? 'border-orange-500/50' 
                : 'border-border/50'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-foreground">{lead.name}</h3>
                          {getPriorityIcon(lead.priority)}
                          <Badge className={getPriorityBadge(lead.priority)}>
                            {lead.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building className="w-4 h-4" />
                          {lead.company}
                          <span className="text-primary">•</span>
                          {lead.industry}
                        </div>
                      </div>
                    </div>

                    {/* Contact Info (Masked) */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground font-mono">{lead.maskedEmail}</span>
                        <Badge variant="outline" className="text-xs">Masked</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground font-mono">{lead.maskedPhone}</span>
                        <Badge variant="outline" className="text-xs">Masked</Badge>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-background/50">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <Globe className="w-3 h-3" />
                          Source
                        </div>
                        <p className="text-sm font-medium text-foreground">{lead.source}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-background/50">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <MapPin className="w-3 h-3" />
                          Region
                        </div>
                        <p className="text-sm font-medium text-foreground">{lead.region}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-background/50">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <Clock className="w-3 h-3" />
                          Received
                        </div>
                        <p className="text-sm font-medium text-foreground">{lead.receivedAt}</p>
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="p-3 rounded-lg bg-background/30 mb-4">
                      <p className="text-xs text-muted-foreground mb-1">Requirements</p>
                      <p className="text-sm text-foreground">{lead.requirements}</p>
                    </div>
                  </div>

                  {/* AI Score & Actions */}
                  <div className="ml-6 flex flex-col items-center gap-4">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-neon-teal/20 border-4 border-primary/30 flex items-center justify-center">
                        <div className="text-center">
                          <Sparkles className="w-4 h-4 text-neon-teal mx-auto mb-1" />
                          <span className="text-2xl font-bold text-foreground">{lead.aiScore}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">AI Score</p>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <Button 
                        onClick={() => handleAccept(lead)}
                        className="bg-neon-green hover:bg-neon-green/90 text-background"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Accept
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleReject(lead)}
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>

                    {lead.idleMinutes > 5 && (
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                        <Clock className="w-3 h-3 mr-1" />
                        Idle {lead.idleMinutes}m
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {leads.length === 0 && (
        <Card className="glass-card border-border/50">
          <CardContent className="p-12 text-center">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Pending Leads</h3>
            <p className="text-muted-foreground">All incoming leads have been processed. Great work!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeadIncoming;

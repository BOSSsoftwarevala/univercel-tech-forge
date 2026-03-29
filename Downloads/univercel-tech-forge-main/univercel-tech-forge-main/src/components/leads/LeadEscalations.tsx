import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertTriangle, 
  BellRing, 
  Clock, 
  User, 
  Building,
  ArrowUp,
  CheckCircle,
  Volume2,
  VolumeX,
  Shield,
  Target,
  TrendingUp
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Escalation {
  id: string;
  leadName: string;
  company: string;
  reason: string;
  escalatedFrom: string;
  escalationLevel: number;
  idleMinutes: number;
  priority: string;
  createdAt: string;
  isResolved: boolean;
}

const LeadEscalations = () => {
  const { toast } = useToast();
  const [buzzerActive, setBuzzerActive] = useState(true);
  const [selectedEscalation, setSelectedEscalation] = useState<Escalation | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [escalations, setEscalations] = useState<Escalation[]>([
    { id: "1", leadName: "Rajesh Kumar", company: "TechCorp", reason: "Lead idle for 30+ minutes", escalatedFrom: "Sales Team Alpha", escalationLevel: 2, idleMinutes: 35, priority: "hot", createdAt: "5 min ago", isResolved: false },
    { id: "2", leadName: "Priya Sharma", company: "HealthPlus", reason: "High priority lead unattended", escalatedFrom: "Franchise Partner", escalationLevel: 1, idleMinutes: 22, priority: "hot", createdAt: "12 min ago", isResolved: false },
    { id: "3", leadName: "Amit Patel", company: "RetailMax", reason: "Multiple follow-up failures", escalatedFrom: "Reseller West", escalationLevel: 3, idleMinutes: 48, priority: "warm", createdAt: "28 min ago", isResolved: false },
    { id: "4", leadName: "Sneha Reddy", company: "EduTech", reason: "Customer complaint escalation", escalatedFrom: "Support Team", escalationLevel: 2, idleMinutes: 15, priority: "warm", createdAt: "45 min ago", isResolved: true },
  ]);

  const activeEscalations = escalations.filter(e => !e.isResolved);
  const criticalEscalations = activeEscalations.filter(e => e.escalationLevel >= 2);

  const handleResolve = (escalation: Escalation) => {
    setSelectedEscalation(escalation);
    setIsDialogOpen(true);
  };

  const submitResolution = () => {
    if (!resolutionNote.trim()) {
      toast({
        title: "Notes Required",
        description: "Please provide resolution notes to continue",
      });
      return;
    }

    setEscalations(prev => prev.map(e => 
      e.id === selectedEscalation?.id ? { ...e, isResolved: true } : e
    ));

    toast({
      title: "Escalation Resolved",
      description: `${selectedEscalation?.leadName} escalation has been resolved.`,
    });

    setIsDialogOpen(false);
    setResolutionNote("");
    setSelectedEscalation(null);
  };

  const handleTakeOver = (escalation: Escalation) => {
    toast({
      title: "Lead Taken Over",
      description: `You have taken over ${escalation.leadName}'s lead.`,
    });
    setEscalations(prev => prev.map(e => 
      e.id === escalation.id ? { ...e, isResolved: true } : e
    ));
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case 2: return "bg-red-500/20 text-red-400 border-red-500/30";
      case 3: return "bg-red-600/20 text-red-500 border-red-600/30 animate-pulse";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "hot": return "text-red-400";
      case "warm": return "text-orange-400";
      case "cold": return "text-blue-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Critical Alert Banner */}
      <AnimatePresence>
        {criticalEscalations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg border-2 ${buzzerActive ? 'border-red-500 bg-red-500/10 animate-pulse' : 'border-red-500/50 bg-red-500/5'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BellRing className={`w-6 h-6 text-red-400 ${buzzerActive ? 'animate-bounce' : ''}`} />
                <div>
                  <p className="font-bold text-red-400">CRITICAL ESCALATIONS</p>
                  <p className="text-sm text-red-300">{criticalEscalations.length} lead(s) at Level 2+ escalation - Immediate action required</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setBuzzerActive(!buzzerActive)}
                className="border-red-500/50 text-red-400 hover:bg-red-500/20"
              >
                {buzzerActive ? <Volume2 className="w-4 h-4 mr-1" /> : <VolumeX className="w-4 h-4 mr-1" />}
                {buzzerActive ? "Mute" : "Unmute"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Escalation Center</h1>
          <p className="text-muted-foreground">Manage escalated leads and resolve issues</p>
        </div>
        <Badge className={activeEscalations.length > 0 ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-neon-green/20 text-neon-green border border-neon-green/30"}>
          {activeEscalations.length} Active
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{activeEscalations.length}</p>
            <p className="text-xs text-muted-foreground">Active Escalations</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <ArrowUp className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{criticalEscalations.length}</p>
            <p className="text-xs text-muted-foreground">Level 2+ Critical</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">24m</p>
            <p className="text-xs text-muted-foreground">Avg Resolution Time</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-6 h-6 text-neon-green mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">45</p>
            <p className="text-xs text-muted-foreground">Resolved Today</p>
          </CardContent>
        </Card>
      </div>

      {/* Escalation List */}
      <Card className="glass-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Escalated Leads
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {escalations.map((escalation, index) => (
            <motion.div
              key={escalation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${
                escalation.isResolved 
                  ? 'bg-background/30 border-border/50 opacity-60' 
                  : escalation.escalationLevel >= 2
                  ? 'bg-red-500/5 border-red-500/30'
                  : 'bg-background/50 border-border'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{escalation.leadName}</p>
                        <Badge className={getLevelColor(escalation.escalationLevel)}>
                          Level {escalation.escalationLevel}
                        </Badge>
                        {escalation.isResolved && (
                          <Badge className="bg-neon-green/20 text-neon-green">Resolved</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="w-3 h-3" />
                        {escalation.company}
                        <span className={getPriorityColor(escalation.priority)}>• {escalation.priority.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-13 space-y-2">
                    <div className="p-3 rounded-lg bg-background/30">
                      <p className="text-xs text-muted-foreground mb-1">Escalation Reason</p>
                      <p className="text-sm text-foreground">{escalation.reason}</p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>From: <span className="text-foreground">{escalation.escalatedFrom}</span></span>
                      <span>Idle: <span className="text-orange-400">{escalation.idleMinutes}m</span></span>
                      <span>Created: {escalation.createdAt}</span>
                    </div>
                  </div>
                </div>

                {!escalation.isResolved && (
                  <div className="flex flex-col gap-2 ml-4">
                    <Button 
                      size="sm"
                      onClick={() => handleTakeOver(escalation)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Target className="w-4 h-4 mr-1" />
                      Take Over
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleResolve(escalation)}
                      className="border-neon-green text-neon-green hover:bg-neon-green/10"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Resolve
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Resolution Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-neon-green" />
              Resolve Escalation
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedEscalation && (
              <div className="p-4 rounded-lg bg-background/50 border border-border">
                <p className="font-medium text-foreground">{selectedEscalation.leadName}</p>
                <p className="text-sm text-muted-foreground">{selectedEscalation.reason}</p>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Resolution Notes (Required)</label>
              <Textarea
                placeholder="Describe how the escalation was resolved..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                className="bg-background border-border min-h-[100px]"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submitResolution} className="bg-neon-green hover:bg-neon-green/90 text-background">
                Mark Resolved
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadEscalations;

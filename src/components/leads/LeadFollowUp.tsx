import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Clock, 
  User, 
  Building, 
  MessageSquare,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Phone,
  Video,
  Mail,
  Plus,
  Bell
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FollowUp {
  id: string;
  leadName: string;
  company: string;
  scheduledAt: string;
  type: string;
  notes: string;
  aiSuggestion: string;
  priority: string;
  isOverdue: boolean;
}

const LeadFollowUp = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    date: "",
    time: "",
    notes: "",
  });

  const followUps: FollowUp[] = [
    { id: "1", leadName: "Rajesh Kumar", company: "TechCorp", scheduledAt: "Today, 2:00 PM", type: "call", notes: "Discuss pricing options", aiSuggestion: "Mention the 20% discount for annual plans", priority: "hot", isOverdue: false },
    { id: "2", leadName: "Priya Sharma", company: "HealthPlus", scheduledAt: "Today, 4:30 PM", type: "video", notes: "Product demo", aiSuggestion: "Focus on compliance features for healthcare", priority: "hot", isOverdue: false },
    { id: "3", leadName: "Amit Patel", company: "RetailMax", scheduledAt: "Yesterday, 3:00 PM", type: "call", notes: "Follow up on proposal", aiSuggestion: "Address inventory integration concerns", priority: "warm", isOverdue: true },
    { id: "4", leadName: "Sneha Reddy", company: "EduTech", scheduledAt: "Tomorrow, 11:00 AM", type: "email", notes: "Send case studies", aiSuggestion: "Include education sector success stories", priority: "warm", isOverdue: false },
    { id: "5", leadName: "Vikram Singh", company: "LogiFlow", scheduledAt: "Tomorrow, 3:30 PM", type: "call", notes: "Budget discussion", aiSuggestion: "Propose phased implementation", priority: "cold", isOverdue: false },
  ];

  const todayFollowUps = followUps.filter(f => f.scheduledAt.includes("Today"));
  const overdueFollowUps = followUps.filter(f => f.isOverdue);

  const handleComplete = (followUp: FollowUp) => {
    toast({
      title: "Follow-up Completed",
      description: `${followUp.type} with ${followUp.leadName} marked as complete.`,
    });
  };

  const handleReschedule = (followUp: FollowUp) => {
    toast({
      title: "Rescheduled",
      description: `Follow-up with ${followUp.leadName} has been rescheduled.`,
    });
  };

  const handleSchedule = () => {
    if (!formData.type || !formData.date) {
      toast({
        title: "Fields Required",
        description: "Please complete all required fields to continue",
      });
      return;
    }
    
    toast({
      title: "Follow-up Scheduled",
      description: "New follow-up has been added to your calendar.",
    });
    setIsDialogOpen(false);
    setFormData({ type: "", date: "", time: "", notes: "" });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "call": return <Phone className="w-4 h-4" />;
      case "video": return <Video className="w-4 h-4" />;
      case "email": return <Mail className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "hot": return "border-l-red-400";
      case "warm": return "border-l-orange-400";
      case "cold": return "border-l-blue-400";
      default: return "border-l-border";
    }
  };

  return (
    <div className="space-y-6">
      {/* Overdue Alert */}
      {overdueFollowUps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg border-2 border-orange-500/50 bg-orange-500/10"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-400" />
            <div>
              <p className="font-bold text-orange-400">OVERDUE FOLLOW-UPS</p>
              <p className="text-sm text-orange-300">{overdueFollowUps.length} follow-up(s) are overdue and need immediate attention</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Follow-Up Scheduler</h1>
          <p className="text-muted-foreground">Manage and track lead follow-ups with AI suggestions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Follow-up
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Schedule New Follow-up</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Follow-up Type</label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">Phone Call</SelectItem>
                    <SelectItem value="video">Video Call</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="meeting">In-Person Meeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  placeholder="Add notes for this follow-up..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="bg-background border-border"
                />
              </div>
              <Button onClick={handleSchedule} className="w-full bg-primary hover:bg-primary/90">
                Schedule Follow-up
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{todayFollowUps.length}</p>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-400">{overdueFollowUps.length}</p>
            <p className="text-xs text-muted-foreground">Overdue</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-neon-green">24</p>
            <p className="text-xs text-muted-foreground">Completed Today</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{followUps.length}</p>
            <p className="text-xs text-muted-foreground">Total Pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Follow-up List */}
      <Card className="glass-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Scheduled Follow-ups
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {followUps.map((followUp, index) => (
            <motion.div
              key={followUp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg bg-background/30 border-l-4 ${getPriorityColor(followUp.priority)} ${
                followUp.isOverdue ? 'border border-orange-500/30 bg-orange-500/5' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      {getTypeIcon(followUp.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{followUp.leadName}</p>
                        {followUp.isOverdue && (
                          <Badge className="bg-orange-500/20 text-orange-400">OVERDUE</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="w-3 h-3" />
                        {followUp.company}
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        {followUp.scheduledAt}
                      </div>
                    </div>
                  </div>

                  <div className="ml-13 space-y-2">
                    <p className="text-sm text-foreground">{followUp.notes}</p>
                    
                    <div className="p-3 rounded-lg bg-neon-teal/10 border border-neon-teal/20">
                      <div className="flex items-center gap-2 text-xs text-neon-teal mb-1">
                        <Sparkles className="w-3 h-3" />
                        AI Suggestion
                      </div>
                      <p className="text-sm text-foreground">{followUp.aiSuggestion}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button 
                    size="sm"
                    onClick={() => handleComplete(followUp)}
                    className="bg-neon-green hover:bg-neon-green/90 text-background"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Complete
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => handleReschedule(followUp)}
                    className="border-border"
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    Reschedule
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="border-primary text-primary"
                  >
                    <Bell className="w-4 h-4 mr-1" />
                    Remind
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadFollowUp;

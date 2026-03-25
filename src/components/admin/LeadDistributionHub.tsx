import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Bell,
  Brain,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Filter,
  Search,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LeadDistributionHub = () => {
  const [selectedLead, setSelectedLead] = useState<string | null>(null);

  const leadPool = [
    { 
      id: "LD001", 
      company: "ABC Restaurant", 
      category: "Restaurant POS", 
      region: "Mumbai", 
      score: 92, 
      status: "hot",
      idle: "2h 15m",
      source: "Website"
    },
    { 
      id: "LD002", 
      company: "XYZ Hotel", 
      category: "Hotel Management", 
      region: "Pune", 
      score: 85, 
      status: "warm",
      idle: "4h 30m",
      source: "Referral"
    },
    { 
      id: "LD003", 
      company: "City Clinic", 
      category: "Clinic Software", 
      region: "Delhi", 
      score: 78, 
      status: "warm",
      idle: "6h 45m",
      source: "Campaign"
    },
    { 
      id: "LD004", 
      company: "Green School", 
      category: "School ERP", 
      region: "Bangalore", 
      score: 65, 
      status: "cold",
      idle: "12h 20m",
      source: "Cold Call"
    },
    { 
      id: "LD005", 
      company: "Fashion Hub", 
      category: "Retail POS", 
      region: "Chennai", 
      score: 88, 
      status: "hot",
      idle: "1h 10m",
      source: "Website"
    },
  ];

  const franchises = [
    { name: "Maharashtra Franchise", region: "Maharashtra", capacity: 45, assigned: 32, performance: 94 },
    { name: "Karnataka Franchise", region: "Karnataka", capacity: 38, assigned: 28, performance: 89 },
    { name: "Delhi NCR Franchise", region: "Delhi NCR", capacity: 40, assigned: 35, performance: 82 },
    { name: "Tamil Nadu Franchise", region: "Tamil Nadu", capacity: 35, assigned: 22, performance: 91 },
  ];

  const developers = [
    { name: "Rahul S.", skills: ["PHP", "Restaurant POS"], load: 3, maxLoad: 5, rating: 4.8 },
    { name: "Priya M.", skills: ["Node.js", "Hotel Mgmt"], load: 4, maxLoad: 5, rating: 4.9 },
    { name: "Amit K.", skills: ["Java", "School ERP"], load: 2, maxLoad: 5, rating: 4.7 },
    { name: "Sneha R.", skills: ["React", "Clinic Software"], load: 5, maxLoad: 5, rating: 4.6 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "hot":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">🔥 Hot</Badge>;
      case "warm":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">⚡ Warm</Badge>;
      case "cold":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">❄️ Cold</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-400";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-neon-teal bg-clip-text text-transparent">
            Lead Distribution Hub
          </h1>
          <p className="text-muted-foreground mt-1">AI-powered lead routing & assignment</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Brain className="w-4 h-4 mr-2" />
            Auto-Assign All
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Pool", value: "156", icon: Users, color: "text-primary" },
          { label: "Hot Leads", value: "34", icon: Zap, color: "text-red-400" },
          { label: "Idle > 6hrs", value: "12", icon: Clock, color: "text-yellow-400" },
          { label: "AI Qualified", value: "89%", icon: Brain, color: "text-green-400" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card border-white/10">
              <CardContent className="p-4 flex items-center gap-3">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Pool */}
        <Card className="glass-card border-white/10 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Lead Pool
              </CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search leads..." className="pl-9 w-48 bg-background/50" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-32 bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="hot">Hot</SelectItem>
                    <SelectItem value="warm">Warm</SelectItem>
                    <SelectItem value="cold">Cold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leadPool.map((lead, index) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    selectedLead === lead.id 
                      ? "bg-primary/10 border-primary/30" 
                      : "bg-background/50 border-white/5 hover:border-white/20"
                  }`}
                  onClick={() => setSelectedLead(lead.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-neon-purple/20 flex items-center justify-center">
                        <span className="font-bold text-primary">{lead.company.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium">{lead.company}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          {lead.region} • {lead.category}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className={`text-lg font-bold ${getScoreColor(lead.score)}`}>
                          {lead.score}
                        </div>
                        <div className="text-xs text-muted-foreground">AI Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-yellow-400">{lead.idle}</div>
                        <div className="text-xs text-muted-foreground">Idle</div>
                      </div>
                      {getStatusBadge(lead.status)}
                      <Button size="sm" className="bg-primary/20 text-primary hover:bg-primary/30">
                        <UserPlus className="w-4 h-4 mr-1" />
                        Assign
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Assignment Targets */}
        <div className="space-y-6">
          {/* Franchise Assignment */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="w-4 h-4 text-neon-purple" />
                Franchise Assignment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {franchises.map((franchise, index) => (
                  <motion.div
                    key={franchise.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 rounded-lg bg-background/50 border border-white/5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{franchise.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {franchise.performance}% perf
                      </Badge>
                    </div>
                    <Progress 
                      value={(franchise.assigned / franchise.capacity) * 100} 
                      className="h-2 mb-1"
                    />
                    <div className="text-xs text-muted-foreground">
                      {franchise.assigned}/{franchise.capacity} capacity
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Developer Routing */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="w-4 h-4 text-neon-teal" />
                Skill-Based Dev Routing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {developers.map((dev, index) => (
                  <motion.div
                    key={dev.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 rounded-lg bg-background/50 border border-white/5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{dev.name}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400 text-xs">★ {dev.rating}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {dev.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <Progress 
                      value={(dev.load / dev.maxLoad) * 100} 
                      className="h-2"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {dev.load}/{dev.maxLoad} tasks
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Idle Lead Buzzer Alert */}
      <Card className="glass-card border-yellow-500/30 bg-yellow-500/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center animate-pulse">
                <Bell className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <div className="font-semibold text-yellow-400">Idle Lead Alert</div>
                <div className="text-sm text-muted-foreground">
                  12 leads have been idle for more than 6 hours. Consider reassignment.
                </div>
              </div>
            </div>
            <Button className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30">
              View Idle Leads
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadDistributionHub;

import { motion } from "framer-motion";
import { Inbox, User, Clock, Flame, Snowflake, Sun, Phone, MessageCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const LeadInbox = () => {
  const leads = [
    { id: "LD-001", name: "Tech Solutions Ltd", contact: "John D.", category: "POS System", urgency: "hot", source: "Website", time: "2 min ago", qualified: true },
    { id: "LD-002", name: "Healthcare Plus", contact: "Maria S.", category: "Hospital Management", urgency: "warm", source: "Referral", time: "15 min ago", qualified: true },
    { id: "LD-003", name: "EduLearn Academy", contact: "Robert K.", category: "School ERP", urgency: "hot", source: "Demo Request", time: "25 min ago", qualified: false },
    { id: "LD-004", name: "Retail Mart", contact: "Lisa P.", category: "Inventory", urgency: "cold", source: "SEO", time: "1 hour ago", qualified: false },
    { id: "LD-005", name: "Global Logistics", contact: "James T.", category: "Fleet Management", urgency: "warm", source: "Influencer", time: "2 hours ago", qualified: true },
  ];

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "hot": return { icon: Flame, color: "bg-red-500/20 text-red-300 border-red-500/30", label: "HOT" };
      case "warm": return { icon: Sun, color: "bg-amber-500/20 text-amber-300 border-amber-500/30", label: "WARM" };
      case "cold": return { icon: Snowflake, color: "bg-blue-500/20 text-blue-300 border-blue-500/30", label: "COLD" };
      default: return { icon: Sun, color: "bg-slate-500/20 text-slate-300", label: "NEW" };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-100">Lead Inbox</h2>
          <p className="text-slate-400">Incoming leads queue with qualification tags</p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-red-500/20 text-red-300">5 Hot</Badge>
          <Badge className="bg-amber-500/20 text-amber-300">8 Warm</Badge>
          <Badge className="bg-blue-500/20 text-blue-300">12 Cold</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4 text-center">
            <Inbox className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-cyan-100">25</div>
            <div className="text-xs text-slate-400">Total Leads</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <User className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-100">12</div>
            <div className="text-xs text-slate-400">Qualified</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-100">3 min</div>
            <div className="text-xs text-slate-400">Avg Response</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <Flame className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-100">68%</div>
            <div className="text-xs text-slate-400">Conversion Rate</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-100">Incoming Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leads.map((lead, index) => {
              const urgencyInfo = getUrgencyBadge(lead.urgency);
              const UrgencyIcon = urgencyInfo.icon;
              return (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-cyan-400 text-sm">{lead.id}</span>
                        <h4 className="font-medium text-cyan-100">{lead.name}</h4>
                        <Badge className={urgencyInfo.color}>
                          <UrgencyIcon className="w-3 h-3 mr-1" />
                          {urgencyInfo.label}
                        </Badge>
                        {lead.qualified && (
                          <Badge className="bg-emerald-500/20 text-emerald-300">Qualified</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                        <span>{lead.contact}</span>
                        <span>•</span>
                        <span>{lead.category}</span>
                        <span>•</span>
                        <span>{lead.source}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{lead.time}</span>
                    <Button size="sm" variant="ghost" className="text-cyan-400 hover:text-cyan-300">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-cyan-400 hover:text-cyan-300">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
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

export default LeadInbox;

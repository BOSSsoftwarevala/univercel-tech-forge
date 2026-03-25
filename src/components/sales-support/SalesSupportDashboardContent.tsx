import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Headset, Users, Ticket, Inbox, MessageCircle,
  Clock, AlertCircle, FileText, History, CheckCircle,
  TrendingUp, Eye, Store
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { SalesSupportSection } from "./SalesSupportSidebar";

interface SalesSupportDashboardContentProps {
  activeSection: SalesSupportSection;
}

// Mock data
const stats = {
  managers: 6,
  online: 5,
  away: 1,
  tickets: 75,
  leads: 272,
};

const teamMembers = [
  { id: 1, name: "Priya Patel", region: "South Asia", tickets: 24, leads: 45, status: "active", conversion: "32%" },
  { id: 2, name: "Michael Chen", region: "North America", tickets: 12, leads: 67, status: "active", conversion: "45%" },
  { id: 3, name: "Emma Williams", region: "Europe", tickets: 8, leads: 38, status: "active", conversion: "28%" },
  { id: 4, name: "Aisha Mohammed", region: "West Africa", tickets: 15, leads: 29, status: "away", conversion: "18%" },
];

const liveTickets = [
  { id: "TKT-001", subject: "Login Issue", priority: "high", assigned: "Priya Patel", status: "open" },
  { id: "TKT-002", subject: "Billing Query", priority: "medium", assigned: "Michael Chen", status: "open" },
  { id: "TKT-003", subject: "Feature Request", priority: "low", assigned: "Emma Williams", status: "pending" },
];

const recentActivity = [
  { id: 1, action: "Ticket Resolved", target: "TKT-45892", time: "2 min ago" },
  { id: 2, action: "Lead Converted", target: "LD-234", time: "15 min ago" },
  { id: 3, action: "Call Completed", target: "TechCorp India", time: "45 min ago" },
  { id: 4, action: "Issue Escalated", target: "Critical: Server Down", time: "1 hour ago" },
];

const SalesSupportDashboardContent = ({ activeSection }: SalesSupportDashboardContentProps) => {
  const handleAction = (action: string, target?: string) => {
    toast.success(`${action}${target ? ` for ${target}` : ""}`);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-teal-500/10 to-emerald-500/10 border-teal-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Managers</p>
                <p className="text-2xl font-bold text-teal-400">{stats.managers}</p>
              </div>
              <Users className="w-8 h-8 text-teal-400/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-500/10 border-emerald-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Online</p>
                <p className="text-2xl font-bold text-emerald-400">{stats.online}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-400/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Away</p>
                <p className="text-2xl font-bold text-amber-400">{stats.away}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-400/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-rose-500/10 border-rose-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Tickets</p>
                <p className="text-2xl font-bold text-rose-400">{stats.tickets}</p>
              </div>
              <Ticket className="w-8 h-8 text-rose-400/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Leads</p>
                <p className="text-2xl font-bold text-blue-400">{stats.leads}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Members */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-400" />
                Team Members
              </h3>
              <Button variant="outline" size="sm" onClick={() => handleAction("View", "All Team")}>
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
            </div>
            <div className="space-y-2">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-background/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
                      <span className="text-teal-400 text-sm font-semibold">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.region}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs",
                        member.status === "active"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/20 text-amber-400"
                      )}
                    >
                      {member.status}
                    </Badge>
                    <span className="text-sm text-cyan-400">{member.conversion}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <History className="w-5 h-5 text-purple-400" />
                Recent Activity
              </h3>
            </div>
            <div className="space-y-2">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-background/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.target}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderLiveTickets = () => (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Ticket className="w-6 h-6 text-rose-400" />
            <div>
              <h2 className="text-xl font-bold text-foreground">Live Tickets</h2>
              <p className="text-sm text-muted-foreground">Active support tickets</p>
            </div>
          </div>
          <div className="space-y-3">
            {liveTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/50"
              >
                <div>
                  <p className="font-semibold text-foreground">{ticket.subject}</p>
                  <p className="text-sm text-muted-foreground">
                    {ticket.id} • Assigned: {ticket.assigned}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      ticket.priority === "high"
                        ? "bg-red-500/20 text-red-400"
                        : ticket.priority === "medium"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-slate-500/20 text-slate-400"
                    )}
                  >
                    {ticket.priority}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction("View", ticket.id)}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                      onClick={() => handleAction("Resolve", ticket.id)}
                    >
                      Resolve
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTeamMembers = () => (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-teal-400" />
            <div>
              <h2 className="text-xl font-bold text-foreground">Team Members</h2>
              <p className="text-sm text-muted-foreground">Manage your team</p>
            </div>
          </div>
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center">
                    <span className="text-teal-400 font-bold">{member.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.region} • {member.tickets} tickets • {member.leads} leads
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className={cn(
                      member.status === "active"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/20 text-amber-400"
                    )}
                  >
                    {member.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction("View", member.name)}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSection = (
    title: string,
    icon: React.ReactNode,
    description: string
  ) => (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            {icon}
            <div>
              <h2 className="text-xl font-bold text-foreground">{title}</h2>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-4 bg-background/50 rounded-xl border border-border/50"
              >
                <div className="h-24 flex items-center justify-center">
                  <p className="text-slate-400 text-sm">Content {i}</p>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleAction("View", `Item ${i}`)}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview();
      case "live_tickets":
        return renderLiveTickets();
      case "team_members":
        return renderTeamMembers();
      case "leads_inbox":
        return renderSection(
          "Leads Inbox",
          <Inbox className="w-6 h-6 text-blue-400" />,
          "Incoming leads"
        );
      case "customer_chats":
        return renderSection(
          "Customer Chats",
          <MessageCircle className="w-6 h-6 text-purple-400" />,
          "Active conversations"
        );
      case "followups":
        return renderSection(
          "Follow-ups",
          <Clock className="w-6 h-6 text-amber-400" />,
          "Scheduled follow-ups"
        );
      case "escalations":
        return renderSection(
          "Escalations",
          <AlertCircle className="w-6 h-6 text-red-400" />,
          "Escalated issues"
        );
      case "performance_reports":
        return renderSection(
          "Performance Reports",
          <FileText className="w-6 h-6 text-indigo-400" />,
          "Team performance metrics"
        );
      case "activity_log":
        return renderSection(
          "Activity Log",
          <History className="w-6 h-6 text-slate-400" />,
          "Recent activity"
        );
      default:
        return renderOverview();
    }
  };

  return (
    <ScrollArea className="flex-1">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Headset className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Sales & Support</h1>
              <p className="text-muted-foreground">Global Team Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
              RUNNING
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
              AI ACTIVE
            </Badge>
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
              HEALTHY
            </Badge>
          </div>
        </div>

        {renderContent()}
      </div>
    </ScrollArea>
  );
};

export default SalesSupportDashboardContent;

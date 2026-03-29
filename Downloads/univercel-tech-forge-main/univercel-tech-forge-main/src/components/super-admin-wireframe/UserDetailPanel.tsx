import { motion } from "framer-motion";
import { 
  User, Mail, MapPin, Clock, AlertTriangle, Key, Shield,
  Lock, Unlock, UserX, History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserDetailPanelProps {
  user: {
    id: string;
    name: string;
    email: string;
    status: "active" | "suspended" | "locked";
    region: string;
    lastLogin: string;
    riskScore: number;
  };
  onClose: () => void;
}

const statusHistory = [
  { status: "active", changedBy: "SA-001", reason: "Account created", date: "2024-01-15" },
  { status: "suspended", changedBy: "SA-003", reason: "Suspicious activity", date: "2024-02-20" },
  { status: "active", changedBy: "SA-001", reason: "Investigation cleared", date: "2024-02-25" },
];

const securityFlags = [
  { type: "VPN Usage", severity: "medium", date: "2024-03-10" },
  { type: "Multiple Failed Logins", severity: "low", date: "2024-03-08" },
];

const rentalAssignments = [
  { feature: "Premium Analytics", plan: "Monthly", expiresIn: "15 days" },
  { feature: "API Access", plan: "Yearly", expiresIn: "200 days" },
];

const UserDetailPanel = ({ user, onClose }: UserDetailPanelProps) => {
  const statusColors = {
    active: "bg-neon-green/20 text-neon-green border-neon-green/50",
    suspended: "bg-neon-orange/20 text-neon-orange border-neon-orange/50",
    locked: "bg-destructive/20 text-destructive border-destructive/50",
  };

  const severityColors = {
    low: "text-neon-green",
    medium: "text-neon-orange",
    high: "text-destructive",
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        {/* Basic Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Basic Information
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                <User className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground font-mono">{user.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{user.region}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>Last login: {user.lastLogin}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={statusColors[user.status]} variant="outline">
                {user.status}
              </Badge>
              <Badge variant="outline" className={user.riskScore < 30 ? "text-neon-green" : user.riskScore < 60 ? "text-neon-orange" : "text-destructive"}>
                Risk: {user.riskScore}
              </Badge>
            </div>
          </div>
        </motion.div>

        <Separator />

        {/* Status History */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <History className="w-4 h-4" />
            Status History
          </h4>
          <div className="space-y-3">
            {statusHistory.map((entry, index) => (
              <div key={index} className="p-3 bg-secondary/30 rounded-lg text-sm">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="text-xs capitalize">{entry.status}</Badge>
                  <span className="text-xs text-muted-foreground">{entry.date}</span>
                </div>
                <p className="text-muted-foreground">{entry.reason}</p>
                <p className="text-xs text-muted-foreground mt-1">By: {entry.changedBy}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <Separator />

        {/* Security Flags */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Security Flags
          </h4>
          <div className="space-y-2">
            {securityFlags.map((flag, index) => (
              <div key={index} className="p-3 bg-secondary/30 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{flag.type}</p>
                  <p className="text-xs text-muted-foreground">{flag.date}</p>
                </div>
                <Badge variant="outline" className={severityColors[flag.severity as keyof typeof severityColors]}>
                  {flag.severity}
                </Badge>
              </div>
            ))}
          </div>
        </motion.div>

        <Separator />

        {/* Rental Assignments */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4" />
            Rental Assignments
          </h4>
          <div className="space-y-2">
            {rentalAssignments.map((rental, index) => (
              <div key={index} className="p-3 bg-secondary/30 rounded-lg">
                <p className="text-sm font-medium">{rental.feature}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">{rental.plan}</span>
                  <span className="text-xs text-primary">Expires in {rental.expiresIn}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <Separator />

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Actions
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Change Status
            </Button>
            <Button variant="outline" className="justify-start text-destructive hover:text-destructive">
              <Lock className="w-4 h-4 mr-2" />
              Lock User
            </Button>
          </div>
        </motion.div>
      </div>
    </ScrollArea>
  );
};

export default UserDetailPanel;

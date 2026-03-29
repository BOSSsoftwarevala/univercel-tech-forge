import { motion } from "framer-motion";
import { AlertTriangle, Shield, Ban, Eye, Filter, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SuperAdminWireframeLayout from "@/components/super-admin-wireframe/SuperAdminWireframeLayout";

const securityEvents = [
  { id: "SEC-001", type: "Multiple Failed Logins", user: "USR-123", ip: "192.168.1.100", severity: "high", time: "5 min ago", location: "Nigeria" },
  { id: "SEC-002", type: "VPN Detected", user: "USR-456", ip: "10.0.0.50", severity: "medium", time: "15 min ago", location: "Unknown" },
  { id: "SEC-003", type: "Suspicious Transaction", user: "USR-789", ip: "172.16.0.25", severity: "critical", time: "30 min ago", location: "Kenya" },
  { id: "SEC-004", type: "New Device Login", user: "USR-012", ip: "192.168.2.200", severity: "low", time: "1 hour ago", location: "UK" },
  { id: "SEC-005", type: "Password Changed", user: "USR-345", ip: "10.10.10.10", severity: "low", time: "2 hours ago", location: "Germany" },
];

const SuperAdminSecurity = () => {
  const severityColors = {
    low: "bg-neon-green/20 text-neon-green border-neon-green/50",
    medium: "bg-neon-orange/20 text-neon-orange border-neon-orange/50",
    high: "bg-destructive/20 text-destructive border-destructive/50",
    critical: "bg-neon-red/20 text-neon-red border-neon-red/50 animate-pulse",
  };

  return (
    <SuperAdminWireframeLayout activeSection="security">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Security Center</h1>
            <p className="text-muted-foreground">Monitor and respond to security events</p>
          </div>
          <Button variant="outline"><Filter className="w-4 h-4 mr-2" />Filters</Button>
        </div>

        <div className="space-y-4">
          {securityEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`glass-panel border-l-4 ${event.severity === "critical" ? "border-l-destructive" : event.severity === "high" ? "border-l-neon-orange" : "border-l-primary"}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <AlertTriangle className={`w-5 h-5 ${event.severity === "critical" || event.severity === "high" ? "text-destructive" : "text-neon-orange"}`} />
                      <div>
                        <h4 className="font-medium">{event.type}</h4>
                        <p className="text-sm text-muted-foreground">
                          {event.user} • {event.ip} • {event.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={severityColors[event.severity as keyof typeof severityColors]} variant="outline">
                        {event.severity}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-4 h-4" />{event.time}
                      </span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm"><Ban className="w-4 h-4 mr-1" />Block User</Button>
                        <Button variant="outline" size="sm"><Shield className="w-4 h-4 mr-1" />Block IP</Button>
                        <Button variant="outline" size="sm"><Eye className="w-4 h-4 mr-1" />Review</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </SuperAdminWireframeLayout>
  );
};

export default SuperAdminSecurity;

import { motion } from "framer-motion";
import { Eye, Download, Shield, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import SuperAdminWireframeLayout from "@/components/super-admin-wireframe/SuperAdminWireframeLayout";

const auditTimeline = [
  { id: "AUD-001", event: "System Backup Completed", category: "System", time: "2024-03-15 00:00:00", details: "Daily automated backup successful" },
  { id: "AUD-002", event: "Security Scan Completed", category: "Security", time: "2024-03-14 23:00:00", details: "No vulnerabilities detected" },
  { id: "AUD-003", event: "User Data Export", category: "Compliance", time: "2024-03-14 18:30:00", details: "GDPR data request processed for USR-456" },
  { id: "AUD-004", event: "Permission Matrix Updated", category: "Access", time: "2024-03-14 15:45:00", details: "Role permissions modified by SA-001" },
  { id: "AUD-005", event: "API Rate Limit Triggered", category: "System", time: "2024-03-14 12:20:00", details: "Rate limit exceeded for endpoint /api/users" },
  { id: "AUD-006", event: "Database Migration", category: "System", time: "2024-03-14 03:00:00", details: "Schema migration v2.4.1 applied successfully" },
];

const SuperAdminAudit = () => {
  const categoryColors: Record<string, string> = {
    System: "bg-primary/20 text-primary border-primary/50",
    Security: "bg-destructive/20 text-destructive border-destructive/50",
    Compliance: "bg-neon-purple/20 text-neon-purple border-neon-purple/50",
    Access: "bg-neon-orange/20 text-neon-orange border-neon-orange/50",
  };

  return (
    <SuperAdminWireframeLayout activeSection="audit">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Audit Trail</h1>
            <p className="text-muted-foreground">Read-only system audit records</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-neon-orange/10 text-neon-orange border-neon-orange/50">
              <Eye className="w-3 h-3 mr-1" />Read Only
            </Badge>
            <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export (Watermarked)</Button>
          </div>
        </div>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Audit Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {auditTimeline.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative pl-6 pb-4 border-l-2 border-border last:border-l-transparent"
                  >
                    <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-primary" />
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{entry.event}</h4>
                        <Badge className={categoryColors[entry.category]} variant="outline">{entry.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{entry.details}</p>
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" />{entry.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </SuperAdminWireframeLayout>
  );
};

export default SuperAdminAudit;

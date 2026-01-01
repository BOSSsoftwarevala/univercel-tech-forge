import { motion } from "framer-motion";
import { Activity, Filter, Download, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SuperAdminWireframeLayout from "@/components/super-admin-wireframe/SuperAdminWireframeLayout";

const activityLogs = [
  { id: "LOG-001", action: "User Suspended", module: "Users", target: "USR-123", admin: "SA-001", ip: "192.168.1.1", time: "2024-03-15 14:30:25" },
  { id: "LOG-002", action: "Rule Activated", module: "Rules", target: "RUL-005", admin: "SA-001", ip: "192.168.1.1", time: "2024-03-15 14:25:10" },
  { id: "LOG-003", action: "Module Disabled", module: "Modules", target: "MOD-DOCS", admin: "SA-002", ip: "10.0.0.50", time: "2024-03-15 14:20:00" },
  { id: "LOG-004", action: "Approval Granted", module: "Approvals", target: "APR-089", admin: "SA-001", ip: "192.168.1.1", time: "2024-03-15 14:15:45" },
  { id: "LOG-005", action: "Region Locked", module: "Geography", target: "Africa/Egypt", admin: "SA-002", ip: "10.0.0.50", time: "2024-03-15 14:10:30" },
  { id: "LOG-006", action: "Security Alert Resolved", module: "Security", target: "SEC-045", admin: "SA-001", ip: "192.168.1.1", time: "2024-03-15 14:05:15" },
];

const SuperAdminActivityLog = () => {
  return (
    <SuperAdminWireframeLayout activeSection="activity-log">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Activity Log</h1>
            <p className="text-muted-foreground">Complete history of Super Admin actions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Filter className="w-4 h-4 mr-2" />Filter</Button>
            <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export</Button>
          </div>
        </div>

        <Card className="glass-panel">
          <CardContent className="p-4">
            <Input placeholder="Search by action, module, target, or admin..." className="max-w-md" />
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activityLogs.map((log, index) => (
                  <motion.tr key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }}>
                    <TableCell className="text-sm font-mono">{log.time}</TableCell>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell><Badge variant="outline">{log.module}</Badge></TableCell>
                    <TableCell className="font-mono text-sm">{log.target}</TableCell>
                    <TableCell className="font-mono text-sm">{log.admin}</TableCell>
                    <TableCell className="text-muted-foreground">{log.ip}</TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SuperAdminWireframeLayout>
  );
};

export default SuperAdminActivityLog;

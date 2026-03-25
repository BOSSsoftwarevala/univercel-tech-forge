import { useState } from "react";
import { 
  Monitor, Plus, RefreshCw, AlertTriangle, CheckCircle, XCircle,
  ExternalLink, Users, Clock, Activity, MoreHorizontal, Play, Pause
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const demos = [
  { id: 1, title: "CRM Pro", category: "CRM", tech: "PHP", url: "crm.softwarevala.com", status: "online", uptime: 99.9, logins: 5, maxLogins: 10 },
  { id: 2, title: "ERP Suite", category: "ERP", tech: "Node.js", url: "erp.softwarevala.com", status: "online", uptime: 99.5, logins: 8, maxLogins: 10 },
  { id: 3, title: "HRMS Cloud", category: "HRMS", tech: "Java", url: "hrms.softwarevala.com", status: "degraded", uptime: 95.2, logins: 3, maxLogins: 5 },
  { id: 4, title: "Inventory Pro", category: "Inventory", tech: "Python", url: "inv.softwarevala.com", status: "offline", uptime: 0, logins: 0, maxLogins: 5 },
  { id: 5, title: "Billing Expert", category: "Billing", tech: "PHP", url: "bill.softwarevala.com", status: "online", uptime: 99.8, logins: 12, maxLogins: 15 },
];

const failures = [
  { id: 1, demo: "Inventory Pro", error: "Database connection timeout", time: "5m ago", severity: "critical" },
  { id: 2, demo: "HRMS Cloud", error: "High CPU usage detected", time: "12m ago", severity: "warning" },
];

export default function DemoManager() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Monitor className="w-6 h-6 text-[hsl(var(--sv-blue-bright))]" />
            Demo Manager
          </h1>
          <p className="text-[hsl(var(--sv-gray))]">Manage demo sites, uptime monitoring, and rental links</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-[hsl(var(--sv-navy))] border-[hsl(var(--sv-navy-light))] text-[hsl(var(--sv-white-soft))]">
            <RefreshCw className="w-4 h-4 mr-2" /> Health Check
          </Button>
          <Button className="bg-[hsl(var(--sv-blue))] hover:bg-[hsl(var(--sv-blue-bright))]">
            <Plus className="w-4 h-4 mr-2" /> Add Demo
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-[hsl(var(--sv-navy))] border-[hsl(var(--sv-navy-light))]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[hsl(var(--sv-success))]/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-[hsl(var(--sv-success))]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">12</p>
              <p className="text-sm text-[hsl(var(--sv-gray))]">Online</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[hsl(var(--sv-navy))] border-[hsl(var(--sv-navy-light))]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[hsl(var(--sv-warning))]/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-[hsl(var(--sv-warning))]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">2</p>
              <p className="text-sm text-[hsl(var(--sv-gray))]">Degraded</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[hsl(var(--sv-navy))] border-[hsl(var(--sv-navy-light))]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[hsl(var(--sv-danger))]/20 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-[hsl(var(--sv-danger))]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">1</p>
              <p className="text-sm text-[hsl(var(--sv-gray))]">Offline</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[hsl(var(--sv-navy))] border-[hsl(var(--sv-navy-light))]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[hsl(var(--sv-blue))]/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-[hsl(var(--sv-blue-bright))]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">98.5%</p>
              <p className="text-sm text-[hsl(var(--sv-gray))]">Avg Uptime</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Failure Alerts */}
      {failures.length > 0 && (
        <Card className="bg-[hsl(var(--sv-danger))]/10 border-[hsl(var(--sv-danger))]/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              <AlertTriangle className="w-5 h-5 text-[hsl(var(--sv-danger))]" />
              Active Failure Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {failures.map((failure) => (
              <div key={failure.id} className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--sv-navy))]">
                <div className="flex items-center gap-3">
                  <Badge className={failure.severity === "critical" ? "bg-[hsl(var(--sv-danger))]" : "bg-[hsl(var(--sv-warning))]"}>
                    {failure.severity}
                  </Badge>
                  <div>
                    <p className="text-white font-medium">{failure.demo}</p>
                    <p className="text-sm text-[hsl(var(--sv-gray))]">{failure.error}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-[hsl(var(--sv-gray))]">{failure.time}</span>
                  <Button size="sm" className="bg-[hsl(var(--sv-blue))]">Resolve</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Demo Table */}
      <Card className="bg-[hsl(var(--sv-navy))] border-[hsl(var(--sv-navy-light))]">
        <CardHeader>
          <CardTitle className="text-white">All Demos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-[hsl(var(--sv-navy-light))]">
                <TableHead className="text-[hsl(var(--sv-gray))]">Demo</TableHead>
                <TableHead className="text-[hsl(var(--sv-gray))]">Tech Stack</TableHead>
                <TableHead className="text-[hsl(var(--sv-gray))]">Status</TableHead>
                <TableHead className="text-[hsl(var(--sv-gray))]">Uptime</TableHead>
                <TableHead className="text-[hsl(var(--sv-gray))]">Multi-Login</TableHead>
                <TableHead className="text-[hsl(var(--sv-gray))]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demos.map((demo) => (
                <TableRow key={demo.id} className="border-[hsl(var(--sv-navy-light))] hover:bg-[hsl(var(--sv-navy-deep))]">
                  <TableCell>
                    <div>
                      <p className="text-white font-medium">{demo.title}</p>
                      <p className="text-xs text-[hsl(var(--sv-gray))]">{demo.category}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-[hsl(var(--sv-blue))]/50 text-[hsl(var(--sv-blue-bright))]">
                      {demo.tech}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        demo.status === "online" ? "bg-[hsl(var(--sv-success))]" :
                        demo.status === "degraded" ? "bg-[hsl(var(--sv-warning))]" :
                        "bg-[hsl(var(--sv-danger))]"
                      }`} />
                      <span className="text-[hsl(var(--sv-white-soft))] capitalize">{demo.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-24">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[hsl(var(--sv-gray))]">Uptime</span>
                        <span className={demo.uptime >= 99 ? "text-[hsl(var(--sv-success))]" : demo.uptime >= 95 ? "text-[hsl(var(--sv-warning))]" : "text-[hsl(var(--sv-danger))]"}>
                          {demo.uptime}%
                        </span>
                      </div>
                      <Progress 
                        value={demo.uptime} 
                        className={`h-1 ${demo.uptime >= 99 ? "[&>div]:bg-[hsl(var(--sv-success))]" : demo.uptime >= 95 ? "[&>div]:bg-[hsl(var(--sv-warning))]" : "[&>div]:bg-[hsl(var(--sv-danger))]"}`}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[hsl(var(--sv-gray))]" />
                      <span className="text-[hsl(var(--sv-white-soft))]">{demo.logins}/{demo.maxLogins}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="text-[hsl(var(--sv-white-soft))]">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-[hsl(var(--sv-white-soft))]">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

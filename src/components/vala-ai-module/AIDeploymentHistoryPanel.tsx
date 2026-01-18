/**
 * VALA AI - Deployment History Panel
 * Boss Panel visibility for all client deployments
 */
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  History, Server, CheckCircle2, XCircle, Clock, ExternalLink,
  Eye, FileText, RefreshCw, Filter, Search, Download,
  Shield, Globe, Users, Calendar, ArrowUpRight, MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock deployment history data
const DEPLOYMENT_HISTORY = [
  {
    id: "DEP-M7X9K2",
    clientName: "Delhi Public School",
    serverType: "AWS",
    serverIp: "52.66.123.45",
    domain: "dps.school.edu",
    status: "live",
    deployedAt: "2024-01-15 14:32:00",
    licenseStatus: "active",
    product: "School Management System",
    region: "ap-south",
    logs: 156,
  },
  {
    id: "DEP-K3L8N1",
    clientName: "Ryan International",
    serverType: "GCP",
    serverIp: "35.200.45.78",
    domain: "ryan.edu.in",
    status: "live",
    deployedAt: "2024-01-14 09:15:00",
    licenseStatus: "active",
    product: "School Management System",
    region: "ap-south",
    logs: 142,
  },
  {
    id: "DEP-P9Q4R6",
    clientName: "Amity School",
    serverType: "Azure",
    serverIp: "20.193.67.89",
    domain: "amity.school",
    status: "live",
    deployedAt: "2024-01-13 16:45:00",
    licenseStatus: "active",
    product: "School Management System",
    region: "ap-east",
    logs: 128,
  },
  {
    id: "DEP-T2U7V5",
    clientName: "Modern School",
    serverType: "VPS",
    serverIp: "103.45.67.123",
    domain: "",
    status: "failed",
    deployedAt: "2024-01-12 11:20:00",
    licenseStatus: "n/a",
    product: "School Management System",
    region: "ap-south",
    logs: 89,
    error: "SSH connection timeout after 3 retries",
  },
  {
    id: "DEP-W8X1Y3",
    clientName: "St. Xavier's",
    serverType: "DigitalOcean",
    serverIp: "164.90.123.45",
    domain: "stxaviers.in",
    status: "live",
    deployedAt: "2024-01-11 08:30:00",
    licenseStatus: "active",
    product: "School Management System",
    region: "us-east",
    logs: 167,
  },
];

export const AIDeploymentHistoryPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeployment, setSelectedDeployment] = useState<typeof DEPLOYMENT_HISTORY[0] | null>(null);
  const [showLogsDialog, setShowLogsDialog] = useState(false);

  const filteredDeployments = DEPLOYMENT_HISTORY.filter(d =>
    d.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.serverIp.includes(searchQuery)
  );

  const stats = {
    total: DEPLOYMENT_HISTORY.length,
    live: DEPLOYMENT_HISTORY.filter(d => d.status === "live").length,
    failed: DEPLOYMENT_HISTORY.filter(d => d.status === "failed").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <History className="w-6 h-6 text-primary" />
            Deployment History
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            All AI-managed client deployments
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-foreground">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total Deployments</p>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-500">{stats.live}</p>
            <p className="text-xs text-green-500/70">Live & Active</p>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-red-500">{stats.failed}</p>
            <p className="text-xs text-red-500/70">Failed (Auto-Rollback)</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by client, deployment ID, or IP..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Deployments Table */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm">Recent Deployments</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {filteredDeployments.map((dep, index) => (
                <motion.div
                  key={dep.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{dep.clientName}</span>
                        <Badge className={dep.status === "live" 
                          ? "bg-green-500/20 text-green-500" 
                          : "bg-red-500/20 text-red-500"
                        }>
                          {dep.status === "live" ? (
                            <><CheckCircle2 className="w-3 h-3 mr-1" />LIVE</>
                          ) : (
                            <><XCircle className="w-3 h-3 mr-1" />FAILED</>
                          )}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-mono">{dep.id}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Server className="w-3 h-3" />
                          {dep.serverType}
                        </span>
                        <span>•</span>
                        <span>{dep.serverIp}</span>
                        {dep.domain && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {dep.domain}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {dep.deployedAt}
                        </span>
                        {dep.licenseStatus === "active" && (
                          <Badge className="bg-primary/20 text-primary text-[10px]">
                            <Shield className="w-2.5 h-2.5 mr-1" />
                            Licensed
                          </Badge>
                        )}
                      </div>
                      {dep.error && (
                        <p className="text-xs text-red-400 mt-1">
                          Error: {dep.error}
                        </p>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedDeployment(dep);
                          setShowLogsDialog(true);
                        }}>
                          <Eye className="w-4 h-4 mr-2" />
                          View AI Logs
                        </DropdownMenuItem>
                        {dep.status === "live" && (
                          <DropdownMenuItem>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open System
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <FileText className="w-4 h-4 mr-2" />
                          Deployment Report
                        </DropdownMenuItem>
                        {dep.status === "failed" && (
                          <DropdownMenuItem className="text-amber-500">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Retry Deployment
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* AI Logs Dialog */}
      <Dialog open={showLogsDialog} onOpenChange={setShowLogsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              AI Deployment Logs - {selectedDeployment?.id}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Client</p>
                <p className="font-medium">{selectedDeployment?.clientName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Server</p>
                <p className="font-medium">{selectedDeployment?.serverType} - {selectedDeployment?.serverIp}</p>
              </div>
            </div>
            <ScrollArea className="h-64 bg-slate-900 rounded-lg border border-border">
              <div className="p-4 font-mono text-xs space-y-1 text-slate-400">
                <p>[14:32:00] VALA AI deployment initiated</p>
                <p>[14:32:01] Target: {selectedDeployment?.serverIp}</p>
                <p>[14:32:02] Validating SSH connection...</p>
                <p className="text-green-400">[14:32:05] SSH connection established successfully</p>
                <p>[14:32:06] Scanning server environment...</p>
                <p className="text-green-400">[14:32:10] OS Detected: Ubuntu 22.04 LTS</p>
                <p>[14:32:11] Installing Docker Engine...</p>
                <p className="text-green-400">[14:32:45] Docker installed successfully</p>
                <p>[14:32:46] Installing Nginx...</p>
                <p className="text-green-400">[14:33:00] Nginx installed successfully</p>
                <p>[14:33:01] Cloning project build...</p>
                <p className="text-green-400">[14:33:30] Project deployed</p>
                <p>[14:33:31] Configuring domain & SSL...</p>
                <p className="text-green-400">[14:34:00] SSL certificate issued</p>
                <p>[14:34:01] Running health checks...</p>
                <p className="text-green-400">[14:34:10] All health checks passed</p>
                <p className="text-green-400">[14:34:11] ✅ DEPLOYMENT SUCCESSFUL - SYSTEM IS LIVE</p>
              </div>
            </ScrollArea>
            <p className="text-xs text-muted-foreground text-center">
              Total log entries: {selectedDeployment?.logs} • Read-only view
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIDeploymentHistoryPanel;

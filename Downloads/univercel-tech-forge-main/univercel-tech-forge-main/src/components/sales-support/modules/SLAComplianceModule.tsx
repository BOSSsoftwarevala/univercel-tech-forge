import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Edit, Pause, Play, FileText, Clock, AlertTriangle, CheckCircle, TrendingUp, X, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SLARule {
  id: string;
  name: string;
  description: string;
  responseTime: number; // minutes
  resolutionTime: number; // minutes
  priority: "low" | "medium" | "high" | "critical";
  isActive: boolean;
  compliance: number; // percentage
  breaches: number;
  totalTickets: number;
}

const SLAComplianceModule = () => {
  const [slaRules, setSlaRules] = useState<SLARule[]>([
    { id: "SLA-001", name: "Critical Response", description: "First response for critical issues", responseTime: 15, resolutionTime: 60, priority: "critical", isActive: true, compliance: 92, breaches: 3, totalTickets: 38 },
    { id: "SLA-002", name: "High Priority Response", description: "First response for high priority", responseTime: 30, resolutionTime: 120, priority: "high", isActive: true, compliance: 96, breaches: 2, totalTickets: 52 },
    { id: "SLA-003", name: "Standard Response", description: "First response for standard tickets", responseTime: 60, resolutionTime: 480, priority: "medium", isActive: true, compliance: 98, breaches: 1, totalTickets: 89 },
    { id: "SLA-004", name: "Low Priority Response", description: "First response for low priority", responseTime: 240, resolutionTime: 1440, priority: "low", isActive: true, compliance: 100, breaches: 0, totalTickets: 45 },
    { id: "SLA-005", name: "VIP Customer", description: "Enhanced SLA for VIP customers", responseTime: 10, resolutionTime: 30, priority: "critical", isActive: false, compliance: 85, breaches: 5, totalTickets: 33 },
  ]);

  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [selectedSLA, setSelectedSLA] = useState<SLARule | null>(null);

  const handleToggleSLA = (slaId: string) => {
    const sla = slaRules.find(s => s.id === slaId);
    toast.loading(`${sla?.isActive ? "Pausing" : "Activating"} SLA...`, { id: `toggle-${slaId}` });
    setTimeout(() => {
      setSlaRules(slaRules.map(s => s.id === slaId ? { ...s, isActive: !s.isActive } : s));
      toast.success(`SLA ${sla?.isActive ? "paused" : "activated"}`, { id: `toggle-${slaId}` });
    }, 500);
  };

  const handleEditSLA = (slaId: string) => {
    const sla = slaRules.find(s => s.id === slaId);
    if (sla) {
      setSelectedSLA(sla);
      setEditDrawerOpen(true);
    }
  };

  const handleSaveSLA = () => {
    if (selectedSLA) {
      setSlaRules(slaRules.map(s => 
        s.id === selectedSLA.id ? selectedSLA : s
      ));
      toast.success("SLA updated", { description: `${selectedSLA.name} saved successfully` });
      setEditDrawerOpen(false);
    }
  };

  const handleGenerateReport = () => {
    toast.loading("Generating compliance report...", { id: "report" });
    setTimeout(() => {
      // Create downloadable report
      const content = `SLA Compliance Report\nGenerated: ${new Date().toLocaleString()}\n\nRules:\n${slaRules.map(s => `${s.name}: ${s.compliance}% compliance`).join('\n')}`;
      const blob = new Blob([content], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'SLA_Compliance_Report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Report generated", { id: "report", description: "SLA_Compliance_Report.pdf downloaded" });
    }, 1500);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500/20 text-red-300";
      case "high": return "bg-amber-500/20 text-amber-300";
      case "medium": return "bg-blue-500/20 text-blue-300";
      default: return "bg-slate-500/20 text-slate-300";
    }
  };

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 95) return "text-emerald-400";
    if (compliance >= 85) return "text-amber-400";
    return "text-red-400";
  };

  const overallCompliance = Math.round(slaRules.reduce((sum, s) => sum + s.compliance, 0) / slaRules.length);
  const totalBreaches = slaRules.reduce((sum, s) => sum + s.breaches, 0);
  const activeRules = slaRules.filter(s => s.isActive).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-100">SLA & Compliance</h2>
          <p className="text-slate-400">Manage SLA rules, track compliance, and generate reports</p>
        </div>
        <Button onClick={handleGenerateReport} className="bg-cyan-500 hover:bg-cyan-600 text-white">
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className={`text-2xl font-bold ${getComplianceColor(overallCompliance)}`}>{overallCompliance}%</div>
            <div className="text-xs text-slate-400">Overall Compliance</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4 text-center">
            <Shield className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-cyan-100">{activeRules}</div>
            <div className="text-xs text-slate-400">Active SLA Rules</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-red-500/20">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-100">{totalBreaches}</div>
            <div className="text-xs text-slate-400">Total Breaches</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-100">{slaRules.reduce((sum, s) => sum + s.totalTickets, 0)}</div>
            <div className="text-xs text-slate-400">Total Tickets Tracked</div>
          </CardContent>
        </Card>
      </div>

      {/* SLA Rules List */}
      <Card className="bg-slate-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-100">SLA Rules Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {slaRules.map((sla, index) => (
              <motion.div
                key={sla.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors ${!sla.isActive ? "opacity-60" : ""}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-cyan-400 text-sm">{sla.id}</span>
                    <span className="font-medium text-slate-100">{sla.name}</span>
                    <Badge className={getPriorityColor(sla.priority)}>{sla.priority}</Badge>
                    <Badge className={sla.isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-500/20 text-slate-400"}>
                      {sla.isActive ? "Active" : "Paused"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch checked={sla.isActive} onCheckedChange={() => handleToggleSLA(sla.id)} />
                    <Button size="sm" variant="outline" onClick={() => handleEditSLA(sla.id)} className="border-slate-600">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-slate-400 mb-3">{sla.description}</p>

                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Response Time</span>
                    <div className="text-cyan-300 font-medium">{sla.responseTime} min</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Resolution Time</span>
                    <div className="text-cyan-300 font-medium">{sla.resolutionTime} min</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Compliance</span>
                    <div className={`font-medium ${getComplianceColor(sla.compliance)}`}>{sla.compliance}%</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Breaches / Total</span>
                    <div className="text-slate-300">{sla.breaches} / {sla.totalTickets}</div>
                  </div>
                </div>

                <div className="mt-3">
                  <Progress value={sla.compliance} className="h-2" />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Warning */}
      {totalBreaches > 0 && (
        <Card className="bg-gradient-to-r from-red-900/30 to-amber-900/30 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="font-medium text-red-100">SLA Breach Alert</h3>
                <p className="text-sm text-slate-400">{totalBreaches} SLA breaches detected this period. Review critical tickets immediately.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SLA Edit Drawer */}
      <Sheet open={editDrawerOpen} onOpenChange={setEditDrawerOpen}>
        <SheetContent className="bg-slate-900 border-slate-700">
          <SheetHeader>
            <SheetTitle className="text-cyan-100">Edit SLA Rule</SheetTitle>
            <SheetDescription className="text-slate-400">
              Configure SLA parameters for {selectedSLA?.name}
            </SheetDescription>
          </SheetHeader>
          {selectedSLA && (
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label className="text-slate-300">Rule Name</Label>
                <Input 
                  value={selectedSLA.name}
                  onChange={(e) => setSelectedSLA({...selectedSLA, name: e.target.value})}
                  className="bg-slate-800 border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Description</Label>
                <Input 
                  value={selectedSLA.description}
                  onChange={(e) => setSelectedSLA({...selectedSLA, description: e.target.value})}
                  className="bg-slate-800 border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Response Time (minutes)</Label>
                <Input 
                  type="number"
                  value={selectedSLA.responseTime}
                  onChange={(e) => setSelectedSLA({...selectedSLA, responseTime: parseInt(e.target.value) || 0})}
                  className="bg-slate-800 border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Resolution Time (minutes)</Label>
                <Input 
                  type="number"
                  value={selectedSLA.resolutionTime}
                  onChange={(e) => setSelectedSLA({...selectedSLA, resolutionTime: parseInt(e.target.value) || 0})}
                  className="bg-slate-800 border-slate-600"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveSLA} className="flex-1 bg-cyan-500 hover:bg-cyan-600">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditDrawerOpen(false)} className="border-slate-600">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SLAComplianceModule;

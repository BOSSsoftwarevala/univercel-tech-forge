import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Ban, Target, MapPin, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface SalesRep {
  id: string;
  name: string;
  email: string;
  region: string;
  target: number;
  achieved: number;
  leadsAssigned: number;
  conversionRate: number;
  status: "active" | "suspended";
}

const SalesTeamModule = () => {
  const [reps, setReps] = useState<SalesRep[]>([
    { id: "REP-001", name: "Alex Thompson", email: "alex@sales.com", region: "North America", target: 50000, achieved: 38000, leadsAssigned: 45, conversionRate: 32, status: "active" },
    { id: "REP-002", name: "Maria Garcia", email: "maria@sales.com", region: "Europe", target: 45000, achieved: 42000, leadsAssigned: 38, conversionRate: 45, status: "active" },
    { id: "REP-003", name: "David Lee", email: "david@sales.com", region: "Asia Pacific", target: 60000, achieved: 28000, leadsAssigned: 52, conversionRate: 28, status: "active" },
    { id: "REP-004", name: "Sarah Miller", email: "sarah@sales.com", region: "Middle East", target: 35000, achieved: 35500, leadsAssigned: 30, conversionRate: 55, status: "active" },
    { id: "REP-005", name: "John Brown", email: "john@sales.com", region: "South America", target: 40000, achieved: 15000, leadsAssigned: 28, conversionRate: 18, status: "suspended" },
  ]);

  const handleAddRep = () => {
    toast.loading("Adding new sales rep...", { id: "add-rep" });
    setTimeout(() => {
      const newRep: SalesRep = {
        id: `REP-${String(reps.length + 1).padStart(3, '0')}`,
        name: "New Sales Rep",
        email: "new@sales.com",
        region: "Unassigned",
        target: 30000,
        achieved: 0,
        leadsAssigned: 0,
        conversionRate: 0,
        status: "active",
      };
      setReps([...reps, newRep]);
      toast.success("Sales rep added successfully", { id: "add-rep" });
    }, 800);
  };

  const handleAssignRegion = (repId: string, newRegion: string) => {
    toast.loading("Assigning region...", { id: `region-${repId}` });
    setTimeout(() => {
      setReps(reps.map(r => r.id === repId ? { ...r, region: newRegion } : r));
      toast.success(`Region updated to ${newRegion}`, { id: `region-${repId}` });
    }, 500);
  };

  const handleSetTarget = (repId: string, newTarget: number) => {
    toast.loading("Updating target...", { id: `target-${repId}` });
    setTimeout(() => {
      setReps(reps.map(r => r.id === repId ? { ...r, target: newTarget } : r));
      toast.success(`Target updated to $${newTarget.toLocaleString()}`, { id: `target-${repId}` });
    }, 500);
  };

  const handleSuspend = (repId: string) => {
    const rep = reps.find(r => r.id === repId);
    const newStatus = rep?.status === "active" ? "suspended" : "active";
    toast.loading(`${newStatus === "suspended" ? "Suspending" : "Activating"} rep...`, { id: `suspend-${repId}` });
    setTimeout(() => {
      setReps(reps.map(r => r.id === repId ? { ...r, status: newStatus } : r));
      toast.success(`Rep ${newStatus}`, { id: `suspend-${repId}` });
    }, 600);
  };

  const totalTarget = reps.reduce((sum, r) => sum + r.target, 0);
  const totalAchieved = reps.reduce((sum, r) => sum + r.achieved, 0);
  const avgConversion = Math.round(reps.reduce((sum, r) => sum + r.conversionRate, 0) / reps.length);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-100">Sales Team Management</h2>
          <p className="text-slate-400">Manage sales reps, territories, and targets</p>
        </div>
        <Button onClick={handleAddRep} className="bg-emerald-500 hover:bg-emerald-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Sales Rep
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-emerald-500/20">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-100">{reps.filter(r => r.status === "active").length}</div>
            <div className="text-xs text-slate-400">Active Reps</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-cyan-500/20">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-cyan-100">${(totalTarget / 1000).toFixed(0)}K</div>
            <div className="text-xs text-slate-400">Total Target</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-100">${(totalAchieved / 1000).toFixed(0)}K</div>
            <div className="text-xs text-slate-400">Achieved</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-100">{avgConversion}%</div>
            <div className="text-xs text-slate-400">Avg Conversion</div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Reps List */}
      <Card className="bg-slate-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-100">Sales Team Roster</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reps.map((rep, index) => (
              <motion.div
                key={rep.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors ${rep.status === "suspended" ? "opacity-60" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-emerald-500/20 text-emerald-300">{rep.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-cyan-400 text-sm">{rep.id}</span>
                      <span className="font-medium text-slate-100">{rep.name}</span>
                      <Badge className={rep.status === "active" ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}>{rep.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <MapPin className="w-3 h-3" />
                      {rep.region} • {rep.leadsAssigned} leads • {rep.conversionRate}% conversion
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-48">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Target Progress</span>
                      <span className="text-emerald-400">{Math.round((rep.achieved / rep.target) * 100)}%</span>
                    </div>
                    <Progress value={(rep.achieved / rep.target) * 100} className="h-2" />
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-slate-500">${rep.achieved.toLocaleString()}</span>
                      <span className="text-slate-500">${rep.target.toLocaleString()}</span>
                    </div>
                  </div>

                  <Select defaultValue={rep.region} onValueChange={(v) => handleAssignRegion(rep.id, v)}>
                    <SelectTrigger className="w-36 bg-slate-700/50 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="North America">North America</SelectItem>
                      <SelectItem value="Europe">Europe</SelectItem>
                      <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
                      <SelectItem value="Middle East">Middle East</SelectItem>
                      <SelectItem value="South America">South America</SelectItem>
                      <SelectItem value="Africa">Africa</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    defaultValue={rep.target}
                    className="w-28 bg-slate-700/50 border-slate-600"
                    onBlur={(e) => handleSetTarget(rep.id, parseInt(e.target.value) || rep.target)}
                  />

                  <Button size="sm" variant={rep.status === "active" ? "destructive" : "default"} onClick={() => handleSuspend(rep.id)}>
                    {rep.status === "active" ? <Ban className="w-4 h-4" /> : "Activate"}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesTeamModule;

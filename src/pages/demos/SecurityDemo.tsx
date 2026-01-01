import { useState } from "react";
import { Shield, Camera, Users, MapPin, AlertTriangle, CheckCircle, Clock, Eye, Plus, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Guard { id: number; name: string; location: string; status: string; shift: string; lastCheck: string; }
interface Alert { time: string; type: string; location: string; severity: string; resolved: boolean; }

const initialGuards: Guard[] = [
  { id: 1, name: "Ramesh Kumar", location: "Gate A", status: "On Duty", shift: "Day", lastCheck: "2 min ago" },
  { id: 2, name: "Suresh Yadav", location: "Parking", status: "On Duty", shift: "Day", lastCheck: "5 min ago" },
  { id: 3, name: "Vijay Singh", location: "Building B", status: "Break", shift: "Day", lastCheck: "15 min ago" },
  { id: 4, name: "Anil Sharma", location: "Warehouse", status: "On Duty", shift: "Day", lastCheck: "1 min ago" },
];

const initialAlerts: Alert[] = [
  { time: "10:45 AM", type: "Motion Detected", location: "Parking Lot", severity: "low", resolved: false },
  { time: "09:30 AM", type: "Unauthorized Access", location: "Server Room", severity: "high", resolved: false },
  { time: "08:15 AM", type: "Camera Offline", location: "Gate B", severity: "medium", resolved: false },
];

export default function SecurityDemo() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [guards, setGuards] = useState<Guard[]>(initialGuards);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [stats, setStats] = useState({ onDuty: 12, cameras: 24, totalCameras: 26, alerts: 8, patrols: 45 });

  const updateGuardStatus = (guardId: number, newStatus: string) => {
    setGuards(guards.map(g => {
      if (g.id === guardId) {
        toast.success(`${g.name} status: ${newStatus}`);
        return { ...g, status: newStatus, lastCheck: "Just now" };
      }
      return g;
    }));
  };

  const resolveAlert = (index: number) => {
    setAlerts(alerts.map((a, i) => {
      if (i === index && !a.resolved) {
        setStats({ ...stats, alerts: stats.alerts - 1 });
        toast.success(`Alert resolved: ${a.type}`);
        return { ...a, resolved: true };
      }
      return a;
    }));
  };

  const callGuard = (guard: Guard) => {
    toast.success(`Calling ${guard.name}...`);
  };

  const checkPatrol = (guard: Guard) => {
    setGuards(guards.map(g => g.id === guard.id ? { ...g, lastCheck: "Just now" } : g));
    setStats({ ...stats, patrols: stats.patrols + 1 });
    toast.success(`Patrol check recorded for ${guard.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-cyan-400" />
            <span className="text-xl font-bold text-white">SecureGuard</span>
            <Badge variant="outline" className="ml-2 text-cyan-400 border-cyan-400">by Software Vala</Badge>
          </div>
          <nav className="flex gap-1">
            {["Dashboard", "Guards", "Cameras", "Reports"].map(tab => (
              <Button key={tab} variant={activeTab === tab ? "default" : "ghost"} className={activeTab === tab ? "bg-cyan-600 hover:bg-cyan-700" : "text-white/80 hover:text-cyan-400 hover:bg-white/10"} onClick={() => { setActiveTab(tab); toast.info(`Viewing ${tab}`); }}>{tab}</Button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">{activeTab}</h1>
          <Badge className="bg-cyan-600">{stats.patrols} patrol checks today</Badge>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors"><CardContent className="p-4"><div className="flex justify-between items-start"><div><p className="text-white/60 text-sm">Guards On Duty</p><p className="text-2xl font-bold text-white">{stats.onDuty}</p></div><Users className="h-8 w-8 text-cyan-400" /></div><p className="text-green-400 text-sm mt-2">All positions covered</p></CardContent></Card>
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors"><CardContent className="p-4"><div className="flex justify-between items-start"><div><p className="text-white/60 text-sm">Active Cameras</p><p className="text-2xl font-bold text-white">{stats.cameras}/{stats.totalCameras}</p></div><Camera className="h-8 w-8 text-blue-400" /></div><p className="text-yellow-400 text-sm mt-2">{stats.totalCameras - stats.cameras} offline</p></CardContent></Card>
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors cursor-pointer" onClick={() => toast.info(`${stats.alerts} active alerts`)}><CardContent className="p-4"><div className="flex justify-between items-start"><div><p className="text-white/60 text-sm">Today's Alerts</p><p className="text-2xl font-bold text-white">{stats.alerts}</p></div><AlertTriangle className="h-8 w-8 text-yellow-400" /></div><p className="text-red-400 text-sm mt-2">1 critical</p></CardContent></Card>
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors"><CardContent className="p-4"><div className="flex justify-between items-start"><div><p className="text-white/60 text-sm">Patrol Checks</p><p className="text-2xl font-bold text-white">{stats.patrols}</p></div><CheckCircle className="h-8 w-8 text-green-400" /></div><p className="text-green-400 text-sm mt-2">On schedule</p></CardContent></Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="bg-white/10 border-white/20 lg:col-span-2">
            <CardHeader><CardTitle className="text-white">Guard Status</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {guards.map(guard => (
                  <div key={guard.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold">{guard.name.charAt(0)}</div>
                      <div><p className="text-white font-medium">{guard.name}</p><p className="text-white/60 text-sm flex items-center gap-1"><MapPin className="h-3 w-3" /> {guard.location}</p><p className="text-cyan-300 text-xs">Last check: {guard.lastCheck}</p></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={guard.status} onValueChange={(v) => updateGuardStatus(guard.id, v)}>
                        <SelectTrigger className={`w-24 h-7 text-xs ${guard.status === "On Duty" ? "bg-green-600 border-green-600" : "bg-yellow-600 border-yellow-600"} text-white`}><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-white/20"><SelectItem value="On Duty">On Duty</SelectItem><SelectItem value="Break">Break</SelectItem><SelectItem value="Off Duty">Off Duty</SelectItem></SelectContent>
                      </Select>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-white/60 hover:text-cyan-400" onClick={() => checkPatrol(guard)}><CheckCircle className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-white/60 hover:text-green-400" onClick={() => callGuard(guard)}><Phone className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardHeader><CardTitle className="text-white">Recent Alerts</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert, i) => (
                  <div key={i} className={`p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer ${alert.resolved ? "opacity-50" : ""}`} onClick={() => resolveAlert(i)}>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className={`h-5 w-5 mt-0.5 ${alert.severity === "high" ? "text-red-400" : alert.severity === "medium" ? "text-yellow-400" : "text-blue-400"}`} />
                      <div className="flex-1"><p className={`text-white text-sm font-medium ${alert.resolved ? "line-through" : ""}`}>{alert.type}</p><p className="text-white/60 text-xs">{alert.location}</p><p className="text-white/40 text-xs">{alert.time}</p></div>
                      {alert.resolved && <CheckCircle className="h-4 w-4 text-green-400" />}
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700"><Eye className="h-4 w-4 mr-2" /> View All Alerts</Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="mt-12 py-6 border-t border-white/10 text-center text-white/60"><p>© 2025 Software Vala - The Name of Trust. All rights reserved.</p></footer>
    </div>
  );
}

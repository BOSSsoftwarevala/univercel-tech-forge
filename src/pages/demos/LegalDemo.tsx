import { useState } from "react";
import { Scale, FileText, Users, Calendar, Clock, Briefcase, AlertCircle, CheckCircle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Case { id: string; client: string; type: string; status: string; hearing: string; priority: string; }
interface Task { task: string; due: string; status: string; }

const initialCases: Case[] = [
  { id: "CASE001", client: "ABC Corp", type: "Corporate", status: "Active", hearing: "15 Jan", priority: "High" },
  { id: "CASE002", client: "Rajesh Kumar", type: "Civil", status: "Active", hearing: "22 Jan", priority: "Medium" },
  { id: "CASE003", client: "XYZ Ltd", type: "IP Rights", status: "Pending", hearing: "28 Jan", priority: "High" },
  { id: "CASE004", client: "Sharma Family", type: "Property", status: "Closed", hearing: "-", priority: "Low" },
];

const initialTasks: Task[] = [
  { task: "File response in ABC Corp matter", due: "Today", status: "urgent" },
  { task: "Prepare contract draft for new client", due: "Tomorrow", status: "pending" },
  { task: "Review evidence documents", due: "18 Jan", status: "pending" },
  { task: "Client meeting preparation", due: "20 Jan", status: "completed" },
];

export default function LegalDemo() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [cases, setCases] = useState<Case[]>(initialCases);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newCase, setNewCase] = useState({ client: "", type: "Corporate", hearing: "" });
  const [newTask, setNewTask] = useState({ task: "", due: "Today" });
  const [stats, setStats] = useState({ active: 24, hearings: 8, pending: 12, clients: 156 });

  const addCase = () => {
    if (!newCase.client) { toast.error("Enter client name"); return; }
    const c: Case = { id: `CASE${String(cases.length + 1).padStart(3, '0')}`, client: newCase.client, type: newCase.type, status: "Active", hearing: newCase.hearing || "TBD", priority: "Medium" };
    setCases([c, ...cases]);
    setStats({ ...stats, active: stats.active + 1, clients: stats.clients + 1 });
    setShowCaseModal(false);
    setNewCase({ client: "", type: "Corporate", hearing: "" });
    toast.success(`Case ${c.id} created!`);
  };

  const addTask = () => {
    if (!newTask.task) { toast.error("Enter task description"); return; }
    setTasks([{ ...newTask, status: "pending" }, ...tasks]);
    setStats({ ...stats, pending: stats.pending + 1 });
    setShowTaskModal(false);
    setNewTask({ task: "", due: "Today" });
    toast.success("Task added!");
  };

  const toggleTask = (index: number) => {
    setTasks(tasks.map((t, i) => {
      if (i === index) {
        const newStatus = t.status === "completed" ? "pending" : "completed";
        toast.success(newStatus === "completed" ? "Task completed!" : "Task reopened");
        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  const updateCaseStatus = (caseId: string, newStatus: string) => {
    setCases(cases.map(c => c.id === caseId ? { ...c, status: newStatus } : c));
    toast.success(`Case ${caseId} updated to ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-zinc-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-amber-400" />
            <span className="text-xl font-bold text-white">LegalPractice</span>
            <Badge variant="outline" className="ml-2 text-amber-400 border-amber-400">by Software Vala</Badge>
          </div>
          <nav className="flex gap-1">
            {["Dashboard", "Cases", "Clients", "Billing"].map(tab => (
              <Button key={tab} variant={activeTab === tab ? "default" : "ghost"} className={activeTab === tab ? "bg-amber-600 hover:bg-amber-700" : "text-white/80 hover:text-amber-400 hover:bg-white/10"} onClick={() => { setActiveTab(tab); toast.info(`Viewing ${tab}`); }}>{tab}</Button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">{activeTab}</h1>
          <div className="flex gap-2">
            <Button onClick={() => setShowCaseModal(true)} className="bg-amber-600 hover:bg-amber-700"><Plus className="h-4 w-4 mr-2" /> New Case</Button>
            <Button onClick={() => setShowTaskModal(true)} variant="outline" className="border-white/20 text-white"><Plus className="h-4 w-4 mr-2" /> Add Task</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors"><CardContent className="p-4"><div className="flex justify-between items-start"><div><p className="text-white/60 text-sm">Active Cases</p><p className="text-2xl font-bold text-white">{stats.active}</p></div><Briefcase className="h-8 w-8 text-amber-400" /></div><p className="text-amber-400 text-sm mt-2">3 high priority</p></CardContent></Card>
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors"><CardContent className="p-4"><div className="flex justify-between items-start"><div><p className="text-white/60 text-sm">Hearings This Week</p><p className="text-2xl font-bold text-white">{stats.hearings}</p></div><Calendar className="h-8 w-8 text-blue-400" /></div><p className="text-blue-400 text-sm mt-2">Next: Tomorrow</p></CardContent></Card>
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors"><CardContent className="p-4"><div className="flex justify-between items-start"><div><p className="text-white/60 text-sm">Pending Tasks</p><p className="text-2xl font-bold text-white">{stats.pending}</p></div><FileText className="h-8 w-8 text-orange-400" /></div><p className="text-orange-400 text-sm mt-2">2 due today</p></CardContent></Card>
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors"><CardContent className="p-4"><div className="flex justify-between items-start"><div><p className="text-white/60 text-sm">Total Clients</p><p className="text-2xl font-bold text-white">{stats.clients}</p></div><Users className="h-8 w-8 text-green-400" /></div><p className="text-green-400 text-sm mt-2">+5 this month</p></CardContent></Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="bg-white/10 border-white/20 lg:col-span-2">
            <CardHeader><CardTitle className="text-white">Recent Cases</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cases.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div><div className="flex items-center gap-2 mb-1"><p className="text-white font-medium">{c.client}</p><Badge variant="outline" className="text-xs">{c.id}</Badge></div><p className="text-white/60 text-sm">{c.type} • Hearing: {c.hearing}</p></div>
                    <div className="flex items-center gap-2">
                      <Badge className={c.priority === "High" ? "bg-red-600" : c.priority === "Medium" ? "bg-yellow-600" : "bg-gray-600"}>{c.priority}</Badge>
                      <Select value={c.status} onValueChange={(v) => updateCaseStatus(c.id, v)}>
                        <SelectTrigger className={`w-24 h-7 text-xs ${c.status === "Active" ? "bg-green-600 border-green-600" : c.status === "Pending" ? "bg-blue-600 border-blue-600" : "bg-gray-600 border-gray-600"} text-white`}><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-white/20"><SelectItem value="Active">Active</SelectItem><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Closed">Closed</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardHeader><CardTitle className="text-white">Tasks</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks.map((task, i) => (
                  <div key={i} className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer" onClick={() => toggleTask(i)}>
                    <div className="flex items-start gap-2">
                      {task.status === "completed" ? <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" /> : task.status === "urgent" ? <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" /> : <Clock className="h-5 w-5 text-yellow-400 mt-0.5" />}
                      <div><p className={`text-sm ${task.status === "completed" ? "text-white/50 line-through" : "text-white"}`}>{task.task}</p><p className="text-white/50 text-xs">Due: {task.due}</p></div>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-amber-600 hover:bg-amber-700" onClick={() => setShowTaskModal(true)}><Plus className="h-4 w-4 mr-2" /> Add New Task</Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={showCaseModal} onOpenChange={setShowCaseModal}>
        <DialogContent className="bg-zinc-900 border-white/20 text-white">
          <DialogHeader><DialogTitle>Add New Case</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label>Client Name</Label><Input placeholder="Enter client name" value={newCase.client} onChange={(e) => setNewCase({ ...newCase, client: e.target.value })} className="bg-white/10 border-white/20 text-white mt-1" /></div>
            <div><Label>Case Type</Label><Select value={newCase.type} onValueChange={(v) => setNewCase({ ...newCase, type: v })}><SelectTrigger className="bg-white/10 border-white/20 text-white mt-1"><SelectValue /></SelectTrigger><SelectContent className="bg-zinc-800 border-white/20">{["Corporate", "Civil", "Criminal", "IP Rights", "Property", "Family"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>Next Hearing</Label><Input placeholder="e.g., 15 Jan" value={newCase.hearing} onChange={(e) => setNewCase({ ...newCase, hearing: e.target.value })} className="bg-white/10 border-white/20 text-white mt-1" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowCaseModal(false)} className="border-white/20 text-white">Cancel</Button><Button onClick={addCase} className="bg-amber-600 hover:bg-amber-700">Create Case</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showTaskModal} onOpenChange={setShowTaskModal}>
        <DialogContent className="bg-zinc-900 border-white/20 text-white">
          <DialogHeader><DialogTitle>Add New Task</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label>Task Description</Label><Input placeholder="Enter task" value={newTask.task} onChange={(e) => setNewTask({ ...newTask, task: e.target.value })} className="bg-white/10 border-white/20 text-white mt-1" /></div>
            <div><Label>Due Date</Label><Select value={newTask.due} onValueChange={(v) => setNewTask({ ...newTask, due: v })}><SelectTrigger className="bg-white/10 border-white/20 text-white mt-1"><SelectValue /></SelectTrigger><SelectContent className="bg-zinc-800 border-white/20">{["Today", "Tomorrow", "This Week", "Next Week"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowTaskModal(false)} className="border-white/20 text-white">Cancel</Button><Button onClick={addTask} className="bg-amber-600 hover:bg-amber-700">Add Task</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="mt-12 py-6 border-t border-white/10 text-center text-white/60"><p>© 2025 Software Vala - The Name of Trust. All rights reserved.</p></footer>
    </div>
  );
}

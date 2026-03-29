import { useState } from "react";
import { Users, TrendingUp, Phone, Mail, Calendar, Target, BarChart3, Plus, X, Edit, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Lead {
  id: number;
  name: string;
  contact: string;
  value: string;
  stage: string;
  probability: number;
}

interface Activity {
  id: number;
  type: string;
  title: string;
  time: string;
  status: string;
}

const initialLeads: Lead[] = [
  { id: 1, name: "Tech Solutions Ltd", contact: "Rajesh Kumar", value: "₹5L", stage: "Negotiation", probability: 80 },
  { id: 2, name: "Global Traders", contact: "Priya Sharma", value: "₹3.2L", stage: "Proposal", probability: 60 },
  { id: 3, name: "Metro Industries", contact: "Amit Patel", value: "₹8L", stage: "Discovery", probability: 30 },
  { id: 4, name: "Star Enterprises", contact: "Neha Gupta", value: "₹2.5L", stage: "Closed Won", probability: 100 },
];

const initialActivities: Activity[] = [
  { id: 1, type: "call", title: "Follow-up call with Tech Solutions", time: "10:00 AM", status: "scheduled" },
  { id: 2, type: "email", title: "Send proposal to Global Traders", time: "11:30 AM", status: "pending" },
  { id: 3, type: "meeting", title: "Demo presentation", time: "02:00 PM", status: "scheduled" },
  { id: 4, type: "call", title: "Contract discussion", time: "04:00 PM", status: "completed" },
];

export default function CRMDemo() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [showAddLead, setShowAddLead] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", contact: "", value: "", stage: "Discovery" });
  const [newActivity, setNewActivity] = useState({ type: "call", title: "", time: "" });

  const stats = {
    totalLeads: leads.length,
    pipelineValue: leads.reduce((sum, l) => sum + parseInt(l.value.replace(/[₹L.]/g, "")) * 100000, 0),
    wonValue: leads.filter(l => l.stage === "Closed Won").reduce((sum, l) => sum + parseInt(l.value.replace(/[₹L.]/g, "")) * 100000, 0),
    conversionRate: Math.round((leads.filter(l => l.stage === "Closed Won").length / leads.length) * 100)
  };

  const handleAddLead = () => {
    if (!newLead.name || !newLead.contact || !newLead.value) {
      toast.error("Please fill all fields");
      return;
    }
    const id = Math.max(...leads.map(l => l.id)) + 1;
    const probability = newLead.stage === "Discovery" ? 30 : newLead.stage === "Proposal" ? 60 : newLead.stage === "Negotiation" ? 80 : 100;
    setLeads([...leads, { id, ...newLead, probability }]);
    setNewLead({ name: "", contact: "", value: "", stage: "Discovery" });
    setShowAddLead(false);
    toast.success("Lead added successfully!");
  };

  const handleAddActivity = () => {
    if (!newActivity.title || !newActivity.time) {
      toast.error("Please fill all fields");
      return;
    }
    const id = Math.max(...activities.map(a => a.id)) + 1;
    setActivities([...activities, { id, ...newActivity, status: "scheduled" }]);
    setNewActivity({ type: "call", title: "", time: "" });
    setShowAddActivity(false);
    toast.success("Activity scheduled!");
  };

  const updateLeadStage = (id: number, stage: string) => {
    const probability = stage === "Discovery" ? 30 : stage === "Proposal" ? 60 : stage === "Negotiation" ? 80 : 100;
    setLeads(leads.map(l => l.id === id ? { ...l, stage, probability } : l));
    toast.success(`Lead moved to ${stage}`);
  };

  const deleteLead = (id: number) => {
    setLeads(leads.filter(l => l.id !== id));
    toast.success("Lead removed");
  };

  const completeActivity = (id: number) => {
    setActivities(activities.map(a => a.id === id ? { ...a, status: "completed" } : a));
    toast.success("Activity marked as completed");
  };

  const deleteActivity = (id: number) => {
    setActivities(activities.filter(a => a.id !== id));
    toast.success("Activity removed");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold text-white">SalesPro CRM</span>
            <Badge variant="outline" className="ml-2 text-blue-400 border-blue-400">by Software Vala</Badge>
          </div>
          <nav className="flex gap-4 text-white/80">
            <span className="hover:text-blue-400 cursor-pointer">Dashboard</span>
            <span className="hover:text-blue-400 cursor-pointer">Leads</span>
            <span className="hover:text-blue-400 cursor-pointer">Deals</span>
            <span className="hover:text-blue-400 cursor-pointer">Reports</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Total Leads</p>
                  <p className="text-2xl font-bold text-white">{stats.totalLeads}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
              <p className="text-green-400 text-sm mt-2">+{leads.filter(l => l.stage === "Discovery").length} new</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Pipeline Value</p>
                  <p className="text-2xl font-bold text-white">₹{(stats.pipelineValue / 100000).toFixed(1)}L</p>
                </div>
                <Target className="h-8 w-8 text-emerald-400" />
              </div>
              <p className="text-emerald-400 text-sm mt-2">{leads.filter(l => l.stage !== "Closed Won").length} active deals</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Won This Month</p>
                  <p className="text-2xl font-bold text-white">₹{(stats.wonValue / 100000).toFixed(1)}L</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
              <p className="text-green-400 text-sm mt-2">{leads.filter(l => l.stage === "Closed Won").length} deals closed</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Conversion Rate</p>
                  <p className="text-2xl font-bold text-white">{stats.conversionRate}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-violet-400" />
              </div>
              <p className="text-violet-400 text-sm mt-2">Based on closed deals</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="bg-white/10 border-white/20 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Active Deals</CardTitle>
              <Dialog open={showAddLead} onOpenChange={setShowAddLead}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-1" /> Add Lead
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-white/20 text-white">
                  <DialogHeader>
                    <DialogTitle>Add New Lead</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Company Name</Label>
                      <Input
                        value={newLead.name}
                        onChange={e => setNewLead({ ...newLead, name: e.target.value })}
                        placeholder="Enter company name"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label>Contact Person</Label>
                      <Input
                        value={newLead.contact}
                        onChange={e => setNewLead({ ...newLead, contact: e.target.value })}
                        placeholder="Enter contact name"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label>Deal Value</Label>
                      <Input
                        value={newLead.value}
                        onChange={e => setNewLead({ ...newLead, value: e.target.value })}
                        placeholder="e.g. ₹5L"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label>Stage</Label>
                      <Select value={newLead.stage} onValueChange={v => setNewLead({ ...newLead, stage: v })}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Discovery">Discovery</SelectItem>
                          <SelectItem value="Proposal">Proposal</SelectItem>
                          <SelectItem value="Negotiation">Negotiation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" className="border-white/20 text-white">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleAddLead} className="bg-blue-600 hover:bg-blue-700">Add Lead</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leads.map(lead => (
                  <div key={lead.id} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white font-medium">{lead.name}</p>
                        <p className="text-white/60 text-sm">Contact: {lead.contact}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-blue-400 font-bold">{lead.value}</p>
                        <Select value={lead.stage} onValueChange={v => updateLeadStage(lead.id, v)}>
                          <SelectTrigger className={`h-7 text-xs border-0 w-auto ${
                            lead.stage === "Closed Won" ? "bg-green-600" :
                            lead.stage === "Negotiation" ? "bg-blue-600" :
                            lead.stage === "Proposal" ? "bg-yellow-600" : "bg-gray-600"
                          }`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Discovery">Discovery</SelectItem>
                            <SelectItem value="Proposal">Proposal</SelectItem>
                            <SelectItem value="Negotiation">Negotiation</SelectItem>
                            <SelectItem value="Closed Won">Closed Won</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-red-400 hover:text-red-300" onClick={() => deleteLead(lead.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/50 text-sm">Probability:</span>
                      <Progress value={lead.probability} className="flex-1" />
                      <span className="text-white/60 text-sm w-10">{lead.probability}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Today's Activities</CardTitle>
              <Dialog open={showAddActivity} onOpenChange={setShowAddActivity}>
                <DialogTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-white/60 hover:text-white">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-white/20 text-white">
                  <DialogHeader>
                    <DialogTitle>Schedule Activity</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Type</Label>
                      <Select value={newActivity.type} onValueChange={v => setNewActivity({ ...newActivity, type: v })}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="call">Call</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="meeting">Meeting</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={newActivity.title}
                        onChange={e => setNewActivity({ ...newActivity, title: e.target.value })}
                        placeholder="Activity description"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label>Time</Label>
                      <Input
                        value={newActivity.time}
                        onChange={e => setNewActivity({ ...newActivity, time: e.target.value })}
                        placeholder="e.g. 10:00 AM"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" className="border-white/20 text-white">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleAddActivity} className="bg-blue-600 hover:bg-blue-700">Schedule</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="p-3 bg-white/5 rounded-lg">
                    <div className="flex items-start gap-3">
                      {activity.type === "call" ? <Phone className="h-5 w-5 text-green-400 mt-0.5" /> :
                       activity.type === "email" ? <Mail className="h-5 w-5 text-blue-400 mt-0.5" /> :
                       <Calendar className="h-5 w-5 text-purple-400 mt-0.5" />}
                      <div className="flex-1">
                        <p className={`text-sm ${activity.status === "completed" ? "text-white/50 line-through" : "text-white"}`}>
                          {activity.title}
                        </p>
                        <p className="text-white/40 text-xs">{activity.time}</p>
                      </div>
                      <div className="flex gap-1">
                        {activity.status !== "completed" && (
                          <Button size="icon" variant="ghost" className="h-6 w-6 text-green-400 hover:text-green-300" onClick={() => completeActivity(activity.id)}>
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button size="icon" variant="ghost" className="h-6 w-6 text-red-400 hover:text-red-300" onClick={() => deleteActivity(activity.id)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700" onClick={() => toast.info("Opening full activity calendar...")}>
                View All Activities
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="mt-12 py-6 border-t border-white/10 text-center text-white/60">
        <p>© 2025 Software Vala - The Name of Trust. All rights reserved.</p>
      </footer>
    </div>
  );
}

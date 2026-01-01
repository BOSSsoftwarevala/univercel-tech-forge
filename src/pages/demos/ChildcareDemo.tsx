import { useState } from "react";
import { Baby, Calendar, Clock, Users, Heart, Bell, Camera, Phone, Plus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Child {
  id: number;
  name: string;
  age: string;
  parent: string;
  status: string;
  mood: string;
}

interface Activity {
  time: string;
  activity: string;
  status: string;
}

const initialChildren: Child[] = [
  { id: 1, name: "Aarav Sharma", age: "3 yrs", parent: "Priya Sharma", status: "Present", mood: "😊" },
  { id: 2, name: "Ananya Patel", age: "4 yrs", parent: "Rahul Patel", status: "Present", mood: "😄" },
  { id: 3, name: "Vihaan Kumar", age: "2 yrs", parent: "Neha Kumar", status: "Absent", mood: "-" },
  { id: 4, name: "Ishita Gupta", age: "3 yrs", parent: "Amit Gupta", status: "Present", mood: "😴" },
];

const initialActivities: Activity[] = [
  { time: "09:00 AM", activity: "Morning Circle Time", status: "completed" },
  { time: "10:00 AM", activity: "Art & Craft", status: "completed" },
  { time: "11:00 AM", activity: "Snack Time", status: "in-progress" },
  { time: "12:00 PM", activity: "Nap Time", status: "upcoming" },
  { time: "02:00 PM", activity: "Outdoor Play", status: "upcoming" },
];

export default function ChildcareDemo() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [children, setChildren] = useState<Child[]>(initialChildren);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [newChild, setNewChild] = useState({ name: "", age: "3 yrs", parent: "" });
  const [stats, setStats] = useState({ present: 24, total: 28, staff: 8, pending: 3 });

  const toggleAttendance = (id: number) => {
    setChildren(children.map(child => {
      if (child.id === id) {
        const newStatus = child.status === "Present" ? "Absent" : "Present";
        const diff = newStatus === "Present" ? 1 : -1;
        setStats({ ...stats, present: stats.present + diff });
        toast.success(`${child.name} marked as ${newStatus}`);
        return { ...child, status: newStatus, mood: newStatus === "Present" ? "😊" : "-" };
      }
      return child;
    }));
  };

  const updateMood = (id: number, mood: string) => {
    setChildren(children.map(child => {
      if (child.id === id) {
        toast.info(`${child.name}'s mood updated`);
        return { ...child, mood };
      }
      return child;
    }));
  };

  const updateActivityStatus = (activityName: string, newStatus: string) => {
    setActivities(activities.map(act => {
      if (act.activity === activityName) {
        toast.success(`${activityName} marked as ${newStatus}`);
        return { ...act, status: newStatus };
      }
      return act;
    }));
  };

  const handleAddChild = () => {
    if (!newChild.name || !newChild.parent) {
      toast.error("Please fill all fields");
      return;
    }
    const child: Child = {
      id: children.length + 1,
      name: newChild.name,
      age: newChild.age,
      parent: newChild.parent,
      status: "Present",
      mood: "😊"
    };
    setChildren([...children, child]);
    setStats({ ...stats, present: stats.present + 1, total: stats.total + 1 });
    setShowAddModal(false);
    setNewChild({ name: "", age: "3 yrs", parent: "" });
    toast.success(`${child.name} enrolled successfully!`);
  };

  const callParent = (child: Child) => {
    setSelectedChild(child);
    setShowCallModal(true);
  };

  const sendUpdate = () => {
    toast.success("Photo update sent to all parents!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400">
      <header className="bg-white/20 backdrop-blur-sm border-b border-white/30 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Baby className="h-8 w-8 text-pink-600" />
            <span className="text-xl font-bold text-white">LittleStars</span>
            <Badge variant="outline" className="ml-2 text-white border-white">by Software Vala</Badge>
          </div>
          <nav className="flex gap-1">
            {["Dashboard", "Children", "Parents", "Reports"].map(tab => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "ghost"}
                className={activeTab === tab ? "bg-pink-600 hover:bg-pink-700" : "text-white hover:bg-white/20"}
                onClick={() => { setActiveTab(tab); toast.info(`Viewing ${tab}`); }}
              >
                {tab}
              </Button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">{activeTab}</h1>
          <Button onClick={() => setShowAddModal(true)} className="bg-pink-600 hover:bg-pink-700">
            <Plus className="h-4 w-4 mr-2" /> Enroll Child
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/90 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Children Today</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.present}/{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-pink-500" />
              </div>
              <p className="text-pink-500 text-sm mt-2">{stats.total - stats.present} absent</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Staff On Duty</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.staff}</p>
                </div>
                <Heart className="h-8 w-8 text-red-400" />
              </div>
              <p className="text-green-500 text-sm mt-2">All present</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Activities Today</p>
                  <p className="text-2xl font-bold text-gray-800">{activities.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
              <p className="text-purple-500 text-sm mt-2">{activities.filter(a => a.status === "completed").length} completed</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => toast.info(`${stats.pending} children awaiting pickup`)}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Pending Pickups</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
                </div>
                <Bell className="h-8 w-8 text-orange-400" />
              </div>
              <p className="text-orange-500 text-sm mt-2">Parents notified</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="bg-white/90 shadow-lg lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-gray-800">Children Attendance</CardTitle>
              <Button size="sm" onClick={() => setShowAddModal(true)} className="bg-pink-600 hover:bg-pink-700">
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {children.map(child => (
                  <div key={child.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl hover:from-pink-100 hover:to-purple-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <Button
                        variant={child.status === "Present" ? "default" : "outline"}
                        className={`w-14 h-14 rounded-full p-0 text-2xl ${child.status === "Present" ? "bg-gradient-to-br from-pink-400 to-purple-400" : "border-gray-300"}`}
                        onClick={() => toggleAttendance(child.id)}
                      >
                        {child.status === "Present" ? child.mood : "➕"}
                      </Button>
                      <div>
                        <p className="text-gray-800 font-medium">{child.name}</p>
                        <p className="text-gray-500 text-sm">Age: {child.age}</p>
                        <p className="text-gray-400 text-xs">Parent: {child.parent}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {child.status === "Present" && (
                        <Select value={child.mood} onValueChange={(value) => updateMood(child.id, value)}>
                          <SelectTrigger className="w-16 h-8 bg-white border-gray-200"><SelectValue /></SelectTrigger>
                          <SelectContent className="bg-white">
                            {["😊", "😄", "😢", "😴", "🤒"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      )}
                      <Badge className={child.status === "Present" ? "bg-green-500" : "bg-red-400"}>{child.status}</Badge>
                      <Button variant="ghost" size="icon" onClick={() => callParent(child)}>
                        <Phone className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-800">Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.map((act, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => {
                    const nextStatus = act.status === "upcoming" ? "in-progress" : act.status === "in-progress" ? "completed" : "completed";
                    updateActivityStatus(act.activity, nextStatus);
                  }}>
                    <div className={`w-3 h-3 rounded-full ${
                      act.status === "completed" ? "bg-green-500" :
                      act.status === "in-progress" ? "bg-yellow-500 animate-pulse" : "bg-gray-300"
                    }`} />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${act.status === "completed" ? "text-gray-400 line-through" : "text-gray-700"}`}>
                        {act.activity}
                      </p>
                      <p className="text-xs text-gray-400">{act.time}</p>
                    </div>
                    {act.status === "completed" && <Check className="h-4 w-4 text-green-500" />}
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600" onClick={sendUpdate}>
                <Camera className="h-4 w-4 mr-2" /> Send Update to Parents
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-white text-gray-800">
          <DialogHeader>
            <DialogTitle>Enroll New Child</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Child's Name</Label>
              <Input placeholder="Enter name" value={newChild.name} onChange={(e) => setNewChild({ ...newChild, name: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Age</Label>
              <Select value={newChild.age} onValueChange={(value) => setNewChild({ ...newChild, age: value })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["2 yrs", "3 yrs", "4 yrs", "5 yrs", "6 yrs"].map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Parent/Guardian</Label>
              <Input placeholder="Enter parent name" value={newChild.parent} onChange={(e) => setNewChild({ ...newChild, parent: e.target.value })} className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleAddChild} className="bg-pink-600 hover:bg-pink-700">Enroll</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCallModal} onOpenChange={setShowCallModal}>
        <DialogContent className="bg-white text-gray-800">
          <DialogHeader>
            <DialogTitle>Contact Parent</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center mx-auto mb-4 text-4xl">
              {selectedChild?.mood || "👶"}
            </div>
            <p className="text-xl font-bold">{selectedChild?.name}</p>
            <p className="text-gray-500">Parent: {selectedChild?.parent}</p>
            <p className="text-pink-600 text-2xl mt-4">📞 +91 98765 43210</p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowCallModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={() => { toast.success(`Calling ${selectedChild?.parent}...`); setShowCallModal(false); }} className="bg-green-600 hover:bg-green-700 flex-1">
              <Phone className="h-4 w-4 mr-2" /> Call Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="mt-12 py-6 border-t border-white/30 text-center text-white">
        <p>© 2025 Software Vala - The Name of Trust. All rights reserved.</p>
      </footer>
    </div>
  );
}

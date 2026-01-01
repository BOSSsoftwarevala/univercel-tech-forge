import { useState } from "react";
import { Dumbbell, Users, Calendar, CreditCard, TrendingUp, Clock, Award, Activity, Plus, UserCheck, X, Edit, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Member {
  id: number;
  name: string;
  plan: string;
  expires: string;
  status: string;
  checkedIn?: boolean;
}

interface GymClass {
  time: string;
  name: string;
  trainer: string;
  slots: number;
  booked: number;
  userBooked?: boolean;
}

const initialMembers: Member[] = [
  { id: 1, name: "Vikram Singh", plan: "Premium", expires: "15 Feb", status: "Active" },
  { id: 2, name: "Neha Sharma", plan: "Basic", expires: "28 Jan", status: "Expiring" },
  { id: 3, name: "Arjun Patel", plan: "Premium", expires: "10 Mar", status: "Active" },
  { id: 4, name: "Kavita Reddy", plan: "Basic", expires: "05 Jan", status: "Expired" },
];

const initialClasses: GymClass[] = [
  { time: "06:00 AM", name: "Morning Yoga", trainer: "Priya", slots: 15, booked: 12 },
  { time: "07:30 AM", name: "CrossFit", trainer: "Raj", slots: 20, booked: 20 },
  { time: "09:00 AM", name: "Zumba", trainer: "Meera", slots: 25, booked: 18 },
  { time: "05:00 PM", name: "Weight Training", trainer: "Vikram", slots: 10, booked: 8 },
];

export default function GymDemo() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [classes, setClasses] = useState<GymClass[]>(initialClasses);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [newMember, setNewMember] = useState({ name: "", plan: "Basic" });
  const [stats, setStats] = useState({
    totalMembers: 1248,
    activeToday: 156,
    revenue: 480000,
    expiringSoon: 28
  });

  const handleCheckIn = (memberId: number) => {
    setMembers(members.map(m => {
      if (m.id === memberId) {
        const newCheckedIn = !m.checkedIn;
        if (newCheckedIn) {
          setStats({ ...stats, activeToday: stats.activeToday + 1 });
          toast.success(`${m.name} checked in successfully!`);
        } else {
          setStats({ ...stats, activeToday: Math.max(0, stats.activeToday - 1) });
          toast.info(`${m.name} checked out`);
        }
        return { ...m, checkedIn: newCheckedIn };
      }
      return m;
    }));
  };

  const handleBookClass = (className: string) => {
    setClasses(classes.map(cls => {
      if (cls.name === className) {
        if (cls.userBooked) {
          toast.info(`Cancelled booking for ${className}`);
          return { ...cls, booked: cls.booked - 1, userBooked: false };
        } else if (cls.booked < cls.slots) {
          toast.success(`Booked ${className} successfully!`);
          return { ...cls, booked: cls.booked + 1, userBooked: true };
        } else {
          toast.error("Class is full!");
          return cls;
        }
      }
      return cls;
    }));
  };

  const handleAddMember = () => {
    if (!newMember.name) {
      toast.error("Please enter member name");
      return;
    }
    const member: Member = {
      id: members.length + 1,
      name: newMember.name,
      plan: newMember.plan,
      expires: "30 days",
      status: "Active"
    };
    setMembers([member, ...members]);
    setStats({ ...stats, totalMembers: stats.totalMembers + 1 });
    setShowMemberModal(false);
    setNewMember({ name: "", plan: "Basic" });
    toast.success(`${member.name} added successfully!`);
  };

  const handleRenewMembership = (member: Member) => {
    setSelectedMember(member);
    setShowPaymentModal(true);
  };

  const processPayment = () => {
    if (selectedMember) {
      setMembers(members.map(m => {
        if (m.id === selectedMember.id) {
          return { ...m, status: "Active", expires: "30 days" };
        }
        return m;
      }));
      setStats({ ...stats, revenue: stats.revenue + (selectedMember.plan === "Premium" ? 5000 : 2500) });
      toast.success(`Payment processed! ${selectedMember.name}'s membership renewed.`);
      setShowPaymentModal(false);
      setSelectedMember(null);
    }
  };

  const deleteMember = (memberId: number) => {
    const member = members.find(m => m.id === memberId);
    setMembers(members.filter(m => m.id !== memberId));
    setStats({ ...stats, totalMembers: stats.totalMembers - 1 });
    toast.success(`${member?.name} removed from members`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-rose-800 to-orange-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-8 w-8 text-rose-400" />
            <span className="text-xl font-bold text-white">FitnessPro</span>
            <Badge variant="outline" className="ml-2 text-rose-400 border-rose-400">by Software Vala</Badge>
          </div>
          <nav className="flex gap-1">
            {["Dashboard", "Members", "Classes", "Payments"].map(tab => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "ghost"}
                className={activeTab === tab ? "bg-rose-600 hover:bg-rose-700" : "text-white/80 hover:text-rose-400 hover:bg-white/10"}
                onClick={() => {
                  setActiveTab(tab);
                  toast.info(`Viewing ${tab}`);
                }}
              >
                {tab}
              </Button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">{activeTab}</h1>
          <Button onClick={() => setShowMemberModal(true)} className="bg-rose-600 hover:bg-rose-700">
            <Plus className="h-4 w-4 mr-2" /> Add Member
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Total Members</p>
                  <p className="text-2xl font-bold text-white">{stats.totalMembers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-rose-400" />
              </div>
              <p className="text-green-400 text-sm mt-2">+45 this month</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Active Today</p>
                  <p className="text-2xl font-bold text-white">{stats.activeToday}</p>
                </div>
                <Activity className="h-8 w-8 text-green-400" />
              </div>
              <p className="text-white/50 text-sm mt-2">Check-ins today</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Revenue</p>
                  <p className="text-2xl font-bold text-white">₹{(stats.revenue / 100000).toFixed(1)}L</p>
                </div>
                <CreditCard className="h-8 w-8 text-emerald-400" />
              </div>
              <p className="text-emerald-400 text-sm mt-2">This month</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Expiring Soon</p>
                  <p className="text-2xl font-bold text-white">{stats.expiringSoon}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
              <p className="text-yellow-400 text-sm mt-2">Next 7 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-white/10 border-white/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Recent Members</CardTitle>
              <Button size="sm" onClick={() => setShowMemberModal(true)} className="bg-rose-600 hover:bg-rose-700">
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {members.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        variant={member.checkedIn ? "default" : "outline"}
                        className={`w-10 h-10 rounded-full p-0 ${member.checkedIn ? "bg-green-600 hover:bg-green-700" : "border-white/30"}`}
                        onClick={() => handleCheckIn(member.id)}
                      >
                        {member.checkedIn ? <Check className="h-5 w-5" /> : member.name.charAt(0)}
                      </Button>
                      <div>
                        <p className="text-white font-medium">{member.name}</p>
                        <p className="text-white/60 text-sm">{member.plan} • Expires: {member.expires}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={
                        member.status === "Active" ? "bg-green-600" :
                        member.status === "Expiring" ? "bg-yellow-600 cursor-pointer" : "bg-red-600 cursor-pointer"
                      } onClick={() => member.status !== "Active" && handleRenewMembership(member)}>
                        {member.status}
                      </Badge>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-white/40 hover:text-red-400" onClick={() => deleteMember(member.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Today's Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {classes.map((cls, i) => (
                  <div key={i} className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white font-medium">{cls.name}</p>
                        <p className="text-white/60 text-sm">{cls.time} • Trainer: {cls.trainer}</p>
                      </div>
                      <Button
                        size="sm"
                        variant={cls.userBooked ? "default" : "outline"}
                        className={cls.userBooked ? "bg-green-600 hover:bg-red-600" : cls.booked >= cls.slots ? "opacity-50" : "border-rose-400 text-rose-400 hover:bg-rose-600 hover:text-white"}
                        onClick={() => handleBookClass(cls.name)}
                        disabled={!cls.userBooked && cls.booked >= cls.slots}
                      >
                        {cls.userBooked ? "Cancel" : cls.booked >= cls.slots ? "Full" : "Book"}
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={(cls.booked / cls.slots) * 100} className="flex-1" />
                      <span className="text-white/60 text-sm">{cls.booked}/{cls.slots}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Add Member Modal */}
      <Dialog open={showMemberModal} onOpenChange={setShowMemberModal}>
        <DialogContent className="bg-zinc-900 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Full Name</Label>
              <Input
                placeholder="e.g., John Doe"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className="bg-white/10 border-white/20 text-white mt-1"
              />
            </div>
            <div>
              <Label>Membership Plan</Label>
              <Select value={newMember.plan} onValueChange={(value) => setNewMember({ ...newMember, plan: value })}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic - ₹2,500/month</SelectItem>
                  <SelectItem value="Premium">Premium - ₹5,000/month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMemberModal(false)} className="border-white/20 text-white">Cancel</Button>
            <Button onClick={handleAddMember} className="bg-rose-600 hover:bg-rose-700">Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="bg-zinc-900 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Renew Membership</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-white/80">Renewing membership for: <strong>{selectedMember?.name}</strong></p>
            <p className="text-white/60 mt-2">Plan: {selectedMember?.plan}</p>
            <p className="text-2xl font-bold text-rose-400 mt-4">
              ₹{selectedMember?.plan === "Premium" ? "5,000" : "2,500"}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentModal(false)} className="border-white/20 text-white">Cancel</Button>
            <Button onClick={processPayment} className="bg-green-600 hover:bg-green-700">
              <CreditCard className="h-4 w-4 mr-2" /> Process Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="mt-12 py-6 border-t border-white/10 text-center text-white/60">
        <p>© 2025 Software Vala - The Name of Trust. All rights reserved.</p>
      </footer>
    </div>
  );
}

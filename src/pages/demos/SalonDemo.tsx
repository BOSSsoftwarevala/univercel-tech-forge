import { useState } from "react";
import { Scissors, Calendar, Clock, User, Star, Phone, CreditCard, Plus, Check, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Appointment {
  id: number;
  client: string;
  service: string;
  time: string;
  stylist: string;
  status: string;
}

const initialAppointments: Appointment[] = [
  { id: 1, client: "Anita Desai", service: "Hair Cut + Styling", time: "10:00 AM", stylist: "Meera", status: "Confirmed" },
  { id: 2, client: "Pooja Mehta", service: "Bridal Makeup", time: "11:30 AM", stylist: "Priya", status: "In Progress" },
  { id: 3, client: "Ritu Shah", service: "Facial + Cleanup", time: "02:00 PM", stylist: "Kavita", status: "Confirmed" },
  { id: 4, client: "Swati Kapoor", service: "Manicure + Pedicure", time: "03:30 PM", stylist: "Neha", status: "Pending" },
];

const services = [
  { name: "Hair Cut", price: 500, duration: "30 min", emoji: "✂️" },
  { name: "Hair Color", price: 2000, duration: "2 hrs", emoji: "🎨" },
  { name: "Facial", price: 1200, duration: "1 hr", emoji: "✨" },
  { name: "Bridal Package", price: 15000, duration: "4 hrs", emoji: "👰" },
];

export default function SalonDemo() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [newBooking, setNewBooking] = useState({ client: "", service: "Hair Cut", time: "10:00 AM", stylist: "Meera" });
  const [stats, setStats] = useState({ bookings: 18, revenue: 28500, staff: 6, rating: 4.8 });

  const handleBookAppointment = () => {
    if (!newBooking.client) {
      toast.error("Please enter client name");
      return;
    }
    const apt: Appointment = {
      id: appointments.length + 1,
      ...newBooking,
      status: "Confirmed"
    };
    setAppointments([...appointments, apt]);
    setStats({ ...stats, bookings: stats.bookings + 1 });
    setShowBookingModal(false);
    setNewBooking({ client: "", service: "Hair Cut", time: "10:00 AM", stylist: "Meera" });
    toast.success(`Appointment booked for ${apt.client}!`);
  };

  const updateStatus = (id: number, newStatus: string) => {
    setAppointments(appointments.map(apt => {
      if (apt.id === id) {
        if (newStatus === "Completed") {
          const service = services.find(s => apt.service.includes(s.name));
          setStats({ ...stats, revenue: stats.revenue + (service?.price || 0) });
        }
        toast.success(`${apt.client}'s appointment ${newStatus.toLowerCase()}`);
        return { ...apt, status: newStatus };
      }
      return apt;
    }));
  };

  const cancelAppointment = (id: number) => {
    const apt = appointments.find(a => a.id === id);
    setAppointments(appointments.filter(a => a.id !== id));
    setStats({ ...stats, bookings: stats.bookings - 1 });
    toast.success(`${apt?.client}'s appointment cancelled`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-fuchsia-800 to-purple-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Scissors className="h-8 w-8 text-pink-400" />
            <span className="text-xl font-bold text-white">GlamourStudio</span>
            <Badge variant="outline" className="ml-2 text-pink-400 border-pink-400">by Software Vala</Badge>
          </div>
          <nav className="flex gap-1">
            {["Dashboard", "Appointments", "Services", "Staff"].map(tab => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "ghost"}
                className={activeTab === tab ? "bg-pink-600 hover:bg-pink-700" : "text-white/80 hover:text-pink-400 hover:bg-white/10"}
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
          <Button onClick={() => setShowBookingModal(true)} className="bg-pink-600 hover:bg-pink-700">
            <Plus className="h-4 w-4 mr-2" /> Book Appointment
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Today's Bookings</p>
                  <p className="text-2xl font-bold text-white">{stats.bookings}</p>
                </div>
                <Calendar className="h-8 w-8 text-pink-400" />
              </div>
              <p className="text-green-400 text-sm mt-2">4 slots available</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Revenue Today</p>
                  <p className="text-2xl font-bold text-white">₹{stats.revenue.toLocaleString()}</p>
                </div>
                <CreditCard className="h-8 w-8 text-emerald-400" />
              </div>
              <p className="text-emerald-400 text-sm mt-2">+12% vs yesterday</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Staff On Duty</p>
                  <p className="text-2xl font-bold text-white">{stats.staff}</p>
                </div>
                <User className="h-8 w-8 text-fuchsia-400" />
              </div>
              <p className="text-fuchsia-400 text-sm mt-2">All present</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Avg Rating</p>
                  <p className="text-2xl font-bold text-white">{stats.rating}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-400" />
              </div>
              <div className="flex gap-0.5 mt-2">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`h-4 w-4 ${i <= Math.floor(stats.rating) ? "text-yellow-400 fill-yellow-400" : "text-white/30"}`} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="bg-white/10 border-white/20 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Today's Appointments</CardTitle>
              <Button size="sm" onClick={() => setShowBookingModal(true)} className="bg-pink-600 hover:bg-pink-700">
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appointments.map(apt => (
                  <div key={apt.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold text-lg">
                        {apt.client.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{apt.client}</p>
                        <p className="text-white/60 text-sm">{apt.service}</p>
                        <p className="text-pink-300 text-sm flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {apt.time} • {apt.stylist}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={apt.status} onValueChange={(value) => updateStatus(apt.id, value)}>
                        <SelectTrigger className={`w-28 h-7 text-xs ${
                          apt.status === "Completed" ? "bg-green-600 border-green-600" :
                          apt.status === "In Progress" ? "bg-blue-600 border-blue-600" :
                          apt.status === "Confirmed" ? "bg-purple-600 border-purple-600" : "bg-yellow-600 border-yellow-600"
                        } text-white`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-white/20">
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Confirmed">Confirmed</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-white/40 hover:text-red-400" onClick={() => cancelAppointment(apt.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Popular Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {services.map((service, i) => (
                  <div key={i} className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{service.emoji}</span>
                        <div>
                          <p className="text-white font-medium">{service.name}</p>
                          <p className="text-white/60 text-sm">{service.duration}</p>
                        </div>
                      </div>
                      <p className="text-pink-400 font-semibold">₹{service.price.toLocaleString()}</p>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full bg-pink-600/50 hover:bg-pink-600"
                      onClick={() => { setNewBooking({ ...newBooking, service: service.name }); setShowBookingModal(true); }}
                    >
                      Quick Book
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="bg-zinc-900 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Client Name</Label>
              <Input placeholder="Enter client name" value={newBooking.client} onChange={(e) => setNewBooking({ ...newBooking, client: e.target.value })} className="bg-white/10 border-white/20 text-white mt-1" />
            </div>
            <div>
              <Label>Service</Label>
              <Select value={newBooking.service} onValueChange={(value) => setNewBooking({ ...newBooking, service: value })}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white mt-1"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-zinc-800 border-white/20">
                  {services.map(s => <SelectItem key={s.name} value={s.name}>{s.name} - ₹{s.price.toLocaleString()}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Time</Label>
                <Select value={newBooking.time} onValueChange={(value) => setNewBooking({ ...newBooking, time: value })}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-white/20">
                    {["10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Stylist</Label>
                <Select value={newBooking.stylist} onValueChange={(value) => setNewBooking({ ...newBooking, stylist: value })}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-white/20">
                    {["Meera", "Priya", "Kavita", "Neha"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBookingModal(false)} className="border-white/20 text-white">Cancel</Button>
            <Button onClick={handleBookAppointment} className="bg-pink-600 hover:bg-pink-700">Book Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="mt-12 py-6 border-t border-white/10 text-center text-white/60">
        <p>© 2025 Software Vala - The Name of Trust. All rights reserved.</p>
      </footer>
    </div>
  );
}

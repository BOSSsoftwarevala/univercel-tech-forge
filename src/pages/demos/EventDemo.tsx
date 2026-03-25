import { useState } from "react";
import { PartyPopper, Calendar, Users, MapPin, Camera, Music, Utensils, Phone, Star, Plus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Event {
  id: number;
  name: string;
  date: string;
  venue: string;
  guests: number;
  budget: string;
  status: string;
  progress: number;
}

interface Vendor {
  id: number;
  name: string;
  type: string;
  rating: number;
  price: string;
  icon: string;
  booked: boolean;
}

const initialEvents: Event[] = [
  { id: 1, name: "Sharma Wedding", date: "15 Jan", venue: "Grand Palace", guests: 500, budget: "₹25L", status: "Confirmed", progress: 75 },
  { id: 2, name: "Corporate Meet", date: "20 Jan", venue: "Tech Hub", guests: 200, budget: "₹8L", status: "Planning", progress: 40 },
  { id: 3, name: "Birthday Party", date: "22 Jan", venue: "Garden Resort", guests: 80, budget: "₹2L", status: "Confirmed", progress: 90 },
  { id: 4, name: "Engagement Ceremony", date: "28 Jan", venue: "Heritage Hall", guests: 300, budget: "₹12L", status: "Pending", progress: 20 },
];

const initialVendors: Vendor[] = [
  { id: 1, name: "Royal Caterers", type: "Catering", rating: 4.8, price: "₹800/plate", icon: "🍽️", booked: false },
  { id: 2, name: "Shutter Studio", type: "Photography", rating: 4.9, price: "₹1.5L", icon: "📸", booked: true },
  { id: 3, name: "DJ Beats", type: "Music", rating: 4.7, price: "₹50K", icon: "🎵", booked: false },
  { id: 4, name: "Floral Dreams", type: "Decoration", rating: 4.6, price: "₹80K", icon: "💐", booked: false },
];

export default function EventDemo() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: "", date: "", venue: "", guests: "", budget: "" });
  const [stats, setStats] = useState({ upcoming: 12, revenue: 8500000, vendors: 156, venues: 24 });

  const handleCreateEvent = () => {
    if (!newEvent.name || !newEvent.venue) {
      toast.error("Please fill all required fields");
      return;
    }
    const event: Event = {
      id: events.length + 1,
      name: newEvent.name,
      date: newEvent.date || "TBD",
      venue: newEvent.venue,
      guests: parseInt(newEvent.guests) || 100,
      budget: newEvent.budget ? `₹${newEvent.budget}` : "₹5L",
      status: "Planning",
      progress: 0
    };
    setEvents([event, ...events]);
    setStats({ ...stats, upcoming: stats.upcoming + 1 });
    setShowEventModal(false);
    setNewEvent({ name: "", date: "", venue: "", guests: "", budget: "" });
    toast.success(`Event "${event.name}" created!`);
  };

  const updateProgress = (eventId: number, increment: number) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        const newProgress = Math.min(100, Math.max(0, event.progress + increment));
        let newStatus = event.status;
        if (newProgress === 100) newStatus = "Completed";
        else if (newProgress >= 80) newStatus = "Confirmed";
        else if (newProgress >= 40) newStatus = "Planning";
        else newStatus = "Pending";
        toast.success(`${event.name} progress updated!`);
        return { ...event, progress: newProgress, status: newStatus };
      }
      return event;
    }));
  };

  const deleteEvent = (eventId: number) => {
    const event = events.find(e => e.id === eventId);
    setEvents(events.filter(e => e.id !== eventId));
    setStats({ ...stats, upcoming: stats.upcoming - 1 });
    toast.success(`"${event?.name}" deleted`);
  };

  const toggleVendorBooking = (vendorId: number) => {
    setVendors(vendors.map(vendor => {
      if (vendor.id === vendorId) {
        const newBooked = !vendor.booked;
        toast.success(newBooked ? `${vendor.name} booked!` : `${vendor.name} booking cancelled`);
        return { ...vendor, booked: newBooked };
      }
      return vendor;
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900 via-pink-800 to-fuchsia-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <PartyPopper className="h-8 w-8 text-rose-400" />
            <span className="text-xl font-bold text-white">EventPro</span>
            <Badge variant="outline" className="ml-2 text-rose-400 border-rose-400">by Software Vala</Badge>
          </div>
          <nav className="flex gap-1">
            {["Dashboard", "Events", "Vendors", "Venues"].map(tab => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "ghost"}
                className={activeTab === tab ? "bg-rose-600 hover:bg-rose-700" : "text-white/80 hover:text-rose-400 hover:bg-white/10"}
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
          <Button onClick={() => setShowEventModal(true)} className="bg-rose-600 hover:bg-rose-700">
            <Plus className="h-4 w-4 mr-2" /> Create Event
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Upcoming Events</p>
                  <p className="text-2xl font-bold text-white">{stats.upcoming}</p>
                </div>
                <Calendar className="h-8 w-8 text-rose-400" />
              </div>
              <p className="text-rose-400 text-sm mt-2">4 this week</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">₹{(stats.revenue / 100000).toFixed(0)}L</p>
                </div>
                <Star className="h-8 w-8 text-yellow-400" />
              </div>
              <p className="text-green-400 text-sm mt-2">This quarter</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Verified Vendors</p>
                  <p className="text-2xl font-bold text-white">{stats.vendors}</p>
                </div>
                <Users className="h-8 w-8 text-fuchsia-400" />
              </div>
              <p className="text-fuchsia-400 text-sm mt-2">All categories</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Active Venues</p>
                  <p className="text-2xl font-bold text-white">{stats.venues}</p>
                </div>
                <MapPin className="h-8 w-8 text-emerald-400" />
              </div>
              <p className="text-emerald-400 text-sm mt-2">Partnered</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="bg-white/10 border-white/20 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Upcoming Events</CardTitle>
              <Button size="sm" onClick={() => setShowEventModal(true)} className="bg-rose-600 hover:bg-rose-700">
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map(event => (
                  <div key={event.id} className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-white font-medium text-lg">{event.name}</p>
                        <p className="text-white/60 text-sm flex items-center gap-2">
                          <Calendar className="h-4 w-4" /> {event.date}
                          <MapPin className="h-4 w-4 ml-2" /> {event.venue}
                        </p>
                        <p className="text-rose-300 text-sm">{event.guests} guests • Budget: {event.budget}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          event.status === "Completed" ? "bg-green-600" :
                          event.status === "Confirmed" ? "bg-blue-600" :
                          event.status === "Planning" ? "bg-yellow-600" : "bg-gray-600"
                        }>{event.status}</Badge>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-white/40 hover:text-red-400" onClick={() => deleteEvent(event.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="h-6 text-xs border-white/20 text-white" onClick={() => updateProgress(event.id, -10)}>-10%</Button>
                      <Progress value={event.progress} className="flex-1" />
                      <Button size="sm" variant="outline" className="h-6 text-xs border-white/20 text-white" onClick={() => updateProgress(event.id, 10)}>+10%</Button>
                      <span className="text-white/60 text-sm w-12">{event.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Top Vendors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {vendors.map(vendor => (
                  <div key={vendor.id} className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{vendor.icon}</span>
                      <div className="flex-1">
                        <p className="text-white font-medium">{vendor.name}</p>
                        <p className="text-white/60 text-xs">{vendor.type}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-yellow-400 text-xs">{vendor.rating}</span>
                          <span className="text-rose-400 text-xs ml-auto">{vendor.price}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className={`w-full ${vendor.booked ? "bg-green-600 hover:bg-red-600" : "bg-rose-600/50 hover:bg-rose-600"}`}
                      onClick={() => toggleVendorBooking(vendor.id)}
                    >
                      {vendor.booked ? <><Check className="h-4 w-4 mr-1" /> Booked</> : "Book Now"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="bg-zinc-900 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Event Name</Label>
              <Input placeholder="e.g., Sharma Wedding" value={newEvent.name} onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })} className="bg-white/10 border-white/20 text-white mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <Input placeholder="e.g., 15 Jan" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} className="bg-white/10 border-white/20 text-white mt-1" />
              </div>
              <div>
                <Label>Venue</Label>
                <Input placeholder="e.g., Grand Palace" value={newEvent.venue} onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })} className="bg-white/10 border-white/20 text-white mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Expected Guests</Label>
                <Input type="number" placeholder="e.g., 500" value={newEvent.guests} onChange={(e) => setNewEvent({ ...newEvent, guests: e.target.value })} className="bg-white/10 border-white/20 text-white mt-1" />
              </div>
              <div>
                <Label>Budget</Label>
                <Input placeholder="e.g., 25L" value={newEvent.budget} onChange={(e) => setNewEvent({ ...newEvent, budget: e.target.value })} className="bg-white/10 border-white/20 text-white mt-1" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEventModal(false)} className="border-white/20 text-white">Cancel</Button>
            <Button onClick={handleCreateEvent} className="bg-rose-600 hover:bg-rose-700">Create Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="mt-12 py-6 border-t border-white/10 text-center text-white/60">
        <p>© 2025 Software Vala - The Name of Trust. All rights reserved.</p>
      </footer>
    </div>
  );
}

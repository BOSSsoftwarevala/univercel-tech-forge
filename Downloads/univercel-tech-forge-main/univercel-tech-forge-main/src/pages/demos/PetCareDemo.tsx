import { useState } from "react";
import { Dog, Calendar, Scissors, Stethoscope, Package, Clock, Heart, Phone, Plus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Pet {
  id: number;
  name: string;
  type: string;
  breed: string;
  owner: string;
  visit: string;
  time: string;
  emoji: string;
  status: string;
}

const initialPets: Pet[] = [
  { id: 1, name: "Bruno", type: "Dog", breed: "Labrador", owner: "Rahul Sharma", visit: "Vaccination", time: "10:00 AM", emoji: "🐕", status: "Waiting" },
  { id: 2, name: "Whiskers", type: "Cat", breed: "Persian", owner: "Priya Patel", visit: "Grooming", time: "11:30 AM", emoji: "🐱", status: "In Progress" },
  { id: 3, name: "Max", type: "Dog", breed: "German Shepherd", owner: "Amit Kumar", visit: "Checkup", time: "02:00 PM", emoji: "🐕‍🦺", status: "Scheduled" },
  { id: 4, name: "Coco", type: "Parrot", breed: "Macaw", owner: "Sneha Gupta", visit: "Treatment", time: "03:30 PM", emoji: "🦜", status: "Scheduled" },
];

const services = [
  { name: "Vaccination", price: 800, duration: "30 min", icon: "💉" },
  { name: "Grooming", price: 1500, duration: "1.5 hrs", icon: "✂️" },
  { name: "Health Checkup", price: 500, duration: "45 min", icon: "🩺" },
  { name: "Pet Boarding", price: 1000, duration: "24 hrs", icon: "🏠" },
];

export default function PetCareDemo() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [pets, setPets] = useState<Pet[]>(initialPets);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [newBooking, setNewBooking] = useState({ name: "", type: "Dog", breed: "", owner: "", visit: "Vaccination", time: "10:00 AM" });
  const [stats, setStats] = useState({ visits: 18, registered: 542, revenue: 24500, pending: 6 });

  const handleBookAppointment = () => {
    if (!newBooking.name || !newBooking.owner) {
      toast.error("Please fill all fields");
      return;
    }
    const pet: Pet = {
      id: pets.length + 1,
      name: newBooking.name,
      type: newBooking.type,
      breed: newBooking.breed || newBooking.type,
      owner: newBooking.owner,
      visit: newBooking.visit,
      time: newBooking.time,
      emoji: newBooking.type === "Dog" ? "🐕" : newBooking.type === "Cat" ? "🐱" : "🐾",
      status: "Scheduled"
    };
    setPets([...pets, pet]);
    setStats({ ...stats, visits: stats.visits + 1, registered: stats.registered + 1 });
    setShowBookingModal(false);
    setNewBooking({ name: "", type: "Dog", breed: "", owner: "", visit: "Vaccination", time: "10:00 AM" });
    toast.success(`Appointment booked for ${pet.name}!`);
  };

  const updateStatus = (petId: number, newStatus: string) => {
    setPets(pets.map(pet => {
      if (pet.id === petId) {
        if (newStatus === "Completed") {
          const service = services.find(s => s.name === pet.visit);
          setStats({ ...stats, revenue: stats.revenue + (service?.price || 0), pending: Math.max(0, stats.pending - 1) });
        }
        toast.success(`${pet.name}'s status updated to ${newStatus}`);
        return { ...pet, status: newStatus };
      }
      return pet;
    }));
  };

  const cancelAppointment = (petId: number) => {
    const pet = pets.find(p => p.id === petId);
    setPets(pets.filter(p => p.id !== petId));
    setStats({ ...stats, visits: stats.visits - 1 });
    toast.success(`${pet?.name}'s appointment cancelled`);
  };

  const callOwner = (pet: Pet) => {
    setSelectedPet(pet);
    setShowCallModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-300 to-yellow-400">
      <header className="bg-white/20 backdrop-blur-sm border-b border-white/30 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Dog className="h-8 w-8 text-amber-700" />
            <span className="text-xl font-bold text-amber-900">PetCare+</span>
            <Badge variant="outline" className="ml-2 text-amber-800 border-amber-800">by Software Vala</Badge>
          </div>
          <nav className="flex gap-1">
            {["Dashboard", "Appointments", "Pets", "Shop"].map(tab => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "ghost"}
                className={activeTab === tab ? "bg-amber-600 hover:bg-amber-700 text-white" : "text-amber-800 hover:bg-white/30"}
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
          <h1 className="text-2xl font-bold text-amber-900">{activeTab}</h1>
          <Button onClick={() => setShowBookingModal(true)} className="bg-amber-600 hover:bg-amber-700">
            <Plus className="h-4 w-4 mr-2" /> Book Appointment
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/90 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Today's Visits</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.visits}</p>
                </div>
                <Calendar className="h-8 w-8 text-amber-500" />
              </div>
              <p className="text-amber-600 text-sm mt-2">4 grooming</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Registered Pets</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.registered}</p>
                </div>
                <Heart className="h-8 w-8 text-red-400" />
              </div>
              <p className="text-green-500 text-sm mt-2">+12 this week</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Revenue Today</p>
                  <p className="text-2xl font-bold text-gray-800">₹{stats.revenue.toLocaleString()}</p>
                </div>
                <Package className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-green-500 text-sm mt-2">+8% vs yesterday</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-400" />
              </div>
              <p className="text-orange-500 text-sm mt-2">Awaiting pickup</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="bg-white/90 shadow-lg lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-gray-800">Today's Appointments</CardTitle>
              <Button size="sm" onClick={() => setShowBookingModal(true)} className="bg-amber-600 hover:bg-amber-700">
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pets.map(pet => (
                  <div key={pet.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl hover:from-amber-100 hover:to-orange-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-2xl">
                        {pet.emoji}
                      </div>
                      <div>
                        <p className="text-gray-800 font-medium">{pet.name}</p>
                        <p className="text-gray-500 text-sm">{pet.breed} • Owner: {pet.owner}</p>
                        <p className="text-amber-600 text-sm flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {pet.time} - {pet.visit}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={pet.status} onValueChange={(value) => updateStatus(pet.id, value)}>
                        <SelectTrigger className={`w-28 h-7 text-xs ${
                          pet.status === "Completed" ? "bg-green-500 border-green-500 text-white" :
                          pet.status === "In Progress" ? "bg-blue-500 border-blue-500 text-white" :
                          pet.status === "Waiting" ? "bg-yellow-500 border-yellow-500 text-white" : "bg-gray-200"
                        }`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="Scheduled">Scheduled</SelectItem>
                          <SelectItem value="Waiting">Waiting</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon" onClick={() => callOwner(pet)}>
                        <Phone className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => cancelAppointment(pet.id)}>
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-800">Our Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {services.map((service, i) => (
                  <div key={i} className="p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{service.icon}</span>
                        <div>
                          <p className="text-gray-700 font-medium">{service.name}</p>
                          <p className="text-gray-400 text-xs">{service.duration}</p>
                        </div>
                      </div>
                      <p className="text-amber-600 font-bold">₹{service.price}</p>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full bg-amber-500 hover:bg-amber-600"
                      onClick={() => { setNewBooking({ ...newBooking, visit: service.name }); setShowBookingModal(true); }}
                    >
                      Book Now
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="bg-white text-gray-800">
          <DialogHeader>
            <DialogTitle>Book Pet Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Pet Name</Label>
                <Input placeholder="e.g., Bruno" value={newBooking.name} onChange={(e) => setNewBooking({ ...newBooking, name: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>Pet Type</Label>
                <Select value={newBooking.type} onValueChange={(value) => setNewBooking({ ...newBooking, type: value })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-white">
                    {["Dog", "Cat", "Bird", "Rabbit", "Other"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Owner Name</Label>
              <Input placeholder="e.g., Rahul Sharma" value={newBooking.owner} onChange={(e) => setNewBooking({ ...newBooking, owner: e.target.value })} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Service</Label>
                <Select value={newBooking.visit} onValueChange={(value) => setNewBooking({ ...newBooking, visit: value })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-white">
                    {services.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Time</Label>
                <Select value={newBooking.time} onValueChange={(value) => setNewBooking({ ...newBooking, time: value })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-white">
                    {["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBookingModal(false)}>Cancel</Button>
            <Button onClick={handleBookAppointment} className="bg-amber-600 hover:bg-amber-700">Book Appointment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCallModal} onOpenChange={setShowCallModal}>
        <DialogContent className="bg-white text-gray-800">
          <DialogHeader>
            <DialogTitle>Contact Owner</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center mx-auto mb-4 text-4xl">
              {selectedPet?.emoji}
            </div>
            <p className="text-xl font-bold">{selectedPet?.name}</p>
            <p className="text-gray-500">Owner: {selectedPet?.owner}</p>
            <p className="text-amber-600 text-2xl mt-4">📞 +91 98765 43210</p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowCallModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={() => { toast.success(`Calling ${selectedPet?.owner}...`); setShowCallModal(false); }} className="bg-green-600 hover:bg-green-700 flex-1">
              <Phone className="h-4 w-4 mr-2" /> Call Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="mt-12 py-6 border-t border-white/30 text-center text-amber-800">
        <p>© 2025 Software Vala - The Name of Trust. All rights reserved.</p>
      </footer>
    </div>
  );
}

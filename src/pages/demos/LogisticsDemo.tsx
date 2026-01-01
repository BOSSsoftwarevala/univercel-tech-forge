import { useState } from "react";
import { Truck, Package, MapPin, Clock, TrendingUp, AlertTriangle, CheckCircle, Navigation, Plus, X, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Shipment {
  id: string;
  from: string;
  to: string;
  status: string;
  eta: string;
  driver: string;
  progress: number;
}

interface FleetVehicle {
  id: string;
  driver: string;
  status: string;
  location: string;
  fuel: number;
}

const initialShipments: Shipment[] = [
  { id: "SHP001", from: "Mumbai", to: "Delhi", status: "In Transit", eta: "2 hrs", driver: "Rajesh", progress: 75 },
  { id: "SHP002", from: "Bangalore", to: "Chennai", status: "Delivered", eta: "-", driver: "Kumar", progress: 100 },
  { id: "SHP003", from: "Pune", to: "Hyderabad", status: "Picked Up", eta: "6 hrs", driver: "Vijay", progress: 25 },
  { id: "SHP004", from: "Delhi", to: "Jaipur", status: "Pending", eta: "8 hrs", driver: "Amit", progress: 0 },
];

const initialFleet: FleetVehicle[] = [
  { id: "TRK001", driver: "Rajesh Kumar", status: "On Route", location: "Highway NH-48", fuel: 65 },
  { id: "TRK002", driver: "Suresh Yadav", status: "Available", location: "Warehouse A", fuel: 90 },
  { id: "TRK003", driver: "Vijay Singh", status: "Loading", location: "Pune Hub", fuel: 45 },
  { id: "TRK004", driver: "Anil Sharma", status: "Maintenance", location: "Service Center", fuel: 30 },
];

export default function LogisticsDemo() {
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [fleet, setFleet] = useState<FleetVehicle[]>(initialFleet);
  const [showAddShipment, setShowAddShipment] = useState(false);
  const [showTrackAll, setShowTrackAll] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [newShipment, setNewShipment] = useState({ from: "", to: "", driver: "" });

  const stats = {
    active: shipments.filter(s => s.status !== "Delivered").length,
    inTransit: shipments.filter(s => s.status === "In Transit").length,
    fleetActive: fleet.filter(f => f.status !== "Maintenance").length,
    delayed: shipments.filter(s => s.status === "Pending").length
  };

  const handleAddShipment = () => {
    if (!newShipment.from || !newShipment.to || !newShipment.driver) {
      toast.error("Please fill all fields");
      return;
    }
    const id = `SHP${String(shipments.length + 1).padStart(3, "0")}`;
    setShipments([...shipments, {
      id,
      from: newShipment.from,
      to: newShipment.to,
      status: "Pending",
      eta: "Calculating...",
      driver: newShipment.driver,
      progress: 0
    }]);
    setNewShipment({ from: "", to: "", driver: "" });
    setShowAddShipment(false);
    toast.success(`Shipment ${id} created successfully`);
  };

  const updateShipmentStatus = (id: string, status: string) => {
    setShipments(shipments.map(s => {
      if (s.id === id) {
        let progress = s.progress;
        let eta = s.eta;
        if (status === "Picked Up") { progress = 25; eta = "6 hrs"; }
        if (status === "In Transit") { progress = 50; eta = "4 hrs"; }
        if (status === "Out for Delivery") { progress = 85; eta = "1 hr"; }
        if (status === "Delivered") { progress = 100; eta = "-"; }
        return { ...s, status, progress, eta };
      }
      return s;
    }));
    toast.success(`Shipment ${id} updated to ${status}`);
  };

  const refuelVehicle = (id: string) => {
    setFleet(fleet.map(v => v.id === id ? { ...v, fuel: 100 } : v));
    toast.success(`Vehicle ${id} refueled to 100%`);
  };

  const updateVehicleStatus = (id: string, status: string) => {
    setFleet(fleet.map(v => v.id === id ? { ...v, status } : v));
    toast.success(`Vehicle ${id} status updated to ${status}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-zinc-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Truck className="h-8 w-8 text-emerald-400" />
            <span className="text-xl font-bold text-white">LogiTrack</span>
            <Badge variant="outline" className="ml-2 text-emerald-400 border-emerald-400">by Software Vala</Badge>
          </div>
          <nav className="flex gap-4 text-white/80">
            <span className="hover:text-emerald-400 cursor-pointer">Dashboard</span>
            <span className="hover:text-emerald-400 cursor-pointer">Shipments</span>
            <span className="hover:text-emerald-400 cursor-pointer">Fleet</span>
            <span className="hover:text-emerald-400 cursor-pointer">Reports</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Active Shipments</p>
                  <p className="text-2xl font-bold text-white">{stats.active}</p>
                </div>
                <Package className="h-8 w-8 text-emerald-400" />
              </div>
              <p className="text-emerald-400 text-sm mt-2">{stats.inTransit} in transit</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">On-Time Delivery</p>
                  <p className="text-2xl font-bold text-white">94%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
              <p className="text-green-400 text-sm mt-2">+2% vs last week</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Fleet Vehicles</p>
                  <p className="text-2xl font-bold text-white">{fleet.length}</p>
                </div>
                <Truck className="h-8 w-8 text-blue-400" />
              </div>
              <p className="text-blue-400 text-sm mt-2">{stats.fleetActive} active</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-white">{stats.delayed}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-400" />
              </div>
              <p className="text-yellow-400 text-sm mt-2">Action needed</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="bg-white/10 border-white/20 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Live Shipments</CardTitle>
              <Dialog open={showAddShipment} onOpenChange={setShowAddShipment}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-1" /> New Shipment
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-white/20 text-white">
                  <DialogHeader>
                    <DialogTitle>Create New Shipment</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>From</Label>
                      <Input
                        value={newShipment.from}
                        onChange={e => setNewShipment({ ...newShipment, from: e.target.value })}
                        placeholder="Origin city"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label>To</Label>
                      <Input
                        value={newShipment.to}
                        onChange={e => setNewShipment({ ...newShipment, to: e.target.value })}
                        placeholder="Destination city"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label>Driver</Label>
                      <Select onValueChange={v => setNewShipment({ ...newShipment, driver: v })}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Assign driver" />
                        </SelectTrigger>
                        <SelectContent>
                          {fleet.filter(f => f.status === "Available").map(f => (
                            <SelectItem key={f.id} value={f.driver}>{f.driver}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" className="border-white/20 text-white">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleAddShipment} className="bg-emerald-600 hover:bg-emerald-700">Create</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shipments.map(ship => (
                  <div key={ship.id} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">{ship.id}</Badge>
                          <p className="text-white font-medium">{ship.from} → {ship.to}</p>
                        </div>
                        <p className="text-white/60 text-sm">Driver: {ship.driver} {ship.eta !== "-" && `• ETA: ${ship.eta}`}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select 
                          value={ship.status} 
                          onValueChange={v => updateShipmentStatus(ship.id, v)}
                        >
                          <SelectTrigger className={`h-7 text-xs border-0 ${
                            ship.status === "Delivered" ? "bg-green-600" :
                            ship.status === "In Transit" ? "bg-blue-600" :
                            ship.status === "Picked Up" ? "bg-yellow-600" : "bg-gray-600"
                          }`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Picked Up">Picked Up</SelectItem>
                            <SelectItem value="In Transit">In Transit</SelectItem>
                            <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                            <SelectItem value="Delivered">Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-white/60 hover:text-white" onClick={() => setSelectedShipment(ship)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-900 border-white/20 text-white">
                            <DialogHeader>
                              <DialogTitle>Shipment Details - {ship.id}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-3">
                              <div className="flex justify-between"><span className="text-white/60">From:</span><span>{ship.from}</span></div>
                              <div className="flex justify-between"><span className="text-white/60">To:</span><span>{ship.to}</span></div>
                              <div className="flex justify-between"><span className="text-white/60">Driver:</span><span>{ship.driver}</span></div>
                              <div className="flex justify-between"><span className="text-white/60">Status:</span><Badge>{ship.status}</Badge></div>
                              <div className="flex justify-between"><span className="text-white/60">ETA:</span><span>{ship.eta}</span></div>
                              <div className="flex justify-between items-center"><span className="text-white/60">Progress:</span><span>{ship.progress}%</span></div>
                              <Progress value={ship.progress} />
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={ship.progress} className="flex-1" />
                      <span className="text-white/60 text-sm w-12">{ship.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Fleet Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {fleet.map((truck) => (
                  <div key={truck.id} className="p-3 bg-white/5 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white font-medium text-sm">{truck.driver}</p>
                        <p className="text-white/50 text-xs flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {truck.location}
                        </p>
                      </div>
                      <Select value={truck.status} onValueChange={v => updateVehicleStatus(truck.id, v)}>
                        <SelectTrigger className={`h-6 text-xs border-0 w-auto ${
                          truck.status === "On Route" ? "bg-blue-600" :
                          truck.status === "Available" ? "bg-green-600" :
                          truck.status === "Loading" ? "bg-yellow-600" : "bg-red-600"
                        }`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Available">Available</SelectItem>
                          <SelectItem value="On Route">On Route</SelectItem>
                          <SelectItem value="Loading">Loading</SelectItem>
                          <SelectItem value="Maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/50 text-xs">Fuel:</span>
                      <Progress value={truck.fuel} className="flex-1 h-2" />
                      <span className="text-white/60 text-xs">{truck.fuel}%</span>
                      {truck.fuel < 50 && (
                        <Button size="sm" variant="outline" className="h-6 text-xs border-yellow-500 text-yellow-500" onClick={() => refuelVehicle(truck.id)}>
                          Refuel
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Dialog open={showTrackAll} onOpenChange={setShowTrackAll}>
                <DialogTrigger asChild>
                  <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700">
                    <Navigation className="h-4 w-4 mr-2" /> Track All Vehicles
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-white/20 text-white max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Live Vehicle Tracking</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    {fleet.map(v => (
                      <div key={v.id} className="p-3 bg-white/5 rounded-lg flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`h-3 w-3 rounded-full ${
                            v.status === "On Route" ? "bg-blue-500 animate-pulse" :
                            v.status === "Available" ? "bg-green-500" :
                            v.status === "Loading" ? "bg-yellow-500" : "bg-red-500"
                          }`} />
                          <div>
                            <p className="font-medium">{v.id} - {v.driver}</p>
                            <p className="text-sm text-white/60">{v.location}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{v.status}</Badge>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
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

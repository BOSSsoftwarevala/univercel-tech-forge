/**
 * Hostel & Canteen Module
 * Manage hostels, rooms, mess, and canteen
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Building, Plus, Bed, Users, Utensils, Coffee,
  Settings, Eye, Edit, DollarSign, Calendar, Clock,
  CheckCircle, AlertCircle, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const HOSTELS = [
  { id: 1, name: "Boys Hostel A", type: "boys", capacity: 200, occupied: 185, rooms: 50, warden: "Mr. Sharma", status: "active" },
  { id: 2, name: "Boys Hostel B", type: "boys", capacity: 150, occupied: 142, rooms: 40, warden: "Mr. Verma", status: "active" },
  { id: 3, name: "Girls Hostel A", type: "girls", capacity: 180, occupied: 165, rooms: 45, warden: "Mrs. Gupta", status: "active" },
  { id: 4, name: "Girls Hostel B", type: "girls", capacity: 120, occupied: 98, rooms: 30, warden: "Mrs. Singh", status: "active" },
];

const ROOMS = [
  { id: 1, number: "A-101", hostel: "Boys Hostel A", capacity: 4, occupied: 4, floor: 1, type: "AC", status: "occupied" },
  { id: 2, number: "A-102", hostel: "Boys Hostel A", capacity: 4, occupied: 3, floor: 1, type: "AC", status: "partial" },
  { id: 3, number: "A-103", hostel: "Boys Hostel A", capacity: 4, occupied: 0, floor: 1, type: "Non-AC", status: "vacant" },
  { id: 4, number: "A-104", hostel: "Boys Hostel A", capacity: 4, occupied: 4, floor: 1, type: "Non-AC", status: "occupied" },
  { id: 5, number: "A-105", hostel: "Boys Hostel A", capacity: 2, occupied: 2, floor: 1, type: "AC", status: "occupied" },
  { id: 6, number: "A-201", hostel: "Boys Hostel A", capacity: 4, occupied: 2, floor: 2, type: "AC", status: "partial" },
];

const MESS_MENU = [
  { day: "Monday", breakfast: "Poha, Tea, Fruits", lunch: "Dal, Rice, Roti, Sabzi", dinner: "Paneer, Rice, Roti, Salad" },
  { day: "Tuesday", breakfast: "Paratha, Curd, Tea", lunch: "Rajma, Rice, Roti, Raita", dinner: "Chole, Rice, Roti, Salad" },
  { day: "Wednesday", breakfast: "Idli, Sambar, Coffee", lunch: "Dal Fry, Rice, Roti, Aloo", dinner: "Mix Veg, Rice, Roti, Sweet" },
  { day: "Thursday", breakfast: "Upma, Tea, Banana", lunch: "Kadhi, Rice, Roti, Bhindi", dinner: "Dal Makhani, Rice, Naan" },
  { day: "Friday", breakfast: "Sandwich, Juice", lunch: "Sambar, Rice, Roti, Papad", dinner: "Shahi Paneer, Rice, Roti" },
  { day: "Saturday", breakfast: "Aloo Paratha, Curd", lunch: "Chana Dal, Rice, Puri", dinner: "Veg Biryani, Raita, Sweet" },
  { day: "Sunday", breakfast: "Puri Bhaji, Tea", lunch: "Special Thali", dinner: "Chinese Items, Ice Cream" },
];

export const HostelModule = () => {
  const [selectedHostel, setSelectedHostel] = useState("all");

  const totalCapacity = HOSTELS.reduce((sum, h) => sum + h.capacity, 0);
  const totalOccupied = HOSTELS.reduce((sum, h) => sum + h.occupied, 0);
  const occupancyRate = Math.round((totalOccupied / totalCapacity) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Building className="w-7 h-7 text-amber-500" />
            Hostel & Canteen Management
          </h2>
          <p className="text-slate-400">Manage hostels, rooms, mess, and canteen facilities</p>
        </div>
        <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => toast.info('Add room allocation')}>
          <Plus className="w-4 h-4 mr-2" /> Add Allocation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Hostels", value: HOSTELS.length.toString(), icon: Building, color: "bg-blue-500" },
          { label: "Total Capacity", value: totalCapacity.toString(), icon: Bed, color: "bg-green-500" },
          { label: "Occupied", value: totalOccupied.toString(), icon: Users, color: "bg-purple-500" },
          { label: "Occupancy Rate", value: `${occupancyRate}%`, icon: CheckCircle, color: "bg-amber-500" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="hostels" className="space-y-4">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="hostels">Hostels</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="mess">Mess Menu</TabsTrigger>
          <TabsTrigger value="canteen">Canteen</TabsTrigger>
        </TabsList>

        {/* Hostels Tab */}
        <TabsContent value="hostels" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {HOSTELS.map((hostel, idx) => (
              <motion.div
                key={hostel.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 ${hostel.type === 'boys' ? 'bg-blue-500' : 'bg-pink-500'} rounded-xl flex items-center justify-center`}>
                          <Building className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-bold">{hostel.name}</h3>
                          <p className="text-sm text-slate-400">Warden: {hostel.warden}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">{hostel.status}</Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Occupancy</span>
                        <span className="text-white">{hostel.occupied}/{hostel.capacity}</span>
                      </div>
                      <Progress value={(hostel.occupied / hostel.capacity) * 100} className="h-2" />
                      
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                          <p className="text-xl font-bold text-white">{hostel.rooms}</p>
                          <p className="text-xs text-slate-400">Rooms</p>
                        </div>
                        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                          <p className="text-xl font-bold text-white">{hostel.capacity - hostel.occupied}</p>
                          <p className="text-xs text-slate-400">Vacant Beds</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-slate-600 text-slate-300"
                        onClick={() => toast.info(`Viewing ${hostel.name}`, { description: 'Opening hostel details' })}
                      >
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-slate-600 text-slate-300"
                        onClick={() => toast.info(`Managing ${hostel.name}`, { description: 'Opening management panel' })}
                      >
                        <Settings className="w-4 h-4 mr-1" /> Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Rooms Tab */}
        <TabsContent value="rooms" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Room Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {ROOMS.map((room, idx) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-4 rounded-xl border ${
                      room.status === 'occupied' ? 'bg-red-500/10 border-red-500/30' :
                      room.status === 'partial' ? 'bg-amber-500/10 border-amber-500/30' :
                      'bg-green-500/10 border-green-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-bold">{room.number}</span>
                      <Badge className={
                        room.status === 'occupied' ? 'bg-red-500/20 text-red-400' :
                        room.status === 'partial' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-green-500/20 text-green-400'
                      }>
                        {room.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400">Floor {room.floor} • {room.type}</p>
                    <p className="text-sm text-white mt-1">
                      <Bed className="w-4 h-4 inline mr-1" />
                      {room.occupied}/{room.capacity} beds
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mess Menu Tab */}
        <TabsContent value="mess" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Utensils className="w-5 h-5 text-amber-500" />
                Weekly Mess Menu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left p-3 text-slate-400 font-medium">Day</th>
                      <th className="text-left p-3 text-slate-400 font-medium">Breakfast (8 AM)</th>
                      <th className="text-left p-3 text-slate-400 font-medium">Lunch (1 PM)</th>
                      <th className="text-left p-3 text-slate-400 font-medium">Dinner (8 PM)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MESS_MENU.map((menu, idx) => (
                      <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="p-3">
                          <Badge className="bg-slate-600 text-white">{menu.day}</Badge>
                        </td>
                        <td className="p-3 text-white text-sm">{menu.breakfast}</td>
                        <td className="p-3 text-white text-sm">{menu.lunch}</td>
                        <td className="p-3 text-white text-sm">{menu.dinner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Canteen Tab */}
        <TabsContent value="canteen" className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-amber-500" />
                  Canteen Menu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { item: "Tea/Coffee", price: "₹15" },
                    { item: "Samosa", price: "₹20" },
                    { item: "Sandwich", price: "₹40" },
                    { item: "Burger", price: "₹60" },
                    { item: "Maggi", price: "₹35" },
                    { item: "Cold Drinks", price: "₹30" },
                    { item: "Juice", price: "₹40" },
                    { item: "Thali", price: "₹80" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-slate-700/50 rounded-lg">
                      <span className="text-white">{item.item}</span>
                      <Badge className="bg-green-500/20 text-green-400">{item.price}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-500" />
                  Today's Sales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl">
                    <p className="text-4xl font-bold text-white">₹12,450</p>
                    <p className="text-slate-400">Total Sales Today</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-white">245</p>
                      <p className="text-xs text-slate-400">Orders</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-white">₹51</p>
                      <p className="text-xs text-slate-400">Avg. Order</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

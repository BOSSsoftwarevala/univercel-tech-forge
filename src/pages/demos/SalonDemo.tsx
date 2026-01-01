import { useState } from "react";
import { Scissors, Calendar, Clock, User, Star, Phone, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const appointments = [
  { id: 1, client: "Anita Desai", service: "Hair Cut + Styling", time: "10:00 AM", stylist: "Meera", status: "Confirmed" },
  { id: 2, client: "Pooja Mehta", service: "Bridal Makeup", time: "11:30 AM", stylist: "Priya", status: "In Progress" },
  { id: 3, client: "Ritu Shah", service: "Facial + Cleanup", time: "02:00 PM", stylist: "Kavita", status: "Confirmed" },
  { id: 4, client: "Swati Kapoor", service: "Manicure + Pedicure", time: "03:30 PM", stylist: "Neha", status: "Pending" },
];

const services = [
  { name: "Hair Cut", price: "₹500", duration: "30 min", emoji: "✂️" },
  { name: "Hair Color", price: "₹2,000", duration: "2 hrs", emoji: "🎨" },
  { name: "Facial", price: "₹1,200", duration: "1 hr", emoji: "✨" },
  { name: "Bridal Package", price: "₹15,000", duration: "4 hrs", emoji: "👰" },
];

export default function SalonDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-fuchsia-800 to-purple-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Scissors className="h-8 w-8 text-pink-400" />
            <span className="text-xl font-bold text-white">GlamourStudio</span>
            <Badge variant="outline" className="ml-2 text-pink-400 border-pink-400">by Software Vala</Badge>
          </div>
          <nav className="flex gap-4 text-white/80">
            <span className="hover:text-pink-400 cursor-pointer">Dashboard</span>
            <span className="hover:text-pink-400 cursor-pointer">Appointments</span>
            <span className="hover:text-pink-400 cursor-pointer">Services</span>
            <span className="hover:text-pink-400 cursor-pointer">Staff</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Today's Bookings</p>
                  <p className="text-2xl font-bold text-white">18</p>
                </div>
                <Calendar className="h-8 w-8 text-pink-400" />
              </div>
              <p className="text-green-400 text-sm mt-2">4 slots available</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Revenue Today</p>
                  <p className="text-2xl font-bold text-white">₹28,500</p>
                </div>
                <CreditCard className="h-8 w-8 text-emerald-400" />
              </div>
              <p className="text-emerald-400 text-sm mt-2">+12% vs yesterday</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Staff On Duty</p>
                  <p className="text-2xl font-bold text-white">6</p>
                </div>
                <User className="h-8 w-8 text-fuchsia-400" />
              </div>
              <p className="text-fuchsia-400 text-sm mt-2">All present</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Avg Rating</p>
                  <p className="text-2xl font-bold text-white">4.8</p>
                </div>
                <Star className="h-8 w-8 text-yellow-400" />
              </div>
              <p className="text-yellow-400 text-sm mt-2">245 reviews</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="bg-white/10 border-white/20 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appointments.map(apt => (
                  <div key={apt.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
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
                    <Badge className={
                      apt.status === "Confirmed" ? "bg-green-600" :
                      apt.status === "In Progress" ? "bg-blue-600" : "bg-yellow-600"
                    }>{apt.status}</Badge>
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
                  <div key={i} className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{service.emoji}</span>
                      <div>
                        <p className="text-white font-medium">{service.name}</p>
                        <p className="text-white/60 text-sm">{service.duration}</p>
                      </div>
                    </div>
                    <p className="text-pink-400 font-semibold">{service.price}</p>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-pink-600 hover:bg-pink-700">
                Book Appointment
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

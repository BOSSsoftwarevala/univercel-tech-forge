import { useState } from "react";
import { PartyPopper, Calendar, Users, MapPin, Camera, Music, Utensils, Phone, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const events = [
  { id: 1, name: "Sharma Wedding", date: "15 Jan", venue: "Grand Palace", guests: 500, budget: "₹25L", status: "Confirmed", progress: 75 },
  { id: 2, name: "Corporate Meet", date: "20 Jan", venue: "Tech Hub", guests: 200, budget: "₹8L", status: "Planning", progress: 40 },
  { id: 3, name: "Birthday Party", date: "22 Jan", venue: "Garden Resort", guests: 80, budget: "₹2L", status: "Confirmed", progress: 90 },
  { id: 4, name: "Engagement Ceremony", date: "28 Jan", venue: "Heritage Hall", guests: 300, budget: "₹12L", status: "Pending", progress: 20 },
];

const vendors = [
  { name: "Royal Caterers", type: "Catering", rating: 4.8, price: "₹800/plate", icon: "🍽️" },
  { name: "Shutter Studio", type: "Photography", rating: 4.9, price: "₹1.5L", icon: "📸" },
  { name: "DJ Beats", type: "Music", rating: 4.7, price: "₹50K", icon: "🎵" },
  { name: "Floral Dreams", type: "Decoration", rating: 4.6, price: "₹80K", icon: "💐" },
];

export default function EventDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900 via-pink-800 to-fuchsia-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <PartyPopper className="h-8 w-8 text-rose-400" />
            <span className="text-xl font-bold text-white">EventPro</span>
            <Badge variant="outline" className="ml-2 text-rose-400 border-rose-400">by Software Vala</Badge>
          </div>
          <nav className="flex gap-4 text-white/80">
            <span className="hover:text-rose-400 cursor-pointer">Dashboard</span>
            <span className="hover:text-rose-400 cursor-pointer">Events</span>
            <span className="hover:text-rose-400 cursor-pointer">Vendors</span>
            <span className="hover:text-rose-400 cursor-pointer">Venues</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Upcoming Events</p>
                  <p className="text-2xl font-bold text-white">12</p>
                </div>
                <Calendar className="h-8 w-8 text-rose-400" />
              </div>
              <p className="text-rose-400 text-sm mt-2">4 this week</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">₹85L</p>
                </div>
                <Star className="h-8 w-8 text-yellow-400" />
              </div>
              <p className="text-green-400 text-sm mt-2">This quarter</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Verified Vendors</p>
                  <p className="text-2xl font-bold text-white">156</p>
                </div>
                <Users className="h-8 w-8 text-fuchsia-400" />
              </div>
              <p className="text-fuchsia-400 text-sm mt-2">All categories</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Active Venues</p>
                  <p className="text-2xl font-bold text-white">24</p>
                </div>
                <MapPin className="h-8 w-8 text-emerald-400" />
              </div>
              <p className="text-emerald-400 text-sm mt-2">Partnered</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="bg-white/10 border-white/20 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map(event => (
                  <div key={event.id} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-white font-medium text-lg">{event.name}</p>
                        <p className="text-white/60 text-sm flex items-center gap-2">
                          <Calendar className="h-4 w-4" /> {event.date}
                          <MapPin className="h-4 w-4 ml-2" /> {event.venue}
                        </p>
                        <p className="text-rose-300 text-sm">{event.guests} guests • Budget: {event.budget}</p>
                      </div>
                      <Badge className={
                        event.status === "Confirmed" ? "bg-green-600" :
                        event.status === "Planning" ? "bg-blue-600" : "bg-yellow-600"
                      }>{event.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={event.progress} className="flex-1" />
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
                {vendors.map((vendor, i) => (
                  <div key={i} className="p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{vendor.icon}</span>
                      <div className="flex-1">
                        <p className="text-white font-medium">{vendor.name}</p>
                        <p className="text-white/60 text-xs">{vendor.type}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="h-3 w-3 text-yellow-400" />
                          <span className="text-yellow-400 text-xs">{vendor.rating}</span>
                          <span className="text-rose-400 text-xs ml-auto">{vendor.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-rose-600 hover:bg-rose-700">
                Create New Event
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

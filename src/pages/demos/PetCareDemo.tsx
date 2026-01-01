import { useState } from "react";
import { Dog, Calendar, Scissors, Stethoscope, Package, Clock, Heart, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const pets = [
  { id: 1, name: "Bruno", type: "Dog", breed: "Labrador", owner: "Rahul Sharma", visit: "Vaccination", time: "10:00 AM", emoji: "🐕" },
  { id: 2, name: "Whiskers", type: "Cat", breed: "Persian", owner: "Priya Patel", visit: "Grooming", time: "11:30 AM", emoji: "🐱" },
  { id: 3, name: "Max", type: "Dog", breed: "German Shepherd", owner: "Amit Kumar", visit: "Checkup", time: "02:00 PM", emoji: "🐕‍🦺" },
  { id: 4, name: "Coco", type: "Parrot", breed: "Macaw", owner: "Sneha Gupta", visit: "Treatment", time: "03:30 PM", emoji: "🦜" },
];

const services = [
  { name: "Vaccination", price: "₹800", duration: "30 min", icon: "💉" },
  { name: "Grooming", price: "₹1,500", duration: "1.5 hrs", icon: "✂️" },
  { name: "Health Checkup", price: "₹500", duration: "45 min", icon: "🩺" },
  { name: "Pet Boarding", price: "₹1,000/day", duration: "24 hrs", icon: "🏠" },
];

export default function PetCareDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-300 to-yellow-400">
      <header className="bg-white/20 backdrop-blur-sm border-b border-white/30 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Dog className="h-8 w-8 text-amber-700" />
            <span className="text-xl font-bold text-amber-900">PetCare+</span>
            <Badge variant="outline" className="ml-2 text-amber-800 border-amber-800">by Software Vala</Badge>
          </div>
          <nav className="flex gap-4 text-amber-800">
            <span className="hover:text-amber-900 cursor-pointer">Dashboard</span>
            <span className="hover:text-amber-900 cursor-pointer">Appointments</span>
            <span className="hover:text-amber-900 cursor-pointer">Pets</span>
            <span className="hover:text-amber-900 cursor-pointer">Shop</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/90 shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Today's Visits</p>
                  <p className="text-2xl font-bold text-gray-800">18</p>
                </div>
                <Calendar className="h-8 w-8 text-amber-500" />
              </div>
              <p className="text-amber-600 text-sm mt-2">4 grooming</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Registered Pets</p>
                  <p className="text-2xl font-bold text-gray-800">542</p>
                </div>
                <Heart className="h-8 w-8 text-red-400" />
              </div>
              <p className="text-green-500 text-sm mt-2">+12 this week</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Revenue Today</p>
                  <p className="text-2xl font-bold text-gray-800">₹24,500</p>
                </div>
                <Package className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-green-500 text-sm mt-2">+8% vs yesterday</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-gray-800">6</p>
                </div>
                <Clock className="h-8 w-8 text-orange-400" />
              </div>
              <p className="text-orange-500 text-sm mt-2">Awaiting pickup</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="bg-white/90 shadow-lg lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-gray-800">Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pets.map(pet => (
                  <div key={pet.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
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
                      <Badge className="bg-amber-500">{pet.visit}</Badge>
                      <Button variant="ghost" size="icon">
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
              <CardTitle className="text-gray-800">Our Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {services.map((service, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{service.icon}</span>
                      <div>
                        <p className="text-gray-700 font-medium">{service.name}</p>
                        <p className="text-gray-400 text-xs">{service.duration}</p>
                      </div>
                    </div>
                    <p className="text-amber-600 font-bold">{service.price}</p>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                Book Appointment
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="mt-12 py-6 border-t border-white/30 text-center text-amber-800">
        <p>© 2025 Software Vala - The Name of Trust. All rights reserved.</p>
      </footer>
    </div>
  );
}

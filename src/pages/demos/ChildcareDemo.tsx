import { useState } from "react";
import { Baby, Calendar, Clock, Users, Heart, Bell, Camera, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const children = [
  { id: 1, name: "Aarav Sharma", age: "3 yrs", parent: "Priya Sharma", status: "Present", mood: "😊" },
  { id: 2, name: "Ananya Patel", age: "4 yrs", parent: "Rahul Patel", status: "Present", mood: "😄" },
  { id: 3, name: "Vihaan Kumar", age: "2 yrs", parent: "Neha Kumar", status: "Absent", mood: "-" },
  { id: 4, name: "Ishita Gupta", age: "3 yrs", parent: "Amit Gupta", status: "Present", mood: "😴" },
];

const activities = [
  { time: "09:00 AM", activity: "Morning Circle Time", status: "completed" },
  { time: "10:00 AM", activity: "Art & Craft", status: "completed" },
  { time: "11:00 AM", activity: "Snack Time", status: "in-progress" },
  { time: "12:00 PM", activity: "Nap Time", status: "upcoming" },
  { time: "02:00 PM", activity: "Outdoor Play", status: "upcoming" },
];

export default function ChildcareDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400">
      <header className="bg-white/20 backdrop-blur-sm border-b border-white/30 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Baby className="h-8 w-8 text-pink-600" />
            <span className="text-xl font-bold text-white">LittleStars</span>
            <Badge variant="outline" className="ml-2 text-white border-white">by Software Vala</Badge>
          </div>
          <nav className="flex gap-4 text-white/90">
            <span className="hover:text-white cursor-pointer">Dashboard</span>
            <span className="hover:text-white cursor-pointer">Children</span>
            <span className="hover:text-white cursor-pointer">Parents</span>
            <span className="hover:text-white cursor-pointer">Reports</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/90 shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Children Today</p>
                  <p className="text-2xl font-bold text-gray-800">24/28</p>
                </div>
                <Users className="h-8 w-8 text-pink-500" />
              </div>
              <p className="text-pink-500 text-sm mt-2">4 absent</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Staff On Duty</p>
                  <p className="text-2xl font-bold text-gray-800">8</p>
                </div>
                <Heart className="h-8 w-8 text-red-400" />
              </div>
              <p className="text-green-500 text-sm mt-2">All present</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Activities Today</p>
                  <p className="text-2xl font-bold text-gray-800">6</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
              <p className="text-purple-500 text-sm mt-2">2 completed</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Pending Pickups</p>
                  <p className="text-2xl font-bold text-gray-800">3</p>
                </div>
                <Bell className="h-8 w-8 text-orange-400" />
              </div>
              <p className="text-orange-500 text-sm mt-2">Parents notified</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="bg-white/90 shadow-lg lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-gray-800">Children Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {children.map(child => (
                  <div key={child.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-2xl">
                        {child.mood}
                      </div>
                      <div>
                        <p className="text-gray-800 font-medium">{child.name}</p>
                        <p className="text-gray-500 text-sm">Age: {child.age}</p>
                        <p className="text-gray-400 text-xs">Parent: {child.parent}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={
                        child.status === "Present" ? "bg-green-500" : "bg-red-400"
                      }>{child.status}</Badge>
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
              <CardTitle className="text-gray-800">Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.map((act, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
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
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                <Camera className="h-4 w-4 mr-2" /> Send Update to Parents
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="mt-12 py-6 border-t border-white/30 text-center text-white">
        <p>© 2025 Software Vala - The Name of Trust. All rights reserved.</p>
      </footer>
    </div>
  );
}

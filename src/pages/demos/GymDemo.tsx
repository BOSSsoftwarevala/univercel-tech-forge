import { useState } from "react";
import { Dumbbell, Users, Calendar, CreditCard, TrendingUp, Clock, Award, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const members = [
  { id: 1, name: "Vikram Singh", plan: "Premium", expires: "15 Feb", status: "Active" },
  { id: 2, name: "Neha Sharma", plan: "Basic", expires: "28 Jan", status: "Expiring" },
  { id: 3, name: "Arjun Patel", plan: "Premium", expires: "10 Mar", status: "Active" },
  { id: 4, name: "Kavita Reddy", plan: "Basic", expires: "05 Jan", status: "Expired" },
];

const classes = [
  { time: "06:00 AM", name: "Morning Yoga", trainer: "Priya", slots: 15, booked: 12 },
  { time: "07:30 AM", name: "CrossFit", trainer: "Raj", slots: 20, booked: 20 },
  { time: "09:00 AM", name: "Zumba", trainer: "Meera", slots: 25, booked: 18 },
  { time: "05:00 PM", name: "Weight Training", trainer: "Vikram", slots: 10, booked: 8 },
];

export default function GymDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-rose-800 to-orange-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-8 w-8 text-rose-400" />
            <span className="text-xl font-bold text-white">FitnessPro</span>
            <Badge variant="outline" className="ml-2 text-rose-400 border-rose-400">by Software Vala</Badge>
          </div>
          <nav className="flex gap-4 text-white/80">
            <span className="hover:text-rose-400 cursor-pointer">Dashboard</span>
            <span className="hover:text-rose-400 cursor-pointer">Members</span>
            <span className="hover:text-rose-400 cursor-pointer">Classes</span>
            <span className="hover:text-rose-400 cursor-pointer">Payments</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Total Members</p>
                  <p className="text-2xl font-bold text-white">1,248</p>
                </div>
                <Users className="h-8 w-8 text-rose-400" />
              </div>
              <p className="text-green-400 text-sm mt-2">+45 this month</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Active Today</p>
                  <p className="text-2xl font-bold text-white">156</p>
                </div>
                <Activity className="h-8 w-8 text-green-400" />
              </div>
              <p className="text-white/50 text-sm mt-2">Check-ins today</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Revenue</p>
                  <p className="text-2xl font-bold text-white">₹4.8L</p>
                </div>
                <CreditCard className="h-8 w-8 text-emerald-400" />
              </div>
              <p className="text-emerald-400 text-sm mt-2">This month</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Expiring Soon</p>
                  <p className="text-2xl font-bold text-white">28</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
              <p className="text-yellow-400 text-sm mt-2">Next 7 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Recent Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {members.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center text-white font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{member.name}</p>
                        <p className="text-white/60 text-sm">{member.plan} • Expires: {member.expires}</p>
                      </div>
                    </div>
                    <Badge className={
                      member.status === "Active" ? "bg-green-600" :
                      member.status === "Expiring" ? "bg-yellow-600" : "bg-red-600"
                    }>{member.status}</Badge>
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
                  <div key={i} className="p-3 bg-white/5 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white font-medium">{cls.name}</p>
                        <p className="text-white/60 text-sm">{cls.time} • Trainer: {cls.trainer}</p>
                      </div>
                      <Badge className={cls.booked >= cls.slots ? "bg-red-600" : "bg-green-600"}>
                        {cls.booked >= cls.slots ? "Full" : `${cls.slots - cls.booked} slots`}
                      </Badge>
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

      <footer className="mt-12 py-6 border-t border-white/10 text-center text-white/60">
        <p>© 2025 Software Vala - The Name of Trust. All rights reserved.</p>
      </footer>
    </div>
  );
}

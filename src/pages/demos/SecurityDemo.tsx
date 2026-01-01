import { useState } from "react";
import { Shield, Camera, Users, MapPin, AlertTriangle, CheckCircle, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const guards = [
  { id: 1, name: "Ramesh Kumar", location: "Gate A", status: "On Duty", shift: "Day", lastCheck: "2 min ago" },
  { id: 2, name: "Suresh Yadav", location: "Parking", status: "On Duty", shift: "Day", lastCheck: "5 min ago" },
  { id: 3, name: "Vijay Singh", location: "Building B", status: "Break", shift: "Day", lastCheck: "15 min ago" },
  { id: 4, name: "Anil Sharma", location: "Warehouse", status: "On Duty", shift: "Day", lastCheck: "1 min ago" },
];

const alerts = [
  { time: "10:45 AM", type: "Motion Detected", location: "Parking Lot", severity: "low" },
  { time: "09:30 AM", type: "Unauthorized Access", location: "Server Room", severity: "high" },
  { time: "08:15 AM", type: "Camera Offline", location: "Gate B", severity: "medium" },
];

export default function SecurityDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-cyan-400" />
            <span className="text-xl font-bold text-white">SecureGuard</span>
            <Badge variant="outline" className="ml-2 text-cyan-400 border-cyan-400">by Software Vala</Badge>
          </div>
          <nav className="flex gap-4 text-white/80">
            <span className="hover:text-cyan-400 cursor-pointer">Dashboard</span>
            <span className="hover:text-cyan-400 cursor-pointer">Guards</span>
            <span className="hover:text-cyan-400 cursor-pointer">Cameras</span>
            <span className="hover:text-cyan-400 cursor-pointer">Reports</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Guards On Duty</p>
                  <p className="text-2xl font-bold text-white">12</p>
                </div>
                <Users className="h-8 w-8 text-cyan-400" />
              </div>
              <p className="text-green-400 text-sm mt-2">All positions covered</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Active Cameras</p>
                  <p className="text-2xl font-bold text-white">24/26</p>
                </div>
                <Camera className="h-8 w-8 text-blue-400" />
              </div>
              <p className="text-yellow-400 text-sm mt-2">2 offline</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Today's Alerts</p>
                  <p className="text-2xl font-bold text-white">8</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-400" />
              </div>
              <p className="text-red-400 text-sm mt-2">1 critical</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Patrol Checks</p>
                  <p className="text-2xl font-bold text-white">45</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <p className="text-green-400 text-sm mt-2">On schedule</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="bg-white/10 border-white/20 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Guard Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {guards.map(guard => (
                  <div key={guard.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold">
                        {guard.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{guard.name}</p>
                        <p className="text-white/60 text-sm flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {guard.location}
                        </p>
                        <p className="text-cyan-300 text-xs">Last check: {guard.lastCheck}</p>
                      </div>
                    </div>
                    <Badge className={
                      guard.status === "On Duty" ? "bg-green-600" : "bg-yellow-600"
                    }>{guard.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert, i) => (
                  <div key={i} className="p-3 bg-white/5 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                        alert.severity === "high" ? "text-red-400" :
                        alert.severity === "medium" ? "text-yellow-400" : "text-blue-400"
                      }`} />
                      <div>
                        <p className="text-white text-sm font-medium">{alert.type}</p>
                        <p className="text-white/60 text-xs">{alert.location}</p>
                        <p className="text-white/40 text-xs">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700">
                <Eye className="h-4 w-4 mr-2" /> View All Alerts
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

/**
 * Security & Access Module
 * Access control, visitor management, and security features
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, Plus, Users, Eye, Lock, Unlock, Key,
  UserCheck, UserX, Clock, Camera, AlertTriangle,
  MapPin, Fingerprint, QrCode, CheckCircle, Settings,
  Scan, Monitor, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ACCESS_LOGS = [
  { id: 1, name: "Mr. Verma", type: "staff", action: "entry", time: "8:45 AM", gate: "Main Gate", method: "Biometric" },
  { id: 2, name: "Rahul Singh", type: "student", action: "entry", time: "8:50 AM", gate: "Main Gate", method: "ID Card" },
  { id: 3, name: "Mrs. Sharma", type: "visitor", action: "entry", time: "9:15 AM", gate: "Reception", method: "OTP" },
  { id: 4, name: "Delivery Person", type: "delivery", action: "entry", time: "9:30 AM", gate: "Service Gate", method: "Pass" },
  { id: 5, name: "Dr. Gupta", type: "staff", action: "exit", time: "10:00 AM", gate: "Main Gate", method: "Biometric" },
  { id: 6, name: "Parent Visit", type: "visitor", action: "entry", time: "10:30 AM", gate: "Reception", method: "OTP" },
];

const VISITORS = [
  { id: 1, name: "Mrs. Priya Sharma", purpose: "Parent Meeting", host: "Mr. Verma", status: "checked-in", checkIn: "9:15 AM", checkOut: "-" },
  { id: 2, name: "Mr. Rajesh Kumar", purpose: "Vendor Meeting", host: "Admin Office", status: "checked-in", checkIn: "10:00 AM", checkOut: "-" },
  { id: 3, name: "Dr. Anita Gupta", purpose: "Medical Checkup", host: "Medical Room", status: "checked-out", checkIn: "8:30 AM", checkOut: "11:00 AM" },
  { id: 4, name: "IT Support Team", purpose: "Computer Lab Service", host: "IT Department", status: "checked-in", checkIn: "9:45 AM", checkOut: "-" },
];

const ALERTS = [
  { id: 1, type: "warning", message: "Unknown person detected at Back Gate", time: "2 min ago", status: "active" },
  { id: 2, type: "info", message: "Visitor pass expiring in 15 minutes - Mrs. Sharma", time: "10 min ago", status: "pending" },
  { id: 3, type: "success", message: "All morning attendance verified", time: "1 hour ago", status: "resolved" },
  { id: 4, type: "alert", message: "Emergency exit door opened - Block C", time: "3 hours ago", status: "resolved" },
];

const GATES = [
  { id: 1, name: "Main Gate", status: "open", cameras: 4, guards: 2, lastActivity: "Just now" },
  { id: 2, name: "Back Gate", status: "open", cameras: 2, guards: 1, lastActivity: "5 min ago" },
  { id: 3, name: "Service Gate", status: "closed", cameras: 2, guards: 1, lastActivity: "30 min ago" },
  { id: 4, name: "Emergency Exit A", status: "locked", cameras: 1, guards: 0, lastActivity: "2 hours ago" },
  { id: 5, name: "Emergency Exit B", status: "locked", cameras: 1, guards: 0, lastActivity: "3 hours ago" },
];

export const SecurityModule = () => {
  const [isAddVisitorOpen, setIsAddVisitorOpen] = useState(false);

  const activeAlerts = ALERTS.filter(a => a.status === 'active').length;
  const checkgedInVisitors = VISITORS.filter(v => v.status === 'checked-in').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-7 h-7 text-amber-500" />
            Security & Access Control
          </h2>
          <p className="text-slate-400">Manage access, visitors, and security monitoring</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-600 text-slate-300" onClick={() => toast.info('View all cameras')}>
            <Camera className="w-4 h-4 mr-2" /> CCTV
          </Button>
          <Dialog open={isAddVisitorOpen} onOpenChange={setIsAddVisitorOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                <Plus className="w-4 h-4 mr-2" /> Add Visitor
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle>Register Visitor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Visitor Name *</Label>
                  <Input placeholder="Full name" className="bg-slate-700 border-slate-600" />
                </div>
                <div>
                  <Label>Phone Number *</Label>
                  <Input placeholder="+91 XXXXXXXXXX" className="bg-slate-700 border-slate-600" />
                </div>
                <div>
                  <Label>Purpose of Visit *</Label>
                  <Input placeholder="e.g., Parent Meeting" className="bg-slate-700 border-slate-600" />
                </div>
                <div>
                  <Label>Host/Meeting With *</Label>
                  <Input placeholder="e.g., Mr. Verma" className="bg-slate-700 border-slate-600" />
                </div>
                <Button 
                  onClick={() => {
                    toast.success('Visitor registered! OTP sent.');
                    setIsAddVisitorOpen(false);
                  }}
                  className="w-full bg-amber-500 hover:bg-amber-600"
                >
                  Register & Send OTP
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Active Alerts", value: activeAlerts.toString(), icon: AlertTriangle, color: activeAlerts > 0 ? "bg-red-500" : "bg-green-500", pulse: activeAlerts > 0 },
          { label: "Visitors Today", value: checkgedInVisitors.toString(), icon: Users, color: "bg-blue-500" },
          { label: "Access Logs", value: ACCESS_LOGS.length.toString(), icon: Clock, color: "bg-purple-500" },
          { label: "Gates Active", value: GATES.filter(g => g.status === 'open').length.toString(), icon: MapPin, color: "bg-amber-500" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center relative`}>
                <stat.icon className="w-6 h-6 text-white" />
                {stat.pulse && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse" />}
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="access" className="space-y-4">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="access">Access Logs</TabsTrigger>
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="gates">Gates</TabsTrigger>
          <TabsTrigger value="alerts" className="relative">
            Alerts
            {activeAlerts > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />}
          </TabsTrigger>
        </TabsList>

        {/* Access Logs Tab */}
        <TabsContent value="access" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Today's Access Logs</CardTitle>
              <Badge className="bg-green-500/20 text-green-400">{ACCESS_LOGS.length} entries</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ACCESS_LOGS.map((log, idx) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback className={
                          log.type === 'staff' ? 'bg-blue-500' :
                          log.type === 'student' ? 'bg-green-500' :
                          log.type === 'visitor' ? 'bg-purple-500' :
                          'bg-amber-500'
                        }>
                          {log.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-medium">{log.name}</p>
                        <p className="text-sm text-slate-400 capitalize">{log.type} • {log.gate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-white">{log.time}</p>
                        <p className="text-sm text-slate-400">{log.method}</p>
                      </div>
                      <Badge className={log.action === 'entry' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                        {log.action === 'entry' ? <UserCheck className="w-3 h-3 mr-1" /> : <UserX className="w-3 h-3 mr-1" />}
                        {log.action}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visitors Tab */}
        <TabsContent value="visitors" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Visitor Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {VISITORS.map((visitor, idx) => (
                  <motion.div
                    key={visitor.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-4 rounded-xl border ${
                      visitor.status === 'checked-in' 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-slate-700/50 border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback className="bg-purple-500">
                            {visitor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium">{visitor.name}</p>
                          <p className="text-sm text-slate-400">{visitor.purpose}</p>
                          <p className="text-xs text-slate-500">Host: {visitor.host}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-white text-sm">In: {visitor.checkIn}</p>
                          <p className="text-sm text-slate-400">Out: {visitor.checkOut}</p>
                        </div>
                        <Badge className={visitor.status === 'checked-in' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}>
                          {visitor.status}
                        </Badge>
                        {visitor.status === 'checked-in' && (
                          <Button size="sm" variant="outline" className="border-red-500 text-red-400" onClick={() => toast.success('Visitor checked out')}>
                            Check Out
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gates Tab */}
        <TabsContent value="gates" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {GATES.map((gate, idx) => (
              <motion.div
                key={gate.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 ${
                          gate.status === 'open' ? 'bg-green-500' :
                          gate.status === 'closed' ? 'bg-amber-500' :
                          'bg-red-500'
                        } rounded-xl flex items-center justify-center`}>
                          {gate.status === 'locked' ? <Lock className="w-6 h-6 text-white" /> : <Unlock className="w-6 h-6 text-white" />}
                        </div>
                        <div>
                          <h3 className="text-white font-bold">{gate.name}</h3>
                          <p className="text-sm text-slate-400 capitalize">{gate.status}</p>
                        </div>
                      </div>
                      <Badge className={
                        gate.status === 'open' ? 'bg-green-500/20 text-green-400' :
                        gate.status === 'closed' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-red-500/20 text-red-400'
                      }>
                        {gate.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <Camera className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                        <p className="text-white font-medium">{gate.cameras}</p>
                        <p className="text-xs text-slate-400">Cameras</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <Users className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                        <p className="text-white font-medium">{gate.guards}</p>
                        <p className="text-xs text-slate-400">Guards</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <Clock className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                        <p className="text-white font-medium text-xs">{gate.lastActivity}</p>
                        <p className="text-xs text-slate-400">Last Activity</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1 border-slate-600 text-slate-300">
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 border-slate-600 text-slate-300">
                        <Settings className="w-4 h-4 mr-1" /> Control
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                Security Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ALERTS.map((alert, idx) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-4 rounded-xl border ${
                      alert.type === 'warning' ? 'bg-amber-500/10 border-amber-500/30' :
                      alert.type === 'alert' ? 'bg-red-500/10 border-red-500/30' :
                      alert.type === 'success' ? 'bg-green-500/10 border-green-500/30' :
                      'bg-blue-500/10 border-blue-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {alert.type === 'warning' && <AlertTriangle className="w-6 h-6 text-amber-400" />}
                        {alert.type === 'alert' && <AlertTriangle className="w-6 h-6 text-red-400" />}
                        {alert.type === 'success' && <CheckCircle className="w-6 h-6 text-green-400" />}
                        {alert.type === 'info' && <Bell className="w-6 h-6 text-blue-400" />}
                        <div>
                          <p className="text-white font-medium">{alert.message}</p>
                          <p className="text-sm text-slate-400">{alert.time}</p>
                        </div>
                      </div>
                      <Badge className={
                        alert.status === 'active' ? 'bg-red-500/20 text-red-400' :
                        alert.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-green-500/20 text-green-400'
                      }>
                        {alert.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

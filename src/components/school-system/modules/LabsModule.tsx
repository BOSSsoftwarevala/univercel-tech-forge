/**
 * Labs & Equipment Module
 * Manage laboratories, equipment, and inventory
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Microscope, Plus, Settings, Eye, Edit, Trash2,
  Wrench, AlertTriangle, CheckCircle, Clock, Package,
  FlaskConical, Laptop, Monitor, Cpu, Beaker
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const LABS = [
  { id: 1, name: "Physics Lab 1", type: "physics", capacity: 40, equipment: 45, status: "available", lastMaintenance: "2025-12-15" },
  { id: 2, name: "Physics Lab 2", type: "physics", capacity: 35, equipment: 38, status: "in-use", lastMaintenance: "2025-11-20" },
  { id: 3, name: "Chemistry Lab 1", type: "chemistry", capacity: 40, equipment: 62, status: "available", lastMaintenance: "2025-12-10" },
  { id: 4, name: "Chemistry Lab 2", type: "chemistry", capacity: 35, equipment: 55, status: "maintenance", lastMaintenance: "2026-01-05" },
  { id: 5, name: "Biology Lab", type: "biology", capacity: 40, equipment: 48, status: "available", lastMaintenance: "2025-12-01" },
  { id: 6, name: "Computer Lab 1", type: "computer", capacity: 50, equipment: 52, status: "in-use", lastMaintenance: "2025-11-30" },
  { id: 7, name: "Computer Lab 2", type: "computer", capacity: 50, equipment: 51, status: "available", lastMaintenance: "2025-12-05" },
  { id: 8, name: "Language Lab", type: "language", capacity: 40, equipment: 42, status: "available", lastMaintenance: "2025-11-25" },
];

const EQUIPMENT = [
  { id: 1, name: "Microscope (Compound)", lab: "Biology Lab", quantity: 20, working: 18, category: "biology" },
  { id: 2, name: "Bunsen Burner", lab: "Chemistry Lab 1", quantity: 30, working: 28, category: "chemistry" },
  { id: 3, name: "Oscilloscope", lab: "Physics Lab 1", quantity: 10, working: 10, category: "physics" },
  { id: 4, name: "Desktop Computer", lab: "Computer Lab 1", quantity: 50, working: 48, category: "computer" },
  { id: 5, name: "Voltmeter", lab: "Physics Lab 1", quantity: 25, working: 24, category: "physics" },
  { id: 6, name: "Test Tubes", lab: "Chemistry Lab 1", quantity: 200, working: 185, category: "chemistry" },
  { id: 7, name: "Headphones", lab: "Language Lab", quantity: 40, working: 38, category: "language" },
  { id: 8, name: "Projector", lab: "All Labs", quantity: 8, working: 8, category: "general" },
];

const MAINTENANCE_LOG = [
  { id: 1, equipment: "Microscope Set", lab: "Biology Lab", date: "2026-01-10", status: "scheduled", priority: "medium" },
  { id: 2, equipment: "AC Unit", lab: "Computer Lab 1", date: "2026-01-08", status: "completed", priority: "high" },
  { id: 3, equipment: "Fume Hood", lab: "Chemistry Lab 2", date: "2026-01-15", status: "scheduled", priority: "high" },
  { id: 4, equipment: "Computer Servers", lab: "Computer Lab 2", date: "2026-01-05", status: "completed", priority: "critical" },
];

export const LabsModule = () => {
  const getLabIcon = (type: string) => {
    switch (type) {
      case 'physics': return <FlaskConical className="w-6 h-6 text-white" />;
      case 'chemistry': return <Beaker className="w-6 h-6 text-white" />;
      case 'biology': return <Microscope className="w-6 h-6 text-white" />;
      case 'computer': return <Laptop className="w-6 h-6 text-white" />;
      default: return <Monitor className="w-6 h-6 text-white" />;
    }
  };

  const getLabColor = (type: string) => {
    switch (type) {
      case 'physics': return 'bg-blue-500';
      case 'chemistry': return 'bg-green-500';
      case 'biology': return 'bg-pink-500';
      case 'computer': return 'bg-purple-500';
      default: return 'bg-amber-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available': return <Badge className="bg-green-500/20 text-green-400">Available</Badge>;
      case 'in-use': return <Badge className="bg-blue-500/20 text-blue-400">In Use</Badge>;
      case 'maintenance': return <Badge className="bg-amber-500/20 text-amber-400">Maintenance</Badge>;
      default: return <Badge className="bg-slate-500/20 text-slate-400">{status}</Badge>;
    }
  };

  const totalEquipment = EQUIPMENT.reduce((sum, e) => sum + e.quantity, 0);
  const workingEquipment = EQUIPMENT.reduce((sum, e) => sum + e.working, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Microscope className="w-7 h-7 text-amber-500" />
            Labs & Equipment
          </h2>
          <p className="text-slate-400">Manage laboratories, equipment, and maintenance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-600 text-slate-300" onClick={() => toast.info('Maintenance schedule')}>
            <Wrench className="w-4 h-4 mr-2" /> Maintenance
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => toast.info('Add equipment')}>
            <Plus className="w-4 h-4 mr-2" /> Add Equipment
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Labs", value: LABS.length.toString(), icon: Microscope, color: "bg-blue-500" },
          { label: "Available", value: LABS.filter(l => l.status === 'available').length.toString(), icon: CheckCircle, color: "bg-green-500" },
          { label: "Total Equipment", value: totalEquipment.toString(), icon: Package, color: "bg-purple-500" },
          { label: "Working", value: `${Math.round((workingEquipment / totalEquipment) * 100)}%`, icon: Settings, color: "bg-amber-500" },
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

      <Tabs defaultValue="labs" className="space-y-4">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="labs">Laboratories</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        {/* Labs Tab */}
        <TabsContent value="labs" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {LABS.map((lab, idx) => (
              <motion.div
                key={lab.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 ${getLabColor(lab.type)} rounded-xl flex items-center justify-center`}>
                          {getLabIcon(lab.type)}
                        </div>
                        <div>
                          <h3 className="text-white font-bold">{lab.name}</h3>
                          <p className="text-sm text-slate-400 capitalize">{lab.type} Laboratory</p>
                        </div>
                      </div>
                      {getStatusBadge(lab.status)}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <p className="text-lg font-bold text-white">{lab.capacity}</p>
                        <p className="text-xs text-slate-400">Capacity</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <p className="text-lg font-bold text-white">{lab.equipment}</p>
                        <p className="text-xs text-slate-400">Equipment</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <p className="text-lg font-bold text-white">{new Date(lab.lastMaintenance).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                        <p className="text-xs text-slate-400">Last Check</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1 border-slate-600 text-slate-300">
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 border-slate-600 text-slate-300">
                        <Settings className="w-4 h-4 mr-1" /> Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Equipment Tab */}
        <TabsContent value="equipment" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Equipment Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {EQUIPMENT.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 ${getLabColor(item.category)} rounded-lg flex items-center justify-center`}>
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-sm text-slate-400">{item.lab}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-white font-medium">{item.working}/{item.quantity}</p>
                        <p className="text-xs text-slate-400">Working</p>
                      </div>
                      <div className="w-24">
                        <Progress value={(item.working / item.quantity) * 100} className="h-2" />
                      </div>
                      <Button size="icon" variant="ghost" className="text-slate-400 hover:text-white">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-500" />
                Maintenance Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MAINTENANCE_LOG.map((log, idx) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-4 rounded-xl border ${
                      log.status === 'completed' ? 'bg-green-500/10 border-green-500/30' :
                      log.priority === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                      log.priority === 'high' ? 'bg-amber-500/10 border-amber-500/30' :
                      'bg-blue-500/10 border-blue-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {log.status === 'completed' ? (
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        ) : log.priority === 'critical' ? (
                          <AlertTriangle className="w-6 h-6 text-red-400" />
                        ) : (
                          <Clock className="w-6 h-6 text-amber-400" />
                        )}
                        <div>
                          <p className="text-white font-medium">{log.equipment}</p>
                          <p className="text-sm text-slate-400">{log.lab}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white">{new Date(log.date).toLocaleDateString()}</p>
                        <Badge className={
                          log.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          'bg-amber-500/20 text-amber-400'
                        }>
                          {log.status}
                        </Badge>
                      </div>
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

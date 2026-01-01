import { useState } from "react";
import { Factory, Package, TrendingUp, AlertTriangle, CheckCircle, Clock, BarChart3, Settings, Plus, Play, Pause, RefreshCw, Eye, Edit, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Order {
  id: string;
  product: string;
  qty: number;
  status: string;
  progress: number;
}

interface Machine {
  name: string;
  status: string;
  temp: string;
}

const initialOrders: Order[] = [
  { id: "ORD001", product: "Steel Rods", qty: 5000, status: "In Progress", progress: 65 },
  { id: "ORD002", product: "Copper Wires", qty: 2000, status: "Quality Check", progress: 90 },
  { id: "ORD003", product: "Aluminum Sheets", qty: 1500, status: "Pending", progress: 0 },
  { id: "ORD004", product: "Iron Pipes", qty: 3000, status: "Completed", progress: 100 },
];

const initialMachines: Machine[] = [
  { name: "CNC Machine 1", status: "Running", temp: "42°C" },
  { name: "Press Unit A", status: "Running", temp: "38°C" },
  { name: "Welding Bot 3", status: "Idle", temp: "25°C" },
  { name: "Assembly Line 2", status: "Maintenance", temp: "-" },
];

export default function ManufacturingDemo() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [machines, setMachines] = useState<Machine[]>(initialMachines);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showMachineModal, setShowMachineModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [newOrder, setNewOrder] = useState({ product: "", qty: "", status: "Pending" });
  const [stats, setStats] = useState({
    production: 12450,
    efficiency: 94.5,
    quality: 98.2,
    alerts: 3
  });

  const handleAddOrder = () => {
    if (!newOrder.product || !newOrder.qty) {
      toast.error("Please fill all fields");
      return;
    }
    const order: Order = {
      id: `ORD${String(orders.length + 1).padStart(3, '0')}`,
      product: newOrder.product,
      qty: parseInt(newOrder.qty),
      status: "Pending",
      progress: 0
    };
    setOrders([order, ...orders]);
    setShowOrderModal(false);
    setNewOrder({ product: "", qty: "", status: "Pending" });
    toast.success(`Order ${order.id} created successfully!`);
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        let progress = order.progress;
        if (newStatus === "In Progress") progress = Math.max(25, order.progress);
        if (newStatus === "Quality Check") progress = 90;
        if (newStatus === "Completed") progress = 100;
        if (newStatus === "Pending") progress = 0;
        return { ...order, status: newStatus, progress };
      }
      return order;
    }));
    toast.success(`Order ${orderId} updated to ${newStatus}`);
  };

  const deleteOrder = (orderId: string) => {
    setOrders(orders.filter(order => order.id !== orderId));
    toast.success(`Order ${orderId} deleted`);
  };

  const toggleMachine = (machineName: string) => {
    setMachines(machines.map(machine => {
      if (machine.name === machineName) {
        let newStatus = machine.status;
        let newTemp = machine.temp;
        if (machine.status === "Running") {
          newStatus = "Idle";
          newTemp = "25°C";
        } else if (machine.status === "Idle") {
          newStatus = "Running";
          newTemp = `${35 + Math.floor(Math.random() * 15)}°C`;
        } else if (machine.status === "Maintenance") {
          newStatus = "Idle";
          newTemp = "25°C";
          toast.success(`${machineName} maintenance completed!`);
        }
        return { ...machine, status: newStatus, temp: newTemp };
      }
      return machine;
    }));
  };

  const startMaintenance = (machineName: string) => {
    setMachines(machines.map(machine => {
      if (machine.name === machineName) {
        return { ...machine, status: "Maintenance", temp: "-" };
      }
      return machine;
    }));
    toast.info(`${machineName} scheduled for maintenance`);
  };

  const refreshStats = () => {
    setStats({
      production: stats.production + Math.floor(Math.random() * 100),
      efficiency: Math.min(99, stats.efficiency + (Math.random() * 2 - 1)),
      quality: Math.min(99.9, stats.quality + (Math.random() * 0.5 - 0.25)),
      alerts: Math.max(0, stats.alerts + Math.floor(Math.random() * 3 - 1))
    });
    toast.success("Dashboard refreshed!");
  };

  const resolveAlert = () => {
    if (stats.alerts > 0) {
      setStats({ ...stats, alerts: stats.alerts - 1 });
      toast.success("Alert resolved successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-neutral-800 to-stone-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Factory className="h-8 w-8 text-amber-400" />
            <span className="text-xl font-bold text-white">FactoryPro</span>
            <Badge variant="outline" className="ml-2 text-amber-400 border-amber-400">by Software Vala</Badge>
          </div>
          <nav className="flex gap-1">
            {["Dashboard", "Production", "Inventory", "Quality"].map(tab => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "ghost"}
                className={activeTab === tab ? "bg-amber-600 hover:bg-amber-700" : "text-white/80 hover:text-amber-400 hover:bg-white/10"}
                onClick={() => {
                  setActiveTab(tab);
                  toast.info(`Switched to ${tab}`);
                }}
              >
                {tab}
              </Button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">{activeTab}</h1>
          <div className="flex gap-2">
            <Button onClick={refreshStats} variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
            <Button onClick={() => setShowOrderModal(true)} className="bg-amber-600 hover:bg-amber-700">
              <Plus className="h-4 w-4 mr-2" /> New Order
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors cursor-pointer" onClick={refreshStats}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Production Today</p>
                  <p className="text-2xl font-bold text-white">{stats.production.toLocaleString()}</p>
                </div>
                <Package className="h-8 w-8 text-amber-400" />
              </div>
              <p className="text-green-400 text-sm mt-2">+8.3% vs yesterday</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors cursor-pointer" onClick={refreshStats}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Efficiency</p>
                  <p className="text-2xl font-bold text-white">{stats.efficiency.toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
              <Progress value={stats.efficiency} className="mt-2" />
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors cursor-pointer" onClick={refreshStats}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Quality Pass</p>
                  <p className="text-2xl font-bold text-white">{stats.quality.toFixed(1)}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-400" />
              </div>
              <p className="text-emerald-400 text-sm mt-2">Above target</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors cursor-pointer" onClick={resolveAlert}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Alerts</p>
                  <p className="text-2xl font-bold text-white">{stats.alerts}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-400" />
              </div>
              <p className="text-yellow-400 text-sm mt-2">Click to resolve</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Production Orders */}
          <Card className="bg-white/10 border-white/20 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Production Orders</CardTitle>
              <Button size="sm" onClick={() => setShowOrderModal(true)} className="bg-amber-600 hover:bg-amber-700">
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white font-medium">{order.product}</p>
                        <p className="text-white/60 text-sm">{order.id} • Qty: {order.qty.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                          <SelectTrigger className={`w-32 h-7 text-xs ${
                            order.status === "Completed" ? "bg-green-600 border-green-600" :
                            order.status === "In Progress" ? "bg-amber-600 border-amber-600" :
                            order.status === "Quality Check" ? "bg-blue-600 border-blue-600" : "bg-gray-600 border-gray-600"
                          } text-white`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Quality Check">Quality Check</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-white/60 hover:text-red-400" onClick={() => deleteOrder(order.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={order.progress} className="flex-1" />
                      <span className="text-white/60 text-sm w-12">{order.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Machine Status */}
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Machine Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {machines.map((machine, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => toggleMachine(machine.name)}
                    >
                      {machine.status === "Running" ? (
                        <Pause className="h-5 w-5 text-green-400" />
                      ) : machine.status === "Maintenance" ? (
                        <Settings className="h-5 w-5 text-yellow-400 animate-spin" />
                      ) : (
                        <Play className="h-5 w-5 text-gray-400" />
                      )}
                    </Button>
                    <div>
                      <p className="text-white text-sm">{machine.name}</p>
                      <p className="text-white/50 text-xs">{machine.temp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={
                      machine.status === "Running" ? "border-green-400 text-green-400" :
                      machine.status === "Idle" ? "border-gray-400 text-gray-400" : "border-yellow-400 text-yellow-400"
                    }>{machine.status}</Badge>
                    {machine.status !== "Maintenance" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-white/40 hover:text-yellow-400"
                        onClick={() => startMaintenance(machine.name)}
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button className="w-full bg-amber-600 hover:bg-amber-700 mt-4" onClick={() => toast.success("All machines synced!")}>
                Sync All Machines
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* New Order Modal */}
      <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
        <DialogContent className="bg-zinc-900 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Create New Production Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Product Name</Label>
              <Input
                placeholder="e.g., Steel Rods"
                value={newOrder.product}
                onChange={(e) => setNewOrder({ ...newOrder, product: e.target.value })}
                className="bg-white/10 border-white/20 text-white mt-1"
              />
            </div>
            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                placeholder="e.g., 5000"
                value={newOrder.qty}
                onChange={(e) => setNewOrder({ ...newOrder, qty: e.target.value })}
                className="bg-white/10 border-white/20 text-white mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOrderModal(false)} className="border-white/20 text-white">Cancel</Button>
            <Button onClick={handleAddOrder} className="bg-amber-600 hover:bg-amber-700">Create Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="mt-12 py-6 border-t border-white/10 text-center text-white/60">
        <p>© 2025 Software Vala - The Name of Trust. All rights reserved.</p>
      </footer>
    </div>
  );
}

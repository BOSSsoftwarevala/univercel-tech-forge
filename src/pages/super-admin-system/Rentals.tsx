import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Key, Plus, Clock, MoreVertical, Play, Pause, RefreshCw,
  Trash2, Search, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SuperAdminWireframeLayout from "@/components/super-admin-wireframe/SuperAdminWireframeLayout";

interface Rental {
  id: string;
  feature: string;
  plan: string;
  assignedTo: string;
  startDate: string;
  endDate: string;
  usagePercent: number;
  status: "active" | "expiring" | "expired";
}

const rentals: Rental[] = [
  { id: "RNT-001", feature: "Premium Analytics", plan: "Monthly", assignedTo: "USR-123", startDate: "2024-03-01", endDate: "2024-04-01", usagePercent: 67, status: "active" },
  { id: "RNT-002", feature: "API Access Pro", plan: "Yearly", assignedTo: "USR-456", startDate: "2024-01-15", endDate: "2025-01-15", usagePercent: 25, status: "active" },
  { id: "RNT-003", feature: "Advanced Reporting", plan: "Monthly", assignedTo: "USR-789", startDate: "2024-03-10", endDate: "2024-04-10", usagePercent: 89, status: "expiring" },
  { id: "RNT-004", feature: "AI Assistant", plan: "Quarterly", assignedTo: "USR-012", startDate: "2024-02-01", endDate: "2024-05-01", usagePercent: 45, status: "active" },
  { id: "RNT-005", feature: "White Label", plan: "Yearly", assignedTo: "USR-345", startDate: "2023-12-01", endDate: "2024-12-01", usagePercent: 30, status: "active" },
  { id: "RNT-006", feature: "Priority Support", plan: "Monthly", assignedTo: "USR-678", startDate: "2024-02-15", endDate: "2024-03-15", usagePercent: 100, status: "expired" },
];

const SuperAdminRentals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  const statusColors = {
    active: "bg-neon-green/20 text-neon-green border-neon-green/50",
    expiring: "bg-neon-orange/20 text-neon-orange border-neon-orange/50",
    expired: "bg-destructive/20 text-destructive border-destructive/50",
  };

  const filteredRentals = rentals.filter(rental =>
    rental.feature.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rental.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rental.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SuperAdminWireframeLayout activeSection="rentals">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Rental Management</h1>
            <p className="text-muted-foreground">Manage feature rentals and assignments</p>
          </div>
          <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Assign Rental
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-panel">
              <DialogHeader>
                <DialogTitle>Assign New Rental</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Feature</label>
                  <Input placeholder="Select feature" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Plan</label>
                  <Input placeholder="Select plan" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Assign To (User ID)</label>
                  <Input placeholder="USR-XXX" />
                </div>
                <Button className="w-full" onClick={() => setAssignDialogOpen(false)}>
                  Assign Rental
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card className="glass-panel">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search rentals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Rentals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRentals.map((rental, index) => (
            <motion.div
              key={rental.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="glass-panel">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{rental.feature}</CardTitle>
                      <p className="text-sm text-muted-foreground font-mono">{rental.id}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <RefreshCw className="w-4 h-4 mr-2" /> Extend
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pause className="w-4 h-4 mr-2" /> Suspend
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" /> Revoke
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">{rental.plan}</Badge>
                    <Badge className={statusColors[rental.status]} variant="outline">
                      {rental.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Usage</span>
                      <span className="font-medium">{rental.usagePercent}%</span>
                    </div>
                    <Progress value={rental.usagePercent} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Assigned To</p>
                      <p className="font-mono">{rental.assignedTo}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Expires</p>
                      <p className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {rental.endDate}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </SuperAdminWireframeLayout>
  );
};

export default SuperAdminRentals;

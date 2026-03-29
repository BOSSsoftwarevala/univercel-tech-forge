import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Unlock, User, Globe, Box, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import SuperAdminWireframeLayout from "@/components/super-admin-wireframe/SuperAdminWireframeLayout";
import { toast } from "sonner";

const lockOptions = [
  { id: "user", label: "Lock User", icon: User, description: "Prevent specific user access" },
  { id: "region", label: "Lock Region", icon: Globe, description: "Disable access for entire region" },
  { id: "module", label: "Lock Module", icon: Box, description: "Disable system module" },
];

const initialActiveLocks = [
  { id: "LCK-001", type: "User", target: "USR-789", reason: "Suspicious activity investigation", lockedBy: "SA-001", lockedAt: "2024-03-15 10:30" },
  { id: "LCK-002", type: "Region", target: "Africa/Egypt", reason: "Regulatory compliance", lockedBy: "SA-002", lockedAt: "2024-03-14 08:00" },
];

interface LockData {
  id: string;
  type: string;
  target: string;
  reason: string;
  lockedBy: string;
  lockedAt: string;
}

const SuperAdminSystemLock = () => {
  const [activeLocks, setActiveLocks] = useState<LockData[]>(initialActiveLocks);
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);
  const [targetId, setTargetId] = useState("");
  const [lockReason, setLockReason] = useState("");

  const handleApplyLock = (lockType: string) => {
    if (!targetId.trim()) {
      toast.error("Please enter a target ID");
      return;
    }
    if (!lockReason.trim()) {
      toast.error("Please provide a reason for this lock");
      return;
    }
    
    const newLock: LockData = {
      id: `LCK-${String(activeLocks.length + 1).padStart(3, '0')}`,
      type: lockType,
      target: targetId,
      reason: lockReason,
      lockedBy: "SA-CURRENT",
      lockedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };
    
    setActiveLocks(prev => [...prev, newLock]);
    toast.success(`${lockType} lock applied successfully`);
    setTargetId("");
    setLockReason("");
    setDialogOpen(null);
  };

  const handleReleaseLock = (lockId: string) => {
    setActiveLocks(prev => prev.filter(lock => lock.id !== lockId));
    toast.success("Lock released successfully");
  };

  return (
    <SuperAdminWireframeLayout activeSection="system-lock">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">System Lock Control</h1>
          <p className="text-muted-foreground">Apply and release system locks</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {lockOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.div key={option.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Dialog open={dialogOpen === option.id} onOpenChange={(open) => {
                  if (open) {
                    setDialogOpen(option.id);
                  } else {
                    setDialogOpen(null);
                    setTargetId("");
                    setLockReason("");
                  }
                }}>
                  <DialogTrigger asChild>
                    <Card className="glass-panel cursor-pointer hover:border-destructive/50 transition-all">
                      <CardContent className="p-6 text-center">
                        <div className="mx-auto w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
                          <Icon className="w-7 h-7 text-destructive" />
                        </div>
                        <h3 className="font-semibold">{option.label}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="glass-panel">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                        {option.label}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Target ID</label>
                        <Input 
                          placeholder="Enter target ID" 
                          value={targetId}
                          onChange={(e) => setTargetId(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Reason (Required)</label>
                        <Textarea 
                          placeholder="Provide detailed reason for this lock..." 
                          rows={3}
                          value={lockReason}
                          onChange={(e) => setLockReason(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-3">
                        <DialogClose asChild>
                          <Button variant="outline" className="flex-1">Cancel</Button>
                        </DialogClose>
                        <Button 
                          className="flex-1 bg-destructive hover:bg-destructive/90"
                          onClick={() => handleApplyLock(option.label.replace('Lock ', ''))}
                        >
                          <Lock className="w-4 h-4 mr-2" />Apply Lock
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </motion.div>
            );
          })}
        </div>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Active Locks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeLocks.map((lock) => (
                <div key={lock.id} className="p-4 bg-secondary/30 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{lock.type}</Badge>
                      <span className="font-mono">{lock.target}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{lock.reason}</p>
                    <p className="text-xs text-muted-foreground mt-1">By {lock.lockedBy} at {lock.lockedAt}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="text-neon-green hover:text-neon-green"
                    onClick={() => handleReleaseLock(lock.id)}
                  >
                    <Unlock className="w-4 h-4 mr-2" />Release
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SuperAdminWireframeLayout>
  );
};

export default SuperAdminSystemLock;

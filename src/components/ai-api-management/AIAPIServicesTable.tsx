import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Play, Square, Plus, Trash2, CreditCard, AlertTriangle,
  Search, RefreshCw, Pause, RotateCcw, CheckCircle2, Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAIAPIManagement, APIService } from "@/hooks/useAIAPIManagement";
import { useEnterpriseAudit } from "@/hooks/useEnterpriseAudit";

export const AIAPIServicesTable = () => {
  const {
    services,
    loading,
    fetchServices,
    runService,
    stopService,
    pauseService,
    restartService,
    deleteService,
    addService,
    updateBillingStatus,
  } = useAIAPIManagement();
  
  const { logButtonClick } = useEnterpriseAudit();
  const [search, setSearch] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newService, setNewService] = useState({ name: '', provider: '', type: 'api', endpoint: '' });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.type.toLowerCase().includes(search.toLowerCase()) ||
    s.provider.toLowerCase().includes(search.toLowerCase())
  );

  const handleRun = async (service: APIService) => {
    setActionLoading(service.id);
    await logButtonClick('btn_api_run', 'Run Service', 'ai_system', { service_id: service.id });
    await runService(service.id);
    setActionLoading(null);
  };

  const handleStop = async (service: APIService) => {
    setActionLoading(service.id);
    await logButtonClick('btn_api_stop', 'Stop Service', 'ai_system', { service_id: service.id });
    await stopService(service.id, 'Manual stop');
    setActionLoading(null);
  };

  const handlePause = async (service: APIService) => {
    setActionLoading(service.id);
    await logButtonClick('btn_api_pause', 'Pause Service', 'ai_system', { service_id: service.id });
    await pauseService(service.id);
    setActionLoading(null);
  };

  const handleRestart = async (service: APIService) => {
    setActionLoading(service.id);
    await logButtonClick('btn_api_restart', 'Restart Service', 'ai_system', { service_id: service.id });
    await restartService(service.id);
    setActionLoading(null);
  };

  const handleDelete = async (service: APIService) => {
    setActionLoading(service.id);
    await logButtonClick('btn_api_delete', 'Delete Service', 'ai_system', { service_id: service.id });
    await deleteService(service.id, true); // Requires approval
    setActionLoading(null);
  };

  const handleToggleBilling = async (service: APIService) => {
    setActionLoading(service.id);
    await logButtonClick('btn_api_billing', 'Toggle Billing', 'ai_system', { service_id: service.id });
    const newStatus = service.billing_status === 'paid' ? 'unpaid' : 'paid';
    await updateBillingStatus(service.id, newStatus);
    setActionLoading(null);
  };

  const handleAddService = async () => {
    if (!newService.name || !newService.provider) return;
    await logButtonClick('btn_api_add', 'Add Service', 'ai_system', { name: newService.name });
    await addService(newService);
    setNewService({ name: '', provider: '', type: 'api', endpoint: '' });
    setShowAddDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/50';
      case 'paused': return 'bg-amber-500/10 text-amber-400 border-amber-500/50';
      case 'stopped': return 'bg-slate-500/10 text-slate-400 border-slate-500/50';
      case 'error': return 'bg-red-500/10 text-red-400 border-red-500/50';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/50';
    }
  };

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-foreground">All AI & API Services</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-64 bg-muted/20 border-border/50"
              />
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => fetchServices()}
              disabled={loading}
            >
              <RefreshCw className={cn("w-4 h-4 mr-1", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button 
              size="sm" 
              className="bg-primary hover:bg-primary/90"
              onClick={() => setShowAddDialog(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading && services.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading services...</span>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No API services configured</p>
            <Button 
              variant="link" 
              className="mt-2"
              onClick={() => setShowAddDialog(true)}
            >
              Add your first service
            </Button>
          </div>
        ) : (
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/20 hover:bg-muted/20">
                  <TableHead className="text-xs">Service</TableHead>
                  <TableHead className="text-xs">Type</TableHead>
                  <TableHead className="text-xs">Provider</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Billing</TableHead>
                  <TableHead className="text-xs">Usage</TableHead>
                  <TableHead className="text-xs">Cost/mo</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id} className="hover:bg-muted/10">
                    <TableCell className="font-medium text-foreground">{service.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "text-[10px]",
                        service.type === 'ai' ? "text-violet-400 border-violet-500/50" : "text-blue-400 border-blue-500/50"
                      )}>
                        {service.type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">{service.provider}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-[10px]", getStatusColor(service.status))}>
                        {service.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "text-[10px]",
                        service.billing_status === 'paid' 
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/50" 
                          : "bg-amber-500/10 text-amber-400 border-amber-500/50"
                      )}>
                        {service.billing_status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {service.usage_count.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-emerald-400 text-xs font-medium">
                      ${service.monthly_cost.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {actionLoading === service.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        ) : (
                          <>
                            {/* RUN / STOP */}
                            {service.status === 'running' ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-amber-400 hover:bg-amber-500/20"
                                onClick={() => handleStop(service)}
                                title="Stop"
                              >
                                <Square className="w-3.5 h-3.5" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-emerald-400 hover:bg-emerald-500/20"
                                onClick={() => handleRun(service)}
                                title="Run"
                              >
                                <Play className="w-3.5 h-3.5" />
                              </Button>
                            )}

                            {/* PAUSE */}
                            {service.status === 'running' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-orange-400 hover:bg-orange-500/20"
                                onClick={() => handlePause(service)}
                                title="Pause"
                              >
                                <Pause className="w-3.5 h-3.5" />
                              </Button>
                            )}

                            {/* RESTART */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-blue-400 hover:bg-blue-500/20"
                              onClick={() => handleRestart(service)}
                              title="Restart"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </Button>

                            {/* BILLING */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "h-7 w-7",
                                service.billing_status === 'paid' 
                                  ? "text-blue-400 hover:bg-blue-500/20" 
                                  : "text-amber-400 hover:bg-amber-500/20"
                              )}
                              onClick={() => handleToggleBilling(service)}
                              title={service.billing_status === 'paid' ? 'Mark Unpaid' : 'Mark Paid'}
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                            </Button>

                            {/* DELETE */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-red-400 hover:bg-red-500/20"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-card border-border">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete {service.name}?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will soft-delete the service. All logs will be preserved.
                                    This action requires Boss approval for critical services.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive hover:bg-destructive/90"
                                    onClick={() => handleDelete(service)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Add Service Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Add New API Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                value={newService.name}
                onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., GPT-4 Turbo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Input
                id="provider"
                value={newService.provider}
                onChange={(e) => setNewService(prev => ({ ...prev, provider: e.target.value }))}
                placeholder="e.g., OpenAI"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                value={newService.type}
                onChange={(e) => setNewService(prev => ({ ...prev, type: e.target.value }))}
                placeholder="e.g., ai, api, payment"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endpoint">Endpoint (optional)</Label>
              <Input
                id="endpoint"
                value={newService.endpoint}
                onChange={(e) => setNewService(prev => ({ ...prev, endpoint: e.target.value }))}
                placeholder="https://api.example.com/v1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddService} disabled={!newService.name || !newService.provider}>
              <Plus className="w-4 h-4 mr-1" />
              Add Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

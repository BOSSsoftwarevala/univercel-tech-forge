import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Plus,
  Edit,
  Trash2,
  Link,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Activity,
  ExternalLink,
  Bell,
  ShieldX,
  FileText
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useDemoManagerAccess } from "@/hooks/useDemoManagerAccess";
import { DemoReportCardsList } from "@/components/demo-manager/DemoReportCard";
import { DemoAccessGate } from "@/components/demo-manager/DemoAccessGate";
import { isDemoTestMode } from "@/contexts/DemoTestModeContext";

interface Demo {
  id: string;
  title: string;
  url: string;
  description: string | null;
  status: string;
  category: string;
  created_at: string;
}

interface DemoAlert {
  id: string;
  demo_id: string;
  alert_type: string;
  message: string;
  is_active: boolean;
  created_at: string;
}

interface DemoLog {
  id: string;
  demo_id: string;
  action: string;
  details: string;
  created_at: string;
}

export default function DemoManagerPanel() {
  const [demos, setDemos] = useState<Demo[]>([]);
  const [alerts, setAlerts] = useState<DemoAlert[]>([]);
  const [logs, setLogs] = useState<DemoLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingDemo, setEditingDemo] = useState<Demo | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    category: 'general'
  });

  const { 
    isDemoManager, 
    canAccessDemos, 
    isLoading: accessLoading,
    createReportCard, 
    logUnauthorizedAttempt,
    reportCards,
    fetchReportCards,
    updateWorkflowStatus
  } = useDemoManagerAccess();

  const fetchDemos = async () => {
    setLoading(true);
    try {
      const { data: demosData } = await supabase
        .from('demos')
        .select('id, title, url, description, status, category, created_at')
        .order('created_at', { ascending: false });

      const { data: alertsData } = await supabase
        .from('demo_alerts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20);

      setDemos((demosData as Demo[]) || []);
      setAlerts(alertsData || []);
    } catch (err) {
      console.error('Failed to fetch demos:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDemoLogs = async () => {
    try {
      const { data } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('module', 'demo')
        .order('timestamp', { ascending: false })
        .limit(50);

      const metaJson = (meta: unknown): { demo_id?: string } => {
        if (meta && typeof meta === 'object' && 'demo_id' in meta) {
          return meta as { demo_id?: string };
        }
        return {};
      };
      
      setLogs((data || []).map(d => ({
        id: d.id,
        demo_id: metaJson(d.meta_json).demo_id || '',
        action: d.action,
        details: JSON.stringify(d.meta_json),
        created_at: d.timestamp
      })));
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    }
  };

  useEffect(() => {
    fetchDemos();
    fetchDemoLogs();
    fetchReportCards();
  }, [fetchReportCards]);

  useEffect(() => {
    // Skip realtime alerts in test mode - no interruptions
    if (isDemoTestMode()) return;
    
    const channel = supabase
      .channel('demo-alerts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'demo_alerts' },
        (payload) => {
          const newAlert = payload.new as DemoAlert;
          setAlerts(prev => [newAlert, ...prev]);
          toast.warning(`Demo Alert: ${newAlert.message}`, {
            icon: <Bell className="w-4 h-4" />
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSaveDemo = async () => {
    // Block non-demo-managers
    if (!isDemoManager) {
      await logUnauthorizedAttempt(editingDemo ? 'edit' : 'add', editingDemo?.id);
      return;
    }

    try {
      const oldValues = editingDemo ? { ...editingDemo } : null;
      
      if (editingDemo) {
        const { error } = await supabase
          .from('demos')
          .update({
            title: formData.title,
            url: formData.url,
            description: formData.description,
            category: formData.category
          })
          .eq('id', editingDemo.id);

        if (error) throw error;
        
        // Auto-create report card
        await createReportCard({
          demoId: editingDemo.id,
          demoName: formData.title,
          actionType: 'edit',
          sector: formData.category,
          oldValues,
          newValues: formData
        });
        
        toast.success('Demo updated successfully');
      } else {
        const { data, error } = await supabase
          .from('demos')
          .insert({
            title: formData.title,
            url: formData.url,
            description: formData.description,
            category: formData.category,
            status: 'active'
          })
          .select('id')
          .single();

        if (error) throw error;
        
        // Auto-create report card
        await createReportCard({
          demoId: data.id,
          demoName: formData.title,
          actionType: 'add',
          sector: formData.category,
          demoStatus: 'active',
          newValues: formData
        });
        
        toast.success('Demo created successfully');
      }

      setShowAddDialog(false);
      setEditingDemo(null);
      setFormData({ title: '', url: '', description: '', category: 'general' });
      fetchDemos();
      fetchReportCards();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save demo');
    }
  };

  const handleDeleteDemo = async (id: string, title: string) => {
    if (!isDemoManager) {
      await logUnauthorizedAttempt('delete', id);
      return;
    }
    
    if (!confirm('Are you sure you want to delete this demo?')) return;

    try {
      const { error } = await supabase
        .from('demos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Auto-create report card
      await createReportCard({
        demoId: id,
        demoName: title,
        actionType: 'delete'
      });
      
      toast.success('Demo deleted');
      fetchDemos();
      fetchReportCards();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete demo');
    }
  };

  const checkDemoHealth = async (demo: Demo) => {
    toast.info(`Checking health of ${demo.title}...`);
    try {
      await fetch(demo.url, { mode: 'no-cors' });
      toast.success(`${demo.title} is accessible`);
    } catch (err) {
      toast.error(`${demo.title} may be down`);
      await supabase.from('demo_alerts').insert({
        demo_id: demo.id,
        alert_type: 'health_check_failed',
        message: `Health check failed for ${demo.title}`,
        is_active: true
      });
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      await supabase
        .from('demo_alerts')
        .update({ is_active: false })
        .eq('id', alertId);

      setAlerts(prev => prev.filter(a => a.id !== alertId));
      toast.success('Alert acknowledged');
    } catch (err) {
      toast.error('Failed to acknowledge alert');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400">Active</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-500/20 text-yellow-400">Maintenance</Badge>;
      case 'down':
        return <Badge className="bg-red-500/20 text-red-400">Down</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Demo Manager</h2>
          <p className="text-muted-foreground">
            Manage demos, fix broken links, view alerts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchDemos}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingDemo(null);
                setFormData({ title: '', url: '', description: '', category: 'general' });
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Demo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingDemo ? 'Edit Demo' : 'Add New Demo'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Demo title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL</Label>
                  <Input
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://demo.example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Demo description"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="general"
                  />
                </div>
                <Button onClick={handleSaveDemo} className="w-full">
                  {editingDemo ? 'Update Demo' : 'Create Demo'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Alerts Banner */}
      {alerts.length > 0 && (
        <Card className="border-yellow-500/50 bg-yellow-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-yellow-400">
              <AlertTriangle className="w-5 h-5" />
              Active Alerts ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-2 rounded bg-background/50">
                  <div>
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(alert.created_at), 'MMM d, h:mm a')}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => acknowledgeAlert(alert.id)}>
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="demos">
        <TabsList>
          <TabsTrigger value="demos">Demos ({demos.length})</TabsTrigger>
          <TabsTrigger value="report-cards">Report Cards ({reportCards.length})</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="demos" className="mt-4">
          <div className="grid gap-4">
            {demos.map((demo) => (
              <Card key={demo.id} className="bg-card/50">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{demo.title}</h3>
                        {getStatusBadge(demo.status)}
                        <Badge variant="outline" className="text-muted-foreground">
                          {demo.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{demo.description}</p>
                      <a
                        href={demo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary flex items-center gap-1 hover:underline"
                      >
                        <Link className="w-3 h-3" />
                        {demo.url}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => checkDemoHealth(demo)}
                        title="Check Health"
                      >
                        <Activity className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingDemo(demo);
                          setFormData({
                            title: demo.title,
                            url: demo.url,
                            description: demo.description || '',
                            category: demo.category || 'general'
                          });
                          setShowAddDialog(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300"
                        onClick={() => {
                          handleDeleteDemo(demo.id, demo.title);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {demos.length === 0 && !loading && (
              <Card className="bg-card/50">
                <CardContent className="py-8 text-center text-muted-foreground">
                  No demos found. Add your first demo!
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          <Card>
            <CardContent className="pt-4">
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div key={log.id} className="p-3 rounded-lg bg-background/50 text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline">{log.action}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(log.created_at), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs font-mono">
                        {log.details}
                      </p>
                    </div>
                  ))}
                  {logs.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No activity logs yet
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="report-cards" className="mt-4">
          <DemoReportCardsList 
            reportCards={reportCards} 
            onUpdateStatus={updateWorkflowStatus}
            title="Demo Report Cards"
            maxHeight="500px"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

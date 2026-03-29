import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, Plus, Clock, ArrowUpRight, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { serverManagerAPI } from '@/hooks/useServerManagerAPI';

interface IncidentRecord {
  id: string;
  title: string;
  description: string;
  severity: 'p1' | 'p2' | 'p3' | 'p4';
  status: 'open' | 'investigating' | 'identified' | 'monitoring' | 'resolved';
  createdAt: string;
  updatedAt: string;
  affectedServices: string[];
  escalatedTo: string | null;
}

interface IncidentApiRow {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  created_at: string | null;
  updated_at: string | null;
  escalated_to: string | null;
  server_instances?: {
    server_name?: string | null;
  } | null;
}

interface IncidentsResponse {
  incidents: IncidentApiRow[];
}

interface ServersResponse {
  servers: Array<{ id: string; server_name: string }>;
}

const priorityToSeverity = (priority: string): IncidentRecord['severity'] => {
  switch (priority) {
    case 'critical':
    case 'p1':
      return 'p1';
    case 'high':
    case 'p2':
      return 'p2';
    case 'low':
    case 'p4':
      return 'p4';
    default:
      return 'p3';
  }
};

const severityToPriority = (severity: IncidentRecord['severity']) => {
  switch (severity) {
    case 'p1':
      return 'critical';
    case 'p2':
      return 'high';
    case 'p4':
      return 'low';
    default:
      return 'medium';
  }
};

const normalizeIncidentStatus = (status: string): IncidentRecord['status'] => {
  if (status === 'resolved') return 'resolved';
  if (status === 'identified') return 'identified';
  if (status === 'monitoring') return 'monitoring';
  if (status === 'investigating') return 'investigating';
  return 'open';
};

export function SMIncidents() {
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [serverLookup, setServerLookup] = useState<Record<string, string>>({});
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newIncident, setNewIncident] = useState({
    title: '',
    description: '',
    severity: 'p3' as IncidentRecord['severity'],
    affectedServices: '',
  });

  const mapIncidents = (rows: IncidentApiRow[]) =>
    rows.map((incident) => ({
      id: incident.id,
      title: incident.title,
      description: incident.description || 'No description provided.',
      severity: priorityToSeverity(incident.priority),
      status: normalizeIncidentStatus(incident.status),
      createdAt: incident.created_at || '',
      updatedAt: incident.updated_at || incident.created_at || '',
      affectedServices: incident.server_instances?.server_name ? [incident.server_instances.server_name] : [],
      escalatedTo: incident.escalated_to,
    }));

  useEffect(() => {
    let cancelled = false;

    const loadIncidents = async () => {
      try {
        const [incidentData, serverData] = await Promise.all([
          serverManagerAPI.getIncidents() as Promise<IncidentsResponse>,
          serverManagerAPI.getServers() as Promise<ServersResponse>,
        ]);

        if (cancelled) {
          return;
        }

        setServerLookup(Object.fromEntries((serverData.servers || []).map((server) => [server.server_name.toLowerCase(), server.id])));
        setIncidents(mapIncidents(incidentData.incidents || []));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load incidents');
      }
    };

    void loadIncidents();

    return () => {
      cancelled = true;
    };
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'p1':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'p2':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'p3':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'p4':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-500/20 text-red-400';
      case 'investigating':
        return 'bg-orange-500/20 text-orange-400';
      case 'identified':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'monitoring':
        return 'bg-blue-500/20 text-blue-400';
      case 'resolved':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleCreateIncident = async () => {
    if (!newIncident.title || !newIncident.description) {
      toast.error('Title and description are required');
      return;
    }

    try {
      const firstService = newIncident.affectedServices
        .split(',')
        .map((value) => value.trim())
        .find(Boolean);

      await serverManagerAPI.createIncident({
        title: newIncident.title,
        description: newIncident.description,
        priority: severityToPriority(newIncident.severity),
        server_id: firstService ? serverLookup[firstService.toLowerCase()] : undefined,
      });

      const refreshed = await serverManagerAPI.getIncidents() as IncidentsResponse;
      setIncidents(mapIncidents(refreshed.incidents || []));
      setShowCreateDialog(false);
      setNewIncident({ title: '', description: '', severity: 'p3', affectedServices: '' });
      toast.success('Incident created');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create incident');
    }
  };

  const handleEscalate = async (incidentId: string, target: 'admin' | 'super_admin') => {
    try {
      await serverManagerAPI.escalateIncident(incidentId, target);
      setIncidents((current) =>
        current.map((incident) =>
          incident.id === incidentId
            ? {
                ...incident,
                escalatedTo: target,
              }
            : incident,
        ),
      );
      toast.success(`Incident escalated to ${target.toUpperCase()}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to escalate incident');
    }
  };

  const handleUpdateStatus = async (incidentId: string, newStatus: IncidentRecord['status']) => {
    if (newStatus === 'resolved') {
      toast.error('Resolved incidents require formal review and separate closure notes.');
      return;
    }

    try {
      await serverManagerAPI.updateIncidentStatus(incidentId, newStatus);
      setIncidents((current) =>
        current.map((incident) =>
          incident.id === incidentId
            ? {
                ...incident,
                status: newStatus,
                updatedAt: new Date().toISOString(),
              }
            : incident,
        ),
      );
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update incident status');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          Incidents
        </h2>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Create Incident
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Create New Incident</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Incident title" value={newIncident.title} onChange={(event) => setNewIncident({ ...newIncident, title: event.target.value })} />
              <Textarea placeholder="Detailed description" value={newIncident.description} onChange={(event) => setNewIncident({ ...newIncident, description: event.target.value })} />
              <Select value={newIncident.severity} onValueChange={(value) => setNewIncident({ ...newIncident, severity: value as IncidentRecord['severity'] })}>
                <SelectTrigger>
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="p1">P1 - Critical</SelectItem>
                  <SelectItem value="p2">P2 - High</SelectItem>
                  <SelectItem value="p3">P3 - Medium</SelectItem>
                  <SelectItem value="p4">P4 - Low</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Affected services (comma-separated)"
                value={newIncident.affectedServices}
                onChange={(event) => setNewIncident({ ...newIncident, affectedServices: event.target.value })}
              />
              <Button onClick={handleCreateIncident} className="w-full">
                Create Incident
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {incidents.map((incident) => (
          <Card key={incident.id} className="bg-card border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={getSeverityColor(incident.severity)}>{incident.severity.toUpperCase()}</Badge>
                  <span className="font-mono text-sm text-muted-foreground">{incident.id}</span>
                  <CardTitle className="text-base">{incident.title}</CardTitle>
                </div>
                <Badge className={getStatusColor(incident.status)}>{incident.status.toUpperCase()}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{incident.description}</p>

              <div className="flex flex-wrap gap-2 mb-3">
                {incident.affectedServices.map((service) => (
                  <Badge key={service} variant="outline" className="text-xs">
                    {service}
                  </Badge>
                ))}
                {!incident.affectedServices.length && (
                  <Badge variant="outline" className="text-xs">
                    Unassigned Service
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Created: {incident.createdAt || 'Unknown'}
                </div>

                <div className="flex items-center gap-2">
                  <Select value={incident.status} onValueChange={(value) => handleUpdateStatus(incident.id, value as IncidentRecord['status'])}>
                    <SelectTrigger className="h-8 text-xs w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="investigating">Investigating</SelectItem>
                      <SelectItem value="identified">Identified</SelectItem>
                      <SelectItem value="monitoring">Monitoring</SelectItem>
                      <SelectItem value="resolved" disabled>
                        Resolved (Review Required)
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {!incident.escalatedTo && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleEscalate(incident.id, 'admin')} className="text-xs">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        Escalate Admin
                      </Button>
                      {incident.severity === 'p1' && (
                        <Button size="sm" variant="destructive" onClick={() => handleEscalate(incident.id, 'super_admin')} className="text-xs">
                          <Bell className="h-3 w-3 mr-1" />
                          Escalate Super Admin
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {!incidents.length && (
          <Card className="bg-card border-border">
            <CardContent className="py-8 text-sm text-muted-foreground text-center">
              No active incidents.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
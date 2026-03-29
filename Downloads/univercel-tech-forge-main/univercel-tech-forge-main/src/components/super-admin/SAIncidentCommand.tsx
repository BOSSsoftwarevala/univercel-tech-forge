import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertOctagon, Siren, Plus, Snowflake, Users, Clock, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Incident {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'investigating' | 'resolved';
  declaredAt: Date;
  affectedModules: string[];
  assignedTeams: string[];
  frozenModules: string[];
}

interface SAIncidentCommandProps {
  onDeclare: (severity: string, description: string) => Promise<boolean>;
  onFreezeModule: (moduleId: string, reason: string) => Promise<boolean>;
}

const SAIncidentCommand = ({ onDeclare, onFreezeModule }: SAIncidentCommandProps) => {
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: 'INC-001',
      title: 'Payment Gateway Degradation',
      severity: 'high',
      status: 'investigating',
      declaredAt: new Date(Date.now() - 3600000),
      affectedModules: ['payments', 'withdrawals'],
      assignedTeams: ['Platform Team', 'Finance Ops'],
      frozenModules: ['withdrawals'],
    },
  ]);

  const [showDeclareDialog, setShowDeclareDialog] = useState(false);
  const [showFreezeDialog, setShowFreezeDialog] = useState(false);
  const [newIncident, setNewIncident] = useState({
    title: '',
    severity: 'medium' as const,
    description: '',
  });
  const [freezeTarget, setFreezeTarget] = useState({ module: '', reason: '' });
  const [processing, setProcessing] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-500/20 text-red-400';
      case 'investigating': return 'bg-amber-500/20 text-amber-400';
      case 'resolved': return 'bg-emerald-500/20 text-emerald-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleDeclareIncident = async () => {
    if (!newIncident.title || newIncident.description.length < 10) {
      toast.error('Title and description (min 10 chars) required');
      return;
    }

    setProcessing(true);
    const success = await onDeclare(newIncident.severity, newIncident.description);

    if (success) {
      setIncidents(prev => [{
        id: `INC-${String(prev.length + 1).padStart(3, '0')}`,
        title: newIncident.title,
        severity: newIncident.severity,
        status: 'active',
        declaredAt: new Date(),
        affectedModules: [],
        assignedTeams: [],
        frozenModules: [],
      }, ...prev]);
      setShowDeclareDialog(false);
      setNewIncident({ title: '', severity: 'medium', description: '' });
    }

    setProcessing(false);
  };

  const handleFreezeModule = async () => {
    if (!freezeTarget.module || freezeTarget.reason.length < 10) {
      toast.error('Module and reason (min 10 chars) required');
      return;
    }

    setProcessing(true);
    const success = await onFreezeModule(freezeTarget.module, freezeTarget.reason);

    if (success) {
      toast.warning(`Module ${freezeTarget.module} frozen`);
      setShowFreezeDialog(false);
      setFreezeTarget({ module: '', reason: '' });
    }

    setProcessing(false);
  };

  const availableModules = [
    'payments', 'withdrawals', 'user_registration', 
    'lead_assignments', 'commissions', 'reports'
  ];

  return (
    <>
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Siren className="w-5 h-5 text-red-400" />
              Incident Command Center
            </CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                onClick={() => setShowFreezeDialog(true)}
              >
                <Snowflake className="w-4 h-4 mr-1" />
                Freeze Module
              </Button>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => setShowDeclareDialog(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Declare Incident
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {incidents.map((incident, index) => (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-lg bg-background/50 border border-border/30"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <AlertOctagon className={`w-5 h-5 ${
                          incident.severity === 'critical' ? 'text-red-400' :
                          incident.severity === 'high' ? 'text-orange-400' :
                          'text-amber-400'
                        }`} />
                        <span className="font-medium">{incident.title}</span>
                        <Badge variant="outline" className={getSeverityColor(incident.severity)}>
                          {incident.severity}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(incident.status)}>
                          {incident.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-muted-foreground">Affected: </span>
                          {incident.affectedModules.map((mod, i) => (
                            <Badge key={i} variant="outline" className="text-xs ml-1">
                              {mod}
                            </Badge>
                          ))}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Frozen: </span>
                          {incident.frozenModules.map((mod, i) => (
                            <Badge key={i} variant="outline" className="text-xs ml-1 bg-blue-500/10 text-blue-400">
                              <Snowflake className="w-3 h-3 mr-1" />
                              {mod}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Declared {incident.declaredAt.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {incident.assignedTeams.join(', ')}
                        </span>
                      </div>
                    </div>
                    
                    <Button size="sm" variant="ghost">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {incidents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <AlertOctagon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No active incidents</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Declare Incident Dialog */}
      <Dialog open={showDeclareDialog} onOpenChange={setShowDeclareDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <Siren className="w-5 h-5" />
              Declare New Incident
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Incident Title</label>
              <Input
                placeholder="Brief incident title..."
                value={newIncident.title}
                onChange={(e) => setNewIncident(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Severity Level</label>
              <Select
                value={newIncident.severity}
                onValueChange={(v: any) => setNewIncident(prev => ({ ...prev, severity: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Description (min 10 chars)</label>
              <Textarea
                placeholder="Detailed incident description..."
                value={newIncident.description}
                onChange={(e) => setNewIncident(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeclareDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDeclareIncident}
              disabled={processing}
              className="bg-red-600 hover:bg-red-700"
            >
              {processing ? 'Declaring...' : 'Declare Incident'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Freeze Module Dialog */}
      <Dialog open={showFreezeDialog} onOpenChange={setShowFreezeDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-400">
              <Snowflake className="w-5 h-5" />
              Freeze Module
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Module</label>
              <Select
                value={freezeTarget.module}
                onValueChange={(v) => setFreezeTarget(prev => ({ ...prev, module: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select module to freeze..." />
                </SelectTrigger>
                <SelectContent>
                  {availableModules.map(mod => (
                    <SelectItem key={mod} value={mod}>
                      {mod.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Reason (min 10 chars)</label>
              <Textarea
                placeholder="Reason for freezing this module..."
                value={freezeTarget.reason}
                onChange={(e) => setFreezeTarget(prev => ({ ...prev, reason: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFreezeDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleFreezeModule}
              disabled={processing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {processing ? 'Freezing...' : 'Freeze Module'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SAIncidentCommand;

/**
 * MODEL REGISTRY SECTION
 * Internal vs External models, approval workflow, audit trail
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Boxes, Building, Globe, CheckCircle, Clock, XCircle, 
  Eye, ThumbsUp, ThumbsDown, FileText, Plus 
} from "lucide-react";
import { toast } from "sonner";

const registeredModels = [
  { name: 'GPT-4 Turbo', type: 'external', provider: 'OpenAI', version: '0125', status: 'approved', usage: 78 },
  { name: 'Claude 3 Opus', type: 'external', provider: 'Anthropic', version: '20240229', status: 'approved', usage: 65 },
  { name: 'Custom RAG v2', type: 'internal', provider: 'Internal', version: '2.1.0', status: 'approved', usage: 45 },
  { name: 'Gemini Ultra', type: 'external', provider: 'Google', version: '1.0', status: 'pending', usage: 0 },
  { name: 'Support Bot v3', type: 'internal', provider: 'Internal', version: '3.0.0', status: 'review', usage: 0 },
];

const approvalQueue = [
  { id: '1', model: 'Gemini Ultra', requestedBy: 'Admin', date: '2024-01-15', reason: 'Better multimodal capabilities', priority: 'high' },
  { id: '2', model: 'Mistral Large', requestedBy: 'DevTeam', date: '2024-01-14', reason: 'Cost optimization', priority: 'medium' },
  { id: '3', model: 'Custom NER v1', requestedBy: 'MLTeam', date: '2024-01-13', reason: 'Entity extraction', priority: 'low' },
];

const auditTrail = [
  { action: 'Model Approved', model: 'Claude 3 Opus', user: 'SuperAdmin', date: '2024-01-12 14:30', details: 'Security review passed' },
  { action: 'Model Rejected', model: 'Llama 2 70B', user: 'SuperAdmin', date: '2024-01-10 09:15', details: 'License incompatibility' },
  { action: 'Version Updated', model: 'GPT-4 Turbo', user: 'System', date: '2024-01-08 11:00', details: '0124 → 0125' },
  { action: 'Model Deprecated', model: 'GPT-3.5', user: 'SuperAdmin', date: '2024-01-05 16:45', details: 'End of support' },
];

export const ModelRegistrySection = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-500/20 text-emerald-400';
      case 'pending': return 'bg-amber-500/20 text-amber-400';
      case 'review': return 'bg-blue-500/20 text-blue-400';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Boxes className="w-5 h-5 text-violet-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">5</p>
            <p className="text-xs text-muted-foreground">Registered Models</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Building className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">2</p>
            <p className="text-xs text-muted-foreground">Internal Models</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Globe className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">3</p>
            <p className="text-xs text-muted-foreground">External Models</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Clock className="w-5 h-5 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">3</p>
            <p className="text-xs text-muted-foreground">Pending Approval</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Model Registry</CardTitle>
          <Button size="sm" variant="outline" onClick={() => toast.success('Register model dialog opened')}>
            <Plus className="w-3 h-3 mr-2" />
            Register Model
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {registeredModels.map((model, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {model.type === 'internal' ? (
                    <Building className="w-5 h-5 text-blue-400" />
                  ) : (
                    <Globe className="w-5 h-5 text-emerald-400" />
                  )}
                  <div>
                    <p className="font-medium text-white text-sm">{model.name}</p>
                    <p className="text-xs text-muted-foreground">{model.provider} • v{model.version}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {model.usage > 0 && (
                    <div className="w-24">
                      <Progress value={model.usage} className="h-1.5" />
                      <p className="text-[10px] text-muted-foreground text-right mt-0.5">{model.usage}% usage</p>
                    </div>
                  )}
                  <Badge variant="outline" className="text-[10px]">{model.type}</Badge>
                  <Badge className={getStatusBadge(model.status)}>{model.status}</Badge>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => toast.info('Viewing model details')}>
                    <Eye className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm">Approval Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {approvalQueue.map((req) => (
              <div key={req.id} className="p-3 rounded-lg bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-white text-sm">{req.model}</p>
                    <p className="text-xs text-muted-foreground">Requested by {req.requestedBy} on {req.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      req.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      req.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-slate-500/20 text-slate-400'
                    }>
                      {req.priority}
                    </Badge>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-emerald-400" onClick={() => toast.success(`${req.model} approved`)}>
                      <ThumbsUp className="w-3 h-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-red-400" onClick={() => toast.success(`${req.model} rejected`)}>
                      <ThumbsDown className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{req.reason}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm">Audit Trail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {auditTrail.map((entry, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {entry.action.includes('Approved') && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                  {entry.action.includes('Rejected') && <XCircle className="w-4 h-4 text-red-400" />}
                  {entry.action.includes('Updated') && <FileText className="w-4 h-4 text-blue-400" />}
                  {entry.action.includes('Deprecated') && <Clock className="w-4 h-4 text-amber-400" />}
                  <div>
                    <p className="font-medium text-white text-sm">{entry.action}: {entry.model}</p>
                    <p className="text-xs text-muted-foreground">{entry.details}</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  <p>{entry.user}</p>
                  <p>{entry.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

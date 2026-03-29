/**
 * FINE-TUNING / ADAPTERS SECTION
 * Custom datasets, training status, cost tracking
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Database, Cpu, DollarSign, Upload, Play, Square, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

const datasets = [
  { id: '1', name: 'Customer Support Logs', records: '125K', size: '245 MB', format: 'JSONL', status: 'ready' },
  { id: '2', name: 'Product Descriptions', records: '45K', size: '89 MB', format: 'CSV', status: 'ready' },
  { id: '3', name: 'Code Examples', records: '78K', size: '156 MB', format: 'JSONL', status: 'processing' },
];

const trainingJobs = [
  { id: '1', name: 'Support Agent v2', baseModel: 'GPT-4', status: 'running', progress: 67, cost: '$234', eta: '2h 15m' },
  { id: '2', name: 'Product Writer', baseModel: 'Claude 3', status: 'completed', progress: 100, cost: '$189', eta: '-' },
  { id: '3', name: 'Code Helper', baseModel: 'Llama 3', status: 'queued', progress: 0, cost: '$0', eta: '~4h' },
];

const adapters = [
  { name: 'LoRA-Support-v2', baseModel: 'GPT-4', params: '8M', accuracy: 94.2, deployed: true },
  { name: 'LoRA-Product-v1', baseModel: 'Claude 3', params: '4M', accuracy: 91.8, deployed: true },
  { name: 'LoRA-Code-v3', baseModel: 'Llama 3', params: '16M', accuracy: 88.5, deployed: false },
];

export const FineTuningSection = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Database className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">3</p>
            <p className="text-xs text-muted-foreground">Datasets</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Cpu className="w-5 h-5 text-violet-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">1</p>
            <p className="text-xs text-muted-foreground">Training</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">$423</p>
            <p className="text-xs text-muted-foreground">Total Cost</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Upload className="w-5 h-5 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">490 MB</p>
            <p className="text-xs text-muted-foreground">Data Size</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Custom Datasets</CardTitle>
          <Button size="sm" variant="outline" onClick={() => toast.success('Upload dialog opened')}>
            <Upload className="w-3 h-3 mr-2" />
            Upload Dataset
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {datasets.map((ds) => (
              <div key={ds.id} className="p-3 rounded-lg bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Database className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="font-medium text-white text-sm">{ds.name}</p>
                    <p className="text-xs text-muted-foreground">{ds.records} records • {ds.size} • {ds.format}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={ds.status === 'ready' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}>
                    {ds.status}
                  </Badge>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-red-400" onClick={() => toast.success('Dataset deleted')}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Training Jobs</CardTitle>
          <Button size="sm" variant="outline" onClick={() => toast.success('New training job created')}>
            <Play className="w-3 h-3 mr-2" />
            New Job
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trainingJobs.map((job) => (
              <div key={job.id} className="p-3 rounded-lg bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-white text-sm">{job.name}</p>
                    <p className="text-xs text-muted-foreground">Base: {job.baseModel}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-emerald-400">{job.cost}</span>
                    <span className="text-xs text-muted-foreground">ETA: {job.eta}</span>
                    <Badge className={
                      job.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                      job.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-slate-500/20 text-slate-400'
                    }>
                      {job.status}
                    </Badge>
                    {job.status === 'running' && (
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-amber-400" onClick={() => toast.success('Training stopped')}>
                        <Square className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
                {job.status !== 'queued' && <Progress value={job.progress} className="h-1.5" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm">Trained Adapters (LoRA)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {adapters.map((adapter, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-white text-sm">{adapter.name}</p>
                  <Badge className={adapter.deployed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}>
                    {adapter.deployed ? 'Deployed' : 'Inactive'}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Base: {adapter.baseModel}</p>
                  <p>Parameters: {adapter.params}</p>
                  <p>Accuracy: <span className="text-emerald-400">{adapter.accuracy}%</span></p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

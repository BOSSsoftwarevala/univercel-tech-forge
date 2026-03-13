import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingDown, Play, RotateCcw } from 'lucide-react';
import {
  getOptimizationRecommendations,
  switchModel,
  rollbackModelSwitch,
  simulateCostChange,
  getModelSwitchHistory,
} from '@/routes/optimizer';

interface Recommendation {
  serviceId: string;
  currentModel: string;
  suggestedModel: string;
  estimatedSavingsPercent: number;
  reason: string;
}

interface SwitchHistory {
  id: string;
  service_id: string;
  previous_model: string;
  new_model: string;
  reason: string;
  created_at: string;
}

interface SimResult {
  currentModel: string;
  newModel: string;
  avgDailyTokens: number;
  currentDailyCost: number;
  newDailyCost: number;
  savingsPerDay: number;
  savingsPercent: number;
}

interface Props {
  tenantId: string;
}

export default function CostOptimizer({ tenantId }: Props) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [history, setHistory] = useState<SwitchHistory[]>([]);
  const [simResult, setSimResult] = useState<SimResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error: err } = await getOptimizationRecommendations(tenantId);
    if (err) { setError(err.message); setLoading(false); return; }
    setRecommendations(data);

    if (data.length > 0) {
      const { data: h } = await getModelSwitchHistory(tenantId, data[0].serviceId);
      setHistory((h ?? []) as SwitchHistory[]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [tenantId]);

  const handleApply = async (rec: Recommendation) => {
    setApplying(rec.serviceId);
    await switchModel(tenantId, rec.serviceId, rec.suggestedModel, rec.reason);
    setApplying(null);
    load();
  };

  const handleRollback = async (h: SwitchHistory) => {
    await rollbackModelSwitch(tenantId, h.service_id);
    load();
  };

  const handleSimulate = (rec: Recommendation) => {
    const result = simulateCostChange(rec.currentModel, rec.suggestedModel, 100000);
    setSimResult(result);
  };

  if (loading) return (
    <Card><CardContent className="p-6 space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</CardContent></Card>
  );
  if (error) return <Card><CardContent className="p-6 text-red-500">Error: {error}</CardContent></Card>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Cost Optimizer</h2>

      {simResult && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader><CardTitle className="text-green-800 flex items-center gap-2"><TrendingDown className="w-5 h-5" />Cost Simulation Result</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><p className="text-muted-foreground">Current Model</p><p className="font-semibold">{simResult.currentModel}</p></div>
              <div><p className="text-muted-foreground">New Model</p><p className="font-semibold">{simResult.newModel}</p></div>
              <div><p className="text-muted-foreground">Daily Savings</p><p className="font-semibold text-green-700">${simResult.savingsPerDay.toFixed(4)}</p></div>
              <div><p className="text-muted-foreground">Savings %</p><p className="font-semibold text-green-700">{simResult.savingsPercent}%</p></div>
            </div>
            <Button size="sm" variant="outline" className="mt-3" onClick={() => setSimResult(null)}>Dismiss</Button>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="recommendations">
        <TabsList>
          <TabsTrigger value="recommendations">Recommendations ({recommendations.length})</TabsTrigger>
          <TabsTrigger value="history">Switch History</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations">
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Service ID</TableHead>
                <TableHead>Current Model</TableHead>
                <TableHead>Suggested Model</TableHead>
                <TableHead>Est. Savings</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {recommendations.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No optimization recommendations</TableCell></TableRow>}
                {recommendations.map(rec => (
                  <TableRow key={rec.serviceId}>
                    <TableCell className="font-mono text-sm">{rec.serviceId}</TableCell>
                    <TableCell><Badge variant="secondary">{rec.currentModel}</Badge></TableCell>
                    <TableCell><Badge variant="default">{rec.suggestedModel}</Badge></TableCell>
                    <TableCell>
                      <span className="text-green-600 font-semibold">{rec.estimatedSavingsPercent}%</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-xs truncate">{rec.reason}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleSimulate(rec)}>Simulate</Button>
                        <Button size="sm" onClick={() => handleApply(rec)} disabled={applying === rec.serviceId}>
                          <Play className="w-3 h-3 mr-1" />{applying === rec.serviceId ? 'Applying…' : 'Apply'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="history">
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Previous</TableHead>
                <TableHead>New Model</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {history.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No switch history</TableCell></TableRow>}
                {history.map(h => (
                  <TableRow key={h.id}>
                    <TableCell className="font-mono text-sm">{h.service_id}</TableCell>
                    <TableCell><Badge variant="secondary">{h.previous_model}</Badge></TableCell>
                    <TableCell><Badge>{h.new_model}</Badge></TableCell>
                    <TableCell className="text-muted-foreground text-sm">{h.reason}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{new Date(h.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => handleRollback(h)}>
                        <RotateCcw className="w-3 h-3 mr-1" />Rollback
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

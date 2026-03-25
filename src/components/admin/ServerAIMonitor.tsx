import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { 
  Brain, Shield, Activity, AlertTriangle, CheckCircle, 
  RefreshCw, Server, Zap, FileSearch, Lock, TrendingUp
} from "lucide-react";

export function ServerAIMonitor() {
  const queryClient = useQueryClient();
  const [selectedServer, setSelectedServer] = useState<string | null>(null);

  const { data: servers, isLoading } = useQuery({
    queryKey: ['ai-monitored-servers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('server_instances')
        .select('*')
        .eq('approval_status', 'approved')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: analysisHistory } = useQuery({
    queryKey: ['server-analysis-history', selectedServer],
    queryFn: async () => {
      if (!selectedServer) return [];
      const { data, error } = await supabase
        .from('server_ai_analysis')
        .select('*')
        .eq('server_id', selectedServer)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedServer
  });

  const { data: protectionEvents } = useQuery({
    queryKey: ['protection-events', selectedServer],
    queryFn: async () => {
      if (!selectedServer) return [];
      const { data, error } = await supabase
        .from('server_protection_events')
        .select('*')
        .eq('server_id', selectedServer)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedServer
  });

  const runAnalysis = useMutation({
    mutationFn: async ({ serverId, action }: { serverId: string; action: string }) => {
      const { data, error } = await supabase.functions.invoke('ai-server-analyzer', {
        body: { action, serverId }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ai-monitored-servers'] });
      queryClient.invalidateQueries({ queryKey: ['server-analysis-history'] });
      toast.success(`${variables.action.replace('_', ' ')} completed`);
    },
    onError: (error) => {
      toast.error(`Analysis failed: ${error.message}`);
    }
  });

  const getHealthColor = (score: number | null) => {
    if (!score) return "text-muted-foreground";
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getRiskColor = (score: number | null) => {
    if (!score) return "text-muted-foreground";
    if (score <= 20) return "text-green-500";
    if (score <= 40) return "text-yellow-500";
    if (score <= 60) return "text-orange-500";
    return "text-red-500";
  };

  const getComplianceBadge = (status: string | null) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      compliant: "default",
      non_compliant: "destructive",
      review_required: "secondary",
      unknown: "outline"
    };
    return <Badge variant={variants[status || 'unknown'] || "outline"}>{status || 'unknown'}</Badge>;
  };

  const selectedServerData = servers?.find(s => s.id === selectedServer);
  const suggestions = selectedServerData?.ai_suggestions;
  const suggestionsArray = Array.isArray(suggestions) ? suggestions : [];
  const threatAlerts = selectedServerData?.threat_alerts;
  const threatAlertsArray = Array.isArray(threatAlerts) ? threatAlerts : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6" />
            AI Server Monitor
          </h2>
          <p className="text-muted-foreground">
            AI-powered health monitoring, threat detection, and protection
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Server List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Monitored Servers</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {servers?.map(server => {
                  const serverThreats = Array.isArray(server.threat_alerts) ? server.threat_alerts : [];
                  return (
                    <div
                      key={server.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedServer === server.id 
                          ? 'bg-primary/10 border border-primary' 
                          : 'bg-muted/50 hover:bg-muted'
                      }`}
                      onClick={() => setSelectedServer(server.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{server.server_name || 'Unnamed'}</span>
                        {server.protection_enabled && (
                          <Shield className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Activity className={`h-3 w-3 ${getHealthColor(server.ai_health_score)}`} />
                          <span>{server.ai_health_score || 0}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertTriangle className={`h-3 w-3 ${getRiskColor(server.ai_risk_score)}`} />
                          <span>{server.ai_risk_score || 0}</span>
                        </div>
                      </div>
                      {serverThreats.length > 0 && (
                        <Badge variant="destructive" className="mt-2">
                          {serverThreats.length} Active Threats
                        </Badge>
                      )}
                    </div>
                  );
                })}
                {(!servers || servers.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    No approved servers found
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Server Details */}
        <Card className="lg:col-span-2">
          {selectedServerData ? (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedServerData.server_name || 'Server'}</CardTitle>
                    <CardDescription>
                      {selectedServerData.server_type} • {selectedServerData.region}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => runAnalysis.mutate({ 
                        serverId: selectedServerData.id, 
                        action: 'full_analysis' 
                      })}
                      disabled={runAnalysis.isPending}
                    >
                      <RefreshCw className={`h-4 w-4 mr-1 ${runAnalysis.isPending ? 'animate-spin' : ''}`} />
                      Full Scan
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList className="grid grid-cols-5 w-full">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="health">Health</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="protection">Protection</TabsTrigger>
                    <TabsTrigger value="suggestions">AI Tips</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Health Score</span>
                            <Activity className={`h-4 w-4 ${getHealthColor(selectedServerData.ai_health_score)}`} />
                          </div>
                          <div className={`text-3xl font-bold ${getHealthColor(selectedServerData.ai_health_score)}`}>
                            {selectedServerData.ai_health_score || 0}%
                          </div>
                          <Progress value={selectedServerData.ai_health_score || 0} className="mt-2" />
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Risk Score</span>
                            <AlertTriangle className={`h-4 w-4 ${getRiskColor(selectedServerData.ai_risk_score)}`} />
                          </div>
                          <div className={`text-3xl font-bold ${getRiskColor(selectedServerData.ai_risk_score)}`}>
                            {selectedServerData.ai_risk_score || 0}
                          </div>
                          <Progress value={selectedServerData.ai_risk_score || 0} className="mt-2" />
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <span className="text-sm text-muted-foreground">CPU</span>
                        <div className="text-xl font-bold">{selectedServerData.current_cpu_usage || 0}%</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <span className="text-sm text-muted-foreground">Memory</span>
                        <div className="text-xl font-bold">{selectedServerData.current_memory_usage || 0}%</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <span className="text-sm text-muted-foreground">Disk</span>
                        <div className="text-xl font-bold">{selectedServerData.current_disk_usage || 0}%</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Shield className={selectedServerData.protection_enabled ? "text-green-500" : "text-muted-foreground"} />
                        <span>Protection: {selectedServerData.protection_level}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        {getComplianceBadge(selectedServerData.compliance_status)}
                      </div>
                    </div>

                    {selectedServerData.last_ai_analysis && (
                      <p className="text-xs text-muted-foreground">
                        Last AI analysis: {new Date(selectedServerData.last_ai_analysis).toLocaleString()}
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="health" className="space-y-4">
                    <div className="flex gap-2 mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => runAnalysis.mutate({ 
                          serverId: selectedServerData.id, 
                          action: 'analyze_health' 
                        })}
                        disabled={runAnalysis.isPending}
                      >
                        <Activity className="h-4 w-4 mr-1" />
                        Run Health Check
                      </Button>
                    </div>
                    
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {analysisHistory
                          ?.filter(a => a.analysis_type === 'health')
                          .map(analysis => {
                            const analysisSuggestions = Array.isArray(analysis.suggestions) ? analysis.suggestions : [];
                            return (
                              <Card key={analysis.id}>
                                <CardContent className="py-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Health Analysis</span>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(analysis.analyzed_at).toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="text-sm">
                                    Score: <span className={getHealthColor(analysis.health_score)}>
                                      {analysis.health_score}%
                                    </span>
                                  </div>
                                  {analysisSuggestions.length > 0 && (
                                    <div className="mt-2">
                                      <span className="text-xs text-muted-foreground">Recommendations:</span>
                                      <ul className="text-xs">
                                        {analysisSuggestions.slice(0, 3).map((s: any, i: number) => (
                                          <li key={i}>• {typeof s === 'string' ? s : JSON.stringify(s)}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            );
                          })}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="security" className="space-y-4">
                    <div className="flex gap-2 mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => runAnalysis.mutate({ 
                          serverId: selectedServerData.id, 
                          action: 'security_scan' 
                        })}
                        disabled={runAnalysis.isPending}
                      >
                        <FileSearch className="h-4 w-4 mr-1" />
                        Security Scan
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => runAnalysis.mutate({ 
                          serverId: selectedServerData.id, 
                          action: 'compliance_check' 
                        })}
                        disabled={runAnalysis.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Compliance Check
                      </Button>
                    </div>

                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {analysisHistory
                          ?.filter(a => a.analysis_type === 'security' || a.analysis_type === 'compliance')
                          .map(analysis => {
                            const threats = Array.isArray(analysis.threats_detected) ? analysis.threats_detected : [];
                            return (
                              <Card key={analysis.id}>
                                <CardContent className="py-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <Badge variant="outline">{analysis.analysis_type}</Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(analysis.analyzed_at).toLocaleString()}
                                    </span>
                                  </div>
                                  {analysis.risk_score !== null && (
                                    <div className="text-sm">
                                      Risk Score: <span className={getRiskColor(analysis.risk_score)}>
                                        {analysis.risk_score}/100
                                      </span>
                                    </div>
                                  )}
                                  {threats.length > 0 && (
                                    <div className="mt-2">
                                      <Badge variant="destructive" className="mb-1">
                                        {threats.length} Threats Found
                                      </Badge>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            );
                          })}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="protection" className="space-y-4">
                    <div className="flex gap-2 mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => runAnalysis.mutate({ 
                          serverId: selectedServerData.id, 
                          action: 'threat_detection' 
                        })}
                        disabled={runAnalysis.isPending}
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        Threat Detection
                      </Button>
                    </div>

                    {threatAlertsArray.length > 0 && (
                      <Card className="border-destructive">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-destructive flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Active Threats
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {threatAlertsArray.map((threat: any, i: number) => (
                              <li key={i} className="text-sm p-2 bg-destructive/10 rounded">
                                <div className="font-medium">{threat.type}</div>
                                <div className="text-xs text-muted-foreground">{threat.description}</div>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    <ScrollArea className="h-[250px]">
                      <div className="space-y-2">
                        {protectionEvents?.map(event => (
                          <Card key={event.id}>
                            <CardContent className="py-3">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant={event.severity === 'critical' ? 'destructive' : 'secondary'}>
                                  {event.event_type}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(event.created_at).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm">{event.description}</p>
                              {event.blocked && (
                                <Badge variant="default" className="mt-1">Blocked</Badge>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="suggestions" className="space-y-4">
                    <div className="flex gap-2 mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => runAnalysis.mutate({ 
                          serverId: selectedServerData.id, 
                          action: 'generate_suggestions' 
                        })}
                        disabled={runAnalysis.isPending}
                      >
                        <Zap className="h-4 w-4 mr-1" />
                        Generate AI Tips
                      </Button>
                    </div>

                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {suggestionsArray.map((suggestion: any, i: number) => (
                          <Card key={i}>
                            <CardContent className="py-3">
                              <div className="flex items-center gap-2 mb-1">
                                <TrendingUp className="h-4 w-4 text-primary" />
                                <span className="font-medium text-sm">
                                  {typeof suggestion === 'string' ? suggestion : suggestion.suggestion}
                                </span>
                              </div>
                              {suggestion.category && (
                                <Badge variant="outline" className="mr-2">{suggestion.category}</Badge>
                              )}
                              {suggestion.priority && (
                                <Badge variant={
                                  suggestion.priority === 'high' ? 'destructive' : 
                                  suggestion.priority === 'medium' ? 'secondary' : 'outline'
                                }>
                                  {suggestion.priority}
                                </Badge>
                              )}
                            </CardContent>
                          </Card>
                        ))}

                        {suggestionsArray.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <Brain className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>No AI suggestions yet</p>
                            <p className="text-sm">Click "Generate AI Tips" to get recommendations</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </>
          ) : (
            <CardContent className="py-12 text-center text-muted-foreground">
              <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a server to view AI monitoring details</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}

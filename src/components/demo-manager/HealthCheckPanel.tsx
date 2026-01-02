import { useHealthCheck } from "@/hooks/useHealthCheck";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle2, XCircle, AlertTriangle, Loader2, Zap } from "lucide-react";

const HealthCheckPanel = () => {
  const {
    isChecking,
    progress,
    totalBatches,
    currentBatch,
    results,
    summary,
    runHealthCheck,
  } = useHealthCheck();

  const handleRunCheck = () => {
    runHealthCheck(undefined, 50); // 50 demos per batch
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Batch Health Check
          </CardTitle>
          <CardDescription>
            Check all demo URLs at once. Runs 50 demos in parallel for maximum speed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleRunCheck} 
            disabled={isChecking}
            size="lg"
            className="w-full"
          >
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking... Batch {currentBatch}/{totalBatches}
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Run Health Check (All Demos)
              </>
            )}
          </Button>

          {isChecking && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {summary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total</span>
                    <Badge variant="secondary">{summary.total}</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-500/10 border-green-500/20">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Healthy</span>
                    </div>
                    <Badge className="bg-green-500">{summary.healthy}</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-yellow-500/10 border-yellow-500/20">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">Unhealthy</span>
                    </div>
                    <Badge className="bg-yellow-500">{summary.unhealthy}</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-red-500/10 border-red-500/20">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">Error</span>
                    </div>
                    <Badge className="bg-red-500">{summary.error}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Results ({results.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {results.map((result) => (
                <div 
                  key={result.id} 
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {result.status === "healthy" && (
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    )}
                    {result.status === "unhealthy" && (
                      <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                    )}
                    {result.status === "error" && (
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    )}
                    <span className="text-sm truncate">{result.url}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {result.http_status && (
                      <Badge variant="outline">{result.http_status}</Badge>
                    )}
                    {result.response_time_ms && (
                      <Badge variant="secondary">{result.response_time_ms}ms</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HealthCheckPanel;

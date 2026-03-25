import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  AlertTriangle, 
  Shield, 
  Eye, 
  CheckCircle2, 
  XCircle,
  TrendingUp,
  Copy,
  Camera,
  Repeat,
  Zap
} from "lucide-react";
import { toast } from "sonner";

interface FraudAlert {
  id: string;
  type: "duplicate_qr" | "spike_usage" | "misuse" | "screenshot" | "copy_attempt";
  severity: "low" | "medium" | "high" | "critical";
  userId: string;
  userRole: string;
  details: string;
  timestamp: string;
  isResolved: boolean;
  relatedQrId?: string;
}

const mockFraudAlerts: FraudAlert[] = [
  {
    id: "1",
    type: "screenshot",
    severity: "high",
    userId: "user-123",
    userRole: "reseller",
    details: "Screenshot attempt detected on billing QR code. Device ID logged.",
    timestamp: "10 min ago",
    isResolved: false,
    relatedQrId: "AI-20241221-a1b2c3d4"
  },
  {
    id: "2",
    type: "spike_usage",
    severity: "medium",
    userId: "user-456",
    userRole: "franchise",
    details: "400% increase in AI requests within 1 hour. Abnormal pattern detected.",
    timestamp: "1 hour ago",
    isResolved: false,
  },
  {
    id: "3",
    type: "duplicate_qr",
    severity: "low",
    userId: "user-789",
    userRole: "admin",
    details: "Same QR code scanned 5 times within 30 minutes.",
    timestamp: "2 hours ago",
    isResolved: true,
    relatedQrId: "AI-20241220-x9y8z7w6"
  },
  {
    id: "4",
    type: "copy_attempt",
    severity: "high",
    userId: "user-321",
    userRole: "prime",
    details: "Attempted to copy QR code data via clipboard. Action blocked.",
    timestamp: "Yesterday",
    isResolved: true,
    relatedQrId: "AI-20241219-m5n6o7p8"
  },
  {
    id: "5",
    type: "misuse",
    severity: "critical",
    userId: "user-654",
    userRole: "developer",
    details: "Unauthorized API calls to AI endpoint. Rate limit exceeded by 200%.",
    timestamp: "2 days ago",
    isResolved: true,
  },
];

const getTypeIcon = (type: FraudAlert["type"]) => {
  switch (type) {
    case "duplicate_qr":
      return <Repeat className="h-4 w-4" />;
    case "spike_usage":
      return <TrendingUp className="h-4 w-4" />;
    case "misuse":
      return <Zap className="h-4 w-4" />;
    case "screenshot":
      return <Camera className="h-4 w-4" />;
    case "copy_attempt":
      return <Copy className="h-4 w-4" />;
    default:
      return <AlertTriangle className="h-4 w-4" />;
  }
};

const getTypeLabel = (type: FraudAlert["type"]) => {
  switch (type) {
    case "duplicate_qr":
      return "Duplicate QR Scan";
    case "spike_usage":
      return "Usage Spike";
    case "misuse":
      return "AI Misuse";
    case "screenshot":
      return "Screenshot Attempt";
    case "copy_attempt":
      return "Copy Attempt";
    default:
      return type;
  }
};

const getSeverityColor = (severity: FraudAlert["severity"]) => {
  switch (severity) {
    case "low":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "medium":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "high":
      return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    case "critical":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const FraudAlertsPanel = () => {
  const [alerts, setAlerts] = useState(mockFraudAlerts);

  const handleResolve = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, isResolved: true } : alert
    ));
    toast.success("Alert marked as resolved");
  };

  const handleInvestigate = (alertId: string) => {
    toast.info("Opening investigation details...");
  };

  const unresolvedCount = alerts.filter(a => !a.isResolved).length;
  const criticalCount = alerts.filter(a => a.severity === "critical" && !a.isResolved).length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-500">{criticalCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Unresolved</p>
                <p className="text-2xl font-bold text-amber-500">{unresolvedCount}</p>
              </div>
              <Eye className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-green-500">{alerts.filter(a => a.isResolved).length}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Alerts</p>
                <p className="text-2xl font-bold text-primary">{alerts.length}</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Fraud Detection Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${
                    alert.isResolved 
                      ? "bg-muted/30 border-border opacity-60" 
                      : alert.severity === "critical"
                      ? "bg-red-500/5 border-red-500/30"
                      : "bg-card border-border"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${getSeverityColor(alert.severity)}`}>
                        {getTypeIcon(alert.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{getTypeLabel(alert.type)}</p>
                          <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          {alert.isResolved && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                              Resolved
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {alert.userRole} • {alert.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{alert.details}</p>

                  {alert.relatedQrId && (
                    <p className="text-xs font-mono text-muted-foreground mb-3">
                      Related QR: {alert.relatedQrId}
                    </p>
                  )}

                  {!alert.isResolved && (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleInvestigate(alert.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Investigate
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleResolve(alert.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark Resolved
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

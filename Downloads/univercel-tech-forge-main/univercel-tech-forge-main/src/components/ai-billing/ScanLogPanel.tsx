import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  History, 
  Eye, 
  Download, 
  AlertTriangle, 
  CheckCircle2,
  Smartphone,
  Monitor
} from "lucide-react";

interface ScanLog {
  id: string;
  qrId: string;
  scannedBy: string;
  role: string;
  type: "view" | "download_png" | "download_pdf" | "screenshot_attempt" | "copy_attempt";
  device: "mobile" | "desktop";
  timestamp: string;
  isValid: boolean;
  isDuplicate: boolean;
  alertTriggered: boolean;
}

const mockScanLogs: ScanLog[] = [
  {
    id: "1",
    qrId: "AI-20241221-a1b2c3d4",
    scannedBy: "Finance Manager",
    role: "finance_manager",
    type: "view",
    device: "desktop",
    timestamp: "2 min ago",
    isValid: true,
    isDuplicate: false,
    alertTriggered: false,
  },
  {
    id: "2",
    qrId: "AI-20241221-a1b2c3d4",
    scannedBy: "Super Admin",
    role: "super_admin",
    type: "download_pdf",
    device: "mobile",
    timestamp: "15 min ago",
    isValid: true,
    isDuplicate: false,
    alertTriggered: false,
  },
  {
    id: "3",
    qrId: "AI-20241220-x9y8z7w6",
    scannedBy: "Unknown",
    role: "reseller",
    type: "screenshot_attempt",
    device: "mobile",
    timestamp: "1 hour ago",
    isValid: false,
    isDuplicate: false,
    alertTriggered: true,
  },
  {
    id: "4",
    qrId: "AI-20241220-x9y8z7w6",
    scannedBy: "Super Admin",
    role: "super_admin",
    type: "view",
    device: "desktop",
    timestamp: "2 hours ago",
    isValid: true,
    isDuplicate: true,
    alertTriggered: false,
  },
  {
    id: "5",
    qrId: "AI-20241219-m5n6o7p8",
    scannedBy: "Auditor",
    role: "admin",
    type: "download_png",
    device: "desktop",
    timestamp: "Yesterday",
    isValid: true,
    isDuplicate: false,
    alertTriggered: false,
  },
];

const getTypeIcon = (type: ScanLog["type"]) => {
  switch (type) {
    case "view":
      return <Eye className="h-3 w-3" />;
    case "download_png":
    case "download_pdf":
      return <Download className="h-3 w-3" />;
    case "screenshot_attempt":
    case "copy_attempt":
      return <AlertTriangle className="h-3 w-3" />;
    default:
      return <Eye className="h-3 w-3" />;
  }
};

const getTypeLabel = (type: ScanLog["type"]) => {
  switch (type) {
    case "view":
      return "Viewed";
    case "download_png":
      return "PNG Download";
    case "download_pdf":
      return "PDF Download";
    case "screenshot_attempt":
      return "Screenshot Blocked";
    case "copy_attempt":
      return "Copy Blocked";
    default:
      return type;
  }
};

export const ScanLogPanel = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <History className="h-4 w-4" />
          Scan Activity Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {mockScanLogs.map((log) => (
              <div
                key={log.id}
                className={`p-3 rounded-lg border ${
                  log.alertTriggered 
                    ? "bg-red-500/10 border-red-500/20" 
                    : log.isDuplicate
                    ? "bg-amber-500/10 border-amber-500/20"
                    : "bg-muted/50 border-border"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {log.device === "mobile" ? (
                      <Smartphone className="h-3 w-3 text-muted-foreground" />
                    ) : (
                      <Monitor className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span className="text-xs font-medium">{log.scannedBy}</span>
                    <Badge variant="outline" className="text-[10px] h-4">
                      {log.role.replace("_", " ")}
                    </Badge>
                  </div>
                  {log.isValid ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(log.type)}
                    <span className={`text-xs ${
                      log.alertTriggered ? "text-red-500 font-medium" : "text-muted-foreground"
                    }`}>
                      {getTypeLabel(log.type)}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                </div>

                <p className="text-xs font-mono text-muted-foreground mt-1">{log.qrId}</p>

                {log.isDuplicate && (
                  <Badge variant="outline" className="mt-2 text-[10px] bg-amber-500/10 text-amber-500 border-amber-500/20">
                    Duplicate Scan
                  </Badge>
                )}

                {log.alertTriggered && (
                  <Badge variant="outline" className="mt-2 text-[10px] bg-red-500/10 text-red-500 border-red-500/20">
                    Alert Triggered
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Download, 
  Calendar, 
  RefreshCw,
  CheckCircle2,
  Clock,
  QrCode
} from "lucide-react";
import { toast } from "sonner";

interface MonthlyStatementGeneratorProps {
  onQRGenerated?: (qrId: string) => void;
}

interface Statement {
  id: string;
  statementNumber: string;
  periodType: "daily" | "weekly" | "monthly";
  periodStart: string;
  periodEnd: string;
  totalBaseCost: number;
  totalManagementFee: number;
  totalFinalCost: number;
  totalRequests: number;
  status: "pending" | "processed" | "paid";
  qrGenerated: boolean;
}

const mockStatements: Statement[] = [
  {
    id: "1",
    statementNumber: "STMT-202412-001",
    periodType: "monthly",
    periodStart: "2024-12-01",
    periodEnd: "2024-12-31",
    totalBaseCost: 1250.50,
    totalManagementFee: 375.15,
    totalFinalCost: 1625.65,
    totalRequests: 15420,
    status: "pending",
    qrGenerated: true,
  },
  {
    id: "2",
    statementNumber: "STMT-202411-001",
    periodType: "monthly",
    periodStart: "2024-11-01",
    periodEnd: "2024-11-30",
    totalBaseCost: 980.25,
    totalManagementFee: 294.08,
    totalFinalCost: 1274.33,
    totalRequests: 12150,
    status: "paid",
    qrGenerated: true,
  },
  {
    id: "3",
    statementNumber: "STMT-202412-W3",
    periodType: "weekly",
    periodStart: "2024-12-16",
    periodEnd: "2024-12-22",
    totalBaseCost: 312.80,
    totalManagementFee: 93.84,
    totalFinalCost: 406.64,
    totalRequests: 3850,
    status: "processed",
    qrGenerated: true,
  },
];

export const MonthlyStatementGenerator = ({ onQRGenerated }: MonthlyStatementGeneratorProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStatement, setSelectedStatement] = useState<Statement | null>(null);

  const handleGenerateStatement = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("Statement generated with QR code");
      onQRGenerated?.("STMT-" + Date.now());
    }, 2000);
  };

  const getStatusBadge = (status: Statement["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Pending</Badge>;
      case "processed":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Processed</Badge>;
      case "paid":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Paid</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Generator Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Generate Billing Statement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as any)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily Statement</SelectItem>
                <SelectItem value="weekly">Weekly Statement</SelectItem>
                <SelectItem value="monthly">Monthly Statement</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={handleGenerateStatement}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate Statement + QR
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            Generates a consolidated billing statement with a scannable QR code for internal auditing.
          </p>
        </CardContent>
      </Card>

      {/* Statements List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Generated Statements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockStatements.map((statement) => (
              <div
                key={statement.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedStatement?.id === statement.id
                    ? "bg-primary/5 border-primary/30"
                    : "bg-muted/30 border-border hover:border-primary/20"
                }`}
                onClick={() => setSelectedStatement(statement)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-mono font-medium">{statement.statementNumber}</p>
                      {getStatusBadge(statement.status)}
                      <Badge variant="outline" className="capitalize">
                        {statement.periodType}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(statement.periodStart).toLocaleDateString()} - {new Date(statement.periodEnd).toLocaleDateString()}
                    </p>
                  </div>
                  {statement.qrGenerated && (
                    <div className="flex items-center gap-1 text-green-500">
                      <QrCode className="h-4 w-4" />
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Base Cost</p>
                    <p className="font-medium text-blue-500">₹{statement.totalBaseCost.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Mgmt Fee</p>
                    <p className="font-medium text-amber-500">₹{statement.totalManagementFee.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Final Total</p>
                    <p className="font-medium text-green-500">₹{statement.totalFinalCost.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Requests</p>
                    <p className="font-medium">{statement.totalRequests.toLocaleString()}</p>
                  </div>
                </div>

                {selectedStatement?.id === statement.id && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-2 rounded-lg">
                        <QRCodeSVG 
                          value={JSON.stringify({
                            stmt: statement.statementNumber,
                            bc: statement.totalBaseCost,
                            mf: statement.totalManagementFee,
                            fc: statement.totalFinalCost,
                            period: statement.periodType,
                            start: statement.periodStart,
                            end: statement.periodEnd
                          })}
                          size={100}
                          level="H"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-2">Statement QR Code</p>
                        <p className="text-xs text-muted-foreground mb-3">
                          Scan with authorized device to view full breakdown
                        </p>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download PNG
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

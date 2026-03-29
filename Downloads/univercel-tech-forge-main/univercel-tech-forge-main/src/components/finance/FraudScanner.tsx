import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  Lock,
  Unlock,
  RefreshCcw,
  Activity,
  TrendingUp,
  Search
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const FraudScanner = () => {
  const { toast } = useToast();
  const [scanning, setScanning] = useState(false);

  const scanMetrics = [
    { label: "Transactions Scanned", value: "12,847", subtext: "Last 30 days" },
    { label: "Fraud Detected", value: "23", subtext: "0.18% rate" },
    { label: "False Positives", value: "7", subtext: "Resolved" },
    { label: "Risk Score", value: "Low", subtext: "System health: 98.2%" },
  ];

  const flaggedTransactions = [
    {
      id: "TXN-2035-F001",
      type: "Duplicate Payment",
      description: "Same card used twice within 2 minutes for identical amount",
      amount: 249,
      risk: "high",
      status: "frozen",
      time: "15 min ago",
      details: {
        card: "****4521",
        ip: "192.168.1.***",
        location: "Mumbai, IN",
      },
    },
    {
      id: "TXN-2035-F002",
      type: "Velocity Breach",
      description: "5 transactions from same IP in under 10 minutes",
      amount: 1245,
      risk: "high",
      status: "reviewing",
      time: "1 hr ago",
      details: {
        card: "Multiple",
        ip: "10.0.0.***",
        location: "Unknown VPN",
      },
    },
    {
      id: "TXN-2035-F003",
      type: "Chargeback Alert",
      description: "Previous chargeback history on this card",
      amount: 730,
      risk: "medium",
      status: "monitoring",
      time: "3 hr ago",
      details: {
        card: "****7890",
        ip: "172.16.0.***",
        location: "Delhi, IN",
      },
    },
    {
      id: "TXN-2035-F004",
      type: "Geographic Anomaly",
      description: "Account accessed from new country within 1 hour",
      amount: 249,
      risk: "medium",
      status: "cleared",
      time: "5 hr ago",
      details: {
        card: "****1234",
        ip: "Various",
        location: "USA → India",
      },
    },
  ];

  const fraudRules = [
    { rule: "Duplicate Detection", status: "active", triggers: 12, lastTriggered: "2 hr ago" },
    { rule: "Velocity Check", status: "active", triggers: 8, lastTriggered: "1 hr ago" },
    { rule: "Chargeback History", status: "active", triggers: 3, lastTriggered: "5 hr ago" },
    { rule: "Geographic Anomaly", status: "active", triggers: 5, lastTriggered: "3 hr ago" },
    { rule: "Amount Threshold", status: "active", triggers: 2, lastTriggered: "1 day ago" },
    { rule: "Card BIN Check", status: "active", triggers: 1, lastTriggered: "2 days ago" },
  ];

  const handleFreeze = (id: string) => {
    toast({
      title: "Transaction Frozen",
      description: `Transaction ${id} has been frozen pending investigation.`,
    });
  };

  const handleClear = (id: string) => {
    toast({
      title: "Transaction Cleared",
      description: `Transaction ${id} has been marked as legitimate.`,
    });
  };

  const runScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      toast({
        title: "Scan Complete",
        description: "AI Fraud Scanner analyzed 847 recent transactions. No new threats detected.",
      });
    }, 3000);
  };

  const getRiskBadge = (risk: string) => {
    const styles: Record<string, string> = {
      high: "bg-red-100 text-red-700 border-red-300",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
      low: "bg-cyan-100 text-cyan-700 border-cyan-300",
    };
    return styles[risk] || styles.low;
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      frozen: "bg-red-100 text-red-700",
      reviewing: "bg-yellow-100 text-yellow-700",
      monitoring: "bg-blue-100 text-blue-700",
      cleared: "bg-cyan-100 text-cyan-700",
    };
    return styles[status] || "";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI Fraud Scanner</h1>
          <p className="text-slate-500 text-sm">Real-time fraud detection and transaction monitoring</p>
        </div>
        <Button 
          onClick={runScan}
          disabled={scanning}
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          {scanning ? (
            <>
              <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Run Full Scan
            </>
          )}
        </Button>
      </div>

      {/* Scan Progress */}
      {scanning && (
        <Card className="bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Activity className="w-6 h-6 text-cyan-600 animate-pulse" />
              <div className="flex-1">
                <p className="font-medium text-cyan-800 dark:text-cyan-300">AI Fraud Scanner Running...</p>
                <Progress value={66} className="h-2 mt-2" />
              </div>
              <span className="text-sm text-cyan-600">Analyzing 847 transactions</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {scanMetrics.map((metric, index) => (
          <Card key={index} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">{metric.label}</p>
              <p className={`text-2xl font-bold mt-1 ${
                metric.label === "Risk Score" ? 'text-cyan-600' : 'text-slate-900 dark:text-white'
              }`}>
                {metric.value}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{metric.subtext}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Flagged Transactions */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Flagged Transactions
            </CardTitle>
            <Badge variant="outline">{flaggedTransactions.length} items</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {flaggedTransactions.map((tx, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      tx.risk === 'high' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'
                    }`}>
                      <AlertTriangle className={`w-5 h-5 ${
                        tx.risk === 'high' ? 'text-red-600' : 'text-yellow-600'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900 dark:text-white">{tx.type}</p>
                        <Badge className={`${getRiskBadge(tx.risk)} border text-xs`}>
                          {tx.risk} risk
                        </Badge>
                        <Badge className={`${getStatusBadge(tx.status)} text-xs`}>
                          {tx.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{tx.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span>{tx.id}</span>
                        <span>•</span>
                        <span>${tx.amount}</span>
                        <span>•</span>
                        <span>{tx.time}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className="text-slate-400">Card: {tx.details.card}</span>
                        <span className="text-slate-400">IP: {tx.details.ip}</span>
                        <span className="text-slate-400">Location: {tx.details.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    {tx.status !== 'frozen' && tx.status !== 'cleared' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 border-red-300"
                        onClick={() => handleFreeze(tx.id)}
                      >
                        <Lock className="w-4 h-4 mr-1" />
                        Freeze
                      </Button>
                    )}
                    {tx.status !== 'cleared' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-cyan-600 border-cyan-300"
                          onClick={() => handleClear(tx.id)}
                        >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fraud Rules */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-600" />
            Active Fraud Detection Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {fraudRules.map((rule, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-cyan-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{rule.rule}</p>
                    <p className="text-xs text-slate-500">Last triggered: {rule.lastTriggered}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {rule.triggers} triggers
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FraudScanner;

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  DollarSign, 
  TrendingUp, 
  QrCode, 
  Shield, 
  Activity,
  Download,
  RefreshCw,
  AlertTriangle,
  Wallet
} from "lucide-react";
import { AIUsageChart } from "./AIUsageChart";
import { AIBillingSidebar } from "./AIBillingSidebar";
import { QRCodePreview } from "./QRCodePreview";
import { ScanLogPanel } from "./ScanLogPanel";
import { ComparePricingPanel } from "./ComparePricingPanel";
import { FraudAlertsPanel } from "./FraudAlertsPanel";
import { EfficiencyScores } from "./EfficiencyScores";
import { MonthlyStatementGenerator } from "./MonthlyStatementGenerator";

interface BillingStats {
  totalBaseCost: number;
  totalManagementFee: number;
  totalFinalCost: number;
  totalRequests: number;
  totalTokens: number;
}

const mockStats: BillingStats = {
  totalBaseCost: 1250.50,
  totalManagementFee: 375.15,
  totalFinalCost: 1625.65,
  totalRequests: 15420,
  totalTokens: 2500000,
};

export const AIBillingDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedQR, setSelectedQR] = useState<string | null>(null);
  const [walletBalance] = useState(25000.00);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar - Real-time AI Usage Chart */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Billing Transparency</h1>
              <p className="text-xs text-muted-foreground">Software Vala AI Cost Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
              <Activity className="h-3 w-3 mr-1 animate-pulse" />
              Live Monitoring
            </Badge>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">₹{walletBalance.toLocaleString()}</span>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        <AIUsageChart />
      </div>

      <div className="flex">
        {/* Left Sidebar - Billing + QR Navigation */}
        <AIBillingSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Center - Main Dashboard Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Base AI Cost</p>
                    <p className="text-2xl font-bold text-blue-500">₹{mockStats.totalBaseCost.toLocaleString()}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Management Fee (30%)</p>
                    <p className="text-2xl font-bold text-amber-500">₹{mockStats.totalManagementFee.toLocaleString()}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Final Total</p>
                    <p className="text-2xl font-bold text-green-500">₹{mockStats.totalFinalCost.toLocaleString()}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Requests</p>
                    <p className="text-2xl font-bold text-purple-500">{mockStats.totalRequests.toLocaleString()}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formula Display */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Shield className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Billing Formula</p>
                    <p className="text-lg font-mono font-bold text-primary">
                      AI_BASE_COST × 1.30 = FINAL_BILL
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Software Vala pays all AI costs</p>
                  <p className="text-sm font-medium text-green-500">Users never charged directly</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-5 w-full max-w-2xl">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="statements">Statements</TabsTrigger>
              <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
              <TabsTrigger value="compare">Compare</TabsTrigger>
              <TabsTrigger value="fraud">Fraud</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <ModuleBreakdown />
            </TabsContent>

            <TabsContent value="statements">
              <MonthlyStatementGenerator onQRGenerated={setSelectedQR} />
            </TabsContent>

            <TabsContent value="efficiency">
              <EfficiencyScores />
            </TabsContent>

            <TabsContent value="compare">
              <ComparePricingPanel />
            </TabsContent>

            <TabsContent value="fraud">
              <FraudAlertsPanel />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - QR Preview + Scan Log */}
        <div className="w-96 border-l border-border p-4 space-y-4 bg-card/30">
          <QRCodePreview selectedQR={selectedQR} onQRSelect={setSelectedQR} />
          <ScanLogPanel />
        </div>
      </div>

      {/* Footer - Wallet Status + Monthly Summary */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Wallet Balance:</span>
              <span className="font-bold text-green-500">₹{walletBalance.toLocaleString()}</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">This Month:</span>
              <span className="font-bold">₹{mockStats.totalFinalCost.toLocaleString()}</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Tokens Used:</span>
              <span className="font-bold">{(mockStats.totalTokens / 1000000).toFixed(2)}M</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <QrCode className="h-4 w-4 mr-2" />
              Generate Monthly QR
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Module Breakdown Component
const ModuleBreakdown = () => {
  const modules = [
    { name: "SEO", icon: "🔍", requests: 5200, cost: 420.50, color: "blue" },
    { name: "Chatbot", icon: "💬", requests: 4800, cost: 380.20, color: "green" },
    { name: "Dev Assist", icon: "💻", requests: 2100, cost: 250.80, color: "purple" },
    { name: "OCR", icon: "📄", requests: 1800, cost: 95.00, color: "amber" },
    { name: "Image Gen", icon: "🖼️", requests: 1020, cost: 78.00, color: "pink" },
    { name: "Translation", icon: "🌐", requests: 500, cost: 26.00, color: "cyan" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Module Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {modules.map((module) => {
            const managementFee = module.cost * 0.3;
            const finalCost = module.cost * 1.3;
            
            return (
              <div key={module.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{module.icon}</span>
                  <div>
                    <p className="font-medium">{module.name}</p>
                    <p className="text-xs text-muted-foreground">{module.requests.toLocaleString()} requests</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Base: ₹{module.cost.toFixed(2)}</span>
                    <span className="text-xs text-amber-500">+30%: ₹{managementFee.toFixed(2)}</span>
                  </div>
                  <p className="font-bold text-green-500">₹{finalCost.toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIBillingDashboard;

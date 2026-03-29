import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingDown, 
  TrendingUp, 
  DollarSign, 
  Shield, 
  Sparkles,
  Building2
} from "lucide-react";

interface PricingComparison {
  module: string;
  icon: string;
  userWouldPay: number;
  softwareValaPays: number;
  savings: number;
  savingsPercent: number;
}

const comparisons: PricingComparison[] = [
  { module: "SEO Analysis", icon: "🔍", userWouldPay: 500.00, softwareValaPays: 420.50, savings: 79.50, savingsPercent: 15.9 },
  { module: "Chatbot", icon: "💬", userWouldPay: 450.00, softwareValaPays: 380.20, savings: 69.80, savingsPercent: 15.5 },
  { module: "Dev Assist", icon: "💻", userWouldPay: 300.00, softwareValaPays: 250.80, savings: 49.20, savingsPercent: 16.4 },
  { module: "OCR", icon: "📄", userWouldPay: 120.00, softwareValaPays: 95.00, savings: 25.00, savingsPercent: 20.8 },
  { module: "Image Gen", icon: "🖼️", userWouldPay: 100.00, softwareValaPays: 78.00, savings: 22.00, savingsPercent: 22.0 },
  { module: "Translation", icon: "🌐", userWouldPay: 35.00, softwareValaPays: 26.00, savings: 9.00, savingsPercent: 25.7 },
];

export const ComparePricingPanel = () => {
  const totalUserWouldPay = comparisons.reduce((sum, c) => sum + c.userWouldPay, 0);
  const totalSoftwareValaPays = comparisons.reduce((sum, c) => sum + c.softwareValaPays, 0);
  const totalSavings = totalUserWouldPay - totalSoftwareValaPays;
  const avgSavingsPercent = (totalSavings / totalUserWouldPay) * 100;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">If Users Paid Directly</p>
              <DollarSign className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-red-500">₹{totalUserWouldPay.toLocaleString()}</p>
            <p className="text-xs text-red-400 mt-1">Market rate pricing</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Software Vala Pays</p>
              <Building2 className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-500">₹{totalSoftwareValaPays.toLocaleString()}</p>
            <p className="text-xs text-green-400 mt-1">Base + 30% management fee</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Savings</p>
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-primary">₹{totalSavings.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3 text-green-500" />
              <p className="text-xs text-green-500">{avgSavingsPercent.toFixed(1)}% less than market</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Module-wise Price Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {comparisons.map((comp) => (
              <div key={comp.module} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{comp.icon}</span>
                    <span className="font-medium">{comp.module}</span>
                  </div>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    {comp.savingsPercent.toFixed(1)}% saved
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                    <p className="text-xs text-muted-foreground mb-1">User Would Pay</p>
                    <p className="font-bold text-red-500">₹{comp.userWouldPay.toFixed(2)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                    <p className="text-xs text-muted-foreground mb-1">Software Vala Pays</p>
                    <p className="font-bold text-green-500">₹{comp.softwareValaPays.toFixed(2)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-xs text-muted-foreground mb-1">Your Savings</p>
                    <p className="font-bold text-primary">₹{comp.savings.toFixed(2)}</p>
                  </div>
                </div>

                <div className="relative">
                  <Progress value={100 - comp.savingsPercent} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>₹0</span>
                    <span>₹{comp.userWouldPay.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transparency Note */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Full Transparency</h4>
              <p className="text-sm text-muted-foreground">
                Software Vala absorbs all AI costs and adds a 30% management fee for infrastructure, 
                support, and optimization. Users never see AI charges - it's all included in the platform.
                This comparison shows the real value you're getting.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

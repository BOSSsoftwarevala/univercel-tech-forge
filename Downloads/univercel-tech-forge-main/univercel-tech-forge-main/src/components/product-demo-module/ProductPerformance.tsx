import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Eye,
  Package,
  Download,
  Calendar
} from "lucide-react";

const productPerformance = [
  { name: "RetailMaster Pro", views: 4567, demos: 45, conversions: 12, rate: "26.7%" },
  { name: "FoodServe Plus", views: 3890, demos: 38, conversions: 9, rate: "23.7%" },
  { name: "HotelHub Enterprise", views: 2345, demos: 22, conversions: 5, rate: "22.7%" },
  { name: "StockFlow Advanced", views: 2890, demos: 28, conversions: 7, rate: "25.0%" },
  { name: "SalonPro Suite", views: 1890, demos: 19, conversions: 4, rate: "21.1%" },
];

const demoUsage = [
  { name: "RetailMaster - Nigeria", views: 456, sessions: 234, avgTime: "12:34" },
  { name: "FoodServe - Kenya", views: 389, sessions: 198, avgTime: "10:45" },
  { name: "HotelHub - UAE", views: 312, sessions: 156, avgTime: "8:23" },
  { name: "StockFlow - SA", views: 278, sessions: 134, avgTime: "11:12" },
];

export const ProductPerformance = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Performance</h1>
          <p className="text-muted-foreground">Product and demo analytics</p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue="30">
            <SelectTrigger className="w-[150px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Views", value: "15,582", change: "+23%", icon: Eye, color: "from-blue-500 to-cyan-500" },
          { label: "Demo Sessions", value: "1,245", change: "+18%", icon: BarChart3, color: "from-violet-500 to-purple-500" },
          { label: "Conversions", value: "37", change: "+12%", icon: TrendingUp, color: "from-emerald-500 to-teal-500" },
          { label: "Avg. Conv Rate", value: "24.2%", change: "+2.1%", icon: Package, color: "from-amber-500 to-orange-500" },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <Badge variant="outline" className="text-emerald-400 border-emerald-400/30">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Product Performance */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-violet-400" />
            Product Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {productPerformance.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-lg bg-background/50 border border-border/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium text-foreground">{product.name}</div>
                  <Badge variant="outline" className="text-emerald-400 border-emerald-400/30">
                    {product.rate} conversion
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <div className="text-lg font-bold text-foreground">{product.views.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Views</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">{product.demos}</div>
                    <div className="text-xs text-muted-foreground">Demo Requests</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-emerald-400">{product.conversions}</div>
                    <div className="text-xs text-muted-foreground">Conversions</div>
                  </div>
                </div>
                <Progress value={parseFloat(product.rate)} className="h-2" />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Demo Usage */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            Demo Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {demoUsage.map((demo, index) => (
              <motion.div
                key={demo.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50"
              >
                <div className="font-medium text-foreground">{demo.name}</div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{demo.views}</div>
                    <div className="text-xs text-muted-foreground">Views</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{demo.sessions}</div>
                    <div className="text-xs text-muted-foreground">Sessions</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{demo.avgTime}</div>
                    <div className="text-xs text-muted-foreground">Avg. Time</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

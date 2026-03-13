import { motion } from "framer-motion";
import { Package, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ProductPerf {
  product_name: string;
  category: string;
  total_sales: number;
  total_revenue: number;
  status: string;
}

interface CEOProductPerformanceProps {
  products: ProductPerf[];
}

const tooltipStyle = {
  contentStyle: {
    background: 'hsl(222, 47%, 11%)',
    border: '1px solid hsl(217, 33%, 25%)',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#fff',
  },
};

const CEOProductPerformance = ({ products }: CEOProductPerformanceProps) => {
  const topProducts = [...products].sort((a, b) => b.total_revenue - a.total_revenue).slice(0, 10);
  const categoryMap: Record<string, { sales: number; revenue: number }> = {};
  products.forEach((p) => {
    if (!categoryMap[p.category]) categoryMap[p.category] = { sales: 0, revenue: 0 };
    categoryMap[p.category].sales += p.total_sales;
    categoryMap[p.category].revenue += p.total_revenue;
  });
  const categoryData = Object.entries(categoryMap)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 8)
    .map(([name, d]) => ({ name, ...d }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Category Revenue Chart */}
      <Card className="bg-slate-900/60 border-slate-700/40 backdrop-blur">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-violet-400" />
            Revenue by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip {...tooltipStyle} formatter={(v: number) => [`₹${v.toLocaleString()}`, '']} />
                <Bar dataKey="revenue" fill="hsl(270, 80%, 60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center text-slate-500 text-sm">No product data available</div>
          )}
        </CardContent>
      </Card>

      {/* Top Products Table */}
      <Card className="bg-slate-900/60 border-slate-700/40 backdrop-blur">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-400" />
            Top Products by Revenue
            <Badge className="text-[9px] bg-slate-700/50 text-slate-400">{products.length} total</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[350px]">
            <div className="space-y-2">
              {topProducts.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/30 hover:border-violet-500/30 transition"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-xs text-slate-500 w-6">#{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-white truncate max-w-[200px]">{p.product_name}</p>
                      <p className="text-[10px] text-slate-500">{p.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-slate-400">{p.total_sales} sales</p>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <p className="text-sm font-bold text-white">₹{p.total_revenue.toLocaleString()}</p>
                    </div>
                    <Badge className={`text-[9px] ${p.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/50 text-slate-400'}`}>
                      {p.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {topProducts.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-sm">No product performance data</div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CEOProductPerformance;

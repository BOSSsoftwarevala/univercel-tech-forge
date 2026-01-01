import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, MonitorPlay, TrendingUp, DollarSign, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["product-demo-stats"],
    queryFn: async () => {
      const [productsRes, demosRes] = await Promise.all([
        supabase.from("products").select("product_id, is_active, lifetime_price"),
        supabase.from("demos").select("id, status")
      ]);

      const products = productsRes.data || [];
      const demos = demosRes.data || [];

      return {
        totalProducts: products.length,
        activeProducts: products.filter(p => p.is_active).length,
        totalDemos: demos.length,
        activeDemos: demos.filter(d => d.status === 'active').length,
        conversionRate: 12, // Placeholder
        totalRevenue: products.reduce((sum, p) => sum + (p.lifetime_price || 0), 0)
      };
    }
  });

  const statCards = [
    { label: "Total Products", value: stats?.totalProducts || 0, icon: Package, color: "from-violet-600 to-purple-600" },
    { label: "Active Products", value: stats?.activeProducts || 0, icon: Package, color: "from-emerald-600 to-teal-600" },
    { label: "Total Demos", value: stats?.totalDemos || 0, icon: MonitorPlay, color: "from-blue-600 to-cyan-600" },
    { label: "Conversion %", value: `${stats?.conversionRate || 0}%`, icon: TrendingUp, color: "from-amber-600 to-orange-600" },
    { label: "Total Revenue", value: `₹${((stats?.totalRevenue || 0) / 1000).toFixed(0)}K`, icon: DollarSign, color: "from-pink-600 to-rose-600" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Product Dashboard</h1>
        <p className="text-slate-400 text-sm">Read-only overview of products and demos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-4">
              {isLoading ? (
                <Skeleton className="h-16 w-full" />
              ) : (
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-slate-400">{stat.label}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white text-sm">Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 text-sm">View-only list coming from database</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white text-sm">Recent Demos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 text-sm">View-only list coming from database</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDashboard;

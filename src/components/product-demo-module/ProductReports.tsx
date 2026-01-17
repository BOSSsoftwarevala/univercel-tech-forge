/**
 * PRODUCT REPORTS
 * Product performance, demo usage, conversion rate
 */
import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Monitor, ShoppingCart, 
  Download, Calendar, RefreshCw 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

const productPerformance = [
  { name: 'School ERP Pro', sales: 245, demos: 89, conversion: 36, revenue: '$48,500' },
  { name: 'Hospital Management', sales: 128, demos: 56, conversion: 44, revenue: '$38,200' },
  { name: 'Restaurant POS', sales: 312, demos: 124, conversion: 40, revenue: '$31,200' },
  { name: 'Gym Management', sales: 89, demos: 42, conversion: 47, revenue: '$17,800' },
  { name: 'CRM Pro', sales: 156, demos: 78, conversion: 50, revenue: '$23,400' },
];

const demoStats = [
  { label: 'Total Demos Created', value: '1,248', change: '+12%' },
  { label: 'Active Demos', value: '456', change: '+8%' },
  { label: 'Expired Demos', value: '792', change: '-5%' },
  { label: 'Demo to Sale Rate', value: '42%', change: '+3%' },
];

export const ProductReports: React.FC = () => {
  const handleExport = (type: string) => {
    toast.success(`Exporting ${type} report...`);
  };

  const handleRefresh = () => {
    toast.info('Refreshing report data...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-violet-400" />
            Product & Demo Reports
          </h1>
          <p className="text-sm text-muted-foreground">
            Performance analytics and conversion metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('PDF')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Demo Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {demoStats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="bg-card/80 border-border/50">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {stat.label}
                </p>
                <div className="flex items-end justify-between mt-2">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <Badge 
                    variant="outline" 
                    className={stat.change.startsWith('+') 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-red-500/20 text-red-400'
                    }
                  >
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Product Performance Table */}
      <Card className="bg-card/80 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Product Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground uppercase tracking-wide">Product</th>
                  <th className="text-center py-3 px-4 text-xs text-muted-foreground uppercase tracking-wide">Sales</th>
                  <th className="text-center py-3 px-4 text-xs text-muted-foreground uppercase tracking-wide">Demos</th>
                  <th className="text-center py-3 px-4 text-xs text-muted-foreground uppercase tracking-wide">Conversion</th>
                  <th className="text-right py-3 px-4 text-xs text-muted-foreground uppercase tracking-wide">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {productPerformance.map((product, idx) => (
                  <motion.tr
                    key={product.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="font-medium text-foreground">{product.name}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-violet-400" />
                        <span className="text-foreground">{product.sales}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Monitor className="w-4 h-4 text-blue-400" />
                        <span className="text-foreground">{product.demos}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Progress value={product.conversion} className="flex-1 h-2" />
                        <span className="text-sm text-foreground w-10 text-right">{product.conversion}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-semibold text-emerald-400">{product.revenue}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Reports */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/80 border-border/50 hover:border-violet-500/30 transition-colors cursor-pointer" onClick={() => handleExport('Daily')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <p className="font-medium text-foreground">Daily Summary</p>
                <p className="text-xs text-muted-foreground">Today's activity overview</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/80 border-border/50 hover:border-emerald-500/30 transition-colors cursor-pointer" onClick={() => handleExport('Weekly')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="font-medium text-foreground">Weekly ROI</p>
                <p className="text-xs text-muted-foreground">Revenue & growth metrics</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/80 border-border/50 hover:border-blue-500/30 transition-colors cursor-pointer" onClick={() => handleExport('Country')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-foreground">Country Performance</p>
                <p className="text-xs text-muted-foreground">Regional breakdown</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

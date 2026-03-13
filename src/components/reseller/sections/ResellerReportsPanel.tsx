import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Percent, Activity, PieChart } from 'lucide-react';

const W = { dark: '#1a1f36', gray: '#858796', border: '#e3e6f0' };

export default function ResellerReportsPanel({ activeView }: { activeView: string }) {
  const titles: Record<string, string> = {
    rpt_sales: 'Sales Reports', rpt_commission: 'Commission Reports',
    rpt_performance: 'Performance Report', rpt_financial: 'Financial Summary',
  };
  const icons: Record<string, React.ElementType> = {
    rpt_sales: TrendingUp, rpt_commission: Percent, rpt_performance: Activity, rpt_financial: PieChart,
  };
  const Icon = icons[activeView] || TrendingUp;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold" style={{ color: W.dark }}>{titles[activeView] || 'Reports'}</h2>
        <button className="px-3 py-1.5 rounded text-[12px] font-medium text-white" style={{ background: '#4e73df' }}>Export</button>
      </div>
      <Card className="border" style={{ borderColor: W.border }}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-16">
            <Icon className="w-12 h-12 mb-3 opacity-20" style={{ color: W.gray }} />
            <p className="text-[13px]" style={{ color: W.gray }}>No report data available</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

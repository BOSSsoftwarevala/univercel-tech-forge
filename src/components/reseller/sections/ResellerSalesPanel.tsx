import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Target, BarChart3, Star, Activity } from 'lucide-react';

const W = { dark: '#1a1f36', gray: '#858796', border: '#e3e6f0', blue: '#4e73df' };

function Empty({ icon: Icon, msg }: { icon: React.ElementType; msg: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Icon className="w-12 h-12 mb-3 opacity-20" style={{ color: W.gray }} />
      <p className="text-[13px]" style={{ color: W.gray }}>{msg}</p>
    </div>
  );
}

export default function ResellerSalesPanel({ activeView }: { activeView: string }) {
  const titles: Record<string, string> = {
    sales_overview: 'Sales Overview',
    sales_pipeline: 'Sales Pipeline',
    sales_growth: 'Growth Analytics',
    sales_targets: 'Monthly Targets',
  };

  return (
    <div className="space-y-4">
      <h2 className="text-[18px] font-bold" style={{ color: W.dark }}>{titles[activeView] || 'Sales'}</h2>
      <Card className="border" style={{ borderColor: W.border }}>
        <CardContent className="p-6">
          <Empty icon={activeView === 'sales_targets' ? Target : TrendingUp} msg={`No ${(titles[activeView] || 'sales').toLowerCase()} data yet`} />
        </CardContent>
      </Card>
    </div>
  );
}

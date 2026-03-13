import { Card, CardContent } from '@/components/ui/card';
import { Users, Briefcase, Target, PieChart } from 'lucide-react';

const W = { dark: '#1a1f36', gray: '#858796', border: '#e3e6f0' };

export default function ResellerClientsPanel({ activeView }: { activeView: string }) {
  const titles: Record<string, string> = {
    cli_all: 'All Clients', cli_active: 'Active Clients',
    cli_leads: 'Leads', cli_segments: 'Client Segments',
  };
  const icons: Record<string, React.ElementType> = {
    cli_all: Users, cli_active: Briefcase, cli_leads: Target, cli_segments: PieChart,
  };
  const Icon = icons[activeView] || Users;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold" style={{ color: W.dark }}>{titles[activeView] || 'Clients'}</h2>
        <button className="px-3 py-1.5 rounded text-[12px] font-medium text-white" style={{ background: '#4e73df' }}>+ Add Client</button>
      </div>
      <Card className="border" style={{ borderColor: W.border }}>
        <CardContent className="p-0">
          <div className="grid grid-cols-5 gap-4 px-6 py-3 border-b text-[11px] font-semibold uppercase tracking-wider" style={{ borderColor: W.border, color: W.gray, background: '#f8f9fc' }}>
            <span>Client</span><span>Email</span><span>Status</span><span>Orders</span><span>Joined</span>
          </div>
          <div className="flex flex-col items-center justify-center py-16">
            <Icon className="w-10 h-10 mb-3 opacity-20" style={{ color: W.gray }} />
            <p className="text-[13px]" style={{ color: W.gray }}>No clients found</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

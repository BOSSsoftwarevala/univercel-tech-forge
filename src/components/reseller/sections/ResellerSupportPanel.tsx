import { Card, CardContent } from '@/components/ui/card';
import { HeadphonesIcon, FileText, AlertCircle } from 'lucide-react';

const W = { dark: '#1a1f36', gray: '#858796', border: '#e3e6f0' };

export default function ResellerSupportPanel({ activeView }: { activeView: string }) {
  const titles: Record<string, string> = {
    sup_tickets: 'Support Tickets', sup_knowledge: 'Knowledge Base', sup_escalations: 'Escalations',
  };
  const icons: Record<string, React.ElementType> = {
    sup_tickets: HeadphonesIcon, sup_knowledge: FileText, sup_escalations: AlertCircle,
  };
  const Icon = icons[activeView] || HeadphonesIcon;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold" style={{ color: W.dark }}>{titles[activeView] || 'Support'}</h2>
        {activeView === 'sup_tickets' && (
          <button className="px-3 py-1.5 rounded text-[12px] font-medium text-white" style={{ background: '#4e73df' }}>+ Open Ticket</button>
        )}
      </div>
      <Card className="border" style={{ borderColor: W.border }}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-16">
            <Icon className="w-12 h-12 mb-3 opacity-20" style={{ color: W.gray }} />
            <p className="text-[13px]" style={{ color: W.gray }}>No data yet</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

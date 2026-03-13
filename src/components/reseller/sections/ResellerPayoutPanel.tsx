import { Card, CardContent } from '@/components/ui/card';
import { Wallet, Banknote, FileText, CreditCard } from 'lucide-react';

const W = { dark: '#1a1f36', gray: '#858796', border: '#e3e6f0', green: '#1cc88a', yellow: '#f6c23e' };

export default function ResellerPayoutPanel({ activeView }: { activeView: string }) {
  const titles: Record<string, string> = {
    pay_balance: 'Wallet Balance', pay_request: 'Request Payout',
    pay_history: 'Payout History', pay_settings: 'Payout Settings',
  };

  return (
    <div className="space-y-4">
      <h2 className="text-[18px] font-bold" style={{ color: W.dark }}>{titles[activeView] || 'Payouts'}</h2>

      {activeView === 'pay_balance' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {[
            { label: 'Available Balance', value: '₹0', color: W.green },
            { label: 'Pending', value: '₹0', color: W.yellow },
            { label: 'Total Withdrawn', value: '₹0', color: '#4e73df' },
          ].map(s => (
            <Card key={s.label} className="border" style={{ borderColor: W.border, borderLeft: `4px solid ${s.color}` }}>
              <CardContent className="p-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: s.color }}>{s.label}</div>
                <div className="text-[22px] font-bold mt-1" style={{ color: W.dark }}>{s.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border" style={{ borderColor: W.border }}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-16">
            <Banknote className="w-12 h-12 mb-3 opacity-20" style={{ color: W.gray }} />
            <p className="text-[13px]" style={{ color: W.gray }}>No payout data yet</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

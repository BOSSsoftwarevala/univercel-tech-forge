import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Undo2, CheckCircle, Clock, DollarSign } from 'lucide-react';

const refunds = [
  { id: 'REF-001', invoice: 'INV-2024-145', client: 'CloudBase Pro', amount: 150, type: 'partial', status: 'completed', date: '2024-12-24' },
  { id: 'REF-002', invoice: 'INV-2024-138', client: 'StartupXYZ', amount: 890, type: 'full', status: 'pending', date: '2024-12-25' },
];

const RefundsScreen = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
        <Undo2 className="w-6 h-6 text-emerald-400" />
        Refunds & Adjustments
      </h2>
      <p className="text-slate-400">Process refunds and credit adjustments</p>
    </div>

    <div className="grid grid-cols-3 gap-4">
      <Card className="bg-slate-900/50 border-purple-500/30">
        <CardContent className="p-4">
          <DollarSign className="w-8 h-8 text-purple-400 mb-2" />
          <p className="text-2xl font-bold text-white">$1,040</p>
          <p className="text-sm text-slate-400">Total Refunded</p>
        </CardContent>
      </Card>
      <Card className="bg-slate-900/50 border-green-500/30">
        <CardContent className="p-4">
          <CheckCircle className="w-8 h-8 text-green-400 mb-2" />
          <p className="text-2xl font-bold text-white">1</p>
          <p className="text-sm text-slate-400">Completed</p>
        </CardContent>
      </Card>
      <Card className="bg-slate-900/50 border-amber-500/30">
        <CardContent className="p-4">
          <Clock className="w-8 h-8 text-amber-400 mb-2" />
          <p className="text-2xl font-bold text-white">1</p>
          <p className="text-sm text-slate-400">Pending</p>
        </CardContent>
      </Card>
    </div>

    <Card className="bg-slate-900/50 border-slate-700">
      <CardContent className="p-4">
        <div className="space-y-3">
          {refunds.map((refund) => (
            <div key={refund.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{refund.id}</span>
                  <Badge className={refund.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}>
                    {refund.status}
                  </Badge>
                  <Badge className="bg-slate-500/20 text-slate-400">{refund.type}</Badge>
                </div>
                <p className="text-sm text-slate-400 mt-1">{refund.client} • {refund.invoice}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-purple-400">${refund.amount}</p>
                <p className="text-xs text-slate-500">{refund.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default RefundsScreen;

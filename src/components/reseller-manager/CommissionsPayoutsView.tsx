import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useGlobalActions } from '@/hooks/useGlobalActions';
import {
  Clock,
  CheckCircle,
  DollarSign,
  TrendingDown,
  AlertTriangle,
  Calendar,
  User,
  Building2,
  Play,
  Pause,
  XCircle,
} from 'lucide-react';

interface PayoutRequest {
  id: string;
  resellerId: string;
  resellerName: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid' | 'held';
  requestDate: string;
  reason?: string;
  aiFlag?: string;
}

const mockPayouts: PayoutRequest[] = [
  { id: 'P001', resellerId: '1', resellerName: 'TechSoft Solutions', amount: 89000, status: 'pending', requestDate: '2024-01-18' },
  { id: 'P002', resellerId: '2', resellerName: 'Digital Dreams', amount: 72000, status: 'pending', requestDate: '2024-01-17' },
  { id: 'P003', resellerId: '4', resellerName: 'StartupBoost LLC', amount: 125000, status: 'approved', requestDate: '2024-01-15' },
  { id: 'P004', resellerId: '3', resellerName: 'CloudFirst IT', amount: 45000, status: 'held', requestDate: '2024-01-14', reason: 'Pending compliance review', aiFlag: 'Unusual pattern detected' },
];

export function CommissionsPayoutsView() {
  const { logToAudit } = useGlobalActions();
  const [payouts, setPayouts] = useState<PayoutRequest[]>(mockPayouts);

  const pendingAmount = payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const approvedAmount = payouts.filter(p => p.status === 'approved').reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = payouts.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

  const handleApprovePayout = async (payout: PayoutRequest) => {
    await logToAudit('approve_payout', 'reseller', { payoutId: payout.id, amount: payout.amount });
    setPayouts(prev => prev.map(p => p.id === payout.id ? { ...p, status: 'approved' } : p));
    toast.success(`₹${payout.amount.toLocaleString()} approved for ${payout.resellerName}`);
  };

  const handleHoldPayout = async (payout: PayoutRequest) => {
    await logToAudit('hold_payout', 'reseller', { payoutId: payout.id, amount: payout.amount });
    setPayouts(prev => prev.map(p => p.id === payout.id ? { ...p, status: 'held', reason: 'Manual hold by manager' } : p));
    toast.success(`Payout held for ${payout.resellerName}`);
  };

  const handleSchedulePayout = async (payout: PayoutRequest) => {
    await logToAudit('schedule_payout', 'reseller', { payoutId: payout.id, amount: payout.amount });
    toast.success(`Payout scheduled for next billing cycle`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'approved': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'paid': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'held': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Commissions & Payouts</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-amber-500/10 border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-amber-400" />
              <div>
                <p className="text-2xl font-bold text-amber-100">₹{pendingAmount.toLocaleString()}</p>
                <p className="text-sm text-amber-400/80">Pending Amount</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/10 border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-2xl font-bold text-emerald-100">₹{approvedAmount.toLocaleString()}</p>
                <p className="text-sm text-emerald-400/80">Approved Amount</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-cyan-500/10 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-cyan-400" />
              <div>
                <p className="text-2xl font-bold text-cyan-100">₹{paidAmount.toLocaleString()}</p>
                <p className="text-sm text-cyan-400/80">Paid Amount</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payout Requests */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="bg-slate-800/50">
          <TabsTrigger value="pending">Pending ({payouts.filter(p => p.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({payouts.filter(p => p.status === 'approved').length})</TabsTrigger>
          <TabsTrigger value="held">Held ({payouts.filter(p => p.status === 'held').length})</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        {['pending', 'approved', 'held', 'all'].map(tab => (
          <TabsContent key={tab} value={tab} className="space-y-3">
            {payouts
              .filter(p => tab === 'all' || p.status === tab)
              .map(payout => (
                <Card key={payout.id} className="bg-slate-900/50 border-slate-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{payout.resellerName}</span>
                            <Badge variant="outline" className={getStatusColor(payout.status)}>
                              {payout.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Calendar className="w-3 h-3" />
                            {new Date(payout.requestDate).toLocaleDateString()}
                            {payout.aiFlag && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-amber-400">
                                  <AlertTriangle className="w-3 h-3" />
                                  {payout.aiFlag}
                                </span>
                              </>
                            )}
                          </div>
                          {payout.reason && (
                            <p className="text-xs text-red-400 mt-1">{payout.reason}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xl font-bold text-white">₹{payout.amount.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          {payout.status === 'pending' && (
                            <>
                              <Button size="sm" onClick={() => handleApprovePayout(payout)} className="gap-1 bg-emerald-600 hover:bg-emerald-700">
                                <Play className="w-3 h-3" /> Approve
                              </Button>
                              <Button size="sm" variant="secondary" onClick={() => handleHoldPayout(payout)} className="gap-1">
                                <Pause className="w-3 h-3" /> Hold
                              </Button>
                            </>
                          )}
                          {payout.status === 'approved' && (
                            <Button size="sm" onClick={() => handleSchedulePayout(payout)} className="gap-1">
                              <Calendar className="w-3 h-3" /> Schedule
                            </Button>
                          )}
                          {payout.status === 'held' && (
                            <Button size="sm" variant="outline" onClick={() => handleApprovePayout(payout)} className="gap-1">
                              <CheckCircle className="w-3 h-3" /> Release
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default CommissionsPayoutsView;

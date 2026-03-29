import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { callEdgeRoute } from '@/lib/api/edge-client';
import {
  Search,
  MapPin,
  TrendingUp,
  DollarSign,
  Ticket,
  Shield,
  CheckCircle,
  Pause,
  Ban,
  Banknote,
  Flag,
  MoreHorizontal,
  Building2,
  Calendar,
  Phone,
  Mail,
} from 'lucide-react';

interface Reseller {
  id: string;
  reseller_code: string;
  business_name: string;
  owner_name: string;
  state: string;
  city: string;
  status: 'active' | 'pending' | 'suspended' | 'inactive' | 'rejected';
  salesToday: number;
  total_commission: number;
  wallet_available: number;
  wallet_pending: number;
  supportTickets: number;
  kyc_status: string;
  created_at: string;
  phone: string;
  email: string;
}

interface ResellersResponse {
  items: Reseller[];
}

export function AllResellersView() {
  const [resellers, setResellers] = useState<Reseller[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedReseller, setSelectedReseller] = useState<Reseller | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchResellers = async () => {
    setLoading(true);
    try {
      const response = await callEdgeRoute<ResellersResponse>('api-reseller', 'resellers', {
        query: {
          search: searchQuery || undefined,
          status: filterStatus !== 'all' ? filterStatus : undefined,
        },
      });

      setResellers(response.data.items || []);
    } catch (error) {
      console.error('Failed to load reseller directory', error);
      toast.error('Failed to load resellers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchResellers();
  }, [searchQuery, filterStatus]);

  const filteredResellers = resellers.filter((reseller) => {
    const matchesCountry = filterCountry === 'all' || reseller.state === filterCountry;
    return matchesCountry;
  });

  const uniqueCountries = [...new Set(resellers.map((reseller) => reseller.state).filter(Boolean))];

  const openReseller = (reseller: Reseller) => {
    setSelectedReseller(reseller);
    setDrawerOpen(true);
  };

  const updateResellerStatus = async (status: Reseller['status']) => {
    if (!selectedReseller) return;

    await callEdgeRoute('api-reseller', 'reseller/status', {
      method: 'POST',
      body: {
        reseller_id: selectedReseller.id,
        status,
        reason: status === 'suspended' ? 'Manual suspension by manager' : undefined,
      },
    });

    setResellers((prev) => prev.map((reseller) => (
      reseller.id === selectedReseller.id ? { ...reseller, status } : reseller
    )));
    setSelectedReseller((prev) => prev ? { ...prev, status } : prev);
  };

  const handleApprove = async () => {
    if (!selectedReseller) return;
    await updateResellerStatus('active');
    toast.success(`${selectedReseller.business_name} activated`);
  };

  const handleSuspend = async () => {
    if (!selectedReseller) return;
    await updateResellerStatus('suspended');
    toast.success(`${selectedReseller.business_name} suspended`);
  };

  const handleBlock = async () => {
    if (!selectedReseller) return;
    await updateResellerStatus('rejected');
    toast.success(`${selectedReseller.business_name} blocked permanently`);
  };

  const handleReleasePayout = async () => {
    if (!selectedReseller) return;
    if (selectedReseller.wallet_pending === 0) {
      toast.error('No pending commission to release');
      return;
    }

    toast.info(`Pending payout workflow for ${selectedReseller.business_name} remains to be wired`);
  };

  const handleFlag = async () => {
    if (!selectedReseller) return;
    toast.info(`${selectedReseller.business_name} flagged for review`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'suspended':
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'compliant':
        return 'text-emerald-400';
      case 'pending':
      case 'warning':
        return 'text-amber-400';
      case 'rejected':
      case 'non-compliant':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">All Resellers</h2>
        <Badge variant="outline" className="text-slate-400">
          {loading ? 'Loading...' : `${filteredResellers.length} of ${resellers.length} resellers`}
        </Badge>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by name, code, or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700"
          />
        </div>
        <Select value={filterCountry} onValueChange={setFilterCountry}>
          <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {uniqueCountries.map((country) => (
              <SelectItem key={country} value={country}>{country}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3">
        {filteredResellers.map((reseller) => (
          <Card
            key={reseller.id}
            className="bg-slate-900/50 border-slate-700/50 hover:bg-slate-800/50 cursor-pointer transition-colors"
            onClick={() => openReseller(reseller)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{reseller.business_name}</span>
                      <Badge variant="outline" className={getStatusColor(reseller.status)}>
                        {reseller.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span>{reseller.reseller_code}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {reseller.state || 'Unassigned'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-lg font-semibold text-white">₹{reseller.total_commission.toLocaleString()}</div>
                    <div className="text-xs text-slate-400">Total Commission</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-emerald-400">₹{reseller.wallet_pending.toLocaleString()}</div>
                    <div className="text-xs text-slate-400">Pending Wallet</div>
                  </div>
                  <div className={getComplianceColor(reseller.kyc_status)}>
                    <Shield className="w-5 h-5" />
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {!loading && filteredResellers.length === 0 && (
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-6 text-center text-slate-400">
              No resellers matched the current filters.
            </CardContent>
          </Card>
        )}
      </div>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-[500px] bg-slate-900 border-slate-700 overflow-y-auto">
          {selectedReseller && (
            <>
              <SheetHeader>
                <SheetTitle className="text-white flex items-center gap-2">
                  {selectedReseller.business_name}
                  <Badge variant="outline" className={getStatusColor(selectedReseller.status)}>
                    {selectedReseller.status}
                  </Badge>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-wrap gap-2 mt-4">
                <Button size="sm" onClick={handleApprove} className="gap-1 bg-emerald-600 hover:bg-emerald-700">
                  <CheckCircle className="w-4 h-4" /> Approve
                </Button>
                <Button size="sm" variant="secondary" onClick={handleSuspend} className="gap-1">
                  <Pause className="w-4 h-4" /> Suspend
                </Button>
                <Button size="sm" variant="destructive" onClick={handleBlock} className="gap-1">
                  <Ban className="w-4 h-4" /> Block
                </Button>
                <Button size="sm" variant="outline" onClick={handleReleasePayout} className="gap-1">
                  <Banknote className="w-4 h-4" /> Release Payout
                </Button>
                <Button size="sm" variant="outline" onClick={handleFlag} className="gap-1 text-amber-400 border-amber-500/30 hover:bg-amber-500/10">
                  <Flag className="w-4 h-4" /> Flag for Review
                </Button>
              </div>

              <Separator className="my-4 bg-slate-700" />

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase">Basic Info</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Reseller Code</p>
                    <p className="text-sm text-white">{selectedReseller.reseller_code}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Owner</p>
                    <p className="text-sm text-white">{selectedReseller.owner_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Location</p>
                    <p className="text-sm text-white">{selectedReseller.state || 'Unassigned'}{selectedReseller.city ? `, ${selectedReseller.city}` : ''}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Joined</p>
                    <p className="text-sm text-white flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(selectedReseller.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="text-sm text-white flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {selectedReseller.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="text-sm text-white flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {selectedReseller.email}
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="my-4 bg-slate-700" />

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase">Live KPIs</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-cyan-400" />
                        <div>
                          <p className="text-lg font-semibold text-white">₹{selectedReseller.salesToday.toLocaleString()}</p>
                          <p className="text-xs text-slate-400">Sales Today</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        <div>
                          <p className="text-lg font-semibold text-white">₹{selectedReseller.wallet_available.toLocaleString()}</p>
                          <p className="text-xs text-slate-400">Available Wallet</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-purple-400" />
                        <div>
                          <p className="text-lg font-semibold text-white">₹{selectedReseller.wallet_pending.toLocaleString()}</p>
                          <p className="text-xs text-slate-400">Pending Wallet</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-amber-400" />
                        <div>
                          <p className="text-lg font-semibold text-white">{selectedReseller.supportTickets}</p>
                          <p className="text-xs text-slate-400">Support Tickets</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-base text-white">Compliance Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className={`w-5 h-5 ${getComplianceColor(selectedReseller.kyc_status)}`} />
                        <span className="text-sm text-white">KYC Status</span>
                      </div>
                      <Badge variant="outline" className={getStatusColor(selectedReseller.status)}>
                        {selectedReseller.kyc_status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default AllResellersView;
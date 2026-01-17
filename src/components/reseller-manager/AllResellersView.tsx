import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useGlobalActions } from '@/hooks/useGlobalActions';
import {
  Search,
  Filter,
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
  code: string;
  companyName: string;
  ownerName: string;
  country: string;
  region: string;
  status: 'active' | 'hold' | 'suspended';
  salesToday: number;
  monthlyRevenue: number;
  commissionDue: number;
  supportTickets: number;
  complianceStatus: 'compliant' | 'warning' | 'non-compliant';
  joinDate: string;
  phone: string;
  email: string;
}

const mockResellers: Reseller[] = [
  { id: '1', code: 'RS-IN-001', companyName: 'TechSoft Solutions', ownerName: 'Rahul Sharma', country: 'India', region: 'Maharashtra', status: 'active', salesToday: 45000, monthlyRevenue: 890000, commissionDue: 89000, supportTickets: 2, complianceStatus: 'compliant', joinDate: '2024-01-15', phone: '+91 98765 43210', email: 'rahul@techsoft.in' },
  { id: '2', code: 'RS-IN-002', companyName: 'Digital Dreams', ownerName: 'Priya Patel', country: 'India', region: 'Gujarat', status: 'active', salesToday: 32000, monthlyRevenue: 720000, commissionDue: 72000, supportTickets: 0, complianceStatus: 'compliant', joinDate: '2024-02-20', phone: '+91 87654 32109', email: 'priya@digitaldreams.in' },
  { id: '3', code: 'RS-IN-003', companyName: 'CloudFirst IT', ownerName: 'Amit Kumar', country: 'India', region: 'Delhi', status: 'hold', salesToday: 0, monthlyRevenue: 450000, commissionDue: 45000, supportTickets: 5, complianceStatus: 'warning', joinDate: '2024-03-10', phone: '+91 76543 21098', email: 'amit@cloudfirst.in' },
  { id: '4', code: 'RS-US-001', companyName: 'StartupBoost LLC', ownerName: 'John Smith', country: 'USA', region: 'California', status: 'active', salesToday: 85000, monthlyRevenue: 1250000, commissionDue: 125000, supportTickets: 1, complianceStatus: 'compliant', joinDate: '2024-01-05', phone: '+1 555 123 4567', email: 'john@startupboost.com' },
  { id: '5', code: 'RS-UK-001', companyName: 'BritTech Partners', ownerName: 'Sarah Williams', country: 'UK', region: 'London', status: 'suspended', salesToday: 0, monthlyRevenue: 0, commissionDue: 0, supportTickets: 8, complianceStatus: 'non-compliant', joinDate: '2023-11-20', phone: '+44 20 1234 5678', email: 'sarah@brittech.co.uk' },
];

export function AllResellersView() {
  const { approve, suspend, logToAudit } = useGlobalActions();
  const [resellers] = useState<Reseller[]>(mockResellers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedReseller, setSelectedReseller] = useState<Reseller | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredResellers = resellers.filter(r => {
    const matchesSearch = r.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = filterCountry === 'all' || r.country === filterCountry;
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchesSearch && matchesCountry && matchesStatus;
  });

  const uniqueCountries = [...new Set(resellers.map(r => r.country))];

  const openReseller = (reseller: Reseller) => {
    setSelectedReseller(reseller);
    setDrawerOpen(true);
    logToAudit('view_reseller', 'reseller', { resellerId: reseller.id, code: reseller.code });
  };

  const handleApprove = async () => {
    if (!selectedReseller) return;
    await approve('reseller', selectedReseller.id, { action: 'activate' });
    toast.success(`${selectedReseller.companyName} activated`);
  };

  const handleSuspend = async () => {
    if (!selectedReseller) return;
    await suspend('reseller', selectedReseller.id, 'Manual suspension by manager');
    toast.success(`${selectedReseller.companyName} suspended`);
  };

  const handleBlock = async () => {
    if (!selectedReseller) return;
    await logToAudit('block_reseller', 'reseller', { resellerId: selectedReseller.id });
    toast.success(`${selectedReseller.companyName} blocked permanently`);
  };

  const handleReleasePayout = async () => {
    if (!selectedReseller) return;
    if (selectedReseller.commissionDue === 0) {
      toast.error('No pending commission to release');
      return;
    }
    await logToAudit('release_payout', 'reseller', { 
      resellerId: selectedReseller.id, 
      amount: selectedReseller.commissionDue 
    });
    toast.success(`₹${selectedReseller.commissionDue.toLocaleString()} released to ${selectedReseller.companyName}`);
  };

  const handleFlag = async () => {
    if (!selectedReseller) return;
    await logToAudit('flag_reseller', 'reseller', { resellerId: selectedReseller.id });
    toast.success(`${selectedReseller.companyName} flagged for review`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'hold': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'suspended': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-emerald-400';
      case 'warning': return 'text-amber-400';
      case 'non-compliant': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">All Resellers</h2>
        <Badge variant="outline" className="text-slate-400">
          {filteredResellers.length} of {resellers.length} resellers
        </Badge>
      </div>

      {/* Filters */}
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
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {uniqueCountries.map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
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
            <SelectItem value="hold">On Hold</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reseller List */}
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
                      <span className="font-semibold text-white">{reseller.companyName}</span>
                      <Badge variant="outline" className={getStatusColor(reseller.status)}>
                        {reseller.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span>{reseller.code}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {reseller.region}, {reseller.country}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-lg font-semibold text-white">₹{reseller.monthlyRevenue.toLocaleString()}</div>
                    <div className="text-xs text-slate-400">Monthly Revenue</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-emerald-400">₹{reseller.commissionDue.toLocaleString()}</div>
                    <div className="text-xs text-slate-400">Commission Due</div>
                  </div>
                  <div className={getComplianceColor(reseller.complianceStatus)}>
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
      </div>

      {/* Reseller Detail Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-[500px] bg-slate-900 border-slate-700 overflow-y-auto">
          {selectedReseller && (
            <>
              <SheetHeader>
                <SheetTitle className="text-white flex items-center gap-2">
                  {selectedReseller.companyName}
                  <Badge variant="outline" className={getStatusColor(selectedReseller.status)}>
                    {selectedReseller.status}
                  </Badge>
                </SheetTitle>
              </SheetHeader>

              {/* Quick Actions */}
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

              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase">Basic Info</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Reseller Code</p>
                    <p className="text-sm text-white">{selectedReseller.code}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Owner</p>
                    <p className="text-sm text-white">{selectedReseller.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Location</p>
                    <p className="text-sm text-white">{selectedReseller.region}, {selectedReseller.country}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Joined</p>
                    <p className="text-sm text-white flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(selectedReseller.joinDate).toLocaleDateString()}
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

              {/* Live KPIs */}
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
                          <p className="text-lg font-semibold text-white">₹{selectedReseller.monthlyRevenue.toLocaleString()}</p>
                          <p className="text-xs text-slate-400">Monthly Revenue</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-purple-400" />
                        <div>
                          <p className="text-lg font-semibold text-white">₹{selectedReseller.commissionDue.toLocaleString()}</p>
                          <p className="text-xs text-slate-400">Commission Due</p>
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
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className={`w-5 h-5 ${getComplianceColor(selectedReseller.complianceStatus)}`} />
                        <span className="text-sm text-white">Compliance Status</span>
                      </div>
                      <Badge variant="outline" className={getComplianceColor(selectedReseller.complianceStatus)}>
                        {selectedReseller.complianceStatus}
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

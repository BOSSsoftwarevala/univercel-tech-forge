import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Building2, MapPin, AlertTriangle, CheckCircle, PauseCircle, XCircle, TrendingUp, Users, Target } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

type FranchiseStatus = 'active' | 'suspended' | 'terminated';

interface ActiveFranchise {
  id: string;
  franchiseCode: string;
  businessName: string;
  ownerName: string;
  territory: string;
  city: string;
  state: string;
  status: FranchiseStatus;
  activeSince: string;
  leadQuality: number;
  conversionRate: number;
  slaAdherence: number;
  complaintRate: number;
  activeResellers: number;
}

const mockFranchises: ActiveFranchise[] = [
  {
    id: 'FR-001',
    franchiseCode: 'MUM-CENT-001',
    businessName: 'TechVentures Mumbai',
    ownerName: 'Rajesh Kumar',
    territory: 'Mumbai Central',
    city: 'Mumbai',
    state: 'Maharashtra',
    status: 'active',
    activeSince: '2023-06-15',
    leadQuality: 87,
    conversionRate: 23,
    slaAdherence: 94,
    complaintRate: 2,
    activeResellers: 15
  },
  {
    id: 'FR-002',
    franchiseCode: 'DEL-NOR-002',
    businessName: 'Digital Dynamics Delhi',
    ownerName: 'Amit Verma',
    territory: 'Delhi North',
    city: 'Delhi',
    state: 'Delhi',
    status: 'active',
    activeSince: '2023-08-20',
    leadQuality: 72,
    conversionRate: 18,
    slaAdherence: 88,
    complaintRate: 5,
    activeResellers: 12
  },
  {
    id: 'FR-003',
    franchiseCode: 'BLR-EAST-003',
    businessName: 'SaaS Solutions Bangalore',
    ownerName: 'Priya Nair',
    territory: 'Bangalore East',
    city: 'Bangalore',
    state: 'Karnataka',
    status: 'suspended',
    activeSince: '2023-04-10',
    leadQuality: 45,
    conversionRate: 8,
    slaAdherence: 62,
    complaintRate: 12,
    activeResellers: 0
  }
];

export function FMActiveFranchises() {
  const [franchises] = useState<ActiveFranchise[]>(mockFranchises);
  const [selectedFranchise, setSelectedFranchise] = useState<ActiveFranchise | null>(null);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFranchises = franchises.filter(f =>
    f.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.territory.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.franchiseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSuspend = () => {
    if (!suspendReason.trim()) {
      toast.error('Reason Required', {
        description: 'Suspension reason is mandatory'
      });
      return;
    }
    toast.success('Franchise Suspended', {
      description: `${selectedFranchise?.businessName} - No operations, no leads, no earnings`
    });
    setShowSuspendDialog(false);
    setSuspendReason('');
    setSelectedFranchise(null);
  };

  const handleReinstate = (franchise: ActiveFranchise) => {
    toast.success('Franchise Reinstated', {
      description: `${franchise.businessName} is now active`
    });
  };

  const getStatusBadge = (status: FranchiseStatus) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>;
      case 'suspended':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Suspended</Badge>;
      case 'terminated':
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Terminated</Badge>;
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Active Franchises
          </CardTitle>
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
            Edit Performance BLOCKED
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4">
          <Input
            placeholder="Search by name, territory, or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <ScrollArea className="h-[500px]">
          <div className="space-y-4">
            {filteredFranchises.map((franchise, index) => (
              <motion.div
                key={franchise.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${
                  franchise.status === 'suspended' 
                    ? 'border-yellow-500/30 bg-yellow-500/5' 
                    : 'border-border/50 bg-background/50'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{franchise.businessName}</span>
                      <Badge variant="outline" className="text-xs">{franchise.franchiseCode}</Badge>
                      {getStatusBadge(franchise.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {franchise.territory}
                      </span>
                      <span>{franchise.city}, {franchise.state}</span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {franchise.activeResellers} Resellers
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {franchise.status === 'active' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-yellow-500 border-yellow-500/30"
                        onClick={() => {
                          setSelectedFranchise(franchise);
                          setShowSuspendDialog(true);
                        }}
                      >
                        <PauseCircle className="h-4 w-4 mr-1" />
                        Suspend
                      </Button>
                    ) : franchise.status === 'suspended' ? (
                      <Button
                        size="sm"
                        onClick={() => handleReinstate(franchise)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Reinstate
                      </Button>
                    ) : null}
                  </div>
                </div>

                {/* Performance Metrics - READ ONLY */}
                <div className="grid grid-cols-4 gap-4 p-3 rounded-lg bg-muted/30">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Lead Quality</span>
                      <span className="font-medium">{franchise.leadQuality}%</span>
                    </div>
                    <Progress value={franchise.leadQuality} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Conversion</span>
                      <span className="font-medium">{franchise.conversionRate}%</span>
                    </div>
                    <Progress value={franchise.conversionRate} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">SLA Adherence</span>
                      <span className="font-medium">{franchise.slaAdherence}%</span>
                    </div>
                    <Progress value={franchise.slaAdherence} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Complaints</span>
                      <span className={`font-medium ${franchise.complaintRate > 5 ? 'text-destructive' : ''}`}>
                        {franchise.complaintRate}%
                      </span>
                    </div>
                    <Progress 
                      value={franchise.complaintRate * 10} 
                      className={`h-1.5 ${franchise.complaintRate > 5 ? '[&>div]:bg-destructive' : ''}`}
                    />
                  </div>
                </div>

                {franchise.status === 'suspended' && (
                  <div className="mt-3 p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
                    <p className="text-xs text-yellow-400 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Suspended: No operations, no leads, no earnings allowed
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        {/* Suspend Dialog */}
        <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-yellow-500">
                <PauseCircle className="h-5 w-5" />
                Suspend Franchise
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-sm font-medium">{selectedFranchise?.businessName}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  This will immediately stop all operations, lead processing, and earnings.
                </p>
              </div>
              <Textarea
                placeholder="Reason for suspension (mandatory)..."
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSuspendDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleSuspend}>
                Confirm Suspension
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, AlertTriangle, Ban, CheckCircle, Eye, TrendingUp, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Influencer {
  id: string;
  valaId: string;
  status: 'active' | 'suspended' | 'removed';
  region: string;
  audienceType: string;
  uniqueClicks: number;
  qualifiedLeads: number;
  conversionRate: number;
  fraudScore: number;
  joinedDate: string;
  suspensionReason?: string;
}

const mockInfluencers: Influencer[] = [
  { id: '1', valaId: 'VL-7382916', status: 'active', region: 'India - South', audienceType: 'Tech', uniqueClicks: 12500, qualifiedLeads: 312, conversionRate: 2.5, fraudScore: 5, joinedDate: '2023-08-15' },
  { id: '2', valaId: 'VL-2918374', status: 'active', region: 'India - North', audienceType: 'Finance', uniqueClicks: 8920, qualifiedLeads: 189, conversionRate: 2.1, fraudScore: 12, joinedDate: '2023-09-22' },
  { id: '3', valaId: 'VL-4827163', status: 'suspended', region: 'India - West', audienceType: 'Lifestyle', uniqueClicks: 3200, qualifiedLeads: 45, conversionRate: 1.4, fraudScore: 78, joinedDate: '2023-10-10', suspensionReason: 'High bot traffic detected' },
  { id: '4', valaId: 'VL-9173628', status: 'active', region: 'India - East', audienceType: 'Entertainment', uniqueClicks: 15800, qualifiedLeads: 421, conversionRate: 2.7, fraudScore: 8, joinedDate: '2023-07-05' },
  { id: '5', valaId: 'VL-3627194', status: 'active', region: 'India - Central', audienceType: 'Education', uniqueClicks: 6700, qualifiedLeads: 156, conversionRate: 2.3, fraudScore: 15, joinedDate: '2023-11-18' },
];

export function IMActiveInfluencers() {
  const { toast } = useToast();
  const [influencers, setInfluencers] = useState<Influencer[]>(mockInfluencers);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended'>('all');

  const handleSuspend = () => {
    if (!suspendReason.trim()) {
      toast({
        title: "Reason Required",
        description: "You must provide a reason for suspension.",
        variant: "destructive",
      });
      return;
    }

    if (selectedInfluencer) {
      setInfluencers(prev => prev.map(inf => 
        inf.id === selectedInfluencer.id 
          ? { ...inf, status: 'suspended' as const, suspensionReason: suspendReason }
          : inf
      ));
      toast({
        title: "Influencer Suspended",
        description: `${selectedInfluencer.valaId} has been suspended. They cannot promote or earn until reinstated.`,
      });
    }
    setShowSuspendDialog(false);
    setSuspendReason('');
    setSelectedInfluencer(null);
  };

  const handleReinstate = (inf: Influencer) => {
    setInfluencers(prev => prev.map(i => 
      i.id === inf.id ? { ...i, status: 'active' as const, suspensionReason: undefined } : i
    ));
    toast({
      title: "Influencer Reinstated",
      description: `${inf.valaId} has been reinstated to active status.`,
    });
  };

  const getFraudBadge = (score: number) => {
    if (score < 20) return { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: 'Low Risk' };
    if (score < 50) return { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', label: 'Medium Risk' };
    return { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'High Risk' };
  };

  const filteredInfluencers = influencers.filter(inf => 
    filterStatus === 'all' || inf.status === filterStatus
  );

  const activeCount = influencers.filter(i => i.status === 'active').length;
  const suspendedCount = influencers.filter(i => i.status === 'suspended').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Active Influencers</h2>
          <p className="text-sm text-muted-foreground">Manage influencer status • Performance read-only</p>
        </div>
        <div className="flex gap-2">
          <Badge 
            variant="outline" 
            className={`cursor-pointer ${filterStatus === 'all' ? 'bg-primary/20' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All ({influencers.length})
          </Badge>
          <Badge 
            variant="outline" 
            className={`cursor-pointer ${filterStatus === 'active' ? 'bg-emerald-500/20' : ''}`}
            onClick={() => setFilterStatus('active')}
          >
            Active ({activeCount})
          </Badge>
          <Badge 
            variant="outline" 
            className={`cursor-pointer ${filterStatus === 'suspended' ? 'bg-red-500/20' : ''}`}
            onClick={() => setFilterStatus('suspended')}
          >
            Suspended ({suspendedCount})
          </Badge>
        </div>
      </div>

      {/* Status Flow Indicator */}
      <Card className="bg-muted/30 border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-2 text-sm">
            <Badge variant="outline">Applied</Badge>
            <span className="text-muted-foreground">→</span>
            <Badge variant="outline" className="bg-blue-500/20">Approved</Badge>
            <span className="text-muted-foreground">→</span>
            <Badge variant="outline" className="bg-emerald-500/20">Active</Badge>
            <span className="text-muted-foreground">→</span>
            <Badge variant="outline" className="bg-red-500/20">Suspended / Removed</Badge>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Suspended influencers cannot promote or earn. Reason is mandatory.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredInfluencers.map((inf, index) => {
          const fraudBadge = getFraudBadge(inf.fraudScore);
          return (
            <motion.div
              key={inf.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`bg-card/50 border-border/50 ${inf.status === 'suspended' ? 'border-red-500/30' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          inf.status === 'active' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                        }`}>
                          {inf.status === 'active' ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Ban className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-mono font-semibold text-foreground">{inf.valaId}</p>
                          <p className="text-xs text-muted-foreground">Joined {inf.joinedDate}</p>
                        </div>
                        <Badge variant={inf.status === 'active' ? 'default' : 'destructive'}>
                          {inf.status.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className={fraudBadge.color}>
                          <Shield className="w-3 h-3 mr-1" />
                          {fraudBadge.label} ({inf.fraudScore}%)
                        </Badge>
                      </div>

                      {inf.suspensionReason && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          <span className="text-sm text-red-300">Suspension Reason: {inf.suspensionReason}</span>
                        </div>
                      )}

                      {/* READ-ONLY Performance Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-muted/30 rounded-lg">
                        <div className="text-center">
                          <p className="text-lg font-bold text-foreground">{inf.uniqueClicks.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Unique Clicks</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-foreground">{inf.qualifiedLeads}</p>
                          <p className="text-xs text-muted-foreground">Qualified Leads</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-foreground">{inf.conversionRate}%</p>
                          <p className="text-xs text-muted-foreground">Conversion Rate</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-foreground">{inf.audienceType}</p>
                          <p className="text-xs text-muted-foreground">Audience</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Stats are READ-ONLY • Manual edit BLOCKED
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {inf.status === 'active' ? (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedInfluencer(inf);
                            setShowSuspendDialog(true);
                          }}
                        >
                          <Ban className="w-4 h-4 mr-1" />
                          Suspend
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleReinstate(inf)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Reinstate
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Suspend Dialog */}
      <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend Influencer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Suspending <span className="font-mono font-semibold">{selectedInfluencer?.valaId}</span>
            </p>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              <p className="text-sm text-amber-300">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                Suspended influencers cannot promote or earn until reinstated.
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Suspension Reason (Required)</label>
              <Textarea
                placeholder="Provide a detailed reason for suspension..."
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuspendDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleSuspend}>Confirm Suspension</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

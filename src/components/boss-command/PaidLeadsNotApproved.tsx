import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, DollarSign, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatDistanceToNow, differenceInHours } from 'date-fns';

interface PaidLead {
  id: string;
  clientName: string;
  amount: number;
  source: string;
  paidAt: Date;
  slaBreach: boolean;
}

export function PaidLeadsNotApproved() {
  const [leads, setLeads] = useState<PaidLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchLeads = async () => {
    try {
      const { data } = await supabase
        .from('lead_conversions')
        .select('conversion_id, lead_id, revenue, timestamp')
        .order('timestamp', { ascending: true })
        .limit(50);

      const items: PaidLead[] = (data || []).map(item => {
        const paidAt = new Date(item.timestamp || Date.now());
        return {
          id: item.conversion_id,
          clientName: `Lead #${item.lead_id?.slice(0, 8) || 'Unknown'}`,
          amount: item.revenue || 0,
          source: 'Conversion',
          paidAt,
          slaBreach: differenceInHours(new Date(), paidAt) > 24
        };
      });

      setLeads(items);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    toast.success('Lead approved');
    setLeads(prev => prev.filter(l => l.id !== id));
    setProcessingId(null);
  };

  return (
    <div className="bg-[#0d0d12] border border-zinc-800/80 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/80 bg-[#0a0a0f]">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <h3 className="font-semibold text-white text-sm">PAID LEADS – NOT APPROVED</h3>
          {leads.filter(l => l.slaBreach).length > 0 && (
            <Badge className="bg-red-600 text-white text-xs animate-pulse">{leads.filter(l => l.slaBreach).length} SLA</Badge>
          )}
        </div>
      </div>

      <ScrollArea className="h-[200px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-32"><Loader2 className="w-5 h-5 animate-spin text-zinc-500" /></div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-zinc-500">
            <CheckCircle2 className="w-8 h-8 mb-2 text-emerald-500/50" /><span className="text-sm">No pending</span>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {leads.map((lead) => (
              <div key={lead.id} className={`p-3 hover:bg-zinc-800/30 ${lead.slaBreach ? 'bg-red-500/5 border-l-2 border-red-500' : ''}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white">{lead.clientName}</span>
                      <span className="text-sm font-mono text-emerald-400">₹{lead.amount.toLocaleString()}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 text-xs ${lead.slaBreach ? 'text-red-400' : 'text-zinc-500'}`}>
                      {lead.slaBreach && <AlertTriangle className="w-3 h-3" />}
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(lead.paidAt, { addSuffix: true })}
                    </div>
                  </div>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-8" onClick={() => handleApprove(lead.id)} disabled={processingId === lead.id}>
                    {processingId === lead.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><CheckCircle2 className="w-3 h-3 mr-1" />Approve</>}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

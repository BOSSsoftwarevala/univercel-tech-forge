import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { 
  Gavel, Bot, CheckCircle, XCircle, AlertTriangle, 
  Clock, ThumbsUp, ThumbsDown, ArrowRight, Brain
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AIVerdict {
  id: string;
  user_id: string;
  action_type: string;
  ai_verdict: 'approve' | 'risky' | 'fraud' | 'delay';
  ai_confidence: number;
  ai_reasoning: string;
  master_override: 'approve' | 'reject' | null;
  master_notes: string;
  created_at: string;
  status: 'pending' | 'resolved';
}

const AIVerdictAuthorityView = () => {
  const { user } = useAuth();
  const [verdicts, setVerdicts] = useState<AIVerdict[]>([]);
  const [selectedVerdict, setSelectedVerdict] = useState<AIVerdict | null>(null);
  const [overrideNotes, setOverrideNotes] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchVerdicts();
  }, []);

  const fetchVerdicts = async () => {
    // Simulated AI verdicts from action approval queue
    const { data } = await supabase
      .from('action_approval_queue')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    const mapped: AIVerdict[] = data?.map(item => ({
      id: item.id,
      user_id: item.user_id,
      action_type: item.action_type,
      ai_verdict: item.ai_risk_assessment ? 
        (item.risk_score && item.risk_score > 70 ? 'fraud' : 
         item.risk_score && item.risk_score > 40 ? 'risky' : 
         item.risk_score && item.risk_score > 20 ? 'delay' : 'approve') as 'approve' | 'risky' | 'fraud' | 'delay'
        : 'approve',
      ai_confidence: item.risk_score || Math.floor(Math.random() * 40 + 60),
      ai_reasoning: `AI analysis based on ${item.action_type} pattern, user behavior score, and risk indicators.`,
      master_override: (item.approval_status === 'approved' ? 'approve' : 
                       item.approval_status === 'rejected' ? 'reject' : null) as 'approve' | 'reject' | null,
      master_notes: item.rejection_reason || '',
      created_at: item.created_at || new Date().toISOString(),
      status: (item.approval_status === 'pending' ? 'pending' : 'resolved') as 'pending' | 'resolved'
    })) || [];

    setVerdicts(mapped);
  };

  const handleOverride = async (verdict: 'approve' | 'reject') => {
    if (!selectedVerdict) return;

    await supabase
      .from('action_approval_queue')
      .update({
        approval_status: verdict === 'approve' ? 'approved' : 'rejected',
        approved_by: user?.id,
        approved_at: new Date().toISOString(),
        rejection_reason: overrideNotes
      })
      .eq('id', selectedVerdict.id);

    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      role: 'master',
      module: 'ai-verdict',
      action: `master_override_${verdict}`,
      meta_json: {
        verdict_id: selectedVerdict.id,
        original_ai_verdict: selectedVerdict.ai_verdict,
        override_notes: overrideNotes
      }
    });

    toast.success(`AI verdict overridden: ${verdict.toUpperCase()}`);
    setIsDialogOpen(false);
    setSelectedVerdict(null);
    setOverrideNotes('');
    fetchVerdicts();
  };

  const getVerdictBadge = (verdict: string) => {
    const styles: Record<string, string> = {
      approve: 'bg-green-500/15 text-green-400 border-green-500/25',
      risky: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
      fraud: 'bg-red-500/15 text-red-400 border-red-500/25',
      delay: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    };
    return styles[verdict] || 'bg-gray-500/15 text-gray-400';
  };

  const pendingVerdicts = verdicts.filter(v => v.status === 'pending');
  const resolvedVerdicts = verdicts.filter(v => v.status === 'resolved');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Gavel className="w-7 h-7 text-amber-400" />
            AI Verdict Authority
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            AI verdicts with Master Admin human override capability
          </p>
        </div>
        <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 gap-2">
          <Brain className="w-4 h-4" />
          AI + Human Authority
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{pendingVerdicts.length}</p>
              <p className="text-xs text-gray-500">Pending Review</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {verdicts.filter(v => v.ai_verdict === 'approve').length}
              </p>
              <p className="text-xs text-gray-500">AI Approved</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-red-500/10 to-transparent border-red-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {verdicts.filter(v => v.ai_verdict === 'fraud').length}
              </p>
              <p className="text-xs text-gray-500">Fraud Detected</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Gavel className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {verdicts.filter(v => v.master_override).length}
              </p>
              <p className="text-xs text-gray-500">Master Overrides</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Pending Verdicts */}
        <div className="col-span-5">
          <Card className="p-4 bg-[#0a0a12] border-gray-800/50 h-[500px]">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Pending AI Verdicts
            </h3>
            <ScrollArea className="h-[430px]">
              <div className="space-y-3">
                {pendingVerdicts.map((verdict) => (
                  <div
                    key={verdict.id}
                    onClick={() => { setSelectedVerdict(verdict); setIsDialogOpen(true); }}
                    className="p-4 rounded-lg bg-gray-800/30 border border-gray-700/50 hover:border-amber-500/30 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className={getVerdictBadge(verdict.ai_verdict)}>
                        {verdict.ai_verdict.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {verdict.ai_confidence}% confident
                      </span>
                    </div>
                    <p className="text-sm text-white mb-1">{verdict.action_type}</p>
                    <p className="text-xs text-gray-500 line-clamp-2">{verdict.ai_reasoning}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Bot className="w-3 h-3 text-cyan-400" />
                      <span className="text-[10px] text-cyan-400">AI Recommendation</span>
                      <ArrowRight className="w-3 h-3 text-gray-600" />
                      <span className="text-[10px] text-amber-400">Awaiting Master Decision</span>
                    </div>
                  </div>
                ))}
                {pendingVerdicts.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No pending verdicts
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Resolved Verdicts */}
        <div className="col-span-7">
          <Card className="p-4 bg-[#0a0a12] border-gray-800/50 h-[500px]">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Resolved Verdicts
            </h3>
            <ScrollArea className="h-[430px]">
              <div className="space-y-2">
                {resolvedVerdicts.map((verdict) => (
                  <div
                    key={verdict.id}
                    className="p-3 rounded-lg bg-gray-800/20 border border-gray-800/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={getVerdictBadge(verdict.ai_verdict)}>
                          AI: {verdict.ai_verdict}
                        </Badge>
                        {verdict.master_override && (
                          <>
                            <ArrowRight className="w-4 h-4 text-gray-600" />
                            <Badge variant="outline" className={
                              verdict.master_override === 'approve' 
                                ? 'bg-green-500/15 text-green-400'
                                : 'bg-red-500/15 text-red-400'
                            }>
                              <Gavel className="w-3 h-3 mr-1" />
                              Master: {verdict.master_override}
                            </Badge>
                          </>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-600">
                        {new Date(verdict.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">{verdict.action_type}</p>
                  </div>
                ))}
                {resolvedVerdicts.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No resolved verdicts
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>

      {/* Override Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#0a0a12] border-gray-800 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Gavel className="w-5 h-5 text-amber-400" />
              Master Override Decision
            </DialogTitle>
          </DialogHeader>
          
          {selectedVerdict && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-cyan-400">AI Analysis</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={getVerdictBadge(selectedVerdict.ai_verdict)}>
                    {selectedVerdict.ai_verdict.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {selectedVerdict.ai_confidence}% confidence
                  </span>
                </div>
                <p className="text-sm text-gray-400">{selectedVerdict.ai_reasoning}</p>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Master Override Notes</label>
                <Textarea
                  value={overrideNotes}
                  onChange={(e) => setOverrideNotes(e.target.value)}
                  placeholder="Provide reasoning for override decision..."
                  className="bg-gray-800/50 border-gray-700 text-white"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => handleOverride('approve')}
                  className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleOverride('reject')}
                  className="flex-1 bg-red-600 hover:bg-red-700 gap-2"
                >
                  <ThumbsDown className="w-4 h-4" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIVerdictAuthorityView;

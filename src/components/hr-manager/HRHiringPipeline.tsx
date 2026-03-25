import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowRight, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Candidate {
  id: string;
  name: string;
  position: string;
  appliedDate: string;
  stage: 'applied' | 'interview' | 'approved' | 'rejected';
  notes: string[];
}

const mockCandidates: Candidate[] = [
  { id: 'CND-001', name: 'Candidate Alpha', position: 'Senior Developer', appliedDate: '2024-12-28', stage: 'interview', notes: ['Strong technical background'] },
  { id: 'CND-002', name: 'Candidate Beta', position: 'UI Designer', appliedDate: '2024-12-29', stage: 'applied', notes: [] },
  { id: 'CND-003', name: 'Candidate Gamma', position: 'Product Manager', appliedDate: '2024-12-25', stage: 'approved', notes: ['Excellent leadership skills', 'Pending admin activation'] },
  { id: 'CND-004', name: 'Candidate Delta', position: 'Data Analyst', appliedDate: '2024-12-20', stage: 'rejected', notes: ['Not a culture fit'] },
];

const stageConfig = {
  applied: { color: 'bg-zinc-500/20 text-zinc-400', label: 'Applied', icon: Users },
  interview: { color: 'bg-blue-500/20 text-blue-400', label: 'Interview', icon: MessageSquare },
  approved: { color: 'bg-emerald-500/20 text-emerald-400', label: 'Approved', icon: CheckCircle },
  rejected: { color: 'bg-red-500/20 text-red-400', label: 'Rejected', icon: XCircle },
};

export default function HRHiringPipeline() {
  const { toast } = useToast();
  const [candidates, setCandidates] = useState(mockCandidates);
  const [moveDialog, setMoveDialog] = useState<Candidate | null>(null);
  const [moveNote, setMoveNote] = useState('');
  const [targetStage, setTargetStage] = useState<Candidate['stage'] | null>(null);

  const handleMoveStage = () => {
    if (!moveNote.trim()) {
      toast({
        title: "Note Required",
        description: "Please add a note for this stage change.",
        variant: "destructive"
      });
      return;
    }

    if (moveDialog && targetStage) {
      console.log(`[AUDIT] Candidate ${moveDialog.id} moved to ${targetStage}. Note: ${moveNote}`);
      
      setCandidates(prev => prev.map(c => 
        c.id === moveDialog.id 
          ? { ...c, stage: targetStage, notes: [...c.notes, moveNote] }
          : c
      ));

      toast({
        title: "Stage Updated",
        description: targetStage === 'approved' 
          ? "Candidate approved. Admin notified for activation."
          : `Candidate moved to ${targetStage}`,
      });

      setMoveDialog(null);
      setMoveNote('');
      setTargetStage(null);
    }
  };

  const getNextStages = (current: Candidate['stage']): Candidate['stage'][] => {
    switch (current) {
      case 'applied': return ['interview', 'rejected'];
      case 'interview': return ['approved', 'rejected'];
      default: return [];
    }
  };

  const groupedCandidates = {
    applied: candidates.filter(c => c.stage === 'applied'),
    interview: candidates.filter(c => c.stage === 'interview'),
    approved: candidates.filter(c => c.stage === 'approved'),
    rejected: candidates.filter(c => c.stage === 'rejected'),
  };

  return (
    <div className="space-y-4">
      {/* Pipeline Stats */}
      <div className="grid grid-cols-4 gap-3">
        {(['applied', 'interview', 'approved', 'rejected'] as const).map(stage => {
          const config = stageConfig[stage];
          const StageIcon = config.icon;
          return (
            <Card key={stage} className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-4 text-center">
                <StageIcon className={`w-5 h-5 mx-auto mb-2 ${config.color.split(' ')[1]}`} />
                <p className="text-2xl font-mono font-bold">{groupedCandidates[stage].length}</p>
                <p className="text-xs text-zinc-500">{config.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pipeline Columns */}
      <div className="grid grid-cols-4 gap-4">
        {(['applied', 'interview', 'approved', 'rejected'] as const).map(stage => {
          const config = stageConfig[stage];
          return (
            <Card key={stage} className="bg-zinc-900/50 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className={`text-xs font-mono tracking-wider flex items-center gap-2 ${config.color.split(' ')[1]}`}>
                  <div className={`w-2 h-2 rounded-full ${config.color.split(' ')[0].replace('/20', '')}`} />
                  {config.label.toUpperCase()}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {groupedCandidates[stage].map((candidate, idx) => (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50"
                  >
                    <div className="mb-2">
                      <p className="font-medium text-sm">{candidate.name}</p>
                      <p className="text-xs text-zinc-500">{candidate.position}</p>
                    </div>
                    <div className="text-xs text-zinc-600 mb-2">
                      Applied: {new Date(candidate.appliedDate).toLocaleDateString()}
                    </div>
                    
                    {getNextStages(candidate.stage).length > 0 && (
                      <div className="flex gap-1">
                        {getNextStages(candidate.stage).map(nextStage => (
                          <Button
                            key={nextStage}
                            size="sm"
                            variant="ghost"
                            className="text-xs h-7 flex-1"
                            onClick={() => {
                              setMoveDialog(candidate);
                              setTargetStage(nextStage);
                            }}
                          >
                            {nextStage === 'rejected' ? 'Reject' : 'Move →'}
                          </Button>
                        ))}
                      </div>
                    )}

                    {stage === 'approved' && (
                      <div className="mt-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded">
                        <p className="text-xs text-amber-400">
                          Pending Admin Activation
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}

                {groupedCandidates[stage].length === 0 && (
                  <div className="text-center py-4 text-zinc-600 text-xs">
                    No candidates
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Move Stage Dialog */}
      <Dialog open={!!moveDialog} onOpenChange={() => setMoveDialog(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="font-mono">
              Move to {targetStage?.toUpperCase()}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-3 bg-zinc-800/50 rounded-lg">
              <p className="text-sm text-zinc-400">Candidate</p>
              <p className="font-medium">{moveDialog?.name}</p>
              <p className="text-xs text-zinc-500">{moveDialog?.position}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400">
                Note <span className="text-red-400">*</span>
              </label>
              <Textarea
                value={moveNote}
                onChange={(e) => setMoveNote(e.target.value)}
                placeholder="Add notes for this stage change..."
                className="bg-zinc-800 border-zinc-700 min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setMoveDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleMoveStage} className="gap-2">
              <ArrowRight className="w-4 h-4" />
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

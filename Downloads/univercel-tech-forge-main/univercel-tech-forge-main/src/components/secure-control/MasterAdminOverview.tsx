import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, AlertTriangle, Eye, Lock, Unlock, 
  ChevronDown, ChevronRight, CheckCircle, XCircle,
  TrendingUp, Users, FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface FlaggedItem {
  id: string;
  valaId: string;
  roleLevel: string;
  flagType: string;
  description: string;
  riskScore: number;
  detectedAt: string;
  status: 'pending' | 'reviewed' | 'overridden' | 'blocked';
  aiAnalysis: string;
  actionHistory: Array<{
    action: string;
    timestamp: string;
    hash: string;
  }>;
}

interface SystemSummary {
  totalActions: number;
  pendingReview: number;
  flaggedItems: number;
  blockedItems: number;
  systemHealth: number;
}

interface MasterAdminOverviewProps {
  summary: SystemSummary;
  flaggedItems: FlaggedItem[];
  onOverride: (itemId: string, reason: string) => void;
  onUnlock: (itemId: string, reason: string) => void;
  onBlock: (itemId: string, reason: string) => void;
}

export function MasterAdminOverview({
  summary,
  flaggedItems,
  onOverride,
  onUnlock,
  onBlock
}: MasterAdminOverviewProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FlaggedItem | null>(null);
  const [actionType, setActionType] = useState<'override' | 'unlock' | 'block'>('override');
  const [actionReason, setActionReason] = useState('');

  const handleAction = () => {
    if (!actionReason.trim()) {
      toast.error('Reason Required', { description: 'All Master Admin actions require documented reason' });
      return;
    }

    switch (actionType) {
      case 'override':
        onOverride(selectedItem!.id, actionReason);
        toast.success('Override Applied', { description: `Item ${selectedItem!.id} overridden` });
        break;
      case 'unlock':
        onUnlock(selectedItem!.id, actionReason);
        toast.success('System Unlocked', { description: `Item ${selectedItem!.id} unlocked` });
        break;
      case 'block':
        onBlock(selectedItem!.id, actionReason);
        toast.success('Item Blocked', { description: `Item ${selectedItem!.id} permanently blocked` });
        break;
    }

    setShowActionDialog(false);
    setActionReason('');
    setSelectedItem(null);
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-400';
    if (score >= 60) return 'text-orange-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="space-y-6 select-none">
      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="bg-neutral-900/50 border-neutral-800">
          <CardContent className="p-4 text-center">
            <FileText className="h-6 w-6 text-neutral-400 mx-auto mb-2" />
            <div className="text-2xl font-mono text-neutral-200">{summary.totalActions}</div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">Total Actions</div>
          </CardContent>
        </Card>
        
        <Card className="bg-neutral-900/50 border-neutral-800">
          <CardContent className="p-4 text-center">
            <Eye className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-mono text-yellow-400">{summary.pendingReview}</div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">Pending Review</div>
          </CardContent>
        </Card>
        
        <Card className="bg-neutral-900/50 border-neutral-800">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 text-orange-400 mx-auto mb-2" />
            <div className="text-2xl font-mono text-orange-400">{summary.flaggedItems}</div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">AI Flagged</div>
          </CardContent>
        </Card>
        
        <Card className="bg-neutral-900/50 border-neutral-800">
          <CardContent className="p-4 text-center">
            <XCircle className="h-6 w-6 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-mono text-red-400">{summary.blockedItems}</div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">Blocked</div>
          </CardContent>
        </Card>
        
        <Card className="bg-neutral-900/50 border-neutral-800">
          <CardContent className="p-4 text-center">
            <Shield className="h-6 w-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-mono text-green-400">{summary.systemHealth}%</div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">System Health</div>
          </CardContent>
        </Card>
      </div>

      {/* AI Flagged Items - Drill Down */}
      <Card className="bg-neutral-900/50 border-neutral-800">
        <CardHeader className="border-b border-neutral-800">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-neutral-300">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              AI Flagged Items
            </CardTitle>
            <Badge variant="outline" className="bg-neutral-800 text-neutral-400 border-neutral-700">
              Drill-down only on flag
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {flaggedItems.map((item) => (
                <motion.div
                  key={item.id}
                  className="rounded border border-neutral-800 overflow-hidden"
                >
                  {/* Summary Row */}
                  <div 
                    className={`p-4 cursor-pointer hover:bg-neutral-800/50 transition-colors ${
                      item.status === 'blocked' ? 'bg-red-950/20' : 'bg-neutral-950'
                    }`}
                    onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {expandedItem === item.id ? (
                          <ChevronDown className="h-4 w-4 text-neutral-500" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-neutral-500" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm text-neutral-300">{item.id}</span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                item.status === 'pending' ? 'bg-yellow-950/50 text-yellow-400 border-yellow-800/50' :
                                item.status === 'reviewed' ? 'bg-blue-950/50 text-blue-400 border-blue-800/50' :
                                item.status === 'overridden' ? 'bg-purple-950/50 text-purple-400 border-purple-800/50' :
                                'bg-red-950/50 text-red-400 border-red-800/50'
                              }`}
                            >
                              {item.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-neutral-500 mt-1">
                            {item.roleLevel} • {item.flagType} • {item.detectedAt}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-xs text-neutral-500 uppercase tracking-wider">Risk</div>
                          <div className={`font-mono text-lg ${getRiskColor(item.riskScore)}`}>
                            {item.riskScore}
                          </div>
                        </div>
                        <Progress 
                          value={item.riskScore} 
                          className={`w-24 h-2 bg-neutral-800 ${
                            item.riskScore >= 80 ? '[&>div]:bg-red-500' :
                            item.riskScore >= 60 ? '[&>div]:bg-orange-500' :
                            item.riskScore >= 40 ? '[&>div]:bg-yellow-500' :
                            '[&>div]:bg-green-500'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedItem === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-neutral-800"
                      >
                        <div className="p-4 space-y-4 bg-neutral-950/50">
                          {/* Description */}
                          <div>
                            <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
                              Description
                            </div>
                            <p className="text-sm text-neutral-400">{item.description}</p>
                          </div>

                          {/* AI Analysis */}
                          <div>
                            <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
                              AI Analysis
                            </div>
                            <div className="p-3 rounded bg-purple-950/20 border border-purple-900/30">
                              <p className="text-sm text-purple-300">{item.aiAnalysis}</p>
                            </div>
                          </div>

                          {/* Action History */}
                          <div>
                            <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
                              Action History
                            </div>
                            <div className="space-y-2">
                              {item.actionHistory.map((history, i) => (
                                <div key={i} className="p-2 rounded bg-neutral-900 border border-neutral-800 text-xs">
                                  <div className="flex items-center justify-between">
                                    <span className="text-neutral-400">{history.action}</span>
                                    <span className="text-neutral-500">{history.timestamp}</span>
                                  </div>
                                  <div className="font-mono text-neutral-600 mt-1">{history.hash}</div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Master Admin Actions */}
                          <div className="flex items-center gap-3 pt-4 border-t border-neutral-800">
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-purple-950/50 text-purple-400 border-purple-800/50 hover:bg-purple-900/50"
                              onClick={() => {
                                setSelectedItem(item);
                                setActionType('override');
                                setShowActionDialog(true);
                              }}
                            >
                              <Unlock className="h-4 w-4 mr-2" />
                              Override
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-green-950/50 text-green-400 border-green-800/50 hover:bg-green-900/50"
                              onClick={() => {
                                setSelectedItem(item);
                                setActionType('unlock');
                                setShowActionDialog(true);
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Unlock
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-red-950/50 text-red-400 border-red-800/50 hover:bg-red-900/50"
                              onClick={() => {
                                setSelectedItem(item);
                                setActionType('block');
                                setShowActionDialog(true);
                              }}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Block
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="bg-neutral-900 border-neutral-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-neutral-200">
              {actionType === 'override' && <Unlock className="h-5 w-5 text-purple-400" />}
              {actionType === 'unlock' && <CheckCircle className="h-5 w-5 text-green-400" />}
              {actionType === 'block' && <XCircle className="h-5 w-5 text-red-400" />}
              Master Admin {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-3 rounded bg-neutral-950 border border-neutral-800">
              <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Target</div>
              <div className="font-mono text-sm text-neutral-300">{selectedItem?.id}</div>
            </div>
            
            <div>
              <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
                Reason (Required • Logged Permanently)
              </div>
              <Textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Document reason for this action..."
                className="bg-neutral-950 border-neutral-800 text-neutral-300 resize-none"
                rows={4}
              />
            </div>
            
            <div className="p-3 rounded bg-yellow-950/20 border border-yellow-900/30">
              <p className="text-xs text-yellow-400 flex items-center gap-2">
                <AlertTriangle className="h-3 w-3" />
                This action is permanent and will be logged to the immutable ledger
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowActionDialog(false)}
              className="bg-neutral-800 text-neutral-300 border-neutral-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              className={`${
                actionType === 'override' ? 'bg-purple-900 hover:bg-purple-800 text-purple-100' :
                actionType === 'unlock' ? 'bg-green-900 hover:bg-green-800 text-green-100' :
                'bg-red-900 hover:bg-red-800 text-red-100'
              }`}
            >
              Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

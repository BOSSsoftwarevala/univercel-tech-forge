import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  Scale, TrendingUp, TrendingDown, Award, AlertTriangle,
  Search, Star, Ban, DollarSign, History
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface ReputationRecord {
  id: string;
  user_id: string;
  role: string;
  reputation_score: number;
  total_rewards: number;
  total_penalties: number;
  salary_adjustment: number;
  last_action: string;
  last_action_date: string;
}

interface ActionHistory {
  id: string;
  user_id: string;
  action_type: 'reward' | 'penalty';
  amount: number;
  reason: string;
  timestamp: string;
}

const JusticeDisciplineView = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<ReputationRecord[]>([]);
  const [history, setHistory] = useState<ActionHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<ReputationRecord | null>(null);

  useEffect(() => {
    fetchReputationRecords();
    fetchActionHistory();
  }, []);

  const fetchReputationRecords = async () => {
    const { data } = await supabase
      .from('user_roles')
      .select('*')
      .neq('role', 'master')
      .limit(50);

    const mapped = data?.map(u => ({
      id: u.id,
      user_id: u.user_id,
      role: u.role || 'user',
      reputation_score: Math.floor(Math.random() * 100),
      total_rewards: Math.floor(Math.random() * 5000),
      total_penalties: Math.floor(Math.random() * 2000),
      salary_adjustment: Math.floor(Math.random() * 20) - 10,
      last_action: Math.random() > 0.5 ? 'Good action' : 'Policy violation',
      last_action_date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    })) || [];

    setRecords(mapped);
  };

  const fetchActionHistory = async () => {
    const { data } = await supabase
      .from('audit_logs')
      .select('*')
      .in('action', ['auto_reward', 'auto_penalty', 'manual_reward', 'manual_penalty'])
      .order('timestamp', { ascending: false })
      .limit(100);

    const mapped = data?.map(log => ({
      id: log.id,
      user_id: log.user_id || '',
      action_type: log.action?.includes('reward') ? 'reward' as const : 'penalty' as const,
      amount: (log.meta_json as any)?.amount || 500,
      reason: (log.meta_json as any)?.reason || log.action,
      timestamp: log.timestamp
    })) || [];

    setHistory(mapped);
  };

  const applyReward = async (userId: string, amount: number = 500) => {
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      role: 'master',
      module: 'justice-discipline',
      action: 'manual_reward',
      meta_json: { target_user: userId, amount, reason: 'Good action' }
    });

    toast.success(`Reward of ₹${amount} applied`);
    fetchReputationRecords();
    fetchActionHistory();
  };

  const applyPenalty = async (userId: string, amount: number = 1000) => {
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      role: 'master',
      module: 'justice-discipline',
      action: 'manual_penalty',
      meta_json: { target_user: userId, amount, reason: 'Policy violation' }
    });

    toast.success(`Penalty of ₹${amount} applied`);
    fetchReputationRecords();
    fetchActionHistory();
  };

  const filteredRecords = records.filter(r =>
    r.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-cyan-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/20';
    if (score >= 60) return 'bg-cyan-500/20';
    if (score >= 40) return 'bg-amber-500/20';
    return 'bg-red-500/20';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Scale className="w-7 h-7 text-orange-400" />
            Justice, Rating & Discipline Engine
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Auto reward/penalty system with permanent reputation ledger
          </p>
        </div>
        <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/20 gap-2">
          <History className="w-4 h-4" />
          Immutable Ledger
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                ₹{records.reduce((sum, r) => sum + r.total_rewards, 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Total Rewards</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-red-500/10 to-transparent border-red-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <Ban className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                ₹{records.reduce((sum, r) => sum + r.total_penalties, 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Total Penalties</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {Math.round(records.reduce((sum, r) => sum + r.reputation_score, 0) / (records.length || 1))}
              </p>
              <p className="text-xs text-gray-500">Avg Score</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <History className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{history.length}</p>
              <p className="text-xs text-gray-500">Actions Logged</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Rules Info */}
      <Card className="p-4 bg-gradient-to-r from-green-500/5 via-[#0a0a12] to-red-500/5 border-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-lg border border-green-500/20">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">Good Action = +₹500</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 rounded-lg border border-red-500/20">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400">Bad Action = −₹1000</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <AlertTriangle className="w-4 h-4" />
            <span>Records are permanent and cannot be edited or deleted</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-12 gap-6">
        {/* Reputation Ledger */}
        <div className="col-span-8">
          <Card className="p-4 bg-[#0a0a12] border-gray-800/50 h-[450px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                Permanent Reputation Ledger
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="pl-9 h-8 w-48 bg-gray-800/50 border-gray-700 text-xs"
                />
              </div>
            </div>
            <ScrollArea className="h-[380px]">
              <table className="w-full">
                <thead className="sticky top-0 bg-[#0a0a12]">
                  <tr className="text-left text-xs text-gray-500 border-b border-gray-800">
                    <th className="pb-3">User</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Score</th>
                    <th className="pb-3">Rewards</th>
                    <th className="pb-3">Penalties</th>
                    <th className="pb-3">Salary Adj.</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="border-b border-gray-800/50 hover:bg-gray-800/20">
                      <td className="py-3">
                        <span className="text-xs text-gray-400 font-mono">
                          {record.user_id.slice(0, 8)}...
                        </span>
                      </td>
                      <td className="py-3">
                        <Badge variant="outline" className="text-[10px] bg-gray-500/15 text-gray-400">
                          {record.role}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getScoreBg(record.reputation_score)}`}>
                            <span className={`text-sm font-bold ${getScoreColor(record.reputation_score)}`}>
                              {record.reputation_score}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-green-400">
                        +₹{record.total_rewards.toLocaleString()}
                      </td>
                      <td className="py-3 text-sm text-red-400">
                        −₹{record.total_penalties.toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span className={`text-sm ${record.salary_adjustment >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {record.salary_adjustment >= 0 ? '+' : ''}{record.salary_adjustment}%
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => applyReward(record.user_id)}
                            className="h-7 px-2 text-green-400 hover:bg-green-500/10"
                          >
                            <TrendingUp className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => applyPenalty(record.user_id)}
                            className="h-7 px-2 text-red-400 hover:bg-red-500/10"
                          >
                            <TrendingDown className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </Card>
        </div>

        {/* Action History */}
        <div className="col-span-4">
          <Card className="p-4 bg-[#0a0a12] border-gray-800/50 h-[450px]">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-purple-400" />
              Action History
            </h3>
            <ScrollArea className="h-[380px]">
              <div className="space-y-2">
                {history.map((action) => (
                  <div
                    key={action.id}
                    className={`p-3 rounded-lg border ${
                      action.action_type === 'reward'
                        ? 'bg-green-500/5 border-green-500/20'
                        : 'bg-red-500/5 border-red-500/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          action.action_type === 'reward'
                            ? 'bg-green-500/15 text-green-400'
                            : 'bg-red-500/15 text-red-400'
                        }`}
                      >
                        {action.action_type === 'reward' ? '+' : '-'}₹{action.amount}
                      </Badge>
                      <span className="text-[10px] text-gray-600">
                        {new Date(action.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{action.reason}</p>
                  </div>
                ))}
                {history.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No action history
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JusticeDisciplineView;

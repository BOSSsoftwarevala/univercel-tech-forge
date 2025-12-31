import { motion } from 'framer-motion';
import { 
  User, Hash, Shield, Award, TrendingUp, 
  Users, DollarSign, BadgeCheck, Copy 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { ResellerAccountData, ResellerStatus } from '@/hooks/useResellerGuard';

interface ResellerIDCardProps {
  account: ResellerAccountData;
}

const statusColors: Record<ResellerStatus, { bg: string; text: string; border: string }> = {
  pending: { 
    bg: 'bg-amber-500/20', 
    text: 'text-amber-400', 
    border: 'border-amber-500/30' 
  },
  active: { 
    bg: 'bg-emerald-500/20', 
    text: 'text-emerald-400', 
    border: 'border-emerald-500/30' 
  },
  suspended: { 
    bg: 'bg-red-500/20', 
    text: 'text-red-400', 
    border: 'border-red-500/30' 
  },
};

export const ResellerIDCard = ({ account }: ResellerIDCardProps) => {
  const statusStyle = statusColors[account.status];
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(account.reseller_code);
    toast.success('Reseller code copied to clipboard');
  };

  const conversionRate = account.total_leads > 0 
    ? ((account.converted_leads / account.total_leads) * 100).toFixed(1)
    : '0.0';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-emerald-500/20 backdrop-blur-xl"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-white">Reseller Account</h3>
              <Badge 
                className={`${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} border`}
              >
                {account.status.toUpperCase()}
              </Badge>
            </div>
            <p className="text-sm text-slate-400">{account.masked_email}</p>
          </div>
        </div>
        
        {account.kyc_verified && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
            <BadgeCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">Verified</span>
          </div>
        )}
      </div>

      {/* Reseller Code */}
      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Hash className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Reseller Code</p>
              <p className="text-lg font-mono font-bold text-emerald-400">
                {account.reseller_code}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyCode}
            className="text-slate-400 hover:text-emerald-400"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Commission Tier */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 mb-6">
        <Award className="w-5 h-5 text-amber-400" />
        <div>
          <p className="text-xs text-slate-400">Commission Tier</p>
          <p className="font-semibold text-amber-400">{account.commission_tier}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
          <Users className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-white">{account.total_leads}</p>
          <p className="text-[10px] text-slate-400">Total Leads</p>
        </div>
        
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
          <TrendingUp className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-white">{conversionRate}%</p>
          <p className="text-[10px] text-slate-400">Conversion</p>
        </div>
        
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
          <DollarSign className="w-4 h-4 text-teal-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-white">₹{account.total_earnings.toLocaleString()}</p>
          <p className="text-[10px] text-slate-400">Earned</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ResellerIDCard;

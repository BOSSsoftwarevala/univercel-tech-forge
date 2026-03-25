import { motion } from 'framer-motion';
import { User, Shield, Star, Copy, CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { InfluencerStatus } from '@/hooks/useInfluencerGuard';

interface InfluencerIDCardProps {
  influencerId: string;
  fullName: string;
  email: string;
  maskedEmail: string | null;
  status: InfluencerStatus;
  kycStatus: 'pending' | 'submitted' | 'verified' | 'rejected' | null;
  commissionTier: string | null;
  isSuspended: boolean;
  totalClicks: number;
  totalConversions: number;
  totalEarned: number;
  joinedDate: string;
}

const InfluencerIDCard = ({
  influencerId,
  fullName,
  maskedEmail,
  status,
  kycStatus,
  commissionTier,
  isSuspended,
  totalClicks,
  totalConversions,
  totalEarned,
  joinedDate,
}: InfluencerIDCardProps) => {
  const copyInfluencerId = () => {
    navigator.clipboard.writeText(influencerId);
    toast.success('Influencer ID copied!');
  };

  const getStatusConfig = () => {
    if (isSuspended) {
      return {
        icon: XCircle,
        label: 'Suspended',
        className: 'bg-red-500/20 text-red-400 border-red-500/50',
      };
    }

    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          label: 'Pending',
          className: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
        };
      case 'approved':
        return {
          icon: CheckCircle,
          label: 'Approved',
          className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
        };
      case 'active':
        return {
          icon: Star,
          label: 'Active',
          className: 'bg-violet-500/20 text-violet-400 border-violet-500/50',
        };
      default:
        return {
          icon: AlertTriangle,
          label: 'Unknown',
          className: 'bg-slate-500/20 text-slate-400 border-slate-500/50',
        };
    }
  };

  const getKYCConfig = () => {
    switch (kycStatus) {
      case 'verified':
        return { label: 'KYC Verified', className: 'bg-emerald-500/20 text-emerald-400' };
      case 'submitted':
        return { label: 'KYC Pending', className: 'bg-amber-500/20 text-amber-400' };
      case 'rejected':
        return { label: 'KYC Rejected', className: 'bg-red-500/20 text-red-400' };
      default:
        return { label: 'KYC Required', className: 'bg-slate-500/20 text-slate-400' };
    }
  };

  const statusConfig = getStatusConfig();
  const kycConfig = getKYCConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-violet-950/30 border border-violet-500/20 backdrop-blur-xl"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{fullName}</h3>
            <p className="text-sm text-slate-400">{maskedEmail || 'Email hidden'}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className={statusConfig.className}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusConfig.label}
              </Badge>
              <Badge className={kycConfig.className}>
                {kycConfig.label}
              </Badge>
            </div>
          </div>
        </div>

        {commissionTier && (
          <Badge className="bg-gradient-to-r from-violet-500/30 to-cyan-500/30 text-violet-300 border border-violet-500/50">
            <Star className="w-3 h-3 mr-1" />
            {commissionTier} Tier
          </Badge>
        )}
      </div>

      {/* Influencer ID */}
      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 mb-1">Influencer ID</p>
            <p className="font-mono text-lg text-white">{influencerId.substring(0, 8)}...{influencerId.substring(influencerId.length - 4)}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={copyInfluencerId}
            className="border-violet-500/50 hover:bg-violet-500/20"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy ID
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 rounded-lg bg-slate-800/30 text-center">
          <p className="text-2xl font-bold text-cyan-400">{totalClicks.toLocaleString()}</p>
          <p className="text-xs text-slate-400">Total Clicks</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-800/30 text-center">
          <p className="text-2xl font-bold text-emerald-400">{totalConversions.toLocaleString()}</p>
          <p className="text-xs text-slate-400">Conversions</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-800/30 text-center">
          <p className="text-2xl font-bold text-violet-400">₹{totalEarned.toLocaleString()}</p>
          <p className="text-xs text-slate-400">Total Earned</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700/50">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Shield className="w-4 h-4" />
          <span>Protected by AI Fraud Guard</span>
        </div>
        <span className="text-xs text-slate-500">
          Member since {new Date(joinedDate).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
};

export default InfluencerIDCard;

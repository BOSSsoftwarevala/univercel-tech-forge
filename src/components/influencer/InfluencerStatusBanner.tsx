import { motion } from 'framer-motion';
import { AlertTriangle, Clock, CheckCircle, Shield, XCircle, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InfluencerStatus } from '@/hooks/useInfluencerGuard';

interface InfluencerStatusBannerProps {
  status: InfluencerStatus;
  kycStatus: 'pending' | 'submitted' | 'verified' | 'rejected' | null;
  isSuspended: boolean;
  suspensionReason: string | null;
  statusMessage: string;
  canEarn: boolean;
  canPromote: boolean;
  canWithdraw: boolean;
  onKYCClick?: () => void;
  onSupportClick?: () => void;
}

const InfluencerStatusBanner = ({
  status,
  kycStatus,
  isSuspended,
  suspensionReason,
  statusMessage,
  canEarn,
  canPromote,
  canWithdraw,
  onKYCClick,
  onSupportClick,
}: InfluencerStatusBannerProps) => {
  // Don't show banner if everything is good
  if (status === 'active' && kycStatus === 'verified' && !isSuspended) {
    return null;
  }

  const getBannerConfig = () => {
    if (isSuspended) {
      return {
        icon: XCircle,
        bgClass: 'from-red-500/20 to-red-600/10 border-red-500/50',
        iconClass: 'text-red-400',
        title: 'Account Suspended',
        description: suspensionReason || 'Your account has been suspended. Contact support for assistance.',
        showSupport: true,
        showKYC: false,
      };
    }

    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          bgClass: 'from-amber-500/20 to-yellow-600/10 border-amber-500/50',
          iconClass: 'text-amber-400',
          title: 'Pending Approval',
          description: 'Your account is under review. You cannot earn commissions until approved.',
          showSupport: true,
          showKYC: false,
        };
      case 'approved':
        return {
          icon: CheckCircle,
          bgClass: 'from-emerald-500/20 to-teal-600/10 border-emerald-500/50',
          iconClass: 'text-emerald-400',
          title: 'Account Approved!',
          description: kycStatus !== 'verified' 
            ? 'Complete KYC verification to enable withdrawals.' 
            : 'Your account is approved. Start promoting to earn!',
          showSupport: false,
          showKYC: kycStatus !== 'verified',
        };
      case 'active':
        if (kycStatus !== 'verified') {
          return {
            icon: FileText,
            bgClass: 'from-violet-500/20 to-purple-600/10 border-violet-500/50',
            iconClass: 'text-violet-400',
            title: 'KYC Required',
            description: 'Complete KYC verification to enable withdrawals.',
            showSupport: false,
            showKYC: true,
          };
        }
        return null;
      default:
        return null;
    }
  };

  const config = getBannerConfig();
  if (!config) return null;

  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl bg-gradient-to-r ${config.bgClass} border mb-6`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-lg bg-slate-900/50`}>
          <Icon className={`w-6 h-6 ${config.iconClass}`} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-semibold text-white">{config.title}</h3>
            <div className="flex gap-2">
              {!canEarn && (
                <Badge variant="outline" className="text-red-400 border-red-400/50">
                  Cannot Earn
                </Badge>
              )}
              {!canPromote && status !== 'pending' && (
                <Badge variant="outline" className="text-amber-400 border-amber-400/50">
                  Promotion Disabled
                </Badge>
              )}
              {!canWithdraw && status === 'active' && (
                <Badge variant="outline" className="text-violet-400 border-violet-400/50">
                  Withdrawals Locked
                </Badge>
              )}
            </div>
          </div>
          <p className="text-sm text-slate-400">{config.description}</p>
        </div>

        <div className="flex gap-2">
          {config.showKYC && onKYCClick && (
            <Button 
              size="sm" 
              onClick={onKYCClick}
              className="bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 border border-violet-500/50"
            >
              <FileText className="w-4 h-4 mr-2" />
              Complete KYC
            </Button>
          )}
          {config.showSupport && onSupportClick && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={onSupportClick}
              className="border-slate-600"
            >
              <Shield className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          )}
        </div>
      </div>

      {/* Capability Indicators */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${canEarn ? 'bg-emerald-400' : 'bg-red-400'}`} />
          <span className="text-xs text-slate-400">Earning: {canEarn ? 'Enabled' : 'Disabled'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${canPromote ? 'bg-emerald-400' : 'bg-red-400'}`} />
          <span className="text-xs text-slate-400">Promotion: {canPromote ? 'Active' : 'Blocked'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${canWithdraw ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          <span className="text-xs text-slate-400">Withdrawals: {canWithdraw ? 'Ready' : 'Locked'}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default InfluencerStatusBanner;

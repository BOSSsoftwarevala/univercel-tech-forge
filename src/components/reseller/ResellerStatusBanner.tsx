import { motion } from 'framer-motion';
import { 
  Clock, CheckCircle, XCircle, AlertTriangle, 
  ShieldCheck, FileCheck, Send, Wallet 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ResellerStatus, ResellerAccountData } from '@/hooks/useResellerGuard';

interface ResellerStatusBannerProps {
  status: ResellerStatus;
  account: ResellerAccountData | null;
  canSubmitLeads: boolean;
  canWithdraw: boolean;
  kycVerified: boolean;
  onRequestKYC?: () => void;
  onContactSupport?: () => void;
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'from-amber-500/20 to-yellow-500/20',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    title: 'Account Pending Activation',
    message: 'Your reseller account is under review. You cannot submit leads until activated.',
  },
  active: {
    icon: CheckCircle,
    color: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    title: 'Account Active',
    message: 'Your account is active. Submit quality leads and earn commissions!',
  },
  suspended: {
    icon: XCircle,
    color: 'from-red-500/20 to-rose-500/20',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-400',
    bgColor: 'bg-red-500/10',
    title: 'Account Suspended',
    message: 'Your account has been suspended. Contact support for assistance.',
  },
};

export const ResellerStatusBanner = ({
  status,
  account,
  canSubmitLeads,
  canWithdraw,
  kycVerified,
  onRequestKYC,
  onContactSupport
}: ResellerStatusBannerProps) => {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl bg-gradient-to-r ${config.color} border ${config.borderColor} mb-6`}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${config.bgColor}`}>
            <StatusIcon className={`w-5 h-5 ${config.textColor}`} />
          </div>
          <div>
            <h3 className={`font-semibold ${config.textColor}`}>{config.title}</h3>
            <p className="text-sm text-slate-400 mt-0.5">{config.message}</p>
            
            {/* Capability Indicators */}
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge 
                variant="outline" 
                className={canSubmitLeads 
                  ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' 
                  : 'border-slate-500/30 text-slate-400 bg-slate-500/10'
                }
              >
                <Send className="w-3 h-3 mr-1" />
                {canSubmitLeads ? 'Can Submit Leads' : 'Cannot Submit Leads'}
              </Badge>
              
              <Badge 
                variant="outline" 
                className={canWithdraw 
                  ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' 
                  : 'border-slate-500/30 text-slate-400 bg-slate-500/10'
                }
              >
                <Wallet className="w-3 h-3 mr-1" />
                {canWithdraw ? 'Can Withdraw' : 'Cannot Withdraw'}
              </Badge>
              
              <Badge 
                variant="outline" 
                className={kycVerified 
                  ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' 
                  : 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                }
              >
                <ShieldCheck className="w-3 h-3 mr-1" />
                {kycVerified ? 'KYC Verified' : 'KYC Pending'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {status === 'pending' && (
            <Button
              size="sm"
              variant="outline"
              onClick={onContactSupport}
              className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
            >
              <AlertTriangle className="w-4 h-4 mr-1" />
              Contact Support
            </Button>
          )}
          
          {status === 'active' && !kycVerified && (
            <Button
              size="sm"
              onClick={onRequestKYC}
              className="bg-emerald-600 hover:bg-emerald-500"
            >
              <FileCheck className="w-4 h-4 mr-1" />
              Complete KYC
            </Button>
          )}
          
          {status === 'suspended' && (
            <Button
              size="sm"
              variant="outline"
              onClick={onContactSupport}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <AlertTriangle className="w-4 h-4 mr-1" />
              Appeal Suspension
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ResellerStatusBanner;

import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, Clock, AlertTriangle, XCircle, 
  Shield, FileText, Users, Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FranchiseStatus } from '@/hooks/useFranchiseGuard';

interface FranchiseStatusBannerProps {
  status: FranchiseStatus;
  kycStatus: string;
  onKYCClick?: () => void;
  onSupportClick?: () => void;
}

export function FranchiseStatusBanner({ 
  status, 
  kycStatus,
  onKYCClick,
  onSupportClick 
}: FranchiseStatusBannerProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          icon: CheckCircle,
          title: 'Account Active',
          message: 'Your franchise account is fully operational.',
          bgColor: 'from-emerald-500/10 to-teal-500/10',
          borderColor: 'border-emerald-500/30',
          iconColor: 'text-emerald-400',
          capabilities: [
            { label: 'View Leads', icon: Users, enabled: true },
            { label: 'Assign Partners', icon: FileText, enabled: true },
            { label: 'Request Withdrawal', icon: Wallet, enabled: kycStatus === 'verified' },
          ]
        };
      case 'pending':
        return {
          icon: Clock,
          title: 'Account Pending',
          message: 'Your account is under review. Some features are limited.',
          bgColor: 'from-amber-500/10 to-orange-500/10',
          borderColor: 'border-amber-500/30',
          iconColor: 'text-amber-400',
          capabilities: [
            { label: 'View Leads', icon: Users, enabled: false },
            { label: 'Assign Partners', icon: FileText, enabled: false },
            { label: 'Request Withdrawal', icon: Wallet, enabled: false },
          ]
        };
      case 'suspended':
        return {
          icon: XCircle,
          title: 'Account Suspended',
          message: 'Your account has been suspended. Contact support for assistance.',
          bgColor: 'from-red-500/10 to-rose-500/10',
          borderColor: 'border-red-500/30',
          iconColor: 'text-red-400',
          capabilities: [
            { label: 'View Leads', icon: Users, enabled: false },
            { label: 'Assign Partners', icon: FileText, enabled: false },
            { label: 'Request Withdrawal', icon: Wallet, enabled: false },
          ]
        };
      default:
        return {
          icon: AlertTriangle,
          title: 'Unknown Status',
          message: 'Unable to determine account status.',
          bgColor: 'from-slate-500/10 to-gray-500/10',
          borderColor: 'border-slate-500/30',
          iconColor: 'text-slate-400',
          capabilities: []
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl bg-gradient-to-r ${config.bgColor} border ${config.borderColor}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg bg-slate-800/50`}>
            <StatusIcon className={`w-5 h-5 ${config.iconColor}`} />
          </div>
          <div>
            <h3 className={`font-semibold ${config.iconColor}`}>{config.title}</h3>
            <p className="text-sm text-slate-400 mt-0.5">{config.message}</p>
            
            {/* Capabilities */}
            <div className="flex flex-wrap gap-2 mt-3">
              {config.capabilities.map((cap) => (
                <div
                  key={cap.label}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs ${
                    cap.enabled 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-slate-700/50 text-slate-500'
                  }`}
                >
                  <cap.icon className="w-3 h-3" />
                  {cap.label}
                  {cap.enabled ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {kycStatus !== 'verified' && status !== 'suspended' && (
            <Button
              size="sm"
              variant="outline"
              onClick={onKYCClick}
              className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
            >
              <Shield className="w-4 h-4 mr-1" />
              Complete KYC
            </Button>
          )}
          {status === 'suspended' && (
            <Button
              size="sm"
              variant="outline"
              onClick={onSupportClick}
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              Contact Support
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

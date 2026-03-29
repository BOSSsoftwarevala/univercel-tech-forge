import React from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Shield, Star, Copy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FranchiseAccountData, FranchiseTerritoryData } from '@/hooks/useFranchiseGuard';

interface FranchiseIDCardProps {
  account: FranchiseAccountData | null;
  territory: FranchiseTerritoryData | null;
}

export function FranchiseIDCard({ account, territory }: FranchiseIDCardProps) {
  const [copied, setCopied] = React.useState(false);

  const copyFranchiseCode = () => {
    if (account?.franchise_code) {
      navigator.clipboard.writeText(account.franchise_code);
      setCopied(true);
      toast.success('Franchise code copied');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'suspended': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const getKYCStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-emerald-400';
      case 'pending': return 'text-amber-400';
      case 'rejected': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  if (!account) {
    return (
      <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 animate-pulse">
        <div className="h-20 bg-slate-700/50 rounded-lg" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/20">
            <Building2 className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{account.business_name}</h3>
            <p className="text-sm text-slate-400">{account.owner_name}</p>
          </div>
        </div>
        <Badge className={`${getStatusColor(account.status)} border`}>
          {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
        </Badge>
      </div>

      {/* Franchise Code */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50 mb-4">
        <span className="text-sm text-slate-400">Franchise ID:</span>
        <code className="text-indigo-400 font-mono font-semibold">{account.franchise_code}</code>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyFranchiseCode}
          className="ml-auto h-7 w-7 p-0"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>

      {/* Territory */}
      {territory && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 mb-4">
          <MapPin className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-white">{territory.territory_name}</span>
          {territory.is_exclusive && (
            <Badge className="ml-auto bg-amber-500/20 text-amber-400 border-amber-500/50">
              Exclusive
            </Badge>
          )}
        </div>
      )}

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-slate-800/50">
          <div className="flex items-center gap-2 mb-1">
            <Shield className={`w-4 h-4 ${getKYCStatusColor(account.kyc_status)}`} />
            <span className="text-xs text-slate-400">KYC Status</span>
          </div>
          <p className={`text-sm font-medium ${getKYCStatusColor(account.kyc_status)}`}>
            {account.kyc_status.charAt(0).toUpperCase() + account.kyc_status.slice(1)}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-800/50">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-400">Commission Rate</span>
          </div>
          <p className="text-sm font-medium text-white">{account.commission_rate}%</p>
        </div>

        <div className="p-3 rounded-lg bg-slate-800/50">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-400">Location</span>
          </div>
          <p className="text-sm font-medium text-white">
            {[account.city, account.state].filter(Boolean).join(', ') || 'Not set'}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-800/50">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-slate-400">Email</span>
          </div>
          <p className="text-sm font-medium text-white font-mono">{account.masked_email}</p>
        </div>
      </div>
    </motion.div>
  );
}

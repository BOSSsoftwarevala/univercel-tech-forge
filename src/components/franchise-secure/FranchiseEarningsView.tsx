import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Clock, ArrowUpRight, Eye, Lock } from 'lucide-react';
import { FranchiseWalletData } from '@/hooks/useFranchiseGuard';

interface FranchiseEarningsViewProps {
  wallet: FranchiseWalletData | null;
}

export function FranchiseEarningsView({ wallet }: FranchiseEarningsViewProps) {
  if (!wallet) {
    return (
      <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 animate-pulse">
        <div className="h-32 bg-slate-700/50 rounded-lg" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-emerald-400" />
          <h3 className="font-semibold text-white">Earnings Overview</h3>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-700/50">
          <Eye className="w-3 h-3 text-slate-400" />
          <span className="text-xs text-slate-400">View Only</span>
        </div>
      </div>

      {/* Main Balance */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Available Balance</p>
            <p className="text-3xl font-bold text-white">
              ₹{wallet.available_balance.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/20">
            <Wallet className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
        {wallet.pending_balance > 0 && (
          <div className="flex items-center gap-2 mt-2 text-sm">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400">
              ₹{wallet.pending_balance.toLocaleString()} pending
            </span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-slate-800/80">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-400">Total Earned</span>
          </div>
          <p className="text-lg font-semibold text-white">
            ₹{wallet.total_earned.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-xs text-emerald-400 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>Lifetime</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-800/80">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-400">Total Withdrawn</span>
          </div>
          <p className="text-lg font-semibold text-white">
            ₹{wallet.total_withdrawn.toLocaleString()}
          </p>
          <span className="text-xs text-slate-500">Completed payouts</span>
        </div>
      </div>

      {/* Read-only Notice */}
      <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
        <Lock className="w-4 h-4 text-slate-500" />
        <p className="text-xs text-slate-500">
          Commission is credited after valid payment confirmation. No auto-approve.
        </p>
      </div>
    </motion.div>
  );
}

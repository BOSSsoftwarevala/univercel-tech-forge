/**
 * Finance Security Banner — Displays active security policies across all finance sections
 */
import React from 'react';
import { ShieldAlert, Lock, Ban, Eye } from 'lucide-react';

const FinanceSecurityBanner: React.FC = () => {
  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-slate-900/90 border-b border-slate-700/50 text-xs">
      <div className="flex items-center gap-1.5 text-emerald-400">
        <ShieldAlert className="w-3.5 h-3.5" />
        <span className="font-semibold">SECURITY ACTIVE</span>
      </div>
      <span className="text-slate-600">|</span>
      <div className="flex items-center gap-1 text-red-400">
        <Ban className="w-3 h-3" />
        <span>No Refund</span>
      </div>
      <div className="flex items-center gap-1 text-amber-400">
        <Lock className="w-3 h-3" />
        <span>OTP Required</span>
      </div>
      <div className="flex items-center gap-1 text-blue-400">
        <Eye className="w-3 h-3" />
        <span>Fraud Detection</span>
      </div>
      <div className="flex items-center gap-1 text-purple-400">
        <Lock className="w-3 h-3" />
        <span>Boss Approval</span>
      </div>
    </div>
  );
};

export default FinanceSecurityBanner;

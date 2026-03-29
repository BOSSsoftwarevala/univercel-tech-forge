/**
 * Role Isolation Badge - Shows users their data is protected
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RoleIsolationBadgeProps {
  role: string;
  className?: string;
  showDetails?: boolean;
}

const RoleIsolationBadge: React.FC<RoleIsolationBadgeProps> = ({
  role,
  className = '',
  showDetails = false
}) => {
  const isManagement = ['master_admin_supreme', 'master_admin', 'super_admin', 'admin'].includes(role);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${className} ${
              isManagement 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-green-500/20 text-green-400 border border-green-500/30'
            }`}
          >
            <Shield className="w-3 h-3" />
            <span>ISOLATED</span>
            {isManagement ? (
              <Eye className="w-3 h-3" />
            ) : (
              <EyeOff className="w-3 h-3" />
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold">
              <Lock className="w-4 h-4 text-primary" />
              Role Isolation Active
            </div>
            <p className="text-muted-foreground">
              {isManagement 
                ? "As management, you can view user data but all access is logged and monitored."
                : "Your personal data (email, phone, name, address) is masked from other users. Only authorized management can access full details when needed."}
            </p>
            {showDetails && (
              <div className="pt-2 border-t border-border">
                <p className="text-muted-foreground">
                  Current Role: <span className="text-primary font-medium">{role.replace('_', ' ').toUpperCase()}</span>
                </p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RoleIsolationBadge;

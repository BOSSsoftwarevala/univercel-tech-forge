import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Globe, LogOut, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SafeAssistTrigger } from '@/components/support/SafeAssistTrigger';
import promiseIcon from '@/assets/promise-icon.jpg';

interface ControlHeaderProps {
  roleTitle: string;
  roleIcon?: React.ReactNode;
  scope: 'Global' | 'Continent' | 'Country' | 'Department';
  status?: 'normal' | 'alert';
  onLogout: () => void;
  children?: React.ReactNode;
}

export const ControlHeader = ({
  roleTitle,
  roleIcon,
  scope,
  status = 'normal',
  onLogout,
  children
}: ControlHeaderProps) => {
  const [promiseState, setPromiseState] = useState<'idle' | 'pending' | 'active'>('idle');

  const handlePromiseClick = () => {
    if (promiseState === 'idle') {
      setPromiseState('pending');
    } else if (promiseState === 'pending') {
      setPromiseState('active');
    } else {
      setPromiseState('idle');
    }
  };

  const scopeColors = {
    Global: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Continent: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    Country: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Department: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  const scopeIcons = {
    Global: <Globe className="w-3 h-3" />,
    Continent: <Globe className="w-3 h-3" />,
    Country: <Shield className="w-3 h-3" />,
    Department: <Shield className="w-3 h-3" />,
  };

  return (
    <header 
      className="sticky top-0 z-50 bg-[#0a0a12]/95 backdrop-blur-sm border-b border-gray-800/50"
      role="banner"
    >
      <div className="px-6 py-3 flex items-center justify-between">
        {/* Left: Role Identity */}
        <div className="flex items-center gap-4">
          {roleIcon && (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              {roleIcon}
            </div>
          )}
          <div className="flex flex-col">
            <h1 className="text-base font-semibold text-white tracking-tight">{roleTitle}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              {/* Scope Badge */}
              <Badge 
                variant="outline" 
                className={cn("text-[10px] uppercase tracking-wider font-medium gap-1", scopeColors[scope])}
              >
                {scopeIcons[scope]}
                {scope}
              </Badge>
              
              {/* Status Pill */}
              <Badge 
                variant="outline"
                className={cn(
                  "text-[10px] uppercase tracking-wider font-medium gap-1",
                  status === 'normal' 
                    ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                    : 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse'
                )}
              >
                {status === 'normal' ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}
                {status === 'normal' ? 'Normal' : 'Alert'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Promise Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePromiseClick}
            className={cn(
              "flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-medium text-sm transition-all",
              promiseState === 'active'
                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                : promiseState === 'pending'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 animate-pulse'
                : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-amber-500/50'
            )}
          >
            <img src={promiseIcon} alt="Promise" className="w-6 h-6 rounded-full object-cover" />
            <span className="hidden sm:inline">
              {promiseState === 'active' ? 'Active' : promiseState === 'pending' ? 'Promise' : 'No Task'}
            </span>
          </motion.button>

          {/* Safe Assist */}
          <SafeAssistTrigger variant="compact" />
          
          {children}
          
          {/* Secure Logout */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-gray-400 hover:text-white hover:bg-red-500/10 gap-2 transition-colors"
            aria-label="Secure Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-medium">Secure Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ControlHeader;

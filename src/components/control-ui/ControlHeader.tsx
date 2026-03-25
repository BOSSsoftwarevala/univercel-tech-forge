import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Globe, LogOut, AlertCircle, CheckCircle, Download, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SafeAssistTrigger } from '@/components/support/SafeAssistTrigger';
import { toast } from 'sonner';
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
      toast.success('Promise mode activated');
    } else if (promiseState === 'pending') {
      setPromiseState('active');
      toast.success('Task is now active');
    } else {
      setPromiseState('idle');
      toast.info('Promise mode deactivated');
    }
  };

  const handleDownloadAPK = useCallback(() => {
    toast.success('Downloading Software Vala Mobile App...', {
      description: 'APK file will be downloaded shortly'
    });
    const link = document.createElement('a');
    link.href = '/software-vala-app.apk';
    link.download = 'SoftwareVala-Mobile-v1.0.0.apk';
    link.click();
  }, []);

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
      className="sticky top-0 z-50 bg-[#0a0a12]/95 backdrop-blur-xl border-b border-gray-800/50"
      role="banner"
    >
      <div className="px-6 py-3 flex items-center justify-between">
        {/* Left: Role Identity */}
        <div className="flex items-center gap-4">
          {roleIcon && (
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30"
            >
              {roleIcon}
            </motion.div>
          )}
          <div className="flex flex-col">
            <h1 className="text-base font-bold text-white tracking-tight">{roleTitle}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              {/* Scope Badge */}
              <Badge 
                variant="outline" 
                className={cn("text-[10px] uppercase tracking-wider font-semibold gap-1 shadow-sm", scopeColors[scope])}
              >
                {scopeIcons[scope]}
                {scope}
              </Badge>
              
              {/* Status Pill */}
              <Badge 
                variant="outline"
                className={cn(
                  "text-[10px] uppercase tracking-wider font-semibold gap-1 shadow-sm",
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
          {/* Download APK Button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadAPK}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-semibold text-sm shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all border border-cyan-400/30"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden md:inline">Download App</span>
            <Download className="w-4 h-4" />
          </motion.button>

          {/* Promise Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePromiseClick}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all shadow-md",
              promiseState === 'active'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border border-green-400/50 shadow-green-500/30'
                : promiseState === 'pending'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border border-amber-400/50 animate-pulse shadow-amber-500/30'
                : 'bg-gray-800/80 text-gray-300 border border-gray-700/50 hover:border-amber-500/50 hover:bg-gray-800'
            )}
          >
            <img src={promiseIcon} alt="Promise" className="w-6 h-6 rounded-full object-cover ring-2 ring-white/20" />
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
            className="text-gray-400 hover:text-white hover:bg-red-500/20 gap-2 transition-all rounded-xl px-3"
            aria-label="Secure Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-medium">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ControlHeader;

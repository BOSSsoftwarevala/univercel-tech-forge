/**
 * ALERTS PREVIEW
 * Mini alert stack showing latest 3 alerts
 */

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, Info, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface Alert {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: string;
}

export const AlertsPreview: React.FC = () => {
  const navigate = useNavigate();
  
  const alerts: Alert[] = [
    { id: '1', message: 'Server CPU high', type: 'error', timestamp: '2m ago' },
    { id: '2', message: 'SLA breach risk', type: 'warning', timestamp: '5m ago' },
    { id: '3', message: 'Backup complete', type: 'info', timestamp: '8m ago' },
  ];

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-3 h-3 text-amber-400" />;
      case 'info':
        return <Info className="w-3 h-3 text-blue-400" />;
    }
  };

  const getAlertBg = (type: Alert['type']) => {
    switch (type) {
      case 'error': return 'bg-red-500/10 border-red-500/20';
      case 'warning': return 'bg-amber-500/10 border-amber-500/20';
      case 'info': return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  const handleViewAll = () => {
    navigate('/super-admin?role=boss_owner');
  };

  return (
    <div className="space-y-1.5">
      {alerts.map((alert) => (
        <motion.div
          key={alert.id}
          className={cn(
            "px-2 py-1.5 rounded-md border transition-colors cursor-pointer",
            getAlertBg(alert.type)
          )}
          whileHover={{ x: 2 }}
        >
          <div className="flex items-start gap-1.5">
            <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-white/80 truncate">{alert.message}</p>
              <p className="text-[9px] text-white/50">{alert.timestamp}</p>
            </div>
          </div>
        </motion.div>
      ))}
      
      <motion.button
        onClick={handleViewAll}
        className="w-full flex items-center justify-center gap-1 py-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors text-[10px] text-white/60 hover:text-white/80"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <span>View All Alerts</span>
        <ChevronRight className="w-3 h-3" />
      </motion.button>
    </div>
  );
};

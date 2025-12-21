import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RoleActivityCardProps {
  title: string;
  icon: LucideIcon;
  stats: {
    pending: number;
    active: number;
    done: number;
  };
  index?: number;
}

export function RoleActivityCard({
  title,
  icon: Icon,
  stats,
  index = 0
}: RoleActivityCardProps) {
  const total = stats.pending + stats.active + stats.done;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative p-6 rounded-2xl bg-slate-800/80 border border-slate-700/50 backdrop-blur-xl overflow-hidden cursor-pointer group"
      style={{
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Corner Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <motion.div 
          className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg"
          whileHover={{ rotate: 5 }}
          style={{
            boxShadow: '0 8px 24px rgba(20, 184, 166, 0.4)',
          }}
        >
          <Icon className="h-7 w-7 text-white" />
        </motion.div>
        
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white tracking-wide">{title}</h3>
          <p className="text-sm text-slate-400">Live Activity Monitor</p>
        </div>
        
        <Badge 
          className="bg-teal-500/20 text-teal-400 border-teal-500/30"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mr-1.5 animate-pulse" />
          {total} Total
        </Badge>
      </div>

      {/* Stats Grid - 2x2 style like the reference */}
      <div className="grid grid-cols-3 gap-4 relative z-10">
        {/* Pending */}
        <motion.div 
          className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center group/stat"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <span className="text-amber-400 font-bold text-lg">{stats.pending}</span>
          </div>
          <p className="text-xs text-amber-300/80 uppercase tracking-wider font-medium">Pending</p>
        </motion.div>

        {/* Active */}
        <motion.div 
          className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 text-center relative group/stat"
          whileHover={{ scale: 1.05 }}
        >
          {stats.active > 0 && (
            <div className="absolute top-2 right-2">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
              </span>
            </div>
          )}
          <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-teal-500/20 flex items-center justify-center">
            <span className="text-teal-400 font-bold text-lg">{stats.active}</span>
          </div>
          <p className="text-xs text-teal-300/80 uppercase tracking-wider font-medium">Active</p>
        </motion.div>

        {/* Done */}
        <motion.div 
          className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center group/stat"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <span className="text-emerald-400 font-bold text-lg">{stats.done}</span>
          </div>
          <p className="text-xs text-emerald-300/80 uppercase tracking-wider font-medium">Done</p>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div className="mt-5 relative z-10">
        <div className="h-2 rounded-full bg-slate-700/50 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(stats.done / Math.max(total, 1)) * 100}%` }}
            transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-400">
          <span>Completion Rate</span>
          <span className="text-teal-400 font-medium">{Math.round((stats.done / Math.max(total, 1)) * 100)}%</span>
        </div>
      </div>
    </motion.div>
  );
}

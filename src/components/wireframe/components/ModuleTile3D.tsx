import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GripVertical, MoreVertical, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ModuleTile3DProps {
  title: string;
  icon: LucideIcon;
  color: string;
  stats: {
    pending: number;
    active: number;
    done: number;
  };
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  onClick?: () => void;
  isDraggable?: boolean;
  isDark?: boolean;
  isActive?: boolean;
  index?: number;
}

export function ModuleTile3D({
  title,
  icon: Icon,
  color,
  stats,
  trend,
  trendValue,
  onClick,
  isDraggable = true,
  isDark = true,
  isActive = false,
  index = 0
}: ModuleTile3DProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMousePosition({ x, y });
  };

  const getGlowColor = () => {
    if (color.includes('teal')) return 'rgba(20, 184, 166, 0.6)';
    if (color.includes('purple')) return 'rgba(168, 85, 247, 0.6)';
    if (color.includes('indigo')) return 'rgba(99, 102, 241, 0.6)';
    if (color.includes('blue')) return 'rgba(59, 130, 246, 0.6)';
    if (color.includes('cyan')) return 'rgba(6, 182, 212, 0.6)';
    if (color.includes('sky')) return 'rgba(14, 165, 233, 0.6)';
    if (color.includes('emerald')) return 'rgba(16, 185, 129, 0.6)';
    if (color.includes('green')) return 'rgba(34, 197, 94, 0.6)';
    if (color.includes('rose')) return 'rgba(244, 63, 94, 0.6)';
    if (color.includes('violet')) return 'rgba(139, 92, 246, 0.6)';
    return 'rgba(6, 182, 212, 0.6)';
  };

  const getNeonBorderColor = () => {
    if (color.includes('teal')) return 'border-teal-400/50';
    if (color.includes('purple')) return 'border-purple-400/50';
    if (color.includes('indigo')) return 'border-indigo-400/50';
    if (color.includes('blue')) return 'border-blue-400/50';
    if (color.includes('cyan')) return 'border-cyan-400/50';
    if (color.includes('sky')) return 'border-sky-400/50';
    if (color.includes('emerald')) return 'border-emerald-400/50';
    if (color.includes('green')) return 'border-green-400/50';
    if (color.includes('rose')) return 'border-rose-400/50';
    if (color.includes('violet')) return 'border-violet-400/50';
    return 'border-cyan-400/50';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -30 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.02,
        z: 50
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className="perspective-1000 cursor-pointer h-full"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        animate={{
          rotateX: isHovered ? -mousePosition.y * 10 : 0,
          rotateY: isHovered ? mousePosition.x * 10 : 0,
          translateZ: isHovered ? 20 : 0,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className={`
          group relative p-6 rounded-2xl h-full
          border-2 ${getNeonBorderColor()}
          backdrop-blur-xl
          transition-all duration-300
          ${isDark 
            ? 'bg-slate-900/40' 
            : 'bg-white/40'
          }
        `}
        style={{
          transformStyle: 'preserve-3d',
          boxShadow: isHovered 
            ? `0 25px 50px -12px ${getGlowColor()}, 
               0 0 30px ${getGlowColor()},
               inset 0 1px 1px rgba(255,255,255,0.1)`
            : `0 10px 40px -15px rgba(0,0,0,0.3),
               0 0 15px ${getGlowColor().replace('0.6', '0.2')},
               inset 0 1px 1px rgba(255,255,255,0.05)`,
        }}
      >
        {/* Neon Edge Glow */}
        <div 
          className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
          style={{
            background: `linear-gradient(135deg, ${getGlowColor().replace('0.6', '0.1')}, transparent 50%, ${getGlowColor().replace('0.6', '0.1')})`,
          }}
        />

        {/* Active Pulse Ring */}
        {isActive && (
          <div className="absolute inset-0 rounded-2xl">
            <div 
              className="absolute inset-0 rounded-2xl animate-ping opacity-20"
              style={{ 
                border: `2px solid ${getGlowColor()}`,
                animationDuration: '2s'
              }}
            />
          </div>
        )}

        {/* Drag Handle */}
        {isDraggable && (
          <div 
            className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab z-10"
            style={{ transform: 'translateZ(30px) translateY(-50%)' }}
          >
            <GripVertical className="h-5 w-5 text-white/50" />
          </div>
        )}

        {/* More Options */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-3 top-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white/10"
          style={{ transform: 'translateZ(30px)' }}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>

        {/* Header with 3D Icon */}
        <div 
          className="flex items-center gap-4 mb-6"
          style={{ transform: 'translateZ(20px)' }}
        >
          <motion.div 
            className={`p-4 rounded-xl ${color} shadow-lg relative overflow-hidden`}
            animate={{ 
              boxShadow: isHovered 
                ? `0 10px 30px ${getGlowColor()}` 
                : `0 4px 15px ${getGlowColor().replace('0.6', '0.3')}`
            }}
          >
            {/* Icon Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
            <Icon className="h-7 w-7 text-white relative z-10" />
            
            {/* Active Pulse */}
            {isActive && (
              <div className="absolute -top-1 -right-1 h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </div>
            )}
          </motion.div>
          
          <div className="flex-1">
            <h3 className="font-bold text-xl tracking-wide">{title}</h3>
            {trend && (
              <motion.div 
                className={`flex items-center gap-1.5 text-sm mt-1 ${
                  trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-gray-400'
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span className="font-semibold">{trendValue}</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* 3D Stats Indicators */}
        <div 
          className="grid grid-cols-3 gap-3"
          style={{ transform: 'translateZ(15px)' }}
        >
          {/* Pending - Amber */}
          <motion.div 
            className="relative text-center p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-sm overflow-hidden group/stat"
            whileHover={{ scale: 1.05, y: -2 }}
            style={{
              boxShadow: '0 4px 20px rgba(245, 158, 11, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500/30 rounded-full blur-xl" />
            <motion.p 
              className="text-3xl font-bold text-amber-400 relative z-10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              {stats.pending}
            </motion.p>
            <p className="text-xs text-amber-300/70 mt-1 uppercase tracking-wider font-medium">Pending</p>
          </motion.div>

          {/* Active - Cyan */}
          <motion.div 
            className="relative text-center p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-sm overflow-hidden group/stat"
            whileHover={{ scale: 1.05, y: -2 }}
            style={{
              boxShadow: '0 4px 20px rgba(6, 182, 212, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-cyan-500/30 rounded-full blur-xl" />
            <motion.p 
              className="text-3xl font-bold text-cyan-400 relative z-10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.3 }}
            >
              {stats.active}
            </motion.p>
            <p className="text-xs text-cyan-300/70 mt-1 uppercase tracking-wider font-medium">Active</p>
            
            {/* Active pulse indicator */}
            {stats.active > 0 && (
              <div className="absolute top-2 right-2">
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                </span>
              </div>
            )}
          </motion.div>

          {/* Done - Green */}
          <motion.div 
            className="relative text-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-sm overflow-hidden group/stat"
            whileHover={{ scale: 1.05, y: -2 }}
            style={{
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500/30 rounded-full blur-xl" />
            <motion.p 
              className="text-3xl font-bold text-emerald-400 relative z-10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.4 }}
            >
              {stats.done}
            </motion.p>
            <p className="text-xs text-emerald-300/70 mt-1 uppercase tracking-wider font-medium">Done</p>
          </motion.div>
        </div>

        {/* Quick Actions Footer */}
        <motion.div 
          className="mt-5 flex items-center justify-between pt-4 border-t border-white/10"
          style={{ transform: 'translateZ(10px)' }}
        >
          <Badge 
            variant="outline" 
            className="text-xs px-3 py-1 bg-white/5 border-white/20 hover:bg-white/10 transition-colors"
          >
            View Details
          </Badge>
          <motion.div
            whileHover={{ x: 3 }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-white transition-colors"
          >
            <span>Open</span>
            <ExternalLink className="h-3 w-3" />
          </motion.div>
        </motion.div>

        {/* Bottom Glow Line */}
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            width: '60%',
            background: `linear-gradient(90deg, transparent, ${getGlowColor()}, transparent)`,
            filter: 'blur(2px)',
          }}
        />
      </motion.div>
    </motion.div>
  );
}

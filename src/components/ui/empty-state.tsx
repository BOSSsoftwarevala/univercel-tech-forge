import React from 'react';
import { motion } from 'framer-motion';
import { Database } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function EmptyState({ 
  icon, 
  title = 'No data yet', 
  description = 'Data will appear here once available',
  className = ''
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-8 text-center ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center mb-3">
        {icon || <Database className="w-6 h-6 text-muted-foreground/50" />}
      </div>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-xs text-muted-foreground/60 mt-1">{description}</p>
    </motion.div>
  );
}

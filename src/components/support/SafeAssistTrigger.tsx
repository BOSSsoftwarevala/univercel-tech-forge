/**
 * Safe Assist Trigger Button
 * Compact button for header integration - opens Safe Assist modal
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SafeAssistUser } from './SafeAssistUser';

interface SafeAssistTriggerProps {
  variant?: 'icon' | 'compact' | 'full';
  className?: string;
}

export function SafeAssistTrigger({ variant = 'compact', className }: SafeAssistTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {variant === 'icon' ? (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsOpen(true)}
                className={className}
              >
                <Headphones className="w-5 h-5" />
              </Button>
            ) : variant === 'compact' ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-500/10 border border-green-500/30 text-green-500 hover:bg-green-500/20 transition-all text-xs font-medium ${className}`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Safe Assist</span>
              </motion.button>
            ) : (
              <Button 
                variant="outline"
                onClick={() => setIsOpen(true)}
                className={`gap-2 border-green-500/30 text-green-500 hover:bg-green-500/10 ${className}`}
              >
                <Shield className="w-4 h-4" />
                Safe Assist
              </Button>
            )}
          </TooltipTrigger>
          <TooltipContent>
            <p>Get AI-powered support assistance</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AnimatePresence>
        {isOpen && (
          <SafeAssistUser onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

export default SafeAssistTrigger;

/**
 * One-Click Demo Component
 * Opens demo instantly with single click - no friction
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Maximize2, Monitor, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface OneClickDemoProps {
  demoUrl?: string;
  demoTitle?: string;
  thumbnailUrl?: string;
  className?: string;
  variant?: 'button' | 'card' | 'inline';
}

const OneClickDemo: React.FC<OneClickDemoProps> = ({
  demoUrl = '/demo-preview',
  demoTitle = 'Live Demo',
  thumbnailUrl,
  className = '',
  variant = 'button'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleOpenDemo = () => {
    setIsOpen(true);
    setIsLoading(false);
  };

  const handleOpenExternal = () => {
    window.open(demoUrl, '_blank');
  };

  if (variant === 'button') {
    return (
      <>
        <Button
          onClick={handleOpenDemo}
          className={`bg-gradient-to-r from-neon-green to-neon-teal hover:opacity-90 text-black font-semibold ${className}`}
        >
          <Play className="w-4 h-4 mr-2 fill-current" />
          Try Demo Now
        </Button>

        <DemoModal 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)}
          demoUrl={demoUrl}
          demoTitle={demoTitle}
          isLoading={isLoading}
          isFullscreen={isFullscreen}
          setIsFullscreen={setIsFullscreen}
          handleOpenExternal={handleOpenExternal}
        />
      </>
    );
  }

  if (variant === 'card') {
    return (
      <>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOpenDemo}
          className={`relative cursor-pointer overflow-hidden rounded-xl border border-primary/30 bg-card group ${className}`}
        >
          {/* Thumbnail */}
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-neon-purple/20 flex items-center justify-center relative">
            {thumbnailUrl ? (
              <img src={thumbnailUrl} alt={demoTitle} className="w-full h-full object-cover" />
            ) : (
              <Monitor className="w-16 h-16 text-primary/50" />
            )}
            
            {/* Play Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                <Play className="w-8 h-8 text-primary fill-current" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="p-4">
            <h3 className="font-semibold text-foreground">{demoTitle}</h3>
            <p className="text-xs text-muted-foreground mt-1">Click to launch instantly</p>
          </div>

          {/* One-Click Badge */}
          <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-neon-green/20 border border-neon-green/40 text-xs text-neon-green font-medium">
            1-Click Demo
          </div>
        </motion.div>

        <DemoModal 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)}
          demoUrl={demoUrl}
          demoTitle={demoTitle}
          isLoading={isLoading}
          isFullscreen={isFullscreen}
          setIsFullscreen={setIsFullscreen}
          handleOpenExternal={handleOpenExternal}
        />
      </>
    );
  }

  // Inline variant
  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpenDemo}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors ${className}`}
      >
        <Play className="w-4 h-4 fill-current" />
        <span className="font-medium">Try Demo</span>
      </motion.button>

      <DemoModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        demoUrl={demoUrl}
        demoTitle={demoTitle}
        isLoading={isLoading}
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
        handleOpenExternal={handleOpenExternal}
      />
    </>
  );
};

// Demo Modal Component
interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  demoUrl: string;
  demoTitle: string;
  isLoading: boolean;
  isFullscreen: boolean;
  setIsFullscreen: (val: boolean) => void;
  handleOpenExternal: () => void;
}

const DemoModal: React.FC<DemoModalProps> = ({
  isOpen,
  onClose,
  demoUrl,
  demoTitle,
  isLoading,
  isFullscreen,
  setIsFullscreen,
  handleOpenExternal
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent 
            className={`${isFullscreen ? 'max-w-[95vw] h-[95vh]' : 'max-w-4xl h-[80vh]'} p-0 overflow-hidden`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-sm font-medium text-foreground">{demoTitle}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleOpenExternal}
                  className="h-8"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="h-8"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Demo Content */}
            <div className="flex-1 relative bg-background">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : (
                <iframe
                  src={demoUrl}
                  className="w-full h-full border-0"
                  title={demoTitle}
                  sandbox="allow-scripts allow-same-origin allow-forms"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default OneClickDemo;

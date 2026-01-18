/**
 * LIVE CHAT BLOCK
 * Shows live support chat status with online indicator
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface LiveChatBlockProps {
  onOpenChat?: () => void;
}

export const LiveChatBlock: React.FC<LiveChatBlockProps> = ({ onOpenChat }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount] = useState(3);

  const handleClick = () => {
    setIsOpen(true);
    onOpenChat?.();
  };

  return (
    <>
      <motion.button
        onClick={handleClick}
        className="w-full flex items-center justify-between px-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-emerald-500/20 flex items-center justify-center">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-left">
            <p className="text-[11px] font-medium text-white">Live Support Chat</p>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] text-emerald-400">Online</span>
            </div>
          </div>
        </div>
        {unreadCount > 0 && (
          <Badge className="h-4 w-4 p-0 flex items-center justify-center text-[9px] bg-red-500 hover:bg-red-500">
            {unreadCount}
          </Badge>
        )}
      </motion.button>

      {/* Chat Slide Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-card border-l border-border z-50 flex flex-col"
            >
              <div className="p-3 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">Live Support</h3>
                  <p className="text-xs text-muted-foreground">{unreadCount} active chats</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-md hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 p-3 overflow-y-auto space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">User #{i}</span>
                      <span className="text-[10px] text-muted-foreground">2m ago</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">
                      Need help with order processing...
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-border">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 h-8 px-2 text-xs rounded-md bg-muted border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button className="h-8 w-8 rounded-md bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors">
                    <Send className="w-3.5 h-3.5 text-primary-foreground" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

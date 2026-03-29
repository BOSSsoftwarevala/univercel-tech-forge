import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingChatButtonProps {
  unreadCount?: number;
  onClick?: () => void;
}

const FloatingChatButton = ({ unreadCount = 5, onClick }: FloatingChatButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasUnread = unreadCount > 0;

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative w-14 h-14 rounded-full p-0
          bg-gradient-to-br from-primary to-neon-blue
          hover:from-primary/90 hover:to-neon-blue/90
          shadow-lg transition-all duration-300
          ${hasUnread ? 'shadow-neon-blue/50 animate-pulse' : 'shadow-primary/30'}
        `}
      >
        {/* Glow Effect */}
        {hasUnread && (
          <div className="absolute inset-0 rounded-full bg-neon-blue/30 blur-md animate-pulse" />
        )}
        
        <MessageCircle className="w-6 h-6 text-white relative z-10" />
        
        {/* Unread Badge */}
        {hasUnread && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white z-20"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </Button>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap"
          >
            <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg">
              <p className="text-xs font-medium text-foreground">Internal Secure Chat</p>
              {hasUnread && (
                <p className="text-[10px] text-muted-foreground">{unreadCount} unread messages</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FloatingChatButton;

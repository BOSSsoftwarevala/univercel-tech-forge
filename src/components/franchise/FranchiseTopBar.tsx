import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Menu, X, Bot, AlertTriangle, Wallet, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import GlobalNotificationHeader from '@/components/shared/GlobalNotificationHeader';
import type { NotificationAlert } from '@/components/shared/GlobalNotificationHeader';

interface FranchiseTopBarProps {
  onMobileMenuToggle: () => void;
  mobileMenuOpen: boolean;
  notifications?: NotificationAlert[];
  onDismissNotification?: (id: string) => void;
  onNotificationAction?: (id: string) => void;
}

export const FranchiseTopBar = ({ 
  onMobileMenuToggle, 
  mobileMenuOpen,
  notifications = [],
  onDismissNotification = () => {},
  onNotificationAction = () => {}
}: FranchiseTopBarProps) => {
  const [buzzerActive, setBuzzerActive] = useState(true);

  return (
    <header className="sticky top-0 z-30 bg-[hsl(220,55%,6%)]/80 backdrop-blur-xl border-b border-[hsl(200,80%,40%)]/20">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2 text-white"
          onClick={onMobileMenuToggle}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Title */}
        <div className="hidden lg:flex items-center gap-4">
          <h1 className="text-lg font-bold">
            <span className="text-[hsl(200,80%,60%)]">Franchise</span>
            <span className="text-white ml-1">Command Center</span>
          </h1>
          <Badge className="bg-[hsl(160,70%,45%)]/20 text-[hsl(160,70%,55%)] border-[hsl(160,70%,45%)]/30 animate-pulse">
            LIVE
          </Badge>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(220,20%,50%)]" />
            <Input
              placeholder="Search leads, resellers, demos..."
              className="pl-10 bg-[hsl(220,50%,12%)]/60 border-[hsl(200,80%,40%)]/20 text-white placeholder:text-[hsl(220,20%,45%)] focus:border-[hsl(200,80%,50%)]/40"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Buzzer Alert Indicator */}
          {buzzerActive && (
            <motion.div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(0,80%,50%)]/10 border border-[hsl(0,80%,50%)]/30"
              animate={{
                boxShadow: [
                  '0 0 5px hsla(0, 80%, 50%, 0.2)',
                  '0 0 15px hsla(0, 80%, 50%, 0.4)',
                  '0 0 5px hsla(0, 80%, 50%, 0.2)'
                ]
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <AlertTriangle className="w-4 h-4 text-[hsl(0,80%,60%)]" />
              <span className="text-xs text-[hsl(0,80%,60%)] font-medium">3 New Leads</span>
            </motion.div>
          )}

          {/* AI Help Button */}
          <motion.button
            className="relative p-2 rounded-lg bg-[hsl(200,80%,50%)]/10 border border-[hsl(200,80%,50%)]/30 text-[hsl(200,80%,60%)]"
            whileHover={{ scale: 1.05 }}
          >
            <Bot className="w-5 h-5" />
          </motion.button>

          {/* Wallet Quick View */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[hsl(220,50%,12%)]/60 border border-[hsl(200,80%,40%)]/20">
            <Wallet className="w-4 h-4 text-[hsl(45,90%,55%)]" />
            <span className="text-sm text-white font-medium">₹1.8L</span>
          </div>

          {/* Global Notification Header */}
          <GlobalNotificationHeader
            userRole="franchise"
            notifications={notifications}
            onDismiss={onDismissNotification}
            onAction={onNotificationAction}
          />

          {/* Avatar */}
          <div className="flex items-center gap-3 pl-3 border-l border-[hsl(200,80%,40%)]/20">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-white">vala(franchise)***</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[hsl(200,80%,50%)] to-[hsl(180,70%,45%)] flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

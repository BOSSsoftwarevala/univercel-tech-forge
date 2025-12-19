import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, Menu, X, Bot, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FranchiseTopBarProps {
  onMobileMenuToggle: () => void;
  mobileMenuOpen: boolean;
}

export const FranchiseTopBar = ({ onMobileMenuToggle, mobileMenuOpen }: FranchiseTopBarProps) => {
  const [buzzerActive, setBuzzerActive] = useState(true);

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-border/30">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={onMobileMenuToggle}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search leads, resellers, demos..."
              className="pl-10 bg-secondary/30 border-border/30"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Buzzer Alert Indicator */}
          {buzzerActive && (
            <motion.div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-red/10 border border-neon-red/30"
              animate={{
                boxShadow: [
                  '0 0 5px hsla(0, 100%, 50%, 0.2)',
                  '0 0 15px hsla(0, 100%, 50%, 0.4)',
                  '0 0 5px hsla(0, 100%, 50%, 0.2)'
                ]
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <AlertTriangle className="w-4 h-4 text-neon-red" />
              <span className="text-xs text-neon-red font-medium">3 New Leads</span>
            </motion.div>
          )}

          {/* AI Help Button */}
          <motion.button
            className="relative p-2 rounded-lg bg-primary/10 border border-primary/30 text-primary"
            animate={{
              boxShadow: [
                '0 0 10px hsla(187, 100%, 50%, 0.2)',
                '0 0 20px hsla(187, 100%, 50%, 0.4)',
                '0 0 10px hsla(187, 100%, 50%, 0.2)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            whileHover={{ scale: 1.05 }}
          >
            <Bot className="w-5 h-5" />
          </motion.button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-neon-red" />
          </button>

          {/* Avatar */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-neon-teal flex items-center justify-center text-background font-bold text-sm">
              FP
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-foreground">Franchise Partner</p>
              <p className="text-xs text-muted-foreground">Maharashtra Territory</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

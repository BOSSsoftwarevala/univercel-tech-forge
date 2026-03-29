/**
 * Security Disclaimer Component
 * Displays warnings about data sharing and platform rules
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Shield, MessageSquareWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SecurityDisclaimerProps {
  type: 'user' | 'management';
  dismissible?: boolean;
  className?: string;
}

const SecurityDisclaimer: React.FC<SecurityDisclaimerProps> = ({
  type,
  dismissible = true,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const userMessage = {
    title: "🔒 Your Data is Protected",
    content: "Never share personal contact details (phone, email, address) with anyone through chat. All official communications happen through secure platform channels. We are NOT responsible for any information you share outside official channels.",
    icon: Shield,
    color: "from-green-500/20 to-green-500/10",
    borderColor: "border-green-500/30"
  };

  const managementMessage = {
    title: "⚠️ Data Access Warning",
    content: "All data access is logged and monitored by AI surveillance. Only access user data when required for support. Unauthorized access or data export will result in immediate termination and legal action.",
    icon: MessageSquareWarning,
    color: "from-amber-500/20 to-amber-500/10",
    borderColor: "border-amber-500/30"
  };

  const message = type === 'user' ? userMessage : managementMessage;
  const Icon = message.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`relative overflow-hidden rounded-lg border ${message.borderColor} ${className}`}
      >
        <div className={`absolute inset-0 bg-gradient-to-r ${message.color}`} />
        
        <div className="relative p-3 flex items-start gap-3">
          <Icon className="w-5 h-5 mt-0.5 flex-shrink-0 text-foreground" />
          
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-foreground">{message.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{message.content}</p>
          </div>

          {dismissible && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 flex-shrink-0"
              onClick={() => setIsVisible(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SecurityDisclaimer;

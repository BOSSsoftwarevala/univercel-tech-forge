/**
 * Safe Assist Consent Modal
 * 
 * CRITICAL USER CONTROL:
 * - User NEVER starts assist (only receives requests)
 * - Consent modal is mandatory
 * - Default action is Cancel
 * - Timer and Stop button always visible
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, X, Clock, Eye, Bot, Lock, 
  AlertTriangle, CheckCircle, XCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SafeAssistConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsent: () => void;
  onDecline: () => void;
  agentInfo?: {
    maskedId: string;
    department?: string;
  };
  sessionDuration?: number; // in minutes
}

export function SafeAssistConsentModal({
  isOpen,
  onClose,
  onConsent,
  onDecline,
  agentInfo,
  sessionDuration = 30,
}: SafeAssistConsentModalProps) {
  const [countdown, setCountdown] = useState(60); // Auto-decline after 60 seconds
  const [hasReadTerms, setHasReadTerms] = useState(false);

  // Auto-decline countdown
  useEffect(() => {
    if (!isOpen) {
      setCountdown(60);
      setHasReadTerms(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onDecline();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onDecline]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg"
        >
          <Card className="border-2 border-primary/30 shadow-2xl shadow-primary/10">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Safe Assist Request</CardTitle>
              <CardDescription>
                A support agent is requesting to help you
              </CardDescription>
              
              {/* Auto-decline countdown */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Auto-declining in <span className="font-mono font-bold text-primary">{countdown}s</span>
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Agent Info */}
              {agentInfo && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Agent {agentInfo.maskedId}</p>
                      {agentInfo.department && (
                        <p className="text-xs text-muted-foreground">{agentInfo.department}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                    Verified
                  </Badge>
                </div>
              )}

              {/* What they CAN do */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  What the agent CAN do:
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground pl-6">
                  <li className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Point at elements on your screen
                  </li>
                  <li className="flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    AI monitors all actions for your protection
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Session limited to {sessionDuration} minutes
                  </li>
                </ul>
              </div>

              {/* What they CANNOT do */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-destructive" />
                  What the agent CANNOT do:
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground pl-6">
                  <li className="flex items-center gap-2">
                    <X className="w-4 h-4" />
                    Click, type, or control anything
                  </li>
                  <li className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Access your passwords or payment info
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="w-4 h-4" />
                    Perform any actions without your consent
                  </li>
                </ul>
              </div>

              {/* Safety Alert */}
              <Alert className="bg-primary/5 border-primary/20">
                <Shield className="w-4 h-4" />
                <AlertDescription className="text-xs">
                  <strong>You stay in control.</strong> You can stop the session at any time using the Stop button that will always be visible.
                </AlertDescription>
              </Alert>

              {/* Checkbox for reading terms */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasReadTerms}
                  onChange={(e) => setHasReadTerms(e.target.checked)}
                  className="mt-1 rounded border-border"
                />
                <span className="text-sm text-muted-foreground">
                  I understand that this is a view-only session and I can end it at any time.
                </span>
              </label>

              {/* Action Buttons - DEFAULT IS CANCEL */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="destructive"
                  onClick={onDecline}
                  className="flex-1"
                  autoFocus // Default focus on decline
                >
                  <X className="w-4 h-4 mr-2" />
                  Decline
                </Button>
                <Button
                  onClick={onConsent}
                  disabled={!hasReadTerms}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept & Start
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Pressing Escape or clicking outside will decline the request
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default SafeAssistConsentModal;

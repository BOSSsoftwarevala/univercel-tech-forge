/**
 * Terms & Rules Acceptance Modal
 * All roles must accept terms before accessing the platform
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle2, Lock, Eye, EyeOff, FileText, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TermsAcceptanceModalProps {
  isOpen: boolean;
  onAccept: () => void;
  role: string;
  userName?: string;
}

const roleSpecificRules: Record<string, string[]> = {
  user: [
    "Do NOT share personal contact information (phone, email, address) with anyone",
    "All communications must go through official platform channels only",
    "Report any suspicious activity immediately to support",
    "Do not attempt to bypass platform security measures",
    "Your data is masked from other users for your protection"
  ],
  prime_user: [
    "Premium features are for personal use only - no sharing credentials",
    "Priority support is available but abuse will result in suspension",
    "Do NOT share personal details with sellers or resellers",
    "All transactions must be completed through the platform",
    "Your identity is protected - keep it that way"
  ],
  client: [
    "Business information is confidential and protected",
    "Do not share login credentials with unauthorized personnel",
    "All support requests must go through official channels",
    "Payment disputes must be raised within 7 days",
    "Your data is isolated from other clients"
  ],
  reseller: [
    "You are responsible for your sub-clients' compliance",
    "Commission fraud will result in immediate termination",
    "Do NOT contact clients directly outside the platform",
    "All sales must be logged and tracked properly",
    "You cannot view other resellers' data - strict isolation enforced"
  ],
  franchise: [
    "Franchise territory boundaries must be respected",
    "Financial reporting must be accurate and timely",
    "Staff management is your responsibility",
    "Brand guidelines must be followed strictly",
    "No cross-territory solicitation allowed"
  ],
  influencer: [
    "Promotional content must be clearly marked as sponsored",
    "Click fraud will result in account termination and legal action",
    "Commission tracking is automated - no manual adjustments",
    "You cannot access other influencers' performance data",
    "Maintain professional conduct at all times"
  ],
  area_manager: [
    "Regional data is confidential and role-isolated",
    "Report discrepancies immediately to super admin",
    "Staff performance reviews must be fair and documented",
    "Do not share regional analytics with unauthorized parties",
    "Cross-region data access is prohibited"
  ],
  admin: [
    "Admin privileges come with accountability",
    "All actions are logged and monitored by AI",
    "Do not access data outside your scope",
    "Escalate security concerns immediately",
    "Maintain strict confidentiality"
  ],
  super_admin: [
    "Full audit trail of all your actions is maintained",
    "Critical changes require multi-factor approval",
    "User data access must be justified and logged",
    "Security breaches must be reported within 1 hour",
    "You are accountable for your team's actions"
  ],
  master_admin: [
    "You have elevated privileges - use responsibly",
    "All system changes are permanently logged",
    "Data export requires dual authorization",
    "Regular security audits will review your actions",
    "Violation of trust results in immediate removal"
  ]
};

const universalRules = [
  "🔒 All personal data is masked and protected by role isolation",
  "⚠️ We are NOT responsible for any personal information you choose to share outside official channels",
  "🛡️ AI surveillance monitors all activities for fraud and violations",
  "📋 Your acceptance of these terms is permanently recorded",
  "⚖️ Violations may result in account suspension, termination, or legal action",
  "🚫 Attempting to view, access, or collect other users' personal data is strictly prohibited",
  "💬 Never share personal phone numbers, emails, or addresses in chat"
];

const TermsAcceptanceModal: React.FC<TermsAcceptanceModalProps> = ({
  isOpen,
  onAccept,
  role,
  userName
}) => {
  const [accepted, setAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRules, setShowRules] = useState(true);
  const { toast } = useToast();

  const roleRules = roleSpecificRules[role] || roleSpecificRules.user;

  const handleAccept = async () => {
    if (!accepted) {
      toast({
        title: "Acceptance Required",
        description: "Please check the box to accept the terms and continue",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Generate device fingerprint
      const fingerprint = btoa(navigator.userAgent + screen.width + screen.height + new Date().getTimezoneOffset());

      // Store acceptance in audit logs since terms table may not exist yet
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          user_id: user.id,
          action: 'terms_accepted',
          module: 'security',
          meta_json: { 
            role, 
            terms_version: '1.0',
            device_fingerprint: fingerprint,
            accepted_at: new Date().toISOString()
          }
        });

      if (error) throw error;

      // Terms acceptance logged above

      toast({
        title: "Terms Accepted",
        description: "Welcome! Your acceptance has been recorded.",
      });

      onAccept();
    } catch (error: any) {
      console.error('Error accepting terms:', error);
      toast({
        title: "Synchronizing",
        description: "Your preferences are being synchronized. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-2xl bg-card border border-destructive/50 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-destructive/20 via-destructive/10 to-destructive/20 p-6 border-b border-destructive/30">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-destructive/20 rounded-full">
                <Shield className="w-8 h-8 text-destructive" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  ⚠️ MANDATORY TERMS & RULES
                </h2>
                <p className="text-sm text-muted-foreground">
                  Role: <span className="text-primary font-semibold uppercase">{role.replace('_', ' ')}</span>
                  {userName && <span> • Welcome, {userName}</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="h-[400px] p-6">
            {/* Universal Warning */}
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <h3 className="font-bold text-destructive">CRITICAL SECURITY NOTICE</h3>
              </div>
              <ul className="space-y-2">
                {universalRules.map((rule, index) => (
                  <li key={index} className="text-sm text-foreground/80 flex items-start gap-2">
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Role-Specific Rules */}
            <div className="mb-6 p-4 bg-primary/5 border border-primary/30 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-primary">
                    Rules for {role.replace('_', ' ').toUpperCase()}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRules(!showRules)}
                >
                  {showRules ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              
              <AnimatePresence>
                {showRules && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    {roleRules.map((rule, index) => (
                      <motion.li
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-sm text-foreground/80 flex items-start gap-2"
                      >
                        <span className="text-primary">•</span>
                        <span>{rule}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* Disclaimer Box */}
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Scale className="w-5 h-5 text-yellow-500" />
                <h3 className="font-bold text-yellow-500">DISCLAIMER</h3>
              </div>
              <p className="text-sm text-foreground/70">
                SoftwareVala.com and its affiliates are <strong>NOT responsible</strong> for any 
                personal information, contact details, or private data that you choose to share 
                with other users outside of official platform channels. By accepting these terms, 
                you acknowledge that you will follow platform rules and use official communication 
                channels only. Any violation may result in account termination.
              </p>
            </div>

            {/* Data Isolation Notice */}
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-green-500" />
                <h3 className="font-bold text-green-500">YOUR DATA IS PROTECTED</h3>
              </div>
              <p className="text-sm text-foreground/70">
                Your role is <strong>completely isolated</strong>. Other roles cannot see your 
                personal details. All sensitive information (email, phone, address) is 
                <strong> automatically masked</strong> based on role permissions. Only authorized 
                management staff can access full details when required for support.
              </p>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-6 border-t border-border bg-muted/30">
            <div className="flex items-start gap-3 mb-4">
              <Checkbox
                id="accept-terms"
                checked={accepted}
                onCheckedChange={(checked) => setAccepted(checked === true)}
                className="mt-1"
              />
              <label htmlFor="accept-terms" className="text-sm text-foreground cursor-pointer">
                I have read and understood all the terms, rules, and disclaimers above. 
                I agree to comply with all platform policies and understand that my acceptance 
                is permanently recorded with my profile.
              </label>
            </div>

            <Button
              onClick={handleAccept}
              disabled={!accepted || isSubmitting}
              className="w-full bg-gradient-to-r from-primary to-neon-purple hover:opacity-90"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    ⏳
                  </motion.span>
                  Recording Acceptance...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  I Accept - Continue to Dashboard
                </span>
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TermsAcceptanceModal;

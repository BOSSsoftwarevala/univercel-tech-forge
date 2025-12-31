/**
 * Prime User Dashboard - PREMIUM EXPERIENCE WITHOUT POWER
 * 
 * Features:
 * - Welcome + Prime badge
 * - Priority Demos
 * - Extended Demo Time
 * - Purchased Products
 * - Wallet (VIEW ONLY)
 * - Priority Support
 * - Safe Assist Status
 * 
 * Rules:
 * - Prime ≠ Admin
 * - More access, ZERO control
 * - All benefits must WORK
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, Play, Clock, Wallet, Headphones, Shield, 
  Star, Sparkles, Package, Eye, Timer, ChevronRight,
  MessageSquare, AlertCircle, CheckCircle, Lock, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { 
  usePrimeProfile, 
  usePrimeDemos, 
  usePrimeWallet, 
  usePrimeSupportTickets,
  usePrimeSLAPromises,
  usePrimeSafeAssist
} from '@/hooks/usePrimeRole';
import PrimeVIPBadge from './PrimeVIPBadge';
import SafeAssistConsentModal from '@/components/user/SafeAssistConsentModal';
import { supabase } from '@/integrations/supabase/client';

// Tier configuration for display
const TIER_DISPLAY = {
  silver: { label: 'Silver', color: 'text-slate-400', bg: 'bg-slate-500/20', sla: '24h' },
  gold: { label: 'Gold', color: 'text-amber-400', bg: 'bg-amber-500/20', sla: '12h' },
  platinum: { label: 'Platinum', color: 'text-cyan-400', bg: 'bg-cyan-500/20', sla: '4h' },
  enterprise: { label: 'Enterprise', color: 'text-purple-400', bg: 'bg-purple-500/20', sla: '1h' },
};

export function PrimeUserDashboard() {
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = usePrimeProfile();
  const { data: demos, isLoading: demosLoading } = usePrimeDemos();
  const { balance, transactions, balanceLoading } = usePrimeWallet();
  const { tickets, createPriorityTicket, slaHours } = usePrimeSupportTickets();
  const { data: promises } = usePrimeSLAPromises();
  const { hasActiveSession, pendingConsent, giveConsent, declineConsent, endSession } = usePrimeSafeAssist();

  const [showSupportDialog, setShowSupportDialog] = useState(false);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportDescription, setSupportDescription] = useState('');
  const [showConsentModal, setShowConsentModal] = useState(pendingConsent);

  const tier = profile?.tier || 'silver';
  const tierInfo = TIER_DISPLAY[tier];

  // Handle priority demo launch
  const handleLaunchDemo = (demo: { id: string; title: string; url: string }) => {
    toast.success(`Launching: ${demo.title}`);
    // Navigate to demo with extended time
    navigate(`/demo/${demo.id}`);
  };

  // Handle priority support submission
  const handleSubmitSupport = async () => {
    if (!supportSubject.trim() || !supportDescription.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    createPriorityTicket.mutate({
      subject: supportSubject,
      description: supportDescription,
    });

    setSupportSubject('');
    setSupportDescription('');
    setShowSupportDialog(false);
  };

  // Handle logout with session cleanup
  const handleLogout = async () => {
    // End Safe Assist if active
    if (hasActiveSession) {
      await endSession();
    }
    
    await supabase.auth.signOut();
    navigate('/auth', { replace: true });
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Crown className="w-12 h-12 text-amber-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Prime Badge */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <PrimeVIPBadge 
              size="md" 
              tier={tier === 'enterprise' ? 'lifetime' : tier === 'platinum' ? 'yearly' : 'monthly'} 
            />
            <div>
              <h1 className="font-mono text-lg font-bold">Prime Dashboard</h1>
              <p className="text-xs text-muted-foreground">Premium Experience</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Safe Assist Status */}
            {hasActiveSession && (
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50 gap-1">
                <Shield className="w-3 h-3" />
                Assist Active
              </Badge>
            )}
            
            {/* Tier Badge */}
            <Badge className={cn('font-mono', tierInfo.bg, tierInfo.color)}>
              {tierInfo.label}
            </Badge>
            
            {/* SLA Badge */}
            <Badge variant="outline" className="font-mono text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {tierInfo.sla} SLA
            </Badge>

            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1 text-muted-foreground">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <Crown className="w-8 h-8 text-stone-900" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-mono">
                  Welcome, Prime Member
                  <Sparkles className="inline-block w-5 h-5 text-amber-400 ml-2" />
                </h2>
                <p className="text-muted-foreground">
                  Enjoy your premium benefits • {tierInfo.label} Tier
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex gap-4">
              {[
                { label: 'Priority Demos', value: demos?.filter(d => d.is_priority).length || 0, icon: Play },
                { label: 'Active Promises', value: promises?.filter(p => p.display_status === 'Active').length || 0, icon: Shield },
                { label: 'Support Tickets', value: tickets?.length || 0, icon: Headphones },
              ].map((stat) => (
                <div key={stat.label} className="text-center px-4">
                  <stat.icon className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                  <div className="text-2xl font-bold font-mono">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Priority Demos - Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="glass-panel border-border/50 h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-mono">
                  <Play className="w-5 h-5 text-primary" />
                  Priority Demos
                  <Badge className="ml-2 bg-amber-500/20 text-amber-400 text-xs">
                    Extended Time
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Priority demos load first • Extended duration applied
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="priority" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="priority">Priority</TabsTrigger>
                    <TabsTrigger value="early">Early Access</TabsTrigger>
                    <TabsTrigger value="all">All Demos</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="priority">
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {demos?.filter(d => d.is_priority).map((demo) => (
                          <DemoCard 
                            key={demo.id} 
                            demo={demo} 
                            onLaunch={handleLaunchDemo}
                            isPriority 
                          />
                        ))}
                        {(!demos || demos.filter(d => d.is_priority).length === 0) && (
                          <EmptyState message="No priority demos available" />
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="early">
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {demos?.filter(d => d.is_early_access).map((demo) => (
                          <DemoCard 
                            key={demo.id} 
                            demo={demo} 
                            onLaunch={handleLaunchDemo}
                            isEarlyAccess 
                          />
                        ))}
                        {(!demos || demos.filter(d => d.is_early_access).length === 0) && (
                          <EmptyState message="No early access demos available" />
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="all">
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {demos?.map((demo) => (
                          <DemoCard 
                            key={demo.id} 
                            demo={demo} 
                            onLaunch={handleLaunchDemo}
                          />
                        ))}
                        {(!demos || demos.length === 0) && (
                          <EmptyState message="No demos available" />
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Wallet & Support */}
          <div className="space-y-6">
            {/* Wallet - VIEW ONLY */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-panel border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between font-mono text-base">
                    <span className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-primary" />
                      Wallet
                    </span>
                    <Badge variant="outline" className="text-xs font-mono">
                      <Eye className="w-3 h-3 mr-1" />
                      View Only
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 mb-4">
                    <div className="text-3xl font-bold font-mono text-amber-400">
                      ${balance.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">Available Balance</div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground font-mono mb-2">Recent Activity</div>
                  <ScrollArea className="h-[120px]">
                    <div className="space-y-2">
                      {transactions.slice(0, 5).map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between text-xs p-2 rounded bg-background/30">
                          <span className="text-muted-foreground truncate max-w-[120px]">
                            {tx.description || tx.transaction_type}
                          </span>
                          <span className={tx.transaction_type === 'credit' || tx.transaction_type === 'bonus' 
                            ? 'text-emerald-400' 
                            : 'text-muted-foreground'
                          }>
                            {tx.transaction_type === 'credit' || tx.transaction_type === 'bonus' ? '+' : '-'}
                            ${Math.abs(tx.amount).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      {transactions.length === 0 && (
                        <div className="text-center text-muted-foreground text-xs py-4">
                          No transactions yet
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  
                  {/* No withdraw/edit buttons - VIEW ONLY */}
                  <div className="mt-4 p-2 rounded-lg bg-muted/30 text-center">
                    <Lock className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                    <p className="text-xs text-muted-foreground">
                      Wallet is view-only
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Priority Support */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass-panel border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 font-mono text-base">
                    <Headphones className="w-4 h-4 text-primary" />
                    Priority Support
                    <Badge className="bg-amber-500/20 text-amber-400 text-xs ml-1">
                      {slaHours}h SLA
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => setShowSupportDialog(true)}
                    className="w-full gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-900 font-medium"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Contact Priority Support
                  </Button>
                  
                  {tickets && tickets.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground font-mono">Recent Tickets</div>
                      {tickets.slice(0, 3).map((ticket: any) => (
                        <div key={ticket.id} className="p-2 rounded bg-background/30 flex items-center justify-between">
                          <span className="text-xs truncate max-w-[150px]">{ticket.subject}</span>
                          <Badge variant="outline" className="text-xs">
                            {ticket.status || 'Open'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* SLA Promises - Read Only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-panel border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-mono">
                <Shield className="w-5 h-5 text-primary" />
                SLA Promises
                <Badge variant="outline" className="text-xs ml-2">
                  <Eye className="w-3 h-3 mr-1" />
                  Read Only
                </Badge>
              </CardTitle>
              <CardDescription>
                Your priority SLA commitments • Faster response times
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {promises?.slice(0, 6).map((promise) => (
                  <div 
                    key={promise.id}
                    className={cn(
                      'p-3 rounded-lg border',
                      promise.display_status === 'Active' && 'bg-primary/5 border-primary/30',
                      promise.display_status === 'Fulfilled' && 'bg-emerald-500/5 border-emerald-500/30',
                      promise.display_status === 'Overdue' && 'bg-destructive/5 border-destructive/30',
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-muted-foreground">
                        {promise.promise_type}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          'text-xs',
                          promise.display_status === 'Active' && 'text-primary border-primary/50',
                          promise.display_status === 'Fulfilled' && 'text-emerald-400 border-emerald-500/50',
                          promise.display_status === 'Overdue' && 'text-destructive border-destructive/50',
                        )}
                      >
                        {promise.display_status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Timer className="w-3 h-3" />
                      <span>{promise.sla_hours}h SLA</span>
                    </div>
                  </div>
                ))}
                {(!promises || promises.length === 0) && (
                  <div className="col-span-full text-center text-muted-foreground py-8">
                    <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No SLA promises yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Safe Assist Status */}
        {(hasActiveSession || pendingConsent) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className={cn(
              'glass-panel border-2',
              hasActiveSession ? 'border-emerald-500/50' : 'border-amber-500/50'
            )}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className={cn(
                      'w-6 h-6',
                      hasActiveSession ? 'text-emerald-400' : 'text-amber-400'
                    )} />
                    <div>
                      <div className="font-mono font-medium">
                        {hasActiveSession ? 'Safe Assist Active' : 'Safe Assist Pending'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {hasActiveSession 
                          ? 'A support agent is assisting you' 
                          : 'A support agent is requesting access'
                        }
                      </div>
                    </div>
                  </div>
                  
                  {hasActiveSession ? (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => endSession()}
                    >
                      Stop Session
                    </Button>
                  ) : pendingConsent ? (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => declineConsent()}
                      >
                        Decline
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => giveConsent()}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Allow Access
                      </Button>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>

      {/* Priority Support Dialog */}
      <Dialog open={showSupportDialog} onOpenChange={setShowSupportDialog}>
        <DialogContent className="glass-panel border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-mono">
              <Headphones className="w-5 h-5 text-amber-400" />
              Priority Support Ticket
            </DialogTitle>
            <DialogDescription>
              As a Prime member, your ticket will be marked as high priority with {slaHours}h SLA.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Input
                placeholder="What do you need help with?"
                value={supportSubject}
                onChange={(e) => setSupportSubject(e.target.value)}
                className="bg-background/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                placeholder="Describe your issue in detail..."
                value={supportDescription}
                onChange={(e) => setSupportDescription(e.target.value)}
                className="bg-background/50 min-h-[120px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSupportDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitSupport}
              disabled={createPriorityTicket.isPending}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-900"
            >
              Submit Priority Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Safe Assist Consent Modal */}
      {pendingConsent && (
        <SafeAssistConsentModal
          isOpen={showConsentModal}
          onClose={() => setShowConsentModal(false)}
          onConsent={async () => {
            await giveConsent();
            setShowConsentModal(false);
          }}
          onDecline={async () => {
            await declineConsent();
            setShowConsentModal(false);
          }}
          agentInfo={{ maskedId: 'SA-****' }}
          sessionDuration={30}
        />
      )}

      {/* Footer Notice */}
      <footer className="container mx-auto px-4 py-4 text-center text-xs text-muted-foreground">
        <Lock className="w-3 h-3 inline-block mr-1" />
        Prime pays for EXPERIENCE, not power • No admin access
      </footer>
    </div>
  );
}

// Demo Card Component
function DemoCard({ 
  demo, 
  onLaunch, 
  isPriority = false,
  isEarlyAccess = false
}: { 
  demo: { id: string; title: string; url: string; category: string; extended_duration_minutes: number };
  onLaunch: (demo: { id: string; title: string; url: string }) => void;
  isPriority?: boolean;
  isEarlyAccess?: boolean;
}) {
  return (
    <div className="p-3 rounded-lg bg-background/30 border border-border/30 hover:border-primary/30 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            isPriority ? 'bg-amber-500/20' : isEarlyAccess ? 'bg-purple-500/20' : 'bg-primary/10'
          )}>
            <Play className={cn(
              'w-5 h-5',
              isPriority ? 'text-amber-400' : isEarlyAccess ? 'text-purple-400' : 'text-primary'
            )} />
          </div>
          <div>
            <div className="font-medium text-sm flex items-center gap-2">
              {demo.title}
              {isPriority && <Star className="w-3 h-3 text-amber-400" />}
              {isEarlyAccess && <Sparkles className="w-3 h-3 text-purple-400" />}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <span>{demo.category}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Timer className="w-3 h-3" />
                {demo.extended_duration_minutes}min
              </span>
            </div>
          </div>
        </div>
        
        <Button 
          size="sm" 
          onClick={() => onLaunch(demo)}
          className={cn(
            'gap-1',
            isPriority && 'bg-amber-500 hover:bg-amber-600 text-stone-900'
          )}
        >
          {isPriority ? 'Launch Priority' : 'View Demo'}
          <ChevronRight className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export default PrimeUserDashboard;

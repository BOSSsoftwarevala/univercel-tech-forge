import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, ChevronRight, ChevronLeft, Check, Star,
  User, Building2, Target, Shield, Wallet, Bell,
  MessageSquare, Settings, Sparkles, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  component: React.ReactNode;
}

interface OnboardingWizardProps {
  userRole?: string;
  onComplete?: () => void;
  onSkip?: () => void;
}

export function OnboardingWizard({ userRole = 'developer', onComplete, onSkip }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [formData, setFormData] = useState({
    displayName: '',
    timezone: 'Asia/Kolkata',
    notifications: true,
    darkMode: true,
    language: 'en',
  });

  const steps: WizardStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Software Vala',
      description: 'Let\'s get you set up in just a few steps',
      icon: Rocket,
      component: (
        <div className="text-center py-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center"
          >
            <Rocket className="w-12 h-12 text-primary-foreground" />
          </motion.div>
          <h2 className="text-2xl font-mono font-bold text-foreground mb-2">
            Welcome, {userRole.replace('_', ' ')}! 🎉
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            You're about to experience the most advanced enterprise SaaS ecosystem. 
            Let's personalize your dashboard for maximum productivity.
          </p>
        </div>
      ),
    },
    {
      id: 'profile',
      title: 'Your Profile',
      description: 'Set up your identity',
      icon: User,
      component: (
        <div className="space-y-6 py-6">
          <div>
            <label className="text-sm text-muted-foreground block mb-2">Display Name</label>
            <Input
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              placeholder="Enter your name"
              className="text-lg"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This will be shown as a masked ID to other users
            </p>
          </div>
          
          <div>
            <label className="text-sm text-muted-foreground block mb-2">Your Role</label>
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground capitalize">
                    {userRole.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Assigned by your organization
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Customize your experience',
      icon: Settings,
      component: (
        <div className="space-y-4 py-6">
          {[
            { key: 'darkMode', label: 'Dark Mode', description: 'Use dark theme for the interface', icon: Sparkles },
            { key: 'notifications', label: 'Push Notifications', description: 'Get alerts for important updates', icon: Bell },
          ].map((pref) => {
            const Icon = pref.icon;
            const isEnabled = formData[pref.key as keyof typeof formData];
            
            return (
              <div
                key={pref.key}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isEnabled 
                    ? 'border-primary/50 bg-primary/5' 
                    : 'border-border/30 bg-background/30'
                }`}
                onClick={() => setFormData({ ...formData, [pref.key]: !isEnabled })}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isEnabled ? 'bg-primary/20' : 'bg-background/50'
                    }`}>
                      <Icon className={`w-5 h-5 ${isEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{pref.label}</p>
                      <p className="text-sm text-muted-foreground">{pref.description}</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isEnabled ? 'border-primary bg-primary' : 'border-muted-foreground'
                  }`}>
                    {isEnabled && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ),
    },
    {
      id: 'features',
      title: 'Key Features',
      description: 'Explore what you can do',
      icon: Star,
      component: (
        <div className="py-6">
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Target, label: 'Smart Dashboard', desc: 'AI-powered insights' },
              { icon: MessageSquare, label: 'Masked Chat', desc: 'Secure communication' },
              { icon: Wallet, label: 'Wallet System', desc: 'Real-time earnings' },
              { icon: Bell, label: 'Live Buzzer', desc: 'Instant alerts' },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-background/30 border border-border/30 text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-medium text-foreground">{feature.label}</p>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      ),
    },
    {
      id: 'complete',
      title: 'You\'re Ready!',
      description: 'Start exploring',
      icon: Check,
      component: (
        <div className="text-center py-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center"
          >
            <Check className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-2xl font-mono font-bold text-foreground mb-2">
            Setup Complete! 🚀
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Your personalized dashboard is ready. Explore the powerful features 
            of Software Vala and boost your productivity.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Pro tip: Use voice commands by pressing the mic button</span>
          </div>
        </div>
      ),
    },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    toast({
      title: "Onboarding Complete",
      description: "Welcome to Software Vala! Your dashboard is ready.",
    });
    onComplete?.();
  };

  const handleSkip = () => {
    setIsVisible(false);
    onSkip?.();
  };

  if (!isVisible) return null;

  const CurrentIcon = steps[currentStep].icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel max-w-xl w-full mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-border/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <CurrentIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">{steps[currentStep].title}</h3>
              <p className="text-xs text-muted-foreground">{steps[currentStep].description}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleSkip}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress */}
        <div className="px-4 pt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 py-4">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div
                key={step.id}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  index < currentStep
                    ? 'bg-primary text-primary-foreground'
                    : index === currentStep
                    ? 'bg-primary/20 text-primary border-2 border-primary'
                    : 'bg-background/50 text-muted-foreground border border-border/30'
                }`}
              >
                {index < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <StepIcon className="w-4 h-4" />
                )}
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div className="px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {steps[currentStep].component}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/30 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            {currentStep < steps.length - 1 && (
              <Button variant="ghost" onClick={handleSkip}>
                Skip Setup
              </Button>
            )}
            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? (
                <>
                  Get Started
                  <Sparkles className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default OnboardingWizard;

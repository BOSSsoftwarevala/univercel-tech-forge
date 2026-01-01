import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, LogOut, Eye, CheckCircle, Sparkles, Coffee, Users, Rocket, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

const waitingMessages = [
  {
    title: "Your seat is being prepared! 🎯",
    subtitle: "Great things are worth the wait",
    funFact: "While you wait, 847 users are currently exploring our demos!"
  },
  {
    title: "Almost there, superstar! ⭐",
    subtitle: "Our team is reviewing your application",
    funFact: "Fun fact: Our approval team loves seeing new talent join!"
  },
  {
    title: "VIP access loading... 🚀",
    subtitle: "Your exclusive pass is being processed",
    funFact: "Tip: Explore our public demos to get a head start!"
  },
  {
    title: "Good things take time! ✨",
    subtitle: "Quality matters, and so do you",
    funFact: "Did you know? Most applications are approved within 24 hours!"
  }
];

const PendingApproval = () => {
  const navigate = useNavigate();
  const { user, signOut, userRole, approvalStatus, refreshApprovalStatus } = useAuth();
  const [message] = useState(() => waitingMessages[Math.floor(Math.random() * waitingMessages.length)]);
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth', { replace: true });
    }
    if (approvalStatus === 'approved') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, approvalStatus, navigate]);

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Auto-refresh approval status every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshApprovalStatus?.();
    }, 30000);
    return () => clearInterval(interval);
  }, [refreshApprovalStatus]);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth', { replace: true });
  };

  if (approvalStatus === 'approved') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-green-500/10 p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-foreground"
          >
            🎉 Welcome to the Team!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground mt-2"
          >
            Your account is approved! Redirecting to your dashboard...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-amber-500/5 p-4 overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl"
        />
      </div>

      {/* Floating Elements */}
      {[Star, Heart, Sparkles, Rocket, Coffee].map((Icon, i) => (
        <motion.div
          key={i}
          animate={{ 
            opacity: [0.2, 0.5, 0.2],
            y: [-15, 15, -15],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 4,
            delay: i * 0.5,
            repeat: Infinity,
          }}
          className="absolute"
          style={{ 
            top: `${15 + Math.random() * 70}%`, 
            left: `${10 + Math.random() * 80}%` 
          }}
        >
          <Icon className="w-5 h-5 text-primary/20" />
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-amber-500/30 bg-card/80 backdrop-blur-xl overflow-hidden">
          {/* Animated Top Bar */}
          <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 bg-[length:200%_100%] animate-pulse" />
          
          <CardHeader className="text-center pt-8">
            <motion.div
              className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-4 relative"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-amber-500/30 border-t-amber-500 rounded-full"
              />
              <Clock className="w-10 h-10 text-amber-500" />
            </motion.div>
            <CardTitle className="text-2xl font-bold">{message.title}</CardTitle>
            <CardDescription className="text-base">
              {message.subtitle}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pb-8">
            {/* Role Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-muted/50 rounded-xl p-4 text-center"
            >
              <p className="text-sm text-muted-foreground mb-2">Role Requested:</p>
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 px-4 py-1 text-sm">
                {userRole?.replace(/_/g, ' ').toUpperCase() || 'PENDING'}
              </Badge>
              <p className="text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1">
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 bg-amber-500 rounded-full"
                />
                Reviewing your application{dots}
              </p>
            </motion.div>

            {/* Fun Fact / Queue Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-xl p-4 border border-teal-500/20"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-teal-400">Did you know?</p>
                  <p className="text-xs text-muted-foreground">{message.funFact}</p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <Button variant="default" className="w-full gap-2" onClick={() => navigate('/demos/public')}>
                <Eye className="w-4 h-4" />
                Explore Public Demos
              </Button>

              <Button variant="secondary" className="w-full gap-2" onClick={() => navigate('/demos')}>
                <Sparkles className="w-4 h-4" />
                Browse Features
              </Button>
            </div>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <Button variant="ghost" className="w-full gap-2 text-muted-foreground" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* Motivational Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6 space-y-2"
        >
          <p className="text-xs text-muted-foreground/60">
            You're #{Math.floor(Math.random() * 10) + 1} in the queue • Estimated wait: &lt; 24 hours
          </p>
          <p className="text-xs text-primary/60">
            We appreciate your patience! Great things are coming your way. 💜
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PendingApproval;
